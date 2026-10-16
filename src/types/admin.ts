export type AdminKind = "worker" | "facility";
export type DocStatus = "missing" | "pending" | "verified" | "rejected";
export type PersonStatus = "pending" | "verified" | "rejected";

// One uploaded document on a worker or facility profile.
export type AdminDoc = {
  field: string; // the server's name for it, e.g. "professionalLicense"
  title: string;
  url: string; // empty when nothing was uploaded
  status: DocStatus;
  comment: string;
};

// A worker or a facility, as the admin sees it.
export type AdminPerson = {
  id: string;
  kind: AdminKind;
  name: string;
  email: string;
  phone: string;
  detail: string; // "Nurse · General Nursing" or "Diagnostic Centre"
  location: string;
  status: PersonStatus;
  updatedAt: string;
  docs: AdminDoc[];
};

export type StatLine = { label: string; value: string };