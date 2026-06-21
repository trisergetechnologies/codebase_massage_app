import { io } from "socket.io-client";
import { getToken } from "./services/apiClient";

let socket = null;

export function getSocket() {
  if (socket?.connected) return Promise.resolve(socket);

  const token = getToken();
  if (!token) return Promise.reject(new Error("missing_token"));

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
