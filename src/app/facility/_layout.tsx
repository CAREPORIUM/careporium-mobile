import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";

type IconName = keyof typeof Ionicons.glyphMap;

const tab = (title: string, icon: IconName) => ({
  title,
  tabBarIcon: ({ color, size }: { color: string; size: number }) => <Ionicons name={icon} size={size} color={color} />,
});

// Facility area: /facility, /facility/post-shift, /facility/hiring, /facility/shifts, /facility/payments.
// Everything below the five tabs is reachable but hidden from the tab bar (href: null).
// Profile opens from the icon on facility Home.
export default function FacilityLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textSecondary }}>
      <Tabs.Screen name="index" options={tab("Home", "grid-outline")} />
      <Tabs.Screen name="post-shift" options={tab("Post shift", "briefcase-outline")} />
      <Tabs.Screen name="hiring" options={tab("Hiring", "mail-outline")} />
      <Tabs.Screen name="shifts" options={tab("Shifts", "calendar-outline")} />
      <Tabs.Screen name="payments" options={tab("Payments", "card-outline")} />

      <Tabs.Screen name="shift-detail" options={{ href: null }} />
      <Tabs.Screen name="complete-shift" options={{ href: null }} />
      <Tabs.Screen name="shift-funded" options={{ href: null }} />
      <Tabs.Screen name="fund-shift" options={{ href: null }} />
      <Tabs.Screen name="shift-qr" options={{ href: null }} />
      <Tabs.Screen name="review-shift" options={{ href: null }} />
      <Tabs.Screen name="shift-live" options={{ href: null }} />
      <Tabs.Screen name="shift-applicants" options={{ href: null }} />
      <Tabs.Screen name="worker-profile" options={{ href: null }} />
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
