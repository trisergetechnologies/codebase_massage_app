import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "../config";

const TOKEN_KEY = "cm_expert_token";

export async function setToken(t) {
  if (t) await AsyncStorage.setItem(TOKEN_KEY, t);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);

/**
 * @template T
 * @param {string} path
 * @param {RequestInit} [opts]
 * @returns {Promise<T>}
 */
export async function request(path, opts = {}) {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: {
      "content-type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = new Error(data?.error || `http_${res.status}`);
    err.code = data?.error;
    err.status = res.status;
    throw err;
  }
  return data;
}
