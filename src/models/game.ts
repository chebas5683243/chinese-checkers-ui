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
  players: string[];
  winner?: string;
}

enum GameType {
  SINGLE_PLAYER = "SINGLE_PLAYER",
  MULTI_PLAYER = "MULTI_PLAYER",
}

enum GameMode {
  CLASSIC = "CLASSIC",
  DUEL = "DUEL",
  BATTLE = "BATTLE",
}

enum GameSpeed {
  RUSH = "RUSH",
  NORMAL = "NORMAL",
}

enum GameStatus {
  PENDING = "PENDING",
  PLAYING = "PLAYING",
  FINISHED = "FINISHED",
}
