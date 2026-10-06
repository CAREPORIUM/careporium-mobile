import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radius, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function RoleSelectionScreen() {
  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => goBack("/login")}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Choose how you want to get started</Text>

      <Pressable style={styles.card} onPress={() => router.push("/signup")}>
        <View style={styles.cardIcon}><Ionicons name="person-outline" size={28} color={colors.text} /></View>
        <View>
          <Text style={styles.cardTitle}>I'm a Healthcare Professional</Text>
          <Text style={styles.cardSubtitle}>Find job opportunities</Text>
        </View>
      </Pressable>

      <Pressable style={styles.card} onPress={() => router.push("/facility-signup")}>
        <View style={styles.cardIcon}><Ionicons name="business-outline" size={28} color={colors.text} /></View>
        <View>
          <Text style={styles.cardTitle}>Healthcare Facility</Text>
          <Text style={styles.cardSubtitle}>Hire healthcare professional</Text>
        </View>
      </Pressable>

      <Pressable style={styles.footer} onPress={() => router.push("/login")}>
        <Text style={styles.footerText}>Already have an account? <Text style={styles.footerLink}>Log in</Text></Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  backButton: { width: 44, height: 44, borderRadius: radius.round, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", marginBottom: spacing.md, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  title: { ...typography.h1, color: colors.text },
  subtitle: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs, marginBottom: spacing.xl },
  card: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.lg },
  cardIcon: { width: 56, height: 56, borderRadius: radius.round, backgroundColor: "#F3F4F6", alignItems: "center", justifyContent: "center", marginRight: spacing.md },
  cardTitle: { ...typography.label, color: colors.primary },
  cardSubtitle: { ...typography.bodySmall, color: colors.text, marginTop: 2 },
  footer: { alignItems: "center", marginTop: spacing.md },
  footerText: { ...typography.bodySmall, color: colors.text },
  footerLink: { color: colors.primary, fontWeight: "600" },
});