import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";

export default function AccountCreatedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-circle-outline" size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>Account Created Successfully</Text>
      <Text style={styles.subtitle}>Your account has been created.{"\n"}Please check your email to verify your account.</Text>
      <PrimaryButton title="Continue" onPress={() => router.replace("/credentials")}/>
      <Pressable style={{ marginTop: spacing.lg }}>
        <Text style={styles.link}>Didn't receive the email? <Text style={styles.linkBold}>Resend link</Text></Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: spacing.xxl * 2 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#EFF4FE", alignItems: "center", justifyContent: "center", marginBottom: spacing.xl },
  title: { ...typography.h2, color: colors.text, textAlign: "center" },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: "center", marginTop: spacing.md },
  link: { ...typography.bodySmall, color: colors.text, textAlign: "center" },
  linkBold: { color: colors.primary, fontWeight: "600" },
  divider: { height: 1, width: "100%", backgroundColor: colors.borderLight, marginVertical: spacing.xl },
});