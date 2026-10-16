import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
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
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getShiftById(id)
      .then((s) => setShift(s ?? null))
      .catch((e: any) => setError(e.message ?? "Couldn't load this shift."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading || !shift) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center", padding: spacing.lg }]}>
        <Text style={styles.cardText}>{loading ? "Loading…" : error || "This shift isn't available."}</Text>
        {!loading ? <PrimaryButton title="Back to shifts" onPress={() => goBack("/(tabs)/shifts")} style={{ marginTop: spacing.lg }} /> : null}
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
        {shift.facility}
        {shift.location ? ` · ${shift.location}` : ""}
      </Text>

      {shift.tag ? (
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: colors.warningLight }]}>
            <Text style={[styles.pillText, { color: colors.warning }]}>{shift.tag}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>About this shift</Text>
        {!shift.duties.length && shift.description ? <Text style={styles.description}>{shift.description}</Text> : null}

        <View style={styles.infoBox}>
          <View style={styles.infoHeader}>
            <Ionicons name="calendar-outline" size={16} color={colors.text} />
            <Text style={styles.infoLabel}>DATE & TIME</Text>
          </View>
          <Text style={styles.infoValue}>
            {shift.date} · {shift.time}
          </Text>
        </View>

        {shift.location ? (
          <View style={styles.infoBox}>
            <View style={styles.infoHeader}>
              <Ionicons name="location-outline" size={16} color={colors.text} />
              <Text style={styles.infoLabel}>LOCATION</Text>
            </View>
            <Text style={styles.infoValue}>{shift.location}</Text>
          </View>
        ) : null}

        {shift.duties.length ? (
          <>
            <Text style={[styles.cardTitle, { marginTop: spacing.lg }]}>What you'll do</Text>
            {shift.duties.map((duty, i) => (
              <Text key={i} style={styles.duty}>
                • {duty}
              </Text>
            ))}
          </>
        ) : null}

        {shift.experience ? <Detail label="Minimum experience" value={shift.experience} /> : null}
        {shift.requirements ? <Detail label="Credentials needed" value={shift.requirements} /> : null}
        {shift.arrival ? <Detail label="On arrival" value={shift.arrival} /> : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.price}>{naira(shift.total)}</Text>
        <Text style={styles.priceSubtitle}>
          Pay for this shift{shift.hours > 0 ? ` · about ${naira(shift.rate)}/hour` : ""}
        </Text>

        <PrimaryButton
          title="Apply for this shift"
          onPress={() => router.push({ pathname: "/application-review", params: { id: shift.id } })}
          style={{ marginTop: spacing.md }}
        />

        <Text style={styles.applyNote}>The facility will review your application before confirming.</Text>
        <Text style={styles.applyNote}>Payment is released after the facility verifies shift completion.</Text>
      </View>
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginTop: spacing.lg }}>
      <Text style={styles.infoLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginTop: spacing.md },
  pill: { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  pillText: { ...typography.bodySmall, fontWeight: "700" },
  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  cardTitle: { ...typography.h3, color: colors.text },
  cardText: { ...typography.bodySmall, color: colors.text },
  description: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
  infoBox: { borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.md },
  infoHeader: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: "700" },
  infoValue: { ...typography.label, color: colors.text, marginTop: spacing.xs },
  duty: { ...typography.bodySmall, color: colors.text, marginTop: spacing.sm },
  price: { ...typography.h1, color: colors.text },
  priceSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  applyNote: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
});