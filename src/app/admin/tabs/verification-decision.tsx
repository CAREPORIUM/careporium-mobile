import { Text } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import {
    AdminScreen,
    Card,
    CardTitle,
    ScreenTitle,
} from "@/components/admin/AdminUI";

import { colors, spacing, typography } from "@/constants/theme";

const DEFAULT_REASON =
    "The uploaded licence is expired. Upload a current licence to continue.";

export default function VerificationDecision() {
    const { result, reason } = useLocalSearchParams<{
        result?: string;
        reason?: string;
    }>();

    const showApproved = result !== "rejected";
    const showRejected = result !== "approved";

    const returnToQueue = () => {
        router.replace("/admin/verify");
    };

    return (
        <AdminScreen>
            <ScreenTitle
                title="Verification decisions"
                subtitle="Clear outcomes for both worker and facility submissions."
            />

            {showApproved && (
                <Card>
                    <CardTitle>Approved</CardTitle>

                    <Text style={styles.approvedHeading}>
                        Submission approved
                    </Text>

                    <Text style={styles.bodyText}>The account is now verified. The user has been notified and the admin decision is recorded. </Text>

                    <PrimaryButton
            title="Return to queue"
            onPress={returnToQueue}
          />
        </Card>
      )}

       {showRejected && (
        <Card>
          <CardTitle>Rejected</CardTitle>

          <Text style={styles.rejectedHeading}>
            Submission rejected
          </Text>

          <Text style={styles.bodyText}>
            Reason: {reason || DEFAULT_REASON}
          </Text>

           <Text style={styles.bodyText}>
            The user is notified and may resubmit. Access requiring
            verification stays restricted.
          </Text>

           <SecondaryButton
            title="Return to queue"
            onPress={returnToQueue}
          />
        </Card>
      )}
    </AdminScreen>
  );
}

const styles = {
  approvedHeading: {
    ...typography.h3,
    color: colors.success,
    marginBottom: spacing.sm,
  },

  rejectedHeading: {
    ...typography.h3,
    color: colors.error,
    marginBottom: spacing.sm,
  },

  bodyText: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.md,
  },
};