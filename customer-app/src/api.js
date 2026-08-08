import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./config";

const ACCESS_KEY = "cm_customer_access_token";
const REFRESH_KEY = "cm_customer_refresh_token";
const LEGACY_TOKEN_KEY = "cm_customer_token";

const PUBLIC_API_PREFIXES = [
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/auth/complete-profile",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/services",
  "/api/categories",
  "/api/coupons/validate",
];

const SESSION_KILL_ERRORS = new Set([
  "invalid_token",
  "missing_token",
  "wrong_role",
  "invalid_refresh_token",
]);

/** @type {Promise<boolean>|null} */
let refreshInFlight = null;

/** @type {Set<() => void>} */
const tokenRefreshListeners = new Set();

export function onAccessTokenRefreshed(listener) {
  tokenRefreshListeners.add(listener);
  return () => tokenRefreshListeners.delete(listener);
}

function notifyAccessTokenRefreshed() {
  for (const listener of tokenRefreshListeners) {
    try {
      listener();
    } catch {
      /* ignore */
    }
  }
}

export async function setTokens(accessToken, refreshToken) {
  if (accessToken) await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  else await AsyncStorage.removeItem(ACCESS_KEY);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
  else await AsyncStorage.removeItem(REFRESH_KEY);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
}

/** @deprecated Prefer setTokens */
export async function setToken(token) {
  if (!token) {
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, LEGACY_TOKEN_KEY]);
    return;
  }
  await AsyncStorage.setItem(ACCESS_KEY, token);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
}

export async function getAccessToken() {
  const access = await AsyncStorage.getItem(ACCESS_KEY);
  if (access) return access;
  const legacy = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);
  if (legacy) {
    // Legacy single-token sessions cannot refresh — force re-login.
    await AsyncStorage.multiRemove([LEGACY_TOKEN_KEY, ACCESS_KEY, REFRESH_KEY]);
  }
  return null;
}

export const getToken = getAccessToken;

export async function getRefreshToken() {
  return AsyncStorage.getItem(REFRESH_KEY);
}

async function clearTokensQuiet() {
  await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY, LEGACY_TOKEN_KEY]);
}

/** Clear only if the failing request's bearer token is still the stored one. */
async function clearAuthIfCurrent(requestAccessToken = null) {
  if (requestAccessToken) {
    const current = await getAccessToken();
    if (current && current !== requestAccessToken) return;
  }
  await clearTokensQuiet();
}

function isPublicPath(path) {
  return PUBLIC_API_PREFIXES.some((prefix) => path.startsWith(prefix));
}

function base64UrlToUtf8(part) {
  const normalized = String(part).replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  if (typeof globalThis.atob === "function") {
    const binary = globalThis.atob(padded);
    if (typeof TextDecoder === "function") {
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      return new TextDecoder("utf-8").decode(bytes);
    }
    return binary;
  }
  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8");
  }
  throw new Error("no_base64_decoder");
}

function readJwtPayload(token) {
  try {
    const part = String(token).split(".")[1];
    if (!part) return null;
    return JSON.parse(base64UrlToUtf8(part));
  } catch {
    return null;
  }
}

function isAccessTokenExpired(token, skewMs = 30_000) {
  const payload = readJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") return false;
  return payload.exp * 1000 <= Date.now() + skewMs;
}

function authError(code, status = 401) {
  const err = new Error(code);
  err.code = code;
  err.status = status;
  return err;
}

async function rawFetch(path, opts = {}, accessToken = null) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: "invalid_json" };
  }
  return { res, data };
}

async function tryRefreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;
    try {
      const { res, data } = await rawFetch(
        "/api/auth/refresh",
        { method: "POST", body: JSON.stringify({ refreshToken }) },
        null
      );
      if (!res.ok || !data?.accessToken || !data?.refreshToken) return false;
      await setTokens(data.accessToken, data.refreshToken);
      notifyAccessTokenRefreshed();
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
  const token = await getAccessToken();
  if (!token) {
    const refresh = await getRefreshToken();
    if (refresh) {
      const ok = await tryRefreshAccessToken();
      if (ok) return getAccessToken();
      await clearTokensQuiet();
      throw authError("invalid_refresh_token");
    }
    throw authError("missing_token");
  }

  if (!readJwtPayload(token)) {
    await clearAuthIfCurrent(token);
    throw authError("invalid_token");
  }

  if (isAccessTokenExpired(token)) {
    const ok = await tryRefreshAccessToken();
    if (!ok) {
      await clearAuthIfCurrent(token);
      throw authError("token_expired");
    }
    return getAccessToken();
  }

  return token;
}

export async function logoutRemote() {
  const refreshToken = await getRefreshToken();
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
  await clearTokensQuiet();
}

async function request(path, opts = {}, meta = {}) {
  const publicCall = isPublicPath(path);
  let token = null;
  if (!publicCall) {
    token = await resolveAccessToken();
  }

  const { res, data } = await rawFetch(path, opts, token);
  if (!res.ok) {
    const code = data?.error || `http_${res.status}`;
    const err = new Error(code);
    err.code = data?.error;
    err.status = res.status;

    if (!publicCall && res.status === 401 && data?.error === "token_expired" && !meta._retried) {
      const ok = await tryRefreshAccessToken();
      if (ok) return request(path, opts, { _retried: true });
      await clearAuthIfCurrent(token);
      throw err;
    }

    if (!publicCall && (SESSION_KILL_ERRORS.has(data?.error) || res.status === 401)) {
      await clearAuthIfCurrent(token);
    }

    throw err;
  }
  return data;
}

export const api = {
  base: API_BASE,
  requestOtp: (phone) =>
    request("/api/auth/request-otp", {
      method: "POST",
      body: JSON.stringify({ phone, role: "customer" }),
    }),
  verifyOtp: (phone, code) =>
    request("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ phone, code, role: "customer" }),
    }),
  completeProfile: (registrationToken, { name, gender, dateOfBirth }) =>
    request("/api/auth/complete-profile", {
      method: "POST",
      headers: { authorization: `Bearer ${registrationToken}` },
      body: JSON.stringify({ name, gender, dateOfBirth }),
    }),
  me: () => request("/api/me"),
  listServices: () => request("/api/services"),
  listCategories: () => request("/api/categories"),
  createBooking: (serviceIds, location, options = {}) =>
    request("/api/bookings", {
      method: "POST",
      body: JSON.stringify({
        serviceIds,
        location,
        couponCode: options.couponCode || "",
        scheduledFor: options.scheduledFor || null,
      }),
    }),
  validateCoupon: (code) =>
    request("/api/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  getBooking: (id) => request(`/api/bookings/${id}`),
  listBookings: () => request("/api/bookings"),
  cancelBooking: (id) => request(`/api/bookings/${id}/cancel`, { method: "POST" }),
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
