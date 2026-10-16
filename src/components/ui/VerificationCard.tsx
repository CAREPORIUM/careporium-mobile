import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";
import { useVerification } from "@/hooks/useVerification";
import { colors, radius, spacing, typography } from "@/constants/theme";

// The blue "Verify your account" panel on Home. Hidden once the account is verified.
export default function VerificationCard() {
  const { role, status, note, added, total } = useVerification();
  if (status === "verified") return null;

  const worker = role === "worker";
  const copy = {
    not_submitted: {
      eyebrow: worker ? "YOUR NEXT OPPORTUNITY STARTS HERE" : "READY TO HIRE?",
      title: worker ? "Verify your account" : "Verify your facility",
      text: worker
        ? "Before you can apply for shifts, we need to check your licence, education and identity."
        : "Before you can post shifts, we need to confirm your facility's licence, registration and contact person.",
      button: "Verify now",
    },
    pending: {
      eyebrow: "UNDER REVIEW",
      title: "We're reviewing your documents",
      text: "The rest of the app unlocks once you're verified. You can still update your profile while you wait.",
      button: "View submitted documents",
    },
    rejected: {
      eyebrow: "ACTION NEEDED",
      title: "We couldn't verify your documents",
      text: note || "Please check your documents and upload them again.",
      button: "Update documents",
    },
  }[status];

  return (
    <View style={styles.box}>
      <Text style={styles.eyebrow}>{copy.eyebrow}</Text>
      <Text style={styles.title}>{copy.title}</Text>
      <Text style={styles.text}>{copy.text}</Text>
      {status === "not_submitted" ? (
        <Text style={styles.progress}>
          {added} of {total} documents added
        </Text>
      ) : null}
      <Pressable style={styles.button} onPress={() => router.push("/verification")} accessibilityRole="button">
        <Text style={styles.buttonText}>{copy.button}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  eyebrow: { ...typography.bodySmall, color: colors.white, fontWeight: "700" },
  title: { ...typography.h2, color: colors.white, marginTop: spacing.sm },
  text: { ...typography.bodySmall, color: colors.white, marginTop: spacing.sm },
  progress: { ...typography.bodySmall, color: colors.white, fontWeight: "700", marginTop: spacing.md },
  button: { backgroundColor: colors.white, borderRadius: radius.md, minHeight: 48, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  buttonText: { ...typography.label, color: colors.primary, fontWeight: "700" },
});
