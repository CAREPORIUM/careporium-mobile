import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import UploadBox, { PickedFile } from "@/components/ui/UploadBox";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const STEP_NAMES = ["Professional License", "Identification Document", "Education Certificate", "Proof of Address"];
const ID_TYPES = ["National ID", "Driver's License", "Passport"];

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={styles.backButton} onPress={onPress}>
      <Ionicons name="arrow-back" size={20} color={colors.text} />
    </Pressable>
  );
}

function TopBar({ onBack, title, step }: { onBack: () => void; title?: string; step?: number }) {
  return (
    <View style={styles.topBar}>
      <BackButton onPress={onBack} />
      {title ? <Text style={styles.topTitle}>{title}</Text> : <View style={{ flex: 1 }} />}
      {step ? <Text style={styles.stepLabel}>Step {step} of 4</Text> : null}
    </View>
  );
}

function SecureBanner() {
  return (
    <View style={styles.banner}>
      <Ionicons name="shield-checkmark" size={36} color={colors.primary} />
      <View style={{ marginLeft: spacing.md }}>
        <Text style={styles.bannerTitle}>Secure & Encrypted</Text>
        <Text style={styles.bannerText}>Your information is safe with us.</Text>
      </View>
    </View>
  );
}

function Stepper({ current }: { current: number }) {
  return (
    <View style={{ marginVertical: spacing.lg }}>
      {STEP_NAMES.map((name, i) => {
        const active = i + 1 === current;
        return (
          <View key={name}>
            <View style={styles.stepRow}>
              <View style={[styles.stepCircle, active && styles.stepCircleActive]}>
                <Text style={[styles.stepNumber, active && { color: colors.white }]}>{i + 1}</Text>
              </View>
              <Text style={[styles.stepName, active && { color: colors.primary }]}>{name}</Text>
            </View>
            {i < STEP_NAMES.length - 1 && <View style={styles.stepLine} />}
          </View>
        );
      })}
    </View>
  );
}

