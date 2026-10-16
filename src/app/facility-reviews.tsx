import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Stars from "@/components/ui/Stars";
import SelectField from "@/components/ui/SelectField";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { getFacilityProfile } from "@/services/facility-profile.service";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

// WORKER-facing page: what healthcare workers say about a facility.
// MOCK. The backend has no ratings or reviews yet.
type Review = { id: string; who: string; stars: number; date: string; sortKey: number; text: string };

const REVIEWS: Review[] = [
  { id: "r1", who: "Amara O. · Registered nurse", stars: 5, date: "28 Sep 2026", sortKey: 20260928, text: "Clear handover and a supportive ward team. The shift matched the posted details." },
  { id: "r2", who: "Tunde A. · Medical laboratory scientist", stars: 4, date: "24 Sep 2026", sortKey: 20260924, text: "The coordinator was helpful and equipment was ready. Arrival instructions could be clearer." },
];

const SORTS = ["Most recent", "Highest rated", "Lowest rated"];

const CATEGORIES = [
  ["Work environment", "4.8"],
  ["Shift accuracy", "4.7"],
  ["Staff support", "4.9"],
  ["Payment experience", "4.8"],
];

export default function FacilityReviewsScreen() {
  const profile = getFacilityProfile();
  const [sort, setSort] = useState(SORTS[0]);

  const list = [...REVIEWS].sort((a, b) => (sort === "Highest rated" ? b.stars - a.stars : sort === "Lowest rated" ? a.stars - b.stars : b.sortKey - a.sortKey));

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title={profile.name} subtitle={`Verified healthcare facility · ${profile.area}, ${profile.state}`} onBack={() => goBack("/(tabs)")} />

      <Card style={styles.gap}>
        <Badge text="VERIFIED FACILITY" tone="success" />
        <Text style={styles.score}>4.8 / 5</Text>
        <View style={styles.starsRow}>
          <Stars value={4.8} size={20} />
          <Text style={styles.count}> · 42 worker reviews</Text>
        </View>
        <Text style={styles.body}>Reviews from completed, verified shifts.</Text>

        {CATEGORIES.map(([label, value]) => (
          <View key={label} style={styles.catRow}>
            <Text style={styles.cat}>{label}</Text>
            <Text style={styles.catValue}>{value}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.h2}>What healthcare workers say</Text>
      <SelectField label="Sort reviews" value={sort} options={SORTS} onChange={setSort} />

      {list.map((r) => (
        <Card key={r.id}>
          <Text style={styles.who}>{r.who}</Text>
          <View style={styles.starsRow}>
            <Stars value={r.stars} size={16} />
            <Text style={styles.verified}> · {r.date} · Verified completed shift</Text>
          </View>
          <Text style={styles.body}>{r.text}</Text>
        </Card>
      ))}

      <PrimaryButton title="View available shifts" onPress={() => router.replace("/(tabs)/shifts")} style={styles.gap} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  score: { ...typography.h1, color: colors.text, marginTop: spacing.md },
  starsRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: spacing.sm },
  count: { ...typography.label, color: colors.warning },
  verified: { ...typography.bodySmall, color: colors.success },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  catRow: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md },
  cat: { ...typography.bodySmall, color: colors.text },
  catValue: { ...typography.bodySmall, color: colors.text, fontWeight: "700" },
  h2: { ...typography.h3, color: colors.text, marginTop: spacing.xl },
  who: { ...typography.label, color: colors.text, fontWeight: "700" },
});
