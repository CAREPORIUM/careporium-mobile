import { useState } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

const TABS = ["About", "Experience", "Skills", "Reviews"];

// Mock data — replace once the backend contract exists
const MOCK_PROFILE = {
  name: "Adeyemi Donald",
  role: "Doctor, Gynecologist",
  rating: 4.8,
  reviewCount: 127,
  location: "Ikeja, Lagos",
  openToShifts: true,
  bio: [
    "Compassionate and dedicated Doctor (Gynecologist) with 4+ years of experience in critical care and woman's health. Skilled in providing patient-centered care, conducting comprehensive assessments, managing complex medical conditions, and supporting patients through diagnosis and treatment.",
    "Committed to promoting women's health through preventive care, early detection, evidence-based medical practice, and effective patient education. Demonstrates strong clinical judgment, communication, teamwork, and ability to remain calm and focused in high pressure environments.",
    "Passionate about improving patient outcomes, maintaining high professional standards, and creating a safe supportive healthcare experience for every patient. Dedicated to continuous learning professional development.",
  ],
  experience: "4+ years",
  skills: ["Patient-Centered Care", "Critical Care", "Women's Health", "Clinical Assessment", "Patient Education"],
  ratingBreakdown: [
    { stars: 5, percent: 92 },
    { stars: 4, percent: 6 },
    { stars: 3, percent: 2 },
    { stars: 2, percent: 0 },
    { stars: 1, percent: 0 },
  ],
  reviews: [
    { name: "Dr. Michael Ogunsanya", role: "Facility Admin - General Hospital", stars: 5, text: "Great Doctor! Professional, reliable, and very compassionate." },
    { name: "Dr. Sarah Omotayo", role: "Facility Admin - Lagos Island Hospital", stars: 5, text: "Excellent communication and clinical skills. Highly recommend!" },
    { name: "Dr. Sheriff Omotolani", role: "Facility Admin - Massey Hospital", stars: 5, text: "Great Doctor! Hardworking, professional and excellent communication. Highly recommend!" },
    { name: "Dr. Victor Faruq", role: "Facility Admin - City Hall Hospital", stars: 5, text: "Great experience overall. Knowledgeable, and easy to communicate with." },
  ],
};

function Stars({ count, size = 14 }: { count: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= count ? "star" : "star-outline"} size={size} color="#F59E0B" style={{ marginRight: 2 }} />
      ))}
    </View>
  );
}

