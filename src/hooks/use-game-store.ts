/* eslint-disable no-param-reassign */
import { Board, createEmptySlot, initializeBoard } from "@/helpers/board";
import { initializeGame } from "@/helpers/game";
import { hexCompare } from "@/helpers/hex";
import { getTurnLastMove } from "@/helpers/move";
import { Game } from "@/models/game";
import { Group } from "@/models/group";
import { Player } from "@/models/player";
import { HexCoordinates, Turn } from "@/models/turn";

import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  game: Game;
  board: Board;
  players: Player[];
  turns: Turn[];
  currentTurn: Turn;
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
    // TODO: gameloop
    isCreatingGame: true,

    start: () => {
      set((state) => {
        state.board = initializeBoard([Group.GROUP_1, Group.GROUP_4]);
        state.game = initializeGame();
        state.players = [
          {
            id: "123",
            groups: [Group.GROUP_1, Group.GROUP_4],
            userId: "123",
            createdAt: new Date().getTime(),
            gameId: "123",
            updatedAt: new Date().getTime(),
          },
          {
            id: "124",
            groups: [Group.GROUP_1, Group.GROUP_4],
            userId: "123",
            createdAt: new Date().getTime(),
            gameId: "123",
            updatedAt: new Date().getTime(),
          },
        ];
        state.turns = [];
        state.isCreatingGame = false;
      });
    },

    confirmTurnMoves: (incomingTurn?: Turn) => {
      set((state) => {
        if (!state.currentTurn) return;
        if (!state.turns) return;
        if (!state.players) return;

        const turn = incomingTurn ?? state.currentTurn;

        state.turns = [...state.turns, turn];
        state.currentTurn = undefined;
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
