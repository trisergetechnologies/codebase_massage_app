import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config";

const ACCESS_KEY = "cm_expert_access_token";
const REFRESH_KEY = "cm_expert_refresh_token";
const LEGACY_TOKEN_KEY = "cm_expert_token";

const PUBLIC_API_PREFIXES = [
  "/api/auth/request-otp",
  "/api/auth/verify-otp",
  "/api/auth/refresh",
  "/api/auth/logout",
];

/** @type {Set<(reason: string) => void>} */
const authFailureListeners = new Set();

/** @type {Promise<boolean>|null} */
let refreshInFlight = null;

/** @type {Set<() => void>} */
const tokenRefreshListeners = new Set();

export function onAuthFailure(listener) {
  authFailureListeners.add(listener);
  return () => authFailureListeners.delete(listener);
}

/** Notify sockets / callers that access token changed after silent refresh. */
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

export async function setTokens(accessToken, refreshToken) {
  if (accessToken) await AsyncStorage.setItem(ACCESS_KEY, accessToken);
  else await AsyncStorage.removeItem(ACCESS_KEY);
  if (refreshToken) await AsyncStorage.setItem(REFRESH_KEY, refreshToken);
  else await AsyncStorage.removeItem(REFRESH_KEY);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
}

/** @deprecated Prefer setTokens — kept for gradual call-site updates */
export async function setToken(t) {
  if (!t) {
    await clearTokensQuiet();
    return;
  }
  await AsyncStorage.setItem(ACCESS_KEY, t);
  await AsyncStorage.removeItem(LEGACY_TOKEN_KEY);
}

export async function getAccessToken() {
  const access = await AsyncStorage.getItem(ACCESS_KEY);
  if (access) return access;
  // Legacy single-token sessions cannot refresh — force re-login.
  const legacy = await AsyncStorage.getItem(LEGACY_TOKEN_KEY);
  if (legacy) {
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

async function clearAuthAndNotify(reason) {
  await clearTokensQuiet();
  notifyAuthFailure(reason);
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
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json);
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
      "ngrok-skip-browser-warning": "true",
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

/**
 * Single-flight refresh. Returns true if a new access token was stored.
 */
async function tryRefreshAccessToken() {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) return false;

    try {
      const { res, data } = await rawFetch(
        "/api/auth/refresh",
        {
          method: "POST",
          body: JSON.stringify({ refreshToken }),
        },
        null
      );
      if (!res.ok || !data?.accessToken || !data?.refreshToken) {
        return false;
      }
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
      await clearAuthAndNotify("invalid_refresh_token");
      throw authError("invalid_refresh_token");
    }
    throw authError("missing_token");
  }

  const payload = readJwtPayload(token);
  if (!payload) {
    await clearAuthAndNotify("invalid_token");
    throw authError("invalid_token");
  }

  if (isAccessTokenExpired(token)) {
    const ok = await tryRefreshAccessToken();
    if (!ok) {
      await clearAuthAndNotify("token_expired");
      throw authError("token_expired");
    }
    return getAccessToken();
  }

  return token;
}

/** Best-effort server revoke + clear local tokens. */
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

/**
 * @template T
 * @param {string} path
 * @param {RequestInit} [opts]
 * @param {{ _retried?: boolean }} [meta]
 * @returns {Promise<T>}
 */
export async function request(path, opts = {}, meta = {}) {
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
      if (ok) {
        return request(path, opts, { _retried: true });
      }
      await clearAuthAndNotify("token_expired");
      throw err;
    }

    if (!publicCall && (data?.error === "invalid_token" || data?.error === "missing_token" || res.status === 403)) {
      await clearAuthAndNotify(data?.error || "invalid_token");
    }

    throw err;
  }

  return data;
}
