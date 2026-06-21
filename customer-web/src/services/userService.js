import { apiRequest } from "./apiClient";

export const userService = {
  updateProfile(body) {
    return apiRequest("/api/me/profile", {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  addAddress(body) {
    return apiRequest("/api/me/addresses", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateAddress(id, body) {
    return apiRequest(`/api/me/addresses/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  deleteAddress(id) {
    return apiRequest(`/api/me/addresses/${id}`, { method: "DELETE" });
  },

  setDefaultAddress(id) {
    return apiRequest(`/api/me/addresses/${id}/default`, { method: "POST" });
  },
};
