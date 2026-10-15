import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { forgotPassword } from "@/services/auth.service";
import { colors, spacing, typography } from "@/constants/theme";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      await forgotPassword(email);

      router.push({
        pathname: "/reset-password",
        params: { email: email.trim().toLowerCase() },
      });
    } catch (e: any) {
      setError(
        e?.message ?? "Unable to send the reset code. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Ionicons
        name="lock-closed-outline"
        size={48}
        color={colors.primary}
      />

      <Text style={styles.title}>Forgot Password?</Text>

      <Text style={styles.subtitle}>
        Enter the email address associated with your account.
        We will send you a code to reset your password.
      </Text>

      <Text style={styles.label}>Email Address</Text>

      <AppInput
        placeholder="you@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        leftIcon={
          <Ionicons
            name="mail-outline"
            size={20}
            color={colors.placeholder}
          />
        }
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <PrimaryButton
        title="Send Reset Code"
        onPress={handleForgotPassword}
        loading={loading}
        style={styles.button}
      />

      <Text
        style={styles.back}
        onPress={() => router.replace("/login")}
      >
        Back to Login
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginTop: spacing.lg,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  label: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  error: {
    ...typography.bodySmall,
    color: colors.error,
    marginTop: spacing.md,
  },
  message: {
    ...typography.bodySmall,
    color: colors.primary,
    marginTop: spacing.md,
  },
  button: {
    marginTop: spacing.lg,
  },
  back: {
    ...typography.bodySmall,
    color: colors.primary,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});