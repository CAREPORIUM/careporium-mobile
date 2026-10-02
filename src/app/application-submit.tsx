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

import PrimaryButton from "@/components/ui/PrimaryButton";

export default function ApplicationSubmit() {
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

        <Text style={styles.eyebrow}>APPLICATION</Text>

        <Text style={styles.title}>Confirm your application</Text>

        <Text style={styles.subtitle}>
          Review the information below before sending your application to
          the facility.
        </Text>

        {/* Steps */}
        <View style={styles.steps}>
          <Step number="1" title="REVIEW" />
          <View style={styles.line} />

          <Step number="2" title="SUBMIT" active />
          <View style={styles.line} />

          <Step number="3" title="FACILITY DECISION" />
        </View>

        {/* Application summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Application summary</Text>

          <Text style={styles.jobTitle}>
            Registered Nurse · Acute Care
          </Text>

          <Text style={styles.facility}>
            Mainland Care Hospital · Verified facility
          </Text>

          <View style={styles.matchPill}>
            <Text style={styles.matchText}>94% MATCH</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color="#667085"
            />
            <Text style={styles.rowText}>
              Tue, 6 Oct · 07:00–19:00 WAT
            </Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={16}
              color="#667085"
            />
            <Text style={styles.rowText}>Ikeja · 7.7 km away</Text>
          </View>

          <View style={styles.row}>
            <Ionicons
              name="cash-outline"
              size={16}
              color="#667085"
            />
            <Text style={styles.rowText}>
              ₦3,000/hr · ₦36,000 estimated
            </Text>
          </View>
        </View>

        {/* Worker */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Your details</Text>

          <Detail
            label="Professional"
            value="Amara Okafor · RN"
          />

          <Detail
            label="Professional licence"
            value="Verified and active"
            verified
          />

          <Detail
            label="Availability"
            value="Full 07:00–19:00 WAT shift"
          />
        </View>

        {/* Message */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Message to the facility</Text>

          <Text style={styles.message}>
            "I'm available for the full shift and have acute care
            experience."
          </Text>
        </View>

        {/* Notice */}
        <View style={styles.notice}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#175CD3"
          />

          <Text style={styles.noticeText}>
            By submitting, you confirm that your availability and
            professional credentials are accurate.
          </Text>
        </View>

        {/* Buttons */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>Back to review</Text>
        </Pressable>

        <PrimaryButton
          title="Submit application"
          onPress={() => router.replace("/application-submitted")}
        />
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
      <View style={[styles.circle, active && styles.activeCircle]}>
        <Text style={[styles.number, active && styles.activeNumber]}>
          {number}
        </Text>
      </View>

      <Text style={[styles.stepText, active && styles.activeStepText]}>
        {title}
      </Text>
    </View>
  );
}

function Detail({
  label,
  value,
  verified = false,
}: {
  label: string;
  value: string;
  verified?: boolean;
}) {
  return (
    <View style={styles.detail}>
      <Text style={styles.label}>{label}</Text>

      {verified ? (
        <View style={styles.verifiedRow}>
          <Ionicons
            name="checkmark-circle"
            size={15}
            color="#12B76A"
          />
          <Text style={styles.verifiedText}>{value}</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}
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
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "800",
  },

  eyebrow: {
    marginTop: 22,
    marginHorizontal: 18,
    color: "#2563EB",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.7,
  },

  title: {
    marginHorizontal: 18,
    marginTop: 7,
    fontSize: 22,
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

  steps: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 15,
  },

  step: {
    alignItems: "center",
  },

  circle: {
    width: 23,
    height: 23,
    borderRadius: 12,
    backgroundColor: "#EAECF0",
    alignItems: "center",
    justifyContent: "center",
  },

  activeCircle: {
    backgroundColor: "#2563EB",
  },

  number: {
    fontSize: 10,
    fontWeight: "700",
    color: "#667085",
  },

  activeNumber: {
    color: "#FFFFFF",
  },

  stepText: {
    fontSize: 7,
    marginTop: 4,
    fontWeight: "700",
    color: "#98A2B3",
  },

  activeStepText: {
    color: "#2563EB",
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D0D5DD",
    marginHorizontal: 5,
    marginBottom: 14,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    marginHorizontal: 18,
    marginBottom: 13,
    padding: 14,
  },

  cardHeading: {
    fontSize: 11,
    fontWeight: "800",
    color: "#344054",
    marginBottom: 12,
  },

  jobTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#101828",
  },

  facility: {
    marginTop: 4,
    fontSize: 10,
    color: "#667085",
  },

  matchPill: {
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF3",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 9,
  },

  matchText: {
    color: "#039855",
    fontSize: 8,
    fontWeight: "800",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  rowText: {
    marginLeft: 8,
    color: "#475467",
    fontSize: 10,
  },

  detail: {
    marginBottom: 13,
  },

  label: {
    fontSize: 9,
    color: "#667085",
    marginBottom: 4,
  },

  value: {
    fontSize: 11,
    color: "#101828",
    fontWeight: "600",
  },

  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  verifiedText: {
    marginLeft: 5,
    fontSize: 10,
    color: "#039855",
    fontWeight: "600",
  },

  message: {
    fontSize: 11,
    color: "#475467",
    lineHeight: 18,
  },

  notice: {
    flexDirection: "row",
    backgroundColor: "#EFF8FF",
    borderWidth: 1,
    borderColor: "#B2DDFF",
    borderRadius: 10,
    marginHorizontal: 18,
    padding: 12,
    marginBottom: 14,
  },

  noticeText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 9,
    lineHeight: 14,
    color: "#175CD3",
  },

  backButton: {
    height: 43,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: "#B2CCFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 9,
  },

  backText: {
    color: "#175CD3",
    fontSize: 11,
    fontWeight: "700",
  },
});