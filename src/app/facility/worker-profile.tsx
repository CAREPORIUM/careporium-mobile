import { useState } from "react";
import { Text, StyleSheet, ScrollView, Alert } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { useApplicants } from "@/hooks/useApplicants";
import { acceptApplicant, getApplicant, rejectApplicant } from "@/services/facility-hiring.service";
import { colors, spacing, typography } from "@/constants/theme";

export default function FacilityWorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  useApplicants();
  const a = getApplicant(id ?? "");
  const [busy, setBusy] = useState(false);

  const run = async (action: () => Promise<string>) => {
    setBusy(true);
    try {
      Alert.alert("Done", await action());
    } catch (e: any) {
      Alert.alert("Couldn't complete that", e.message ?? "Try again.");
    } finally {
      setBusy(false);
    }
  };

  if (!a) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenTitle title="Applicant" onBack={() => router.back()} />
        <StatusBanner style={styles.gap} title="Loading this applicant" text="Go back and pull down to refresh if this doesn't appear." />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle
        title={a.name}
        subtitle={[a.profession, a.specialty].filter(Boolean).join(" · ") || "Healthcare professional"}
        onBack={() => router.back()}
      />

      <Card style={styles.gap}>
        <Text style={styles.h3}>About this applicant</Text>
        <Text style={styles.line}>{[a.profession, a.specialty].filter(Boolean).join(" · ") || "Profession not provided"}</Text>
        {a.years !== null ? (
          <Text style={styles.line}>
            {a.years} {a.years === 1 ? "year" : "years"} of experience
          </Text>
        ) : null}

        <Text style={styles.h3}>Applied for</Text>
        <Text style={styles.line}>{a.shiftTitle}</Text>
        {a.shiftWhen ? <Text style={styles.line}>{a.shiftWhen}</Text> : null}

        <Text style={styles.h3}>Status</Text>
        <Text style={styles.line}>{a.status === "accepted" ? "Accepted" : a.status === "rejected" ? "Declined" : "Waiting for your review"}</Text>
      </Card>

      {a.status === "pending" ? (
        <>
          <PrimaryButton title="Accept" onPress={() => run(() => acceptApplicant(a.id))} loading={busy} style={styles.gap} />
          <SecondaryButton title="Decline" onPress={() => run(() => rejectApplicant(a.id))} style={styles.gapSmall} />
        </>
      ) : null}
      {a.status === "accepted" ? <StatusBanner kind="success" style={styles.gap} title="Accepted" text={`${a.name} is on this shift. Find them under Shifts.`} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  h3: { ...typography.label, color: colors.text, fontWeight: "700", marginTop: spacing.lg },
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
});