import { getMyApplications, Application } from "@/services/application.service";
import { getShifts } from "@/services/shift.service";
import { Shift } from "@/types/shift";

// REAL. Everything the worker's Home and Upcoming screens show, built from:
//   GET /api/applications/v1/my-applications  (each with its shift)
//   GET /api/shifts/v1/get-shifts?status=open (for "Open for you")
// An accepted application on a shift that isn't completed = an upcoming confirmed shift.

type State = { apps: Application[]; open: Shift[]; loading: boolean; loaded: boolean; error: string };
let state: State = { apps: [], open: [], loading: false, loaded: false, error: "" };
const listeners = new Set<() => void>();

function setState(p: Partial<State>) {
  state = { ...state, ...p };
  listeners.forEach((l) => l());
}
export function subscribeWorker(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getWorkerState = () => state;

export async function refreshWorkerData(): Promise<void> {
  setState({ loading: true, error: "" });
  try {
    const [apps, open] = await Promise.all([getMyApplications(), getShifts().catch(() => [] as Shift[])]);
    setState({ apps, open, loading: false, loaded: true });
  } catch (e: any) {
    setState({ loading: false, error: e?.message ?? "Couldn't load your shifts. Try again." });
  }
}

const isDone = (s?: Shift) => !!s && ["completed", "cancelled"].includes(s.status);

export function getUpcoming(): Application[] {
  return state.apps
    .filter((a) => a.status === "Accepted" && a.shift && !isDone(a.shift))
    .sort((a, b) => (a.shift!.sortKey < b.shift!.sortKey ? -1 : 1));
}

export function getNextShift(): Application | undefined {
  return getUpcoming()[0];
}

export function getCounts() {
  const c = { underReview: 0, accepted: 0, notSelected: 0 };
  state.apps.forEach((a) => {
    if (a.status === "Under review") c.underReview++;
    else if (a.status === "Accepted") c.accepted++;
    else c.notSelected++;
  });
  return c;
}

// Completed accepted shifts this calendar month.
export function earningsThisMonth(): number {
  const now = new Date();
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  return state.apps
    .filter((a) => a.status === "Accepted" && a.shift?.status === "completed" && a.shift.sortKey.startsWith(key))
    .reduce((sum, a) => sum + (a.shift?.total ?? 0), 0);
}

// An open shift the worker hasn't applied to yet.
export function getRecommended(): Shift | undefined {
  const applied = new Set(state.apps.map((a) => a.shiftId));
  return state.open.find((s) => !applied.has(s.id));
}

export function findShift(id: string): Shift | undefined {
  return state.apps.find((a) => a.shiftId === id)?.shift ?? state.open.find((s) => s.id === id);
}

export function daysUntil(sortKey: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(sortKey);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - t.getTime()) / 86400000);
}

export function startsLabel(sortKey: string): string {
  const n = daysUntil(sortKey);
  if (n === null) return "";
  if (n < 0) return "STARTED";
  if (n === 0) return "STARTS TODAY";
  if (n === 1) return "STARTS TOMORROW";
  return `STARTS IN ${n} DAYS`;
}