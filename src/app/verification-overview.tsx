import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

type Kind = "verified" | "review" | "action";

const KINDS: Record<Kind, { pill: string; icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  verified: { pill: "VERIFIED", icon: "checkmark", color: colors.success, bg: colors.successLight },
  review: { pill: "IN REVIEW", icon: "ellipse", color: colors.warning, bg: colors.warningLight },
  action: { pill: "ACTION REQUIRED", icon: "alert", color: colors.error, bg: colors.errorLight },
};

function StatusCard({ kind, title, text, buttonTitle, onPress }: {
  kind: Kind; title: string; text: string; buttonTitle: string; onPress: () => void;
}) {
  const k = KINDS[kind];
  return (
    <View style={styles.card}>
      <View style={[styles.pill, { backgroundColor: k.bg }]}>
        <Ionicons name={k.icon} size={14} color={k.color} />
        <Text style={[styles.pillText, { color: k.color }]}>{k.pill}</Text>
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardText}>{text}</Text>
      <SecondaryButton title={buttonTitle} onPress={onPress} style={{ marginTop: spacing.md }} />
    </View>
  );
}

export default function VerificationOverviewScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => goBack("/(tabs)/profile")}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>

      <Text style={styles.eyebrow}>TRUST AND VERIFICATION</Text>
      <Text style={styles.title}>Verification at a glance.</Text>
      <Text style={styles.subtitle}>
        Clear status labels help professionals know what is ready and what needs attention.
      </Text>

      <StatusCard
        kind="verified"
        title="Verified"
        text="Identity and active professional licence were reviewed. Ready to apply for eligible shifts."
        buttonTitle="View credentials"
        onPress={() => Alert.alert("Credentials", "Coming soon")}
      />
      <StatusCard
        kind="review"
        title="Under review"
        text="Documents are submitted. Some opportunities may require approval first."
        buttonTitle="Track verification"
        onPress={() => router.push("/verification/pending")}
      />
      <StatusCard
        kind="action"
        title="Action required"
        text="An expired or unclear document needs updating before restricted shifts."
        buttonTitle="Update document"
        onPress={() => router.push("/credentials")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  pill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, gap: 4 },
  pillText: { ...typography.bodySmall, fontWeight: "800" },
  cardTitle: { ...typography.h3, color: colors.text, marginTop: spacing.md },
  cardText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});