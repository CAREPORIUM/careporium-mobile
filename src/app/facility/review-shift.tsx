import { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SecondaryButton from "@/components/ui/SecondaryButton";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import ScreenTitle from "@/components/ui/ScreenTitle";
import { clearDraft, dateLabel, getDraft, money, parseDate, plural, publishShift, timeLabel } from "@/services/facility-post.service";
import { getFacilityProfile } from "@/services/facility-profile.service";
import { formatNaira } from "@/utils/format";
import { colors, spacing, typography } from "@/constants/theme";

// Review step. Shows the plain review, or the urgent review when the shift is marked urgent.
export default function ReviewShiftScreen() {
  const d = getDraft();
  const facility = getFacilityProfile();
  const m = money(d);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const year = parseDate(d.date)?.getFullYear() ?? "";
  const roleLine = `${d.profession} · ${d.specialty}`;

  const publish = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const { shiftId } = await publishShift(d, facility.name);
      const live = { title: roleLine, date: `${dateLabel(d)} · ${timeLabel(d)}`, people: String(m.people), pay: String(m.rate * m.hours) };
      clearDraft();
      // A real shift is not live until it is funded, so go to the funding screen.
      if (shiftId) router.replace({ pathname: "/facility/fund-shift", params: { id: shiftId } });
      else router.replace({ pathname: "/facility/shift-live", params: live });
    } catch (e: any) {
      setError(e.message ?? "Couldn't post your shift. Try again.");
      setBusy(false);
    }
  };

  if (d.urgent) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <ScreenTitle title="Review your urgent shift" subtitle="Check the information workers will see before you publish." onBack={() => router.back()} />

        <Card style={styles.gap}>
          <Badge text="URGENT · STAFF NEEDED" tone="warning" />
          <Text style={styles.big}>{roleLine}</Text>
          <Text style={styles.body}>
            {facility.name} · Verified facility · {d.location}
          </Text>
          <View style={styles.lines}>
            <Text style={styles.line}>
              {dateLabel(d)} {year} · {timeLabel(d)} · {d.shiftType}
            </Text>
            <Text style={styles.line}>
              {m.people} {plural(m.people, "professional", "professionals")} needed
              {d.experience && d.experience !== "No minimum" ? ` · Minimum ${d.experience} of experience` : ""}
            </Text>
            <Text style={styles.line}>
              {formatNaira(m.rate)}/hour · {formatNaira(m.perPerson)} per professional
            </Text>
          </View>

          <Text style={styles.h3}>Responsibilities</Text>
          <Text style={styles.body}>{d.description}</Text>

          {d.licences ? (
            <>
              <Text style={styles.h3}>Credential requirements</Text>
              <Text style={styles.body}>{d.licences}</Text>
            </>
          ) : null}

          <Text style={styles.warn}>The urgent label appears on marketplace cards and shift details. It does not bypass credential verification.</Text>
        </Card>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <SecondaryButton title="Edit shift" onPress={() => router.back()} style={styles.gap} />
        <PrimaryButton title="Publish urgent shift" onPress={publish} loading={busy} style={styles.gapSmall} />
        <Text style={styles.body}>After publishing: applicants appear in your shift’s applicant list.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <ScreenTitle title="Review your shift" subtitle="Does everything look right? Check the details before posting." onBack={() => router.back()} />

      <Card style={[styles.gap, styles.summary]}>
        <Text style={styles.cardTitle}>Shift summary</Text>
        <Text style={styles.body}>
          {m.people} {d.profession.toLowerCase()}
          {m.people > 1 ? "s" : ""} · {d.specialty}
        </Text>
        <Text style={styles.line}>
          {dateLabel(d)} · {timeLabel(d)}
        </Text>
        <Text style={styles.line}>
          {facility.name} · {d.location}
        </Text>
        <Text style={styles.money}>{formatNaira(m.perPerson)} for each person</Text>
        <Text style={styles.money}>{formatNaira(m.total)} for the whole shift</Text>
        <Text style={styles.body}>
          That’s {m.hours} hours at {formatNaira(m.rate)} an hour for {m.people} {plural(m.people, "person", "people")}. You’ll see any platform fees before you confirm.
        </Text>
        <Text style={styles.body}>Only verified professionals can apply. You’ll need to fund the shift before confirming their bookings.</Text>
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <SecondaryButton title="Edit details" onPress={() => router.back()} style={styles.gap} />
      <PrimaryButton title="Post this shift" onPress={publish} loading={busy} style={styles.gapSmall} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  gap: { marginTop: spacing.lg },
  gapSmall: { marginTop: spacing.md },
  summary: { backgroundColor: colors.primaryLight },
  cardTitle: { ...typography.h3, color: colors.text },
  big: { ...typography.h2, color: colors.text, marginTop: spacing.md },
  h3: { ...typography.h3, color: colors.text, marginTop: spacing.lg },
  body: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.md },
  lines: { marginTop: spacing.md },
  line: { ...typography.bodySmall, color: colors.text, marginTop: spacing.xs },
  money: { ...typography.h3, color: colors.text, marginTop: spacing.md },
  warn: { ...typography.bodySmall, color: colors.warning, marginTop: spacing.lg },
  error: { ...typography.bodySmall, color: colors.error, marginTop: spacing.lg },
});
