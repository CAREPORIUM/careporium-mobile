
export type PaymentStatus =
  | "awaiting_completion"
  | "funds_secured"
  | "processing"
  | "paid";

export type Payment = {
  id: string;
  code: string;
  title: string;
  facility: string;
  location: string;
  dateLabel: string;
  timeLabel: string;
  amount: number;
  deductions: number;
  status: PaymentStatus;
  reference?: string;
  paidOn?: string;
};

export type BankDetails = {
  bank: string;
  accountNumber: string;
  accountName: string;
};

export type PaymentIssue = {
  paymentId: string;
  issue: string;
  message: string;
};

export const STATUS_LABEL: Record<PaymentStatus, string> = {
  awaiting_completion: "Awaiting completion",
  funds_secured: "Funds secured",
  processing: "Processing",
  paid: "Paid",
};

export const PAYMENTS: Payment[] = [
  {
    id: "p1",
    code: "CP-1042",
    title: "Registered nurse · General ward",
    facility: "Mainland Care Hospital",
    location: "Yaba, Lagos",
    dateLabel: "9 Oct 2026",
    timeLabel: "08:00–16:00 WAT",
    amount: 30000,
    deductions: 0,
    status: "awaiting_completion",
  },
  {
    id: "p2",
    code: "CP-1037",
    title: "Registered nurse · Night shift",
    facility: "Lagoon Clinic",
    location: "Lagos",
    dateLabel: "7 Oct 2026",
    timeLabel: "20:00–06:00 WAT",
    amount: 30000,
    deductions: 0,
    status: "processing",
    reference: "CP-PAY-1037",
  },
  {
    id: "p3",
    code: "CP-1026",
    title: "Registered nurse · Day shift",
    facility: "Yaba Medical Centre",
    location: "Yaba, Lagos",
    dateLabel: "4 Oct 2026",
    timeLabel: "08:00–16:00 WAT",
    amount: 30000,
    deductions: 0,
    status: "paid",
    reference: "CP-PAY-1026",
    paidOn: "5 Oct 2026",
  },
  {
    id: "p4",
    code: "CP-1045",
    title: "Registered nurse · General ward",
    facility: "Mainland Care Hospital",
    location: "Yaba, Lagos",
    dateLabel: "10 Oct 2026",
    timeLabel: "08:00–16:00 WAT",
    amount: 30000,
    deductions: 0,
    status: "funds_secured",
  },
];

export const PAYOUT = {
  name: "Amara Okafor",
  bank: "GTBank",
  last4: "4821",
};

export const SUMMARY = {
  pending: {
    amount: 60000,
    note: "2 shifts awaiting payment",
  },
  processing: {
    amount: 30000,
    note: "On its way to your bank",
  },
  received: {
    amount: 120000,
    note: "4 payments received",
  },
};

// Return all mock payment records.
export function getPayments(): Payment[] {
  return PAYMENTS;
}

// Find one payment by its ID.
export function getPayment(
  id?: string
): Payment | undefined {
  if (!id) return undefined;

  return PAYMENTS.find((payment) => payment.id === id);
}

// Simulate saving bank details.
// No real bank information is sent to a server.
export async function saveBankDetails(
  details: BankDetails
): Promise<void> {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, 600)
  );

  console.log("Mock bank details saved:", {
    bank: details.bank,
    accountNumber: `ending ${details.accountNumber.slice(-4)}`,
    accountName: details.accountName,
  });
}

// Simulate submitting a payment issue.
// No API request or permanent storage is used.
export async function submitPaymentIssue(
  issue: PaymentIssue
): Promise<void> {
  await new Promise<void>((resolve) =>
    setTimeout(resolve, 600)
  );

  console.log("Mock payment issue submitted:", issue);
}
