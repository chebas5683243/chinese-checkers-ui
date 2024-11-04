import { Group } from "./group";

// partition key: gameId
// secondary index - PK: userId, SK: createdAt
export interface Player {
  id: string;
  gameId: string;
  userId: string;
  groups: Group[];
  createdAt: number;
  updatedAt: number;
}
