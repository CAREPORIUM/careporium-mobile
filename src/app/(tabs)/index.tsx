import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "@/constants/theme";

// Mock — replace once backend exists
const MOCK = {
  name: "Amara",
  upcomingCount: 1,
  applicationsInReview: 2,
  earningsThisMonth: 72000,
  nextShiftPay: 28000,
  nextShift: { title: "Community Nurse · Yaba Community Clinic", date: "Friday, 9 October 2026", time: "08:00–16:00 WAT", location: "Yaba, Lagos", checkIn: "07:45", pay: 28000 },
  applicationBreakdown: { underReview: 2, accepted: 1, notSelected: 1 },
  recommended: { title: "Registered Nurse · Acute Care", facility: "Mainland Care Hospital · Verified facility", match: "94% MATCH", date: "Tue, 6 Oct · 07:00–19:00 WAT · Ikeja, Lagos", rate: "₦3,000/hr · ₦36,000 estimated" },
};

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function HomeScreen() {
  const m = MOCK;
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
          <Text style={styles.title}>Good morning, {m.name}.</Text>
        </View>
        <Pressable style={styles.bellButton} onPress={() => router.push("/notifications")}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </Pressable>
      </View>
      <Text style={styles.subtitle}>Your shifts, applications, and earnings in one place.</Text>

      <PrimaryButton title="Find shifts" onPress={() => router.push("/(tabs)/shifts")} style={{ marginTop: spacing.lg }} />

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{m.upcomingCount}</Text>
          <Text style={styles.statLabel}>Upcoming shift</Text>
        </View>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{m.applicationsInReview}</Text>
        <Text style={styles.statLabel}>Applications in review</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{naira(m.earningsThisMonth)}</Text>
        <Text style={styles.statLabel}>Earnings this month</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{naira(m.nextShiftPay)}</Text>
        <Text style={styles.statLabel}>Expected next shift pay</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.badgeText}>CONFIRMED · NEXT SHIFT</Text>
        </View>
        <Text style={styles.cardTitle}>{m.nextShift.title}</Text>
        <Text style={styles.cardText}>{m.nextShift.date}</Text>
        <Text style={styles.cardText}>{m.nextShift.location} · Arrive at {m.nextShift.checkIn} · {naira(m.nextShift.pay)} estimated</Text>
        <PrimaryButton title="View upcoming shift" onPress={() => router.push("/(tabs)/upcoming")} style={{ marginTop: spacing.md }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Application overview</Text>
        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Under review</Text><Text style={styles.breakdownValue}>{m.applicationBreakdown.underReview} applications</Text></View>
        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Accepted</Text><Text style={styles.breakdownValue}>{m.applicationBreakdown.accepted} application</Text></View>
        <View style={styles.breakdownRow}><Text style={styles.breakdownLabel}>Not selected</Text><Text style={styles.breakdownValue}>{m.applicationBreakdown.notSelected} application</Text></View>
        <Pressable style={styles.outlineButton} onPress={() => router.push("/(tabs)/applications")}>
          <Text style={styles.outlineButtonText}>View applications</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended for you</Text>
        <View style={{ marginTop: spacing.sm }}>
          <Text style={styles.shiftTitle}>{m.recommended.title}</Text>
          <Text style={styles.cardText}>{m.recommended.facility}</Text>
          <View style={styles.matchPill}><Text style={styles.matchPillText}>{m.recommended.match}</Text></View>
          <Text style={styles.cardText}>{m.recommended.date}</Text>
          <Text style={styles.cardText}>{m.recommended.rate}</Text>
          <PrimaryButton title="View shift" onPress={() => router.push("/shift-details")} style={{ marginTop: spacing.md }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerText: { flex: 1, marginRight: spacing.md },
  bellButton: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  statRow: { flexDirection: "row" },
  statCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.md },
  statNumber: { ...typography.h2, color: colors.text },
  statLabel: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  badgeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  badgeText: { ...typography.bodySmall, color: colors.success, fontWeight: "700" },
  cardTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.xs },
  cardText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm },
  breakdownLabel: { ...typography.bodySmall, color: colors.textSecondary },
  breakdownValue: { ...typography.bodySmall, color: colors.text, fontWeight: "600" },
  outlineButton: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: "center", marginTop: spacing.md },
  outlineButtonText: { color: colors.primary, ...typography.label, fontWeight: "600" },
  shiftTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  matchPill: { backgroundColor: "#DCFCE7", alignSelf: "flex-start", borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, marginVertical: spacing.xs },
  matchPillText: { ...typography.bodySmall, color: colors.success, fontWeight: "700" },
});