import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StepIndicator from "@/components/ui/StepIndicator";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

// Mock — should use the shift id param once connected to real shift data
const MOCK_SHIFT = {
  title: "Registered Nurse · Acute Care",
  facility: "Mainland Care Hospital · Verified facility",
  match: "94% MATCH",
  dateTime: "Tue, 6 Oct · 07:00–19:00 WAT",
  location: "Ikeja · 7.7 km away",
  rate: "₦3,000/hr · ₦36,000 estimated",
};
const MOCK_WORKER = { name: "Amara Okafor · RN", licence: "Verified and active", availability: "Full 07:00–19:00 WAT shift" };

export default function ApplicationReview() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [message, setMessage] = useState("I'm available for the full shift and have acute care experience.");

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATION</Text>
      <Text style={styles.title}>Review before you apply</Text>
      <Text style={styles.subtitle}>Confirm your availability and verified credentials before sharing with the facility.</Text>

      <StepIndicator current={1} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Shift summary</Text>
        <Text style={styles.shiftTitle}>{MOCK_SHIFT.title}</Text>
        <Text style={styles.facility}>{MOCK_SHIFT.facility}</Text>
        <View style={styles.matchPill}><Text style={styles.matchText}>{MOCK_SHIFT.match}</Text></View>
        <InfoRow icon="calendar-outline" text={MOCK_SHIFT.dateTime} />
        <InfoRow icon="location-outline" text={MOCK_SHIFT.location} />
        <Text style={styles.rate}>{MOCK_SHIFT.rate}</Text>
        <Pressable style={styles.outlineButton} onPress={() => goBack("/(tabs)/shifts")}>
          <Text style={styles.outlineButtonText}>View shift</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Your details</Text>
      <View style={styles.card}>
        <Text style={styles.detailLabel}>Professional</Text>
        <Text style={styles.detailValue}>{MOCK_WORKER.name}</Text>
        <View style={styles.divider} />
        <Text style={styles.detailLabel}>Professional licence</Text>
        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={16} color={colors.success} />
          <Text style={styles.verifiedText}>{MOCK_WORKER.licence}</Text>
        </View>
        <View style={styles.divider} />
        <Text style={styles.detailLabel}>Availability</Text>
        <Text style={styles.detailValue}>{MOCK_WORKER.availability}</Text>
      </View>

      <Text style={styles.sectionTitle}>Message to the facility</Text>
      <AppInput value={message} onChangeText={setMessage} multiline numberOfLines={4} placeholder="Write a message..." />

      <Pressable style={styles.secondaryButton} onPress={() => goBack("/(tabs)/shifts")}>
        <Text style={styles.secondaryButtonText}>Back to shift</Text>
      </Pressable>
      <PrimaryButton title="Continue to submit" onPress={() => router.push({ pathname: "/application-submit", params: { id } })} style={{ marginTop: spacing.sm }} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>What happens next</Text>
        <TimelineItem number="01" title="Facility reviews" description="The facility reviews your application and availability." active />
        <TimelineItem number="02" title="Decision arrives" description="You'll receive a notification when a decision is made." />
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
  matchPill: { alignSelf: "flex-start", backgroundColor: colors.successLight, borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.sm },
  matchText: { color: colors.success, ...typography.bodySmall, fontWeight: "800" },
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