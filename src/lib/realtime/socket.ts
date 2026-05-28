"use client";

import { io, Socket } from "socket.io-client";
import { config } from "@/config";

let socketInstance: Socket | null = null;

/**
 * Returns the singleton Socket.IO client, lazily creating it on first call.
 * Cookies authenticate the handshake (same JWT as REST). The BE rejects the
 * connection if the cookie is missing or expired.
 */
export function getSocket(): Socket {
  if (socketInstance) return socketInstance;
  if (!config.apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not set");
  }
  // Default transport order (polling, then upgrade to websocket) so the cookie
  // rides along on the initial HTTP handshake. Don't pin to websocket-only.
  socketInstance = io(config.apiBaseUrl, {
    withCredentials: true,
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
  });
  return socketInstance;
}

/** Closes the singleton (e.g. on logout) so subsequent connects re-auth. */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
