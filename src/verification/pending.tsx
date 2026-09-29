import { router } from "expo-router";
import StatusScreen from "@/components/ui/StatusScreen";

export default function PendingReviewScreen() {
  return (
    <StatusScreen
      icon="hourglass-outline"
      color="#F59E0B"
      title="Pending Review"
      text="Your profile and documents are under review. This usually takes 1-3 business days."
      buttonTitle="View details"
      onPress={() => router.push("/credentials-submitted")}
    />
  );
}