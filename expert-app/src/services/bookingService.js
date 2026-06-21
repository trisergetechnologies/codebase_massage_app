import { request } from "./apiClient";

export const bookingService = {
  /** @param {'today'|'history'} [scope] */
  list: (scope) => {
    const q = scope ? `?scope=${scope}` : "";
    return request(`/api/bookings${q}`);
  },
  get: (id) => request(`/api/bookings/${id}`),
  arrived: (id) => request(`/api/bookings/${id}/arrived`, { method: "POST" }),
  start: (id, otp) =>
    request(`/api/bookings/${id}/start`, {
      method: "POST",
      body: JSON.stringify({ otp }),
    }),
  complete: (id, otp) =>
    request(`/api/bookings/${id}/complete`, {
      method: "POST",
      body: JSON.stringify({ otp }),
    }),
};
