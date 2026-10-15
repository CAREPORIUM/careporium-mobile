
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/services/api";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Application = {
  id: string;
  title: string;
  status: string;
  facility: string;
  date: string;
};

type RawApplication = Record<string, any>;

function getApplicationList(response: any): RawApplication[] {
  const result =
    response?.data?.applications ??
    response?.applications ??
    response?.data ??
    response;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.items)) return result.items;

  return [];
}

function toApplication(raw: RawApplication): Application {
  const shift = raw.shift ?? raw.shiftDetails ?? {};
  const facilityValue = shift.facility ?? raw.facility;

  const facility =
    typeof facilityValue === "string"
      ? facilityValue
      : facilityValue?.name ?? raw.facilityName ?? "";

  const dateValue =
    shift.date ??
    shift.startTime ??
    shift.startDateTime ??
    raw.shiftDate ??
    raw.createdAt ??
    "";

  let date = "";

  if (dateValue) {
    const parsedDate = new Date(dateValue);
    date = Number.isNaN(parsedDate.getTime())
      ? String(dateValue)
      : parsedDate.toLocaleString();
  }

  return {
    id: String(raw._id ?? raw.id ?? raw.applicationId ?? ""),
    title:
      shift.title ??
      shift.role ??
      shift.jobTitle ??
      raw.title ??
      "Healthcare shift",
    status: String(raw.status ?? raw.applicationStatus ?? "Pending"),
    facility,
    date,
  };
}

