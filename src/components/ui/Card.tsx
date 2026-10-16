import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ReactNode } from "react";
import { colors, radius, spacing } from "@/constants/theme";

export default function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
});
