import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function ApplicationSubmitted() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATION</Text>
      <Text style={styles.title}>Application submitted</Text>
      <Text style={styles.subtitle}>Your application is with Mainland Care Hospital.</Text>

      <View style={styles.card}>
        <View style={styles.submittedPill}>
          <Ionicons name="checkmark" size={14} color={colors.success} />
          <Text style={styles.submittedText}>SUBMITTED</Text>
        </View>
        <Text style={styles.mainText}>Your application is on its way.</Text>
        <Text style={styles.description}>
          Mainland Care Hospital will review your verified profile and application. You'll receive a notification when
          a decision is made.
        </Text>

        <View style={styles.infoBox}><Text style={styles.infoLabel}>Reference</Text><Text style={styles.infoValue}>CP-2026-1048</Text></View>
        <View style={styles.infoBox}><Text style={styles.infoLabel}>Submitted</Text><Text style={styles.infoValue}>29 Sep 2026 · 09:56 WAT</Text></View>
        <View style={styles.infoBox}><Text style={styles.infoLabel}>Status</Text><Text style={styles.statusText}>Under review</Text></View>
      </View>

      <PrimaryButton title="Track application" onPress={() => router.push("/(tabs)/applications")} />
      <Pressable style={styles.outlineButton} onPress={() => router.push("/(tabs)/shifts")}>
        <Text style={styles.outlineText}>Browse more shifts</Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What to expect</Text>
        <Timeline icon="checkmark-circle" title="Submitted" description="Application delivered successfully." active />
        <Timeline icon="ellipse" title="Under review" description="Facility checks your application and availability." active />
        <Timeline icon="ellipse-outline" title="Decision" description="You'll be notified when the facility responds." />
      </View>
    </ScrollView>
  );
}

function Timeline({ icon, title, description, active = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; active?: boolean }) {
  return (
    <View style={styles.timeline}>
      <Ionicons name={icon} size={20} color={active ? colors.success : colors.borderLight} />
      <View style={{ flex: 1, marginLeft: spacing.sm }}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  submittedPill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF3", paddingHorizontal: spacing.sm, paddingVertical: 4, borderRadius: radius.round, gap: 4 },
  submittedText: { color: colors.success, ...typography.bodySmall, fontWeight: "800" },
  mainText: { ...typography.h3, color: colors.text, marginTop: spacing.md },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 20 },
  infoBox: { borderTopWidth: 1, borderTopColor: colors.card, marginTop: spacing.md, paddingTop: spacing.sm },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary },
  infoValue: { ...typography.label, color: colors.text, fontWeight: "600", marginTop: 2 },
  statusText: { ...typography.label, color: colors.warning, fontWeight: "700", marginTop: 2 },
  outlineButton: { height: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.sm },
  outlineText: { color: colors.primary, ...typography.label, fontWeight: "600" },
  cardTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.lg },
  timeline: { flexDirection: "row", marginBottom: spacing.md },
  timelineTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  timelineDescription: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});