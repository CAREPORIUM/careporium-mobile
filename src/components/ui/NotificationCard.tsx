import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  title: string;
  message: string;
  time: string;
  unread?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  onPress?: () => void;
};

export default function NotificationCard({ title, message, time, unread = false, actionLabel, onAction, onPress }: Props) {
  return (
    <Pressable style={[styles.card, unread && styles.cardUnread]} onPress={onPress} disabled={!onPress}>
      <Ionicons name="notifications-outline" size={24} color={colors.text} style={styles.icon} />

      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.time}>{time}</Text>
        {actionLabel && onAction ? (
          <SecondaryButton title={actionLabel} onPress={onAction} style={styles.action} />
        ) : null}
      </View>

      {unread && <View style={styles.dot} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardUnread: { backgroundColor: colors.primaryLight },
  icon: { marginTop: 2 },
  body: { flex: 1, marginLeft: spacing.md },
  title: { ...typography.label, fontWeight: "700", color: colors.text },
  message: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  time: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  action: { marginTop: spacing.md },
  dot: { width: 10, height: 10, borderRadius: radius.round, backgroundColor: colors.primary, marginLeft: spacing.sm, marginTop: spacing.xs },
});