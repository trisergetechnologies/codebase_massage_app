import { io } from "socket.io-client";
import { API_BASE } from "./config";
import { getToken, onAccessTokenRefreshed } from "./api";

let socket = null;
let unsubTokenRefresh = null;

function ensureTokenRefreshHook() {
  if (unsubTokenRefresh) return;
  unsubTokenRefresh = onAccessTokenRefreshed(async () => {
    if (!socket) return;
    const token = await getToken();
    if (!token) return;
    socket.auth = { token };
    if (socket.connected) socket.disconnect().connect();
  });
}

export async function getSocket() {
  ensureTokenRefreshHook();
  const token = await getToken();
  if (!token) throw new Error("missing_token");

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
    transports: ["websocket"],
    autoConnect: true,
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) socket.disconnect();
  socket = null;
}
