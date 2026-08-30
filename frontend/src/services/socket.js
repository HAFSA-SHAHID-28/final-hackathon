import { io } from "socket.io-client";
import { getToken } from "../utils/auth";

const backendUrl =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

const socketUrl = backendUrl.replace(/\/?api\/?$/, "");

export const connectSocket = () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  return io(socketUrl, {
    auth: {
      token,
    },
    transports: ["polling", "websocket"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
  });
};