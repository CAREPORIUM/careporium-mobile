import { useState } from "react";
import { Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";

export default function SignupScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);

  const isValid =
    fullName && email && phone && location && password && confirmPassword && password === confirmPassword;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Professional Profile</Text>
      <Text style={styles.subtitle}>Basic identity</Text>
      <Text style={styles.step}>Step 1 of 2</Text>

      <Text style={styles.label}>Full Name</Text>
      <AppInput placeholder="Luke Marcus" value={fullName} onChangeText={setFullName}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Email Address</Text>
      <AppInput placeholder="you@gmail.com" keyboardType="email-address" autoCapitalize="none"
        value={email} onChangeText={setEmail}
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Phone Number</Text>
      <AppInput placeholder="+234 9082566035" keyboardType="phone-pad" value={phone} onChangeText={setPhone}
        leftIcon={<Ionicons name="call-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Location</Text>
      <AppInput placeholder="Ikeja, Lagos" value={location} onChangeText={setLocation} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Password</Text>
      <AppInput placeholder="••••••••••••" secureTextEntry={hidePassword} value={password} onChangeText={setPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
        rightIcon={<Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.placeholder} />
        </Pressable>} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Confirm Password</Text>
      <AppInput placeholder="••••••••••••" secureTextEntry={hideConfirm} value={confirmPassword} onChangeText={setConfirmPassword}
        leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
        rightIcon={<Pressable onPress={() => setHideConfirm(!hideConfirm)}>
          <Ionicons name={hideConfirm ? "eye-off-outline" : "eye-outline"} size={20} color={colors.placeholder} />
        </Pressable>} />

      <PrimaryButton title="Continue" disabled={!isValid} onPress={() => router.push("/signup-step2")} style={{ marginTop: spacing.xl }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  step: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
});