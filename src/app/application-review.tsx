import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, spacing, typography, radius } from "@/constants/theme";

const MOCK_SHIFT = {
  title: "Registered Nurse · Acute Care",
  facility: "Mainland Care Hospital · Verified facility",
  match: "94% MATCH",
  dateTime: "Tue, 6 Oct · 07:00–19:00 WAT",
  location: "Ikeja · 7.7 km away",
  rate: "₦3,000/hr · ₦36,000 estimated",
};

const MOCK_WORKER = {
  name: "Amara Okafor · RN",
  licence: "Verified and active",
  availability: "Full 07:00–19:00 WAT shift",
};

export default function ApplicationReview() {
  const [message, setMessage] = React.useState(
    "I'm available for the full shift and have acute care experience."
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>
            <Text style={styles.logoCircle}>◉</Text> CAREPORIUM
          </Text>

          <Ionicons name="menu" size={20} color="#667085" />
        </View>

        {/* Heading */}
        <Text style={styles.eyebrow}>APPLICATION</Text>

        <Text style={styles.title}>Review before you apply</Text>

        <Text style={styles.subtitle}>
          Confirm your availability and verified credentials before sharing
          with the facility.
        </Text>

        {/* Step indicator */}
        <View style={styles.stepsContainer}>
          <Step
            number="1"
            title="REVIEW"
            active
          />

          <View style={styles.stepLine} />

          <Step number="2" title="SUBMIT" />

          <View style={styles.stepLine} />

          <Step number="3" title="FACILITY DECISION" />
        </View>

        {/* Shift Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Shift summary</Text>

          <Text style={styles.shiftTitle}>{MOCK_SHIFT.title}</Text>

          <Text style={styles.facility}>{MOCK_SHIFT.facility}</Text>

          <View style={styles.matchPill}>
            <Text style={styles.matchText}>{MOCK_SHIFT.match}</Text>
          </View>

          <InfoRow
            icon="calendar-outline"
            text={MOCK_SHIFT.dateTime}
          />

          <InfoRow
            icon="location-outline"
            text={MOCK_SHIFT.location}
          />

          <Text style={styles.rate}>{MOCK_SHIFT.rate}</Text>

          <Pressable
            style={styles.outlineButton}
            onPress={() => router.back()}
          >
            <Text style={styles.outlineButtonText}>View shift</Text>
          </Pressable>
        </View>

        {/* Your details */}
        <Text style={styles.sectionTitle}>Your details</Text>

        <View style={styles.detailCard}>
          <Text style={styles.detailLabel}>Professional</Text>
          <Text style={styles.detailValue}>{MOCK_WORKER.name}</Text>

          <View style={styles.divider} />

          <Text style={styles.detailLabel}>Professional licence</Text>

          <View style={styles.verifiedRow}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={12} color="#16A34A" />
            </View>

            <Text style={styles.verifiedText}>
              {MOCK_WORKER.licence}
            </Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.detailLabel}>Availability</Text>
          <Text style={styles.detailValue}>
            {MOCK_WORKER.availability}
          </Text>
        </View>

        {/* Message */}
        <View style={styles.messageContainer}>
          <AppInput
            label="Message to the facility"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Write a message..."
          />
        </View>

        {/* Buttons */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to shift</Text>
        </Pressable>

        <PrimaryButton
          title="Continue to submit"
          onPress={() => router.push("/application-submit")}
        />

        {/* What happens next */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next</Text>

          <TimelineItem
            number="01"
            title="Facility reviews"
            description="The facility reviews your application and availability."
            active
          />

          <TimelineItem
            number="02"
            title="Decision arrives"
            description="You'll receive a notification when a decision is made."
          />

          <TimelineItem
            number="03"
            title="Shift confirmed"
            description="Once accepted, your shift appears in Upcoming."
          />
        </View>
      </ScrollView>
    </View>
  );
}

function Step({
  number,
  title,
  active = false,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <View style={styles.step}>
      <View style={[styles.stepCircle, active && styles.activeStepCircle]}>
        <Text style={[styles.stepNumber, active && styles.activeStepNumber]}>
          {number}
        </Text>
      </View>

      <Text style={[styles.stepText, active && styles.activeStepText]}>
        {title}
      </Text>
    </View>
  );
}

function InfoRow({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color="#667085" />
      <Text style={styles.infoText}>{text}</Text>
    </View>
  );
}

function TimelineItem({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <View style={styles.timelineItem}>
      <View
        style={[
          styles.timelineNumber,
          active && styles.timelineNumberActive,
        ]}
      >
        <Text
          style={[
            styles.timelineNumberText,
            active && styles.timelineNumberTextActive,
          ]}
        >
          {number}
        </Text>
      </View>

      <View style={styles.timelineContent}>
        <Text style={styles.timelineTitle}>{title}</Text>
        <Text style={styles.timelineDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    paddingBottom: 40,
  },

  header: {
    height: 58,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EAECF0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
  },

  logo: {
    fontSize: 11,
    fontWeight: "800",
    color: "#2563EB",
    letterSpacing: 0.3,
  },

  logoCircle: {
    fontSize: 10,
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
    marginTop: 7,
    marginHorizontal: 18,
    fontSize: 22,
    fontWeight: "800",
    color: "#101828",
  },

  subtitle: {
    marginTop: 7,
    marginHorizontal: 18,
    fontSize: 12,
    lineHeight: 18,
    color: "#667085",
  },

  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 20,
    marginBottom: 15,
  },

  step: {
    alignItems: "center",
  },

  stepCircle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#EAECF0",
    justifyContent: "center",
    alignItems: "center",
  },

  activeStepCircle: {
    backgroundColor: "#2563EB",
  },

  stepNumber: {
    fontSize: 10,
    fontWeight: "700",
    color: "#667085",
  },

  activeStepNumber: {
    color: "#FFFFFF",
  },

  stepText: {
    fontSize: 7,
    marginTop: 4,
    color: "#98A2B3",
    fontWeight: "700",
  },

  activeStepText: {
    color: "#2563EB",
  },

  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D5DD",
    marginHorizontal: 5,
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 14,
  },

  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#344054",
    marginBottom: 12,
  },

  shiftTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#101828",
  },

  facility: {
    fontSize: 10,
    color: "#667085",
    marginTop: 4,
  },

  matchPill: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF3",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 4,
    marginTop: 9,
  },

  matchText: {
    color: "#039855",
    fontSize: 8,
    fontWeight: "800",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  infoText: {
    marginLeft: 7,
    color: "#475467",
    fontSize: 10,
    flex: 1,
  },

  rate: {
    fontSize: 11,
    fontWeight: "800",
    color: "#101828",
    marginTop: 12,
  },

  outlineButton: {
    height: 38,
    borderWidth: 1,
    borderColor: "#B2CCFF",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  outlineButtonText: {
    color: "#175CD3",
    fontSize: 11,
    fontWeight: "700",
  },

  sectionTitle: {
    marginHorizontal: 18,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: "800",
    color: "#101828",
  },

  detailCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    marginHorizontal: 18,
    padding: 14,
  },

  detailLabel: {
    fontSize: 9,
    color: "#667085",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 11,
    color: "#101828",
    fontWeight: "600",
  },

  divider: {
    height: 1,
    backgroundColor: "#F2F4F7",
    marginVertical: 12,
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ECFDF3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },

  verifiedText: {
    color: "#039855",
    fontSize: 10,
    fontWeight: "600",
  },

  messageContainer: {
    marginHorizontal: 18,
    marginTop: 14,
  },

  backButton: {
    marginHorizontal: 18,
    height: 43,
    borderWidth: 1,
    borderColor: "#B2CCFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  backButtonText: {
    color: "#175CD3",
    fontSize: 11,
    fontWeight: "700",
  },

  timelineItem: {
    flexDirection: "row",
    marginBottom: 14,
  },

  timelineNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F2F4F7",
    justifyContent: "center",
    alignItems: "center",
  },

  timelineNumberActive: {
    backgroundColor: "#ECFDF3",
  },

  timelineNumberText: {
    fontSize: 8,
    color: "#667085",
    fontWeight: "800",
  },

  timelineNumberTextActive: {
    color: "#039855",
  },

  timelineContent: {
    flex: 1,
    marginLeft: 10,
  },

  timelineTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#101828",
  },

  timelineDescription: {
    fontSize: 9,
    lineHeight: 14,
    color: "#667085",
    marginTop: 2,
  },
});