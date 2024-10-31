import { createHex } from "./hex";
import { GROUP_COORDINATES, SLOTS_PER_ROW } from "@/constants/board";
import { HexCoordinates } from "@/models/move";

interface Slot {
  id: string;
  isEmpty: boolean;
  group?: number;
}

type Board = (Slot | null)[][];

function createEmptySlot(hexCoords: HexCoordinates): Slot {
  return {
    isEmpty: true,
    id: `${hexCoords.r}-${hexCoords.q}`,
  };
}

function initializeSlots() {
  const board = Array.from({ length: 17 }, () => Array(17).fill(null)) as Board;

  Object.entries(SLOTS_PER_ROW).forEach(([rowStr, [start, end]]) => {
    const row = Number(rowStr);
    for (let col = start; col <= end; col += 1) {
      const hexCoords = createHex(row, col);
      board[row][col] = createEmptySlot(hexCoords);
    }
  });

  return board;
}

function initializeGroups(board: Board, groups: number[]) {
  const filledBoard = board;

  groups.forEach((group) => {
    const groupCoordinates = GROUP_COORDINATES[group];
    Object.entries(groupCoordinates).forEach(([rowStr, [start, end]]) => {
      const row = Number(rowStr);
      for (let col = start; col <= end; col += 1) {
        filledBoard[row][col] = {
          isEmpty: false,
          group,
          id: `${row}-${col}`,
        };
      }
    });
  });

  return filledBoard;
}

function initializeBoard(groups: number[]) {
  const board = initializeSlots();

  const filledBoard = initializeGroups(board, groups);

  return filledBoard;
}

export { type Board, type Slot, initializeBoard, createEmptySlot };
