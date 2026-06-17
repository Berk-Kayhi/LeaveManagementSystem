import { io } from "socket.io-client";

const API_DOMAIN = import.meta.env.VITE_API_DOMAIN;
const SOCKET_PORT = import.meta.env.VITE_SOCKET_SERVICE_PORT;
const SOCKET_BASE_URL = API_DOMAIN
  ? `${API_DOMAIN}${SOCKET_PORT ? `:${SOCKET_PORT}` : ""}`
  : undefined;

export const socket = io(SOCKET_BASE_URL, {
  autoConnect: false,
  withCredentials: true,
});
