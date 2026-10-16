import { router, useLocalSearchParams } from "expo-router";
import ApplicantList from "@/components/ui/ApplicantList";
import { getListedShifts } from "@/services/facility-listing.service";

export default function ShiftApplicantsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const shift = getListedShifts().find((s) => s.id === id);

  return (
    <ApplicantList
      title="Applicants for your shift"
      subtitle={shift ? `${shift.title} · ${shift.whenLabel}` : "Review who applied to this shift."}
      shiftId={id}
      footer="Accepting an applicant adds them to the shift."
      onBack={() => router.back()}
    />
  );
}