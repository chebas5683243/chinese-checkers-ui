import { Board } from "./board";
import { hexCompare, hexDivide, hexSubtract } from "./hex";
import { AXIAL_DIRECTION_VECTORS } from "@/constants/axial-directions";
import { HexCoordinates, Move } from "@/models/move";

export function checkIfSlotInPath(
  move: Move | undefined,
  step: HexCoordinates,
) {
  const fullSteps = getFullSteps(move);
  return fullSteps.some((s) => hexCompare(s, step));
}

function getFullSteps(move: Move | undefined): HexCoordinates[] {
  if (!move) return [];

  const stepsToMerge = move.steps ?? [];
  const fromToMerge = move.from ? [move.from] : [];

  return [...fromToMerge, ...stepsToMerge];
}

export function getStepValidationInformation(
  board: Board | undefined,
  currentMove: Move | undefined,
  stepToGo: HexCoordinates,
): {
  isValid: boolean;
  needsAnimation: boolean;
  lastStep?: HexCoordinates;
} {
  const isFirstStep = !currentMove;

  if (isFirstStep) {
    return {
      isValid: true,
      needsAnimation: false,
    };
  }

  const isSlotInPath = checkIfSlotInPath(currentMove, stepToGo);

  if (isSlotInPath) {
    return {
      isValid: true,
      needsAnimation: false,
    };
  }

  const lastStep = getMoveLastStep(currentMove);

  return {
    isValid: isStepValid(board, lastStep, stepToGo),
    lastStep,
    needsAnimation: true,
  };
}

function isStepValid(
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

function getMoveLastStep(move: Move | undefined): HexCoordinates | undefined {
  if (!move) return undefined;
  return move.steps[move.steps.length - 1] ?? move.from;
}

export function checkIfIsLastStep(
  move: Move | undefined,
  step: HexCoordinates,
) {
  const lastStep = getMoveLastStep(move);
  return hexCompare(lastStep, step);
}
