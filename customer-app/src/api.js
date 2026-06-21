import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./config";

const TOKEN_KEY = "cm_customer_token";

export async function setToken(token) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

async function request(path, opts = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(data?.error || `http_${res.status}`);
  return data;
}

export const api = {
  base: API_BASE,
  requestOtp: (phone) =>
    request("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone, role: "customer" }),
    }),
  verifyOtp: (phone, code, name) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code, role: "customer", name }),
    }),
  me: () => request("/api/me"),
  listServices: () => request("/api/services"),
  listCategories: () => request("/api/categories"),
  createBooking: (serviceIds, location) =>
    request("/api/bookings", {
      method: "POST",
      body: JSON.stringify({ serviceIds, location }),
    }),
  getBooking: (id) => request(`/api/bookings/${id}`),
  listBookings: () => request("/api/bookings"),
  cancelBooking: (id) =>
    request(`/api/bookings/${id}/cancel`, { method: "POST" }),
  addAddOn: (id, serviceId) =>
    request(`/api/bookings/${id}/add-on`, {
      method: "POST",
      body: JSON.stringify({ serviceId }),
    }),
  pay: (id) => request(`/api/bookings/${id}/payment`, { method: "POST" }),
  rate: (id, stars, comment) =>
    request(`/api/bookings/${id}/rate`, {
      method: "POST",
      body: JSON.stringify({ stars, comment }),
    }),
};
