import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";

import {
  AdminScreen,
  BackLink,
  Card,
  CardTitle,
  FieldLabel,
  InfoLine,
  ScreenTitle,
} from "@/components/admin/AdminUI";

import { colors, spacing, typography } from "@/constants/theme";
import { getDispute } from "@/services/admin.service";

export default function DisputeDetail() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const dispute = getDispute(id);

  const [decision, setDecision] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const handleReviewResolution = () => {
    if (!decision || !reason.trim()) {
      Alert.alert(
        "Missing details",
        "Choose a decision and explain the evidence and outcome first."
      );
      return;
    }

    Alert.alert(
      "Close this case?",
      `${decision}. Both parties will receive the outcome. Any payment action is recorded separately.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm and close",
          onPress: () => router.replace("/admin/disputes"),
        },
      ]
    );
  };

  return (
    <AdminScreen>
      <BackLink fallback="/admin/disputes" label="Back to disputes" />

      <ScreenTitle
        title={`Dispute ${dispute.id}`}
        subtitle={dispute.title}
      />

      <Card>
        <CardTitle>Case details & evidence</CardTitle>

        <InfoLine>Shift: {dispute.shift}</InfoLine>
        <InfoLine>Amount: {dispute.amount}</InfoLine>
        <InfoLine>Opened: {dispute.opened}</InfoLine>

        <Text style={[typography.label, styles.sectionHeading]}>
          Worker statement
        </Text>

        <Text style={styles.statement}>
          “{dispute.workerStatement}”
        </Text>

        <Text style={[typography.label, styles.sectionHeading]}>
          Facility statement
        </Text>

        <Text style={styles.statement}>
          “{dispute.facilityStatement}”
        </Text>

        <SecondaryButton
          title="View attendance evidence"
          onPress={() =>
            Alert.alert(
              "Attendance evidence",
              "Evidence viewer coming soon."
            )
          }
        />

        <Text style={[typography.label, styles.sectionHeading]}>
          Timeline
        </Text>

        {dispute.timeline.map((t) => (
          <InfoLine key={t}>{t}</InfoLine>
        ))}
      </Card>

      <Card>
        <CardTitle>Resolve case</CardTitle>

        <FieldLabel>Decision</FieldLabel>

        <AppSelect
          options={["Confirm completion", "Reject claim"]}
          value={decision}
          onChange={setDecision}
          placeholder="Confirm completion / reject claim"
        />

        <FieldLabel>Resolution reason</FieldLabel>

        <AppInput
          multiline
          numberOfLines={4}
          value={reason}
          onChangeText={setReason}
          placeholder="Explain the evidence and outcome"
        />

        <SecondaryButton
          title="Save review notes"
          onPress={() =>
            Alert.alert(
              "Saved",
              "Your review notes have been saved."
            )
          }
        />

        <PrimaryButton
          title="Review resolution"
          onPress={handleReviewResolution}
        />

        <InfoLine>
          Confirm the final decision before closing the case. Both parties
          receive the outcome. Any payment action is recorded separately.
        </InfoLine>
      </Card>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },

  statement: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
});