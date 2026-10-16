import { View, Text, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

// A grey, non-pressable button for "not available yet" states (Complete Shift, Add experience at the limit).
export default function DisabledButton({ title, style }: { title: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.box, style]} accessibilityState={{ disabled: true }}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  text: { ...typography.label, color: colors.textSecondary, fontWeight: "700" },
});
