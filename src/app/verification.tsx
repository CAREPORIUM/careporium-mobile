import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import DisabledButton from "@/components/ui/DisabledButton";
import StatusBanner from "@/components/ui/StatusBanner";
import Card from "@/components/ui/Card";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { useVerification } from "@/hooks/useVerification";
import { devApprove, refreshVerification, setFile, submitForReview } from "@/services/verification.service";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

// Upload the documents, then send them for review. Same screen for workers and facilities.
export default function VerificationScreen() {
  const { role, status, note, docs, added, total, canEdit } = useVerification();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const home = role === "facility" ? "/facility" : "/(tabs)";
  const hasNewFile = docs.some((d) => d.file);

  const pick = async (key: string) => {
    setError("");
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: ["application/pdf", "image/*"], copyToCacheDirectory: true });
      if (res.canceled) return;
      const a = res.assets[0];
      setFile(role, key, { name: a.name, uri: a.uri, mimeType: a.mimeType });
    } catch {
      setError("Couldn't open that file. Try another one.");
    }
  };

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await submitForReview(role);
    } catch (e: any) {
      setError(e.message ?? "Couldn't submit your documents. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const stateLine = (d: (typeof docs)[number]) => {
    if (d.file) return { text: `Ready to send: ${d.file.name}`, color: colors.primary };
    if (!d.remote) return { text: "Not submitted", color: colors.warning };
    if (d.remote.status === "verified") return { text: "Verified", color: colors.success };
    if (d.remote.status === "rejected") return { text: d.remote.comment ? `Not approved: ${d.remote.comment}` : "Not approved. Upload a new copy.", color: colors.error };
    return { text: "Submitted · under review", color: colors.success };
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle
        title={role === "facility" ? "Verify your facility" : "Verify your account"}
        subtitle="Have these documents ready. Clear, up-to-date copies help us review faster."
        onBack={() => goBack(home)}
      />

      {status === "verified" ? (
        <StatusBanner kind="success" style={styles.gap} title="You're verified" text="All features are unlocked." />
      ) : status === "pending" ? (
        <StatusBanner kind="info" style={styles.gap} title="Under review" text="We're checking your documents. The rest of the app unlocks once you're verified." />
      ) : status === "rejected" ? (
        <StatusBanner kind="error" style={styles.gap} title="Verification not approved" text={note || "Check the documents marked below and upload them again."} />
      ) : (
        <StatusBanner kind="warning" style={styles.gap} title="Verification needed" text={`Add all ${total} documents, then send them for review. Until then you can only use your profile and notifications.`} />
      )}

      {docs.map((d) => {
        const s = stateLine(d);
        return (
          <Card key={d.key} style={styles.gap}>
            <Text style={styles.docTitle}>{d.title}</Text>
            <Text style={styles.body}>{d.hint}</Text>
            <Text style={[styles.state, { color: s.color }]}>{s.text}</Text>
            {canEdit && d.editable ? (
              <View style={styles.actions}>
                <SecondaryButton title={d.file || d.remote ? "Replace file" : "Upload"} onPress={() => pick(d.key)} style={styles.flex} />
                {d.file ? (
                  <Pressable onPress={() => setFile(role, d.key, undefined)} style={styles.remove} accessibilityRole="button">
                    <Text style={styles.removeText}>Remove</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}
          </Card>
        );
      })}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {canEdit ? (
        added === total && hasNewFile ? (
          <PrimaryButton title="Submit for verification" onPress={submit} loading={busy} style={styles.gap} />
        ) : (
          <DisabledButton title={added === total ? "Replace a document to resubmit" : `Add all documents to submit (${added}/${total})`} style={styles.gap} />
        )
      ) : null}

      {status === "pending" ? <SecondaryButton title="Check status" onPress={() => refreshVerification(role)} style={styles.gap} /> : null}
      {status === "verified" ? <PrimaryButton title="Go to home" onPress={() => router.replace(home)} style={styles.gap} /> : null}

      {__DEV__ && status === "pending" ? <SecondaryButton title="Dev only: mark as verified" onPress={() => devApprove(role)} style={styles.gap} /> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  flex: { flex: 1 },
  docTitle: { ...typography.label, color: colors.text, fontWeight: "700" },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  state: { ...typography.bodySmall, fontWeight: "700", marginTop: spacing.sm },
  actions: { flexDirection: "row", alignItems: "center", marginTop: spacing.md },
  remove: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  removeText: { ...typography.label, color: colors.error, fontWeight: "700" },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.md },
});