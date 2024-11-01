type RowRange = [number, number];
type RowsRange = Record<number, RowRange>;
type GroupsRowRange = Record<number, RowsRange>;

export const HEX_COORDINATES_OFFSET = [8, 8];

/**
 * Slots per row
 *
 * The key is the row number and the value is an array of two numbers.
 *  - The first number in the array is the starting column number
 *  - The second number in the array is the ending column number
 */
export const SLOTS_PER_ROW: RowsRange = {
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
};

/**
 * Group coordinates
 *
 * The group number is the key of the object.
 * The value is an object with the key being the row number and the value being an array of two numbers.
 *  - The first number in the array is the x-coordinate where the group starts in that row
 *  - The second number in the array is the x-coordinate where the group ends in that row
 */
export const GROUP_COORDINATES: GroupsRowRange = {
  1: {
    13: [4, 7],
    14: [4, 6],
    15: [4, 5],
    16: [4, 4],
  },
  2: {
    9: [12, 12],
    10: [11, 12],
    11: [10, 12],
    12: [9, 12],
  },
  3: {
    4: [13, 16],
    5: [13, 15],
    6: [13, 14],
    7: [13, 13],
  },
  4: {
    0: [12, 12],
    1: [11, 12],
    2: [10, 12],
    3: [9, 12],
  },
  5: {
    4: [4, 7],
    5: [4, 6],
    6: [4, 5],
    7: [4, 4],
  },
  6: {
    9: [3, 3],
    10: [2, 3],
    11: [1, 3],
    12: [0, 3],
  },
};

export const GROUP_COLORS = {
  1: "#FF0000",
  2: "#00FF00",
  3: "#0000FF",
  4: "#FFFF00",
  5: "#FF00FF",
  6: "#00FFFF",
};
