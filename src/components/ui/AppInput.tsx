import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
} from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type AppInputProps = TextInputProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function AppInput({
  leftIcon,
  rightIcon,
  style,
  ...rest
}: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.placeholder}
        {...rest}
      />

      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 56,
  },

  leftIcon: {
    marginRight: spacing.sm,
  },

  rightIcon: {
    marginLeft: spacing.sm,
  },

  input: {
    flex: 1,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
});