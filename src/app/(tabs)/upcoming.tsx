import { ScrollView, StyleSheet, Text, View, Pressable, Alert, Linking } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { useWorkerData } from "@/hooks/useWorkerData";
import { getUpcoming, startsLabel } from "@/services/worker-data.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function UpcomingScreen() {
  const { loading, loaded, error } = useWorkerData();
  const list = getUpcoming();
  const first = list[0];
  const shift = first?.shift;

  const openMap = () => {
    if (!shift?.location) return Alert.alert("Directions", "The facility hasn't added a location yet.");
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shift.location)}`).catch(() =>
      Alert.alert("Directions", "Couldn't open maps on this device.")
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>UPCOMING</Text>
      <Text style={styles.title}>Your next confirmed shift.</Text>
      <Text style={styles.subtitle}>Everything you need to prepare and arrive with confidence.</Text>

      {error ? <Text style={[styles.subtitle, { color: colors.error }]}>{error}</Text> : null}
      {loading && !loaded ? <Text style={styles.subtitle}>Loading your shifts…</Text> : null}

      {!shift && loaded ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No confirmed shifts yet</Text>
          <Text style={styles.noteText}>When a facility accepts your application, the shift shows up here with everything you need to clock in.</Text>
          <PrimaryButton title="Find shifts" onPress={() => router.push("/(tabs)/shifts")} style={{ marginTop: spacing.lg }} />
        </View>
      ) : null}

      {shift ? (
        <>
          <View style={styles.shiftCard}>
            <View style={styles.pills}>
              <View style={styles.confirmedPill}>
                <Ionicons name="checkmark" size={14} color={colors.success} />
                <Text style={styles.confirmedText}>CONFIRMED</Text>
              </View>
              {startsLabel(shift.sortKey) ? (
                <View style={styles.startPill}>
                  <Text style={styles.startText}>{startsLabel(shift.sortKey)}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.shiftTitle}>{shift.title}</Text>
            <Text style={styles.facility}>{shift.facility}</Text>

            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>
                {shift.date} · {shift.time}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
              <Text style={styles.infoText}>{shift.location || "Location to be confirmed"}</Text>
            </View>

            <PrimaryButton
              title="View shift and clock in"
              onPress={() => router.push({ pathname: "/upcoming-shift", params: { id: shift.id } })}
              style={{ marginTop: spacing.lg }}
            />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Before your shift</Text>
            <Checklist checked text="Facility confirmed your booking" />
            <Checklist text="Review arrival instructions" />
            <Checklist text="Scan the facility's QR when you arrive to clock in" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Arrival information</Text>
            <Info label="Location" value={shift.location || "To be confirmed"} />
            <Info label="Shift starts" value={shift.time.split("–")[0] || "—"} />
            {shift.arrival ? (
              <View style={styles.note}>
                <Text style={styles.noteText}>{shift.arrival}</Text>
              </View>
            ) : null}

            <Pressable style={styles.outlineButton} onPress={openMap}>
              <Ionicons name="navigate-outline" size={18} color={colors.primary} />
              <Text style={styles.outlineText}>View directions</Text>
            </Pressable>
          </View>

          {list.length > 1 ? (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Also coming up</Text>
              {list.slice(1).map((a) => (
                <Pressable key={a.id} onPress={() => router.push({ pathname: "/upcoming-shift", params: { id: a.shiftId } })} style={styles.info}>
                  <Text style={styles.infoValue}>{a.title}</Text>
                  <Text style={styles.infoLabel}>
                    {a.date} · {a.facility}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}

function Checklist({ checked = false, text }: { checked?: boolean; text: string }) {
  return (
    <View style={styles.checkRow}>
      <View style={[styles.checkCircle, checked && styles.checkedCircle]}>
        {checked && <Ionicons name="checkmark" size={14} color={colors.white} />}
      </View>
      <Text style={[styles.checkText, checked && styles.checkedText]}>{text}</Text>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  shiftCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, marginTop: spacing.lg, padding: spacing.lg },
  pills: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  confirmedPill: { flexDirection: "row", alignItems: "center", backgroundColor: colors.card, borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, gap: 4 },
  confirmedText: { color: colors.success, ...typography.bodySmall, fontWeight: "800" },
  startPill: { backgroundColor: colors.primaryLight, borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  startText: { color: colors.primary, ...typography.bodySmall, fontWeight: "800" },
  shiftTitle: { ...typography.h3, color: colors.text, marginTop: spacing.lg },
  facility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  infoRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.sm },
  infoText: { ...typography.bodySmall, color: colors.text, flex: 1 },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, marginTop: spacing.lg, padding: spacing.lg },
  cardTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.lg },
  checkRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md, gap: spacing.sm },
  checkCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: colors.borderLight, alignItems: "center", justifyContent: "center" },
  checkedCircle: { backgroundColor: colors.success, borderColor: colors.success },
  checkText: { flex: 1, ...typography.bodySmall, color: colors.textSecondary },
  checkedText: { color: colors.text },
  info: { marginBottom: spacing.md },
  infoLabel: { ...typography.bodySmall, color: colors.textSecondary },
  infoValue: { ...typography.label, color: colors.text, fontWeight: "600", marginTop: 2 },
  note: { backgroundColor: colors.card, borderRadius: radius.md, padding: spacing.md, marginTop: spacing.xs },
  noteText: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 20 },
  outlineButton: { height: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs, marginTop: spacing.lg },
  outlineText: { color: colors.primary, ...typography.label, fontWeight: "600" },
});