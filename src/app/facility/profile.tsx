import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import FormInput from "@/components/ui/FormInput";
import SelectField from "@/components/ui/SelectField";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useLogout } from "@/hooks/useLogout";
import { FACILITY_TYPES, FacilityProfile, getFacilityProfile, locationLine, saveFacilityProfile } from "@/services/facility-profile.service";
import { colors, spacing, typography } from "@/constants/theme";

type Mode = "view" | "edit" | "saved";

// Facility profile: view, edit workplace details, "Profile updated" confirmation.
export default function FacilityProfileScreen() {
  const { user } = useAuth();
  const { handleLogout, loggingOut } = useLogout();
  const [mode, setMode] = useState<Mode>("view");
  useProfile(); // loads the real facility profile and re-renders when it arrives
  const profile = getFacilityProfile();
  const [form, setForm] = useState<FacilityProfile>(getFacilityProfile());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const save = async () => {
    if (saving) return;
    if (!form.name.trim() || !form.address.trim() || !form.area.trim()) {
      setError("Add the facility name, address and area.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await saveFacilityProfile(form);
      setMode("saved");
    } catch (e: any) {
      setError(e.message ?? "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  if (mode === "saved") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenTitle title="Profile updated." subtitle="Your workplace details are up to date." />
        <Card style={styles.gap}>
          <Text style={styles.success}>Your changes are saved</Text>
          <Text style={styles.body}>Professionals will now see these updated details on your profile.</Text>
          <PrimaryButton title="Back to facility profile" onPress={() => setMode("view")} style={styles.gap} />
        </Card>
      </ScrollView>
    );
  }

  if (mode === "edit") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle title="Edit workplace details" subtitle="Professionals see these details on your profile." />
        <Card style={styles.gap}>
          <FormInput label="Facility name" value={form.name} onChangeText={(t) => setForm({ ...form, name: t })} style={{ marginTop: 0 }} />
          <SelectField label="Facility type" value={form.type} options={FACILITY_TYPES} onChange={(v) => setForm({ ...form, type: v })} />
          <FormInput label="Address" value={form.address} onChangeText={(t) => setForm({ ...form, address: t })} />
          <FormInput label="Area" value={form.area} onChangeText={(t) => setForm({ ...form, area: t })} />
          <FormInput label="State" value={form.state} onChangeText={(t) => setForm({ ...form, state: t })} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton title="Save changes" onPress={save} loading={saving} style={styles.gap} />
          <SecondaryButton
            title="Cancel"
            onPress={() => {
              setForm(profile);
              setError("");
              setMode("view");
            }}
            style={styles.gapSmall}
          />
        </Card>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Facility profile" subtitle="How professionals see your workplace." onBack={() => router.back()} />
      <Card style={styles.gap}>
        <Text style={styles.name}>{profile.name}</Text>
        {profile.verified && <Badge text="VERIFIED FACILITY" tone="success" style={styles.badge} />}
        <Row label="Facility type" value={profile.type} />
        <Row label="Address" value={profile.address} />
        <Row label="Area" value={locationLine(profile)} />
        <SecondaryButton
          title="Edit workplace details"
          onPress={() => {
            setForm(profile);
            setMode("edit");
          }}
          style={styles.gap}
        />
      </Card>

      <View style={styles.account}>
        {user?.email ? <Text style={styles.body}>Signed in as {user.email}</Text> : null}
        {loggingOut ? <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} /> : <SecondaryButton title="Log out" onPress={handleLogout} style={{ marginTop: spacing.md }} />}
      </View>
    </ScrollView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={styles.body}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  name: { ...typography.h3, color: colors.text },
  badge: { marginTop: spacing.md },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  value: { ...typography.label, color: colors.text, fontWeight: "600" },
  success: { ...typography.h2, color: colors.success },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  account: { marginTop: spacing.xl },
});