function displayStatus(status: string): string {
  const normalized = status.toLowerCase().replace(/[_-]/g, " ");

  if (
    normalized.includes("accept") ||
    normalized.includes("approved") ||
    normalized.includes("selected")
  ) {
    return "Accepted";
  }

  if (
    normalized.includes("reject") ||
    normalized.includes("declined") ||
    normalized.includes("not selected")
  ) {
    return "Not selected";
  }

  if (
    normalized.includes("review") ||
    normalized.includes("pending") ||
    normalized.includes("submitted")
  ) {
    return "Under review";
  }

  return status;
}

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api(
        "/api/applications/v1/my-applications"
      );

      const results = getApplicationList(response).map(toApplication);
      setApplications(results);

      setSelectedId((currentId) =>
        currentId && results.some((item) => item.id === currentId)
          ? currentId
          : results[0]?.id ?? null
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load your applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  const filters = ["All", "Under review", "Accepted", "Not selected"];

  const countFor = (filter: string) =>
    filter === "All"
      ? applications.length
      : applications.filter(
          (application) =>
            displayStatus(application.status) === filter
        ).length;

  const filteredApplications =
    activeFilter === "All"
      ? applications
      : applications.filter(
          (application) =>
            displayStatus(application.status) === activeFilter
        );

  const selectedApplication =
    applications.find((application) => application.id === selectedId) ??
    filteredApplications[0] ??
    null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.eyebrow}>APPLICATIONS</Text>
      <Text style={styles.title}>Keep every application in view.</Text>
      <Text style={styles.subtitle}>
        A clear timeline from submission to facility decision.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {filters.map((filter) => (
          <Filter
            key={filter}
            text={`${filter} · ${countFor(filter)}`}
            active={activeFilter === filter}
            onPress={() => setActiveFilter(filter)}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Recent applications</Text>

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Loading applications...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={32}
            color={colors.primary}
          />
          <Text style={styles.stateText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={loadApplications}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      ) : applications.length === 0 ? (
        <View style={styles.stateContainer}>
          <Ionicons
            name="document-text-outline"
            size={32}
            color={colors.textSecondary}
          />
          <Text style={styles.stateHeading}>No applications yet</Text>
          <Text style={styles.stateText}>
            Applications you submit will appear here.
          </Text>
        </View>
      ) : filteredApplications.length === 0 ? (
        <View style={styles.stateContainer}>
          <Text style={styles.stateText}>
            There are no applications in this category.
          </Text>
        </View>
      ) : (
        filteredApplications.map((application, index) => (
          <ApplicationCard
            key={application.id || `${application.title}-${index}`}
            application={application}
            onPress={() => setSelectedId(application.id)}
            selected={selectedId === application.id}
          />
        ))
      )}

      {!loading && !error && selectedApplication && (
        <View style={styles.detailCard}>
          <Text style={styles.detailHeading}>Application overview</Text>
          <Text style={styles.selectedTitle}>
            {selectedApplication.title}
          </Text>
          <Text style={styles.selectedFacility}>
            {selectedApplication.facility || "Facility not provided"}
          </Text>

          <View style={styles.statusSpacing}>
            <StatusPill status={selectedApplication.status} />
          </View>

          <TimelineItem
            icon="checkmark-circle"
            title="Application submitted"
            description="Your application is recorded in the application list."
            active
          />
          <TimelineItem
            icon="ellipse"
            title="Facility review"
            description="The facility's review status depends on the latest application data."
            active={displayStatus(selectedApplication.status) === "Under review"}
          />
          <TimelineItem
            icon="ellipse-outline"
            title="Decision"
            description={`Current status: ${displayStatus(selectedApplication.status)}.`}
            active={
              displayStatus(selectedApplication.status) === "Accepted" ||
              displayStatus(selectedApplication.status) === "Not selected"
            }
          />

          {selectedApplication.date ? (
            <Text style={styles.date}>
              Date: {selectedApplication.date}
            </Text>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

function Filter({
  text,
  active = false,
  onPress,
}: {
  text: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.filter, active && styles.activeFilter]}
      onPress={onPress}
    >
      <Text style={[styles.filterText, active && styles.activeFilterText]}>
        {text}
      </Text>
    </Pressable>
  );
}

function ApplicationCard({
  application,
  onPress,
  selected,
}: {
  application: Application;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.applicationCard,
        selected && styles.selectedApplicationCard,
      ]}
      onPress={onPress}
    >
      <View style={styles.applicationTop}>
        <Text style={styles.applicationTitle}>{application.title}</Text>
        <StatusPill status={application.status} />
      </View>

      <Text style={styles.facility}>
        {application.facility || "Facility not provided"}
      </Text>

      {application.date ? (
        <View style={styles.dateRow}>
          <Ionicons
            name="calendar-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.date}>{application.date}</Text>
        </View>
      ) : null}

      <View style={styles.linkRow}>
        <Text style={styles.linkText}>View overview</Text>
        <Ionicons
          name="arrow-forward"
          size={14}
          color={colors.primary}
        />
      </View>
    </Pressable>
  );
}

function StatusPill({ status }: { status: string }) {
  const label = displayStatus(status);
  const isReview = label === "Under review";
  const isAccepted = label === "Accepted";

  const backgroundColor = isReview
    ? colors.warningLight
    : isAccepted
      ? colors.card
      : colors.card;

  const textColor = isReview
    ? colors.warning
    : isAccepted
      ? colors.success
      : colors.textSecondary;

  return (
    <View style={[styles.statusPill, { backgroundColor }]}>
      <Text style={[styles.statusText, { color: textColor }]}>
        {label.toUpperCase()}
      </Text>
    </View>
  );
}

function TimelineItem({
  icon,
  title,
  description,
  active = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <View style={styles.timeline}>
      <Ionicons
        name={icon}
        size={20}
        color={active ? colors.success : colors.borderLight}
      />
      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  filters: { gap: spacing.sm, marginTop: spacing.lg },
  filter: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.round,
    backgroundColor: colors.white,
  },
  activeFilter: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.bodySmall,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  activeFilterText: { color: colors.primary },
  sectionTitle: {
    ...typography.label,
    fontWeight: "700",
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  applicationCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  selectedApplicationCard: { borderColor: colors.primary },
  applicationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  applicationTitle: {
    flex: 1,
    ...typography.label,
    fontWeight: "700",
    color: colors.text,
    marginRight: spacing.sm,
  },
  statusPill: {
    borderRadius: radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  statusText: { ...typography.bodySmall, fontWeight: "800" },
  facility: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  date: { ...typography.bodySmall, color: colors.textSecondary },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    gap: spacing.xs,
  },
  linkText: {
    color: colors.primary,
    ...typography.bodySmall,
    fontWeight: "700",
  },
  detailCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    marginTop: spacing.sm,
    padding: spacing.lg,
  },
  detailHeading: {
    ...typography.label,
    fontWeight: "700",
    color: colors.text,
  },
  selectedTitle: {
    ...typography.h3,
    color: colors.text,
    marginTop: spacing.md,
  },
  selectedFacility: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  statusSpacing: { marginTop: spacing.sm, marginBottom: spacing.md },
  timeline: { flexDirection: "row", marginBottom: spacing.md, gap: spacing.sm },
  timelineContent: { flex: 1 },
  timelineTitle: { ...typography.label, fontWeight: "700", color: colors.text },
  timelineDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  stateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
    gap: spacing.sm,
  },
  stateHeading: {
    ...typography.label,
    fontWeight: "700",
    color: colors.text,
  },
  stateText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: spacing.xs,
  },
  retryText: {
    ...typography.label,
    color: colors.primary,
    fontWeight: "700",
  },
});
