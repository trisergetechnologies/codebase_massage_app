import { request } from "./apiClient";

export const earningsService = {
  /** @param {'today'|'week'|'month'} period */
  get: (period) => request(`/api/expert/earnings?period=${period}`),
};
