import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useAuth } from "@/context/AuthContext";
import { useLogout } from "@/hooks/useLogout";
import { useProfile } from "@/hooks/useProfile";
import { useVerification } from "@/hooks/useVerification";
import { colors, radius, spacing, typography } from "@/constants/theme";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>{label}</Text>
      <Text style={{ ...typography.label, color: colors.text, fontWeight: "600" }}>{value}</Text>
    </View>
  );
}

const docLabel = (s?: string) => (s === "verified" ? "Verified" : s === "rejected" ? "Not approved" : s === "pending" ? "Under review" : "Not submitted");

export default function ProfileTabScreen() {
  const { user } = useAuth();
  const { handleLogout, loggingOut } = useLogout();
  const p = useProfile();
  const v = useVerification();

  const doc = (key: string) => v.docs.find((d) => d.key === key)?.remote?.status;
  const headline = [p.profession, p.specialty, p.state || p.city].filter(Boolean).join(" · ") || "Add your profession and specialty";
  const place = [p.city, p.state].filter(Boolean).join(", ") || p.address || "Not set";
  const verified = v.status === "verified";

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.eyebrow}>PROFESSIONAL PROFILE</Text>
      <Text style={styles.title}>{verified ? "Your verified professional identity." : "Your professional profile."}</Text>
      <Text style={styles.subtitle}>A clear view of the credentials and experience facilities rely on.</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{p.initials || "?"}</Text>
        </View>
        <Text style={styles.cardTitle}>{p.name || (p.loaded ? "Your name" : "Loading…")}</Text>
        <Text style={styles.grey}>{headline}</Text>

        <View style={[styles.pill, !verified && styles.pillMuted]}>
          <Ionicons name={verified ? "checkmark" : "time-outline"} size={14} color={verified ? colors.success : colors.warning} />
          <Text style={[styles.pillText, !verified && { color: colors.warning }]}>
            {verified ? "VERIFIED PROFESSIONAL" : v.status === "pending" ? "VERIFICATION IN REVIEW" : v.status === "rejected" ? "ACTION NEEDED" : "NOT VERIFIED YET"}
          </Text>
        </View>

        <Text style={[styles.cardTitle, { marginTop: spacing.lg }]}>Professional details</Text>
        <Row label="Profession" value={p.profession || "Not set"} />
        <Row label="Specialty" value={p.specialty || "Not set"} />
        <Row label="Experience" value={p.years !== null ? `${p.years} ${p.years === 1 ? "year" : "years"}` : "Not set"} />
        <Row label="Location" value={place} />
        {p.phone ? <Row label="Phone" value={p.phone} /> : null}

        <SecondaryButton
          title="Edit professional profile"
          onPress={() => Alert.alert("Edit profile", "Coming soon")}
          style={{ marginTop: spacing.lg }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Verification</Text>
        <Text style={styles.grey}>Your documents stay private. Facilities see your verification status and relevant credentials.</Text>

        <Row label="Identity" value={docLabel(doc("id"))} />
        <Row label="Professional licence" value={docLabel(doc("licence"))} />
        <Row label="Education certificate" value={docLabel(doc("education"))} />
        <Row label="Proof of address" value={docLabel(doc("address"))} />

        <SecondaryButton
          title={verified ? "View verification" : "Verify my account"}
          onPress={() => router.push("/verification")}
          style={{ marginTop: spacing.lg }}
        />
      </View>

      <View style={styles.accountBlock}>
        {(p.email || user?.email) ? <Text style={styles.grey}>Signed in as {p.email || user?.email}</Text> : null}
        {loggingOut ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: spacing.md }} />
        ) : (
          <SecondaryButton title="Log out" onPress={handleLogout} style={{ marginTop: spacing.md }} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderLight, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.lg },
  avatar: { width: 48, height: 48, borderRadius: radius.round, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { ...typography.label, color: colors.white, fontWeight: "700" },
  cardTitle: { ...typography.h3, color: colors.text, marginTop: spacing.md },
  grey: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  pill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", backgroundColor: colors.successLight, borderRadius: radius.round, paddingHorizontal: spacing.sm, paddingVertical: 4, gap: 4, marginTop: spacing.md },
  pillMuted: { backgroundColor: colors.warningLight },
  pillText: { ...typography.bodySmall, fontWeight: "800", color: colors.success },
  accountBlock: { marginTop: spacing.xl },
});