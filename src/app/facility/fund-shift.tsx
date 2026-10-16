import { useCallback, useState } from "react";
import { Text, StyleSheet, ScrollView, View, Linking, ActivityIndicator } from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { FundingDetails, getShiftPayment, loadFunding } from "@/services/facility-payment.service";
import { getListedShifts, refreshShifts } from "@/services/facility-listing.service";
import { formatNaira } from "@/utils/format";
import { colors, spacing, typography } from "@/constants/theme";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n: number) => String(n).padStart(2, "0");
function when(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Pay for a shift. The shift only opens to workers once HarrenaPay confirms the payment.
export default function FundShiftScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shiftId = id ?? "";
  const [details, setDetails] = useState<FundingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [note, setNote] = useState("");

  const load = useCallback(
    async (fresh = false) => {
      setLoading(true);
      setError("");
      try {
        setDetails(await loadFunding(shiftId, fresh));
      } catch (e: any) {
        setError(e.message ?? "Couldn't get the payment details. Try again.");
      } finally {
        setLoading(false);
      }
    },
    [shiftId]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const expired = !!details?.expiresAt && new Date(details.expiresAt).getTime() < Date.now();
  const payment = getShiftPayment(shiftId);
  const amount = details?.amount ?? payment?.amount ?? 0;
  const hasAccount = !!details?.accountNumber;

  const checkStatus = async () => {
    setChecking(true);
    setNote("");
    await refreshShifts();
    const shift = getListedShifts().find((s) => s.id === shiftId);
    setChecking(false);
    if (shift && shift.kind !== "awaiting") {
      router.replace({ pathname: "/facility/shift-funded", params: { id: shiftId } });
    } else {
      setNote("We haven't received the payment yet. It can take a minute after you pay. Try again shortly.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Fund this shift" subtitle="Your shift opens to workers once the payment is confirmed." onBack={() => router.replace("/facility/payments")} />

      {loading ? <ActivityIndicator color={colors.primary} style={styles.gap} /> : null}

      {error ? (
        <View style={styles.gap}>
          <StatusBanner kind="error" title="Couldn't get the payment details" text={error} />
          <SecondaryButton title="Try again" onPress={() => load(true)} style={styles.gapSmall} />
        </View>
      ) : null}

      {!loading && !error && details ? (
        <>
          {expired ? (
            <StatusBanner kind="warning" style={styles.gap} title="This payment request has expired" text="Get new payment details to fund the shift." />
          ) : (
            <StatusBanner kind="info" style={styles.gap} title={`Pay ${formatNaira(amount)}`} text="Pay by bank transfer to the account below, or open the payment page. Payment is held securely and released after you confirm the shift is complete." />
          )}

          {hasAccount && !expired ? (
            <Card style={styles.gap}>
              <Text style={styles.label}>Bank</Text>
              <Text style={styles.value}>{details.bankName || "—"}</Text>
              <Text style={styles.label}>Account number</Text>
              <Text style={styles.account} selectable>
                {details.accountNumber}
              </Text>
              <Text style={styles.label}>Amount</Text>
              <Text style={styles.value}>{formatNaira(amount)}</Text>
              <Text style={styles.label}>Payment reference</Text>
              <Text style={styles.value} selectable>
                {details.reference}
              </Text>
              {details.expiresAt ? <Text style={styles.note}>Valid until {when(details.expiresAt)}</Text> : null}
            </Card>
          ) : null}

          {!hasAccount && !expired ? <StatusBanner kind="info" style={styles.gap} title="Bank details aren't available yet" text="Open the payment page, or get new payment details." /> : null}

          {details.checkoutUrl && !expired ? <PrimaryButton title="Open payment page" onPress={() => Linking.openURL(details.checkoutUrl)} style={styles.gap} /> : null}

          {expired ? (
            <PrimaryButton title="Get new payment details" onPress={() => load(true)} style={styles.gap} />
          ) : (
            <SecondaryButton title="I've paid, check status" onPress={checkStatus} loading={checking} style={styles.gapSmall} />
          )}
          {note ? <Text style={styles.note}>{note}</Text> : null}

          {__DEV__ ? <Text style={styles.dev}>Sandbox: ask the backend team to simulate funding for {details.reference}. The HarrenaPay key must not be in the app.</Text> : null}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  label: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  value: { ...typography.label, color: colors.text, fontWeight: "700", marginTop: spacing.xs },
  account: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  note: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  dev: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.lg },
});
