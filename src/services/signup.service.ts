// REAL signup. POST /api/auth/v1/register/facility is multipart form-data and needs all three
// documents. It creates the account and emails a 6-digit OTP, which is checked on the verify-otp screen.
// The files are sent by uploadForm (see utils/uploadForm.ts). The server is on Render's free tier and
// sleeps when idle, so we wake it first.

import { uploadForm } from "@/utils/uploadForm";

const BASE_URL = "https://careporium-backend.onrender.com";
const MAX_BYTES = 5 * 1024 * 1024; // the signup screen promises "Maximum file size: 5MB"

export type SignupFile = { uri: string; name?: string; mimeType?: string; type?: string; size?: number; fileSize?: number };

export type FacilitySignup = {
  facilityName: string;
  facilityType: string;
  email: string;
  phoneNumber: string;
  password: string;
  location: string; // "Ikeja, Lagos"; split into address, city, state
  contactName: string;
  contactPosition: string;
  contactEmail: string;
  contactPhone: string;
  businessRegCert: SignupFile;
  facilityLicense: SignupFile;
  taxID: SignupFile;
};

const clean = (s: string) => s.trim();

function splitLocation(raw: string) {
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  const address = raw.trim();
  const city = parts[0] ?? address;
  const state = parts[1] ?? parts[0] ?? address;
  return { address, city, state, country: "Nigeria" };
}

function checkSize(f: SignupFile, label: string) {
  const size = f.size ?? f.fileSize;
  if (typeof size === "number" && size > MAX_BYTES) {
    throw new Error(`${label} is larger than 5MB. Choose a smaller file (a photo or a short PDF).`);
  }
}

function withTimeout(ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { signal: controller.signal, done: () => clearTimeout(timer) };
}

// A cheap request that makes Render start the server, so the real upload doesn't hit a sleeping one.
async function wakeServer() {
  const t = withTimeout(60000);
  try {
    await fetch(BASE_URL, { method: "GET", signal: t.signal });
  } catch {
    // ignore: this is only a nudge
  } finally {
    t.done();
  }
}

export async function registerFacility(d: FacilitySignup): Promise<string> {
  const loc = splitLocation(d.location);
  checkSize(d.businessRegCert, "The business registration certificate");
  checkSize(d.facilityLicense, "The facility licence");
  checkSize(d.taxID, "The tax ID document");

  const texts: Record<string, string> = {
    facilityName: clean(d.facilityName),
    facilityType: d.facilityType,
    email: clean(d.email).toLowerCase(),
    phoneNumber: d.phoneNumber.replace(/\s+/g, ""),
    password: d.password,
    "location.address": loc.address,
    "location.city": loc.city,
    "location.state": loc.state,
    "location.country": loc.country,
    "secondaryContact.fullName": clean(d.contactName),
    "secondaryContact.position": clean(d.contactPosition),
    "secondaryContact.email": clean(d.contactEmail).toLowerCase(),
    "secondaryContact.phoneNumber": d.contactPhone.replace(/\s+/g, ""),
  };

  await wakeServer();
  const body = await uploadForm(
    "/api/auth/v1/register/facility",
    "POST",
    texts,
    [
      { field: "businessRegCert", file: d.businessRegCert, fallbackName: "business-registration.jpg" },
      { field: "facilityLicense", file: d.facilityLicense, fallbackName: "facility-license.jpg" },
      { field: "taxID", file: d.taxID, fallbackName: "tax-id.jpg" },
    ],
    false
  );
  return body?.message ?? "Account created. Check your email for the verification code.";
}