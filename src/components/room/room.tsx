import { Board } from "./board";
import { useGame } from "@/hooks/use-game-store";

interface RoomProps {
  gameId: string;
}

export function Room({ gameId }: RoomProps) {
  const game = useGame((state) => state.game);

  if (!game) return null;

  return (
    <div className="flex justify-center w-full">
      asd
      <Board />
    </div>
  );
}