export default function CredentialsScreen() {
  const [step, setStep] = useState(1);
  const [license, setLicense] = useState<PickedFile | null>(null);
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingState, setIssuingState] = useState("");
  const [expiry, setExpiry] = useState("");
  const [idType, setIdType] = useState(ID_TYPES[0]);
  const [idFile, setIdFile] = useState<PickedFile | null>(null);
  const [education, setEducation] = useState<PickedFile | null>(null);
  const [address, setAddress] = useState<PickedFile | null>(null);

  const handleBack = () => (step > 1 ? setStep(step - 1) : goBack("/(tabs)/profile"));

  // Step 1, nothing picked yet: intro screen with the 4-step list
  if (step === 1 && !license) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <BackButton onPress={handleBack} />
          <Text style={styles.brand}>CAREPORIUM</Text>
          <View style={{ width: 44 }} />
        </View>
        <Text style={styles.title}>Upload your credentials</Text>
        <Text style={styles.subtitle}>
          Help us verify your professional credentials to ensure a safe and trusted marketplace.
        </Text>
        <Stepper current={1} />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Professional License</Text>
          <Text style={styles.cardText}>Upload a clear photo or PDF of your Professional License</Text>
          <View style={{ marginTop: spacing.md }}>
            <UploadBox file={license} onChange={setLicense} />
          </View>
        </View>
        <PrimaryButton title="Continue" disabled style={{ marginTop: spacing.lg }} />
      </ScrollView>
    );
  }

  // Step 1, file picked: preview + license details
  if (step === 1) {
    const valid = licenseNumber && issuingState && expiry;
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onBack={handleBack} title="Professional License" step={1} />
        <SecureBanner />
        <Text style={styles.blueTitle}>Upload Professional License</Text>
        <Text style={styles.subtitle}>Make sure the document is clear, valid and not expired.</Text>
        <View style={{ marginTop: spacing.lg }}>
          <UploadBox file={license} onChange={setLicense} />
        </View>
        <View style={[styles.card, { marginTop: spacing.lg }]}>
          <Text style={styles.cardTitle}>License Details</Text>
          <Text style={styles.fieldLabel}>License Number</Text>
          <AppInput placeholder="RN-123456" value={licenseNumber} onChangeText={setLicenseNumber} autoCapitalize="characters" />
          <Text style={styles.fieldLabel}>Issuing State</Text>
          <AppInput placeholder="Lagos State" value={issuingState} onChangeText={setIssuingState} />
          <Text style={styles.fieldLabel}>Expiration Date</Text>
          <AppInput placeholder="May 31, 2029" value={expiry} onChangeText={setExpiry} />
        </View>
        <PrimaryButton title="Continue" disabled={!valid} onPress={() => setStep(2)} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    );
  }

  // Step 2: ID document (provisional, modeled on the overview image)
  if (step === 2) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <TopBar onBack={handleBack} title="ID Document" step={2} />
        <SecureBanner />
        <Text style={styles.blueTitle}>Upload ID Document</Text>
        <Text style={styles.subtitle}>Provide a government-issued ID for identity verification.</Text>
        <View style={{ marginTop: spacing.lg }}>
          <UploadBox file={idFile} onChange={setIdFile} />
        </View>
        <Text style={[styles.fieldLabel, { marginTop: spacing.lg }]}>Document Type</Text>
        <View style={styles.chipRow}>
          {ID_TYPES.map((type) => (
            <Pressable key={type} style={[styles.chip, idType === type && styles.chipActive]} onPress={() => setIdType(type)}>
              <Text style={[styles.chipText, idType === type && { color: colors.white }]}>{type}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton title="Continue" disabled={!idFile} onPress={() => setStep(3)} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    );
  }

  // Step 3: education certificate + proof of address on one screen, as in the design
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <TopBar onBack={handleBack} />
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Education Certificate</Text>
        <Text style={styles.stepLabel}>Step 3 of 4</Text>
      </View>
      <UploadBox file={education} onChange={setEducation} />
      <View style={[styles.sectionRow, { marginTop: spacing.lg }]}>
        <Text style={styles.sectionTitle}>Proof of Address</Text>
        <Text style={styles.stepLabel}>Step 4 of 4</Text>
      </View>
      <UploadBox file={address} onChange={setAddress} />
      <PrimaryButton
        title="Continue"
        disabled={!education || !address}
        onPress={() => router.replace("/credentials-submitted")}
        style={{ marginTop: spacing.lg }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl, paddingBottom: spacing.xxl },
  topBar: { flexDirection: "row", alignItems: "center", marginBottom: spacing.lg },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  brand: { flex: 1, textAlign: "center", ...typography.h3, color: colors.primary },
  topTitle: { flex: 1, marginLeft: spacing.md, ...typography.label, fontWeight: "600", color: colors.text },
  stepLabel: { ...typography.bodySmall, color: colors.primary },
  title: { ...typography.h2, color: colors.text },
  blueTitle: { ...typography.h2, color: colors.primary, marginTop: spacing.lg },
  subtitle: { ...typography.bodySmall, color: colors.text, marginTop: spacing.xs },
  banner: { flexDirection: "row", alignItems: "center", backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: spacing.md },
  bannerTitle: { ...typography.label, fontWeight: "600", color: colors.text },
  bannerText: { ...typography.bodySmall, color: colors.text },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
  cardTitle: { ...typography.label, fontWeight: "600", color: colors.text },
  cardText: { ...typography.bodySmall, color: colors.text, marginTop: spacing.xs },
  fieldLabel: { ...typography.bodySmall, color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  stepRow: { flexDirection: "row", alignItems: "center" },
  stepCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  stepCircleActive: { backgroundColor: colors.primary },
  stepNumber: { ...typography.label, color: colors.text },
  stepName: { ...typography.label, fontWeight: "600", color: colors.text, marginLeft: spacing.md },
  stepLine: { width: 1, height: 14, backgroundColor: colors.text, marginLeft: 21 },
  chipRow: { flexDirection: "row", gap: spacing.sm, flexWrap: "wrap" },
  chip: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.sm, paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  chipActive: { backgroundColor: colors.primary },
  chipText: { ...typography.bodySmall, color: colors.primary },
  sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { ...typography.label, fontWeight: "600", color: colors.text },
});