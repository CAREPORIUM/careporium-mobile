import { useEffect, useSyncExternalStore } from "react";
import { useAuth } from "@/context/AuthContext";
import { DOCS, Role, getState, isReady, refreshVerification, subscribe } from "@/services/verification.service";

// Everything a screen needs to know about the signed-in user's verification.
export function useVerification() {
  const { user } = useAuth();
  const role: Role = user?.role === "facility" ? "facility" : "worker";
  const state = useSyncExternalStore(subscribe, () => getState(role));

  useEffect(() => {
    refreshVerification(role);
  }, [role]);

  const docs = DOCS[role].map((d) => {
    const remote = state.remote[d.key];
    const file = state.files[d.key];
    return {
      ...d,
      file,
      remote,
      ready: isReady(role, d.key),
      // can be replaced: nothing sent yet, or the admin rejected it
      editable: state.status !== "verified" && (!remote || remote.status === "rejected" || !!file),
    };
  });
  const added = docs.filter((d) => d.ready).length;

  return {
    role,
    status: state.status,
    note: state.note,
    verified: state.status === "verified",
    locked: state.status !== "verified",
    canEdit: state.status === "not_submitted" || state.status === "rejected",
    docs,
    added,
    total: docs.length,
  };
}