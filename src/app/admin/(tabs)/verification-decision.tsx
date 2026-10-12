import { Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, Card, CardTitle, ScreenTitle } from "@/components/admin/AdminUI";
import { colors, spacing, typography } from "@/constants/theme";

const DEFAULT_REASON = "The uploaded licence is expired. Upload a current licence to continue verification.";

export default function VerificationDecisionScreen() {
  const { result, reason } = useLocalSearchParams<{ result?: string; reason?: string }>();

  // With no param (e.g. opened directly) show both outcomes, like the design.
  const showApproved = result !== "rejected";
  const showRejected = result !== "approved";

  const backToQueue = () => router.replace("/admin/verify");

  return (
    <AdminScreen>
      <ScreenTitle title="Verification decisions" subtitle="Clear outcomes for both worker and facility submissions." />

      {showApproved && (
        <Card>
          <CardTitle>Approved</CardTitle>
          <Text style={[styles.outcome, { color: colors.success }]}>Submission approved</Text>
          <Text style={styles.body}>The account is now verified. The user has been notified and the admin decision is recorded.</Text>
          <PrimaryButton title="Return to queue" onPress={backToQueue} style={{ marginTop: spacing.lg }} />
        </Card>
      )}

      {showRejected && (
        <Card>
          <CardTitle>Rejected</CardTitle>
          <Text style={[styles.outcome, { color: colors.error }]}>Submission rejected</Text>
          <Text style={styles.body}>Reason: {reason || DEFAULT_REASON}</Text>
          <Text style={[styles.body, { marginTop: spacing.md }]}>
            The user is notified and may resubmit. Access requiring verification stays restricted.
          </Text>
          <SecondaryButton title="Return to queue" onPress={backToQueue} style={{ marginTop: spacing.lg }} />
        </Card>
      )}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  outcome: { ...typography.h3, fontWeight: "700", marginTop: spacing.sm },
  body: { ...typography.bodySmall, color: colors.text, marginTop: spacing.md },
});
