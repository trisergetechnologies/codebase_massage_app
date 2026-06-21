import { request } from "./apiClient";

/** @typedef {{ token: string, role: string, principal: object }} AuthResponse */

export const authService = {
  requestOtp: (phone) =>
    request("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone, role: "expert" }),
    }),

  verifyOtp: (phone, code, name) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code, role: "expert", name }),
    }),
};
