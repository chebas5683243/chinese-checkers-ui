/* eslint-disable no-param-reassign */
import { Board, createEmptySlot, initializeBoard } from "@/helpers/board";
import { hexCompare } from "@/helpers/hex";
import { getTurnLastMove } from "@/helpers/move";
import { HexCoordinates, Turn } from "@/models/turn";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  board: Board;
  players: string[];
  turns: Turn[];
  currentTurn: Turn;
  playerTurn: string;
  isCreatingGame: boolean;
}

interface GameStore extends Partial<GameState> {
  start: () => void;
  confirmTurnMoves: (incomingTurn?: Turn) => void;
  cancelTurnMoves: () => void;
  updateTurnMoves: (slot: HexCoordinates) => void;
}

export const useGame = create<GameStore>()(
  immer((set) => ({
    // Default state
    isCreatingGame: true,

    start: () => {
      set((state) => {
        state.board = initializeBoard([1, 4]);
        state.players = ["123", "456"];
        state.turns = [];
        state.playerTurn = "123";
        state.isCreatingGame = false;
      });
    },

    confirmTurnMoves: (incomingTurn?: Turn) => {
      set((state) => {
        if (!state.currentTurn) return;
        if (!state.turns) return;
        if (!state.players) return;
        if (!state.playerTurn) return;

        const currentPlayerIndex = state.players.indexOf(state.playerTurn);
        const nextPlayerIndex =
          currentPlayerIndex === state.players.length - 1
            ? 0
            : currentPlayerIndex + 1;

        const turn = incomingTurn ?? state.currentTurn;

        state.turns = [...state.turns, turn];
        state.currentTurn = undefined;
        state.playerTurn = state.players[nextPlayerIndex];
      });
    },

    cancelTurnMoves: () => {
      set((state) => {
        state.currentTurn = undefined;
      });
    },

    updateTurnMoves: (selectedSlot: HexCoordinates) => {
      set((state) => {
        if (!state.turns) return;
        if (!state.board) return;

        if (!state.currentTurn) {
          state.currentTurn = {
            id: uuidv4(),
            gameId: "123",
            createdAt: new Date().getTime(),
            from: selectedSlot,
            order: state.turns.length + 1,
            moves: [],
          };
          return;
        }

        const { moves } = state.currentTurn;

        const lastMove = getTurnLastMove(state.currentTurn)!;

        const initialSlot = state.board[lastMove.r][lastMove.q];

        state.board[lastMove.r][lastMove.q] = createEmptySlot(lastMove);
        state.board[selectedSlot.r][selectedSlot.q] = {
          isEmpty: initialSlot!.isEmpty,
          group: initialSlot!.group,
          id: `${selectedSlot.r}-${selectedSlot.q}`,
        };

        if (hexCompare(state.currentTurn.from, selectedSlot)) {
          if (moves.length === 0) {
            state.currentTurn = undefined;
            return;
          }

          state.currentTurn.moves = [];
          return;
        }

        const previuousIndex = moves.findIndex((move) =>
          hexCompare(move, selectedSlot),
        );

        if (previuousIndex !== -1) {
          state.currentTurn.moves = moves.slice(0, previuousIndex + 1);
          return;
        }

        state.currentTurn.moves = [...state.currentTurn.moves, selectedSlot];
      });
    },
  })),
);
