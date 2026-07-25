import { API_BASE, TOKEN_KEY, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../config";

const PUBLIC_API_PREFIXES = [
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/auth/complete-profile",
  "/api/auth/refresh",
  "/api/auth/logout",
  "/api/services",
  "/api/categories",
  "/api/coupons/validate",
  "/api/surge",
];

/** @type {Promise<boolean>|null} */
let refreshInFlight = null;

/** @type {Set<(reason: string) => void>} */
const authFailureListeners = new Set();

/** @type {Set<() => void>} */
const tokenRefreshListeners = new Set();

export function onAuthFailure(listener) {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

export function onAccessTokenRefreshed(listener) {
  tokenRefreshListeners.add(listener);
  return () => tokenRefreshListeners.delete(listener);
}

function notifyAuthFailure(reason) {
  for (const listener of authFailureListeners) {
    try {
      listener(reason);
    } catch {
      /* ignore */
    }
  }
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

export function getAccessToken() {
  const access = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (access) return access;
  const legacy = localStorage.getItem(TOKEN_KEY);
  if (legacy) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
  return null;
}

export const getToken = getAccessToken;

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
  if (accessToken) localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  else localStorage.removeItem(ACCESS_TOKEN_KEY);
  if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  else localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

/** @deprecated Prefer setTokens(access, refresh) */
export function setToken(token) {
  if (!token) {
    clearTokensQuiet();
    return;
  }
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.removeItem(TOKEN_KEY);
}

function clearTokensQuiet() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY);
}

function clearAuthAndNotify(reason) {
  clearTokensQuiet();
  notifyAuthFailure(reason);
}

export function normalizePhone(input) {
  const digits = String(input || "").replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return String(input || "").trim();
}

function isPublicPath(path) {
  return PUBLIC_API_PREFIXES.some((prefix) => path.startsWith(prefix));
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

function authError(code, status = 401) {
  const err = new Error(code);
  err.code = code;
  err.status = status;
  return err;
}

async function rawFetch(path, options = {}, accessToken = null) {
  const headers = {
    "content-type": "application/json",
    ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body,
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
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const { res, data } = await rawFetch(
        "/api/auth/refresh",
        { method: "POST", body: JSON.stringify({ refreshToken }) },
        null
      );
      if (!res.ok || !data?.accessToken || !data?.refreshToken) return false;
      setTokens(data.accessToken, data.refreshToken);
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
  const token = getAccessToken();
  if (!token) {
    const refresh = getRefreshToken();
    if (refresh) {
      const ok = await tryRefreshAccessToken();
      if (ok) return getAccessToken();
      clearAuthAndNotify("invalid_refresh_token");
      throw authError("invalid_refresh_token");
    }
    throw authError("missing_token");
  }

  if (!readJwtPayload(token)) {
    clearAuthAndNotify("invalid_token");
    throw authError("invalid_token");
  }

  if (isAccessTokenExpired(token)) {
    const ok = await tryRefreshAccessToken();
    if (!ok) {
      clearAuthAndNotify("token_expired");
      throw authError("token_expired");
    }
    return getAccessToken();
  }

  return token;
}

export async function logoutRemote() {
  const refreshToken = getRefreshToken();
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
  clearTokensQuiet();
}

/**
 * @param {string} path
 * @param {RequestInit & { token?: string|null, _retried?: boolean }} [options]
 */
export async function apiRequest(path, options = {}) {
  const { token: tokenOverride, _retried, ...fetchOpts } = options;
  const publicCall = isPublicPath(path) || tokenOverride !== undefined;

  let token = null;
  if (tokenOverride !== undefined) {
    token = tokenOverride;
  } else if (!publicCall) {
    token = await resolveAccessToken();
  }

  const { res, data } = await rawFetch(path, fetchOpts, token);

  if (!res.ok) {
    const err = new Error(data?.error || data?.message || `http_${res.status}`);
    err.status = res.status;
    err.code = data?.error;
    err.data = data;

    if (
      !publicCall &&
      tokenOverride === undefined &&
      res.status === 401 &&
      data?.error === "token_expired" &&
      !_retried
    ) {
      const ok = await tryRefreshAccessToken();
      if (ok) return apiRequest(path, { ...options, _retried: true });
      clearAuthAndNotify("token_expired");
      throw err;
    }

    if (
      !publicCall &&
      tokenOverride === undefined &&
      (data?.error === "invalid_token" || data?.error === "missing_token" || res.status === 403)
    ) {
      clearAuthAndNotify(data?.error || "invalid_token");
    }

    throw err;
  }

  return data;
}
