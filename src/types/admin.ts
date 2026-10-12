export type AdminStats = {
  workers: { total: number; verified: number };
  facilities: { total: number; verified: number };
  pendingVerifications: number;
  activeShifts: number;
  completedShifts: number;
  openDisputes: number;
  payments: { released: string; funded: string; failures: number };
  completedLast7Days: { day: string; count: number }[];
};

export type SubmissionType = "Worker" | "Facility";

export type Submission = {
  id: string;
  name: string;
  type: SubmissionType;
  detail: string; // e.g. "RN" for workers, empty for facilities
  submitted: string; // display text
  submittedAt: string; // ISO string, used for sorting
  status: "Pending" | "Resubmitted";
};

export type WorkerReview = {
  id: string;
  name: string;
  role: string;
  licence: string;
  licenceMeta: string;
  certification: string;
  identity: string;
  profileLine: string;
};

export type FacilityReview = {
  id: string;
  name: string;
  summary: string;
  contact: string;
  contactDetails: string;
};

export type AccountAccess = "Active" | "Restricted" | "Suspended";

export type Account = {
  id: string;
  name: string;
  role: "Worker" | "Facility";
  verification: "Verified" | "Pending";
  access: AccountAccess;
  email: string;
  completedShifts: number;
  lastActive: string;
};

export type DisputeStatus = "Open" | "In review" | "Resolved";

export type Dispute = {
  id: string;
  parties: string;
  issue: string;
  status: DisputeStatus;
  title: string;
  shift: string;
  amount: string;
  opened: string;
  workerStatement: string;
  facilityStatement: string;
  timeline: string[];
};

export type ActivityCategory = "Verification" | "Shifts" | "Payments" | "Sign-ins";

export type ActivityEvent = {
  id: string;
  time: string;
  event: string;
  actor: string;
  result: string;
  reference: string;
  category: ActivityCategory;
};

export type ReportSummary = {
  line: string;
  note: string;
  issues: string;
};
