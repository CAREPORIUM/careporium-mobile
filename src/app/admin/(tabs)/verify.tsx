import { useCallback, useState } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import { AdminScreen, Card, CardTitle, Chip, EmptyText, FieldLabel, FilterChips, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getPending } from "@/services/admin.service";
import { AdminPerson } from "@/types/admin";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Filter = "all" | "worker" | "facility";

export default function AdminVerifyScreen() {
  const [people, setPeople] = useState<AdminPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [oldestFirst, setOldestFirst] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setError("");
      getPending()
        .then((p) => alive && setPeople(p))
        .catch((e) => alive && setError(e?.message ?? "Couldn't load the queue."))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, [])
  );

  const workers = people.filter((p) => p.kind === "worker").length;
  const facilities = people.filter((p) => p.kind === "facility").length;

  const items = people
    .filter((p) => filter === "all" || p.kind === filter)
    .filter((p) => `${p.name} ${p.email} ${p.id}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort((a, b) => (oldestFirst ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt)));

  const open = (p: AdminPerson) => router.push({ pathname: "/admin/review", params: { kind: p.kind, id: p.id } });

  return (
    <AdminScreen>
      <ScreenTitle title="Verification queue" subtitle="Review submitted credentials and facility documents." />

      <FieldLabel>Search submissions</FieldLabel>
      <AppInput
        placeholder="Name, email or ID"
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
            { value: "all", label: `All (${people.length})` },
            { value: "worker", label: `Workers (${workers})` },
            { value: "facility", label: `Facilities (${facilities})` },
          ]}
        />
        <Chip label={oldestFirst ? "Oldest first" : "Newest first"} active onPress={() => setOldestFirst(!oldestFirst)} />
      </View>

      <Card>
        <CardTitle>Pending submissions</CardTitle>
        {loading ? <EmptyText>Loading…</EmptyText> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && items.length === 0 ? <EmptyText>Nothing waiting for review.</EmptyText> : null}
        {items.map((p) => {
          const sent = p.docs.filter((d) => d.url).length;
          return (
            <View key={`${p.kind}-${p.id}`} style={styles.item}>
              <Text style={styles.name}>{p.name}</Text>
              <InfoLine>
                {p.kind === "worker" ? "Worker" : "Facility"}
                {p.detail ? ` · ${p.detail}` : ""}
              </InfoLine>
              {p.email ? <InfoLine>{p.email}</InfoLine> : null}
              <InfoLine>
                Documents: {sent} of {p.docs.length} uploaded
              </InfoLine>
              <Pressable onPress={() => open(p)} hitSlop={8}>
                <Text style={styles.link}>{p.kind === "worker" ? "Review credentials" : "Review facility"}</Text>
              </Pressable>
            </View>
          );
        })}
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  chipLine: { marginTop: spacing.xs },
  item: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  name: { ...typography.label, fontWeight: "700", color: colors.text },
  link: { ...typography.bodySmall, color: colors.primary, fontWeight: "600", marginTop: spacing.md },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.sm },
});