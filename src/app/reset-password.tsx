import { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { forgotPassword, resetPassword } from "@/services/auth.service";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const RESEND_SECONDS = 60;

// Forgot / reset password, both steps on one screen:
//   1. enter your email -> POST /api/auth/v1/forgot-password (emails a 6-digit code, valid 10 minutes)
//   2. enter the code + a new password -> POST /api/auth/v1/reset-password
export default function ResetPasswordScreen() {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [hide, setHide] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const emailOk = /^\S+@\S+\.\S+$/.test(email.trim());

  const sendCode = async () => {
    if (!emailOk) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep("code");
      setCooldown(RESEND_SECONDS);
      setInfo("If that email has an account, a 6-digit code is on its way.");
    } catch (e: any) {
      setError(e.message ?? "Could not send the code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (cooldown > 0) return;
    setError("");
    setInfo("");
    try {
      await forgotPassword(email);
      setCooldown(RESEND_SECONDS);
      setInfo("A new code has been sent.");
    } catch (e: any) {
      setError(e.message ?? "Could not resend the code.");
    }
  };

  const submit = async () => {
    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await resetPassword(email, code, password);
      Alert.alert("Password changed", "You can now log in with your new password.", [{ text: "Log in", onPress: () => router.replace("/login") }]);
    } catch (e: any) {
      setError(e.message ?? "Could not reset your password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Pressable style={styles.backButton} onPress={() => (step === "code" ? setStep("email") : goBack("/login"))} accessibilityLabel="Go back">
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>

      {step === "email" ? (
        <>
          <Text style={styles.title}>Forgot password?</Text>
          <Text style={styles.subtitle}>Enter the email you signed up with and we'll send you a 6-digit code.</Text>

          <Text style={styles.label}>Email address</Text>
          <AppInput
            placeholder="you@gmail.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Ionicons name="mail-outline" size={20} color={colors.placeholder} />}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <PrimaryButton title="Send code" onPress={sendCode} loading={loading} disabled={!email.trim()} style={styles.button} />
        </>
      ) : (
        <>
          <Text style={styles.title}>Reset password</Text>
          <Text style={styles.subtitle}>Enter the code sent to {email.trim().toLowerCase()} and choose a new password.</Text>

          <Pressable style={styles.codeRow} onPress={() => inputRef.current?.focus()} accessibilityLabel="Enter six-digit code">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <View key={i} style={[styles.codeBox, code.length === i && styles.activeCodeBox]}>
                <Text style={styles.digit}>{code[i] ?? ""}</Text>
              </View>
            ))}
          </Pressable>
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(v) => setCode(v.replace(/[^0-9]/g, "").slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            caretHidden
            style={styles.hiddenInput}
          />

          <Text style={[styles.label, { marginTop: spacing.xl }]}>New password</Text>
          <AppInput
            placeholder="At least 8 characters"
            secureTextEntry={hide}
            value={password}
            onChangeText={setPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
            rightIcon={
              <Pressable onPress={() => setHide(!hide)}>
                <Ionicons name={hide ? "eye-off-outline" : "eye-outline"} size={20} color={colors.placeholder} />
              </Pressable>
            }
          />

          <Text style={[styles.label, { marginTop: spacing.lg }]}>Confirm new password</Text>
          <AppInput
            placeholder="Repeat the password"
            secureTextEntry={hide}
            value={confirm}
            onChangeText={setConfirm}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {info ? <Text style={styles.infoText}>{info}</Text> : null}

          <PrimaryButton title="Reset password" onPress={submit} loading={loading} disabled={code.length !== 6 || !password || !confirm} style={styles.button} />

          <Pressable style={styles.resendWrap} onPress={resend} disabled={cooldown > 0}>
            <Text style={[styles.resendText, cooldown > 0 && styles.resendDisabled]}>{cooldown > 0 ? `Resend code in ${cooldown}s` : "Didn't get the code? Resend"}</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", elevation: 2 },
  title: { ...typography.h1, color: colors.text, marginTop: spacing.xl },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg, lineHeight: 22 },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  codeRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md },
  codeBox: { width: 46, height: 58, borderRadius: 10, borderWidth: 1, borderColor: colors.borderLight, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  activeCodeBox: { borderColor: colors.primary, borderWidth: 2 },
  digit: { ...typography.h3, color: colors.text },
  hiddenInput: { position: "absolute", top: 0, left: 0, width: 1, height: 1, opacity: 0 },
  errorText: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  infoText: { ...typography.bodySmall, color: colors.success, marginTop: spacing.md },
  button: { marginTop: spacing.xl },
  resendWrap: { alignItems: "center", marginTop: spacing.lg },
  resendText: { ...typography.bodySmall, color: colors.primary, fontWeight: "600" },
  resendDisabled: { color: colors.textSecondary },
});