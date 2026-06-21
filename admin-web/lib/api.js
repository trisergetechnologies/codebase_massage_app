const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

async function request(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: { "content-type": "application/json", ...(opts.headers || {}) },
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
  listCategories: () => request("/api/categories"),
  listServices: () => request("/api/services"),
  createService: (body) =>
    request("/api/admin/services", { method: "POST", body: JSON.stringify(body) }),
  updateService: (id, body) =>
    request(`/api/admin/services/${id}`, { method: "PATCH", body: JSON.stringify(body) }),
  deleteService: (id) => request(`/api/admin/services/${id}`, { method: "DELETE" }),
  listExperts: () => request("/api/admin/experts"),
};
