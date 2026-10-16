import { api } from "@/services/api";
import { getProfile, patchProfile, refreshProfile } from "@/services/profile.service";
import { getState } from "@/services/verification.service";
import { tryLocations } from "@/utils/locationFields";

// REAL facility profile, built from the server profile (see profile.service.ts).
// Save: PUT /api/facility/v1/update-facility-profile (multipart/form-data).

export type FacilityProfile = {
  name: string;
  type: string;
  address: string;
  area: string; // city / area, e.g. "Lekki"
  state: string; // e.g. "Lagos"
  verified: boolean;
};

export const FACILITY_TYPES = ["Hospital", "Clinic", "Pharmacy", "Laboratory", "Nursing home", "Other"];

export function getFacilityProfile(): FacilityProfile {
  const p = getProfile("facility");
  return {
    name: p.name || "Your facility",
    type: p.facilityType || "Not set",
    address: p.address || "Not set",
    area: p.city || "",
    state: p.state || "",
    verified: getState("facility").status === "verified",
  };
}

export async function saveFacilityProfile(next: FacilityProfile): Promise<void> {
  const current = getProfile("facility");
  const send = (locationTexts: Record<string, string>) => {
    const form = new FormData();
    form.append("facilityName", next.name.trim());
    form.append("facilityType", next.type);
    Object.entries(locationTexts).forEach(([k, v]) => form.append(k, v));
    const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error("The server took too long to respond. Try again.")), 30000));
    return Promise.race([api("/api/facility/v1/update-facility-profile", { method: "PUT", body: form }), timeout]);
  };
  await tryLocations(send, next.address, next.area, next.state, current.country);
  patchProfile("facility", { name: next.name.trim(), facilityType: next.type, address: next.address.trim(), city: next.area.trim(), state: next.state.trim() });
}

export function locationLine(p: FacilityProfile): string {
  return [p.area, p.state].filter(Boolean).join(", ") || "Location not set";
}

export { refreshProfile };