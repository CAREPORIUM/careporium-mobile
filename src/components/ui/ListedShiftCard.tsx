import { View, Text, StyleSheet } from "react-native";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import { ListedShift, shiftNote } from "@/services/facility-listing.service";
import { colors, spacing, typography } from "@/constants/theme";

type Props = { shift: ListedShift; actionLabel?: string; onAction?: () => void };

// A shift card with its status line. The action button sits just below the card, as in the design.
export default function ListedShiftCard({ shift, actionLabel, onAction }: Props) {
  const note = shiftNote(shift);
  const noteColor = note.tone === "warning" ? colors.warning : note.tone === "success" ? colors.success : colors.textSecondary;

  return (
    <View>
      <Card>
        {shift.kind === "urgent" && <Badge text="Urgent" tone="warning" style={styles.badge} />}
        <Text style={styles.title}>{shift.title}</Text>
        <Text style={styles.when}>{shift.whenLabel}</Text>
        <Text style={[styles.note, { color: noteColor }]}>{note.text}</Text>
      </Card>
      {actionLabel && onAction ? <SecondaryButton title={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { marginBottom: spacing.sm },
  title: { ...typography.h3, color: colors.text },
  when: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  note: { ...typography.label, fontWeight: "600", marginTop: spacing.sm },
  action: { marginTop: spacing.sm },
});
