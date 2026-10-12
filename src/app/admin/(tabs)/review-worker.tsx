import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, BackLink, Card, CardTitle, CheckRow, FieldLabel, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getWorkerReview } from "@/services/admin.service";
import { colors, spacing, typography } from "@/constants/theme";

const CHECKS = ["Name and identity match", "Licence is active and verified", "Required certificates are valid"];

export default function ReviewWorkerScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const worker = getWorkerReview(id);
  const [checked, setChecked] = useState<boolean[]>(CHECKS.map(() => false));
  const [notes, setNotes] = useState("");

  const allChecked = checked.every(Boolean);
  const toggle = (i: number) => setChecked(checked.map((c, idx) => (idx === i ? !c : c)));
  const openDoc = (name: string) => Alert.alert(name, "Document viewer coming soon.");

  const approve = () =>
    router.replace({ pathname: "/admin/verification-decision", params: { result: "approved" } });

  const reject = () => {
    if (!notes.trim()) {
      Alert.alert("Reason required", "Add a rejection reason so the worker knows what to fix.");
      return;
    }
    router.replace({ pathname: "/admin/verification-decision", params: { result: "rejected", reason: notes.trim() } });
  };

  return (
    <AdminScreen>
      <BackLink fallback="/admin/verify" label="Back to queue" />
      <ScreenTitle title="Review worker credentials" subtitle={`${worker.name} · ${worker.role} · Submission ${worker.id}`} />

      <Card>
        <CardTitle>Submitted credentials</CardTitle>
        <Text style={styles.line}>{worker.licence}</Text>
        <Text style={styles.line}>{worker.licenceMeta}</Text>
        <SecondaryButton title="Open licence document" onPress={() => openDoc("Licence document")} style={styles.docButton} />

        <Text style={[styles.line, { marginTop: spacing.md }]}>{worker.certification}</Text>
        <SecondaryButton title="Open certification" onPress={() => openDoc("Certification")} style={styles.docButton} />

        <Text style={[styles.line, { marginTop: spacing.md }]}>{worker.identity}</Text>
        <Text style={styles.line}>{worker.profileLine}</Text>

        <Text style={styles.sectionTitle}>Document preview</Text>
        <InfoLine>Select a document to inspect the original uploaded file. Check the issuing body, name, number and expiry.</InfoLine>
      </Card>

      <Card>
        <CardTitle>Review decision</CardTitle>
        {CHECKS.map((label, i) => (
          <CheckRow key={label} label={label} checked={checked[i]} onToggle={() => toggle(i)} />
        ))}

        <FieldLabel>Review notes / rejection reason</FieldLabel>
        <AppInput placeholder="Add your findings" value={notes} onChangeText={setNotes} multiline numberOfLines={4} />

        <PrimaryButton title="Approve worker" disabled={!allChecked} onPress={approve} style={{ marginTop: spacing.lg }} />
        <SecondaryButton title="Reject submission" onPress={reject} style={{ marginTop: spacing.md }} />

        <InfoLine>A rejection reason is required. The worker receives the decision and can resubmit corrected documents.</InfoLine>
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  docButton: { marginTop: spacing.md },
  sectionTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.lg },
});
