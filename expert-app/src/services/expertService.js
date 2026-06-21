import { request } from "./apiClient";

export const expertService = {
  me: () => request("/api/expert/me"),
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
