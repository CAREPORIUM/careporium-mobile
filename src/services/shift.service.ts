import { Shift } from "@/types/shift";



const MOCK_SHIFTS: Shift[] = [
  {
    id: "1",
    title: "Registered Nurse · Acute Care",
    facility: "Mainland Care Hospital",
    verifiedFacility: true,
    tag: "URGENT",
    matchPercent: 94,
    date: "Tue, 6 Oct",
    time: "07:00–19:00 WAT",
    location: "Ikeja, Lagos",
    distanceKm: 4.2,
    rate: 3000,
    total: 36000,
    description: "Support an experienced acute care team through a 12-hour day shift. Clear handover, clinical support, and reliable pay after verified completion.",
    duties: [
      "Deliver safe patient care and document handovers",
      "Collaborate with the ward team and follow local protocols",
      "Confirm attendance at the start and end of the shift",
    ],
    closesAt: "5 Oct · 18:00",
  },
  {
    id: "2",
    title: "Community Nurse",
    facility: "Yaba Community Clinic",
    verifiedFacility: true,
    tag: null,
    matchPercent: 94,
    date: "Fri, 9 Oct",
    time: "08:00–16:00 WAT",
    location: "Yaba, Lagos",
    distanceKm: 7.5,
    rate: 3500,
    total: 28000,
    description: "Join a community clinic team providing outpatient nursing support for a full day shift.",
    duties: [
      "Provide outpatient nursing support",
      "Coordinate with clinic staff on patient flow",
      "Confirm attendance at the start and end of the shift",
    ],
    closesAt: "8 Oct · 18:00",
  },
  {
    id: "3",
    title: "Registered Nurse · Night Shift",
    facility: "Ikeja Medical Centre",
    verifiedFacility: true,
    tag: "NEW",
    matchPercent: 88,
    date: "Sat, 10 Oct",
    time: "19:00–07:00 WAT",
    location: "Ikeja, Lagos",
    distanceKm: 5.1,
    rate: 4500,
    total: 54000,
    description: "Overnight coverage for a busy medical centre. Night differential pay included.",
    duties: [
      "Provide overnight patient monitoring",
      "Escalate urgent cases per protocol",
      "Confirm attendance at the start and end of the shift",
    ],
    closesAt: "9 Oct · 18:00",
  },
];

export async function getShifts(): Promise<Shift[]> {
  return MOCK_SHIFTS;
}

export async function getShiftById(id: string): Promise<Shift | undefined> {
  return MOCK_SHIFTS.find((s) => s.id === id);
}