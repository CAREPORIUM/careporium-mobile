import { Text, StyleSheet, ScrollView, View, RefreshControl } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { useFacilityShifts } from "@/hooks/useFacilityShifts";
import { getShiftPayments, getSummary, STATUS_LABEL } from "@/services/facility-payment.service";
import { formatNaira } from "@/utils/format";
import { colors, spacing, typography } from "@/constants/theme";

export default function FacilityPaymentsScreen() {
  const { loading, loaded, error, reload } = useFacilityShifts();
  const items = getShiftPayments();
  const summary = getSummary();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading && loaded} onRefresh={reload} />}>
      <ScreenTitle title="Payments" subtitle="Fund your shifts and keep track of worker payments." />

      <SummaryCard label="Awaiting funding" amount={summary.awaiting.amount} note={summary.awaiting.note} />
      <SummaryCard label="Funds secured" amount={summary.secured.amount} note={summary.secured.note} />
      <SummaryCard label="Paid this month" amount={summary.paid.amount} note={summary.paid.note} />

      <StatusBanner
        style={styles.gap}
        title="Keep your shifts ready for workers"
        text="Fund the full shift amount before workers start. Payment is released after you confirm the shift is complete."
      />

      <Card style={styles.gap}>
        <Text style={styles.cardTitle}>Shift payments</Text>
        {error ? <Text style={[styles.body, { color: colors.error }]}>{error}</Text> : null}
        {loaded && !error && items.length === 0 ? <Text style={styles.body}>No shifts yet.</Text> : null}
        {items.map((p) => (
          <View key={p.id} style={styles.row}>
            <Text style={styles.rowTitle}>{p.title}</Text>
            <Text style={styles.body}>
              {p.dateLabel} · {p.workers} {p.workers === 1 ? "worker" : "workers"} · {p.code}
            </Text>
            <Text style={styles.amount}>{formatNaira(p.amount)}</Text>
            <Text style={[styles.status, p.status !== "awaiting_funding" && { color: colors.success }]}>{STATUS_LABEL[p.status]}</Text>

            {p.status === "awaiting_funding" && (
              <PrimaryButton title="Fund this shift" onPress={() => router.push({ pathname: "/facility/fund-shift", params: { id: p.id } })} style={styles.gapSmall} />
            )}
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function SummaryCard({ label, amount, note }: { label: string; amount: number; note: string }) {
  return (
    <Card>
      <Text style={styles.body}>{label}</Text>
      <Text style={styles.big}>{formatNaira(amount)}</Text>
      <Text style={styles.body}>{note}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  big: { ...typography.h2, color: colors.text, marginTop: spacing.sm },
  row: { borderBottomWidth: 1, borderBottomColor: colors.borderLight, paddingVertical: spacing.md },
  rowTitle: { ...typography.label, color: colors.text, fontWeight: "700", marginTop: spacing.sm },
  amount: { ...typography.h3, color: colors.text, marginTop: spacing.sm },
  status: { ...typography.label, color: colors.textSecondary, marginTop: spacing.xs },
});
