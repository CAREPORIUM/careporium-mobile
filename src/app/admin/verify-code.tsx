import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { BackLink, Brand, Card } from "@/components/admin/AdminUI";
import { colors, spacing, typography } from "@/constants/theme";

// "amara@careporium.com" -> "a••••@careporium.com"
function maskEmail(email?: string) {
  if (!email || !email.includes("@")) return "a••••@careporium.com";
  const [name, domain] = email.split("@");
  return `${name.charAt(0)}••••@${domain}`;
}

export default function AdminVerifyCodeScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [code, setCode] = useState("");

  const handleChange = (value: string) => setCode(value.replace(/[^0-9]/g, "").slice(0, 6));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BackLink fallback="/admin/login" />
      <View style={styles.brandWrap}>
        <Brand />
      </View>
      <Text style={styles.title}>Verify your sign-in</Text>
      <Text style={styles.subtitle}>Enter the code sent to your registered admin email.</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Security verification</Text>
        <Text style={styles.sentTo}>Code sent to {maskEmail(email)}</Text>

        <Text style={styles.label}>6-digit verification code</Text>
        <AppInput placeholder="Enter code" keyboardType="number-pad" maxLength={6} value={code} onChangeText={handleChange} />

        <PrimaryButton
          title="Verify and sign in"
          disabled={code.length !== 6}
          onPress={() => router.replace("/admin")}
          style={{ marginTop: spacing.lg }}
        />
        <SecondaryButton
          title="Resend code"
          onPress={() => Alert.alert("Code sent", "A new verification code has been sent.")}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.note}>
          Code expired? Request a new one. After repeated failed attempts, sign-in is temporarily blocked.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  brandWrap: { alignItems: "center", marginTop: spacing.lg },
  title: { ...typography.h3, color: colors.text, fontWeight: "700", textAlign: "center", marginTop: spacing.lg },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.md },
  cardTitle: { ...typography.h3, color: colors.text, fontWeight: "700" },
  sentTo: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  label: { ...typography.bodySmall, fontWeight: "700", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  note: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.lg },
});
