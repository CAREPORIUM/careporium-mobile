import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StepIndicator from "@/components/ui/StepIndicator";
import { applyToShift } from "@/services/application.service";
import { getShiftById } from "@/services/shift.service";
import { Shift } from "@/types/shift";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function ApplicationSubmit() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [shift, setShift] = useState<Shift | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) getShiftById(id).then((s) => setShift(s ?? null)).catch(() => setShift(null));
  }, [id]);

  const submit = async () => {
    if (!id || busy) return;
    setBusy(true);
    setError("");
    try {
      await applyToShift(id);
      router.replace("/application-submitted");
    } catch (e: any) {
      setError(e.message ?? "Couldn't send your application. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATION</Text>
      <Text style={styles.title}>Confirm your application</Text>
      <Text style={styles.subtitle}>Review the information below before sending your application to the facility.</Text>

      <StepIndicator current={2} />

      {shift ? (
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Application summary</Text>
          <Text style={styles.jobTitle}>{shift.title}</Text>
          <Text style={styles.facility}>{shift.facility}</Text>
          <Row icon="calendar-outline" text={`${shift.date} · ${shift.time}`} />
          {shift.location ? <Row icon="location-outline" text={shift.location} /> : null}
          <Row icon="cash-outline" text={`${naira(shift.total)} for this shift`} />
        </View>
      ) : null}

      <View style={styles.notice}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={styles.noticeText}>By submitting, you confirm that your availability and professional credentials are accurate.</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.backButton} onPress={() => goBack("/application-review")}>
        <Text style={styles.backText}>Back to review</Text>
      </Pressable>
      <PrimaryButton title="Submit application" onPress={submit} loading={busy} style={{ marginTop: spacing.sm }} />
    </ScrollView>
  );
}

function Row({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text style={styles.rowText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.lg },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  cardHeading: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  jobTitle: { ...typography.h3, color: colors.text },
  facility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  row: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.sm },
  rowText: { ...typography.bodySmall, color: colors.text, flex: 1 },
  notice: { flexDirection: "row", backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.lg },
  noticeText: { flex: 1, ...typography.bodySmall, color: colors.primary },
  error: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.md },
  backButton: { height: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  backText: { color: colors.primary, ...typography.label, fontWeight: "600" },
});