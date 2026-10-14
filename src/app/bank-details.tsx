
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";

import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import ScreenTitle from "@/components/ui/ScreenTitle";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

import { colors, spacing, typography } from "@/constants/theme";
import { saveBankDetails } from "@/services/payment.service";

const BANKS = [
  "Access Bank",
  "First Bank",
  "GTBank",
  "UBA",
  "Zenith Bank",
  "Fidelity Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "Wema Bank",
  "Kuda",
];

export default function BankDetailsScreen() {
  const [bank, setBank] = useState<string | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (loading) return;

    if (!bank) {
      setError("Please select your bank.");
      return;
    }

    if (!/^\d{10}$/.test(accountNumber)) {
      setError("Account number must contain exactly 10 digits.");
      return;
    }

    if (!accountName.trim()) {
      setError("Please enter your account name.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await saveBankDetails({
        bank,
        accountNumber,
        accountName: accountName.trim(),
      });

      setSaved(true);
    } catch {
      setError("Unable to save your bank details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const goToPayments = () => {
    router.replace("/(tabs)/payments");
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ScreenTitle
        title="Bank details"
        subtitle="Manage the account where you receive payments"
        onBack={goToPayments}
      />

      {saved ? (
        <>
          <StatusBanner
            kind="success"
            title="Your bank details are saved"
            text={`Future payments will go to your ${bank} account ending in ${accountNumber.slice(-4)}.`}
          />

          <Card>
            <Text style={styles.sectionTitle}>
              Saved account
            </Text>

            <Text style={styles.label}>Bank</Text>
            <Text style={styles.value}>{bank}</Text>

            <Text style={styles.label}>Account name</Text>
            <Text style={styles.value}>{accountName.trim()}</Text>

            <Text style={styles.label}>Account number</Text>
            <Text style={styles.value}>
              •••• ••{accountNumber.slice(-4)}
            </Text>

            <PrimaryButton
              title="Back to payments"
              onPress={goToPayments}
            />
          </Card>
        </>
      ) : (
        <>
          <StatusBanner
            kind="info"
            title="Payments go straight to your bank"
            text="Use an account in your name. Changes apply to future payments."
          />

          <Card>
            <Text style={styles.sectionTitle}>
              Your payout account
            </Text>

            <Text style={styles.label}>Bank</Text>

            <AppSelect
              options={BANKS}
              value={bank}
              onChange={setBank}
              placeholder="Select your bank"
            />

            <Text style={styles.label}>Account number</Text>

            <AppInput
              placeholder="Enter 10-digit account number"
              value={accountNumber}
              onChangeText={(value: string) =>
                setAccountNumber(
                  value.replace(/\D/g, "").slice(0, 10)
                )
              }
              keyboardType="number-pad"
              maxLength={10}
            />

            <Text style={styles.label}>Account name</Text>

            <AppInput
              placeholder="Enter account name"
              value={accountName}
              onChangeText={setAccountName}
              autoCapitalize="words"
            />

            <Text style={styles.note}>
              Account name must match your verified profile.
            </Text>

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <View style={styles.buttonGroup}>
              <SecondaryButton
                title="Cancel"
                onPress={goToPayments}
              />

              <PrimaryButton
                title="Save bank details"
                onPress={handleSave}
                loading={loading}
                disabled={loading}
              />
            </View>

            {loading && (
              <ActivityIndicator
                color={colors.primary}
                style={styles.loader}
              />
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  value: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  note: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.md,
  },
  buttonGroup: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  loader: {
    marginTop: spacing.sm,
  },
});