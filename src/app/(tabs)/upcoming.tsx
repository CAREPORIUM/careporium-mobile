import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function UpcomingScreen() {
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

        <Text style={styles.eyebrow}>UPCOMING</Text>

        <Text style={styles.title}>
          Your next confirmed shift.
        </Text>

        <Text style={styles.subtitle}>
          Everything you need to prepare and arrive with confidence.
        </Text>

        {/* Confirmed shift */}
        <View style={styles.shiftCard}>
          <View style={styles.pills}>
            <View style={styles.confirmedPill}>
              <Ionicons
                name="checkmark"
                size={11}
                color="#039855"
              />

              <Text style={styles.confirmedText}>CONFIRMED</Text>
            </View>

            <View style={styles.startPill}>
              <Text style={styles.startText}>STARTS IN 10 DAYS</Text>
            </View>
          </View>

          <Text style={styles.shiftTitle}>
            Community Nurse · Yaba Community Clinic
          </Text>

          <Text style={styles.facility}>
            Yaba Community Clinic · Verified facility
          </Text>

          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#667085"
            />

            <Text style={styles.infoText}>
              Fri, 9 October 2026 · 08:00–16:00 WAT
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={15}
              color="#667085"
            />

            <Text style={styles.infoText}>
              Yaba, Lagos · Arrival at 07:45 WAT
            </Text>
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              Alert.alert(
                "Shift instructions",
                "Shift instructions will be available here."
              )
            }
          >
            <Text style={styles.primaryText}>
              View shift instructions
            </Text>
          </Pressable>
        </View>

        {/* Before your shift */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Before your shift</Text>

          <Checklist
            checked
            text="Facility confirmed your booking"
          />

          <Checklist
            checked
            text="Credentials verified and shared securely"
          />

          <Checklist text="Review arrival and uniform instructions" />

          <Checklist text="Check in at the facility when you arrive" />
        </View>

        {/* Arrival information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Arrival information</Text>

          <Info
            label="Location"
            value="Yaba, Lagos"
          />

          <Info
            label="Check-in"
            value="07:45 · Reception"
          />

          <Info
            label="Contact"
            value="Shift coordinator"
          />

          <View style={styles.note}>
            <Text style={styles.noteText}>
              A facility coordinator will meet you at reception.
              Please arrive early and have your professional ID
              available.
            </Text>
          </View>

          <Pressable
            style={styles.outlineButton}
            onPress={() =>
              Alert.alert(
                "Directions",
                "Directions will open here when connected to a map service."
              )
            }
          >
            <Ionicons
              name="navigate-outline"
              size={15}
              color="#175CD3"
            />

            <Text style={styles.outlineText}>
              View directions
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function Checklist({
  checked = false,
  text,
}: {
  checked?: boolean;
  text: string;
}) {
  return (
    <View style={styles.checkRow}>
      <View
        style={[
          styles.checkCircle,
          checked && styles.checkedCircle,
        ]}
      >
        {checked && (
          <Ionicons
            name="checkmark"
            size={12}
            color="#FFFFFF"
          />
        )}
      </View>

      <Text
        style={[
          styles.checkText,
          checked && styles.checkedText,
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
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

  shiftCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 17,
    padding: 14,
  },

  pills: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  confirmedPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF3",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  confirmedText: {
    marginLeft: 3,
    color: "#039855",
    fontSize: 7,
    fontWeight: "800",
  },

  startPill: {
    backgroundColor: "#EFF8FF",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },

  startText: {
    color: "#175CD3",
    fontSize: 7,
    fontWeight: "800",
  },

  shiftTitle: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: "800",
    color: "#101828",
    marginTop: 12,
  },

  facility: {
    fontSize: 9,
    color: "#667085",
    marginTop: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 11,
  },

  infoText: {
    marginLeft: 7,
    fontSize: 9,
    color: "#475467",
    flex: 1,
  },

  primaryButton: {
    height: 40,
    borderRadius: 7,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },

  primaryText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4E7EC",
    borderRadius: 12,
    marginHorizontal: 18,
    marginTop: 13,
    padding: 14,
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#344054",
    marginBottom: 14,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  checkCircle: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D0D5DD",
    alignItems: "center",
    justifyContent: "center",
  },

  checkedCircle: {
    backgroundColor: "#12B76A",
    borderColor: "#12B76A",
  },

  checkText: {
    marginLeft: 9,
    flex: 1,
    fontSize: 9,
    color: "#667085",
  },

  checkedText: {
    color: "#344054",
  },

  info: {
    marginBottom: 12,
  },

  infoLabel: {
    fontSize: 8,
    color: "#667085",
  },

  infoValue: {
    fontSize: 10,
    color: "#101828",
    fontWeight: "600",
    marginTop: 3,
  },

  note: {
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10,
    marginTop: 2,
  },

  noteText: {
    fontSize: 9,
    lineHeight: 14,
    color: "#667085",
  },

  outlineButton: {
    height: 39,
    borderWidth: 1,
    borderColor: "#B2CCFF",
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 12,
  },

  outlineText: {
    marginLeft: 5,
    color: "#175CD3",
    fontSize: 10,
    fontWeight: "700",
  },
});