import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Brand, Card } from "@/components/admin/AdminUI";
import { login, logout } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";
import { colors, spacing, typography } from "@/constants/theme";

// Real admin sign-in: the same login as everyone else, but only an account with the admin role gets in.
export default function AdminLoginScreen() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== "admin") {
        await logout();
        setError("This account isn't a platform administrator.");
        return;
      }
      setUser(user);
      router.replace("/admin");
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.brandWrap}>
        <Brand />
      </View>
      <Text style={styles.title}>Admin sign in</Text>
      <Text style={styles.subtitle}>Authorised platform administrators only.</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Sign in to Careporium</Text>

        <Text style={styles.label}>Work email</Text>
        <AppInput placeholder="admin@careporium.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />

        <Text style={[styles.label, { marginTop: spacing.md }]}>Password</Text>
        <AppInput
          placeholder="••••••••••••"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={<Ionicons name={hidePassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.placeholder} onPress={() => setHidePassword(!hidePassword)} />}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Sign in" disabled={!canSubmit} loading={loading} onPress={handleSignIn} style={{ marginTop: spacing.lg }} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.card },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl * 2, paddingBottom: spacing.xxl },
  brandWrap: { alignItems: "center" },
  title: { ...typography.h3, color: colors.text, fontWeight: "700", textAlign: "center", marginTop: spacing.lg },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.md },
  cardTitle: { ...typography.h3, color: colors.text, fontWeight: "700" },
  label: { ...typography.bodySmall, fontWeight: "700", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
});