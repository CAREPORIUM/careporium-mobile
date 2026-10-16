import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ShiftHeading from "@/components/ui/ShiftHeading";
import { acceptedWorkers, completeShift, getFacilityShift } from "@/services/facility-shift.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

// "Complete this shift?" confirmation, opened from Shift detail when every worker has clocked out.
export default function CompleteShiftScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shift = getFacilityShift(id ?? "cp-1044");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await completeShift(shift.id);
      router.replace({ pathname: "/facility/shift-detail", params: { id: shift.id } });
    } catch (e: any) {
      setError(e.message ?? "Couldn't complete the shift. Try again.");
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ShiftHeading title={shift.title} lines={[`${shift.facility} · ${shift.location}`, `${shift.dateLabel} · ${shift.timeLabel} · Shift ${shift.code}`]} />
      <StatusBanner
        style={styles.gap}
        title="Complete this shift?"
        text="Every worker has clocked out. Completing the shift confirms their attendance and finishes the booking."
      />

      <Card style={styles.gap}>
        {acceptedWorkers(shift).map((w) => (
          <View key={w.id} style={styles.worker}>
            <Text style={styles.workerName}>
              {w.name} · {w.role}
            </Text>
            <Text style={styles.done}>Attendance completed</Text>
            <Text style={styles.body}>
              {w.clockIn}–{w.clockOut} WAT
            </Text>
          </View>
        ))}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Confirm and complete shift" onPress={confirm} loading={busy} style={styles.gap} />
        <SecondaryButton title="Keep reviewing" onPress={() => router.back()} style={styles.gapSmall} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.sm },
  worker: { backgroundColor: colors.background, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md },
  workerName: { ...typography.label, color: colors.text, fontWeight: "700" },
  done: { ...typography.bodySmall, color: colors.success, marginTop: spacing.xs },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.sm },
});
