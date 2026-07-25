/** API base — Vite proxies /api to backend in dev */
export const API_BASE = import.meta.env.VITE_API_BASE || "";

/** @deprecated legacy single-token key — cleared on migrate */
export const TOKEN_KEY = "cm_web_token";
export const ACCESS_TOKEN_KEY = "cm_web_access_token";
export const REFRESH_TOKEN_KEY = "cm_web_refresh_token";
