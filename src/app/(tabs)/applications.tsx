import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MOCK_APPLICATIONS = [
  {
    title: "Registered Nurse · Acute Care",
    status: "Under review",
    facility: "Mainland Care Hospital",
    date: "6 Oct · 07:00–19:00 WAT",
  },
  {
    title: "Community Nurse",
    status: "Accepted",
    facility: "Yaba Community Clinic",
    date: "9 Oct · 08:00–16:00 WAT",
  },
  {
    title: "Theatre Nurse",
    status: "Under review",
    facility: "Ikeja Medical Centre",
    date: "12 Oct · 10:00–18:00 WAT",
  },
  {
    title: "Emergency Nurse",
    status: "Not selected",
    facility: "Surulere Care Hospital",
    date: "14 Oct · 18:00–06:00 WAT",
  },
];

export default function ApplicationsScreen() {
  const [selected, setSelected] = React.useState(0);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>◉ CAREPORIUM</Text>

          <Ionicons name="menu" size={20} color="#667085" />
        </View>

        <Text style={styles.eyebrow}>APPLICATIONS</Text>

        <Text style={styles.title}>
          Keep every application in view.
        </Text>

        <Text style={styles.subtitle}>
          A clear timeline from submission to facility decision.
        </Text>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filters}
        >
          <Filter text="All · 4" active />
          <Filter text="Under review · 2" />
          <Filter text="Accepted · 1" />
          <Filter text="Not selected · 1" />
        </ScrollView>

        {/* Applications */}
        <Text style={styles.sectionTitle}>Recent applications</Text>

        {MOCK_APPLICATIONS.map((application, index) => (
          <ApplicationCard
            key={index}
            application={application}
            onPress={() => setSelected(index)}
          />
        ))}

        {/* Selected application */}
        <View style={styles.detailCard}>
          <Text style={styles.detailHeading}>
            Application overview
          </Text>

          <Text style={styles.selectedTitle}>
            {MOCK_APPLICATIONS[selected].title}
          </Text>

          <Text style={styles.selectedFacility}>
            {MOCK_APPLICATIONS[selected].facility}
          </Text>

          <View style={styles.selectedStatus}>
            <StatusPill
              status={MOCK_APPLICATIONS[selected].status}
            />
          </View>

          {/* Timeline */}
          <TimelineItem
            icon="checkmark-circle"
            title="Submitted"
            description="Application delivered successfully."
            active
          />

          <TimelineItem
            icon="ellipse"
            title="Facility review"
            description="Facility is reviewing your application."
            active
          />

          <TimelineItem
            icon="ellipse-outline"
            title="Decision"
            description="Notification will arrive when a decision is made."
          />

          <Pressable style={styles.viewButton}>
            <Text style={styles.viewButtonText}>
              View application
            </Text>

            <Ionicons
              name="arrow-forward"
              size={14}
              color="#175CD3"
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Filter({
  text,
  active = false,
}: {
  text: string;
  active?: boolean;
}) {
  return (
    <Pressable
      style={[styles.filter, active && styles.activeFilter]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.activeFilterText,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

function ApplicationCard({
  application,
  onPress,
}: {
  application: (typeof MOCK_APPLICATIONS)[number];
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.applicationCard} onPress={onPress}>
      <View style={styles.applicationTop}>
        <Text style={styles.applicationTitle}>
          {application.title}
        </Text>

        <StatusPill status={application.status} />
      </View>

      <Text style={styles.facility}>
        {application.facility}
      </Text>

      <View style={styles.dateRow}>
        <Ionicons
          name="calendar-outline"
          size={14}
          color="#667085"
        />

        <Text style={styles.date}>{application.date}</Text>
      </View>

      <View style={styles.linkRow}>
        <Text style={styles.linkText}>View application</Text>

        <Ionicons
          name="arrow-forward"
          size={13}
          color="#175CD3"
        />
      </View>
    </Pressable>
  );
}

function StatusPill({ status }: { status: string }) {
  let background = "#F2F4F7";
  let textColor = "#667085";

  if (status === "Under review") {
    background = "#FFFAEB";
    textColor = "#B54708";
  }

  if (status === "Accepted") {
    background = "#ECFDF3";
    textColor = "#039855";
  }

  return (
    <View
      style={[
        styles.statusPill,
        { backgroundColor: background },
      ]}
    >
      <Text style={[styles.statusText, { color: textColor }]}>
        {status.toUpperCase()}
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
        size={18}
        color={active ? "#12B76A" : "#98A2B3"}
      />

      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>

        <Text style={styles.timelineDescription}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingBottom: 40,
  },

  header: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
  },

  eyebrow: {
    marginTop: 22,
    marginHorizontal: 18,
    fontSize: 9,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.7,
  },

  title: {
    marginHorizontal: 18,
    marginTop: 7,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: "800",
    color: "#101828",
  },

  subtitle: {
    marginHorizontal: 18,
    marginTop: 7,
    fontSize: 12,
    lineHeight: 18,
    color: "#667085",
  },

  filterScroll: {
    marginTop: 17,
  },

  filters: {
    paddingHorizontal: 18,
    gap: 7,
  },

  filter: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
  },

  activeFilter: {
    backgroundColor: "#EFF8FF",
    borderColor: "#B2CCFF",
  },

  filterText: {
    fontSize: 9,
    fontWeight: "600",
    color: "#667085",
  },

  activeFilterText: {
    color: "#175CD3",
  },

  sectionTitle: {
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 9,
    fontSize: 12,
    fontWeight: "800",
    color: "#344054",
  },

  applicationCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 9,
    padding: 13,
  },

  applicationTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  applicationTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    color: "#101828",
    marginRight: 7,
  },

  statusPill: {
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  statusText: {
    fontSize: 7,
    fontWeight: "800",
  },

  facility: {
    marginTop: 6,
    fontSize: 9,
    color: "#667085",
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 9,
  },

  date: {
    marginLeft: 6,
    fontSize: 9,
    color: "#667085",
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  linkText: {
    color: "#175CD3",
    fontSize: 9,
    fontWeight: "700",
    marginRight: 4,
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 7,
    padding: 14,
  },

  detailHeading: {
    fontSize: 12,
    fontWeight: "800",
    color: "#344054",
  },

  selectedTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#101828",
    marginTop: 10,
  },

  selectedFacility: {
    fontSize: 9,
    color: "#667085",
    marginTop: 4,
  },

  selectedStatus: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 13,
  },

  timeline: {
    flexDirection: "row",
    marginBottom: 14,
  },

  timelineContent: {
    flex: 1,
    marginLeft: 8,
  },

  timelineTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#101828",
  },

  timelineDescription: {
    marginTop: 3,
    fontSize: 9,
    color: "#667085",
    lineHeight: 14,
  },

  viewButton: {
    height: 38,
    borderWidth: 1,
    borderColor: "#B2CCFF",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 2,
  },

  viewButtonText: {
    color: "#175CD3",
    fontSize: 10,
    fontWeight: "700",
    marginRight: 5,
  },
});