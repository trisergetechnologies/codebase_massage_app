import { io } from "socket.io-client";
import { API_BASE } from "./config";
import { getToken } from "./api";

let socket = null;

export async function getSocket() {
  if (socket && socket.connected) return socket;
  const token = await getToken();
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
