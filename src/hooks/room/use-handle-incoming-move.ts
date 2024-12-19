import { useEffect } from "react";

import { useGame } from "../use-game-store";
import { animateMove } from "@/helpers/animations";
import { socket } from "@/lib/socket-io";
import { Turn } from "@/models/turn";

import { useShallow } from "zustand/react/shallow";

export const useHandleIncomingMove = () => {
  const { saveTurn, toggleAnimation } = useGame(
    useShallow((state) => ({
      saveTurn: state.saveTurn,
      toggleAnimation: state.toggleAnimation,
    })),
  );

  useEffect(() => {
    async function onOpponentMove(turn: Turn) {
      toggleAnimation();
      await animateMove(turn.from, turn.moves[turn.moves.length - 1]);
      toggleAnimation();
      saveTurn(turn);
    }

    socket.on("opponentMove", onOpponentMove);

    return () => {
      socket.off("opponentMove", onOpponentMove);
    };
  }, [saveTurn, toggleAnimation]);
};
