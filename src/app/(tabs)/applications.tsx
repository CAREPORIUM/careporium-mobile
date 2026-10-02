import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";

const MOCK_APPLICATIONS = [
  { title: "Registered Nurse · Acute Care", status: "Under review", facility: "Mainland Care Hospital", date: "6 Oct · 07:00–19:00 WAT" },
  { title: "Community Nurse", status: "Accepted", facility: "Yaba Community Clinic", date: "9 Oct · 08:00–16:00 WAT" },
  { title: "Theatre Nurse", status: "Under review", facility: "Ikeja Medical Centre", date: "12 Oct · 10:00–18:00 WAT" },
  { title: "Emergency Nurse", status: "Not selected", facility: "Surulere Care Hospital", date: "14 Oct · 18:00–06:00 WAT" },
];

export default function ApplicationsScreen() {
  const [selected, setSelected] = useState(0);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>APPLICATIONS</Text>
      <Text style={styles.title}>Keep every application in view.</Text>
      <Text style={styles.subtitle}>A clear timeline from submission to facility decision.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        <Filter text="All · 4" active />
        <Filter text="Under review · 2" />
        <Filter text="Accepted · 1" />
        <Filter text="Not selected · 1" />
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent applications</Text>

      {MOCK_APPLICATIONS.map((application, index) => (
        <ApplicationCard key={index} application={application} onPress={() => setSelected(index)} />
      ))}

      <View style={styles.detailCard}>
        <Text style={styles.detailHeading}>Application overview</Text>
        <Text style={styles.selectedTitle}>{MOCK_APPLICATIONS[selected].title}</Text>
        <Text style={styles.selectedFacility}>{MOCK_APPLICATIONS[selected].facility}</Text>
        <View style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
          <StatusPill status={MOCK_APPLICATIONS[selected].status} />
        </View>

        <TimelineItem icon="checkmark-circle" title="Submitted" description="Application delivered successfully." active />
        <TimelineItem icon="ellipse" title="Facility review" description="Facility is reviewing your application." active />
        <TimelineItem icon="ellipse-outline" title="Decision" description="Notification will arrive when a decision is made." />

        <Pressable style={styles.viewButton}>
          <Text style={styles.viewButtonText}>View application</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

function Filter({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <Pressable style={[styles.filter, active && styles.activeFilter]}>
      <Text style={[styles.filterText, active && styles.activeFilterText]}>{text}</Text>
    </Pressable>
  );
}

function ApplicationCard({ application, onPress }: { application: (typeof MOCK_APPLICATIONS)[number]; onPress: () => void }) {
  return (
    <Pressable style={styles.applicationCard} onPress={onPress}>
      <View style={styles.applicationTop}>
        <Text style={styles.applicationTitle}>{application.title}</Text>
        <StatusPill status={application.status} />
      </View>
      <Text style={styles.facility}>{application.facility}</Text>
      <View style={styles.dateRow}>
        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.date}>{application.date}</Text>
      </View>
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>View application</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.primary} />
      </View>
    </Pressable>
  );
}

function StatusPill({ status }: { status: string }) {
  let bg: string = colors.card;
  let color: string = colors.textSecondary;
  if (status === "Under review") { bg = colors.warningLight; color = colors.warning; }
  if (status === "Accepted") { bg = "#ECFDF3"; color = colors.success; }

  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={[styles.statusText, { color }]}>{status.toUpperCase()}</Text>
    </View>
  );
}

function TimelineItem({ icon, title, description, active = false }: { icon: keyof typeof Ionicons.glyphMap; title: string; description: string; active?: boolean }) {
  return (
    <View style={styles.timeline}>
      <Ionicons name={icon} size={20} color={active ? colors.success : colors.borderLight} />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  filters: { gap: spacing.sm, marginTop: spacing.lg },
  filter: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.round, backgroundColor: colors.white },
  activeFilter: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  filterText: { ...typography.bodySmall, fontWeight: "600", color: colors.textSecondary },
  activeFilterText: { color: colors.primary },
  sectionTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginTop: spacing.lg, marginBottom: spacing.sm },
  applicationCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, marginBottom: spacing.sm, padding: spacing.md },
  applicationTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  applicationTitle: { flex: 1, ...typography.label, fontWeight: "700", color: colors.text, marginRight: spacing.sm },
  statusPill: { borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4 },
  statusText: { ...typography.bodySmall, fontWeight: "800" },
  facility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  dateRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.sm, gap: spacing.xs },
  date: { ...typography.bodySmall, color: colors.textSecondary },
  linkRow: { flexDirection: "row", alignItems: "center", marginTop: spacing.md, gap: spacing.xs },
  linkText: { color: colors.primary, ...typography.bodySmall, fontWeight: "700" },
  detailCard: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, marginTop: spacing.sm, padding: spacing.lg },
  detailHeading: { ...typography.label, fontWeight: "700", color: colors.text },
  selectedTitle: { ...typography.h3, color: colors.text, marginTop: spacing.md },
  selectedFacility: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  timeline: { flexDirection: "row", marginBottom: spacing.md, gap: spacing.sm },
  timelineContent: { flex: 1 },
  timelineTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  timelineDescription: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  viewButton: { height: 48, borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: spacing.xs, marginTop: spacing.sm },
  viewButtonText: { color: colors.primary, ...typography.label, fontWeight: "600" },
});