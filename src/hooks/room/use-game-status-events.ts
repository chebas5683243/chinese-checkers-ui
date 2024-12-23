import { useEffect } from "react";

import { useGame } from "@/hooks/use-game-store";
import { socket } from "@/lib/socket-io";
import { Game, GameStatus } from "@/models/game";
import { RoomMessageType } from "@/models/message";

import { useShallow } from "zustand/react/shallow";

export const useGameStatusEvents = () => {
  const {
    gameConnections,
    setupGame,
    updateGameStatus,
    addRoomMessage,
    setMe,
  } = useGame(
    useShallow((state) => ({
      updateGameStatus: state.updateGameStatus,
      setupGame: state.setupGame,
      addRoomMessage: state.addRoomMessage,
      gameConnections: state.gameConnections,
      setMe: state.setMe,
    })),
  );

  // TODO: see rerendes cause by socket handlers

  useEffect(() => {
    function onGameStarting() {
      addRoomMessage({
        type: RoomMessageType.GENERAL,
        content: "Game starting...",
      });
      updateGameStatus(GameStatus.STARTING);
    }

    socket.on("gameStarting", onGameStarting);
    return () => {
      socket.off("gameStarting", onGameStarting);
    };
  }, [updateGameStatus, addRoomMessage]);

  useEffect(() => {
    function onGameStarted(game: Game) {
      addRoomMessage({
        type: RoomMessageType.GENERAL,
        content: "Game started",
      });
      setupGame(game);

      const userConnection = gameConnections.find(
        (gConn) => gConn.socketId === socket.id,
      );

      if (!userConnection) return;

      const me = game.players?.find(
        (player) => player.userId === userConnection.userId,
      );

      if (!me) return;

      setMe(me);
    }

    socket.on("gameStarted", onGameStarted);

    return () => {
      socket.off("gameStarted", onGameStarted);
    };
  }, [setupGame, addRoomMessage, gameConnections, setMe]);
};
