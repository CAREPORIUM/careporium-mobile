
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";

import { colors, spacing, typography } from "@/constants/theme";
import { formatNaira } from "@/utils/format";
import { PAYMENTS, getPayment } from "@/services/payment.service";

const ISSUE_OPTIONS = [
  "Payment is taking longer than expected",
  "Amount is wrong",
  "Wrong bank account",
  "I haven't received my payment",
  "Something else",
];

export default function PaymentSupportScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const payment = (id ? getPayment(id) : undefined) ?? PAYMENTS[0];

  const [issue, setIssue] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function goBackToDetails() {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace({
        pathname: "/payment-details",
        params: { id: payment.id },
      });
    }
  }

  async function handleSubmit() {
    if (loading) return;

    if (!issue) {
      setError("Please select the payment issue you want to report.");
      return;
    }

    if (!message.trim()) {
      setError("Please explain what happened.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      // Mock submission for now. No API call is made.
      await new Promise<void>((resolve) =>
        setTimeout(resolve, 600)
      );

      console.log("Mock payment issue submitted:", {
        paymentId: payment.id,
        shiftCode: payment.code,
        issue,
        message: message.trim(),
      });

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenTitle
        title="Payment support"
        subtitle="Tell us about a problem with your payment."
        onBack={goBackToDetails}
      />

      {submitted ? (
        <View style={styles.content}>
          <StatusBanner
            kind="success"
            title="We've received your payment issue"
            text={`Your report is linked to shift ${payment.code}. Our team will review it and update you in notifications.`}
          />

          <PrimaryButton
            title="Back to payments"
            onPress={() => router.replace("/(tabs)/payments")}
          />
        </View>
      ) : (
        <View style={styles.content}>
          <Card>
            <Text style={styles.cardTitle}>
              Tell us what happened
            </Text>

            <Text style={styles.paymentInfo}>
              Payment for shift {payment.code} ·{" "}
              {formatNaira(payment.amount)}
            </Text>

            <Text style={styles.fieldLabel}>
              Issue
            </Text>

            <AppSelect
              options={ISSUE_OPTIONS}
              value={issue}
              onChange={setIssue}
              placeholder="Select an issue"
            />

            <Text style={styles.fieldLabel}>
              Message
            </Text>

            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Add a short explanation"
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
              style={styles.messageInput}
              editable={!loading}
            />

            <Text style={styles.helperText}>
              Please provide enough information to help us
              understand the problem.
            </Text>

            {error ? (
              <Text style={styles.errorText}>
                {error}
              </Text>
            ) : null}

            <View style={styles.buttonSpacing}>
              <SecondaryButton
                title="Back to payment details"
                onPress={goBackToDetails}
                disabled={loading}
              />
            </View>

            <View style={styles.buttonSpacing}>
              <PrimaryButton
                title="Submit issue"
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
              />
            </View>
          </Card>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  content: {
    marginTop: spacing.lg,
    gap: spacing.lg,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  paymentInfo: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  messageInput: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: 10,
    padding: spacing.md,
    minHeight: 120,
  },
  helperText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.md,
  },
  buttonSpacing: {
    marginTop: spacing.md,
  },
});
