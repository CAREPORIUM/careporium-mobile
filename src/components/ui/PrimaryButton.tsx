// src/components/ui/PrimaryButton.tsx
import { Pressable, Text, StyleSheet, ActivityIndicator, PressableProps } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type PrimaryButtonProps = PressableProps & {
  title: string;
  loading?: boolean;
};

export default function PrimaryButton({ title, loading, disabled, style, ...rest }: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style as any,
      ]}
      disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  pressed: {
    backgroundColor: colors.primaryDark,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  text: {
    color: colors.white,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
});