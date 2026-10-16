import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography } from "@/constants/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const icon =
  (name: IconName) =>
  ({ color, size }: { color: string; size: number }) =>
    <Ionicons name={name} size={size} color={color} />;

// The review screen lives inside the tabs folder so the tab bar stays visible,
// but href: null keeps it out of the tab bar itself.
const hidden = { href: null } as const;

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { ...typography.caption },
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.borderLight },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: icon("grid-outline") }} />
      <Tabs.Screen name="verify" options={{ title: "Verify", tabBarIcon: icon("shield-checkmark-outline") }} />
      <Tabs.Screen name="users" options={{ title: "Users", tabBarIcon: icon("people-outline") }} />

      <Tabs.Screen name="review" options={hidden} />
    </Tabs>
  );
}