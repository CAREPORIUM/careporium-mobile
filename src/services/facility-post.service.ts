import { api } from "@/services/api";
import { rememberFunding } from "@/services/facility-payment.service";

// Posting a shift. The form works on a "draft" kept in memory so Review / Edit details / Save for later can share it.
//
// REAL API: POST /api/shifts/v1/create-shift (facility token), body from the live Swagger:
//   profession, specialty, shiftDate ("2026-10-20"), shiftType ("Day"), startTime ("08:00"), endTime ("20:00"),
//   professionalsNeeded (int), minimumExperience ("2 years"), location (string), responsibilities,
//   reqCredentials, arrivalInstructions, payRate (number), isUrgent (bool)
// The server also starts the HarrenaPay escrow payment when a shift is created
// ("400: Invalid shift data or payment initiation failed"), so a failure here can be a payment problem.
// payRate is the TOTAL per person for the whole shift (the test payment showed 50000 -> 50,000 payout + 10% commission),
// so we send hours x hourly pay, not the hourly figure.
export const USE_REAL_API = true;

export type ShiftDraft = {
  profession: string;
  specialty: string;
  date: string; // "09 / 10 / 2026"
  shiftType: string;
  start: string; // "07:00"
  end: string; // "19:00"
  people: string; // "2"
  experience: string;
  location: string; // "Yaba, Lagos"
  hourlyPay: string; // digits only
  description: string;
  licences: string;
  reportTo: string;
  urgent: boolean;
};

export const PROFESSIONS = ["Registered nurse", "Pharmacist", "Medical laboratory scientist", "Physiotherapist", "Doctor", "Radiographer"];

export const SPECIALTIES: Record<string, string[]> = {
  "Registered nurse": ["Acute care", "Emergency care", "Intensive care", "General ward", "Community nursing", "Theatre"],
  Pharmacist: ["Clinical pharmacy", "Community pharmacy", "Hospital pharmacy"],
  "Medical laboratory scientist": ["Haematology", "Microbiology", "Chemical pathology"],
  Physiotherapist: ["Musculoskeletal", "Neurological", "Paediatric"],
  Doctor: ["General practice", "Emergency medicine", "Paediatrics"],
  Radiographer: ["General radiography", "CT", "Ultrasound"],
};

export const SHIFT_TYPES = ["Day shift", "Night shift"];
export const PEOPLE_OPTIONS = ["1", "2", "3", "4", "5", "6", "8", "10"];
export const EXPERIENCE_OPTIONS = ["No minimum", "1 year", "2 years", "3 years", "5 years"];
export const LOCATIONS = ["Yaba, Lagos", "Ikeja, Lagos", "Surulere, Lagos", "Victoria Island, Lagos", "Lekki, Lagos"];

export const EMPTY_DRAFT: ShiftDraft = {
  profession: "",
  specialty: "",
  date: "",
  shiftType: "",
  start: "",
  end: "",
  people: "",
  experience: "",
  location: "",
  hourlyPay: "",
  description: "",
  licences: "",
  reportTo: "",
  urgent: false,
};

let draft: ShiftDraft = { ...EMPTY_DRAFT };
let savedForLater = false;

export function getDraft(): ShiftDraft {
  return draft;
}
export function setDraft(next: ShiftDraft) {
  draft = next;
}
export function clearDraft() {
  draft = { ...EMPTY_DRAFT };
  savedForLater = false;
}
export function saveForLater(next: ShiftDraft) {
  draft = next;
  savedForLater = true;
}
export function hasSavedDraft() {
  return savedForLater;
}

// Typing helpers: lay digits out as "DD / MM / YYYY" and "HH:MM".
export function maskDate(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)} / ${d.slice(2)}`;
  return `${d.slice(0, 2)} / ${d.slice(2, 4)} / ${d.slice(4)}`;
}
export function maskTime(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
}

export function parseDate(text: string): Date | null {
  const m = /^(\d{2}) \/ (\d{2}) \/ (\d{4})$/.exec(text);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

function parseTime(text: string): number | null {
  const m = /^(\d{2}):(\d{2})$/.exec(text);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export function validate(d: ShiftDraft): string | null {
  if (!d.profession) return "Choose a profession.";
  if (!d.specialty) return "Choose a specialty.";
  const date = parseDate(d.date);
  if (!date) return "Enter the shift date as DD / MM / YYYY.";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return "The shift date can't be in the past.";
  if (!d.shiftType) return "Choose a shift type.";
  if (parseTime(d.start) === null) return "Enter the start time as HH:MM, for example 07:00.";
  if (parseTime(d.end) === null) return "Enter the end time as HH:MM, for example 19:00.";
  if (parseTime(d.start) === parseTime(d.end)) return "Start and end time can't be the same.";
  if (!d.people) return "Say how many people you need.";
  if (!d.location) return "Choose a location.";
  if (!d.hourlyPay || Number(d.hourlyPay) <= 0) return "Enter the hourly pay in naira.";
  if (!d.description.trim()) return "Describe what they will do.";
  return null;
}

// 07:00 to 19:00 = 12 hours. 19:00 to 07:00 counts as overnight = 12 hours.
export function shiftHours(d: ShiftDraft): number {
  const s = parseTime(d.start);
  const e = parseTime(d.end);
  if (s === null || e === null) return 0;
  const mins = e > s ? e - s : e + 24 * 60 - s;
  return Math.round((mins / 60) * 100) / 100;
}

export function money(d: ShiftDraft) {
  const hours = shiftHours(d);
  const rate = Number(d.hourlyPay) || 0;
  const people = Number(d.people) || 0;
  const perPerson = hours * rate;
  return { hours, rate, people, perPerson, total: perPerson * people };
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function dateLabel(d: ShiftDraft): string {
  const date = parseDate(d.date);
  return date ? `${date.getDate()} ${MONTHS[date.getMonth()]}` : "";
}

export function timeLabel(d: ShiftDraft): string {
  return d.start && d.end ? `${d.start}–${d.end} WAT` : "";
}

export function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

// Sends the shift to the server. Returns the new shift's id. The shift starts as "pending_payment":
// the server also opens a HarrenaPay escrow, and the shift only opens to workers once it is funded.
export async function publishShift(d: ShiftDraft, _facilityName?: string): Promise<{ shiftId: string | null }> {
  if (!USE_REAL_API) {
    await new Promise((r) => setTimeout(r, 700));
    return { shiftId: null };
  }
  const date = parseDate(d.date)!;
  const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const res: any = await api("/api/shifts/v1/create-shift", {
    method: "POST",
    body: {
      profession: d.profession,
      specialty: d.specialty,
      shiftDate: iso,
      shiftType: d.shiftType.replace(" shift", ""), // "Day" or "Night"
      startTime: d.start,
      endTime: d.end,
      professionalsNeeded: Number(d.people),
      minimumExperience: d.experience || "No minimum",
      location: d.location,
      responsibilities: d.description.trim(),
      reqCredentials: d.licences.trim() || "None",
      arrivalInstructions: d.reportTo.trim() || "None",
      payRate: money(d).perPerson, // TOTAL naira per person for the shift (hours x hourly pay)
      isUrgent: d.urgent,
    },
  });
  if (__DEV__) console.log("[create-shift response]", JSON.stringify(res));

  const data = res?.data ?? res;
  const shiftId: string | null = data?.shift?._id ?? null;
  if (shiftId && data?.payment) rememberFunding(shiftId, data.payment);
  return { shiftId };
}
