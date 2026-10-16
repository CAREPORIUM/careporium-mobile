import { api } from "@/services/api";
import { getListedShifts } from "@/services/facility-listing.service";

// REAL. Shift payments are built from the facility's shifts (get-facility-shifts):
//   pending_payment -> Awaiting funding, open/filled -> Funds secured, completed -> To confirm / Paid.
// Funding details (bank account, checkout link, expiry) come from create-shift (kept in memory when you post)
// or from POST /api/payment/v1/retry/{shiftId}, which asks HarrenaPay for fresh details.
// There is no "get payment" endpoint. The shift flips to "open" by itself once HarrenaPay confirms the payment.
// NEVER put the HarrenaPay API key (simulate-fund) in the app. Sandbox funding is done by the backend team.

export type FundingStatus = "awaiting_funding" | "funds_secured" | "to_confirm" | "paid";

export type ShiftPayment = {
  id: string; // the server's shift _id
  code: string;
  title: string;
  dateLabel: string;
  workers: number;
  amount: number; // naira the facility pays
  status: FundingStatus;
  reference: string;
};

export const STATUS_LABEL: Record<FundingStatus, string> = {
  awaiting_funding: "Awaiting funding",
  funds_secured: "Funds secured",
  to_confirm: "Confirm the shift is complete",
  paid: "Paid",
};

export type FundingDetails = {
  shiftId: string;
  amount: number | null; // naira, includes the service fee
  bankName: string;
  accountNumber: string;
  reference: string;
  checkoutUrl: string;
  expiresAt: string | null; // ISO
};

const funding: Record<string, FundingDetails> = {};

export function parseFunding(shiftId: string, p: any): FundingDetails {
  return {
    shiftId,
    amount: typeof p?.amountKobo === "number" ? p.amountKobo / 100 : null,
    bankName: p?.bankName ?? "",
    accountNumber: p?.virtualAccountNumber ?? "",
    reference: p?.providerReference ?? `careporium_shift_${shiftId}`,
    checkoutUrl: p?.checkoutUrl ?? "",
    expiresAt: p?.expiresAt ?? null,
  };
}

export function rememberFunding(shiftId: string, payment: any) {
  funding[shiftId] = parseFunding(shiftId, payment);
}
export const cachedFunding = (id: string): FundingDetails | undefined => funding[id];

// Gets the payment details for a shift. Uses what we already have unless `fresh` is set.
// The Swagger shows both /api/payments/v1 and /api/payment/v1. Try the plural first, then the singular.
const BASES = ["/api/payments/v1", "/api/payment/v1"];
const routeMiss = (e: any) => /cannot (post|get|patch|put)|route|endpoint/i.test(String(e?.message ?? ""));

async function postRetry(shiftId: string): Promise<any> {
  let first: any;
  for (const base of BASES) {
    try {
      return await api(`${base}/retry/${shiftId}`, { method: "POST" });
    } catch (e: any) {
      if (!routeMiss(e)) throw e; // a real server answer (e.g. "Shift not found for this facility")
      first = first ?? e;
    }
  }
  throw first;
}

export async function loadFunding(shiftId: string, fresh = false): Promise<FundingDetails> {
  if (!fresh && funding[shiftId]) return funding[shiftId];
  const body: any = await postRetry(shiftId);
  const data = body?.data ?? body;
  funding[shiftId] = parseFunding(shiftId, data?.payment ?? data);
  return funding[shiftId];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function shortDate(dateKey: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!m || Number(m[2]) < 1 || Number(m[2]) > 12) return dateKey;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}

export function getShiftPayments(): ShiftPayment[] {
  return getListedShifts().map((s) => {
    const status: FundingStatus =
      s.kind === "awaiting" ? "awaiting_funding" : s.kind === "completed" ? (s.confirmed ? "paid" : "to_confirm") : "funds_secured";
    // ASSUMPTION: the facility pays payRate x people + a 10% service fee (matches the single-person test). Confirm with the backend.
    const estimate = Math.round(s.pay * s.needed * 1.1);
    return {
      id: s.id,
      code: `CP-${s.id.slice(-5).toUpperCase()}`,
      title: s.title,
      dateLabel: shortDate(s.dateKey),
      workers: s.needed,
      amount: funding[s.id]?.amount ?? estimate,
      status,
      reference: funding[s.id]?.reference ?? `careporium_shift_${s.id}`,
    };
  });
}

export function getShiftPayment(id: string): ShiftPayment | null {
  return getShiftPayments().find((p) => p.id === id) ?? null;
}

export function getSummary() {
  const list = getShiftPayments();
  const total = (st: FundingStatus) => list.filter((p) => p.status === st).reduce((a, p) => a + p.amount, 0);
  const count = (st: FundingStatus) => list.filter((p) => p.status === st).length;
  const aw = count("awaiting_funding");
  const se = count("funds_secured");
  return {
    awaiting: { amount: total("awaiting_funding"), note: `${aw} ${aw === 1 ? "shift needs" : "shifts need"} funding` },
    secured: { amount: total("funds_secured"), note: `${se} upcoming ${se === 1 ? "shift" : "shifts"} covered` },
    paid: { amount: total("paid"), note: "Payments for completed shifts" },
  };
}
