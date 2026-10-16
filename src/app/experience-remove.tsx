import { useState } from "react";
import { Text, StyleSheet, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import SecondaryButton from "@/components/ui/SecondaryButton";
import DangerButton from "@/components/ui/DangerButton";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { getExperience, removeExperience } from "@/services/experience.service";
import { colors, spacing, typography } from "@/constants/theme";

export default function ExperienceRemoveScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const exp = id ? getExperience(id) : undefined;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleRemove = async () => {
    if (busy || !id) return;
    setBusy(true);
    setError("");
    try {
      await removeExperience(id);
      router.back();
    } catch (e: any) {
      setError(e.message ?? "Couldn't remove it. Try again.");
      setBusy(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Your experience & soft skills" subtitle="Help facilities understand where you’ve worked and how you work with others." />

      <Card style={styles.gap}>
        <Text style={styles.cardTitle}>Remove this experience?</Text>
        <Text style={styles.body}>
          {exp ? `Remove ${exp.title} at ${exp.workplace} from your recent experience.` : "Remove the selected role from your recent experience."}
        </Text>
        <Text style={styles.body}>This role will no longer appear on your profile. Your other experience and soft skills will stay.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <DangerButton title="Remove experience" onPress={handleRemove} loading={busy} style={styles.gap} />
        <SecondaryButton title="Keep experience" onPress={() => router.back()} style={styles.gapSmall} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.sm },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
});
