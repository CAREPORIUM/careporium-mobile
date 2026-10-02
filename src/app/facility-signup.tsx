import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import UploadRow from "@/components/ui/UploadRow";
import type { PickedFile } from "@/components/ui/UploadBox";
import { colors, radius, spacing, typography } from "@/constants/theme";

const FACILITY_TYPES = ["Hospital", "Clinic", "Medical Lab", "Pharmacy", "Home Care", "Other"];

function TopBar({ onBack, title, subtitle, step }: { onBack: () => void; title: string; subtitle: string; step: number }) {
  return (
    <View style={styles.topBar}>
      <Pressable style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <View style={{ flex: 1, marginLeft: spacing.md }}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.stepLabel}>Step {step} of 4</Text>
    </View>
  );
}

export default function FacilitySignupScreen() {
  const [step, setStep] = useState(1);

  // Step 1
  const [legalName, setLegalName] = useState("");
  const [facilityType, setFacilityType] = useState<string | null>(null);
  const [businessEmail, setBusinessEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirm, setHideConfirm] = useState(true);
  const [agreedStep1, setAgreedStep1] = useState(true);

  // Step 2
  const [regCert, setRegCert] = useState<PickedFile | null>(null);
  const [license, setLicense] = useState<PickedFile | null>(null);
  const [tin, setTin] = useState<PickedFile | null>(null);

  // Step 3
  const [fullName, setFullName] = useState("");
  const [position, setPosition] = useState("");
  const [personnelEmail, setPersonnelEmail] = useState("");
  const [personnelPhone, setPersonnelPhone] = useState("");

  // Step 4
  const [agreedFinal, setAgreedFinal] = useState(false);

  const step1Valid = legalName && facilityType && businessEmail && phone && location && password && confirmPassword && password === confirmPassword && agreedStep1;
  const step2Valid = regCert && license && tin;
  const step3Valid = fullName && position && personnelEmail && personnelPhone;

  const goBack = () => (step > 1 ? setStep(step - 1) : router.back());

  if (step === 1) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Pressable style={styles.backButtonAlone} onPress={goBack}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>Facility Information</Text>
        <Text style={styles.subtitle}>Basic information about your facility.</Text>
        <Text style={styles.stepLabelAlone}>Step 1 of 4</Text>

        <Text style={styles.label}>Facility Legal Name</Text>
        <AppInput placeholder="General Hospital" value={legalName} onChangeText={setLegalName} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Facility Type</Text>
        <AppSelect placeholder="Medical Lab" value={facilityType} options={FACILITY_TYPES} onChange={setFacilityType} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Business Email</Text>
        <AppInput placeholder="admin@facility.com" keyboardType="email-address" autoCapitalize="none" value={businessEmail} onChangeText={setBusinessEmail}
          leftIcon={<Ionicons name="mail-outline" size={20} color={colors.placeholder} />} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Phone Number</Text>
        <AppInput placeholder="+234 9082566035" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Location</Text>
        <AppInput placeholder="Ikeja, Lagos" value={location} onChangeText={setLocation} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Password</Text>
        <AppInput placeholder="••••••••••••" secureTextEntry={hidePassword} value={password} onChangeText={setPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
          rightIcon={<Pressable onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons name={hidePassword ? "eye-off-outline" : "eye-outline"} size={20} color={colors.placeholder} />
          </Pressable>} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Confirm Password</Text>
        <AppInput placeholder="••••••••••••" secureTextEntry={hideConfirm} value={confirmPassword} onChangeText={setConfirmPassword}
          leftIcon={<Ionicons name="lock-closed-outline" size={20} color={colors.placeholder} />}
          rightIcon={<Pressable onPress={() => setHideConfirm(!hideConfirm)}>
            <Ionicons name={hideConfirm ? "eye-off-outline" : "eye-outline"} size={20} color={colors.placeholder} />
          </Pressable>} />

        <Pressable style={styles.checkboxRow} onPress={() => setAgreedStep1(!agreedStep1)}>
          <View style={[styles.checkbox, agreedStep1 && styles.checkboxChecked]}>
            {agreedStep1 && <Ionicons name="checkmark" size={14} color={colors.white} />}
          </View>
          <Text style={styles.checkboxLabel}>I agree to the terms & conditions for careporium</Text>
        </Pressable>

        <PrimaryButton title="Next" disabled={!step1Valid} onPress={() => setStep(2)} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    );
  }

  if (step === 2) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onBack={goBack} title="Facility Document" subtitle="Upload the required documents to verify your healthcare facility." step={2} />

        <View style={styles.notice}>
          <Ionicons name="information-circle" size={20} color={colors.primary} />
          <Text style={styles.noticeText}>Supported file types: PDF, JPG, JPEG, PNG. Maximum file size: 5MB per document.</Text>
        </View>

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Business Registration Certificate</Text>
        <UploadRow placeholder="Upload your facility's official registration document." file={regCert} onChange={setRegCert} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Facility License</Text>
        <UploadRow placeholder="Upload a valid license or operating permit for your facility." file={license} onChange={setLicense} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Tax Identification Number (TIN)</Text>
        <UploadRow placeholder="Upload your facility's tax identification document." file={tin} onChange={setTin} />

        <PrimaryButton title="Next" disabled={!step2Valid} onPress={() => setStep(3)} style={{ marginTop: spacing.xl }} />
        <Pressable style={styles.backTextButton} onPress={goBack}>
          <Text style={styles.backTextLabel}>Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  if (step === 3) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onBack={goBack} title="Facility Personnel" subtitle="Provide details about key person at your facility." step={3} />

        <Text style={styles.label}>Full Name</Text>
        <AppInput placeholder="Luke Marcus" value={fullName} onChangeText={setFullName}
          leftIcon={<Ionicons name="person-outline" size={20} color={colors.placeholder} />} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Position/Role</Text>
        <AppInput placeholder="Director" value={position} onChangeText={setPosition}
          leftIcon={<Ionicons name="briefcase-outline" size={20} color={colors.placeholder} />} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Email Address</Text>
        <AppInput placeholder="Lukemarcus@gmail.com" keyboardType="email-address" autoCapitalize="none" value={personnelEmail} onChangeText={setPersonnelEmail}
          leftIcon={<Ionicons name="mail-outline" size={20} color={colors.placeholder} />} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Phone Number</Text>
        <AppInput placeholder="+234 9082566035" keyboardType="phone-pad" value={personnelPhone} onChangeText={setPersonnelPhone}
          leftIcon={<Ionicons name="call-outline" size={20} color={colors.placeholder} />} />

        <Text style={styles.footnote}>You can update this information later in account settings</Text>

        <PrimaryButton title="Next" disabled={!step3Valid} onPress={() => setStep(4)} style={{ marginTop: spacing.lg }} />
        <Pressable style={styles.backTextButton} onPress={goBack}>
          <Text style={styles.backTextLabel}>Back</Text>
        </Pressable>
      </ScrollView>
    );
  }

  // Step 4: Review & Submit
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TopBar onBack={goBack} title="Review & Submit" subtitle="Please review your information before submitting." step={4} />

      <View style={styles.reviewSectionHeader}>
        <Text style={styles.reviewSectionTitle}>Basic information</Text>
        <Pressable onPress={() => setStep(1)}><Text style={styles.editLink}>Edit</Text></Pressable>
      </View>
      {[legalName, facilityType, businessEmail, phone, location].map((v, i) => (
        <View key={i} style={styles.reviewRow}><Text style={styles.reviewText}>{v}</Text></View>
      ))}

      <View style={[styles.reviewSectionHeader, { marginTop: spacing.lg }]}>
        <Text style={styles.reviewSectionTitle}>Facility Document</Text>
        <Pressable onPress={() => setStep(2)}><Text style={styles.editLink}>Edit</Text></Pressable>
      </View>
      {[regCert, license, tin].map((f, i) => (
        <View key={i} style={styles.reviewRow}>
          <Text style={styles.reviewText}>{f?.name}</Text>
          <Ionicons name="close-circle" size={18} color={colors.error} />
        </View>
      ))}

      <View style={[styles.reviewSectionHeader, { marginTop: spacing.lg }]}>
        <Text style={styles.reviewSectionTitle}>Facility Personnel</Text>
        <Pressable onPress={() => setStep(3)}><Text style={styles.editLink}>Edit</Text></Pressable>
      </View>
      {[fullName, position, personnelEmail, personnelPhone].map((v, i) => (
        <View key={i} style={styles.reviewRow}><Text style={styles.reviewText}>{v}</Text></View>
      ))}

      <Pressable style={styles.checkboxRow} onPress={() => setAgreedFinal(!agreedFinal)}>
        <View style={[styles.checkbox, agreedFinal && styles.checkboxChecked]}>
          {agreedFinal && <Ionicons name="checkmark" size={14} color={colors.white} />}
        </View>
        <Text style={styles.checkboxLabel}>I agree to the Terms & Conditions and Privacy Policy</Text>
      </Pressable>

      <View style={styles.notice}>
        <Ionicons name="information-circle" size={20} color={colors.primary} />
        <Text style={styles.noticeText}>By submitting this registration, you confirm that the information and documents provided are accurate and belong to your healthcare facility.</Text>
      </View>

      <PrimaryButton title="Submit" disabled={!agreedFinal} onPress={() => router.replace("/facility-registration-submitted")} style={{ marginTop: spacing.lg }} />
      <Pressable style={styles.backTextButton} onPress={goBack}>
        <Text style={styles.backTextLabel}>Back</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  backButtonAlone: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  topBar: { flexDirection: "row", alignItems: "flex-start", marginBottom: spacing.lg },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  stepLabelAlone: { ...typography.bodySmall, color: colors.primary, marginTop: spacing.sm, marginBottom: spacing.lg },
  stepTitle: { ...typography.label, fontWeight: "700", color: colors.primary },
  stepSubtitle: { ...typography.bodySmall, color: colors.text, marginTop: 2 },
  stepLabel: { ...typography.bodySmall, color: colors.primary },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  notice: { flexDirection: "row", backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: spacing.md, gap: spacing.sm },
  noticeText: { flex: 1, ...typography.bodySmall, color: colors.text },
  footnote: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.lg },
  checkboxRow: { flexDirection: "row", alignItems: "flex-start", marginTop: spacing.lg, gap: spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: 2 },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxLabel: { ...typography.bodySmall, color: colors.text, flex: 1 },
  backTextButton: { alignItems: "center", marginTop: spacing.md, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md },
  backTextLabel: { color: colors.primary, ...typography.button },
  reviewSectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.sm },
  reviewSectionTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  editLink: { color: colors.primary, ...typography.bodySmall, fontWeight: "600" },
  reviewRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.primaryLight, borderRadius: radius.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  reviewText: { ...typography.bodySmall, color: colors.text },
});