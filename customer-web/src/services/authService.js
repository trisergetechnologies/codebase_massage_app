import { apiRequest, normalizePhone } from "./apiClient";

export const authService = {
  requestOtp(phone) {
    return apiRequest("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone: normalizePhone(phone), role: "customer" }),
    });
  },

  verifyOtp(phone, code) {
    return apiRequest("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({
        phone: normalizePhone(phone),
        code,
        role: "customer",
      }),
    });
  },

  completeProfile({ registrationToken, name, gender, dateOfBirth }) {
    return apiRequest("/api/auth/complete-profile", {
      method: "POST",
      token: registrationToken,
      body: JSON.stringify({ name, gender, dateOfBirth }),
    });
  },

  me() {
    return apiRequest("/api/me");
  },
};
