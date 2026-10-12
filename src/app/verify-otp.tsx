import { useEffect, useState } from "react";
import { Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { verifyAccount, resendOtp } from "@/services/auth.service";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const RESEND_SECONDS = 60;

export default function VerifyOtpScreen() {
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async () => {
    if (!email) {
      setError("Missing email. Go back and sign up again.");
      return;
    }
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await verifyAccount(email, otp.trim());
      Alert.alert("Account verified", "You can now log in.", [
        { text: "Log in", onPress: () => router.replace("/login") },
      ]);
    } catch (e: any) {
      setError(e.message ?? "Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setError("");
    setInfo("");
    try {
      await resendOtp(email);
      setInfo("A new code has been sent to your email.");
      setCooldown(RESEND_SECONDS);
    } catch (e: any) {
      setError(e.message ?? "Could not resend the code.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Pressable style={styles.backButton} onPress={() => goBack("/login")}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>

      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code we sent to {email ?? "your email"}. It expires in 5 minutes.
      </Text>

      <Text style={styles.label}>Verification code</Text>
      <AppInput
        placeholder="123456"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        leftIcon={<Ionicons name="key-outline" size={20} color={colors.placeholder} />}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {info ? <Text style={styles.infoText}>{info}</Text> : null}

      <PrimaryButton
        title="Verify account"
        disabled={otp.trim().length !== 6}
        loading={loading}
        onPress={handleVerify}
        style={{ marginTop: spacing.xl }}
      />

      <Pressable style={styles.resendWrap} onPress={handleResend} disabled={cooldown > 0}>
        <Text style={[styles.resendText, cooldown > 0 && styles.resendDisabled]}>
          {cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get the code? Resend"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  errorText: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  infoText: { ...typography.bodySmall, color: colors.success, marginTop: spacing.md },
  resendWrap: { alignItems: "center", marginTop: spacing.lg },
  resendText: { ...typography.bodySmall, color: colors.primary, fontWeight: "600" },
  resendDisabled: { color: colors.textSecondary },
});