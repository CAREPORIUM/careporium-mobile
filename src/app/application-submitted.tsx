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

export default function ApplicationSubmitted() {
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

        <Text style={styles.title}>Application submitted</Text>

        <Text style={styles.subtitle}>
          Your application is with Mainland Care Hospital.
        </Text>

        {/* Main confirmation card */}
        <View style={styles.card}>
          <View style={styles.submittedPill}>
            <Ionicons
              name="checkmark"
              size={12}
              color="#039855"
            />

            <Text style={styles.submittedText}>SUBMITTED</Text>
          </View>

          <Text style={styles.mainText}>
            Your application is on its way.
          </Text>

          <Text style={styles.description}>
            Mainland Care Hospital will review your verified profile
            and application. You'll receive a notification when a
            decision is made.
          </Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Reference</Text>
            <Text style={styles.infoValue}>CP-2026-1048</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Submitted</Text>
            <Text style={styles.infoValue}>
              29 Sep 2026 · 09:56 WAT
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={styles.statusText}>Under review</Text>
          </View>
        </View>

        {/* Buttons */}
        <PrimaryButton
          title="Track application"
          onPress={() => router.push("/(tabs)/applications")}
        />

        <Pressable
          style={styles.outlineButton}
          onPress={() => router.push("/(tabs)/shifts")}
        >
          <Text style={styles.outlineText}>
            Browse more shifts
          </Text>
        </Pressable>

        {/* What to expect */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What to expect</Text>

          <Timeline
            icon="checkmark-circle"
            title="Submitted"
            description="Application delivered successfully."
            active
          />

          <Timeline
            icon="ellipse"
            title="Under review"
            description="Facility checks your application and availability."
            active
          />

          <Timeline
            icon="ellipse-outline"
            title="Decision"
            description="You'll be notified when the facility responds."
          />
        </View>

        {/* Ready */}
        <View style={styles.readyCard}>
          <Text style={styles.readyTitle}>Already applied once?</Text>

          <Text style={styles.readyText}>
            You can continue browsing shifts while your application
            is being reviewed.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

function Timeline({
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

      <View style={styles.timelineText}>
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
    justifyContent: "space-between",
    alignItems: "center",
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
    color: "#2563EB",
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
    color: "#667085",
    fontSize: 12,
    lineHeight: 18,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E4E7EC",
    marginHorizontal: 18,
    marginTop: 16,
    padding: 14,
  },

  submittedPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF3",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
  },

  submittedText: {
    color: "#039855",
    fontSize: 8,
    fontWeight: "800",
    marginLeft: 4,
  },

  mainText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#101828",
    marginTop: 14,
  },

  description: {
    fontSize: 10,
    lineHeight: 16,
    color: "#667085",
    marginTop: 7,
  },

  infoBox: {
    borderTopWidth: 1,
    borderTopColor: "#F2F4F7",
    marginTop: 12,
    paddingTop: 10,
  },

  infoLabel: {
    fontSize: 9,
    color: "#667085",
  },

  infoValue: {
    marginTop: 3,
    fontSize: 11,
    color: "#101828",
    fontWeight: "600",
  },

  statusText: {
    marginTop: 3,
    fontSize: 11,
    color: "#B54708",
    fontWeight: "700",
  },

  outlineButton: {
    height: 43,
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: "#B2CCFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 9,
  },

  outlineText: {
    color: "#175CD3",
    fontSize: 11,
    fontWeight: "700",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#344054",
    marginBottom: 14,
  },

  timeline: {
    flexDirection: "row",
    marginBottom: 16,
  },

  timelineText: {
    flex: 1,
    marginLeft: 9,
  },

  timelineTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#101828",
  },

  timelineDescription: {
    marginTop: 3,
    fontSize: 9,
    lineHeight: 14,
    color: "#667085",
  },

  readyCard: {
    marginHorizontal: 18,
    marginTop: 13,
    padding: 14,
    backgroundColor: "#EFF8FF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B2DDFF",
  },

  readyTitle: {
    color: "#175CD3",
    fontSize: 10,
    fontWeight: "800",
  },

  readyText: {
    color: "#475467",
    fontSize: 9,
    lineHeight: 14,
    marginTop: 4,
  },
});