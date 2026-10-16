// Account verification. Workers and facilities can log in straight away, but only Profile and
// Notifications work until an admin approves their documents.
//
// The server is the source of truth. The profile holds each document ({ url, verificationStatus,
// verificationComment }) plus an overall verificationStatus. Documents uploaded at signup therefore
// show up here as already submitted. Files picked in this session are kept on the phone until sent.

import { api } from "@/services/api";
import { FileField, uploadForm } from "@/utils/uploadForm";
import { getProfile } from "@/services/profile.service";
import { tryLocations } from "@/utils/locationFields";

export type Role = "worker" | "facility";
export type VerificationStatus = "not_submitted" | "pending" | "verified" | "rejected";
export type DocStatus = "missing" | "pending" | "verified" | "rejected";
export type PickedFile = { name: string; uri: string; mimeType?: string };
export type DocSpec = { key: string; title: string; hint: string; fields: string[] }; // fields: server names, first is used to upload
export type RemoteDoc = { url: string; status: DocStatus; comment: string };

let storage: any = null;
try {
  storage = require("@react-native-async-storage/async-storage").default;
} catch {}

export const DOCS: Record<Role, DocSpec[]> = {
  worker: [
    { key: "licence", title: "Professional licence", hint: "Upload your current professional licence (for example NMCN or PCN).", fields: ["professionalLicense", "professionalLicence"] },
    { key: "id", title: "ID document", hint: "Upload an accepted government-issued ID.", fields: ["idDocument"] },
    { key: "education", title: "Education certificate", hint: "Upload your professional qualification certificate.", fields: ["educationCert", "educationCertificate"] },
    { key: "address", title: "Proof of address", hint: "Upload a recent utility bill or other proof of where you live.", fields: ["proofOfLocation", "proofOfAddress"] },
  ],
  facility: [
    { key: "license", title: "Facility licence", hint: "Upload your operating licence or registration certificate.", fields: ["facilityLicense", "operatingLicence"] },
    { key: "reg", title: "Business registration", hint: "Upload your CAC registration certificate.", fields: ["businessRegCert", "businessRegistration"] },
    { key: "tax", title: "Tax ID", hint: "Upload your tax identification document.", fields: ["taxID", "taxId"] },
  ],
};

export type VerificationState = {
  status: VerificationStatus;
  files: Record<string, PickedFile | undefined>; // picked on this phone, not sent yet
  remote: Record<string, RemoteDoc | undefined>; // what the server has
  note?: string;
};

const initial = (): VerificationState => ({ status: "not_submitted", files: {}, remote: {} });
const stores: Record<Role, VerificationState> = { worker: initial(), facility: initial() };
const listeners = new Set<() => void>();
const KEY = (role: Role) => `careporium.verification.files.${role}`;

const emit = () => listeners.forEach((l) => l());
export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
export const getState = (role: Role) => stores[role];

const set = (role: Role, next: Partial<VerificationState>) => {
  stores[role] = { ...stores[role], ...next };
  emit();
};

export function setFile(role: Role, key: string, file: PickedFile | undefined) {
  set(role, { files: { ...stores[role].files, [key]: file } });
}

// A document is ready when a file is picked, or the server already has one that wasn't rejected.
export function isReady(role: Role, key: string): boolean {
  const s = stores[role];
  const r = s.remote[key];
  return !!s.files[key] || (!!r && r.status !== "rejected");
}

export function allReady(role: Role): boolean {
  return DOCS[role].every((d) => isReady(role, d.key));
}

const text = (v: unknown) => (typeof v === "string" ? v : "");

function readDoc(profile: any, spec: DocSpec): RemoteDoc | undefined {
  for (const f of spec.fields) {
    const v = profile?.[f] ?? profile?.certifications?.[f]; // worker documents sit inside "certifications"
    if (!v) continue;
    if (typeof v === "string") return { url: v, status: "pending", comment: "" };
    const url = text(v.url);
    if (!url) continue;
    const s = String(v.verificationStatus ?? v.status ?? "pending").toLowerCase();
    const status: DocStatus = ["verified", "approved"].includes(s) ? "verified" : ["rejected", "declined"].includes(s) ? "rejected" : "pending";
    return { url, status, comment: text(v.verificationComment) };
  }
  return undefined;
}

// Reads the documents and overall status from the server profile.
export async function refreshVerification(role: Role): Promise<void> {
  try {
    const path = role === "facility" ? "/api/facility/v1/get-facility-profile" : "/api/worker/v1/get-worker-profile";
    const body: any = await api(path, { method: "GET" });
    const p = body?.data?.worker ?? body?.data?.facility ?? body?.data ?? {};

    const remote: Record<string, RemoteDoc | undefined> = {};
    DOCS[role].forEach((d) => {
      remote[d.key] = readDoc(p, d);
    });
    const docs = Object.values(remote).filter(Boolean) as RemoteDoc[];

    const overall = String(p.verificationStatus ?? "").toLowerCase(); // NOT user.isVerified, that is the email OTP
    let status: VerificationStatus;
    if (["verified", "approved"].includes(overall)) status = "verified";
    else if (docs.some((d) => d.status === "rejected") || ["rejected", "declined"].includes(overall)) status = "rejected";
    else if (docs.length > 0) status = "pending";
    else status = "not_submitted";

    const note = docs.filter((d) => d.status === "rejected" && d.comment).map((d) => d.comment).join(" ");
    set(role, { status, remote, note: note || undefined });
  } catch {
    // keep whatever we had
  }
}

export async function submitForReview(role: Role): Promise<void> {
  if (!allReady(role)) throw new Error("Add all the documents first.");
  const files: FileField[] = [];
  for (const d of DOCS[role]) {
    const f = stores[role].files[d.key];
    if (f) files.push({ field: d.fields[0], file: f, fallbackName: `${d.key}.jpg` });
  }
  if (files.length === 0) throw new Error("Pick a file to upload first.");
  const path = role === "facility" ? "/api/facility/v1/update-facility-profile" : "/api/worker/v1/update-worker-profile";
  if (role === "facility") {
    // The server re-checks the facility's location on every save, so send it along with the documents.
    const p = getProfile("facility");
    const address = p.address.trim();
    const city = p.city.trim();
    if (!address || !city) {
      throw new Error("Add your facility address and city in Profile first, then submit your documents.");
    }
    await tryLocations((loc) => uploadForm(path, "PUT", loc, files), address, city, p.state, p.country);
  } else {
    await uploadForm(path, "PUT", {}, files);
  }
  set(role, { files: {} });
  await refreshVerification(role);
}

// Dev only: pretend an admin approved the documents (this phone only; the server is unchanged).
export function devApprove(role: Role) {
  set(role, { status: "verified", note: undefined });
}