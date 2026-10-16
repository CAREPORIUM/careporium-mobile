import { Pressable, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = { title: string; onPress: () => void; loading?: boolean; style?: StyleProp<ViewStyle> };

// Red filled button for destructive actions (remove). Same shape as PrimaryButton.
export default function DangerButton({ title, onPress, loading = false, style }: Props) {
  return (
    <Pressable style={[styles.button, style]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.text}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  text: { ...typography.label, color: colors.white, fontWeight: "700" },
});
