import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import VerificationCard from "@/components/ui/VerificationCard";
import { useVerification } from "@/hooks/useVerification";
import { useFacilityShifts } from "@/hooks/useFacilityShifts";
import { useApplicants } from "@/hooks/useApplicants";
import { useProfile } from "@/hooks/useProfile";
import ListedShiftCard from "@/components/ui/ListedShiftCard";
import { filterShifts, getHomeStats } from "@/services/facility-listing.service";
import { getApplicants, waitingCount } from "@/services/facility-hiring.service";
import { getFacilityProfile, locationLine } from "@/services/facility-profile.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function FacilityHome() {
  const { verified } = useVerification();
  const { loading, loaded, error } = useFacilityShifts();
  useApplicants();
  useProfile();
  const profile = getFacilityProfile();
  const stats = getHomeStats();
  const upcoming = filterShifts("all").slice(0, 3);
  const people = getApplicants({ status: "Waiting for review" }).slice(0, 2);
  const waiting = waitingCount();

  // Not verified yet: only the verification status and the facility profile are open.
  if (!verified) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.title}>Welcome to Careporium.</Text>
          </View>
          <Pressable style={styles.iconButton} onPress={() => router.push("/facility/profile")} accessibilityLabel="Facility profile">
            <Ionicons name="person-circle-outline" size={26} color={colors.text} />
          </Pressable>
        </View>
        <Text style={styles.subtitle}>{profile.name}</Text>
        <VerificationCard />
        <Card style={styles.gap}>
          <Text style={styles.cardTitle}>A safer start for everyone</Text>
          <Text style={styles.body}>Verification lets healthcare professionals trust the facilities they work for.</Text>
        </Card>
        <Card>
          <Text style={styles.cardTitle}>Keep your details current</Text>
          <Text style={styles.body}>Check your workplace details so they're ready when verification is complete.</Text>
          <SecondaryButton title="Edit facility profile" onPress={() => router.push("/facility/profile")} style={styles.gap} />
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Keep your team ready for every shift.</Text>
        </View>
        <Pressable style={styles.iconButton} onPress={() => router.push("/facility/profile")} accessibilityLabel="Facility profile">
          <Ionicons name="person-circle-outline" size={26} color={colors.text} />
        </Pressable>
      </View>

      <Text style={styles.verified}>
        {profile.name} · {locationLine(profile)} {profile.verified ? "•  Verified facility" : ""}
      </Text>
      <Text style={styles.subtitle}>Find the right people for your shift.</Text>

      <PrimaryButton title="Post a shift" onPress={() => router.push("/facility/post-shift")} style={styles.gap} />

      <StatCard label="Open shifts" value={String(stats.openShifts)} note={`${stats.startingToday} starting today`} color={colors.primary} />
      <StatCard label="New applicants" value={String(waiting)} note="Ready for you to review" color={colors.primary} />
      <StatCard label="Urgent shifts to fill" value={String(stats.urgentToFill)} note="Find cover for these shifts" color={colors.warning} />

      {error ? <Text style={[styles.body, { color: colors.error }]}>{error}</Text> : null}
      <Text style={[styles.sectionTitle, styles.gap]}>Upcoming shifts</Text>
      <Text style={styles.subtitle}>Here’s who you need next · Times shown in WAT</Text>
      {loading && !loaded ? <Text style={styles.body}>Loading your shifts…</Text> : null}
      {loaded && upcoming.length === 0 ? <Text style={styles.body}>No shifts yet. Post your first shift.</Text> : null}
      {upcoming.map((s) => (
        <ListedShiftCard key={s.id} shift={s} />
      ))}
      <SecondaryButton title="Manage shifts" onPress={() => router.push("/facility/shifts")} style={styles.gap} />

      <Card style={styles.gap}>
        <Text style={styles.cardTitle}>New applicants</Text>
        <Text style={styles.body}>
          {waiting} {waiting === 1 ? "person is" : "people are"} waiting to hear from you
        </Text>
        {people.map((a) => (
          <View key={a.id} style={styles.applicant}>
            <Text style={styles.applicantName}>{a.name}</Text>
            <Text style={styles.body}>{[a.profession, a.specialty].filter(Boolean).join(" · ")}</Text>
            <Text style={styles.good}>Applied for {a.shiftTitle}</Text>
          </View>
        ))}
        <PrimaryButton title="Review applicants" onPress={() => router.push("/facility/hiring")} style={styles.gap} />
      </Card>
    </ScrollView>
  );
}

function StatCard({ label, value, note, color }: { label: string; value: string; note: string; color: string }) {
  return (
    <Card>
      <Text style={styles.body}>{label}</Text>
      <Text style={[styles.big, { color }]}>{value}</Text>
      <Text style={styles.body}>{note}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  headerRow: { flexDirection: "row", alignItems: "flex-start" },
  headerText: { flex: 1, marginRight: spacing.md },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: radius.round,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { ...typography.h2, color: colors.text },
  verified: { ...typography.label, color: colors.success, fontWeight: "700", marginTop: spacing.md },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  gap: { marginTop: spacing.lg },
  sectionTitle: { ...typography.h3, color: colors.text },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  big: { ...typography.h1, marginTop: spacing.sm },
  applicant: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  applicantName: { ...typography.label, color: colors.text, fontWeight: "700" },
  good: { ...typography.bodySmall, color: colors.success, marginTop: spacing.xs },
});