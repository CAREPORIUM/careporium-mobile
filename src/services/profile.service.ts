import { api } from "@/services/api";

// REAL profile of the signed-in worker or facility.
//   Facility: GET /api/facility/v1/get-facility-profile
//   Worker:   GET /api/worker/v1/get-worker-profile   (falls back to .../get-worker-profile/{userId})
// Screens read it with getProfile(role) or the useProfile() hook, so names are never hard-coded.

export type Role = "worker" | "facility";

export type Profile = {
  loaded: boolean;
  name: string; // person's full name (worker) or facility name
  firstName: string;
  initials: string;
  email: string;
  phone: string;
  // worker
  profession: string;
  specialty: string;
  years: number | null;
  // shared / facility
  facilityType: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

const empty = (): Profile => ({
  loaded: false,
  name: "",
  firstName: "",
  initials: "",
  email: "",
  phone: "",
  profession: "",
  specialty: "",
  years: null,
  facilityType: "",
  address: "",
  city: "",
  state: "",
  country: "",
});

const stores: Record<Role, Profile> = { worker: empty(), facility: empty() };
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribeProfile(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getProfile = (role: Role) => stores[role];

const str = (...v: any[]) => v.find((x) => typeof x === "string" && x.trim().length > 0)?.trim() ?? "";

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

function normalize(role: Role, p: any, authEmail: string): Profile {
  const u = p?.user && typeof p.user === "object" ? p.user : {};
  const loc = p?.location && typeof p.location === "object" ? p.location : {};
  const locText = typeof p?.location === "string" ? p.location : "";
  const name = role === "facility" ? str(p?.facilityName, p?.name) : str(p?.fullName, p?.name, u.fullName);
  return {
    loaded: true,
    name,
    firstName: role === "facility" ? name : name.split(/\s+/)[0] ?? "",
    initials: initialsOf(name),
    email: str(u.email, p?.email, authEmail),
    phone: str(p?.phoneNumber, u.phoneNumber),
    profession: str(p?.profession),
    specialty: str(p?.specialty),
    years:
      typeof p?.yearsOfExperience === "number"
        ? p.yearsOfExperience
        : p?.yearsOfExperience !== undefined && p?.yearsOfExperience !== "" && Number.isFinite(Number(p.yearsOfExperience))
        ? Number(p.yearsOfExperience)
        : null,
    facilityType: str(p?.facilityType),
    address: str(loc.address, loc.street, locText),
    city: str(loc.city),
    state: str(loc.state),
    country: str(loc.country),
  };
}

function unwrap(body: any, role: Role) {
  const d = body?.data ?? body;
  return d?.[role] ?? d?.profile ?? d;
}

export async function refreshProfile(role: Role, userId: string, authEmail: string): Promise<void> {
  try {
    let body: any;
    if (role === "facility") {
      body = await api("/api/facility/v1/get-facility-profile", { method: "GET" });
    } else {
      try {
        body = await api("/api/worker/v1/get-worker-profile", { method: "GET" });
      } catch {
        body = await api(`/api/worker/v1/get-worker-profile/${userId}`, { method: "GET" });
      }
    }
    if (__DEV__) console.log("[profile]", role, JSON.stringify(unwrap(body, role)).slice(0, 600));
    stores[role] = normalize(role, unwrap(body, role), authEmail);
    emit();
  } catch (e: any) {
    if (__DEV__) console.log("[profile] failed:", e?.message);
  }
}

// Optimistic local update after a save.
export function patchProfile(role: Role, patch: Partial<Profile>) {
  stores[role] = { ...stores[role], ...patch };
  emit();
}

export function clearProfiles() {
  stores.worker = empty();
  stores.facility = empty();
  emit();
}