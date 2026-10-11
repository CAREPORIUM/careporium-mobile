import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function RootNavigator() {
  const { user, loading } = useAuth();

  if (loading) return null; // brief blank while the saved session loads

  const isWorker = user?.role === "worker";

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Only logged-in workers can open these */}
      <Stack.Protected guard={isWorker}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="worker-profile" />
        <Stack.Screen name="shift-details" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="application-review" />
        <Stack.Screen name="application-submit" />
        <Stack.Screen name="application-submitted" />
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