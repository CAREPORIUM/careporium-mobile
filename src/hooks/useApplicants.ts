import { useCallback, useSyncExternalStore } from "react";
import { useFocusEffect } from "expo-router";
import { getApplicantsState, refreshApplicants, subscribeApplicants } from "@/services/facility-hiring.service";

export function useApplicants() {
  const state = useSyncExternalStore(subscribeApplicants, getApplicantsState);
  useFocusEffect(
    useCallback(() => {
      refreshApplicants();
    }, [])
  );
  return { ...state, reload: refreshApplicants };
}