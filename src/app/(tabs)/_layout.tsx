import { Tabs, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { useVerification } from "@/hooks/useVerification";

type IconName = keyof typeof Ionicons.glyphMap;

// Until the account is verified only Home is open. The other tabs show a lock and open the Verify screen instead.
// NOTE: needs src/app/(tabs)/payments.tsx (your teammate's PR). Delete the Payments line until that is merged.
// Profile is not a tab. It opens from the icon next to the bell on Home.
export default function TabsLayout() {
  const { locked } = useVerification();

  const gate = {
    tabPress: (e: { preventDefault: () => void }) => {
      if (locked) {
        e.preventDefault();
        router.push("/verification");
      }
    },
  };
  const tab = (title: string, icon: IconName, gated = true) => ({
    title,
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <Ionicons name={gated && locked ? "lock-closed-outline" : icon} size={size} color={color} />
    ),
  });

  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.textSecondary }}>
      <Tabs.Screen name="index" options={tab("Home", "grid-outline", false)} />
      <Tabs.Screen name="shifts" options={tab("Shifts", "briefcase-outline")} listeners={gate} />
      <Tabs.Screen name="applications" options={tab("Applied", "mail-outline")} listeners={gate} />
      <Tabs.Screen name="upcoming" options={tab("Upcoming", "calendar-outline")} listeners={gate} />
      <Tabs.Screen name="payments" options={tab("Payments", "card-outline")} listeners={gate} />

      {/* Still reachable at /(tabs)/profile, just hidden from the bar */}
      <Tabs.Screen name="profile" options={{ href: null }} />
    </Tabs>
  );
}
