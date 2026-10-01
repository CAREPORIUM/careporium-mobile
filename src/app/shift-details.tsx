import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { getShiftById } from "@/services/shift.service";
import { Shift } from "@/types/shift";
import { colors, radius, spacing, typography } from "@/constants/theme";

const naira = (n: number) => `₦${n.toLocaleString()}`;

export default function ShiftDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [shift, setShift] = useState<Shift | null>(null);

  useEffect(() => {
    if (id) getShiftById(id).then((s) => setShift(s ?? null));
  }, [id]);

  if (!shift) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={styles.cardText}>Loading…</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>SHIFT OPPORTUNITY</Text>
      <Text style={styles.title}>{shift.title}</Text>
      <Text style={styles.subtitle}>{shift.facility} · {shift.location}</Text>

      <View style={styles.pillRow}>
        <View style={[styles.pill, { backgroundColor: "#DCFCE7" }]}>
          <Text style={[styles.pillText, { color: colors.success }]}>{shift.matchPercent}% MATCH</Text>
        </View>
        <View style={[styles.pill, { backgroundColor: colors.primaryLight }]}>
          <Text style={[styles.pillText, { color: colors.primary }]}>VERIFIED FACILITY</Text>
        </View>
        {shift.tag && (
          <View style={[styles.pill, { backgroundColor: "#FEF3C7" }]}>
            <Text style={[styles.pillText, { color: "#B45309" }]}>{shift.tag}</Text>
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
          <Text style={styles.infoValue}>{shift.location} · {shift.distanceKm} km away</Text>
        </View>

        <Text style={[styles.cardTitle, { marginTop: spacing.lg }]}>What you'll do</Text>
        {shift.duties.map((duty, i) => (
          <Text key={i} style={styles.duty}>• {duty}</Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.price}>{naira(shift.total)}</Text>
        <Text style={styles.priceSubtitle}>Estimated earnings · {naira(shift.rate)}/hour</Text>

        <PrimaryButton
          title="Apply for this shift"
          onPress={() => router.push({ pathname: "/application-review", params: { id: shift.id } })}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.applyNote}>Your profile and professional licence are verified. The facility will review your application before confirming.</Text>

        <View style={styles.closesPill}>
          <Text style={styles.closesPillText}>CLOSES {shift.closesAt.toUpperCase()}</Text>
        </View>

        <Text style={styles.applyNote}>Payment is released after the facility verifies shift completion.</Text>
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
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  pill: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  pillText: { ...typography.bodySmall, fontWeight: "700" },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.text },
  description: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm, lineHeight: 20 },
  infoBox: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  infoHeader: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: "700" },
  infoValue: { ...typography.label, color: colors.text, marginTop: spacing.xs },
  duty: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm, lineHeight: 20 },
  price: { ...typography.h1, color: colors.text, textDecorationLine: "line-through", textDecorationColor: colors.textSecondary },
  priceSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  applyNote: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  closesPill: { backgroundColor: "#FEF3C7", alignSelf: "flex-start", borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4, marginTop: spacing.md },
  closesPillText: { ...typography.bodySmall, color: "#B45309", fontWeight: "700" },
});