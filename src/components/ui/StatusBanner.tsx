import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

export type BannerKind = "info" | "success" | "error" | "warning";

const BG: Record<BannerKind, string> = {
  info: colors.primaryLight,
  success: colors.successLight,
  error: colors.errorLight,
  warning: colors.warningLight,
};

type Props = {
  kind?: BannerKind;
  title: string;
  text?: string;
  style?: StyleProp<ViewStyle>;
};

// The coloured box at the top of most screens: "Confirmed · Ready to clock in", errors, success.
export default function StatusBanner({ kind = "info", title, text, style }: Props) {
  return (
    <View style={[styles.box, { backgroundColor: BG[kind] }, style]}>
      <Text style={styles.title}>{title}</Text>
      {text ? <Text style={styles.text}>{text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  title: { ...typography.h3, color: colors.text },
  text: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
});
