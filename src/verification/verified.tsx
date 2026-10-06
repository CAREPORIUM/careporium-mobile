import { router } from "expo-router";
import StatusScreen from "@/components/ui/StatusScreen";

export default function VerifiedScreen() {
  return (
    <StatusScreen
      icon="checkmark-circle"
      color="#16A34A"
      title="Verified"
      text="Your profile has been verified. You can now start receiving opportunities"
      buttonTitle="View profile"
      onPress={() => router.push("/(tabs)/profile")}
    />
  );
}