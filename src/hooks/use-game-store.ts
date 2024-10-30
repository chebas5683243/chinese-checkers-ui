/* eslint-disable no-param-reassign */
import { Board, initializeBoard } from "@/helpers/board";
import { hexCompare } from "@/helpers/hex";
import { HexCoordinates, Move } from "@/models/move";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  board: Board;
  players: string[];
  moves: Move[];
  currentMove: Move;
  playerTurn: string;
  isCreatingGame: boolean;
}

interface GameStore extends Partial<GameState> {
  start: () => void;
  confirmMove: (incomingMove?: Move) => void;
  cancelMove: () => void;
  updateMove: (slot: HexCoordinates) => void;
}

export const useGame = create<GameStore>()(
  immer((set) => ({
    isCreatingGame: true,

    start: () => {
      set((state) => {
        state.board = initializeBoard([1, 4]);
        state.players = ["123", "456"];
        state.moves = [];
        state.playerTurn = "123";
        state.isCreatingGame = false;
      });
    },

    confirmMove: (incomingMove?: Move) => {
      set((state) => {
        if (!state.currentMove) return;
        if (!state.moves) return;
        if (!state.players) return;
        if (!state.playerTurn) return;

        const currentPlayerIndex = state.players.indexOf(state.playerTurn);
        const nextPlayerIndex =
          currentPlayerIndex === state.players.length - 1
            ? 0
            : currentPlayerIndex + 1;

        const move = incomingMove ?? state.currentMove;

        state.moves = [...state.moves, move];
        state.currentMove = undefined;
        state.playerTurn = state.players[nextPlayerIndex];
      });
    },

    cancelMove: () => {
      set((state) => {
        state.currentMove = undefined;
      });
    },

    updateMove: (newStep: HexCoordinates) => {
      set((state) => {
        if (!state.moves) return;

        if (!state.currentMove) {
          state.currentMove = {
            id: uuidv4(),
            gameId: "123",
            createdAt: new Date().getTime(),
            from: newStep,
            order: state.moves.length + 1,
            steps: [],
          };
          return;
        }

        const { steps } = state.currentMove;

        if (hexCompare(state.currentMove.from, newStep)) {
          if (steps.length === 0) {
            state.currentMove = undefined;
            return;
          }

          state.currentMove.steps = [];
          return;
        }

        const previuousIndex = steps.findIndex((step) =>
          hexCompare(step, newStep),
        );

        if (previuousIndex !== -1) {
          state.currentMove.steps = steps.slice(0, previuousIndex + 1);
          return;
        }

        state.currentMove.steps = [...state.currentMove.steps, newStep];
      });
    },
  })),
);
