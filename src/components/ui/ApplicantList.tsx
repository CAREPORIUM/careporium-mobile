import { useState } from "react";
import { Text, StyleSheet, ScrollView, Alert, ActivityIndicator, RefreshControl } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import FormInput from "@/components/ui/FormInput";
import SelectField from "@/components/ui/SelectField";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { useApplicants } from "@/hooks/useApplicants";
import { SORT_OPTIONS, STATUS_OPTIONS, acceptApplicant, getApplicants, rejectApplicant, waitingCount } from "@/services/facility-hiring.service";
import { colors, spacing, typography } from "@/constants/theme";

type Props = {
  title: string;
  subtitle: string;
  shiftId?: string;
  footer: string;
  onBack?: () => void;
};

export default function ApplicantList({ title, subtitle, shiftId, footer, onBack }: Props) {
  const { loading, loaded, error, reload } = useApplicants();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [sort, setSort] = useState(SORT_OPTIONS[0]);
  const [busyId, setBusyId] = useState<string | null>(null);

  const list = getApplicants({ query, status, sort, shiftId });

  const run = async (id: string, action: () => Promise<string>) => {
    setBusyId(id);
    try {
      Alert.alert("Done", await action());
    } catch (e: any) {
      Alert.alert("Couldn't complete that", e.message ?? "Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmAccept = (id: string, name: string) =>
    Alert.alert("Accept this applicant?", `${name} will be added to the shift.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Accept", onPress: () => run(id, () => acceptApplicant(id)) },
    ]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      refreshControl={<RefreshControl refreshing={loading && loaded} onRefresh={reload} />}
    >
      <ScreenTitle title={title} subtitle={subtitle} onBack={onBack} />

      <Card style={styles.gap}>
        <FormInput label="Search applicants" value={query} onChangeText={setQuery} placeholder="Name, specialty or shift" style={{ marginTop: 0 }} />
        <SelectField label="Show" value={status} options={STATUS_OPTIONS} onChange={setStatus} />
        <SelectField label="Sort by" value={sort} options={SORT_OPTIONS} onChange={setSort} />
      </Card>

      <Text style={styles.summary}>
        Showing {list.length} {list.length === 1 ? "applicant" : "applicants"} · {waitingCount()} waiting for your review
      </Text>

      {loading && !loaded ? <ActivityIndicator color={colors.primary} style={styles.gap} /> : null}
      {error ? <Text style={[styles.body, { color: colors.error }]}>{error}</Text> : null}
      {loaded && !error && list.length === 0 && <Text style={styles.body}>No applicants here yet.</Text>}

      {list.map((a) => (
        <Card key={a.id}>
          <Text style={styles.name}>{a.name}</Text>
          {a.status === "accepted" ? <Badge text="Accepted" tone="success" style={styles.badge} /> : null}
          {a.status === "rejected" ? <Badge text="Declined" tone="warning" style={styles.badge} /> : null}
          {a.profession || a.specialty ? (
            <Text style={styles.line}>
              {[a.profession, a.specialty].filter(Boolean).join(" · ")}
              {a.years !== null ? ` · ${a.years} ${a.years === 1 ? "year" : "years"}` : ""}
            </Text>
          ) : null}
          <Text style={styles.line}>
            Applied for {a.shiftTitle}
            {a.shiftWhen ? ` · ${a.shiftWhen}` : ""}
          </Text>

          <SecondaryButton title="View applicant" onPress={() => router.push({ pathname: "/facility/worker-profile", params: { id: a.id } })} style={styles.gap} />
          {a.status === "pending" ? (
            <>
              <PrimaryButton title="Accept" onPress={() => confirmAccept(a.id, a.name)} loading={busyId === a.id} style={styles.gapSmall} />
              <SecondaryButton title="Decline" onPress={() => run(a.id, () => rejectApplicant(a.id))} style={styles.gapSmall} />
            </>
          ) : null}
        </Card>
      ))}

      <Text style={[styles.body, styles.gap]}>{footer}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  summary: { ...typography.h3, color: colors.text, marginTop: spacing.lg },
  name: { ...typography.h3, color: colors.text },
  badge: { marginTop: spacing.md },
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
});