/* eslint-disable no-param-reassign */
import { createEmptySlot } from "@/helpers/board";
import { hexCompare } from "@/helpers/hex";
import { getTurnLastMove } from "@/helpers/move";
import { Game, GameStatus } from "@/models/game";
import { HexCoordinates, Turn } from "@/models/turn";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  game: Game;
  isAnimating: boolean;
  currentTurn: Turn;
}

interface GameStore extends Partial<GameState> {
  setupGame: (game: Game) => void;
  updateGameStatus: (status: GameStatus) => void;
  saveTurn: (incomingTurn?: Turn) => void;
  cancelTurnMoves: () => void;
  updateTurnMoves: (slot: HexCoordinates) => void;
}

export const useGame = create<GameStore>()(
  immer((set) => ({
    game: undefined,
    isAnimating: false,
    currentTurn: undefined,

    setupGame: (game: Game) => {
      set((state) => {
        state.game = game;
      });
    },

    updateGameStatus: (status) => {
      set(({ game }) => {
        if (!game) return;
        game.status = status;
      });
    },

    toggleAnimation: () => {
      set((state) => {
        state.isAnimating = !state.isAnimating;
      });
    },

    saveTurn: (incomingTurn?: Turn) => {
      set(({ game, currentTurn }) => {
        if (!game || !game.turns || !game.players) return;

        const turn = incomingTurn ?? currentTurn;

        if (!turn) return;

        game.turns = [...game.turns, turn];
        currentTurn = undefined;
      });
    },

    cancelTurnMoves: () => {
      set((state) => {
        state.currentTurn = undefined;
      });
    },

    updateTurnMoves: (selectedSlot: HexCoordinates) => {
      set(({ game, currentTurn }) => {
        if (!game || !game.board || !game.turns) return;

        if (!currentTurn) {
          currentTurn = {
            id: uuidv4(),
            gameId: "123",
            createdAt: new Date().getTime(),
            from: selectedSlot,
            order: game.turns.length + 1,
            moves: [],
          };
          return;
        }

        const { moves } = currentTurn;

        const lastMove = getTurnLastMove(currentTurn)!;

        const initialSlot = game.board[lastMove.r][lastMove.q];

        game.board[lastMove.r][lastMove.q] = createEmptySlot(lastMove);
        game.board[selectedSlot.r][selectedSlot.q] = {
          isEmpty: initialSlot!.isEmpty,
          group: initialSlot!.group,
          id: `${selectedSlot.r}-${selectedSlot.q}`,
        };

        if (hexCompare(currentTurn.from, selectedSlot)) {
          if (moves.length === 0) {
            currentTurn = undefined;
            return;
          }

          currentTurn.moves = [];
          return;
        }

        const previuousIndex = moves.findIndex((move) =>
          hexCompare(move, selectedSlot),
        );

        if (previuousIndex !== -1) {
          currentTurn.moves = moves.slice(0, previuousIndex + 1);
          return;
        }

        currentTurn.moves = [...currentTurn.moves, selectedSlot];
      });
    },
  })),
);
