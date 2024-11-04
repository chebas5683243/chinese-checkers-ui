import { Game } from "@/models/game";
import { Group } from "@/models/group";

export function initializeGame(): Game {
  return {
    id: "123",
    groupOrder: [Group.GROUP_1, Group.GROUP_4],
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  } as Game;
}
