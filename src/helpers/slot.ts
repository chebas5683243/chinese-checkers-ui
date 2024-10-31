import { printHex } from "./hex";
import { HexCoordinates } from "@/models/move";

export function getPieceId(hexCoords: HexCoordinates) {
  return `Piece ${printHex(hexCoords)}`;
}

export function getSlotId(hexCoords: HexCoordinates) {
  return `Slot ${printHex(hexCoords)}`;
}
