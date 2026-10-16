import { api } from "@/services/api";

// REAL: GET /api/shifts/v1/get-facility-shifts (facility token) -> { message, data: Shift[] }.
// Shift status from the server: pending_payment | open | filled | completed (others are treated as "confirmed").
// The list is cached here so Home and Manage shifts share it. Screens call useFacilityShifts() to load and refresh it.

export type ListedKind = "awaiting" | "urgent" | "open" | "confirmed" | "completed";

export type ListedShift = {
  id: string; // the server's shift _id
  title: string;
  whenLabel: string;
  kind: ListedKind;
  needed: number;
  filled: number;
  pay: number; // per person, the full amount for the shift (payRate)
  status: string; // raw server status
  qrToken?: string; // attendanceQrToken, present once workers are assigned
  confirmed: boolean; // completionConfirmed: the facility has confirmed the work was done
  dateKey: string; // "2026-10-25", used for sorting
  sortKey: string;
};

export type ListFilter = "all" | "urgent" | "confirmed" | "completed";

type ListState = { shifts: ListedShift[]; loading: boolean; error: string; loaded: boolean };

let state: ListState = { shifts: [], loading: false, error: "", loaded: false };
const listeners = new Set<() => void>();

function setState(patch: Partial<ListState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}
export function subscribeShifts(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getShiftsState = () => state;

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function dayLabel(dateKey: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey ?? "");
  if (!m) return dateKey || "Date to be confirmed"; // the server accepts odd dates like "2026-15-20"
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return dateKey;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((date.getTime() - today.getTime()) / 86400000);
  const prefix = diff === 0 ? "Today" : diff === 1 ? "Tomorrow" : WEEKDAYS[date.getDay()];
  return `${prefix}, ${d} ${MONTHS[mo - 1]}`;
}

function normalize(raw: any): ListedShift {
  const status = String(raw.status ?? "");
  let kind: ListedKind;
  if (status === "pending_payment") kind = "awaiting";
  else if (status === "completed") kind = "completed";
  else if (status === "open") kind = raw.isUrgent ? "urgent" : "open";
  else kind = "confirmed";

  const start = raw.startTime ?? "";
  const end = raw.endTime ?? "";
  const dateKey = String(raw.shiftDate ?? "");
  return {
    id: String(raw._id),
    title: [raw.profession, raw.specialty].filter(Boolean).join(" · ") || "Shift",
    whenLabel: `${dayLabel(dateKey)}${start && end ? ` · ${start}–${end} WAT` : ""}`,
    kind,
    needed: Number(raw.professionalsNeeded) || 1,
    filled: Array.isArray(raw.assignedWorkers) ? raw.assignedWorkers.length : 0,
    pay: Number(raw.payRate) || 0,
    status,
    qrToken: raw.attendanceQrToken || undefined,
    confirmed: !!raw.completionConfirmed,
    dateKey,
    sortKey: `${dateKey} ${start}`,
  };
}

// Upcoming first (soonest), then past shifts, then completed.
function sortShifts(list: ListedShift[]): ListedShift[] {
  const today = ymd(new Date());
  const rank = (s: ListedShift) => (s.kind === "completed" ? 2 : s.dateKey >= today ? 0 : 1);
  return [...list].sort((a, b) => {
    const ra = rank(a);
    const rb = rank(b);
    if (ra !== rb) return ra - rb;
    return ra === 0 ? a.sortKey.localeCompare(b.sortKey) : b.sortKey.localeCompare(a.sortKey);
  });
}

export async function refreshShifts(): Promise<void> {
  setState({ loading: true, error: "" });
  try {
    const body: any = await api("/api/shifts/v1/get-facility-shifts", { method: "GET" });
    const rows: any[] = Array.isArray(body) ? body : body?.data ?? [];
    const shifts = sortShifts(rows.filter((r) => r && r.status !== "cancelled").map(normalize));
    setState({ shifts, loading: false, loaded: true });
  } catch (e: any) {
    setState({ loading: false, error: e?.message ?? "Couldn't load your shifts. Try again." });
  }
}

export function getListedShifts(): ListedShift[] {
  return state.shifts;
}

export function filterShifts(filter: ListFilter): ListedShift[] {
  const list = state.shifts;
  if (filter === "all") return list.filter((s) => s.kind !== "completed");
  return list.filter((s) => s.kind === filter);
}

export function counts() {
  const list = state.shifts;
  return {
    all: list.filter((s) => s.kind !== "completed").length,
    urgent: list.filter((s) => s.kind === "urgent").length,
    confirmed: list.filter((s) => s.kind === "confirmed").length,
    completed: list.filter((s) => s.kind === "completed").length,
  };
}

export function getHomeStats() {
  const list = state.shifts;
  const today = ymd(new Date());
  return {
    openShifts: list.filter((s) => s.kind === "open" || s.kind === "urgent").length,
    startingToday: list.filter((s) => s.dateKey === today && s.kind !== "completed" && s.kind !== "awaiting").length,
    urgentToFill: list.filter((s) => s.kind === "urgent").length,
  };
}

export function shiftNote(s: ListedShift): { text: string; tone: "warning" | "success" | "muted" } {
  const each = `₦${s.pay.toLocaleString("en-NG")} each`;
  const missing = s.needed - s.filled;
  if (s.kind === "awaiting") return { text: `Fund this shift to open it to workers · ${each}`, tone: "warning" };
  if (s.kind === "completed") return { text: `Completed · ${each}`, tone: "muted" };
  if (missing > 0) return { text: `${missing} more ${missing === 1 ? "person" : "people"} needed · ${each}`, tone: s.kind === "urgent" ? "warning" : "muted" };
  return { text: `${s.filled === 2 ? "Both workers" : `${s.filled} ${s.filled === 1 ? "worker" : "workers"}`} confirmed · ${each}`, tone: "success" };
}