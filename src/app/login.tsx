import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { login } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, typography } from "@/constants/theme";

export default function LoginScreen() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      setUser(user);

      if (user.role === "admin") {
        router.replace("/admin");
      } else if (user.role === "worker") {
        router.replace("/(tabs)");
      } else {
        Alert.alert("Facility dashboard", "The facility experience is coming soon.");
      }
    } catch (e: any) {
      const msg: string = e.message ?? "Something went wrong. Try again.";
      if (msg.toLowerCase().includes("not verified")) {
        router.push({ pathname: "/verify-otp", params: { email: email.trim().toLowerCase() } });
        return;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to your Careporium account.</Text>

      <Text style={styles.label}>Email Address</Text>
      <AppInput
        placeholder="you@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.placeholder} />}
      />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Password</Text>
      <AppInput
        placeholder="••••••••••••"
        secureTextEntry={hidePassword}
        value={password}
        onChangeText={setPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
        rightIcon={
          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.placeholder}
            />
          </Pressable>
        }
      />

      <Pressable style={styles.forgotWrap} onPress={() => router.push("/reset-password")}>
        <Text style={styles.forgotText}>Forget Password?</Text>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <PrimaryButton title="Log in" onPress={handleLogin} loading={loading} style={{ marginTop: spacing.lg }} />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <SecondaryButton
        title="Continue with Google"
        icon={<Ionicons name="logo-google" size={20} color={colors.primary} />}
        style={{ marginBottom: spacing.md }}
      />
      <SecondaryButton
        title="Continue with Apple"
        icon={<Ionicons name="logo-apple" size={20} color={colors.primary} />}
      />

      <Pressable style={styles.footer} onPress={() => router.push("/role-selection")}>
        <Text style={styles.footerText}>
          Don't have an account? <Text style={styles.footerLink}>Sign up</Text>
        </Text>
      </Pressable>
      <Pressable style={styles.footer} onPress={() => router.push("/admin/login")}>
        <Text style={styles.footerText}>
          Platform administrator? <Text style={styles.footerLink}>Admin sign in</Text>
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  forgotWrap: { alignSelf: "flex-end", marginTop: spacing.sm },
  forgotText: { ...typography.bodySmall, color: colors.primary },
  errorText: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderLight },
  dividerText: { marginHorizontal: spacing.sm, color: colors.textSecondary, ...typography.bodySmall },
  footer: { alignItems: "center", marginTop: spacing.lg },
  footerText: { ...typography.bodySmall, color: colors.text },
  footerLink: { color: colors.primary, fontWeight: "600" },
});