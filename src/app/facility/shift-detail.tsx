import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import DisabledButton from "@/components/ui/DisabledButton";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import ShiftHeading from "@/components/ui/ShiftHeading";
import {
  acceptedWorkers,
  clockLine,
  deriveState,
  FacilityShift,
  getFacilityShift,
  qrValueFor,
  workersSummary,
  workerStatus,
} from "@/services/facility-shift.service";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function FacilityShiftDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shiftId = id ?? "cp-1042";
  const [shift, setShift] = useState<FacilityShift>(getFacilityShift(shiftId));

  useFocusEffect(
    useCallback(() => {
      setShift({ ...getFacilityShift(shiftId) });
    }, [shiftId])
  );

  const state = deriveState(shift);
  const accepted = acceptedWorkers(shift);

  const banner = {
    open: {
      kind: "info" as const,
      title: `Open · ${accepted.length} of ${shift.needed} workers accepted`,
      text: "Accept the remaining workers to fill this shift. The attendance QR will appear once everyone is accepted.",
    },
    filled: {
      kind: "info" as const,
      title: `Filled · ${accepted.length} of ${shift.needed} workers accepted`,
      text: "Your shift is filled. Keep this QR available at the facility so your workers can clock in.",
    },
    in_progress: {
      kind: "info" as const,
      title: `Filled · ${accepted.length} of ${shift.needed} workers accepted`,
      text: "Attendance is in progress. Complete Shift unlocks after every worker has clocked out.",
    },
    ready: {
      kind: "info" as const,
      title: `Filled · ${accepted.length} of ${shift.needed} workers accepted`,
      text: "Every worker has clocked out. Review their attendance, then complete the shift.",
    },
    completed: {
      kind: "success" as const,
      title: "Completed",
      text: "You’ve marked this shift as completed. Attendance for every worker is recorded.",
    },
  }[state];

  const showQr = state === "filled" || state === "in_progress" || state === "ready";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="" onBack={() => goBack("/facility/shifts")} />
      <ShiftHeading title={shift.title} lines={[`${shift.facility} · ${shift.location}`, `${shift.dateLabel} · ${shift.timeLabel} · Shift ${shift.code}`]} />

      <StatusBanner style={styles.gap} kind={banner.kind} title={banner.title} text={banner.text} />

      <Card style={styles.gap}>
        {showQr ? (
          <>
            <Text style={styles.cardTitle}>Attendance QR</Text>
            <View style={styles.qr}>
              <QRCode value={qrValueFor(shift)} size={200} />
            </View>
            <Text style={styles.body}>
              Shift {shift.code} · {shift.dateLabel.split(", ")[1]}
            </Text>
            <Text style={styles.body}>Workers scan this code from their shift details page when they arrive.</Text>
          </>
        ) : state === "completed" ? (
          <>
            <Text style={styles.cardTitle}>Attendance recorded</Text>
            <Text style={styles.body}>This shift is completed. Clock-in and clock-out are closed.</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardTitle}>Attendance QR</Text>
            <Text style={styles.body}>The QR code is generated automatically once every required worker is accepted.</Text>
          </>
        )}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Assigned workers</Text>
        <Text style={styles.body}>{workersSummary(shift, state)}</Text>

        {shift.workers.map((w) => {
          const s = workerStatus(w, state);
          return (
            <View key={w.id} style={styles.worker}>
              <Text style={styles.workerName}>
                {w.name} · {w.role}
              </Text>
              <Text style={[styles.workerStatus, s.tone === "primary" && { color: colors.primary }, s.tone === "success" && { color: colors.success }]}>{s.label}</Text>
              <Text style={styles.body}>{clockLine(w)}</Text>
            </View>
          );
        })}

        {state === "completed" ? (
          <DisabledButton title="Shift completed" style={styles.gap} />
        ) : state === "ready" ? (
          <>
            <PrimaryButton title="Complete Shift" onPress={() => router.push({ pathname: "/facility/complete-shift", params: { id: shift.id } })} style={styles.gap} />
            <Text style={styles.body}>All attendance records are complete. You can now finish the shift.</Text>
          </>
        ) : (
          <>
            <DisabledButton title="Complete Shift" style={styles.gap} />
            <Text style={styles.body}>Complete Shift becomes available when every assigned worker has clocked out.</Text>
          </>
        )}

        {state === "open" && <SecondaryButton title="Review remaining applicants" onPress={() => router.push("/facility/hiring")} style={styles.gap} />}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  qr: { alignItems: "center", paddingVertical: spacing.lg },
  worker: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  workerName: { ...typography.label, color: colors.text, fontWeight: "700" },
  workerStatus: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
