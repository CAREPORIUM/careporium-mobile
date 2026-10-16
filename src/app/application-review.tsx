import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StepIndicator from "@/components/ui/StepIndicator";
import { useAuth } from "@/context/AuthContext";
import { useVerification } from "@/hooks/useVerification";
import { getShiftById } from "@/services/shift.service";
import { Shift } from "@/types/shift";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function ApplicationReview() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user } = useAuth();
  const { verified } = useVerification();
  const [shift, setShift] = useState<Shift | null>(null);

  useEffect(() => {
    if (id) getShiftById(id).then((s) => setShift(s ?? null)).catch(() => setShift(null));
  }, [id]);

  const name = (user as any)?.fullName ?? (user as any)?.name ?? (user as any)?.email ?? "You";

  if (!shift) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.subtitle}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATION</Text>
      <Text style={styles.title}>Review before you apply</Text>
      <Text style={styles.subtitle}>Check the shift and your details before sending your application to the facility.</Text>

      <StepIndicator current={1} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shift summary</Text>
        <Text style={styles.shiftTitle}>{shift.title}</Text>
        <Text style={styles.facility}>{shift.facility}</Text>
        <InfoRow icon="calendar-outline" text={`${shift.date} · ${shift.time}`} />
        {shift.location ? <InfoRow icon="location-outline" text={shift.location} /> : null}
        <Text style={styles.rate}>{naira(shift.total)} for this shift</Text>
        <Pressable style={styles.outlineButton} onPress={() => goBack("/(tabs)/shifts")}>
          <Text style={styles.outlineButtonText}>View shift</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Your details</Text>
      <View style={styles.card}>
        <Text style={styles.detailLabel}>Professional</Text>
        <Text style={styles.detailValue}>{name}</Text>
        <View style={styles.divider} />
        <Text style={styles.detailLabel}>Account</Text>
        <View style={styles.verifiedRow}>
          <Ionicons name={verified ? "checkmark-circle" : "time-outline"} size={16} color={verified ? colors.success : colors.warning} />
          <Text style={[styles.verifiedText, !verified && { color: colors.warning }]}>{verified ? "Verified" : "Verification pending"}</Text>
        </View>
      </View>

      <Pressable style={styles.secondaryButton} onPress={() => goBack("/(tabs)/shifts")}>
        <Text style={styles.secondaryButtonText}>Back to shift</Text>
      </Pressable>
      <PrimaryButton title="Continue to submit" onPress={() => router.push({ pathname: "/application-submit", params: { id } })} style={{ marginTop: spacing.sm }} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What happens next</Text>
        <TimelineItem number="01" title="Facility reviews" description="The facility reviews your application." active />
        <TimelineItem number="02" title="Decision arrives" description="The facility accepts or declines. Check Applied for the result." />
        <TimelineItem number="03" title="Shift confirmed" description="Once accepted, your shift appears in Upcoming." />
      </View>
    </ScrollView>
  );
}

function InfoRow({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function TimelineItem({ number, title, description, active = false }: { number: string; title: string; description: string; active?: boolean }) {
  return (
    <View style={styles.timelineItem}>
      <View style={[styles.timelineNumber, active && styles.timelineNumberActive]}>
        <Text style={[styles.timelineNumberText, active && styles.timelineNumberTextActive]}>{number}</Text>
      </View>
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
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  cardTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  shiftTitle: { ...typography.h3, color: colors.text },
  facility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.sm },
  infoText: { ...typography.bodySmall, color: colors.text, flex: 1 },
  rate: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.md },
  outlineButton: { height: 44, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.md },
  outlineButtonText: { color: colors.primary, ...typography.label, fontWeight: "600" },
  sectionTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  detailLabel: { ...typography.bodySmall, color: colors.textSecondary },
  detailValue: { ...typography.label, color: colors.text, fontWeight: "600", marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.card, marginVertical: spacing.md },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: 2 },
  verifiedText: { color: colors.success, ...typography.bodySmall, fontWeight: "600" },
  secondaryButton: { height: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center", marginTop: spacing.lg },
  secondaryButtonText: { color: colors.primary, ...typography.label, fontWeight: "600" },
  timelineItem: { flexDirection: "row", marginBottom: spacing.md },
  timelineNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  timelineNumberActive: { backgroundColor: colors.successLight },
  timelineNumberText: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: "800" },
  timelineNumberTextActive: { color: colors.success },
  timelineTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  timelineDescription: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
});