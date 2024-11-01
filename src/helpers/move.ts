import { Board } from "./board";
import { hexCompare, hexDivide, hexSubtract } from "./hex";
import { HEX_DIRECTION_VECTORS } from "@/constants/hex-directions";
import { HexCoordinates, Turn } from "@/models/turn";

export function checkIfSlotInPath(
  turn: Turn | undefined,
  slot: HexCoordinates,
) {
  const fullMoves = getFullMoves(turn);
  return fullMoves.some((move) => hexCompare(move, slot));
}

function getFullMoves(turn: Turn | undefined): HexCoordinates[] {
  if (!turn) return [];

  const movesToMerge = turn.moves ?? [];
  const fromToMerge = turn.from ? [turn.from] : [];

  return [...fromToMerge, ...movesToMerge];
}

// function getAllowedMovesTypeFromTurn(currentTurn: Turn | undefined): {
//   canHop: boolean;
//   canMove: boolean;
// } {}

export function getMoveValidationInformation(
  board: Board | undefined,
  currentTurn: Turn | undefined,
  slotToGo: HexCoordinates,
): {
  isValid: boolean;
  needsAnimation: boolean;
  lastMove?: HexCoordinates;
} {
  const isInitializingTurn = !currentTurn;

  if (isInitializingTurn) {
    return {
      isValid: true,
      needsAnimation: false,
    };
  }

  const isSlotInPath = checkIfSlotInPath(currentTurn, slotToGo);

  if (isSlotInPath) {
    return {
      isValid: true,
      needsAnimation: false,
    };
  }

  const lastMove = getTurnLastMove(currentTurn);

  return {
    isValid: isMoveValid(board, lastMove, slotToGo),
    lastMove,
    needsAnimation: true,
  };
}

function isMoveValid(
  board: Board | undefined,
  from: HexCoordinates | undefined,
  to: HexCoordinates | undefined,
) {
  if (!board || !from || !to) return false;

  const fromSlot = board[from.r][from.q];
  const toSlot = board[to.r][to.q];

  if (!toSlot || !toSlot.isEmpty) return false;
  if (!fromSlot || fromSlot.isEmpty) return false;

  const delta = hexSubtract(from, to);

  const directionVector = HEX_DIRECTION_VECTORS.find((v) =>
    hexCompare(v, delta),
  );

  if (directionVector) return true;

  const halfDelta = hexDivide(delta, 2);

  const isHoppingMove = HEX_DIRECTION_VECTORS.some((v) =>
    hexCompare(v, halfDelta),
  );

  if (!isHoppingMove) return false;

  const intermediateHexCoords = hexSubtract(from, halfDelta);

  const intermediateSlot =
    board[intermediateHexCoords.r][intermediateHexCoords.q];

  if (!intermediateSlot || intermediateSlot.isEmpty) return false;

  return true;
}

export function getTurnLastMove(turn: Turn | undefined) {
  if (!turn) return undefined;
  return turn.moves[turn.moves.length - 1] ?? turn.from;
}

export function checkIfIsLastMove(
  turn: Turn | undefined,
  move: HexCoordinates,
) {
  const lastMove = getTurnLastMove(turn);
  return hexCompare(lastMove, move);
}
