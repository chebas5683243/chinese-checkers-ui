import { useEffect } from "react";

import { useGame } from "../use-game-store";
import { GameConnection, socket } from "@/lib/socket-io";

import { useShallow } from "zustand/react/shallow";

export const useUserConnectionEvents = () => {
  const { addGameConnection, removeGameConnection } = useGame(
    useShallow((state) => ({
      addGameConnection: state.addGameConnection,
      removeGameConnection: state.removeGameConnection,
    })),
  );

  useEffect(() => {
    function onPlayerJoined(connection: GameConnection) {
      addGameConnection(connection);
    }

    function onPlayerLeft(connection: GameConnection) {
      removeGameConnection(connection);
    }

    socket.on("playerJoined", onPlayerJoined);
    socket.on("playerLeft", onPlayerLeft);

    return () => {
      socket.off("playerJoined", onPlayerJoined);
      socket.off("playerLeft", onPlayerLeft);
    };
  }, [addGameConnection, removeGameConnection]);
};
