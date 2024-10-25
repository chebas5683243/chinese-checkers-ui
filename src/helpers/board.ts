interface Slot {
  isEmpty: boolean;
  group?: number;
}

type Board = (Slot | null)[][];

function initializeSlot() {
  return {
    isEmpty: true,
  } as Slot;
}

function initializeBoard() {
  const board = Array.from({ length: 17 }, () => Array(17).fill(null)) as Board;

  const activeSlotPerRow: Record<number, [number, number]> = {
    0: [12, 12],
    1: [11, 12],
    2: [10, 12],
    3: [9, 12],
    4: [4, 16],
    5: [4, 15],
    6: [4, 14],
    7: [4, 13],
    8: [4, 12],
    9: [3, 12],
    10: [2, 12],
    11: [1, 12],
    12: [0, 12],
    13: [4, 7],
    14: [4, 6],
    15: [4, 5],
    16: [4, 4],
  }

  Object.entries(activeSlotPerRow).forEach(([rowStr, [start, end]]) => {
    const row = Number(rowStr);
    for (let col = start; col <= end; col++) {
      board[row][col] = initializeSlot();
    }
  });

  return board;
}

export {
  type Board,
  initializeBoard,
}
