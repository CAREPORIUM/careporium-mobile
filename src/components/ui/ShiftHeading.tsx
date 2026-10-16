import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

type Props = { title: string; lines: string[] };

// Shift title + the grey lines under it, shared by the worker and facility shift screens.
export default function ShiftHeading({ title, lines }: Props) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {lines.map((l) => (
        <Text key={l} style={styles.line}>
          {l}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.text },
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});
