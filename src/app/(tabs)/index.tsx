import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import VerificationCard from "@/components/ui/VerificationCard";
import { useVerification } from "@/hooks/useVerification";
import { useWorkerData } from "@/hooks/useWorkerData";
import { useProfile } from "@/hooks/useProfile";
import { earningsThisMonth, getCounts, getNextShift, getRecommended, getUpcoming } from "@/services/worker-data.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function HomeScreen() {
  const { verified } = useVerification();
  const { firstName } = useProfile();
  const { loading, loaded, error } = useWorkerData();
  const counts = getCounts();
  const next = getNextShift();
  const rec = getRecommended();
  const upcomingCount = getUpcoming().length;

  const header = (
    <View style={styles.headerRow}>
      <View style={styles.headerText}>
        <Text style={styles.eyebrow}>YOUR WORKSPACE</Text>
        <Text style={styles.title}>Good morning{firstName ? `, ${firstName}` : ""}.</Text>
      </View>
      <View style={styles.headerActions}>
        <Pressable style={styles.bellButton} onPress={() => router.push("/notifications")} accessibilityLabel="Notifications">
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </Pressable>
        <Pressable style={styles.bellButton} onPress={() => router.push("/(tabs)/profile")} accessibilityLabel="Profile">
          <Ionicons name="person-circle-outline" size={26} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );

  // Not verified yet: only the verification status, profile and notifications are open.
  if (!verified) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {header}
        <VerificationCard />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>A safer start for everyone</Text>
          <Text style={styles.cardText}>Verification helps facilities confirm that you're qualified and ready to join their team.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Make your profile yours</Text>
          <Text style={styles.cardText}>Check your specialty, experience and preferred locations so you're ready when verification is complete.</Text>
          <Pressable style={styles.outlineButton} onPress={() => router.push("/experience")}>
            <Text style={styles.outlineButtonText}>Update my profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {header}
      <Text style={styles.subtitle}>Your shifts, applications, and earnings in one place.</Text>

      <PrimaryButton title="Find shifts" onPress={() => router.push("/(tabs)/shifts")} style={{ marginTop: spacing.lg }} />

      {error ? <Text style={[styles.cardText, { color: colors.error, marginTop: spacing.md }]}>{error}</Text> : null}
      {loading && !loaded ? <Text style={[styles.cardText, { marginTop: spacing.md }]}>Loading your shifts…</Text> : null}

      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{upcomingCount}</Text>
        <Text style={styles.statLabel}>{upcomingCount === 1 ? "Upcoming shift" : "Upcoming shifts"}</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{counts.underReview}</Text>
        <Text style={styles.statLabel}>Applications in review</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{naira(earningsThisMonth())}</Text>
        <Text style={styles.statLabel}>Earnings this month</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statNumber}>{naira(next?.shift?.total ?? 0)}</Text>
        <Text style={styles.statLabel}>Expected next shift pay</Text>
      </View>

      <View style={styles.card}>
        {next?.shift ? (
          <>
            <View style={styles.badgeRow}>
              <Ionicons name="checkmark-circle" size={14} color={colors.success} />
              <Text style={styles.badgeText}>CONFIRMED · NEXT SHIFT</Text>
            </View>
            <Text style={styles.cardTitle}>{next.shift.title}</Text>
            <Text style={styles.cardText}>{next.facility}</Text>
            <Text style={styles.cardText}>
              {next.shift.date} · {next.shift.time}
            </Text>
            <Text style={styles.cardText}>
              {next.shift.location} · {naira(next.shift.total)}
            </Text>
            <PrimaryButton title="View upcoming shift" onPress={() => router.push("/(tabs)/upcoming")} style={{ marginTop: spacing.md }} />
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>No confirmed shift yet</Text>
            <Text style={styles.cardText}>When a facility accepts your application, your next shift appears here.</Text>
          </>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Application overview</Text>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Under review</Text>
          <Text style={styles.breakdownValue}>{counts.underReview}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Accepted</Text>
          <Text style={styles.breakdownValue}>{counts.accepted}</Text>
        </View>
        <View style={styles.breakdownRow}>
          <Text style={styles.breakdownLabel}>Not selected</Text>
          <Text style={styles.breakdownValue}>{counts.notSelected}</Text>
        </View>
        <Pressable style={styles.outlineButton} onPress={() => router.push("/(tabs)/applications")}>
          <Text style={styles.outlineButtonText}>View applications</Text>
        </Pressable>
      </View>

      {rec ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Open for you</Text>
          <View style={{ marginTop: spacing.sm }}>
            <Text style={styles.shiftTitle}>{rec.title}</Text>
            <Text style={styles.cardText}>{rec.facility}</Text>
            <Text style={styles.cardText}>
              {rec.date} · {rec.time} · {rec.location}
            </Text>
            <Text style={styles.cardText}>{naira(rec.total)} for the shift</Text>
            <PrimaryButton title="View shift" onPress={() => router.push({ pathname: "/shift-details", params: { id: rec.id } })} style={{ marginTop: spacing.md }} />
          </View>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerText: { flex: 1, marginRight: spacing.md },
  headerActions: { flexDirection: "row", gap: spacing.sm },
  bellButton: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
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
});