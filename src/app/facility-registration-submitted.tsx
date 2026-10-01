import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";

export default function FacilityRegistrationSubmittedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-circle-outline" size={56} color={colors.primary} />
      </View>
      <Text style={styles.title}>Registration Submitted</Text>
      <Text style={styles.subtitle}>
        Your facility registration has been successfully submit. Our team will review your information and
        documents. You will receive an email notification once your facility has been approved. Review usually
        takes 1-3 business days.
      </Text>
      <PrimaryButton title="Go to Login" onPress={() => router.replace("/login")} style={{ marginTop: spacing.xl, alignSelf: "stretch" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: 160 },
  iconCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.text, textAlign: "center" },
  subtitle: { ...typography.bodySmall, color: colors.text, textAlign: "center", marginTop: spacing.sm, lineHeight: 20 },
});