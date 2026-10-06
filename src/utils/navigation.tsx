import { router, Href } from "expo-router";

// Goes back if there is history. Otherwise (e.g. after a replace) goes to a safe screen.
export function goBack(fallback: Href = "/(tabs)") {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}