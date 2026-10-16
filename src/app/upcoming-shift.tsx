import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import ShiftHeading from "@/components/ui/ShiftHeading";
import { useWorkerData } from "@/hooks/useWorkerData";
import { clockOut, clockTimes, getAttendance, getMyShift, getState, Attendance } from "@/services/attendance.service";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function UpcomingShiftScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shiftId = id ?? "";
  useWorkerData(); // makes sure the shift details are loaded
  const shift = getMyShift(shiftId);

  const [attendance, setAttendance] = useState<Attendance>(getAttendance(shiftId));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Reload when we come back from the scanner.
  useFocusEffect(
    useCallback(() => {
      setAttendance(getAttendance(shiftId));
    }, [shiftId])
  );

  const state = getState(attendance);
  const times = clockTimes(attendance);

  const handleClockOut = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await clockOut(shiftId);
      setAttendance(getAttendance(shiftId));
    } catch (e: any) {
      setError(e.message ?? "Couldn't clock you out. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="" onBack={() => goBack("/(tabs)/upcoming")} />
      <ShiftHeading title={shift.title} lines={[`${shift.facility} · ${shift.location}`, `${shift.dateLabel} · ${shift.timeLabel} · Shift ${shift.code}`]} />

      {state === "confirmed" && (
        <StatusBanner style={styles.gap} title="Confirmed · Ready to clock in" text="You’re booked for this shift. Scan the facility’s QR when you arrive." />
      )}
      {state === "working" && <StatusBanner style={styles.gap} title="Working" text="You’re clocked in. Clock out when your work is finished." />}
      {state === "completed" && (
        <StatusBanner kind="success" style={styles.gap} title="Attendance completed" text="You’ve clocked out. The facility will complete the shift after all assigned workers finish." />
      )}

      <Card>
        <Text style={styles.cardTitle}>Your attendance</Text>
        <Text style={styles.line}>Clock in: {times.clockIn}</Text>
        <Text style={styles.line}>Clock out: {times.clockOut}</Text>
        {state === "completed" && times.recorded ? <Text style={styles.line}>Recorded time: {times.recorded}</Text> : null}

        <Text style={styles.note}>
          {state === "confirmed" && `Arrive at reception by ${shift.arriveBy}. Ask the shift coordinator where the attendance QR is displayed.`}
          {state === "working" && "Keep this page handy. Your clock-out time will be added to your attendance record."}
          {state === "completed" && "No further clock-in or clock-out action is needed."}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {state === "confirmed" && (
          <PrimaryButton title="Clock In" onPress={() => router.push({ pathname: "/clock-in", params: { id: shiftId } })} />
        )}
        {state === "working" && <PrimaryButton title="Clock Out" onPress={handleClockOut} loading={busy} />}
        {state === "completed" && <SecondaryButton title="Back to dashboard" onPress={() => router.replace("/(tabs)")} />}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  line: { ...typography.body, color: colors.text, marginTop: spacing.xs },
  note: { ...typography.bodySmall, color: colors.textSecondary, marginVertical: spacing.md },
  error: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.md },
});