import { Group } from "./group";

// PK: gameId
export interface Game {
  id: string;
  name: string;
  nPlayers: number;
  gameType: GameType;
  gameMode: GameMode;
  gameSpeed: GameSpeed;
  gameStatus: GameStatus;
  createdAt: number;
  updatedAt: number;
  groupOrder: Group[];
  result?: string[];
}

export enum GameType {
  SINGLE_PLAYER = "SINGLE_PLAYER",
  MULTI_PLAYER = "MULTI_PLAYER",
}

export enum GameMode {
  CLASSIC = "CLASSIC",
  DUEL = "DUEL",
  BATTLE = "BATTLE",
}

export enum GameSpeed {
  RUSH = "RUSH",
  NORMAL = "NORMAL",
}

export enum GameStatus {
  PENDING = "PENDING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}
