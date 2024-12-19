import { useState } from "react";

import { Button } from "../ui/button";
import { useGame } from "@/hooks/use-game-store";
import { socket } from "@/lib/socket-io";
import { GameStatus } from "@/models/game";

import { useShallow } from "zustand/react/shallow";

export function Lobby() {
  const { game, updateGameStatus } = useGame(
    useShallow((state) => ({
      game: state.game,
      updateGameStatus: state.updateGameStatus,
    })),
  );

  const [loading, setLoading] = useState(false);

  function onStartGame() {
    if (!game) return;

    setLoading(true);

    socket.emit("startGame", game.id, (payload) => {
      setLoading(false);
      if (payload.status === "error") {
        console.error(payload.error);
      } else {
        updateGameStatus(GameStatus.STARTING);
      }
    });
  }

  return (
    <div className="flex flex-col">
      <Button onClick={onStartGame} disabled={loading}>
        Start Game
      </Button>
    </div>
  );
}
