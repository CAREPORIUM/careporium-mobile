import { useCallback, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import StatusBanner from "@/components/ui/StatusBanner";
import DisabledButton from "@/components/ui/DisabledButton";
import Checkbox from "@/components/ui/Checkbox";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import {
  Experience,
  MAX_EXPERIENCES,
  SOFT_SKILLS,
  formatRange,
  getExperiences,
  getSoftSkills,
  saveSoftSkills,
} from "@/services/experience.service";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function ExperienceScreen() {
  const [items, setItems] = useState<Experience[]>(getExperiences());
  const [skills, setSkills] = useState<string[]>(getSoftSkills());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Reload the list when coming back from the add / edit / remove screens.
  useFocusEffect(
    useCallback(() => {
      setItems(getExperiences());
    }, [])
  );

  const toggle = (s: string) => setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  const handleSaveSkills = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      await saveSoftSkills(skills);
      setSaved(true);
    } catch (e: any) {
      setError(e.message ?? "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const atLimit = items.length >= MAX_EXPERIENCES;

  if (saved) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenTitle title="Your experience & soft skills" subtitle="Help facilities understand where you’ve worked and how you work with others." />
        <StatusBanner
          style={styles.gap}
          title="Your profile is up to date"
          text="Your recent experience and selected soft skills are saved."
        />
        <PrimaryButton title="Back to experience" onPress={() => setSaved(false)} style={styles.gap} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle
        title="Your experience & soft skills"
        subtitle="Help facilities understand where you’ve worked and how you work with others."
        onBack={() => goBack("/(tabs)/profile")}
      />

      <Card style={styles.gap}>
        <Text style={styles.cardTitle}>Recent work experience</Text>
        <Text style={styles.body}>Keep up to 3 recent roles, with your newest experience first.</Text>
        <Text style={styles.count}>
          {items.length} of {MAX_EXPERIENCES} experiences
        </Text>

        {items.map((e) => (
          <View key={e.id} style={styles.expCard}>
            <Text style={styles.expTitle}>{e.title}</Text>
            <Text style={styles.body}>
              {e.workplace} · {e.location}
            </Text>
            <Text style={styles.body}>{formatRange(e)}</Text>
            <Text style={styles.body}>{e.responsibilities}</Text>
            <SecondaryButton
              title="Edit experience"
              onPress={() => router.push({ pathname: "/experience-form", params: { id: e.id } })}
              style={styles.gapSmall}
            />
            <SecondaryButton
              title="Remove"
              onPress={() => router.push({ pathname: "/experience-remove", params: { id: e.id } })}
              style={styles.gapSmall}
            />
          </View>
        ))}

        {items.length === 0 && <Text style={styles.body}>No experience added yet. Start with your most recent role.</Text>}

        {atLimit ? (
          <>
            <DisabledButton title="Add experience" style={styles.gap} />
            <Text style={styles.body}>You’ve added 3 experiences. Edit a role or remove an older one to add another.</Text>
          </>
        ) : (
          <PrimaryButton title="Add experience" onPress={() => router.push("/experience-form")} style={styles.gap} />
        )}
      </Card>

      <Card style={styles.gap}>
        <Text style={styles.cardTitle}>Soft skills</Text>
        <Text style={styles.body}>Choose the skills that reflect how you work.</Text>
        <View style={styles.skills}>
          {SOFT_SKILLS.map((s) => (
            <Checkbox key={s} label={s} checked={skills.includes(s)} onToggle={() => toggle(s)} />
          ))}
        </View>
        <Text style={styles.body}>Facilities will see these on your professional profile.</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Save soft skills" onPress={handleSaveSkills} loading={saving} style={styles.gap} />
      </Card>

      <SecondaryButton title="Back to profile" onPress={() => goBack("/(tabs)/profile")} style={styles.gap} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.sm },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  count: { ...typography.label, color: colors.primary, marginTop: spacing.md },
  expCard: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  expTitle: { ...typography.h3, color: colors.text },
  skills: { marginTop: spacing.sm },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
});
