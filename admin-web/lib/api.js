const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";
const ACCESS_KEY = "admin_access_token";
const REFRESH_KEY = "admin_refresh_token";
const LEGACY_TOKEN_KEY = "admin_token";

const PUBLIC_PATHS = ["/api/admin/login", "/api/auth/refresh", "/api/auth/logout"];

/** @type {Promise<boolean>|null} */
let refreshInFlight = null;

export function getAdminToken() {
  if (typeof window === "undefined") return null;
  const access = localStorage.getItem(ACCESS_KEY);
  if (access) return access;
  const legacy = localStorage.getItem(LEGACY_TOKEN_KEY);
  if (legacy) {
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }
  return null;
}

export function getAdminRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setAdminTokens(accessToken, refreshToken) {
  if (typeof window === "undefined") return;
  if (accessToken) localStorage.setItem(ACCESS_KEY, accessToken);
  else localStorage.removeItem(ACCESS_KEY);
  if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

/** @deprecated Prefer setAdminTokens */
export function setAdminToken(token) {
  if (typeof window === "undefined") return;
  if (!token) {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    return;
  }
  localStorage.setItem(ACCESS_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

function isPublicPath(path) {
  return PUBLIC_PATHS.some((p) => path.startsWith(p));
}

function readJwtPayload(token) {
  try {
    const part = String(token).split(".")[1];
    if (!part) return null;
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token, skewMs = 30_000) {
  const payload = readJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 <= Date.now() + skewMs;
}

async function rawFetch(path, opts = {}, accessToken = null) {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...(opts.headers || {}),
    },
    cache: "no-store",
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { error: text } : null;
  }
  return { res, data, text };
}

async function tryRefreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = getAdminRefreshToken();
    if (!refreshToken) return false;
    try {
      const { res, data } = await rawFetch(
        "/api/auth/refresh",
        { method: "POST", body: JSON.stringify({ refreshToken }) },
        null
      );
      if (!res.ok || !data?.accessToken || !data?.refreshToken) return false;
      setAdminTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      return false;
    }
  })();

  try {
    return await refreshInFlight;
  } finally {
    refreshInFlight = null;
  }
}

async function resolveAccessToken() {
  const token = getAdminToken();
  if (!token) {
    const refresh = getAdminRefreshToken();
    if (refresh) {
      const ok = await tryRefreshAccessToken();
      if (ok) return getAdminToken();
      setAdminToken(null);
      throw new Error("invalid_refresh_token");
    }
    throw new Error("missing_token");
  }

  if (isAccessTokenExpired(token)) {
    const ok = await tryRefreshAccessToken();
    if (!ok) {
      setAdminToken(null);
      throw new Error("token_expired");
    }
    return getAdminToken();
  }

  return token;
}

export async function logoutAdmin() {
  const refreshToken = getAdminRefreshToken();
  try {
    if (refreshToken) {
      await rawFetch(
        "/api/auth/logout",
        { method: "POST", body: JSON.stringify({ refreshToken }) },
        null
      );
    }
  } catch {
    /* ignore */
  }
  setAdminToken(null);
}

async function request(path, opts = {}, meta = {}) {
  const publicCall = isPublicPath(path) || opts.token === null;
  let token = null;
  if (!publicCall) {
    token = opts.token !== undefined ? opts.token : await resolveAccessToken();
  }

  const { token: _ignored, ...fetchOpts } = opts;
  const { res, data, text } = await rawFetch(path, fetchOpts, token);

  if (!res.ok) {
    if (!publicCall && res.status === 401 && data?.error === "token_expired" && !meta._retried) {
      const ok = await tryRefreshAccessToken();
      if (ok) return request(path, opts, { _retried: true });
      setAdminToken(null);
      if (typeof window !== "undefined") window.location.href = "/login";
    }

    if (!publicCall && (data?.error === "invalid_token" || res.status === 403)) {
      setAdminToken(null);
      if (typeof window !== "undefined") window.location.href = "/login";
    }

    throw new Error(`${res.status} ${text || data?.error || ""}`);
  }

  return data;
}

export const api = {
  base: BASE,
  login: (password) =>
    request("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
      token: null,
    }),
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
