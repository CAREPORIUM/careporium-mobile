import { router } from "expo-router";
import StatusScreen from "@/components/ui/StatusScreen";

export default function ResubmissionScreen() {
  return (
    <StatusScreen
      icon="sync-circle"
      color="#2563EB"
      title="Resubmission"
      text="You've updated your documents. We're reviewing them again"
      buttonTitle="Reviewing"
      onPress={() => router.push("/verification/pending")}
    />
  );
}