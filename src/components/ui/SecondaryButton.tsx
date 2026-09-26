// src/components/ui/SecondaryButton.tsx
import { Pressable, Text, StyleSheet, PressableProps, View } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type SecondaryButtonProps = PressableProps & {
  title: string;
  icon?: React.ReactNode;
};

export default function SecondaryButton({ title, icon, disabled, style, ...rest }: SecondaryButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style as any,
      ]}
      disabled={disabled}
      {...rest}
    >
      <View style={styles.content}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <Text style={[styles.text, disabled && styles.textDisabled]}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.md,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  pressed: {
    backgroundColor: "#EFF4FE", // faint blue tint, guessed — adjust once we have exact pressed-state design
  },
  disabled: {
    borderColor: colors.disabled,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    color: colors.primary,
    fontSize: typography.button.fontSize,
    fontWeight: typography.button.fontWeight,
  },
  textDisabled: {
    color: colors.disabled,
  },
});