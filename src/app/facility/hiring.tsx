import ApplicantList from "@/components/ui/ApplicantList";

export default function HiringScreen() {
  return (
    <ApplicantList
      title="Applicants"
      subtitle="Review the people who applied to work your shifts."
      footer="Accepting an applicant adds them to the shift. They'll see it under Upcoming."
    />
  );
}