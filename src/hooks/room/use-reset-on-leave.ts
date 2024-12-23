import { useEffect } from "react";

import { useGame } from "../use-game-store";

export function useResetOnLeave() {
  const resetGlobalState = useGame((state) => state.reset);

  useEffect(() => {
    return () => {
      resetGlobalState();
    };
  }, [resetGlobalState]);
}
