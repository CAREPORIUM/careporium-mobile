export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

// "07:58 WAT" from a Date, always in Lagos time.
export function formatClock(d: Date): string {
  const t = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Africa/Lagos" });
  return `${t} WAT`;
}

export function formatDuration(from: Date, to: Date): string {
  const mins = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h} ${h === 1 ? "hour" : "hours"} ${m} ${m === 1 ? "minute" : "minutes"}`;
}
