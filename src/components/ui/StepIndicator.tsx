import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "@/constants/theme";

const STEPS = ["REVIEW", "SUBMIT", "FACILITY DECISION"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <View style={styles.row}>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const active = step === current;
        return (
          <View key={label} style={styles.stepWrap}>
            <View style={styles.stepRow}>
              <View style={[styles.circle, active && styles.circleActive]}>
                <Text style={[styles.number, active && styles.numberActive]}>{step}</Text>
              </View>
              {i < STEPS.length - 1 && <View style={styles.line} />}
            </View>
            <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", marginBottom: spacing.lg },
  stepWrap: { flex: 1 },
  stepRow: { flexDirection: "row", alignItems: "center" },
  circle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  circleActive: { backgroundColor: colors.primary },
  number: { ...typography.bodySmall, fontWeight: "700", color: colors.textSecondary },
  numberActive: { color: colors.white },
  line: { flex: 1, height: 1, backgroundColor: colors.borderLight, marginHorizontal: spacing.xs },
  label: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs, fontWeight: "600" },
  labelActive: { color: colors.primary },
});