import { Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { formatNaira } from "@/utils/format";
import { colors, spacing, typography } from "@/constants/theme";

export default function ShiftLiveScreen() {
  const { title, date, people, pay } = useLocalSearchParams<{ title?: string; date?: string; people?: string; pay?: string }>();
  const n = Number(people ?? 0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Your shift is live!" subtitle="Verified professionals can now see your shift and apply." />
      <Card style={[styles.gap, styles.box]}>
        <Text style={styles.ready}>You’re ready to receive applications</Text>
        <Text style={styles.line}>{title}</Text>
        <Text style={styles.line}>{date}</Text>
        <Text style={styles.line}>
          {n} {n === 1 ? "person" : "people"} needed · {formatNaira(Number(pay ?? 0))} each
        </Text>
        <PrimaryButton title="Manage shifts" onPress={() => router.replace("/facility/shifts")} style={styles.gap} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  box: { backgroundColor: colors.primaryLight },
  ready: { ...typography.h2, color: colors.success },
  line: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
});
