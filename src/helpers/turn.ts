import { Game } from "@/models/game";
import { Player } from "@/models/player";

export function getTurnInformation({
  game,
  nTurns,
  players,
}: {
  game: Game | undefined;
  nTurns: number | undefined;
  players: Player[] | undefined;
}) {
  if (!game || !players || nTurns === undefined) {
    return undefined;
  }

  const { groupOrder } = game;

  const groupTurn = groupOrder[nTurns % groupOrder.length];

  const playerTurn = players.find((player) =>
    player.groups.includes(groupTurn),
  )!;

  return {
    groupTurn,
    playerTurn: playerTurn.userId,
  };
}
