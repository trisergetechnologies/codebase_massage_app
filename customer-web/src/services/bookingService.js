import { apiRequest } from "./apiClient";

export const bookingService = {
  list() {
    return apiRequest("/api/bookings");
  },

  get(id) {
    return apiRequest(`/api/bookings/${id}`);
  },

  create(serviceIds, location) {
    return apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ serviceIds, location }),
    });
  },

  cancel(id) {
    return apiRequest(`/api/bookings/${id}/cancel`, { method: "POST" });
  },

  pay(id) {
    return apiRequest(`/api/bookings/${id}/payment`, { method: "POST" });
  },
};
