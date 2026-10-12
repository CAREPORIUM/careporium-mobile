import { ReactNode } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView, Alert, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Href } from "expo-router";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";
import { router } from "expo-router";

// Shared building blocks for every admin screen.

export function Brand() {
  return (
    <View style={styles.brandRow}>
      <Ionicons name="medkit" size={26} color={colors.primary} />
      <Text style={styles.brand}>CAREPORIUM</Text>
    </View>
  );
}

export function AdminHeader() {
  return (
    <View style={styles.header}>
      <Brand />
<Pressable onPress={() => router.push("/admin/notifications")} hitSlop={8} accessibilityLabel="Notifications">        <Ionicons name="notifications-outline" size={26} color={colors.text} />
      </Pressable>
    </View>
  );
}

// Header + scrolling page body used by all admin tab screens.
export function AdminScreen({ children }: { children: ReactNode }) {
  return (
    <View style={styles.screen}>
      <AdminHeader />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {children}
      </ScrollView>
    </View>
  );
}

export function ScreenTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={styles.screenTitle}>{title}</Text>
      {subtitle ? <Text style={styles.screenSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.cardTitle}>{children}</Text>;
}

export function FieldLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.fieldLabel}>{children}</Text>;
}

export function InfoLine({ children }: { children: ReactNode }) {
  return <Text style={styles.infoLine}>{children}</Text>;
}

export function EmptyText({ children }: { children: ReactNode }) {
  return <Text style={styles.empty}>{children}</Text>;
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.chipActive]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export type ChipOption<T extends string> = { value: T; label: string };

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: ChipOption<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={styles.chipRow}>
      {options.map((o) => (
        <Chip key={o.value} label={o.label} active={o.value === value} onPress={() => onChange(o.value)} />
      ))}
    </View>
  );
}

export function BackLink({ fallback, label = "Back" }: { fallback: Href; label?: string }) {
  return (
    <Pressable style={styles.backLink} onPress={() => goBack(fallback)} hitSlop={8}>
      <Ionicons name="arrow-back" size={20} color={colors.primary} />
      <Text style={styles.backLinkText}>{label}</Text>
    </Pressable>
  );
}

export function CheckRow({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <Pressable style={styles.checkRow} onPress={onToggle}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Ionicons name="checkmark" size={16} color={colors.white} />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.card },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  brand: { ...typography.h3, color: colors.primary, fontWeight: "600" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  screenTitle: { ...typography.h3, color: colors.text, fontWeight: "700" },
  screenSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.sm },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTitle: { ...typography.label, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  fieldLabel: { ...typography.bodySmall, fontWeight: "700", color: colors.text, marginTop: spacing.md, marginBottom: spacing.sm },
  infoLine: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
  empty: { ...typography.bodySmall, color: colors.textSecondary, textAlign: "center", paddingVertical: spacing.lg },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginVertical: spacing.md },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: radius.round },
  chipActive: { backgroundColor: colors.primaryLight },
  chipText: { ...typography.bodySmall, color: colors.primary },
  chipTextActive: { fontWeight: "700" },
  backLink: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginBottom: spacing.md, alignSelf: "flex-start" },
  backLinkText: { ...typography.bodySmall, color: colors.primary, fontWeight: "600" },
  checkRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.md },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkLabel: { ...typography.bodySmall, color: colors.text, flex: 1 },
});
