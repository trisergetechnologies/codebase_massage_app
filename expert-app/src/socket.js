import { io } from "socket.io-client";
import { API_BASE } from "./config";
import { getToken, onAccessTokenRefreshed } from "./services/apiClient";

let socket = null;
let offerHandler = null;
let unsubTokenRefresh = null;

export function onDispatchOffer(handler) {
  offerHandler = handler;
  if (socket) {
    socket.off("dispatch:offer");
    if (handler) socket.on("dispatch:offer", handler);
  }
}

function ensureTokenRefreshHook() {
  if (unsubTokenRefresh) return;
  unsubTokenRefresh = onAccessTokenRefreshed(async () => {
    if (!socket) return;
    const token = await getToken();
    if (!token) return;
    socket.auth = { token };
    if (socket.connected) {
      socket.disconnect().connect();
    }
  });
}

export async function getSocket() {
  const token = await getToken();
  if (!token) throw new Error("missing_token");

  ensureTokenRefreshHook();

  if (socket?.connected) {
    socket.auth = { token };
    return socket;
  }

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(API_BASE, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    extraHeaders: { "ngrok-skip-browser-warning": "true" },
  });

  if (offerHandler) {
    socket.on("dispatch:offer", offerHandler);
  }

  if (!socket.connected) {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error("socket_connect_timeout")), 12000);
      socket.once("connect", () => {
        clearTimeout(timer);
        resolve();
      });
      socket.once("connect_error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.off("dispatch:offer");
    socket.disconnect();
  }
  socket = null;
}
