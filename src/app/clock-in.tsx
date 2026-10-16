import { useRef, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import ScreenTitle from "@/components/ui/ScreenTitle";
import ShiftHeading from "@/components/ui/ShiftHeading";
import { clockIn, ClockError, getMyShift } from "@/services/attendance.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Phase = "idle" | "scanning" | "mismatch" | "error";

export default function ClockInScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shiftId = id ?? "";
  const shift = getMyShift(shiftId);

  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorText, setErrorText] = useState("");
  const handled = useRef(false); // the camera fires many times per second; only act once

  const goToShift = () => router.replace({ pathname: "/upcoming-shift", params: { id: shiftId } });

  const startScan = async () => {
    handled.current = false;
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return; // denied message shows below
    }
    setPhase("scanning");
  };

  const onScanned = async ({ data }: { data: string }) => {
    if (handled.current) return;
    handled.current = true;
    try {
      await clockIn(shiftId, data);
      goToShift();
    } catch (e: any) {
      if (e instanceof ClockError && e.code === "QR_MISMATCH") {
        setPhase("mismatch");
      } else if (e instanceof ClockError && e.code === "ALREADY_CLOCKED_IN") {
        goToShift();
      } else {
        setErrorText(e?.message ?? "Couldn't record your clock-in. Check your connection and try again.");
        setPhase("error");
      }
    }
  };

  const heading = (
    <ShiftHeading title={shift.title} lines={[`${shift.facility} · ${shift.location}`, `${shift.dateLabel} · ${shift.timeLabel} · Shift ${shift.code}`]} />
  );

  if (phase === "mismatch") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {heading}
        <StatusBanner kind="error" style={styles.gap} title="This QR doesn’t match your shift" text={`Ask the coordinator for the QR for shift ${shift.code}, then try again.`} />
        <Text style={styles.note}>You haven’t been clocked in. Your attendance record hasn’t changed.</Text>
        <PrimaryButton title="Try scanning again" onPress={startScan} />
        <SecondaryButton title="Back to shift" onPress={goToShift} style={styles.gapSmall} />
      </ScrollView>
    );
  }

  if (phase === "error") {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {heading}
        <StatusBanner kind="error" style={styles.gap} title="Couldn’t clock you in" text={errorText} />
        <PrimaryButton title="Try scanning again" onPress={startScan} style={styles.gap} />
        <SecondaryButton title="Back to shift" onPress={goToShift} style={styles.gapSmall} />
      </ScrollView>
    );
  }

  const denied = permission && !permission.granted && !permission.canAskAgain;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {heading}
      <StatusBanner style={styles.gap} title="Clock in for your shift" text={`Scan the QR displayed by ${shift.facility}.`} />

      <View style={styles.viewfinder}>
        {phase === "scanning" && (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing="back"
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={onScanned}
          />
        )}
        <View style={[styles.corner, styles.tl]} />
        <View style={[styles.corner, styles.tr]} />
        <View style={[styles.corner, styles.bl]} />
        <View style={[styles.corner, styles.br]} />
        <Text style={styles.hint}>Position the facility’s QR inside the frame.</Text>
      </View>

      {denied ? (
        <>
          <Text style={styles.error}>Camera access is turned off. Enable it in your phone settings to scan.</Text>
          <PrimaryButton title="Open settings" onPress={() => Linking.openSettings()} />
        </>
      ) : phase === "idle" ? (
        <PrimaryButton title="Allow camera and scan" onPress={startScan} style={styles.gapSmall} />
      ) : null}

      <Text style={styles.note}>Camera access is needed to scan. Attendance is recorded only after a valid QR is recognised.</Text>
      <SecondaryButton title="Cancel" onPress={goToShift} />
    </ScrollView>
  );
}

const CORNER = 40;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  viewfinder: {
    height: 360,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.text,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  corner: { position: "absolute", width: CORNER, height: CORNER, borderColor: colors.white },
  tl: { top: 48, left: 64, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 48, right: 64, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 80, left: 64, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 80, right: 64, borderBottomWidth: 3, borderRightWidth: 3 },
  hint: { ...typography.bodySmall, color: colors.white, margin: spacing.md },
  note: { ...typography.bodySmall, color: colors.textSecondary, marginVertical: spacing.md },
  error: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.md },
});