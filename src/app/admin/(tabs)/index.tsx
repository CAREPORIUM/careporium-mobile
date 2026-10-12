import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, Card, CardTitle, ScreenTitle } from "@/components/admin/AdminUI";
import { getAdminStats } from "@/services/admin.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
}

export default function AdminHomeScreen() {
  const stats = getAdminStats();
  const maxCount = Math.max(...stats.completedLast7Days.map((d) => d.count));

  return (
    <AdminScreen>
      <ScreenTitle title="Marketplace overview" subtitle="Today · 2 October 2026 · Illustrative dashboard data" />

      <StatCard title="Healthcare workers" value={`${stats.workers.total.toLocaleString()} total · ${stats.workers.verified.toLocaleString()} verified`} />
      <StatCard title="Facilities" value={`${stats.facilities.total} total · ${stats.facilities.verified} verified`} />
      <StatCard title="Pending verifications" value={`${stats.pendingVerifications} submissions`} />
      <StatCard title="Active shifts" value={`${stats.activeShifts} shifts`} />
      <StatCard title="Completed shifts" value={`${stats.completedShifts.toLocaleString()} shifts`} />
      <StatCard title="Open disputes" value={`${stats.openDisputes} cases`} />

      <Card>
        <CardTitle>Payment activity</CardTitle>
        <Text style={styles.statValue}>{stats.payments.released} released this week</Text>
        <Text style={styles.small}>{stats.payments.funded} funded · awaiting completion</Text>
        <Text style={styles.small}>{stats.payments.failures} payment failures need review</Text>
        <SecondaryButton title="View activity" onPress={() => router.push("/admin/activity")} style={{ marginTop: spacing.md }} />
      </Card>

      <Card>
        <CardTitle>Completed shifts · last 7 days</CardTitle>
        {stats.completedLast7Days.map((d) => (
          <View key={d.day} style={styles.barRow}>
            <Text style={styles.barDay}>{d.day}</Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${(d.count / maxCount) * 100}%` }]} />
            </View>
            <Text style={styles.barCount}>{d.count}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.priority}>
        Priority actions: {stats.pendingVerifications} verifications to review · {stats.openDisputes} open disputes · {stats.payments.failures} payment failures
      </Text>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  statValue: { ...typography.label, fontWeight: "600", color: colors.text, marginTop: spacing.xs },
  small: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  barRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.md },
  barDay: { ...typography.bodySmall, color: colors.text, width: 36 },
  barTrack: { flex: 1, height: 14, borderRadius: radius.round, backgroundColor: colors.primaryLight, overflow: "hidden" },
  barFill: { height: 14, borderRadius: radius.round, backgroundColor: colors.primary },
  barCount: { ...typography.bodySmall, color: colors.text, width: 32, textAlign: "right" },
  priority: { ...typography.bodySmall, color: colors.primary, marginTop: spacing.sm },
});
