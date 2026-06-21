import { apiRequest } from "./apiClient";

export const catalogService = {
  listServices() {
    return apiRequest("/api/services");
  },

  getService(id) {
    return apiRequest(`/api/services/${encodeURIComponent(id)}`);
  },

  listCategories() {
    return apiRequest("/api/categories");
  },
};
