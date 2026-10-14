import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import ScreenTitle from "@/components/ui/ScreenTitle";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

import { colors, spacing, typography } from "@/constants/theme";
import { formatNaira } from "@/utils/format";
import {
  getPayment,
  PAYOUT,
} from "@/services/payment.service";

export default function PaymentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const payment = getPayment(id ?? "");

  const goToPayments = () => {
    router.replace("/(tabs)/payments");
  };

  if (!payment) {
    return (
      <ScrollView
        style={styles.screen}
        contentContainerStyle={styles.content}
      >
        <ScreenTitle
          title="Payment details"
          subtitle="View your shift payment"
          onBack={goToPayments}
        />

        <Card>
          <Text style={styles.heading}>Payment not found</Text>
          <Text style={styles.muted}>
            We couldn't find this payment. Return to your payment
            history and select a transaction.
          </Text>

          <PrimaryButton
            title="Back to payments"
            onPress={goToPayments}
          />
        </Card>
      </ScrollView>
    );
  }

  const isWaiting = payment.status === "awaiting_completion";
  const isSecured = payment.status === "funds_secured";
  const isProcessing = payment.status === "processing";
  const isPaid = payment.status === "paid";

  const title = isPaid
    ? "Payment receipt"
    : isProcessing
      ? "Payment processing"
      : "Payment details";

  const bannerTitle = isWaiting
    ? "Waiting for the facility to complete your shift"
    : isSecured
      ? "Your funds are secured"
      : isProcessing
        ? "Your payment is on its way"
        : "Payment received";

  const bannerText = isWaiting
    ? `Your attendance is complete. We'll start your payment once ${payment.facility} confirms the shift is complete.`
    : isSecured
      ? "The facility has funded this shift. Payment starts once they confirm it's complete."
      : isProcessing
        ? `The facility has completed the shift. We're processing your ${formatNaira(payment.amount)} payout. We'll notify you when it reaches your bank.`
        : `${formatNaira(payment.amount - payment.deductions)} was paid to your bank account.`;

  const completedSteps = isWaiting || isSecured ? 2 : 4;

  const progressSteps = [
    "Facility funded the shift",
    "Your attendance was recorded",
    "Facility confirms completion",
    "Payment sent to your bank",
  ];

  const progressCount = isProcessing || isPaid ? 4 : completedSteps;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle
        title={title}
        subtitle="Your shift payment information"
        onBack={goToPayments}
      />

      <StatusBanner
        kind={isPaid ? "success" : "info"}
        title={bannerTitle}
        text={bannerText}
      />

      {/* Payment information for awaiting and secured payments */}
      {(isWaiting || isSecured) && (
        <>
          <Card>
            <Text style={styles.muted}>You receive</Text>
            <Text style={styles.amount}>
              {formatNaira(payment.amount - payment.deductions)}
            </Text>

            <Text style={styles.paymentTitle}>
              {payment.title}
            </Text>

            <Text style={styles.muted}>
              {payment.facility} · {payment.location}
            </Text>

            <Text style={styles.detailText}>
              {payment.dateLabel} · {payment.timeLabel}
            </Text>

            <Text style={styles.detailText}>
              Shift {payment.code}
            </Text>

            <View style={styles.divider} />

            <InfoRow
              label="Shift pay"
              value={formatNaira(payment.amount)}
            />

            <InfoRow
              label="Deductions"
              value={formatNaira(payment.deductions)}
            />

            <InfoRow
              label="You receive"
              value={formatNaira(
                payment.amount - payment.deductions
              )}
              emphasized
            />
          </Card>

          <Card>
            <Text style={styles.heading}>Payment progress</Text>

            {progressSteps.map((step, index) => {
              const isComplete = index < progressCount;

              return (
                <View key={step} style={styles.progressRow}>
                  <Ionicons
                    name={
                      isComplete
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={23}
                    color={
                      isComplete
                        ? colors.success
                        : colors.textSecondary
                    }
                  />

                  <Text
                    style={[
                      styles.progressText,
                      isComplete && styles.progressComplete,
                    ]}
                  >
                    {step}
                  </Text>
                </View>
              );
            })}
          </Card>

          <SecondaryButton
            title="Report a payment issue"
            onPress={() =>
              router.push({
                pathname: "/payment-support",
                params: { id: payment.id },
              })
            }
          />
        </>
      )}

      {/* Processing payment */}
      {isProcessing && (
        <Card>
          <Text style={styles.muted}>Payment amount</Text>
          <Text style={styles.amount}>
            {formatNaira(payment.amount - payment.deductions)}
          </Text>

          <Text style={styles.paymentTitle}>
            {payment.facility} · Registered nurse
          </Text>

          <Text style={styles.detailText}>
            Shift {payment.code} · {payment.dateLabel}
          </Text>

          <View style={styles.divider} />

          <InfoRow
            label="Amount"
            value={formatNaira(
              payment.amount - payment.deductions
            )}
          />

          <InfoRow
            label="To"
            value={`${PAYOUT.bank} · •••• ${PAYOUT.last4}`}
          />

          <InfoRow
            label="Reference"
            value={payment.reference ?? "Pending"}
          />

          <View style={styles.noteBox}>
            <Ionicons
              name="time-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.noteText}>
              Your payment is being processed. Check back for
              updates.
            </Text>
          </View>

          <PrimaryButton
            title="Back to payments"
            onPress={goToPayments}
          />
        </Card>
      )}

      {/* Paid payment receipt */}
      {isPaid && (
        <Card>
          <View style={styles.receiptIcon}>
            <Ionicons
              name="checkmark-circle"
              size={42}
              color={colors.success}
            />
          </View>

          <Text style={styles.receiptLabel}>Amount received</Text>
          <Text style={styles.amount}>
            {formatNaira(payment.amount - payment.deductions)}
          </Text>

          <Text style={styles.paymentTitle}>
            {payment.facility} · Registered nurse
          </Text>

          <Text style={styles.detailText}>
            Shift {payment.code} · {payment.dateLabel}
          </Text>

          <View style={styles.divider} />

          <InfoRow
            label="Paid on"
            value={payment.paidOn ?? "Not available"}
          />

          <InfoRow
            label="Bank account"
            value={`${PAYOUT.bank} · •••• ${PAYOUT.last4}`}
          />

          <InfoRow
            label="Payment reference"
            value={payment.reference ?? "Not available"}
          />

          <InfoRow
            label="Shift pay"
            value={formatNaira(payment.amount)}
          />

          <InfoRow
            label="Deductions"
            value={formatNaira(payment.deductions)}
          />

          <PrimaryButton
            title="Back to payments"
            onPress={goToPayments}
          />
        </Card>
      )}
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
  emphasized = false,
}: {
  label: string;
  value: string;
  emphasized?: boolean;
}) {
  return (
    <View style={styles.infoRow}>
      <Text
        style={[
          styles.muted,
          emphasized && styles.emphasized,
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.infoValue,
          emphasized && styles.emphasized,
        ]}
      >
        {value}
      </Text>
    </View>
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
  heading: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  muted: {
    ...typography.bodySmall,
    color: colors.textSecondary,
  },
  amount: {
    ...typography.h2,
    color: colors.text,
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  paymentTitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  detailText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  infoValue: {
    ...typography.bodySmall,
    color: colors.text,
    flexShrink: 1,
    textAlign: "right",
  },
  emphasized: {
    ...typography.label,
    color: colors.text,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  progressText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  progressComplete: {
    color: colors.text,
  },
  noteBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: 12,
    marginVertical: spacing.md,
  },
  noteText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    flex: 1,
  },
  receiptIcon: {
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  receiptLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
  },
});