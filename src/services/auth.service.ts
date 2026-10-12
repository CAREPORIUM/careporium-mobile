import { api, saveToken, saveUser, clearToken } from "@/services/api";

export type UserRole = "worker" | "facility" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
};

type MessageResponse = { success?: boolean; message: string; data?: any };

const clean = (email: string) => email.trim().toLowerCase();

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await api<any>("/api/auth/v1/login", {
    method: "POST",
    body: { email: clean(email), password },
    auth: false,
  });
  const payload = res.data ?? res; // backend wraps the result in { message, data }
  await saveToken(payload.token);
  await saveUser(payload.user);
  return payload.user as AuthUser;
}

export async function logout() {
  try {
    await api("/api/auth/v1/logout", { method: "POST" });
  } catch {
    // even if the server call fails, clear the session on the phone
  }
  await clearToken();
}

// ---------- Worker registration (JSON, no files) ----------
export type WorkerSignup = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  profession: string;
  specialty: string;
  yearsOfExperience: number;
  location?: { address?: string; street?: string; state?: string; country?: string };
};

export function registerWorker(data: WorkerSignup) {
  return api<MessageResponse>("/api/auth/v1/register/worker", {
    method: "POST",
    body: { ...data, email: clean(data.email) },
    auth: false,
  });
}

// ---------- Facility registration (multipart, 3 required files) ----------
export type PickedFile = { uri: string; name: string; type: string };

export type FacilitySignup = {
  facilityName: string;
  facilityType: string;
  email: string;
  phoneNumber: string;
  password: string;
  location: { address: string; city: string; state: string; country: string };
  secondaryContact: { fullName: string; position: string; email: string; phoneNumber: string };
};

export type FacilityFiles = {
  businessRegCert: PickedFile;
  facilityLicense: PickedFile;
  taxID: PickedFile;
};

export function registerFacility(data: FacilitySignup, files: FacilityFiles) {
  const form = new FormData();

  const add = (key: string, value?: string) => {
    if (value !== undefined && value !== "") form.append(key, value);
  };

  add("facilityName", data.facilityName);
  add("facilityType", data.facilityType);
  add("email", clean(data.email));
  add("phoneNumber", data.phoneNumber);
  add("password", data.password);
  add("location.address", data.location.address);
  add("location.city", data.location.city);
  add("location.state", data.location.state);
  add("location.country", data.location.country);
  add("secondaryContact.fullName", data.secondaryContact.fullName);
  add("secondaryContact.position", data.secondaryContact.position);
  add("secondaryContact.email", data.secondaryContact.email);
  add("secondaryContact.phoneNumber", data.secondaryContact.phoneNumber);

  form.append("businessRegCert", files.businessRegCert as any);
  form.append("facilityLicense", files.facilityLicense as any);
  form.append("taxID", files.taxID as any);

  return api<MessageResponse>("/api/auth/v1/register/facility", {
    method: "POST",
    body: form,
    auth: false,
  });
}

// ---------- OTP and password reset ----------
export function verifyAccount(email: string, otp: string) {
  return api<MessageResponse>("/api/auth/v1/verify-account", {
    method: "POST",
    body: { email: clean(email), otp },
    auth: false,
  });
}

export function resendOtp(email: string) {
  return api<MessageResponse>("/api/auth/v1/resend-otp", {
    method: "POST",
    body: { email: clean(email) },
    auth: false,
  });
}

export function forgotPassword(email: string) {
  return api<MessageResponse>("/api/auth/v1/forgot-password", {
    method: "POST",
    body: { email: clean(email) },
    auth: false,
  });
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return api<MessageResponse>("/api/auth/v1/reset-password", {
    method: "POST",
    body: { email: clean(email), otp, newPassword },
    auth: false,
  });
}