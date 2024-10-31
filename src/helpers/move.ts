import { Board } from "./board";
import { hexCompare, hexDivide, hexSubtract } from "./hex";
import { HexCoordinates, Move } from "@/models/move";

const AXIAL_DIRECTION_VECTORS = [
  { r: 1, q: 0 },
  { r: 1, q: -1 },
  { r: 0, q: -1 },
  { r: -1, q: 0 },
  { r: -1, q: 1 },
  { r: 0, q: 1 },
];

export function isRepeatedStep(
  from: HexCoordinates,
  steps: HexCoordinates[],
  step: HexCoordinates,
) {
  if (hexCompare(from, step)) return true;
  return steps.some((s) => hexCompare(s, step));
}

export function isStepValid(
  board: Board,
  from: HexCoordinates,
  to: HexCoordinates,
) {
  const fromSlot = board[from.r][from.q];
  const toSlot = board[to.r][to.q];

  if (!toSlot || !toSlot.isEmpty) return false;
  if (!fromSlot || fromSlot.isEmpty) return false;

  const delta = hexSubtract(from, to);

  const directionVector = AXIAL_DIRECTION_VECTORS.find((v) =>
    hexCompare(v, delta),
  );

  if (directionVector) return true;

  const halfDelta = hexDivide(delta, 2);

  const intermediateDirectionVector = AXIAL_DIRECTION_VECTORS.find((v) =>
    hexCompare(v, halfDelta),
  );

  if (!intermediateDirectionVector) return false;

  const intermediateHexCoords = hexSubtract(from, halfDelta);

  const intermediateSlot =
    board[intermediateHexCoords.r][intermediateHexCoords.q];

  if (!intermediateSlot || intermediateSlot.isEmpty) return false;

  return true;
}

export function getMoveLastStep(move: Move) {
  return move.steps[move.steps.length - 1] ?? move.from;
}
