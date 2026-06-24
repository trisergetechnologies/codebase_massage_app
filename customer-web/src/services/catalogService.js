import { apiRequest } from "./apiClient";

export const catalogService = {
  listServices() {
    return apiRequest("/api/services");
  },

  getService(id) {
    return apiRequest(`/api/services/${encodeURIComponent(id)}`);
  },

  getReviews(id) {
    return apiRequest(`/api/services/${encodeURIComponent(id)}/reviews`);
  },

  listCategories() {
    return apiRequest("/api/categories");
  },
};
