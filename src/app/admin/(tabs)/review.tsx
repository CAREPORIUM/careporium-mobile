import { useCallback, useState } from "react";
import { Text, StyleSheet, Alert, Linking, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import AppInput from "@/components/ui/AppInput";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, BackLink, Card, CardTitle, EmptyText, FieldLabel, InfoLine, ScreenTitle } from "@/components/admin/AdminUI";
import { getPerson, reviewDocument } from "@/services/admin.service";
import { AdminDoc, AdminKind, AdminPerson } from "@/types/admin";
import { colors, radius, spacing, typography } from "@/constants/theme";

const STATUS_TEXT: Record<AdminDoc["status"], string> = {
  missing: "Not uploaded",
  pending: "Waiting for review",
  verified: "Approved",
  rejected: "Rejected",
};

// Review one worker or facility: open each document, then approve or reject it.
export default function AdminReviewScreen() {
  const { kind, id } = useLocalSearchParams<{ kind?: string; id?: string }>();
  const k: AdminKind = kind === "facility" ? "facility" : "worker";
  const [person, setPerson] = useState<AdminPerson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState("");

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setPerson(await getPerson(k, id));
      setError("");
    } catch (e: any) {
      setError(e?.message ?? "Couldn't load this submission.");
    } finally {
      setLoading(false);
    }
  }, [k, id]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const decide = async (docs: AdminDoc[], status: "verified" | "rejected") => {
    if (!id || busy) return;
    if (status === "rejected" && !notes.trim()) {
      Alert.alert("Reason required", "Add a rejection reason so they know what to fix.");
      return;
    }
    setBusy(docs.length === 1 ? docs[0].field : "all");
    try {
      for (const d of docs) await reviewDocument(k, id, d.field, status, status === "rejected" ? notes.trim() : "");
      if (status === "rejected") setNotes("");
      await load();
      Alert.alert(status === "verified" ? "Approved" : "Rejected", status === "verified" ? "The document was approved." : "The document was rejected and the reason was saved.");
    } catch (e: any) {
      Alert.alert("Couldn't save the decision", e?.message ?? "Try again.");
    } finally {
      setBusy("");
    }
  };

  const openDoc = (url: string) => Linking.openURL(url).catch(() => Alert.alert("Couldn't open the document", url));

  const toApprove = (person?.docs ?? []).filter((d) => d.url && d.status !== "verified");

  return (
    <AdminScreen>
      <BackLink fallback="/admin/verify" label="Back to queue" />
      <ScreenTitle
        title={k === "worker" ? "Review worker credentials" : "Review facility verification"}
        subtitle={person ? `${person.name} · ${person.status === "verified" ? "Verified" : person.status === "rejected" ? "Rejected" : "Pending"}` : undefined}
      />

      {loading ? <EmptyText>Loading…</EmptyText> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {person ? (
        <>
          <Card>
            <CardTitle>{person.kind === "worker" ? "Worker" : "Facility"} details</CardTitle>
            <InfoLine>{person.name}</InfoLine>
            {person.detail ? <InfoLine>{person.detail}</InfoLine> : null}
            {person.email ? <InfoLine>{person.email}</InfoLine> : null}
            {person.phone ? <InfoLine>{person.phone}</InfoLine> : null}
            {person.location ? <InfoLine>{person.location}</InfoLine> : null}
          </Card>

          <FieldLabel>Review notes / rejection reason</FieldLabel>
          <AppInput placeholder="Needed when you reject a document" value={notes} onChangeText={setNotes} multiline numberOfLines={3} />

          {person.docs.map((d) => (
            <Card key={d.field} style={{ marginTop: spacing.md }}>
              <CardTitle>{d.title}</CardTitle>
              <Text style={[styles.status, d.status === "verified" && styles.ok, d.status === "rejected" && styles.bad]}>{STATUS_TEXT[d.status]}</Text>
              {d.comment ? <InfoLine>Note: {d.comment}</InfoLine> : null}

              {d.url ? (
                <>
                  <SecondaryButton title="Open document" onPress={() => openDoc(d.url)} style={{ marginTop: spacing.md }} />
                  <View style={styles.actions}>
                    <PrimaryButton
                      title="Approve"
                      onPress={() => decide([d], "verified")}
                      loading={busy === d.field}
                      disabled={!!busy || d.status === "verified"}
                      style={styles.action}
                    />
                    <SecondaryButton title="Reject" onPress={() => decide([d], "rejected")} disabled={!!busy || d.status === "rejected"} style={styles.action} />
                  </View>
                </>
              ) : (
                <InfoLine>Nothing to review yet.</InfoLine>
              )}
            </Card>
          ))}

          {toApprove.length > 1 ? (
            <PrimaryButton
              title={`Approve all ${toApprove.length} uploaded documents`}
              onPress={() => decide(toApprove, "verified")}
              loading={busy === "all"}
              disabled={!!busy}
              style={{ marginTop: spacing.lg }}
            />
          ) : null}
        </>
      ) : null}
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  error: { ...typography.bodySmall, color: colors.error, marginBottom: spacing.md },
  status: { ...typography.label, color: colors.warning, fontWeight: "700" },
  ok: { color: colors.success },
  bad: { color: colors.error },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.md },
  action: { flex: 1 },
});