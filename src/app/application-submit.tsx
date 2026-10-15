import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StepIndicator from "@/components/ui/StepIndicator";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";
import { applyForShift } from "@/services/shift.service";

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
  const { id } = useLocalSearchParams<{ id?: string }>();
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);

async function handleSubmit() {
  if (submitting) return;

  if (!id) {
    setError("The shift ID is missing. Return to the shifts screen and try again.");
    return;
  }

  setSubmitting(true);
  setError(null);

  try {
    await applyForShift(id);
    router.replace("/application-submitted");
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Unable to submit your application. Please try again."
    );
  } finally {
    setSubmitting(false);
  }
}

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATION</Text>
      <Text style={styles.title}>Confirm your application</Text>
      <Text style={styles.subtitle}>Review the information below before sending your application to the facility.</Text>

      <StepIndicator current={2} />

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Application summary</Text>
<Text style={styles.jobTitle}>Selected healthcare shift</Text>
<Text style={styles.facility}>
  Shift reference: {id ?? "Missing shift ID"}
</Text>
<Text style={styles.message}>
  Your application will be submitted for the selected shift.
</Text>
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

      <Pressable style={styles.backButton} onPress={() => goBack("/application-review")}>
        <Text style={styles.backText}>Back to review</Text>
      </Pressable>
      {error && (
  <View style={styles.notice}>
    <Ionicons
      name="alert-circle-outline"
      size={20}
      color={colors.primary}
    />
    <Text style={styles.noticeText}>{error}</Text>
  </View>
)}

{!submitting ? (
  <PrimaryButton
    title="Submit application"
    onPress={handleSubmit}
    style={{ marginTop: spacing.sm }}
  />
) : (
  <View style={styles.loadingRow}>
    <ActivityIndicator color={colors.primary} />
    <Text style={styles.value}>Submitting application...</Text>
  </View>
)}
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
  matchPill: { alignSelf: "flex-start", backgroundColor: colors.successLight, borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
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
  loadingRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: spacing.sm,
  marginTop: spacing.md,
},
});