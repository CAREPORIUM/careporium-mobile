import { useCallback, useSyncExternalStore } from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import NotificationCard from "@/components/ui/NotificationCard";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { useAuth } from "@/context/AuthContext";
import { useVerification } from "@/hooks/useVerification";
import { buildNotifications, getReadVersion, markAllRead, markRead, subscribeRead } from "@/services/notification.service";
import { getWorkerState, refreshWorkerData, subscribeWorker } from "@/services/worker-data.service";
import { getApplicantsState, refreshApplicants, subscribeApplicants } from "@/services/facility-hiring.service";
import { AppNotification } from "@/types/notification";
import { colors, spacing, typography } from "@/constants/theme";
import { goBack } from "@/utils/navigation";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const role = user?.role === "facility" ? "facility" : "worker";
  useVerification(); // keeps verification status fresh
  useSyncExternalStore(subscribeWorker, getWorkerState);
  useSyncExternalStore(subscribeApplicants, getApplicantsState);
  useSyncExternalStore(subscribeRead, getReadVersion);

  useFocusEffect(
    useCallback(() => {
      if (role === "worker") refreshWorkerData();
      else refreshApplicants();
    }, [role])
  );

  const items = buildNotifications(role);
  const unreadCount = items.filter((n) => n.unread).length;

  const openAction = (n: AppNotification) => {
    markRead(n.id);
    if (n.actionHref) router.push(n.actionHref);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Pressable style={styles.backButton} onPress={() => goBack(role === "worker" ? "/(tabs)" : "/facility")}>
        <Ionicons name="arrow-back" size={20} color={colors.text} />
      </Pressable>

      <Text style={styles.eyebrow}>NOTIFICATIONS</Text>
      <Text style={styles.title}>Stay up to date.</Text>
      <Text style={styles.subtitle}>
        {unreadCount > 0 ? `You have ${unreadCount} unread ${unreadCount === 1 ? "update" : "updates"}.` : "You're all caught up."}
      </Text>

      {unreadCount > 0 && (
        <SecondaryButton title="Mark all as read" onPress={() => markAllRead(items.map((n) => n.id))} style={{ marginTop: spacing.lg }} />
      )}

      <View style={{ marginTop: spacing.lg }}>
        {items.length === 0 ? <Text style={styles.subtitle}>Nothing new yet.</Text> : null}
        {items.map((n) => (
          <NotificationCard
            key={n.id}
            title={n.title}
            message={n.message}
            time={n.time}
            unread={n.unread}
            actionLabel={n.actionLabel}
            onAction={n.actionHref ? () => openAction(n) : undefined}
            onPress={() => markRead(n.id)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.xxl },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 999,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eyebrow: { ...typography.bodySmall, color: colors.primary, fontWeight: "700" },
  title: { ...typography.h2, color: colors.text, marginTop: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs },
});