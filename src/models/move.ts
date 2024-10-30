export interface Move {
  id: string;
  gameId: string;
  from: HexCoordinates;
  steps: HexCoordinates[];
  order: number;
  createdAt: number;
}

export interface HexCoordinates {
  q: number;
  r: number;
}
