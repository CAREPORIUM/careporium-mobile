import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppInput from "@/components/ui/AppInput";
import AppSelect from "@/components/ui/AppSelect";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getShifts } from "@/services/shift.service";
import { Shift } from "@/types/shift";
import { colors, radius, spacing, typography } from "@/constants/theme";

const LOCATIONS = ["Lagos · 25 km", "Lagos · 10 km", "Lagos · 50 km"];
const DATES = ["Any date", "Today", "This week", "This month"];
const SPECIALTIES = ["Nursing", "Doctor", "Pharmacy", "Lab"];

const naira = (n: number) => `₦${n.toLocaleString()}`;

function tagStyle(tag?: string | null) {
  if (tag === "URGENT") return { bg: "#FEF3C7", color: "#B45309" };
  if (tag === "NEW") return { bg: "#DCFCE7", color: colors.success };
  return { bg: "#DCFCE7", color: colors.success };
}

export default function ShiftsScreen() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState<string | null>(LOCATIONS[0]);
  const [date, setDate] = useState<string | null>(DATES[0]);
  const [specialty, setSpecialty] = useState<string | null>(SPECIALTIES[0]);

  useEffect(() => {
    getShifts().then(setShifts);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>SHIFT MARKETPLACE</Text>
      <Text style={styles.title}>Find your next healthcare shift.</Text>
      <Text style={styles.subtitle}>Explore verified facilities across Lagos. Choose shifts that fit your specialty and availability.</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Search shifts</Text>
        <AppInput placeholder="Role, specialty or facility" value={search} onChangeText={setSearch} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Location</Text>
        <AppSelect placeholder="Lagos · 25 km" value={location} options={LOCATIONS} onChange={setLocation} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Date</Text>
        <AppSelect placeholder="Any date" value={date} options={DATES} onChange={setDate} />

        <Text style={[styles.label, { marginTop: spacing.lg }]}>Specialty</Text>
        <AppSelect placeholder="Nursing" value={specialty} options={SPECIALTIES} onChange={setSpecialty} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recommended shifts</Text>
        <View style={styles.resultsPill}>
          <Text style={styles.resultsPillText}>{shifts.length} RESULTS</Text>
        </View>

        {shifts.map((shift) => {
          const t = tagStyle(shift.tag);
          return (
            <View key={shift.id} style={styles.shiftCard}>
              <Text style={styles.shiftTitle}>{shift.title}</Text>
              <Text style={styles.shiftFacility}>{shift.facility} · Verified facility</Text>

              {shift.tag ? (
                <View style={[styles.tagPill, { backgroundColor: t.bg }]}>
                  <Text style={[styles.tagPillText, { color: t.color }]}>{shift.tag}</Text>
                </View>
              ) : (
                <View style={[styles.tagPill, { backgroundColor: "#DCFCE7" }]}>
                  <Text style={[styles.tagPillText, { color: colors.success }]}>{shift.matchPercent}% MATCH</Text>
                </View>
              )}

              <Text style={styles.shiftMeta}>{shift.date} · {shift.time} · {shift.location} · {shift.distanceKm} km</Text>
              <Text style={styles.shiftRate}>{naira(shift.rate)}/hr · {naira(shift.total)} total</Text>

              <PrimaryButton
                title="View shift"
                onPress={() => router.push({ pathname: "/shift-details", params: { id: shift.id } })}
                style={{ marginTop: spacing.md }}
              />
            </View>
          );
        })}

        <Text style={styles.footnote}>Showing {shifts.length} of 24 sample shifts · All times are WAT</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Sort shifts</Text>
        <AppSelect placeholder="Best match" value="Best match" options={["Best match", "Newest", "Highest pay", "Closest"]} onChange={() => {}} />

        <View style={styles.verifiedRow}>
          <Ionicons name="checkmark-circle" size={14} color={colors.success} />
          <Text style={styles.verifiedText}>PROFILE VERIFIED</Text>
        </View>
        <Text style={styles.cardTitle}>Ready for your next shift</Text>
        <Text style={styles.cardText}>Your credentials are approved. Set your availability to improve your matches.</Text>

        <Text style={[styles.breakdownLabel, { marginTop: spacing.md }]}>Specialty</Text>
        <Text style={styles.breakdownValue}>Registered nurse</Text>
        <Text style={[styles.breakdownLabel, { marginTop: spacing.sm }]}>Search radius</Text>
        <Text style={styles.breakdownValue}>25 km</Text>

        <Pressable style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Update availability</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  label: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  cardTitle: { ...typography.h3, color: colors.text },
  cardText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  resultsPill: { backgroundColor: colors.primaryLight, alignSelf: "flex-start", borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, marginTop: spacing.sm, marginBottom: spacing.md },
  resultsPillText: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  shiftCard: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md },
  shiftTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  shiftFacility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  tagPill: { alignSelf: "flex-start", borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, marginTop: spacing.sm },
  tagPillText: { ...typography.bodySmall, fontWeight: "700" },
  shiftMeta: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
  shiftRate: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.xs },
  footnote: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", marginTop: spacing.sm },
  verifiedRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: spacing.lg },
  verifiedText: { ...typography.bodySmall, color: colors.success, fontWeight: "700" },
  breakdownLabel: { ...typography.bodySmall, color: colors.textSecondary },
  breakdownValue: { ...typography.label, fontWeight: "600", color: colors.text },
  outlineButton: { borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.sm, alignItems: "center", marginTop: spacing.lg },
  outlineButtonText: { color: colors.primary, ...typography.label, fontWeight: "600" },
});