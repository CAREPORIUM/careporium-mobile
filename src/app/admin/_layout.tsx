import { Stack } from "expo-router";

// Admin area: sign-in screens, then the admin tab bar.
export default function AdminLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
