import { api } from "@/services/api";
import { dayLabel, refreshShifts } from "@/services/facility-listing.service";

// REAL. GET /api/applications/v1/facility-applications, PATCH accept/{id}, PATCH reject/{id}.
// Worker and shift may come back populated or as ids; both are handled.
// No rating/attendance/shortlist exists on the backend, so none is shown.

export type ApplicantStatus = "pending" | "accepted" | "rejected";

export type Applicant = {
  id: string; // application id
  workerId: string;
  name: string;
  profession: string;
  specialty: string;
  years: number | null;
  status: ApplicantStatus;
  shiftId: string;
  shiftTitle: string;
  shiftWhen: string;
  appliedAt: string;
};

type State = { items: Applicant[]; loading: boolean; loaded: boolean; error: string };
let state: State = { items: [], loading: false, loaded: false, error: "" };
const listeners = new Set<() => void>();

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}
export function subscribeApplicants(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getApplicantsState = () => state;

export const STATUS_OPTIONS = ["Waiting for review", "Accepted", "Declined", "All"];
export const SORT_OPTIONS = ["Newest", "Oldest"];

const first = (...v: any[]) => v.find((x) => typeof x === "string" && x.trim().length > 0) ?? "";

function toStatus(raw: unknown): ApplicantStatus {
  const v = String(raw ?? "").toLowerCase();
  if (["accepted", "approved", "confirmed"].includes(v)) return "accepted";
  if (["rejected", "declined"].includes(v)) return "rejected";
  return "pending";
}

function normalize(a: any): Applicant {
  const w = a.worker ?? a.applicant ?? a.user ?? {};
  const wo = typeof w === "object" && w ? w : {};
  const sh = a.shift && typeof a.shift === "object" ? a.shift : {};
  const start = sh.startTime ?? "";
  const end = sh.endTime ?? "";
  return {
    id: String(a._id),
    workerId: typeof w === "string" ? w : String(wo._id ?? ""),
    name: first(wo.fullName, wo.name, [wo.firstName, wo.lastName].filter(Boolean).join(" ")) || "Applicant",
    profession: first(wo.profession),
    specialty: first(wo.specialty),
    years: typeof wo.yearsOfExperience === "number" ? wo.yearsOfExperience : null,
    status: toStatus(a.status),
    shiftId: typeof a.shift === "string" ? a.shift : String(sh._id ?? ""),
    shiftTitle: [sh.profession, sh.specialty].filter(Boolean).join(" · ") || "Shift",
    shiftWhen: sh.shiftDate ? `${dayLabel(String(sh.shiftDate))}${start && end ? ` · ${start}–${end} WAT` : ""}` : "",
    appliedAt: String(a.createdAt ?? ""),
  };
}

export async function refreshApplicants(): Promise<void> {
  setState({ loading: true, error: "" });
  try {
    const body: any = await api("/api/applications/v1/facility-applications", { method: "GET" });
    const rows: any[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
    setState({ items: rows.filter((r) => r && r._id).map(normalize), loading: false, loaded: true });
  } catch (e: any) {
    setState({ loading: false, error: e?.message ?? "Couldn't load applicants. Try again." });
  }
}

function setStatus(id: string, status: ApplicantStatus) {
  setState({ items: state.items.map((a) => (a.id === id ? { ...a, status } : a)) });
}

export async function acceptApplicant(id: string): Promise<string> {
  const body: any = await api(`/api/applications/v1/accept/${id}`, { method: "PATCH" });
  setStatus(id, "accepted");
  refreshShifts().catch(() => {});
  return body?.message ?? "Applicant accepted.";
}

export async function rejectApplicant(id: string): Promise<string> {
  const body: any = await api(`/api/applications/v1/reject/${id}`, { method: "PATCH" });
  setStatus(id, "rejected");
  return body?.message ?? "Applicant declined.";
}

export function waitingCount(): number {
  return state.items.filter((a) => a.status === "pending").length;
}

export function getApplicants(opts: { query?: string; status?: string; sort?: string; shiftId?: string } = {}): Applicant[] {
  const q = (opts.query ?? "").trim().toLowerCase();
  const want: ApplicantStatus | null = opts.status === "Accepted" ? "accepted" : opts.status === "Declined" ? "rejected" : opts.status === "All" ? null : "pending";
  const list = state.items.filter((a) => {
    if (opts.shiftId && a.shiftId !== opts.shiftId) return false;
    if (want && a.status !== want) return false;
    if (!q) return true;
    return [a.name, a.profession, a.specialty, a.shiftTitle].some((x) => x.toLowerCase().includes(q));
  });
  return [...list].sort((a, b) => (opts.sort === "Oldest" ? a.appliedAt.localeCompare(b.appliedAt) : b.appliedAt.localeCompare(a.appliedAt)));
}

export function getApplicant(id: string): Applicant | undefined {
  return state.items.find((a) => a.id === id);
}