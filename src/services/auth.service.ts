import { api, saveToken, saveUser, clearToken } from "@/services/api";

export type UserRole = "worker" | "facility" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
};

type LoginResponse = { user: AuthUser; token: string };
type MessageResponse = { success: boolean; message: string; data?: string };

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await api<LoginResponse>("/api/auth/v1/login", {
    method: "POST",
    body: { email: email.trim().toLowerCase(), password },
    auth: false,
  });
  await saveToken(res.token);
  await saveUser(res.user);
  return res.user;
}

export async function logout() {
  try {
    await api("/api/auth/v1/logout", { method: "POST" });
  } catch {
    // even if the server call fails, clear the session on the phone
  }
  await clearToken();
}

export function verifyAccount(email: string, otp: string) {
  return api<MessageResponse>("/api/auth/v1/verify-account", {
    method: "POST",
    body: { email: email.trim().toLowerCase(), otp },
    auth: false,
  });
}

export function resendOtp(email: string) {
  return api<MessageResponse>("/api/auth/v1/resend-otp", {
    method: "POST",
    body: { email: email.trim().toLowerCase() },
    auth: false,
  });
}

export function forgotPassword(email: string) {
  return api<MessageResponse>("/api/auth/v1/forgot-password", {
    method: "POST",
    body: { email: email.trim().toLowerCase() },
    auth: false,
  });
}

export function resetPassword(email: string, otp: string, newPassword: string) {
  return api<MessageResponse>("/api/auth/v1/reset-password", {
    method: "POST",
    body: { email: email.trim().toLowerCase(), otp, newPassword },
    auth: false,
  });
}