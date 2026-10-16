import { useState } from "react";
import { Text, StyleSheet, ScrollView, Pressable, View, RefreshControl, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import Card from "@/components/ui/Card";
import SecondaryButton from "@/components/ui/SecondaryButton";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { useFacilityShifts } from "@/hooks/useFacilityShifts";
import ListedShiftCard from "@/components/ui/ListedShiftCard";
import { counts, filterShifts, ListFilter, ListedShift } from "@/services/facility-listing.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

// "Manage shifts": the facility Shifts tab.
// REAL shifts from GET get-facility-shifts. Buttons: open/urgent -> applicants, confirmed -> attendance QR,
// completed (not yet confirmed) -> confirm completion. Awaiting funding shifts are funded from the Payments tab.
export default function ManageShiftsScreen() {
  const { loading, loaded, error, reload } = useFacilityShifts();
  const [filter, setFilter] = useState<ListFilter>("all");
  const c = counts();
  const items = filterShifts(filter);

  const chips: { key: ListFilter; label: string }[] = [
    { key: "all", label: `All shifts · ${c.all}` },
    { key: "urgent", label: `Urgent · ${c.urgent}` },
    { key: "confirmed", label: `Confirmed · ${c.confirmed}` },
    { key: "completed", label: `Completed · ${c.completed}` },
  ];

  const action = (s: ListedShift): { label: string; go: () => void } | null => {
    if (s.kind === "urgent" || s.kind === "open") {
      return { label: "Review applicants", go: () => router.push({ pathname: "/facility/shift-applicants", params: { id: s.id } }) };
    }
    if (s.kind === "confirmed") return { label: "Show attendance QR", go: () => router.push({ pathname: "/facility/shift-qr", params: { id: s.id } }) };
    if (s.kind === "completed" && !s.confirmed) return { label: "Confirm shift is complete", go: () => router.push({ pathname: "/facility/shift-qr", params: { id: s.id } }) };
    return null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} refreshControl={<RefreshControl refreshing={loading && loaded} onRefresh={reload} />}>
      <ScreenTitle title="Manage shifts" subtitle="See which shifts need cover, who’s booked, and what’s been completed." />

      <View style={styles.chips}>
        {chips.map((ch) => (
          <Pressable key={ch.key} style={[styles.chip, filter === ch.key && styles.chipActive]} onPress={() => setFilter(ch.key)}>
            <Text style={[styles.chipText, filter === ch.key && styles.chipTextActive]}>{ch.label}</Text>
          </Pressable>
        ))}
      </View>

      <Card style={styles.listCard}>
        <Text style={styles.cardTitle}>{filter === "completed" ? "Completed shifts" : "Open and upcoming shifts"}</Text>
        {loading && !loaded ? <ActivityIndicator color={colors.primary} style={styles.loader} /> : null}
        {error ? (
          <View>
            <Text style={styles.error}>{error}</Text>
            <SecondaryButton title="Try again" onPress={reload} style={styles.loader} />
          </View>
        ) : null}
        {loaded && !error && items.length === 0 && <Text style={styles.empty}>No shifts here yet.</Text>}
        {items.map((s) => {
          const a = action(s);
          return <ListedShiftCard key={s.id} shift={s} actionLabel={a?.label} onAction={a?.go} />;
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.lg },
  chip: {
    flexGrow: 1,
    flexBasis: "47%",
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { ...typography.label, color: colors.primary, fontWeight: "600" },
  chipTextActive: { color: colors.white },
  listCard: { marginTop: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.text },
  loader: { marginTop: spacing.md },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  empty: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
});
