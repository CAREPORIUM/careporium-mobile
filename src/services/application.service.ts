import { api } from "@/services/api";
import { getShiftById, toShift } from "@/services/shift.service";
import { Shift } from "@/types/shift";

// REAL.
//   POST /api/applications/v1/apply/{shiftId}      (no body)
//   GET  /api/applications/v1/my-applications

export type AppStatus = "Under review" | "Accepted" | "Not selected";

export type Application = {
  id: string;
  status: AppStatus;
  title: string;
  facility: string;
  date: string; // "Sat, 25 Oct · 08:00–20:00 WAT"
  shiftId: string;
  shift?: Shift; // full shift details, when they could be loaded
};

export async function applyToShift(shiftId: string): Promise<string> {
  const body: any = await api(`/api/applications/v1/apply/${shiftId}`, { method: "POST" });
  return body?.message ?? "Application sent.";
}

function statusLabel(raw: unknown): AppStatus {
  const v = String(raw ?? "").toLowerCase();
  if (["accepted", "approved", "confirmed"].includes(v)) return "Accepted";
  if (["rejected", "declined", "not_selected", "not selected"].includes(v)) return "Not selected";
  return "Under review";
}

export async function getMyApplications(): Promise<Application[]> {
  const body: any = await api("/api/applications/v1/my-applications", { method: "GET" });
  const rows: any[] = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];

  return Promise.all(
    rows.map(async (a) => {
      const raw = a.shift;
      const shiftId = typeof raw === "string" ? raw : raw?._id ?? "";
      let shift = raw && typeof raw === "object" && raw._id ? toShift(raw) : undefined;
      if (!shift && shiftId) shift = await getShiftById(shiftId).catch(() => undefined);
      return {
        id: String(a._id),
        status: statusLabel(a.status),
        title: shift?.title ?? "Shift",
        facility: shift?.facility ?? "Healthcare facility",
        date: shift ? `${shift.date}${shift.time ? ` · ${shift.time}` : ""}` : "",
        shiftId,
        shift,
      };
    })
  );
}