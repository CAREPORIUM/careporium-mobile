import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function RootNavigator() {
  const { user, loading } = useAuth();
  const insets = useSafeAreaInsets();

  if (loading) return null; // brief blank while the saved session loads

  const isWorker = user?.role === "worker";
  const isFacility = user?.role === "facility";

  // contentStyle pushes every screen below the status bar / Dynamic Island
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { paddingTop: insets.top } }}>
      {/* Only logged-in workers can open these */}
      <Stack.Protected guard={isWorker}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="worker-profile" />
        <Stack.Screen name="shift-details" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="application-review" />
        <Stack.Screen name="application-submit" />
        <Stack.Screen name="application-submitted" />
        <Stack.Screen name="upcoming-shift" />
        <Stack.Screen name="clock-in" />
        <Stack.Screen name="experience" />
        <Stack.Screen name="experience-form" />
        <Stack.Screen name="experience-remove" />
        <Stack.Screen name="facility-reviews" />
      </Stack.Protected>

      {/* Only logged-in facilities can open the facility area */}
      <Stack.Protected guard={isFacility}>
        <Stack.Screen name="facility" />
      </Stack.Protected>

      {/* Both roles can open the verification screen */}
      <Stack.Protected guard={isWorker || isFacility}>
        <Stack.Screen name="verification" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
