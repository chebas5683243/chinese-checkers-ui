import { useEffect } from "react";

import { useGame } from "@/hooks/use-game-store";
import { socket } from "@/lib/socket-io";
import { RoomMessageType } from "@/models/message";

import { useShallow } from "zustand/react/shallow";

export const useJoinGameEvent = (gameId: string) => {
  const { setupGame, addRoomMessage, setMe, addGameConnection } = useGame(
    useShallow((state) => ({
      setupGame: state.setupGame,
      addRoomMessage: state.addRoomMessage,
      setMe: state.setMe,
      addGameConnection: state.addGameConnection,
    })),
  );

  useEffect(() => {
    socket.emit("joinGame", gameId, (response) => {
      if (response.status === "error" || !response.data) {
        addRoomMessage({
          type: RoomMessageType.ERROR,
          content: "Failed to join the room",
        });
        return;
      }

      addRoomMessage({
        type: RoomMessageType.GENERAL,
        content: "You have joined the room",
      });
      setupGame(response.data.game);

      response.data.connections.forEach((player) => {
        addGameConnection(player);
      });

      const userConnection = response.data.connections.find(
        (player) => player.socketId === socket.id,
      );

      if (!userConnection) return;

      const me = response.data.game.players?.find(
        (player) => player.userId === userConnection.userId,
      );

      if (!me) return;

      setMe(me);
    });

    return () => {
      socket.emit("leaveGame", gameId);
    };
  }, [gameId, setupGame, addRoomMessage, setMe, addGameConnection]);
};
