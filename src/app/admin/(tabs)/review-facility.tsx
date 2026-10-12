import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, BackLink, Card, CardTitle, CheckRow, FieldLabel, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getFacilityReview } from "@/services/admin.service";
import { colors, spacing, typography } from "@/constants/theme";

const CHECKS = ["Registration confirmed", "Operating licence valid", "Address and contact checked"];

export default function ReviewFacilityScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const facility = getFacilityReview(id);
  const [checked, setChecked] = useState<boolean[]>(CHECKS.map(() => false));
  const [notes, setNotes] = useState("");

  const allChecked = checked.every(Boolean);
  const toggle = (i: number) => setChecked(checked.map((c, idx) => (idx === i ? !c : c)));
  const openDoc = (name: string) => Alert.alert(name, "Document viewer coming soon.");

  const approve = () =>
    router.replace({ pathname: "/admin/verification-decision", params: { result: "approved" } });

  const reject = () => {
    if (!notes.trim()) {
      Alert.alert("Reason required", "Add a rejection reason so the facility knows what to fix.");
      return;
    }
    router.replace({ pathname: "/admin/verification-decision", params: { result: "rejected", reason: notes.trim() } });
  };

  return (
    <AdminScreen>
      <BackLink fallback="/admin/verify" label="Back to queue" />
      <ScreenTitle title="Review facility verification" subtitle={`${facility.name} · Submission ${facility.id}`} />

      <Card>
        <CardTitle>Facility information</CardTitle>
        <Text style={styles.line}>{facility.summary}</Text>
        <Text style={styles.line}>{facility.contact}</Text>
        <Text style={styles.line}>{facility.contactDetails}</Text>

        <Text style={styles.sectionTitle}>Registration & operating documents</Text>
        <SecondaryButton title="Open registration document" onPress={() => openDoc("Registration document")} style={styles.docButton} />
        <SecondaryButton title="Open operating licence" onPress={() => openDoc("Operating licence")} style={styles.docButton} />
        <SecondaryButton title="Open address evidence" onPress={() => openDoc("Address evidence")} style={styles.docButton} />

        <InfoLine>Check that the legal name, address, authorised contact and operating documents are consistent.</InfoLine>
      </Card>

      <Card>
        <CardTitle>Verification decision</CardTitle>
        {CHECKS.map((label, i) => (
          <CheckRow key={label} label={label} checked={checked[i]} onToggle={() => toggle(i)} />
        ))}

        <FieldLabel>Review notes / rejection reason</FieldLabel>
        <AppInput placeholder="Add your findings" value={notes} onChangeText={setNotes} multiline numberOfLines={4} />

        <PrimaryButton title="Approve facility" disabled={!allChecked} onPress={approve} style={{ marginTop: spacing.lg }} />
        <SecondaryButton title="Reject submission" onPress={reject} style={{ marginTop: spacing.md }} />
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  docButton: { marginTop: spacing.md },
  sectionTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.lg },
});
