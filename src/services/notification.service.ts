import type { Href } from "expo-router";
import { AppNotification } from "@/types/notification";
import { DOCS, Role, getState } from "@/services/verification.service";
import { getWorkerState } from "@/services/worker-data.service";
import { getApplicantsState } from "@/services/facility-hiring.service";

// REAL notifications. The backend has no notifications endpoint, so these are worked out from
// data the app already loads from the server: your verification, your applications (worker)
// or the people who applied to your shifts (facility). "Read" is remembered on this phone.

const read = new Set<string>();
let readVersion = 0;
const listeners = new Set<() => void>();
const bump = () => {
  readVersion++;
  listeners.forEach((l) => l());
};

export function subscribeRead(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getReadVersion = () => readVersion;

export function markRead(id: string) {
  if (!read.has(id)) {
    read.add(id);
    bump();
  }
}
export function markAllRead(ids: string[]) {
  ids.forEach((id) => read.add(id));
  bump();
}

const go = (path: string) => path as Href;

function verificationItems(role: Role): Omit<AppNotification, "unread">[] {
  const s = getState(role);
  const items: Omit<AppNotification, "unread">[] = [];
  const profileHref = role === "worker" ? "/(tabs)/profile" : "/facility/profile";

  if (s.status === "verified") {
    items.push({
      id: `verif-${role}-verified`,
      title: role === "worker" ? "Credentials verified" : "Facility verified",
      message: role === "worker" ? "Your documents were approved. You can apply for eligible shifts." : "Your documents were approved. You can now post shifts and hire.",
      time: "",
      actionLabel: "View profile",
      actionHref: go(profileHref),
    });
  } else if (s.status === "pending") {
    items.push({
      id: `verif-${role}-pending`,
      title: "We're reviewing your documents",
      message: "Your documents are with our team. We'll update your status when the review is complete.",
      time: "",
      actionLabel: "View progress",
      actionHref: go("/verification"),
    });
  } else if (s.status === "rejected") {
    items.push({
      id: `verif-${role}-rejected`,
      title: "Verification needs your attention",
      message: s.note || "One or more documents weren't approved. Open verification to see what to fix.",
      time: "",
      actionLabel: "Update documents",
      actionHref: go("/verification"),
    });
  } else {
    items.push({
      id: `verif-${role}-start`,
      title: "Verify your account",
      message: "Upload your documents so you can " + (role === "worker" ? "apply for shifts." : "post shifts."),
      time: "",
      actionLabel: "Verify now",
      actionHref: go("/verification"),
    });
  }

  // One notice per document the admin rejected, with the admin's comment.
  DOCS[role].forEach((d) => {
    const r = s.remote[d.key];
    if (r?.status === "rejected") {
      items.push({
        id: `doc-${role}-${d.key}-rejected`,
        title: `${d.title} was not approved`,
        message: r.comment || "Please upload a clearer or valid copy.",
        time: "",
        actionLabel: "Replace document",
        actionHref: go("/verification"),
      });
    }
  });
  return items;
}

function workerItems(): Omit<AppNotification, "unread">[] {
  return getWorkerState().apps.map((a) => {
    if (a.status === "Accepted") {
      return {
        id: `app-${a.id}-accepted`,
        title: "Application accepted",
        message: `${a.facility} accepted your application for ${a.title}.`,
        time: a.date,
        actionLabel: "View shift",
        actionHref: go("/(tabs)/upcoming"),
      };
    }
    if (a.status === "Not selected") {
      return {
        id: `app-${a.id}-rejected`,
        title: "Application not selected",
        message: `${a.facility} chose other applicants for ${a.title}.`,
        time: a.date,
        actionLabel: "Find shifts",
        actionHref: go("/(tabs)/shifts"),
      };
    }
    return {
      id: `app-${a.id}-pending`,
      title: "Application under review",
      message: `${a.facility} is reviewing your application for ${a.title}.`,
      time: a.date,
      actionLabel: "Track application",
      actionHref: go("/(tabs)/applications"),
    };
  });
}

function facilityItems(): Omit<AppNotification, "unread">[] {
  return getApplicantsState()
    .items.filter((a) => a.status === "pending")
    .slice(0, 10)
    .map((a) => ({
      id: `applicant-${a.id}`,
      title: "New applicant",
      message: `${a.name} applied for ${a.shiftTitle}.`,
      time: a.shiftWhen,
      actionLabel: "Review applicants",
      actionHref: go("/facility/hiring"),
    }));
}

// Things that need action first, then applications / applicants, then status.
export function buildNotifications(role: Role): AppNotification[] {
  const v = verificationItems(role);
  const needAction = v.filter((n) => n.id.includes("rejected") || n.id.endsWith("-start"));
  const rest = v.filter((n) => !needAction.includes(n));
  const activity = role === "worker" ? workerItems() : facilityItems();
  return [...needAction, ...activity, ...rest].map((n) => ({ ...n, unread: !read.has(n.id) }));
}