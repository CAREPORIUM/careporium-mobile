import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import { Role, getProfile, refreshProfile, subscribeProfile } from "@/services/profile.service";

// The signed-in person's real profile (name, profession, facility details...). Loads when first used.
export function useProfile() {
  const { user } = useAuth();
  const role: Role = user?.role === "facility" ? "facility" : "worker";
  const profile = useSyncExternalStore(subscribeProfile, () => getProfile(role));

  useEffect(() => {
    if (user?.id) refreshProfile(role, user.id, user.email ?? "");
  }, [role, user?.id]);

  return { ...profile, role, reload: () => (user?.id ? refreshProfile(role, user.id, user.email ?? "") : Promise.resolve()) };
}