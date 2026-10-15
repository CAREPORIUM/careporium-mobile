
import { api } from "@/services/api";
import { Shift } from "@/types/shift";

type RawShift = Record<string, any>;

function getShiftObject(response: any): RawShift {
  return response?.data?.shift
    ?? response?.shift
    ?? response?.data
    ?? response;
}

function getShiftList(response: any): RawShift[] {
  const result =
    response?.data?.shifts
    ?? response?.shifts
    ?? response?.data
    ?? response;

  if (Array.isArray(result)) return result;

  if (Array.isArray(result?.items)) return result.items;

  return [];
}

function toShift(raw: RawShift): Shift {
  const start = raw.startTime ?? raw.startDateTime ?? raw.startDate;
  const end = raw.endTime ?? raw.endDateTime ?? raw.endDate;

  const dateValue = raw.date ?? start;
  const timeValue =
    raw.time ??
    (start && end ? `${start} – ${end}` : start ?? "");

  const facilityValue =
    typeof raw.facility === "string"
      ? raw.facility
      : raw.facility?.name ?? raw.facilityName ?? "";

  const locationValue =
    typeof raw.location === "string"
      ? raw.location
      : raw.location?.address ?? raw.location?.name ?? raw.address ?? "";

  const rate = Number(raw.rate ?? raw.hourlyRate ?? raw.payPerHour ?? 0);
  const total = Number(raw.total ?? raw.totalPay ?? raw.amount ?? 0);

  return {
    id: String(raw._id ?? raw.id ?? raw.shiftId ?? ""),
    title: raw.title ?? raw.role ?? raw.jobTitle ?? "Healthcare shift",
    facility: facilityValue,
    verifiedFacility: Boolean(raw.verifiedFacility ?? raw.facility?.verified ?? false),
    tag: raw.tag === "URGENT" || raw.tag === "NEW" ? raw.tag : null,
    date: dateValue ? String(dateValue) : "",
    time: timeValue ? String(timeValue) : "",
    location: locationValue,
    distanceKm: Number(raw.distanceKm ?? raw.distance ?? 0),
    rate: Number.isFinite(rate) ? rate : 0,
    total: Number.isFinite(total) ? total : 0,
    description: raw.description ?? raw.details ?? "",
    duties: Array.isArray(raw.duties) ? raw.duties : [],
    closesAt: raw.closesAt ?? raw.applicationDeadline ?? "",
  };
}

export async function getShifts(): Promise<Shift[]> {
  const response = await api("/api/shifts/v1/get-shifts");
  return getShiftList(response).map(toShift);
}

export async function getShiftById(
  id: string
): Promise<Shift | undefined> {
  const response = await api(
    `/api/shifts/v1/get-single-shift/${encodeURIComponent(id)}`
  );

  const raw = getShiftObject(response);

  if (!raw || typeof raw !== "object") return undefined;

  return toShift(raw);
}

export async function applyForShift(shiftId: string): Promise<void> {
  await api(
    `/api/applications/v1/apply/${encodeURIComponent(shiftId)}`,
    { method: "POST" }
  );
}
