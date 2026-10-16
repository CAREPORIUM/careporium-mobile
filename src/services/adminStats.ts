import { api } from "@/services/api";
import { StatLine } from "@/types/admin";
import { log, short } from "@/services/adminMap";

// "totalWorkers" -> "Total workers"
const humanize = (k: string) => {
  const s = k
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

function flatten(o: any, prefix: string, out: StatLine[]): StatLine[] {
  if (o === null || o === undefined) return out;
  if (typeof o === "number") {
    out.push({ label: prefix, value: o.toLocaleString() });
  } else if (typeof o === "string") {
    if (o.length < 24 && o.trim() !== "" && /\d/.test(o)) {
      out.push({ label: prefix, value: o });
    }
  } else if (Array.isArray(o)) {
    // lists are skipped
  } else if (typeof o === "object") {
    for (const [k, v] of Object.entries(o)) {
      if (k === "_id" || k === "id" || k === "__v") continue;
      const label = prefix ? prefix + " · " + humanize(k) : humanize(k);
      flatten(v, label, out);
    }
  }
  return out;
}

// Whatever numbers the dashboard endpoint returns, with readable labels.
export async function getStats(): Promise<StatLine[]> {
  const body: any = await api("/api/admin/v1/dashboard/stats", {
    method: "GET",
  });
  log("stats", short(body, 400));
  return flatten(body?.data ?? body, "", []);
}