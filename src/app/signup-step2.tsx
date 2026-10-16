import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { registerWorker } from "@/services/auth.service";
import { getSignupDraft, clearSignupDraft } from "@/utils/signupDraft";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

// Placeholder lists until the backend confirms the real ones
const PROFESSIONS = ["Doctor", "Nurse", "Pharmacist", "Lab Technician", "Other"];
const SPECIALTIES = ["Gynecologist", "Pediatrician", "Surgeon", "General Practice", "Other"];

// "Ikeja, Lagos" -> address "Ikeja, Lagos", state "Lagos"
function splitLocation(raw: string) {
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  const address = raw.trim();
  const state = parts.length > 1 ? parts[parts.length - 1] : undefined;
  return { address, state, country: "Nigeria" };
}

export default function SignupStep2Screen() {
  const [profession, setProfession] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string | null>(null);
  const [experience, setExperience] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isValid = profession && specialty && experience && agreed;

  const handleRegister = async () => {
    const draft = getSignupDraft();
    if (!draft) {
      setError("Your details were lost. Please go back and fill in step 1 again.");
      return;
    }

    const years = parseInt(experience.replace(/\D/g, ""), 10);
    if (Number.isNaN(years)) {
      setError("Enter your years of experience as a number.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await registerWorker({
        fullName: draft.fullName,
        email: draft.email,
        phoneNumber: draft.phoneNumber,
        password: draft.password,
        profession: profession as string,
        specialty: specialty as string,
        yearsOfExperience: years,
        location: splitLocation(draft.location),
      });
      clearSignupDraft();
      router.dismissAll();
      router.replace({ pathname: "/verify-otp", params: { email: draft.email } });
    } catch (e: any) {
      setError(e.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Pressable style={styles.backButton} onPress={() => goBack("/signup")}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Professional Profile</Text>
      <Text style={styles.subtitle}>Credential / expertise</Text>
      <Text style={styles.step}>Step 2 of 2</Text>

      <Text style={styles.label}>Profession</Text>
      <AppSelect placeholder="Doctor" value={profession} options={PROFESSIONS} onChange={setProfession}
        leftIcon={<Ionicons name="school-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Specialty</Text>
      <AppSelect placeholder="Gynecologist" value={specialty} options={SPECIALTIES} onChange={setSpecialty}
        leftIcon={<Ionicons name="school-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Years of experience</Text>
      <AppInput placeholder="e.g 4 years" keyboardType="numeric" value={experience} onChangeText={setExperience} />

      <Pressable style={styles.checkboxRow} onPress={() => setAgreed(!agreed)}>
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Ionicons name="checkmark" size={14} color={colors.white} />}
        </View>
        <Text style={styles.checkboxLabel}>I agree to the terms & conditions for careporium</Text>
      </Pressable>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <PrimaryButton title="Register" disabled={!isValid} loading={loading} onPress={handleRegister} style={{ marginTop: spacing.lg }} />
      <Text style={styles.footnote}>You can update this information later in account settings</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  step: { ...typography.h3, color: colors.text, marginTop: spacing.lg, marginBottom: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.xl, gap: spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxLabel: { ...typography.bodySmall, color: colors.text, flex: 1 },
  errorText: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
  footnote: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.md },
});