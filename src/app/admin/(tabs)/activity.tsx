import { useState } from "react";
import { Text, StyleSheet, Pressable, View, Alert } from "react-native";
import AppSelect from "@/components/ui/AppSelect";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, Card, CardTitle, EmptyText, FieldLabel, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getActivity, getReportSummary } from "@/services/admin.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

const DATE_RANGES = ["26 Sep – 2 Oct 2026", "Last 30 days"];
const EVENT_TYPES = ["All activity", "Verification", "Shifts", "Payments", "Sign-ins"];

export default function AdminActivityScreen() {
  const [range, setRange] = useState<string | null>(DATE_RANGES[0]);
  const [eventType, setEventType] = useState<string | null>(EVENT_TYPES[0]);
  const summary = getReportSummary();

  const events = getActivity().filter((e) => !eventType || eventType === "All activity" || e.category === eventType);

  return (
    <AdminScreen>
      <ScreenTitle title="Activity & reports" subtitle="Monitor verification, marketplace and payment events." />

      <FieldLabel>Date range</FieldLabel>
      <AppSelect placeholder="Choose a date range" value={range} options={DATE_RANGES} onChange={setRange} />

      <FieldLabel>Event type</FieldLabel>
      <AppSelect placeholder="All activity" value={eventType} options={EVENT_TYPES} onChange={setEventType} />

      <SecondaryButton
        title="Export report"
        onPress={() => Alert.alert("Export report", "Report export is coming soon.")}
        style={{ marginVertical: spacing.lg }}
      />

      <Card>
        <CardTitle>Recent activity</CardTitle>
        {events.length === 0 && <EmptyText>No activity for this event type.</EmptyText>}
        {events.map((e) => (
          <View key={e.id} style={styles.item}>
            <Text style={styles.time}>Time: {e.time}</Text>
            <InfoLine>Event: {e.event}</InfoLine>
            <InfoLine>Actor: {e.actor}</InfoLine>
            <InfoLine>Result: {e.result}</InfoLine>
            <Pressable onPress={() => Alert.alert(e.reference, "Reference detail view coming soon.")} hitSlop={8}>
              <Text style={styles.link}>Reference: {e.reference}</Text>
            </Pressable>
          </View>
        ))}
      </Card>

      <Card>
        <CardTitle>Reporting summary</CardTitle>
        <Text style={styles.body}>{summary.line}</Text>
        <InfoLine>{summary.note}</InfoLine>
        <Text style={styles.issues}>{summary.issues}</Text>
      </Card>

      <Text style={styles.footnote}>All figures and account details are illustrative sample data.</Text>
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  item: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  time: { ...typography.label, fontWeight: "700", color: colors.text },
  link: { ...typography.bodySmall, color: colors.primary, fontWeight: "600", marginTop: spacing.xs },
  body: { ...typography.bodySmall, color: colors.text },
  issues: { ...typography.bodySmall, color: colors.warning, marginTop: spacing.md },
  footnote: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
});
