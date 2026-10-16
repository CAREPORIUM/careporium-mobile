import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Checkbox from "@/components/ui/Checkbox";
import SelectField from "@/components/ui/SelectField";
import FormInput from "@/components/ui/FormInput";
import ScreenTitle from "@/components/ui/ScreenTitle";
import {
  EXPERIENCE_OPTIONS,
  LOCATIONS,
  PEOPLE_OPTIONS,
  PROFESSIONS,
  SHIFT_TYPES,
  SPECIALTIES,
  ShiftDraft,
  dateLabel,
  getDraft,
  maskDate,
  maskTime,
  money,
  plural,
  saveForLater,
  setDraft,
  timeLabel,
  validate,
} from "@/services/facility-post.service";
import { getFacilityProfile } from "@/services/facility-profile.service";
import { formatNaira } from "@/utils/format";
import { colors, spacing, typography } from "@/constants/theme";

export default function PostShiftScreen() {
  const [d, setD] = useState<ShiftDraft>(getDraft());
  const [error, setError] = useState("");
  const facility = getFacilityProfile();

  const set = <K extends keyof ShiftDraft>(key: K, value: ShiftDraft[K]) => setD((cur) => ({ ...cur, [key]: value }));

  const pickProfession = (p: string) => setD((cur) => ({ ...cur, profession: p, specialty: SPECIALTIES[p]?.includes(cur.specialty) ? cur.specialty : "" }));

  const handleReview = () => {
    const problem = validate(d);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setDraft(d);
    router.push("/facility/review-shift");
  };

  const handleSaveLater = () => {
    saveForLater(d);
    Alert.alert("Draft saved", "Your shift is saved. You can come back to it any time from this screen.");
  };

  const m = money(d);
  const showSummary = m.total > 0 && d.profession;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <ScreenTitle title="Post a shift" subtitle="Tell us who you need and when. You can check everything before posting." />

        <Text style={styles.section}>Who do you need?</Text>

        <SelectField label="Profession" value={d.profession} options={PROFESSIONS} onChange={pickProfession} placeholder="Choose a profession" />
        <SelectField label="Specialty" value={d.specialty} options={SPECIALTIES[d.profession] ?? []} onChange={(v) => set("specialty", v)} placeholder={d.profession ? "Choose a specialty" : "Choose a profession first"} />
        <FormInput label="Shift date" value={d.date} onChangeText={(t) => set("date", maskDate(t))} placeholder="DD / MM / YYYY" keyboardType="number-pad" maxLength={14} />
        <SelectField label="Shift type" value={d.shiftType} options={SHIFT_TYPES} onChange={(v) => set("shiftType", v)} placeholder="Choose a shift type" />
        <FormInput label="Start time (WAT)" value={d.start} onChangeText={(t) => set("start", maskTime(t))} placeholder="07:00" keyboardType="number-pad" maxLength={5} />
        <FormInput label="End time (WAT)" value={d.end} onChangeText={(t) => set("end", maskTime(t))} placeholder="19:00" keyboardType="number-pad" maxLength={5} />
        <SelectField label="How many people do you need?" value={d.people} options={PEOPLE_OPTIONS} onChange={(v) => set("people", v)} placeholder="Choose a number" />
        <SelectField label="Experience needed" value={d.experience} options={EXPERIENCE_OPTIONS} onChange={(v) => set("experience", v)} placeholder="Choose a minimum" />
        <SelectField label="Location" value={d.location} options={LOCATIONS} onChange={(v) => set("location", v)} placeholder="Choose a location" />
        <FormInput label="Hourly pay (₦)" value={d.hourlyPay} onChangeText={(t) => set("hourlyPay", t.replace(/\D/g, ""))} placeholder="3,000" keyboardType="number-pad" />
        <FormInput label="What will they do?" value={d.description} onChangeText={(t) => set("description", t)} placeholder="Patient care, documentation and clinical handover" multiline maxLength={500} />
        <FormInput label="Licences and certifications needed" value={d.licences} onChangeText={(t) => set("licences", t)} placeholder="Active NMCN licence · BLS certification" />
        <FormInput label="Where should they report?" value={d.reportTo} onChangeText={(t) => set("reportTo", t)} placeholder="Please arrive at reception 15 minutes before your shift starts." multiline maxLength={300} />

        <Card style={styles.gap}>
          <Badge text="Urgent shift" tone="warning" />
          <View style={{ marginTop: spacing.md }}>
            <Checkbox label="Mark this shift as urgent" checked={d.urgent} onToggle={() => set("urgent", !d.urgent)} />
          </View>
          <Text style={styles.body}>Need cover soon? Mark this shift as urgent so available professionals can spot it.</Text>
        </Card>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <SecondaryButton title="Save for later" onPress={handleSaveLater} style={styles.gap} />
        <PrimaryButton title="Review shift" onPress={handleReview} style={styles.gapSmall} />

        {showSummary ? (
          <Card style={[styles.gap, styles.summary]}>
            <Text style={styles.cardTitle}>Shift summary</Text>
            <Text style={styles.body}>
              {m.people} {d.profession.toLowerCase()}
              {m.people > 1 ? "s" : ""} · {d.specialty}
            </Text>
            <Text style={styles.line}>
              {dateLabel(d)} · {timeLabel(d)}
            </Text>
            <Text style={styles.line}>
              {facility.name} · {d.location}
            </Text>
            <Text style={styles.money}>{formatNaira(m.perPerson)} for each person</Text>
            <Text style={styles.money}>{formatNaira(m.total)} for the whole shift</Text>
            <Text style={styles.body}>
              That’s {m.hours} hours at {formatNaira(m.rate)} an hour for {m.people} {plural(m.people, "person", "people")}. You’ll see any platform fees before you confirm.
            </Text>
            <Text style={styles.body}>Only verified professionals can apply. You’ll need to fund the shift before confirming their bookings.</Text>
          </Card>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  section: { ...typography.h3, color: colors.text, marginTop: spacing.lg },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  line: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.lg },
  summary: { backgroundColor: colors.primaryLight },
  cardTitle: { ...typography.h3, color: colors.text },
  money: { ...typography.h3, color: colors.text, marginTop: spacing.md },
});
