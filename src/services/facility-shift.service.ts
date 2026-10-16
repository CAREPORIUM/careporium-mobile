// MOCK facility shifts, one per screen state so every design can be seen.
// Real endpoints later:
//   GET   /api/shifts/v1/my-shifts                  (facility)
//   GET   /api/applications/v1/fetch-applications   (facility)
//   GET   /api/attendance/v1/shifts/:shiftId/qr     (facility)  -> the QR payload
//   PATCH /api/shifts/v1/complete-shift/:id         (facility)

export type FacilityWorker = {
  id: string;
  name: string;
  role: string;
  accepted: boolean;
  clockIn?: string; // "07:58"
  clockOut?: string; // "16:01"
};

export type FacilityShift = {
  id: string;
  code: string;
  title: string;
  facility: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  needed: number;
  workers: FacilityWorker[];
  completed: boolean;
};

export type FacilityShiftState = "open" | "filled" | "in_progress" | "ready" | "completed";

const base = {
  title: "Registered nurse · General ward",
  facility: "Mainland Care Hospital",
  location: "Yaba, Lagos",
  dateLabel: "Friday, 9 October",
  timeLabel: "08:00–16:00 WAT",
  needed: 2,
};

const amara = (extra: Partial<FacilityWorker> = {}): FacilityWorker => ({ id: "w1", name: "Amara Okafor", role: "Registered nurse", accepted: true, ...extra });
const chidinma = (extra: Partial<FacilityWorker> = {}): FacilityWorker => ({ id: "w2", name: "Chidinma Eze", role: "Registered nurse", accepted: true, ...extra });

let shifts: FacilityShift[] = [
  { ...base, id: "cp-1046", code: "CP-1046", completed: false, workers: [amara(), chidinma({ accepted: false })] },
  { ...base, id: "cp-1042", code: "CP-1042", completed: false, workers: [amara(), chidinma()] },
  { ...base, id: "cp-1043", code: "CP-1043", completed: false, workers: [amara({ clockIn: "07:58", clockOut: "16:01" }), chidinma({ clockIn: "08:02" })] },
  { ...base, id: "cp-1044", code: "CP-1044", completed: false, workers: [amara({ clockIn: "07:58", clockOut: "16:01" }), chidinma({ clockIn: "08:02", clockOut: "16:04" })] },
  { ...base, id: "cp-1040", code: "CP-1040", completed: true, workers: [amara({ clockIn: "07:58", clockOut: "16:01" }), chidinma({ clockIn: "08:02", clockOut: "16:04" })] },
];

export function getFacilityShifts(): FacilityShift[] {
  return shifts;
}

export function getFacilityShift(id: string): FacilityShift {
  return shifts.find((s) => s.id === id) ?? shifts[1];
}

export function acceptedWorkers(s: FacilityShift): FacilityWorker[] {
  return s.workers.filter((w) => w.accepted);
}

export function deriveState(s: FacilityShift): FacilityShiftState {
  if (s.completed) return "completed";
  const accepted = acceptedWorkers(s);
  if (accepted.length < s.needed) return "open";
  if (accepted.every((w) => w.clockOut)) return "ready";
  if (accepted.some((w) => w.clockIn)) return "in_progress";
  return "filled";
}

export function workerStatus(w: FacilityWorker, state: FacilityShiftState): { label: string; tone: "muted" | "primary" | "success" } {
  if (!w.accepted) return { label: "Awaiting acceptance", tone: "muted" };
  if (w.clockIn && w.clockOut) return { label: "Attendance completed", tone: "success" };
  if (w.clockIn) return { label: "Working", tone: "primary" };
  return { label: state === "open" ? "Accepted" : "Not clocked in", tone: "muted" };
}

export function clockLine(w: FacilityWorker): string {
  return `Clock in: ${w.clockIn ? w.clockIn + " WAT" : "Not yet"} · Clock out: ${w.clockOut ? w.clockOut + " WAT" : "Not yet"}`;
}

export function workersSummary(s: FacilityShift, state: FacilityShiftState): string {
  const accepted = acceptedWorkers(s);
  if (state === "open") return `${accepted.length} accepted · ${s.needed - accepted.length} to fill`.replace("to fill", s.needed - accepted.length === 1 ? "place to fill" : "places to fill");
  if (state === "ready" || state === "completed") return `${accepted.length} of ${s.needed} attendance records completed`;
  const working = accepted.filter((w) => w.clockIn && !w.clockOut).length;
  const finished = accepted.filter((w) => w.clockOut).length;
  if (state === "in_progress") return `${working} working · ${finished} finished`;
  return `0 of ${accepted.length} clocked in`;
}

export async function completeShift(id: string): Promise<void> {
  const s = shifts.find((x) => x.id === id);
  if (!s || deriveState(s) !== "ready") throw new Error("Every worker needs to clock out before you can complete this shift.");
  shifts = shifts.map((x) => (x.id === id ? { ...x, completed: true } : x));
}

// What the facility QR encodes. The real value comes from GET /api/attendance/v1/shifts/:shiftId/qr.
export function qrValueFor(s: FacilityShift): string {
  return `careporium:shift:${s.code}`;
}
