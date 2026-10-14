import { useMemo, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";

import { colors, spacing, typography } from "@/constants/theme";
import { formatNaira } from "@/utils/format";

import {
  getPayments,
  PAYOUT,
  SUMMARY,
  STATUS_LABEL,
  type PaymentStatus,
} from "@/services/payment.service";

const FILTERS: {
  label: string;
  value: PaymentStatus | "all";
}[] = [
  { label: "All", value: "all" },
  { label: "Awaiting completion", value: "awaiting_completion" },
  { label: "Funds secured", value: "funds_secured" },
  { label: "Processing", value: "processing" },
  { label: "Paid", value: "paid" },
];

export default function PaymentsScreen() {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<PaymentStatus | "all">("all");

  const payments = getPayments();

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !query ||
        payment.facility.toLowerCase().includes(query) ||
        payment.title.toLowerCase().includes(query) ||
        payment.code.toLowerCase().includes(query);

      const matchesStatus =
        activeFilter === "all" ||
        payment.status === activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, activeFilter]);

  const statusColor = (status: PaymentStatus) => {
    if (status === "funds_secured" || status === "paid") {
      return colors.success;
    }

    return colors.textSecondary;
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle
        title="Payments"
        subtitle="See what you’ve earned and where each payment stands."
      />

      {payments.length === 0 ? (
        <Card>
          <Text style={styles.cardTitle}>
            Your first payment starts with a shift
          </Text>

          <Text style={styles.body}>
            After you finish a shift and the facility confirms
            completion, you’ll see your payment here.
          </Text>

          <PrimaryButton
            title="Find a shift"
            onPress={() => router.push("/(tabs)/shifts")}
          />
        </Card>
      ) : (
        <>
          <View style={styles.summaryList}>
            <Card>
              <Text style={styles.muted}>Pending</Text>
              <Text style={styles.amount}>
                {formatNaira(SUMMARY.pending.amount)}
              </Text>
              <Text style={styles.body}>
                {SUMMARY.pending.note}
              </Text>
            </Card>

            <Card>
              <Text style={styles.muted}>Processing</Text>
              <Text style={styles.amount}>
                {formatNaira(SUMMARY.processing.amount)}
              </Text>
              <Text style={styles.body}>
                {SUMMARY.processing.note}
              </Text>
            </Card>

            <Card>
              <Text style={styles.muted}>Received</Text>
              <Text style={styles.amount}>
                {formatNaira(SUMMARY.received.amount)}
              </Text>
              <Text style={styles.body}>
                {SUMMARY.received.note}
              </Text>
            </Card>
          </View>

          <Card>
            <Text style={styles.cardTitle}>
              Your payout account
            </Text>

            <Text style={styles.body}>
              {PAYOUT.name} · {PAYOUT.bank} · •••• {PAYOUT.last4}
            </Text>

            <View style={styles.buttonSpacing}>
              <SecondaryButton
                title="Manage bank details"
                onPress={() => router.push("/bank-details")}
              />
            </View>
          </Card>

          <Card>
            <Text style={styles.cardTitle}>Payment history</Text>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search facility or shift"
              placeholderTextColor={colors.textSecondary}
              style={styles.searchInput}
              autoCapitalize="none"
              accessibilityLabel="Search facility or shift"
            />

            <View style={styles.filterList}>
              {FILTERS.map((filter) => {
                const selected = activeFilter === filter.value;

                return (
                  <Pressable
                    key={filter.value}
                    onPress={() =>
                      setActiveFilter(
                        selected && filter.value !== "all"
                          ? "all"
                          : filter.value
                      )
                    }
                    style={[
                      styles.filterChip,
                      selected && styles.selectedChip,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.filterText,
                        selected && styles.selectedFilterText,
                      ]}
                    >
                      {selected && filter.value !== "all"
                        ? `${filter.label} · Clear`
                        : filter.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {filteredPayments.length === 0 ? (
              <Text style={styles.emptySearch}>
                No payments match your search.
              </Text>
            ) : (
              filteredPayments.map((payment, index) => (
                <Pressable
                  key={payment.id}
                  onPress={() =>
                    router.push({
                      pathname: "/payment-details",
                      params: { id: payment.id },
                    })
                  }
                  style={[
                    styles.paymentRow,
                    index > 0 && styles.rowDivider,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${payment.title}, ${payment.facility}, ${formatNaira(payment.amount)}, ${STATUS_LABEL[payment.status]}`}
                >
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>
                      {payment.title}
                    </Text>

                    <Text style={styles.muted}>
                      {payment.facility} · {payment.dateLabel}
                    </Text>

                    <Text style={styles.muted}>
                      {payment.code}
                    </Text>

                    <Text
                      style={[
                        styles.status,
                        { color: statusColor(payment.status) },
                      ]}
                    >
                      {STATUS_LABEL[payment.status]}
                    </Text>
                  </View>

                  <Text style={styles.paymentAmount}>
                    {formatNaira(payment.amount)}
                  </Text>
                </Pressable>
              ))
            )}
          </Card>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  summaryList: {
    gap: spacing.sm,
  },
  cardTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  amount: {
    ...typography.h2,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  body: {
    ...typography.bodySmall,
    color: colors.text,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  buttonSpacing: {
    marginTop: spacing.md,
  },
  searchInput: {
    ...typography.bodySmall,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.sm,
  },
  filterList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
    marginVertical: spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 20,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  selectedChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.text,
  },
  selectedFilterText: {
    color: colors.white,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  rowDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  paymentInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  paymentTitle: {
    ...typography.label,
    color: colors.text,
  },
  paymentAmount: {
    ...typography.label,
    color: colors.text,
  },
  status: {
    ...typography.bodySmall,
    fontWeight: "600",
  },
  emptySearch: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    paddingVertical: spacing.md,
  },
});
