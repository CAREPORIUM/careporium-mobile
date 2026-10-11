import { useState } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import { AdminScreen, Card, CardTitle, EmptyText, FieldLabel, FilterChips, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getAdminStats, getDisputes } from "@/services/admin.service";
import { DisputeStatus } from "@/types/admin";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function AdminDisputesScreen() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DisputeStatus>("Open");
  const stats = getAdminStats();

  const items = getDisputes()
    .filter((d) => d.status === filter)
    .filter((d) => `${d.id} ${d.parties}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <AdminScreen>
      <ScreenTitle title="Disputes" subtitle="Review open cases and track their resolution." />

      <FieldLabel>Search disputes</FieldLabel>
      <AppInput
        placeholder="Case ID, worker or facility"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        leftIcon={<Ionicons name="search-outline" size={20} color={colors.placeholder} />}
      />
      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { value: "Open", label: `Open (${stats.openDisputes})` },
          { value: "In review", label: "In review" },
          { value: "Resolved", label: "Resolved" },
        ]}
      />

      <Card>
        <CardTitle>{filter} cases</CardTitle>
        {items.length === 0 && <EmptyText>No {filter.toLowerCase()} cases.</EmptyText>}
        {items.map((d) => (
          <View key={d.id} style={styles.item}>
            <Text style={styles.name}>{d.id}</Text>
            <InfoLine>Parties: {d.parties}</InfoLine>
            <InfoLine>Issue: {d.issue}</InfoLine>
            <InfoLine>Status: {d.status}</InfoLine>
            <Pressable onPress={() => router.push({ pathname: "/admin/dispute-detail", params: { id: d.id } })} hitSlop={8}>
              <Text style={styles.link}>Review case</Text>
            </Pressable>
          </View>
        ))}
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  item: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  name: { ...typography.label, fontWeight: "700", color: colors.text },
  link: { ...typography.bodySmall, color: colors.primary, fontWeight: "600", marginTop: spacing.md },
});
