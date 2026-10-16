import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Checkbox from "@/components/ui/Checkbox";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import {
  getExperience,
  maskMonthYear,
  parseMonthYear,
  saveExperience,
  toInputText,
  getExperiences,
  MAX_EXPERIENCES,
} from "@/services/experience.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

// One screen for both "Add experience" (no id) and "Edit experience" (?id=...).
export default function ExperienceFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const existing = id ? getExperience(id) : undefined;
  const editing = !!existing;
  const roomLeft = MAX_EXPERIENCES - getExperiences().length;

  const [title, setTitle] = useState(existing?.title ?? "");
  const [workplace, setWorkplace] = useState(existing?.workplace ?? "");
  const [location, setLocation] = useState(existing?.location ?? "");
  const [start, setStart] = useState(toInputText(existing?.start ?? null));
  const [end, setEnd] = useState(toInputText(existing?.end ?? null));
  const [current, setCurrent] = useState(editing ? existing!.end === null : false);
  const [responsibilities, setResponsibilities] = useState(existing?.responsibilities ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subtitle = editing
    ? "Update the details of this role."
    : roomLeft === 1
    ? "You have room for one more experience. Add a recent role."
    : "Add a recent role. Start with your newest.";

  const handleSave = async () => {
    if (saving) return;
    setError("");

    if (!title.trim() || !workplace.trim() || !location.trim()) return setError("Add a job title, workplace and location.");
    const s = parseMonthYear(start);
    if (!s) return setError("Start date should look like 01 / 2020.");
    let e = null;
    if (!current) {
      e = parseMonthYear(end);
      if (!e) return setError("End date should look like 12 / 2020, or tick “I currently work here”.");
      if (e.year * 12 + e.month < s.year * 12 + s.month) return setError("End date can't be before the start date.");
    }
    if (!responsibilities.trim()) return setError("Briefly describe your responsibilities.");

    setSaving(true);
    try {
      await saveExperience(
        { title: title.trim(), workplace: workplace.trim(), location: location.trim(), start: s, end: e, responsibilities: responsibilities.trim() },
        id
      );
      router.back();
    } catch (err: any) {
      setError(err.message ?? "Couldn't save. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle title="Your experience & soft skills" subtitle="Help facilities understand where you’ve worked and how you work with others." />

        <Card style={styles.gap}>
          <Text style={styles.cardTitle}>{editing ? "Edit experience" : "Add experience"}</Text>
          <Text style={styles.body}>{subtitle}</Text>

          <Text style={styles.label}>Job title</Text>
          <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Nursing intern" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Workplace</Text>
          <TextInput style={styles.input} value={workplace} onChangeText={setWorkplace} placeholder="Lagos University Teaching Hospital" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Location</Text>
          <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Idi-Araba, Lagos" placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Start month / year</Text>
          <TextInput
            style={styles.input}
            value={start}
            onChangeText={(t) => setStart(maskMonthYear(t))}
            placeholder="01 / 2020"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            maxLength={9}
          />

          <Text style={styles.label}>End month / year</Text>
          <TextInput
            style={[styles.input, current && styles.inputDisabled]}
            value={current ? "Present" : end}
            onChangeText={(t) => setEnd(maskMonthYear(t))}
            editable={!current}
            placeholder="12 / 2020"
            placeholderTextColor={colors.textSecondary}
            keyboardType="number-pad"
            maxLength={9}
          />

          <Checkbox label="I currently work here" checked={current} onToggle={() => setCurrent(!current)} />
          <Text style={styles.body}>For a current role, leave the end date as Present.</Text>

          <Text style={styles.label}>Responsibilities</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={responsibilities}
            onChangeText={setResponsibilities}
            multiline
            textAlignVertical="top"
            placeholder="What did you do in this role?"
            placeholderTextColor={colors.textSecondary}
            maxLength={500}
          />
          <Text style={styles.body}>Briefly describe your responsibilities. Don’t include patient names or private information.</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton title={editing ? "Save changes" : "Save experience"} onPress={handleSave} loading={saving} style={styles.gap} />
          <SecondaryButton title="Cancel" onPress={() => router.back()} style={styles.gapSmall} />
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.sm },
  cardTitle: { ...typography.h3, color: colors.text },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
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
  },
  inputDisabled: { backgroundColor: colors.background, color: colors.textSecondary },
  multiline: { minHeight: 120 },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
});
