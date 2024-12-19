import { Board } from "./board";
import { Lobby } from "./lobby";
import { useGame } from "@/hooks/use-game-store";
import { GameStatus } from "@/models/game";

export function Room() {
  const game = useGame((state) => state.game);

  if (!game) return null;

  if (game.status === GameStatus.LOBBY) {
    return <Lobby />;
  }

  if (game.status === GameStatus.STARTING) {
    return <div>Game is starting</div>;
  }

  if (game.status === GameStatus.FINISHED) {
    return <div>Game is finished</div>;
  }

  return (
    <div className="flex justify-center w-full">
      <Board />
    </div>
  );
}