export default function WorkerProfileScreen() {
  const [activeTab, setActiveTab] = useState("About");
  const p = MOCK_PROFILE;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerImage}>
        <Pressable style={[styles.iconButton, styles.backButton]} onPress={() => goBack("/(tabs)/shifts")}>
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Pressable style={[styles.iconButton, styles.shareButton]}>
          <Ionicons name="share-social-outline" size={20} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={36} color={colors.textSecondary} />
          </View>
        </View>

        <Text style={styles.name}>{p.name}</Text>
        <Text style={styles.role}>{p.role}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.metaText}>{p.rating} ({p.reviewCount} Review)</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
            <Text style={styles.metaText}>{p.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={styles.metaText}>{p.openToShifts ? "Open to shifts" : "Not available"}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.messageButton}>
            <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.white} />
            <Text style={styles.messageText}>Message</Text>
          </Pressable>
          <Pressable style={styles.saveButton}>
            <Ionicons name="bookmark-outline" size={18} color={colors.primary} />
            <Text style={styles.saveText}>Save</Text>
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <Pressable key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
              {activeTab === tab && <View style={styles.tabUnderline} />}
            </Pressable>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "About" &&
            p.bio.map((para, i) => (
              <Text key={i} style={[styles.bio, i > 0 && { marginTop: spacing.md }]}>{para}</Text>
            ))}

          {activeTab === "Experience" && (
            <View style={styles.row}>
              <Ionicons name="briefcase-outline" size={20} color={colors.text} />
              <Text style={styles.rowText}>{p.experience} of professional experience</Text>
            </View>
          )}

          {activeTab === "Skills" && (
            <View style={styles.chipRow}>
              {p.skills.map((skill) => (
                <View key={skill} style={styles.chip}>
                  <Text style={styles.chipText}>{skill}</Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "Reviews" && (
            <View>
              <View style={styles.reviewSummary}>
                <Text style={styles.ratingBig}>{p.rating}</Text>
                <View>
                  <Stars count={5} size={20} />
                  <Text style={styles.reviewCount}>Based on {p.reviewCount} reviews</Text>
                </View>
              </View>

              {p.ratingBreakdown.map((row) => (
                <View key={row.stars} style={styles.barRow}>
                  <Text style={styles.barLabel}>{row.stars} ★</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${row.percent}%` }]} />
                  </View>
                  <Text style={styles.barPercent}>{row.percent}%</Text>
                </View>
              ))}

              {p.reviews.map((review, i) => (
                <View key={i} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Ionicons name="person" size={20} color={colors.textSecondary} />
                    </View>
                    <View style={{ marginLeft: spacing.sm }}>
                      <Text style={styles.reviewName}>{review.name}</Text>
                      <Text style={styles.reviewRole}>{review.role}</Text>
                    </View>
                  </View>
                  <Stars count={review.stars} />
                  <Text style={styles.reviewText}>{review.text}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerImage: { height: 260, backgroundColor: colors.primaryLight },
  iconButton: { position: "absolute", top: spacing.xxl, width: 44, height: 44, borderRadius: 999, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 },
  backButton: { left: spacing.lg },
  shareButton: { right: spacing.lg },
  content: { paddingHorizontal: spacing.lg },
  avatarRow: { marginTop: -48 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.card, borderWidth: 3, borderColor: colors.white, alignItems: "center", justifyContent: "center" },
  name: { ...typography.h2, color: colors.text, marginTop: spacing.sm },
  role: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 2 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginTop: spacing.md, gap: spacing.lg },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { ...typography.bodySmall, color: colors.text, marginLeft: spacing.xs },
  actionRow: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  messageButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.primary, borderRadius: radius.md, height: 48, gap: spacing.sm },
  messageText: { color: colors.white, ...typography.label, fontWeight: "600" },
  saveButton: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.primary, borderRadius: radius.md, height: 48, gap: spacing.sm },
  saveText: { color: colors.primary, ...typography.label, fontWeight: "600" },
  tabRow: { flexDirection: "row", marginTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  tab: { marginRight: spacing.lg, paddingBottom: spacing.sm },
  tabText: { ...typography.bodySmall, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: "600" },
  tabUnderline: { height: 2, backgroundColor: colors.primary, marginTop: spacing.xs },
  tabContent: { marginTop: spacing.lg, paddingBottom: spacing.xxl },
  bio: { ...typography.bodySmall, color: colors.text, lineHeight: 22 },
  row: { flexDirection: "row", alignItems: "center" },
  rowText: { ...typography.bodySmall, color: colors.text, marginLeft: spacing.sm },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { backgroundColor: colors.card, borderRadius: radius.sm, paddingVertical: spacing.xs, paddingHorizontal: spacing.md },
  chipText: { ...typography.bodySmall, color: colors.text },
  reviewSummary: { flexDirection: "row", alignItems: "center", marginBottom: spacing.lg },
  ratingBig: { fontSize: 48, fontWeight: "700", color: colors.text, marginRight: spacing.md },
  reviewCount: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  barRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.sm },
  barLabel: { width: 32, ...typography.bodySmall, color: colors.text },
  barTrack: { flex: 1, height: 8, backgroundColor: colors.primaryLight, borderRadius: 4, marginHorizontal: spacing.sm, overflow: "hidden" },
  barFill: { height: 8, backgroundColor: colors.primary, borderRadius: 4 },
  barPercent: { width: 36, ...typography.bodySmall, color: colors.textSecondary, textAlign: "right" },
  reviewCard: { marginTop: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.borderLight },
  reviewHeader: { flexDirection: "row", alignItems: "center", marginBottom: spacing.xs },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.card, alignItems: "center", justifyContent: "center" },
  reviewName: { ...typography.bodySmall, fontWeight: "600", color: colors.text },
  reviewRole: { ...typography.bodySmall, color: colors.textSecondary },
  reviewText: { ...typography.bodySmall, color: colors.text, marginTop: spacing.xs },
});