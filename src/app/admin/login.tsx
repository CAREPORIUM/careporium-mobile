import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { Brand, Card } from "@/components/admin/AdminUI";
import { colors, spacing, typography } from "@/constants/theme";

export default function AdminLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  // Mock auth: any email and password passes to the verification step.
  const handleContinue = () => router.push({ pathname: "/admin/verify-code", params: { email: email.trim() } });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.brandWrap}>
        <Brand />
      </View>
      <Text style={styles.title}>Admin sign in</Text>
      <Text style={styles.subtitle}>Authorised platform administrators only.</Text>

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.cardTitle}>Sign in to Careporium</Text>

        <Text style={styles.label}>Work email</Text>
        <AppInput
          placeholder="admin@careporium.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: spacing.md }]}>Password</Text>
        <AppInput
          placeholder="••••••••••••"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={setPassword}
          rightIcon={
            <Ionicons
              name={hidePassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.placeholder}
              onPress={() => setHidePassword(!hidePassword)}
            />
          }
        />

        <PrimaryButton title="Continue securely" disabled={!canSubmit} onPress={handleContinue} style={{ marginTop: spacing.lg }} />
        <SecondaryButton
          title="Forgot password?"
          onPress={() => Alert.alert("Reset password", "Admin password reset is coming soon.")}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.note}>
          A verification code is required after your password. Access and verification decisions are recorded in the audit log.
        </Text>
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
  note: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.lg },
});
