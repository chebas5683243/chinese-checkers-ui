import { SOCKET_URL } from "@/config/env";
import { USER_ID_COOKIE } from "@/constants/user";

import { io, type Socket } from "socket.io-client";

interface AcknowledgementSuccessPayload<Data = any> {
  status: "success";
  data?: Data;
}

interface AcknowledgementErrorPayload {
  status: "error";
  error: string;
}

export type Acknowledgement<AckData = any> = (
  payload: AcknowledgementSuccessPayload<AckData> | AcknowledgementErrorPayload,
) => void;

interface ListenEvents {
  playerJoined: (payload: { userId: string }) => void;
  gameStarting: () => void;
  gameStarted: () => void;
  opponentMove: (payload: { boardHash: string }) => void;
  playerLeft: (payload: { userId: string }) => void;
}

interface EmitEvents {
  joinGame: (roomId: string, ack: Acknowledgement) => Promise<void>;
  leaveGame: (roomId: string) => Promise<void>;
  startGame: (roomId: string) => Promise<void>;
  sendMove: (roomId: string, boardHash: string) => Promise<void>;
}

type SocketClient = Socket<ListenEvents, EmitEvents>;

export const socket: SocketClient = io(SOCKET_URL, {
  auth: (cb) => {
    cb({ userId: getCookie(USER_ID_COOKIE) });
  },
  withCredentials: true,
});

function getCookie(name: string) {
  if (typeof window === "undefined" || !window.document.cookie) {
    return null;
  }

  const cookies: Record<string, string> = window.document.cookie
    .split("; ")
    .map((cookie) => cookie.split("="))
    .reduce(
      (acc, [key, value]) => ({ ...acc, [key]: decodeURIComponent(value) }),
      {},
    );

  return cookies[name] || null;
}
