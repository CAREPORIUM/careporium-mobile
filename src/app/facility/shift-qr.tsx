import { useEffect, useState } from "react";
import { Text, StyleSheet, ScrollView, View, Alert, ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { getListedShifts, refreshShifts, shiftNote } from "@/services/facility-listing.service";
import { completeShift, getQrToken } from "@/services/facility-attendance.service";
import { colors, spacing, typography } from "@/constants/theme";

// Attendance QR for a shift (workers scan it to clock in and out) and "confirm the shift is complete".
export default function ShiftQrScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shift = getListedShifts().find((s) => s.id === id);
  const [token, setToken] = useState(shift?.qrToken ?? "");
  const [loading, setLoading] = useState(!shift?.qrToken);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");

  useEffect(() => {
    if (!shift || token) return;
    getQrToken(shift)
      .then(setToken)
      .catch((e: any) => setError(e.message ?? "Couldn't load the QR."))
      .finally(() => setLoading(false));
  }, [shift, token]);

  if (!shift) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenTitle title="Shift attendance" onBack={() => router.replace("/facility/shifts")} />
        <StatusBanner style={styles.gap} title="Shift not found" text="Go back to Manage shifts and pull down to refresh." />
      </ScrollView>
    );
  }

  const note = shiftNote(shift);
  const canConfirm = shift.kind === "confirmed" || (shift.kind === "completed" && !shift.confirmed);

  const confirm = () =>
    Alert.alert("Confirm this shift is complete?", "Only confirm if the work was done. This tells Careporium the shift went ahead.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: async () => {
          setBusy(true);
          setError("");
          try {
            setDone(await completeShift(shift.id));
            await refreshShifts();
          } catch (e: any) {
            setError(e.message ?? "Couldn't complete the shift. Try again.");
          } finally {
            setBusy(false);
          }
        },
      },
    ]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Shift attendance" subtitle={shift.title} onBack={() => router.replace("/facility/shifts")} />
      <Text style={styles.when}>{shift.whenLabel}</Text>
      <Text style={styles.note}>{note.text}</Text>

      <Card style={styles.gap}>
        <Text style={styles.cardTitle}>Attendance QR</Text>
        <Text style={styles.body}>Workers scan this with the Careporium app to clock in and out. Show it on arrival.</Text>
        <View style={styles.qrBox}>
          {loading ? <ActivityIndicator color={colors.primary} /> : token ? <QRCode value={token} size={220} /> : <Text style={styles.body}>No QR yet.</Text>}
        </View>
      </Card>

      {error ? <StatusBanner kind="error" style={styles.gap} title="Something went wrong" text={error} /> : null}
      {done ? <StatusBanner kind="success" style={styles.gap} title="Done" text={done} /> : null}

      {canConfirm && !done ? <PrimaryButton title="Confirm shift is complete" onPress={confirm} loading={busy} style={styles.gap} /> : null}
      <SecondaryButton title="Back to shifts" onPress={() => router.replace("/facility/shifts")} style={styles.gapSmall} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  when: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  note: { ...typography.label, color: colors.text, fontWeight: "600", marginTop: spacing.xs },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  qrBox: { alignItems: "center", justifyContent: "center", paddingVertical: spacing.xl },
});
