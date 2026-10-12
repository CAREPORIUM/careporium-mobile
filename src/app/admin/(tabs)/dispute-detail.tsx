import { useState } from "react";
import { Text, StyleSheet, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, BackLink, Card, CardTitle, FieldLabel, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getDispute } from "@/services/admin.service";
import { colors, spacing, typography } from "@/constants/theme";

const DECISIONS = ["Confirm completion", "Reject claim"];

export default function DisputeDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const dispute = getDispute(id);
  const [decision, setDecision] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const saveNotes = () => Alert.alert("Saved", "Your review notes have been saved.");

  const reviewResolution = () => {
    if (!decision || !reason.trim()) {
      Alert.alert("Missing details", "Choose a decision and explain the evidence and outcome first.");
      return;
    }
    Alert.alert(
      "Close this case?",
      `${decision}. Both parties will receive the outcome. Any payment action is recorded separately.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm and close", onPress: () => router.replace("/admin/disputes") },
      ]
    );
  };

  return (
    <AdminScreen>
      <BackLink fallback="/admin/disputes" label="Back to disputes" />
      <ScreenTitle title={`Dispute ${dispute.id}`} subtitle={dispute.title} />

      <Card>
        <CardTitle>Case details & evidence</CardTitle>
        <Text style={styles.line}>Shift: {dispute.shift}</Text>
        <Text style={styles.line}>Amount: {dispute.amount}</Text>
        <Text style={styles.line}>Opened: {dispute.opened}</Text>

        <Text style={styles.sectionTitle}>Worker statement</Text>
        <Text style={styles.quote}>“{dispute.workerStatement}”</Text>

        <Text style={styles.sectionTitle}>Facility statement</Text>
        <Text style={styles.quote}>“{dispute.facilityStatement}”</Text>

        <SecondaryButton
          title="View attendance evidence"
          onPress={() => Alert.alert("Attendance evidence", "Evidence viewer coming soon.")}
          style={{ marginTop: spacing.lg }}
        />

        <Text style={styles.sectionTitle}>Timeline</Text>
        {dispute.timeline.map((t) => (
          <Text key={t} style={styles.line}>{t}</Text>
        ))}
      </Card>

      <Card>
        <CardTitle>Resolve case</CardTitle>

        <FieldLabel>Decision</FieldLabel>
        <AppSelect placeholder="Confirm completion / reject claim" value={decision} options={DECISIONS} onChange={setDecision} />

        <FieldLabel>Resolution reason</FieldLabel>
        <AppInput placeholder="Explain the evidence and outcome" value={reason} onChangeText={setReason} multiline numberOfLines={4} />

        <SecondaryButton title="Save review notes" onPress={saveNotes} style={{ marginTop: spacing.lg }} />
        <PrimaryButton title="Review resolution" onPress={reviewResolution} style={{ marginTop: spacing.md }} />

        <InfoLine>Confirm the final decision before closing the case. Both parties receive the outcome. Any payment action is recorded separately.</InfoLine>
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  sectionTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.lg },
  quote: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
});
