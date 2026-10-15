import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator, } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getShiftById } from "@/services/shift.service";
import { Shift } from "@/types/shift";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function ShiftDetailsScreen() {
  
const { id } = useLocalSearchParams<{ id: string }>();
const [shift, setShift] = useState<Shift | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

async function loadShift() {
  if (!id) {
    setError("No shift ID was provided.");
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const result = await getShiftById(id);
    setShift(result ?? null);

    if (!result) {
      setError("This shift could not be found.");
    }
  } catch (e) {
    setError(
      e instanceof Error
        ? e.message
        : "Unable to load this shift. Please try again."
    );
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  loadShift();
}, [id]);

 
if (loading) {
  return (
    <View style={[styles.container, styles.centered]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.cardText}>Loading shift details...</Text>
    </View>
  );
}

if (error || !shift) {
  return (
    <View style={[styles.container, styles.centered]}>
      <Text style={styles.cardTitle}>Unable to show this shift</Text>
      <Text style={styles.cardText}>
        {error ?? "This shift could not be found."}
      </Text>
      <PrimaryButton
        title="Try again"
        onPress={loadShift}
        style={{ marginTop: spacing.md }}
      />
      <Pressable
        onPress={() => goBack("/(tabs)/shifts")}
        style={{ marginTop: spacing.md }}
      >
        <Text style={styles.infoValue}>Back to shifts</Text>
      </Pressable>
    </View>
  );
}


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => goBack("/(tabs)/shifts")}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>

      <Text style={styles.eyebrow}>SHIFT OPPORTUNITY</Text>
      <Text style={styles.title}>{shift.title}</Text>
<Text style={styles.subtitle}>
  {[shift.facility, shift.location].filter(Boolean).join(" · ")}
</Text>

      <View style={styles.pillRow}>
        {typeof shift.matchPercent === "number" && (
  <View style={[styles.pill, { backgroundColor: colors.successLight }]}>
    <Text style={[styles.pillText, { color: colors.success }]}>
      {shift.matchPercent}% MATCH
    </Text>
  </View>
)}
        {shift.verifiedFacility && (
  <View style={[styles.pill, { backgroundColor: colors.primaryLight }]}>
    <Text style={[styles.pillText, { color: colors.primary }]}>
      VERIFIED FACILITY
    </Text>
  </View>
)}
        {shift.tag && (
          <View style={[styles.pill, { backgroundColor: colors.warningLight }]}>
            <Text style={[styles.pillText, { color: colors.warning }]}>{shift.tag}</Text>
          </View>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About this shift</Text>
        <Text style={styles.description}>{shift.description}</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons name="calendar-outline" size={16} color={colors.text} />
            <Text style={styles.infoLabel}>DATE & TIME</Text>
          </View>
          <Text style={styles.infoValue}>{shift.date} · {shift.time}</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons name="location-outline" size={16} color={colors.text} />
            <Text style={styles.infoLabel}>LOCATION</Text>
          </View>
          <Text style={styles.infoValue}>
  {shift.location || "Location not provided"}
  {shift.distanceKm > 0 ? ` · ${shift.distanceKm} km away` : ""}
</Text>
        </View>

        <Text style={[styles.cardTitle, { marginTop: spacing.lg }]}>What you'll do</Text>
        {shift.duties.map((duty, i) => (
          <Text key={i} style={styles.duty}>• {duty}</Text>
        ))}
      </View>

      <View style={styles.card}>
        {shift.total > 0 && (
  <Text style={styles.price}>{naira(shift.total)}</Text>
)}

{shift.rate > 0 && (
  <Text style={styles.priceSubtitle}>
    Estimated earnings · {naira(shift.rate)}/hour
  </Text>
)}

        <PrimaryButton
          title="Apply for this shift"
          onPress={() => router.push({ pathname: "/application-review", params: { id: shift.id } })}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.applyNote}>Your profile and professional licence are verified. The facility will review your application before confirming.</Text>

        {shift.closesAt && (
  <View style={styles.closesPill}>
    <Text style={styles.closesPillText}>
      CLOSES {shift.closesAt.toUpperCase()}
    </Text>
  </View>
)}

        <Text style={styles.applyNote}>Payment is released after the facility verifies shift completion.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  pill: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  pillText: { ...typography.bodySmall, fontWeight: "700" },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.text },
  cardText: { ...typography.bodySmall, color: colors.text },
  description: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm, lineHeight: 20 },
  infoBox: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  infoHeader: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: "700" },
  infoValue: { ...typography.label, color: colors.text, marginTop: spacing.xs },
  duty: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm, lineHeight: 20 },
  price: { ...typography.h1, color: colors.text, textDecorationLine: "line-through", textDecorationColor: colors.textSecondary },
  priceSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  applyNote: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  closesPill: { backgroundColor: colors.warningLight, alignSelf: "flex-start", borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.md },
  closesPillText: { ...typography.bodySmall, color: colors.warning, fontWeight: "700" },
  centered: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.lg,
},
});