import { api } from "@/services/api";
import { AdminKind, AdminPerson } from "@/types/admin";
import { log, short, toPerson } from "@/services/adminMap";

export { toPerson } from "@/services/adminMap";
export { getStats } from "@/services/adminStats";
export { reviewDocument } from "@/services/adminReview";

// Finds the array of rows inside whatever the endpoint returned.
function rows(body: any, keys: string[]): any[] {
  if (Array.isArray(body)) return body;
  const d = body?.data ?? body;
  if (Array.isArray(d)) return d;
  for (const k of keys) {
    if (Array.isArray(d?.[k])) return d[k];
  }
  return [];
}

const WORKER_KEYS = ["workers", "items", "results"];
const FACILITY_KEYS = ["facilities", "items", "results"];

async function list(path: string, kind: AdminKind): Promise<AdminPerson[]> {
  const body: any = await api(path, { method: "GET" });
  const items = rows(body, kind === "worker" ? WORKER_KEYS : FACILITY_KEYS);
  log(path, "->", items.length, "rows", items[0] ? short(items[0]) : "");
  return items.map((p) => toPerson(kind, p));
}

const byNewest = (a: AdminPerson, b: AdminPerson) =>
  b.updatedAt.localeCompare(a.updatedAt);

// Workers and facilities still waiting for an overall decision.
export async function getPending(): Promise<AdminPerson[]> {
  const [w, f] = await Promise.all([
    list("/api/admin/v1/workers/pending", "worker"),
    list("/api/admin/v1/facilities/pending", "facility"),
  ]);
  return [...w, ...f].sort(byNewest);
}

// Everyone on the platform.
export async function getEveryone(): Promise<AdminPerson[]> {
  const [w, f] = await Promise.all([
    list("/api/admin/v1/workers", "worker"),
    list("/api/admin/v1/facilities", "facility"),
  ]);
  return [...w, ...f].sort(byNewest);
}

export async function getPerson(
  kind: AdminKind,
  id: string
): Promise<AdminPerson> {
  const folder = kind === "worker" ? "workers" : "facilities";
  const body: any = await api(`/api/admin/v1/${folder}/${id}`, {
    method: "GET",
  });
  const d = body?.data ?? body;
  const p = d?.[kind] ?? d?.profile ?? d;
  log("person", kind, short(p));
  return toPerson(kind, p);
}