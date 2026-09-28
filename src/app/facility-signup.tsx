import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography } from "@/constants/theme";

const FACILITY_TYPES = ["Hospital", "Clinic", "Medical Lab", "Pharmacy", "Home Care", "Other"]; // placeholder

export default function FacilitySignupScreen() {
  const [legalName, setLegalName] = useState("");
  const [facilityType, setFacilityType] = useState<string | null>(null);
  const [taxId, setTaxId] = useState("");
  const [email, setEmail] = useState("");
  const [adminName, setAdminName] = useState("");
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(true);

  const isValid = legalName && facilityType && taxId && email && adminName && phone && agreed;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: spacing.xxl }}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Health Facility</Text>
      <Text style={styles.subtitle}>Let's get you started.</Text>

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Facility Legal Name</Text>
      <AppInput placeholder="e.g., Northside Regional Medical Center" value={legalName} onChangeText={setLegalName} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Facility Type</Text>
      <AppSelect placeholder="e.g., Medical Lab" value={facilityType} options={FACILITY_TYPES} onChange={setFacilityType} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Tax ID (EIN)</Text>
      <AppInput placeholder="XX-XXXXXXX" value={taxId} onChangeText={setTaxId} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Business Email</Text>
      <AppInput placeholder="admin@facility.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail}
        leftIcon={<Ionicons name="mail-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Admin Name</Text>
      <AppInput placeholder="e.g., Dr. Paul Johnson" value={adminName} onChangeText={setAdminName}
        leftIcon={<Ionicons name="person-outline" size={20} color={colors.placeholder} />} />

      <Text style={[styles.label, { marginTop: spacing.lg }]}>Phone</Text>
      <AppInput placeholder="(234) 000-000" keyboardType="phone-pad" value={phone} onChangeText={setPhone}
        leftIcon={<Ionicons name="call-outline" size={20} color={colors.placeholder} />} />

      <Pressable style={styles.checkboxRow} onPress={() => setAgreed(!agreed)}>
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Ionicons name="checkmark" size={14} color={colors.white} />}
        </View>
        <Text style={styles.checkboxLabel}>I agree to the terms & conditions for careporium</Text>
      </Pressable>

      <PrimaryButton title="Continue" disabled={!isValid} onPress={() => router.push("/account-created")} style={{ marginTop: spacing.lg }} />
      <Text style={styles.footnote}>You can update this information later in account settings</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.lg, gap: spacing.sm },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 1, borderColor: colors.primary, alignItems: "center", justifyContent: "center" },
  checkboxChecked: { backgroundColor: colors.primary },
  checkboxLabel: { ...typography.bodySmall, color: colors.text, flex: 1 },
  footnote: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.md },
});