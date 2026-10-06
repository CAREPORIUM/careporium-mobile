import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StepIndicator from "@/components/ui/StepIndicator";
import { colors, radius, spacing, typography } from "@/constants/theme";

const MOCK_SHIFT = {
  title: "Registered Nurse · Acute Care",
  facility: "Mainland Care Hospital · Verified facility",
  match: "94% MATCH",
  dateTime: "Tue, 6 Oct · 07:00–19:00 WAT",
  location: "Ikeja · 7.7 km away",
  rate: "₦3,000/hr · ₦36,000 estimated",
};
const MOCK_WORKER = { name: "Amara Okafor · RN", licence: "Verified and active", availability: "Full 07:00–19:00 WAT shift" };

export default function ApplicationSubmit() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATION</Text>
      <Text style={styles.title}>Confirm your application</Text>
      <Text style={styles.subtitle}>Review the information below before sending your application to the facility.</Text>

      <StepIndicator current={2} />

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Application summary</Text>
        <Text style={styles.jobTitle}>{MOCK_SHIFT.title}</Text>
        <Text style={styles.facility}>{MOCK_SHIFT.facility}</Text>
        <View style={styles.matchPill}><Text style={styles.matchText}>{MOCK_SHIFT.match}</Text></View>
        <Row icon="calendar-outline" text={MOCK_SHIFT.dateTime} />
        <Row icon="location-outline" text={MOCK_SHIFT.location} />
        <Row icon="cash-outline" text={MOCK_SHIFT.rate} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Your details</Text>
        <Detail label="Professional" value={MOCK_WORKER.name} />
        <Detail label="Professional licence" value={MOCK_WORKER.licence} verified />
        <Detail label="Availability" value={MOCK_WORKER.availability} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Message to the facility</Text>
        <Text style={styles.message}>"I'm available for the full shift and have acute care experience."</Text>
      </View>

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.noticeText}>By submitting, you confirm that your availability and professional credentials are accurate.</Text>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back to review</Text>
      </Pressable>
      <PrimaryButton title="Submit application" onPress={() => router.replace("/application-submitted")} style={{ marginTop: spacing.sm }} />
    </ScrollView>
  );
}

function Row({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

function Detail({ label, value, verified = false }: { label: string; value: string; verified?: boolean }) {
  return (
    <View style={{ marginBottom: spacing.md }}>
      <Text style={styles.label}>{label}</Text>
      {verified ? (
        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.verifiedText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  cardHeading: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  jobTitle: { ...typography.h3, color: colors.text },
  facility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  matchPill: { alignSelf: "flex-start", backgroundColor: "#ECFDF3", borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
  matchText: { color: colors.success, ...typography.bodySmall, fontWeight: "800" },
  row: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.sm },
  rowText: { ...typography.bodySmall, color: colors.text },
  label: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.xs },
  value: { ...typography.label, color: colors.text, fontWeight: "600" },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  verifiedText: { color: colors.success, ...typography.label, fontWeight: "600" },
  message: { ...typography.bodySmall, color: colors.text, lineHeight: 20 },
  notice: { flexDirection: "row", backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.lg },
  noticeText: { flex: 1, ...typography.bodySmall, color: colors.primary },
  backButton: { height: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  backText: { color: colors.primary, ...typography.label, fontWeight: "600" },
});