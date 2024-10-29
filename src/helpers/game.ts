import { Game } from "@/models/game";

type GameConfig = Pick<
  Game,
  "gameMode" | "gameSpeed" | "gameStatus" | "gameType" | "name" | "nPlayers"
>;

function initializeGame(config: GameConfig) {}
