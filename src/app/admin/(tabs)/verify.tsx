import { useState } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import { AdminScreen, Card, CardTitle, Chip, EmptyText, FieldLabel, FilterChips, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getSubmissionCounts, getSubmissions } from "@/services/admin.service";
import { Submission } from "@/types/admin";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Filter = "all" | "Worker" | "Facility";

export default function AdminVerifyScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [oldestFirst, setOldestFirst] = useState(false);
  const counts = getSubmissionCounts();

  const items = getSubmissions()
    .filter((s) => filter === "all" || s.type === filter)
    .filter((s) => `${s.name} ${s.id}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (oldestFirst ? a.submittedAt.localeCompare(b.submittedAt) : b.submittedAt.localeCompare(a.submittedAt)));

  const openReview = (s: Submission) =>
    router.push({
      pathname: s.type === "Worker" ? "/admin/review-worker" : "/admin/review-facility",
      params: { id: s.id },
    });

  return (
    <AdminScreen>
      <ScreenTitle title="Verification queue" subtitle="Review submitted credentials and facility documents." />

      <FieldLabel>Search submissions</FieldLabel>
      <AppInput
        placeholder="Name, facility or submission ID"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        leftIcon={<Ionicons name="search-outline" size={20} color={colors.placeholder} />}
      />

      <View style={styles.chipLine}>
        <FilterChips
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `All (${counts.all})` },
            { value: "Worker", label: `Workers (${counts.workers})` },
            { value: "Facility", label: `Facilities (${counts.facilities})` },
          ]}
        />
        <Chip label={oldestFirst ? "Oldest first" : "Newest first"} active onPress={() => setOldestFirst(!oldestFirst)} />
      </View>

      <Card>
        <CardTitle>Pending submissions</CardTitle>
        {items.length === 0 && <EmptyText>No submissions match your search.</EmptyText>}
        {items.map((s) => (
          <View key={s.id} style={styles.item}>
            <Text style={styles.name}>{s.name}</Text>
            <InfoLine>Type: {s.type}{s.detail ? ` · ${s.detail}` : ""}</InfoLine>
            <InfoLine>Submitted: {s.submitted}</InfoLine>
            <InfoLine>Status: {s.status}</InfoLine>
            <Pressable onPress={() => openReview(s)} hitSlop={8}>
              <Text style={styles.link}>{s.type === "Worker" ? "Review credentials" : "Review facility"}</Text>
            </Pressable>
          </View>
        ))}
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  chipLine: { marginTop: spacing.xs },
  item: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  name: { ...typography.label, fontWeight: "700", color: colors.text },
  link: { ...typography.bodySmall, color: colors.primary, fontWeight: "600", marginTop: spacing.md },
});
