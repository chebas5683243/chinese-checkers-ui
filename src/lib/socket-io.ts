import { SOCKET_URL } from "@/config/env";
import { Game } from "@/models/game";
import { Turn } from "@/models/turn";

import { io, type Socket } from "socket.io-client";

export interface GameConnection {
  socketId: string;
  userId: string;
}

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
  playerJoined: (connection: GameConnection) => void;
  gameStarting: () => void;
  gameStarted: (game: Game) => void;
  opponentMove: (turn: Turn, boardHash: string) => void;
  playerLeft: (connection: GameConnection) => void;
}

interface EmitEvents {
  joinGame: (
    roomId: string,
    ack: Acknowledgement<{ game: Game; connections: GameConnection[] }>,
  ) => Promise<void>;
  leaveGame: (roomId: string) => Promise<void>;
  startGame: (
    roomId: string,
    ack: Acknowledgement<{ game: Game }>,
  ) => Promise<void>;
  sendMove: (roomId: string, boardHash: string) => Promise<void>;
}

type SocketClient = Socket<ListenEvents, EmitEvents>;

export const socket: SocketClient = io(SOCKET_URL, {
  withCredentials: true,
});
