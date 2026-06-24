import { request } from "./apiClient";

export const expertService = {
  me: () => request("/api/expert/me"),
  updateProfile: (body) =>
    request("/api/expert/me", { method: "PATCH", body: JSON.stringify(body) }),
  updatePushToken: (pushToken) =>
    request("/api/me/push-token", { method: "POST", body: JSON.stringify({ pushToken }) }),
  submitKyc: (note) =>
    request("/api/expert/kyc", { method: "POST", body: JSON.stringify({ note }) }),
  updateTraining: (status) =>
    request("/api/expert/training", { method: "POST", body: JSON.stringify({ status }) }),
  dashboard: () => request("/api/expert/dashboard"),
  pendingOffer: () => request("/api/expert/pending-offer"),
  respondOffer: (bookingId, accepted) =>
    request("/api/expert/offer/respond", {
      method: "POST",
      body: JSON.stringify({ bookingId, accepted }),
    }),
  goOnline: (lat, lng) =>
    request("/api/expert/online", {
      method: "POST",
      body: JSON.stringify({ lat, lng }),
    }),
  goOffline: () => request("/api/expert/offline", { method: "POST" }),
};
