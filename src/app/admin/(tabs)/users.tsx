import { useCallback, useState } from "react";
import { Text, StyleSheet, Pressable, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import { AdminScreen, Card, CardTitle, EmptyText, FieldLabel, FilterChips, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getEveryone } from "@/services/admin.service";
import { AdminPerson } from "@/types/admin";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Filter = "all" | "worker" | "facility" | "verified" | "pending";

const STATUS_TEXT = { verified: "Verified", pending: "Pending", rejected: "Rejected" } as const;

export default function AdminUsersScreen() {
  const [people, setPeople] = useState<AdminPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      setError("");
      getEveryone()
        .then((p) => alive && setPeople(p))
        .catch((e) => alive && setError(e?.message ?? "Couldn't load users."))
        .finally(() => alive && setLoading(false));
      return () => {
        alive = false;
      };
    }, [])
  );

  const visible = people
    .filter((p) => {
      if (filter === "all") return true;
      if (filter === "verified") return p.status === "verified";
      if (filter === "pending") return p.status !== "verified";
      return p.kind === filter;
    })
    .filter((p) => `${p.name} ${p.email} ${p.id}`.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <AdminScreen>
      <ScreenTitle title="Users" subtitle="Healthcare workers and facilities on the platform." />

      <FieldLabel>Search users</FieldLabel>
      <AppInput
        placeholder="Name, email or ID"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        leftIcon={<Ionicons name="search-outline" size={20} color={colors.placeholder} />}
      />

      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: `All (${people.length})` },
          { value: "worker", label: "Workers" },
          { value: "facility", label: "Facilities" },
          { value: "verified", label: "Verified" },
          { value: "pending", label: "Not verified" },
        ]}
      />

      <Card>
        <CardTitle>{visible.length} {visible.length === 1 ? "account" : "accounts"}</CardTitle>
        {loading ? <EmptyText>Loading…</EmptyText> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && !error && visible.length === 0 ? <EmptyText>No users match.</EmptyText> : null}
        {visible.map((p) => (
          <Pressable key={`${p.kind}-${p.id}`} style={styles.item} onPress={() => router.push({ pathname: "/admin/review", params: { kind: p.kind, id: p.id } })}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{p.name}</Text>
              <InfoLine>
                {p.kind === "worker" ? "Worker" : "Facility"}
                {p.detail ? ` · ${p.detail}` : ""}
              </InfoLine>
              {p.email ? <InfoLine>{p.email}</InfoLine> : null}
            </View>
            <Text style={[styles.status, p.status === "verified" && styles.ok, p.status === "rejected" && styles.bad]}>{STATUS_TEXT[p.status]}</Text>
          </Pressable>
        ))}
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  name: { ...typography.label, fontWeight: "700", color: colors.text },
  status: { ...typography.bodySmall, color: colors.warning, fontWeight: "700", marginLeft: spacing.md },
  ok: { color: colors.success },
  bad: { color: colors.error },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.sm },
});