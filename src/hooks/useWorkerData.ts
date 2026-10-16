import { useCallback, useSyncExternalStore } from "react";
import { useFocusEffect } from "expo-router";
import { getWorkerState, refreshWorkerData, subscribeWorker } from "@/services/worker-data.service";

export function useWorkerData() {
  const state = useSyncExternalStore(subscribeWorker, getWorkerState);
  useFocusEffect(
    useCallback(() => {
      refreshWorkerData();
    }, [])
  );
  return { ...state, reload: refreshWorkerData };
}