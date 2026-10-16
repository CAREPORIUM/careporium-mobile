import { api } from "@/services/api";
import { formatClock, formatDuration } from "@/utils/format";
import { findShift } from "@/services/worker-data.service";

// REAL clock-in/out: POST /api/attendance/v1/clock-in and /clock-out with { qrToken }.
// The facility's QR contains the shift's attendanceQrToken, so the scanned text IS the qrToken.
const tokens: Record<string, string> = {};

export type MyShift = {
  id: string;
  code: string;
  title: string;
  facility: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  arriveBy: string;
};

export type Attendance = {
  clockInAt?: Date;
  clockOutAt?: Date;
};

export type AttendanceState = "confirmed" | "working" | "completed";

const records: Record<string, Attendance> = {};

export class ClockError extends Error {
  code: "QR_MISMATCH" | "ALREADY_CLOCKED_IN" | "NOT_CLOCKED_IN" | "OTHER";
  constructor(code: ClockError["code"], message: string) {
    super(message);
    this.code = code;
  }
}

export function getMyShift(id: string): MyShift {
  const s = findShift(id);
  return {
    id,
    code: id.slice(-6).toUpperCase(),
    title: s?.title ?? "Your shift",
    facility: s?.facility ?? "Healthcare facility",
    location: s?.location ?? "",
    dateLabel: s?.date ?? "",
    timeLabel: s?.time ?? "",
    arriveBy: s?.time ? s.time.split("–")[0] : "",
  };
}

export function getAttendance(id: string): Attendance {
  return records[id] ?? {};
}

export function getState(a: Attendance): AttendanceState {
  if (a.clockOutAt) return "completed";
  if (a.clockInAt) return "working";
  return "confirmed";
}

export function clockTimes(a: Attendance) {
  return {
    clockIn: a.clockInAt ? formatClock(a.clockInAt) : "Not yet",
    clockOut: a.clockOutAt ? formatClock(a.clockOutAt) : "Not yet",
    recorded: a.clockInAt && a.clockOutAt ? formatDuration(a.clockInAt, a.clockOutAt) : undefined,
  };
}

export async function clockIn(shiftId: string, qrValue: string): Promise<void> {
  if (records[shiftId]?.clockInAt) throw new ClockError("ALREADY_CLOCKED_IN", "You've already clocked in for this shift.");

  const qrToken = qrValue.trim();
  try {
    await api("/api/attendance/v1/clock-in", { method: "POST", body: { qrToken } });
  } catch (e: any) {
    const m = String(e?.message ?? "").toLowerCase();
    if (m.includes("already")) throw new ClockError("ALREADY_CLOCKED_IN", e.message);
    if (m.includes("invalid") || m.includes("qr") || m.includes("token")) throw new ClockError("QR_MISMATCH", e.message);
    throw e;
  }
  tokens[shiftId] = qrToken;
  records[shiftId] = { clockInAt: new Date() };
}

export async function clockOut(shiftId: string): Promise<void> {
  const rec = records[shiftId];
  if (!rec?.clockInAt) throw new ClockError("NOT_CLOCKED_IN", "You haven't clocked in yet.");

  const qrToken = tokens[shiftId];
  if (!qrToken) throw new ClockError("OTHER", "Scan the shift QR again to clock out.");
  await api("/api/attendance/v1/clock-out", { method: "POST", body: { qrToken } });
  records[shiftId] = { ...rec, clockOutAt: new Date() };
}