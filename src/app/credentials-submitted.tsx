import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { colors, radius, spacing, typography } from "@/constants/theme";

const ITEMS = ["Professional License", "ID Documents", "Education Certificate", "Proof of Address"];

export default function CredentialsSubmittedScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark-circle-outline" size={72} color={colors.primary} />
      </View>
      <Text style={styles.title}>Credentials Uploaded!</Text>
      <Text style={styles.subtitle}>
        Your documents have been submitted and are under review. You'll be notified once your profile is verified
      </Text>

      <View style={styles.banner}>
        <Ionicons name="shield-checkmark" size={32} color={colors.text} />
        <View style={{ marginLeft: spacing.md }}>
          <Text style={styles.bannerTitle}>Verification Timeline</Text>
          <Text style={styles.bannerText}>Usually takes 1-2 business days.</Text>
        </View>
      </View>

      {ITEMS.map((item) => (
        <View key={item} style={styles.itemRow}>
          <Ionicons name="checkmark-circle-outline" size={28} color={colors.success} />
          <View style={{ marginLeft: spacing.md }}>
            <Text style={styles.itemTitle}>{item}</Text>
            <Text style={styles.itemStatus}>Under review</Text>
          </View>
        </View>
      ))}

      <View style={{ flex: 1 }} />
      <PrimaryButton title="Back to Profile" onPress={() => router.replace("/profile")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg, paddingTop: spacing.xxl * 1.5, paddingBottom: spacing.xxl },
  iconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: spacing.lg },
  title: { ...typography.h2, color: colors.text, textAlign: "center" },
  subtitle: { ...typography.bodySmall, color: colors.text, textAlign: "center", marginTop: spacing.sm },
  banner: { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: colors.primaryLight, borderRadius: radius.lg, padding: spacing.lg, marginVertical: spacing.lg },
  bannerTitle: { ...typography.label, fontWeight: "600", color: colors.primary },
  bannerText: { ...typography.bodySmall, color: colors.text },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md },
  itemTitle: { ...typography.label, fontWeight: "600", color: colors.text },
  itemStatus: { ...typography.bodySmall, color: colors.text },
});