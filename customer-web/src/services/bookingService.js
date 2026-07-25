import { apiRequest } from "./apiClient";

export const bookingService = {
  list() {
    return apiRequest("/api/bookings");
  },

  get(id) {
    return apiRequest(`/api/bookings/${id}`);
  },

  create(serviceIds, location, options = {}) {
    return apiRequest("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        serviceIds,
        location,
        scheduledFor: options.scheduledFor || null,
        couponCode: options.couponCode || "",
      }),
    });
  },

  cancel(id) {
    return apiRequest(`/api/bookings/${id}/cancel`, { method: "POST" });
  },

  addOn(id, serviceId) {
    return apiRequest(`/api/bookings/${id}/add-on`, {
      method: "POST",
      body: JSON.stringify({ serviceId }),
    });
  },

  pay(id) {
    return apiRequest(`/api/bookings/${id}/payment`, { method: "POST" });
  },

  rate(id, stars, comment = "") {
    return apiRequest(`/api/bookings/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ stars, comment }),
    });
  },
};

export const couponService = {
  validate(code) {
    return apiRequest("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    });
  },
};

export const surgeService = {
  getMultiplier(lat, lng) {
    return apiRequest(`/api/surge?lat=${lat}&lng=${lng}`);
  },
};
