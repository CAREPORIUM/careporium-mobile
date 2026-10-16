import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, RefreshControl, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Application, AppStatus, getMyApplications } from "@/services/application.service";
import { colors, radius, spacing, typography } from "@/constants/theme";

const FILTERS: ("All" | AppStatus)[] = ["All", "Under review", "Accepted", "Not selected"];

export default function ApplicationsScreen() {
  const [items, setItems] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"All" | AppStatus>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setItems(await getMyApplications());
      setLoaded(true);
    } catch (e: any) {
      setError(e.message ?? "Couldn't load your applications. Try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const count = (f: "All" | AppStatus) => (f === "All" ? items.length : items.filter((a) => a.status === f).length);
  const list = filter === "All" ? items : items.filter((a) => a.status === filter);
  const selected = items.find((a) => a.id === selectedId) ?? list[0];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={loading && loaded} onRefresh={load} />}
    >
      <Text style={styles.eyebrow}>APPLICATIONS</Text>
      <Text style={styles.title}>Keep every application in view.</Text>
      <Text style={styles.subtitle}>A clear timeline from submission to facility decision.</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map((f) => (
          <Pressable key={f} style={[styles.filter, filter === f && styles.activeFilter]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.activeFilterText]}>
              {f} · {count(f)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent applications</Text>

      {loading && !loaded ? <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} /> : null}
      {error ? (
        <View>
          <Text style={styles.error}>{error}</Text>
          <PrimaryButton title="Try again" onPress={load} style={{ marginTop: spacing.md }} />
        </View>
      ) : null}
      {loaded && !error && list.length === 0 ? <Text style={styles.facility}>No applications here yet. Apply for a shift from Find shifts.</Text> : null}

      {list.map((a) => (
        <ApplicationCard key={a.id} application={a} onPress={() => setSelectedId(a.id)} />
      ))}

      {selected ? (
        <View style={styles.detailCard}>
          <Text style={styles.detailHeading}>Application overview</Text>
          <Text style={styles.selectedTitle}>{selected.title}</Text>
          <Text style={styles.selectedFacility}>{selected.facility}</Text>
          <View style={{ marginTop: spacing.sm, marginBottom: spacing.md }}>
            <StatusPill status={selected.status} />
          </View>

          <TimelineItem icon="checkmark-circle" title="Submitted" description="Application delivered successfully." active />
          <TimelineItem
            icon={selected.status === "Under review" ? "ellipse" : "checkmark-circle"}
            title="Facility review"
            description={selected.status === "Under review" ? "The facility is reviewing your application." : "The facility has reviewed your application."}
            active
          />
          <TimelineItem
            icon={selected.status === "Under review" ? "ellipse-outline" : "checkmark-circle"}
            title="Decision"
            description={selected.status === "Accepted" ? "You were accepted. Find it in Upcoming." : selected.status === "Not selected" ? "The facility chose another applicant this time." : "The decision will show here when it is made."}
            active={selected.status !== "Under review"}
          />

          {selected.shiftId ? (
            <Pressable style={styles.viewButton} onPress={() => router.push({ pathname: "/shift-details", params: { id: selected.shiftId } })}>
              <Text style={styles.viewButtonText}>View shift</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </ScrollView>
  );
}

function ApplicationCard({ application, onPress }: { application: Application; onPress: () => void }) {
  return (
    <Pressable style={styles.applicationCard} onPress={onPress}>
      <View style={styles.applicationTop}>
        <Text style={styles.applicationTitle}>{application.title}</Text>
        <StatusPill status={application.status} />
      </View>
      <Text style={styles.facility}>{application.facility}</Text>
      {application.date ? (
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.date}>{application.date}</Text>
        </View>
      ) : null}
      <View style={styles.linkRow}>
        <Text style={styles.linkText}>View application</Text>
        <Ionicons name="arrow-forward" size={14} color={colors.primary} />
      </View>
    </Pressable>
  );
}

function StatusPill({ status }: { status: AppStatus }) {
  let bg: string = colors.card;
  let color: string = colors.textSecondary;
  if (status === "Under review") {
    bg = colors.warningLight;
    color = colors.warning;
  }
  if (status === "Accepted") {
    bg = colors.successLight;
    color = colors.success;
  }
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
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
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