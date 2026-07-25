import { io } from "socket.io-client";
import { getToken, onAccessTokenRefreshed } from "./services/apiClient";

let socket = null;
let unsubTokenRefresh = null;

function ensureTokenRefreshHook() {
  if (unsubTokenRefresh) return;
  unsubTokenRefresh = onAccessTokenRefreshed(() => {
    if (!socket) return;
    const token = getToken();
    if (!token) return;
    socket.auth = { token };
    if (socket.connected) socket.disconnect().connect();
  });
}

export function getSocket() {
  ensureTokenRefreshHook();

  if (socket?.connected) {
    const token = getToken();
    if (token) socket.auth = { token };
    return Promise.resolve(socket);
  }

  const token = getToken();
  if (!token) return Promise.reject(new Error("missing_token"));

  if (socket) {
    socket.disconnect();
    socket = null;
  }

  const url = import.meta.env.VITE_SOCKET_URL || undefined;

  socket = io(url, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  return new Promise((resolve, reject) => {
    const onConnect = () => {
      cleanup();
      resolve(socket);
    };
    const onError = (err) => {
      cleanup();
      reject(err);
    };
    function cleanup() {
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    }
    socket.on("connect", onConnect);
    socket.on("connect_error", onError);
    if (socket.connected) onConnect();
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
