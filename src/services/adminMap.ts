import { AdminDoc, AdminKind, AdminPerson, DocStatus, PersonStatus } from "@/types/admin";

export const log = (...a: any[]) => {
  if (__DEV__) console.log("[admin]", ...a);
};

export const short = (v: unknown, n = 300) => {
  try {
    return JSON.stringify(v).slice(0, n);
  } catch {
    return "";
  }
};

const str = (...v: any[]) =>
  v.find((x) => typeof x === "string" && x.trim().length > 0)?.trim() ?? "";

const WORKER_DOCS = [
  { field: "professionalLicense", title: "Professional licence", path: ["certifications", "professionalLicense"] },
  { field: "idDocument", title: "ID document", path: ["certifications", "idDocument"] },
  { field: "educationCert", title: "Education certificate", path: ["certifications", "educationCert"] },
  { field: "proofOfLocation", title: "Proof of address", path: ["proofOfLocation"] },
];

const FACILITY_DOCS = [
  { field: "businessRegCert", title: "Business registration", path: ["businessRegCert"] },
  { field: "facilityLicense", title: "Facility licence", path: ["facilityLicense"] },
  { field: "taxID", title: "Tax ID", path: ["taxID"] },
];

function docStatus(raw: unknown): DocStatus {
  const v = String(raw ?? "").toLowerCase();
  if (v === "verified" || v === "approved") return "verified";
  if (v === "rejected" || v === "declined") return "rejected";
  return "pending";
}

function readDocs(kind: AdminKind, p: any): AdminDoc[] {
  const defs = kind === "worker" ? WORKER_DOCS : FACILITY_DOCS;
  return defs.map((d) => {
    const v = d.path.reduce((o: any, k: string) => (o ? o[k] : undefined), p);
    const url = typeof v === "string" ? v : str(v?.url);
    return {
      field: d.field,
      title: d.title,
      url,
      status: url ? docStatus(v?.verificationStatus ?? v?.status) : "missing",
      comment: str(v?.verificationComment),
    };
  });
}

function personStatus(p: any, docs: AdminDoc[]): PersonStatus {
  const v = String(p?.verificationStatus ?? "").toLowerCase();
  if (v === "verified" || v === "approved") return "verified";
  if (v === "rejected" || v === "declined") return "rejected";
  if (v) return "pending";
  const sent = docs.filter((d) => d.url);
  if (sent.length > 0 && sent.every((d) => d.status === "verified")) {
    return "verified";
  }
  return "pending";
}

export function toPerson(kind: AdminKind, p: any): AdminPerson {
  const user = p?.user && typeof p.user === "object" ? p.user : {};
  const docs = readDocs(kind, p);
  const loc = p?.location && typeof p.location === "object" ? p.location : {};
  const locText = typeof p?.location === "string" ? p.location : "";
  const isWorker = kind === "worker";
  const workerName = str(p?.fullName, p?.name) || "Unnamed worker";
  const facilityName = str(p?.facilityName, p?.name) || "Unnamed facility";
  const workerDetail = [str(p?.profession), str(p?.specialty)]
    .filter(Boolean)
    .join(" · ");
  return {
    id: String(p?._id ?? p?.id ?? ""),
    kind,
    name: isWorker ? workerName : facilityName,
    email: str(user.email, p?.email),
    phone: str(p?.phoneNumber, user.phoneNumber),
    detail: isWorker ? workerDetail : str(p?.facilityType),
    location:
      [str(loc.city), str(loc.state)].filter(Boolean).join(", ") ||
      str(loc.address, locText),
    status: personStatus(p, docs),
    updatedAt: str(p?.updatedAt, p?.createdAt),
    docs,
  };
}