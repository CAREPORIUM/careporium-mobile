import { useCallback, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router, useFocusEffect } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { AdminScreen, Card, CardTitle, EmptyText, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getPending, getStats } from "@/services/admin.service";
import { AdminPerson, StatLine } from "@/types/admin";
import { colors, spacing, typography } from "@/constants/theme";

export default function AdminHomeScreen() {
  const [stats, setStats] = useState<StatLine[]>([]);
  const [pending, setPending] = useState<AdminPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        setError("");
        const [s, p] = await Promise.allSettled([getStats(), getPending()]);
        if (!alive) return;
        if (s.status === "fulfilled") setStats(s.value);
        if (p.status === "fulfilled") setPending(p.value);
        if (s.status === "rejected" && p.status === "rejected") setError((s.reason as any)?.message ?? "Couldn't load the dashboard.");
        setLoading(false);
      })();
      return () => {
        alive = false;
      };
    }, [])
  );

  const workers = pending.filter((p) => p.kind === "worker").length;
  const facilities = pending.filter((p) => p.kind === "facility").length;
  const withDocs = pending.filter((p) => p.docs.some((d) => d.url)).length;

  return (
    <AdminScreen>
      <ScreenTitle title="Marketplace overview" subtitle="Live numbers from the platform." />

      {loading ? <EmptyText>Loading…</EmptyText> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Card>
        <CardTitle>Waiting for verification</CardTitle>
        <Text style={styles.big}>{pending.length}</Text>
        <InfoLine>
          {workers} {workers === 1 ? "worker" : "workers"} · {facilities} {facilities === 1 ? "facility" : "facilities"} · {withDocs} with documents to review
        </InfoLine>
        <PrimaryButton title="Open verification queue" onPress={() => router.push("/admin/verify")} style={{ marginTop: spacing.md }} />
      </Card>

      {stats.length > 0 ? (
        <Card>
          <CardTitle>Platform statistics</CardTitle>
          {stats.map((s) => (
            <View key={s.label} style={styles.row}>
              <Text style={styles.label}>{s.label}</Text>
              <Text style={styles.value}>{s.value}</Text>
            </View>
          ))}
        </Card>
      ) : null}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  big: { ...typography.h1, color: colors.text, marginTop: spacing.xs },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.sm },
  label: { ...typography.bodySmall, color: colors.textSecondary, flex: 1, paddingRight: spacing.md },
  value: { ...typography.bodySmall, color: colors.text, fontWeight: "700" },
  error: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.md },
});