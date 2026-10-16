import { Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { getShiftPayment, STATUS_LABEL } from "@/services/facility-payment.service";
import { formatNaira } from "@/utils/format";
import { colors, spacing, typography } from "@/constants/theme";

export default function ShiftFundedScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const p = getShiftPayment(id ?? "");

  if (!p) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenTitle title="Shift funded" />
        <StatusBanner kind="info" style={styles.gap} title="Loading this payment" text="Open Payments and pull down to refresh if this doesn't update." />
        <PrimaryButton title="Back to payments" onPress={() => router.replace("/facility/payments")} style={styles.gap} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Shift funded" />
      <StatusBanner
        kind="success"
        style={styles.gap}
        title="This shift is funded"
        text={`${formatNaira(p.amount)} is secured for this shift. It is now open to ${p.workers} ${p.workers === 1 ? "worker" : "workers"}.`}
      />
      <Card style={styles.gap}>
        <Text style={styles.title}>{p.title}</Text>
        <Text style={styles.line}>
          Shift {p.code} · {p.dateLabel}
        </Text>
        <Text style={styles.line}>Funding amount: {formatNaira(p.amount)}</Text>
        <Text style={styles.line}>Payment reference: {p.reference}</Text>
        <Text style={styles.line}>Status: {STATUS_LABEL[p.status]}</Text>
        <PrimaryButton title="Back to payments" onPress={() => router.replace("/facility/payments")} style={styles.gap} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  title: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  line: { ...typography.body, color: colors.text, marginTop: spacing.xs },
});
