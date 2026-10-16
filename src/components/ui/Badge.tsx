import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Tone = "success" | "warning" | "info";

const BG: Record<Tone, string> = { success: colors.successLight, warning: colors.warningLight, info: colors.primaryLight };
const FG: Record<Tone, string> = { success: colors.success, warning: colors.warning, info: colors.primary };

// Small coloured pill: Urgent, VERIFIED FACILITY, Active licence · Verified.
export default function Badge({ text, tone = "info", style }: { text: string; tone?: Tone; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.pill, { backgroundColor: BG[tone] }, style]}>
      <Text style={[styles.text, { color: FG[tone] }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: "flex-start", borderRadius: radius.round, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  text: { ...typography.bodySmall, fontWeight: "700" },
});
