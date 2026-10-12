import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { router } from "expo-router";
import NotificationCard from "@/components/ui/NotificationCard";
import SecondaryButton from "@/components/ui/SecondaryButton";
import { AdminScreen, BackLink, ScreenTitle } from "@/components/admin/AdminUI";
import { getAdminNotifications } from "@/services/admin-notification.service";
import { AppNotification } from "@/types/notification";
import { spacing } from "@/constants/theme";

export default function AdminNotificationsScreen() {
  const [items, setItems] = useState<AppNotification[]>(getAdminNotifications());

  const unreadCount = items.filter((n) => n.unread).length;

  const markRead = (id: string) => setItems(items.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  const markAllRead = () => setItems(items.map((n) => ({ ...n, unread: false })));

  const openAction = (n: AppNotification) => {
    markRead(n.id);
    if (n.actionHref) router.push(n.actionHref);
  };

  return (
    <AdminScreen>
      <BackLink fallback="/admin" label="Back to dashboard" />
      <ScreenTitle
        title="Notifications"
        subtitle={unreadCount > 0 ? `${unreadCount} unread ${unreadCount === 1 ? "update" : "updates"}` : "You're all caught up."}
      />

      {unreadCount > 0 && <SecondaryButton title="Mark all as read" onPress={markAllRead} style={styles.markAll} />}

      <View style={styles.list}>
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
    </AdminScreen>
  );
}

const styles = StyleSheet.create({
  markAll: { marginTop: spacing.md },
  list: { marginTop: spacing.lg },
});