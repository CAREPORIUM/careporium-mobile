import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "@/constants/theme";

export default function UpcomingScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>UPCOMING</Text>
      <Text style={styles.title}>Your next confirmed shift.</Text>
      <Text style={styles.subtitle}>Everything you need to prepare and arrive with confidence.</Text>

      <View style={styles.shiftCard}>
        <View style={styles.pills}>
          <View style={styles.confirmedPill}>
            <Ionicons name="checkmark" size={14} color={colors.success} />
            <Text style={styles.confirmedText}>CONFIRMED</Text>
          </View>
          <View style={styles.startPill}>
            <Text style={styles.startText}>STARTS IN 10 DAYS</Text>
          </View>
        </View>

        <Text style={styles.shiftTitle}>Community Nurse · Yaba Community Clinic</Text>
        <Text style={styles.facility}>Yaba Community Clinic · Verified facility</Text>

        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoText}>Fri, 9 October 2026 · 08:00–16:00 WAT</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.infoText}>Yaba, Lagos · Arrival at 07:45 WAT</Text>
        </View>

        <PrimaryButton
          title="View shift instructions"
          onPress={() => Alert.alert("Shift instructions", "Shift instructions will be available here.")}
          style={{ marginTop: spacing.lg }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Before your shift</Text>
        <Checklist checked text="Facility confirmed your booking" />
        <Checklist checked text="Credentials verified and shared securely" />
        <Checklist text="Review arrival and uniform instructions" />
        <Checklist text="Check in at the facility when you arrive" />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Arrival information</Text>
        <Info label="Location" value="Yaba, Lagos" />
        <Info label="Check-in" value="07:45 · Reception" />
        <Info label="Contact" value="Shift coordinator" />

        <View style={styles.note}>
          <Text style={styles.noteText}>
            A facility coordinator will meet you at reception. Please arrive early and have your professional ID
            available.
          </Text>
        </View>

        <Pressable
          style={styles.outlineButton}
          onPress={() => Alert.alert("Directions", "Directions will open here when connected to a map service.")}
        >
          <Ionicons name="navigate-outline" size={18} color={colors.primary} />
          <Text style={styles.outlineText}>View directions</Text>
        </Pressable>
      </View>
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
  confirmedPill: { flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF3", borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, gap: 4 },
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