import {
  Account,
  ActivityEvent,
  AdminStats,
  Dispute,
  FacilityReview,
  ReportSummary,
  Submission,
  WorkerReview,
} from "@/types/admin";

// Mock admin data. Swap these functions for real API calls once the backend exists.
// The screens only call these functions, so nothing else needs to change.

export function getAdminStats(): AdminStats {
  return {
    workers: { total: 1240, verified: 1080 },
    facilities: { total: 186, verified: 164 },
    pendingVerifications: 42,
    activeShifts: 128,
    completedShifts: 2860,
    openDisputes: 8,
    payments: { released: "₦4.8m", funded: "₦1.2m", failures: 3 },
    completedLast7Days: [
      { day: "Mon", count: 32 },
      { day: "Tue", count: 44 },
      { day: "Wed", count: 38 },
      { day: "Thu", count: 52 },
      { day: "Fri", count: 45 },
      { day: "Sat", count: 28 },
      { day: "Sun", count: 21 },
    ],
  };
}

export function getSubmissionCounts() {
  return { all: 42, workers: 30, facilities: 12 };
}

export function getSubmissions(): Submission[] {
  return [
    { id: "WK-1048", name: "Amara Okafor", type: "Worker", detail: "RN", submitted: "2 Oct · 08:20", submittedAt: "2026-10-02T08:20", status: "Pending" },
    { id: "FC-0216", name: "Mainland Care Hospital", type: "Facility", detail: "", submitted: "1 Oct · 16:40", submittedAt: "2026-10-01T16:40", status: "Pending" },
    { id: "WK-1052", name: "Chidinma Eze", type: "Worker", detail: "RN", submitted: "1 Oct · 10:15", submittedAt: "2026-10-01T10:15", status: "Resubmitted" },
  ];
}

const WORKER_REVIEWS: WorkerReview[] = [
  {
    id: "WK-1048",
    name: "Amara Okafor",
    role: "Registered nurse",
    licence: "NMCN licence · NMCN •••• 4821",
    licenceMeta: "Expiry: 31 Dec 2026 · Submitted 2 Oct 2026",
    certification: "BLS certification · Expires Jun 2027",
    identity: "Identity document · Name matches profile",
    profileLine: "Specialty: Acute care · Experience: 5 years",
  },
  {
    id: "WK-1052",
    name: "Chidinma Eze",
    role: "Registered nurse",
    licence: "NMCN licence · NMCN •••• 5530",
    licenceMeta: "Expiry: 30 Jun 2027 · Resubmitted 1 Oct 2026",
    certification: "BLS certification · Expires Mar 2027",
    identity: "Identity document · Name matches profile",
    profileLine: "Specialty: Emergency care · Experience: 3 years",
  },
];

export function getWorkerReview(id?: string): WorkerReview {
  return WORKER_REVIEWS.find((w) => w.id === id) ?? WORKER_REVIEWS[0];
}

export function getFacilityReview(_id?: string): FacilityReview {
  return {
    id: "FC-0216",
    name: "Mainland Care Hospital",
    summary: "Hospital · 14 Example Road, Ikeja, Lagos",
    contact: "Contact: Ada Bello · Facility administrator",
    contactDetails: "contact@mainlandcare.example · +234 800 000 0000",
  };
}

export function getAccounts(): Account[] {
  return [
    { id: "WK-1048", name: "Amara Okafor", role: "Worker", verification: "Verified", access: "Active", email: "amara@example.com", completedShifts: 32, lastActive: "2 Oct" },
    { id: "FC-0216", name: "Mainland Care Hospital", role: "Facility", verification: "Verified", access: "Active", email: "contact@mainlandcare.example", completedShifts: 210, lastActive: "2 Oct" },
    { id: "WK-1052", name: "Chidinma Eze", role: "Worker", verification: "Pending", access: "Restricted", email: "chidinma@example.com", completedShifts: 0, lastActive: "1 Oct" },
  ];
}

const DISPUTES: Dispute[] = [
  {
    id: "DP-0128",
    parties: "Amara / Mainland Care",
    issue: "Shift completion",
    status: "Open",
    title: "Shift completion · Amara Okafor and Mainland Care Hospital",
    shift: "Registered Nurse · 1 Oct · 07:00–19:00 WAT",
    amount: "₦36,000 · Payment held pending resolution",
    opened: "2 Oct · 08:15 · Status: Open",
    workerStatement: "I completed the shift, but completion has not been confirmed.",
    facilityStatement: "We are checking the handover record with the ward supervisor.",
    timeline: ["08:15 — Worker opened dispute", "08:25 — Facility notified", "09:00 — Case assigned to platform admin"],
  },
  {
    id: "DP-0129",
    parties: "Tunde / Yaba Clinic",
    issue: "Payment delay",
    status: "In review",
    title: "Payment delay · Tunde Adebayo and Yaba Community Clinic",
    shift: "Community Nurse · 28 Sep · 08:00–16:00 WAT",
    amount: "₦28,000 · Release delayed after completion",
    opened: "1 Oct · 14:05 · Status: In review",
    workerStatement: "The shift was confirmed but payment has not arrived after 3 days.",
    facilityStatement: "Funding was added late. Payment release is being retried.",
    timeline: ["14:05 — Worker opened dispute", "14:20 — Facility notified", "15:00 — Case moved to review"],
  },
  {
    id: "DP-0130",
    parties: "Chidinma / Ikeja Centre",
    issue: "Attendance",
    status: "Open",
    title: "Attendance · Chidinma Eze and Ikeja Medical Centre",
    shift: "Theatre Nurse · 30 Sep · 10:00–18:00 WAT",
    amount: "₦32,000 · Payment held pending resolution",
    opened: "1 Oct · 09:30 · Status: Open",
    workerStatement: "I arrived on time and checked in at reception.",
    facilityStatement: "Our records show the worker arrived two hours late.",
    timeline: ["09:30 — Worker opened dispute", "09:40 — Facility notified", "10:10 — Case assigned to platform admin"],
  },
];

export function getDisputes(): Dispute[] {
  return DISPUTES;
}

export function getDispute(id?: string): Dispute {
  return DISPUTES.find((d) => d.id === id) ?? DISPUTES[0];
}

export function getActivity(): ActivityEvent[] {
  return [
    { id: "1", time: "09:40", event: "Worker approved", actor: "Platform admin", result: "Success", reference: "WK-1048", category: "Verification" },
    { id: "2", time: "09:32", event: "Shift published", actor: "Mainland Care", result: "Urgent", reference: "SH-0824", category: "Shifts" },
    { id: "3", time: "09:15", event: "Payment release", actor: "Yaba Clinic", result: "Failed", reference: "PY-0321", category: "Payments" },
    { id: "4", time: "08:50", event: "Facility submitted", actor: "Ikeja Centre", result: "Pending", reference: "FC-0220", category: "Verification" },
  ];
}

export function getReportSummary(): ReportSummary {
  return {
    line: "18 approvals · 3 rejections · 24 shifts published · 3 payment failures",
    note: "Report includes event time, actor, account, action, outcome and reference.",
    issues: "Issues to review: 3 payment failures and 2 repeated sign-in failures.",
  };
}
