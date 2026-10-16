import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import { router, useFocusEffect } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getShifts } from "@/services/shift.service";
import { Shift } from "@/types/shift";
import { colors, radius, spacing, typography } from "@/constants/theme";

const SORTS = ["Soonest", "Newest", "Highest pay"];

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function ShiftsScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string | null>(SORTS[0]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setShifts(await getShifts());
      setLoaded(true);
    } catch (e: any) {
      setError(e.message ?? "Couldn't load shifts. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const q = search.trim().toLowerCase();
  const list = shifts
    .filter((s) => !q || `${s.title} ${s.facility} ${s.location}`.toLowerCase().includes(q))
    .sort((a, b) => {
      if (sort === "Highest pay") return b.total - a.total;
      if (sort === "Newest") return b.createdAt.localeCompare(a.createdAt);
      return a.sortKey.localeCompare(b.sortKey);
    });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading && loaded} onRefresh={load} />}
    >
      <Text style={styles.eyebrow}>SHIFT MARKETPLACE</Text>
      <Text style={styles.title}>Find your next healthcare shift.</Text>
      <Text style={styles.subtitle}>Open shifts from facilities across Lagos. Pick the ones that fit your specialty and availability.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Search shifts</Text>
        <AppInput placeholder="Role, specialty, facility or area" value={search} onChangeText={setSearch} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Sort shifts</Text>
        <AppSelect placeholder="Soonest" value={sort} options={SORTS} onChange={setSort} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Open shifts</Text>
        <View style={styles.resultsPill}>
          <Text style={styles.resultsPillText}>{list.length} RESULTS</Text>
        </View>

        {loading && !loaded ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} /> : null}

        {error ? (
          <View>
            <Text style={styles.error}>{error}</Text>
            <PrimaryButton title="Try again" onPress={load} style={{ marginTop: spacing.md }} />
          </View>
        ) : null}

        {loaded && !error && list.length === 0 ? <Text style={styles.cardText}>No open shifts right now. Pull down to refresh.</Text> : null}

        {list.map((shift) => (
          <View key={shift.id} style={styles.shiftCard}>
            <Text style={styles.shiftTitle}>{shift.title}</Text>
            <Text style={styles.shiftFacility}>{shift.facility}</Text>

            {shift.tag ? (
              <View style={styles.tagPill}>
                <Text style={styles.tagPillText}>{shift.tag}</Text>
              </View>
            ) : null}

            <Text style={styles.shiftMeta}>
              {shift.date} · {shift.time}
              {shift.location ? ` · ${shift.location}` : ""}
            </Text>
            <Text style={styles.shiftRate}>
              {naira(shift.total)} per person{shift.hours > 0 ? ` · ${shift.hours}h` : ""}
            </Text>

            <PrimaryButton
              title="View shift"
              onPress={() => router.push({ pathname: "/shift-details", params: { id: shift.id } })}
              style={{ marginTop: spacing.md }}
            />
          </View>
        ))}

        <Text style={styles.footnote}>All times are WAT</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  cardTitle: { ...typography.h3, color: colors.text },
  cardText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  resultsPill: { backgroundColor: colors.primaryLight, alignSelf: "flex-start", borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, marginTop: spacing.sm, marginBottom: spacing.md },
  resultsPillText: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  shiftCard: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  shiftTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  shiftFacility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  tagPill: { alignSelf: "flex-start", backgroundColor: colors.warningLight, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, marginTop: spacing.sm },
  tagPillText: { ...typography.bodySmall, color: colors.warning, fontWeight: "700" },
  shiftMeta: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
  shiftRate: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.xs },
  footnote: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm },
});