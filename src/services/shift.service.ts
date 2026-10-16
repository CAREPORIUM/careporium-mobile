import { api } from "@/services/api";
import { Shift } from "@/types/shift";

// REAL. Worker side of the shifts API:
//   GET /api/shifts/v1/get-shifts?status=open
//   GET /api/shifts/v1/get-shift/{shiftId}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dateLabel(key: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key ?? "");
  if (!m) return key || "Date to be confirmed";
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return key;
  return `${WEEKDAYS[date.getDay()]}, ${d} ${MONTHS[mo - 1]}`;
}

function hoursBetween(start: string, end: string): number {
  const a = /^(\d{1,2}):(\d{2})$/.exec(start ?? "");
  const b = /^(\d{1,2}):(\d{2})$/.exec(end ?? "");
  if (!a || !b) return 0;
  const s = Number(a[1]) * 60 + Number(a[2]);
  const e = Number(b[1]) * 60 + Number(b[2]);
  const mins = e > s ? e - s : e + 24 * 60 - s;
  return Math.round((mins / 60) * 100) / 100;
}

export function toShift(r: any): Shift {
  const f = r.facility;
  const facility = typeof f === "object" && f ? f.facilityName ?? f.name ?? f.fullName ?? "Healthcare facility" : "Healthcare facility";
  const start = r.startTime ?? "";
  const end = r.endTime ?? "";
  const total = Number(r.payRate) || 0;
  const hours = hoursBetween(start, end);
  const responsibilities = String(r.responsibilities ?? "");
  const lines = responsibilities.split(/\r?\n|;/).map((x) => x.trim()).filter(Boolean);
  return {
    id: String(r._id),
    title: [r.profession, r.specialty].filter(Boolean).join(" · ") || "Shift",
    facility,
    location: r.location ?? "",
    date: dateLabel(String(r.shiftDate ?? "")),
    time: start && end ? `${start}–${end} WAT` : "",
    shiftType: r.shiftType ?? "",
    total,
    hours,
    rate: hours > 0 ? Math.round(total / hours) : total,
    tag: r.isUrgent ? "URGENT" : null,
    description: responsibilities,
    duties: lines.length > 1 ? lines : [],
    requirements: r.reqCredentials ?? "",
    arrival: r.arrivalInstructions ?? "",
    experience: r.minimumExperience ?? "",
    status: r.status ?? "",
    needed: Number(r.professionalsNeeded) || 1,
    filled: Array.isArray(r.assignedWorkers) ? r.assignedWorkers.length : 0,
    sortKey: `${r.shiftDate ?? ""} ${start}`,
    createdAt: r.createdAt ?? "",
  };
}

const cache = new Map<string, Shift>();

export async function getShifts(): Promise<Shift[]> {
  const body: any = await api("/api/shifts/v1/get-shifts?status=open", { method: "GET" });
  const rows: any[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
  const list = rows.filter((r) => r && r._id).map(toShift);
  list.forEach((s) => cache.set(s.id, s));
  return list;
}

export async function getShiftById(id: string): Promise<Shift | undefined> {
  const hit = cache.get(id);
  if (hit) return hit;
  const body: any = await api(`/api/shifts/v1/get-shift/${id}`, { method: "GET" });
  const d = body?.data ?? body;
  if (!d?._id) return undefined;
  const s = toShift(d);
  cache.set(id, s);
  return s;
}