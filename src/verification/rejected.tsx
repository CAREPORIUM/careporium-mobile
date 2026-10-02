import { router } from "expo-router";
import StatusScreen from "@/components/ui/StatusScreen";

export default function RejectedScreen() {
  return (
    <StatusScreen
      icon="close-circle"
      color="#DC2626"
      title="Rejected"
      text="There's an issue with your document. Please review the feedback and resubmit"
      buttonTitle="View details"
      onPress={() => router.push("/credentials")}
    />
  );
}