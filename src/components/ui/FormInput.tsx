import { View, Text, TextInput, TextInputProps, StyleSheet } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = TextInputProps & { label?: string; hint?: string };

// Labelled text field. Pass multiline for a taller box.
export default function FormInput({ label, hint, style, multiline, ...rest }: Props) {
  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, multiline && styles.multiline, style]}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        {...rest}
      />
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { ...typography.label, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  input: {
    ...typography.body,
    color: colors.text,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  multiline: { minHeight: 100 },
  hint: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
