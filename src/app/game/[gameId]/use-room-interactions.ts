import { useEffect, useState } from "react";

import { useGame } from "@/hooks/use-game-store";
import { GameConnection, socket } from "@/lib/socket-io";
import { Game, GameStatus } from "@/models/game";
import { getUUID } from "@/utils/random";

import { useShallow } from "zustand/react/shallow";

interface RoomMessage {
  id: string;
  content: string;
}

export const useRoomNotifications = (gameId: string) => {
  const { setupGame, updateGameStatus } = useGame(
    useShallow((state) => ({
      updateGameStatus: state.updateGameStatus,
      setupGame: state.setupGame,
    })),
  );

  const [messages, setMessages] = useState<RoomMessage[]>([]);

  const [gameConnections, setGameConnections] = useState<GameConnection[]>([]);

  // listener for "gameStarting" event
  useEffect(() => {
    function onGameStarting() {
      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: "Game starting..." },
      ]);
      updateGameStatus(GameStatus.STARTING);
    }

    socket.on("gameStarting", onGameStarting);
    return () => {
      socket.off("gameStarting", onGameStarting);
    };
  }, [updateGameStatus]);

  // listener for "gameStarted" event
  useEffect(() => {
    function onGameStarted(game: Game) {
      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: "Game started" },
      ]);
      setupGame(game);
    }

    socket.on("gameStarted", onGameStarted);

    return () => {
      socket.off("gameStarted", onGameStarted);
    };
  }, [setupGame]);

  // listener for "playerJoined" and "playerLeft" events
  useEffect(() => {
    function onPlayerJoined(connection: GameConnection) {
      setGameConnections((prev) => [...prev, connection]);

      const userAlreadyConnected = gameConnections.some(
        (gConn) => gConn.userId === connection.userId,
      );

      if (userAlreadyConnected) return;

      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: `${connection.userId.slice(0, 6)} joined` },
      ]);
    }

    function onPlayerLeft(connection: GameConnection) {
      setGameConnections((prev) =>
        prev.filter((gConn) => gConn.socketId !== connection.socketId),
      );

      const userStillConnected = gameConnections
        .filter((gConn) => gConn.socketId !== connection.socketId)
        .some((gConn) => gConn.userId === connection.userId);

      if (userStillConnected) return;

      setMessages((prev) => [
        ...prev,
        { id: getUUID(), content: `${connection.userId.slice(0, 6)} left` },
      ]);
    }

    return () => {
      socket.off("playerJoined", onPlayerJoined);
      socket.off("playerLeft", onPlayerLeft);
    };
  }, [gameConnections]);

  // emit "joinGame" event when component mounts
  useEffect(() => {
    socket.emit("joinGame", gameId, (response) => {
      if (response.status === "error" || !response.data) {
        setMessages([{ id: getUUID(), content: "Failed to join the room" }]);
        return;
      }

      setMessages([{ id: getUUID(), content: "You have joined the room" }]);
      setupGame(response.data.game);
      setGameConnections(response.data.connections);
    });

    return () => {
      socket.emit("leaveGame", gameId);
    };
  }, [gameId, setupGame]);

  return { messages };
};
