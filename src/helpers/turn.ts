import { Game } from "@/models/game";

export function getTurnInformation(game: Game | undefined) {
  if (!game || !game.players || !game.turns) {
    return undefined;
  }

  const { groupOrder, turns } = game;

  const groupTurn = groupOrder[turns.length % groupOrder.length];

  const playerTurn = game.players.find((player) =>
    player.groups.includes(groupTurn),
  )!;

  return {
    groupTurn,
    playerTurn: playerTurn.userId,
  };
}
