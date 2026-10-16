import { api } from "@/services/api";
import { dayLabel } from "@/services/facility-listing.service";

// REAL worker side, from the Swagger:
//   GET  /api/shifts/v1/get-shifts?status=open&role=&specialty=   (open shifts)
//   GET  /api/shifts/v1/get-shift/{shiftId}
//   POST /api/applications/v1/apply/{shiftId}                     (no body)
//   GET  /api/applications/v1/my-applications
// Shift fields are the same as the facility list. Application fields are not confirmed yet, so they are read defensively.

export type WorkerShift = {
  id: string;
  title: string; // "Registered nurse · Emergency care"
  facility: string;
  location: string;
  whenLabel: string; // "Tomorrow, 25 October · 08:00–20:00 WAT"
  shiftType: string;
  pay: number; // naira per person for the whole shift
  urgent: boolean;
  needed: number;
  filled: number;
  minimumExperience: string;
  responsibilities: string;
  credentials: string;
  arrival: string;
  status: string;
  raw: any;
};

const rows = (body: any): any[] => (Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : body?.data ? [body.data] : []);

export function normalizeShift(r: any): WorkerShift {
  const f = r.facility;
  const facility = typeof f === "object" && f ? f.facilityName ?? f.name ?? f.fullName ?? "Facility" : "Facility";
  const start = r.startTime ?? "";
  const end = r.endTime ?? "";
  return {
    id: String(r._id),
    title: [r.profession, r.specialty].filter(Boolean).join(" · ") || "Shift",
    facility,
    location: r.location ?? "",
    whenLabel: `${dayLabel(String(r.shiftDate ?? ""))}${start && end ? ` · ${start}–${end} WAT` : ""}`,
    shiftType: r.shiftType ?? "",
    pay: Number(r.payRate) || 0,
    urgent: !!r.isUrgent,
    needed: Number(r.professionalsNeeded) || 1,
    filled: Array.isArray(r.assignedWorkers) ? r.assignedWorkers.length : 0,
    minimumExperience: r.minimumExperience ?? "",
    responsibilities: r.responsibilities ?? "",
    credentials: r.reqCredentials ?? "",
    arrival: r.arrivalInstructions ?? "",
    status: r.status ?? "",
    raw: r,
  };
}

export async function fetchOpenShifts(filters: { role?: string; specialty?: string } = {}): Promise<WorkerShift[]> {
  const q = new URLSearchParams({ status: "open" });
  if (filters.role) q.set("role", filters.role);
  if (filters.specialty) q.set("specialty", filters.specialty);
  const body: any = await api(`/api/shifts/v1/get-shifts?${q.toString()}`, { method: "GET" });
  return rows(body).filter((r) => r && r._id).map(normalizeShift);
}

export async function fetchShift(id: string): Promise<WorkerShift> {
  const body: any = await api(`/api/shifts/v1/get-shift/${id}`, { method: "GET" });
  const d = body?.data ?? body;
  return normalizeShift(d);
}

// Applies for a shift. Returns the server's message.
export async function applyToShift(id: string): Promise<string> {
  const body: any = await api(`/api/applications/v1/apply/${id}`, { method: "POST" });
  return body?.message ?? "Application sent.";
}

export type MyApplication = { id: string; status: string; shift: WorkerShift | null; raw: any };

export async function fetchMyApplications(): Promise<MyApplication[]> {
  const body: any = await api("/api/applications/v1/my-applications", { method: "GET" });
  return rows(body).map((a) => ({
    id: String(a._id),
    status: String(a.status ?? "pending"),
    shift: a.shift && typeof a.shift === "object" ? normalizeShift(a.shift) : null, // populated shift, if the server sends it
    raw: a,
  }));
}
