import { ReactNode } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { colors, spacing, typography } from "@/constants/theme";

// Placeholder for screens whose designs haven't been implemented yet.
export default function ComingSoon({ title, subtitle, children }: { title: string; subtitle: string; children?: ReactNode }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title={title} subtitle={subtitle} />
      <Card style={styles.card}>
        <Text style={styles.text}>This screen is coming soon.</Text>
      </Card>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  card: { marginTop: spacing.lg },
  text: { ...typography.body, color: colors.textSecondary },
});
