import { useState } from "react";
import { Text, StyleSheet, Pressable, View, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, Card, CardTitle, EmptyText, FieldLabel, FilterChips, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getAccounts } from "@/services/admin.service";
import { Account, AccountAccess } from "@/types/admin";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Filter = "all" | "Worker" | "Facility" | "Verified" | "Suspended";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All users" },
  { value: "Worker", label: "Workers" },
  { value: "Facility", label: "Facilities" },
  { value: "Verified", label: "Verified" },
  { value: "Suspended", label: "Suspended" },
];

export default function AdminUsersScreen() {
  const [accounts, setAccounts] = useState<Account[]>(getAccounts());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const [reason, setReason] = useState("");

  const selected = accounts.find((a) => a.id === selectedId) ?? accounts[0];
  const suspended = selected.access === "Suspended";

  const visible = accounts
    .filter((a) => {
      if (filter === "all") return true;
      if (filter === "Verified") return a.verification === "Verified";
      if (filter === "Suspended") return a.access === "Suspended";
      return a.role === filter;
    })
    .filter((a) => `${a.name} ${a.email} ${a.id}`.toLowerCase().includes(query.trim().toLowerCase()));

  const setAccess = (access: AccountAccess) => {
    setAccounts(accounts.map((a) => (a.id === selected.id ? { ...a, access } : a)));
    setReason("");
  };

  const handleAccessChange = () => {
    if (!suspended && !reason.trim()) {
      Alert.alert("Reason required", "Add a reason before suspending an account.");
      return;
    }
    const verb = suspended ? "Re-enable" : "Suspend";
    Alert.alert(
      `${verb} account?`,
      suspended
        ? `${selected.name} will regain access.`
        : `${selected.name} will lose access immediately. Reason: ${reason.trim()}`,
      [
        { text: "Cancel", style: "cancel" },
        { text: verb, style: suspended ? "default" : "destructive", onPress: () => setAccess(suspended ? "Active" : "Suspended") },
      ]
    );
  };

  const viewProfile = () => {
    if (selected.role === "Worker") router.push("/worker-profile");
    else Alert.alert("Facility profile", "Facility profile view is coming soon.");
  };

  return (
    <AdminScreen>
      <ScreenTitle title="Manage users" subtitle="Find healthcare workers and facilities, view status and manage access." />

      <FieldLabel>Search users</FieldLabel>
      <AppInput
        placeholder="Name, email or account ID"
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
        leftIcon={<Ionicons name="search-outline" size={20} color={colors.placeholder} />}
      />
      <FilterChips value={filter} onChange={setFilter} options={FILTERS} />

      <Card>
        <CardTitle>Accounts</CardTitle>
        {visible.length === 0 && <EmptyText>No accounts match your search.</EmptyText>}
        {visible.map((a) => (
          <View key={a.id} style={[styles.item, a.id === selected.id && styles.itemSelected]}>
            <Text style={styles.name}>{a.name}</Text>
            <InfoLine>Role: {a.role}</InfoLine>
            <InfoLine>Verification: {a.verification}</InfoLine>
            <InfoLine>Access: {a.access}</InfoLine>
            <Pressable onPress={() => setSelectedId(a.id)} hitSlop={8}>
              <Text style={styles.link}>View account</Text>
            </Pressable>
          </View>
        ))}
      </Card>

      <Card>
        <CardTitle>Selected account · {selected.name}</CardTitle>
        <InfoLine>{selected.role} · {selected.email} · {selected.verification}</InfoLine>
        <InfoLine>{selected.completedShifts} completed shifts · Last active {selected.lastActive} · Account {selected.id}</InfoLine>

        {!suspended && (
          <>
            <FieldLabel>Reason for access change</FieldLabel>
            <AppInput placeholder="Required when suspending an account" value={reason} onChangeText={setReason} multiline numberOfLines={3} />
          </>
        )}

        <SecondaryButton title="View profile" onPress={viewProfile} style={{ marginTop: spacing.lg }} />
        <SecondaryButton title={suspended ? "Re-enable account" : "Suspend account"} onPress={handleAccessChange} style={{ marginTop: spacing.md }} />

        <InfoLine>Suspension confirmation: confirm the reason before disabling access. Re-enable access after review.</InfoLine>
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  item: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  itemSelected: { borderColor: colors.primary },
  name: { ...typography.label, fontWeight: "700", color: colors.text },
  link: { ...typography.bodySmall, color: colors.primary, fontWeight: "600", marginTop: spacing.md },
});
