import { useMemo } from "react";

import { useGame } from "../use-game-store";

export const useConnectedUsers = () => {
  const gameConnections = useGame((state) => state.gameConnections);

  return useMemo(
    () =>
      Array.from(
        new Set(gameConnections.map((connection) => connection.userId)),
      ),
    [gameConnections],
  );
};
