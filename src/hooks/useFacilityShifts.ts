import { useCallback, useSyncExternalStore } from "react";
import { useFocusEffect } from "expo-router";
import { getShiftsState, refreshShifts, subscribeShifts } from "@/services/facility-listing.service";

// Loads the facility's real shifts whenever the screen comes into view, and re-renders when they change.
export function useFacilityShifts() {
  const state = useSyncExternalStore(subscribeShifts, getShiftsState);
  useFocusEffect(
    useCallback(() => {
      refreshShifts();
    }, [])
  );
  return { ...state, reload: refreshShifts };
}
