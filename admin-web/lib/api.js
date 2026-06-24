const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const TOKEN_KEY = "admin_token";

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, opts = {}) {
  const token = opts.token ?? getAdminToken();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${text}`);
  }
  return res.json();
}

export const api = {
  base: BASE,
  login: (password) =>
    request("/api/admin/login", { method: "POST", body: JSON.stringify({ password }), token: null }),
  listCategories: () => request("/api/categories"),
  listServices: () => request("/api/services"),
  createService: (body) =>
    request("/api/admin/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id, body) =>
    request(`/api/admin/services/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteService: (id) => request(`/api/admin/services/${id}`, { method: "DELETE" }),
  listExperts: () => request("/api/admin/experts"),
  listBookings: (status) =>
    request(`/api/admin/bookings${status ? `?status=${status}` : ""}`),
  listReviews: () => request("/api/admin/reviews"),
};
