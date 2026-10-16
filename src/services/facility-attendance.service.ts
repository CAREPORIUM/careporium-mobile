import { api } from "@/services/api";
import { ListedShift } from "@/services/facility-listing.service";

// REAL: the QR workers scan to clock in and out, and confirming a shift is complete.
//   GET   /api/attendance/v1/qr/{shiftId}          (fallback if the shift list has no attendanceQrToken)
//   PATCH /api/shifts/v1/complete-shift/{shiftId}
// The QR contains the shift's attendanceQrToken. Workers send exactly that text as { qrToken } to clock-in/out.

export async function getQrToken(shift: ListedShift): Promise<string> {
  if (shift.qrToken) return shift.qrToken;
  const body: any = await api(`/api/attendance/v1/qr/${shift.id}`, { method: "GET" });
  const d = body?.data ?? body;
  const token = typeof d === "string" ? d : d?.qrToken ?? d?.token ?? d?.attendanceQrToken ?? d?.qr;
  if (!token) throw new Error("The server didn't return a QR for this shift yet.");
  return String(token);
}

export async function completeShift(shiftId: string): Promise<string> {
  const body: any = await api(`/api/shifts/v1/complete-shift/${shiftId}`, { method: "PATCH" });
  return body?.message ?? "Shift marked as complete.";
}
