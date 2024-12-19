/* eslint-disable no-param-reassign */
import { createEmptySlot } from "@/helpers/board";
import { hexCompare } from "@/helpers/hex";
import { getTurnLastMove } from "@/helpers/move";
import { GameConnection } from "@/lib/socket-io";
import { Game, GameStatus } from "@/models/game";
import { RoomMessage, RoomMessageType } from "@/models/message";
import { HexCoordinates, Turn } from "@/models/turn";
import { getUUID } from "@/utils/random";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  game: Game | undefined;
  currentTurn: Turn | undefined;
  isAnimating: boolean;
  messages: RoomMessage[];
  gameConnections: GameConnection[];
}

interface GameStore extends GameState {
  setupGame: (game: Game) => void;
  updateGameStatus: (status: GameStatus) => void;
  saveTurn: (incomingTurn?: Turn) => void;
  cancelTurnMoves: () => void;
  updateTurnMoves: (slot: HexCoordinates) => void;
  toggleAnimation: () => void;
  addRoomMessage: (message: Pick<RoomMessage, "type" | "content">) => void;
  addGameConnection: (gameConnection: GameConnection) => void;
  removeGameConnection: (gameConnection: GameConnection) => void;
}

export const useGame = create<GameStore>()(
  immer((set) => ({
    game: undefined,
    currentTurn: undefined,
    isAnimating: false,
    messages: [],
    gameConnections: [],

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
            id: getUUID(),
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

    toggleAnimation: () => {
      set((state) => {
        state.isAnimating = !state.isAnimating;
      });
    },

    addRoomMessage: (message) => {
      set((state) => {
        state.messages.push({
          id: getUUID(),
          ...message,
        });
      });
    },

    addGameConnection: (gameConnection) => {
      set((state) => {
        const userAlreadyConnected = state.gameConnections.some(
          (gConn) => gConn.userId === gameConnection.userId,
        );

        state.gameConnections.push(gameConnection);

        if (userAlreadyConnected) return;

        state.messages.push({
          id: getUUID(),
          type: RoomMessageType.GENERAL,
          content: `${gameConnection.userId.slice(0, 6)} joined`,
        });
      });
    },

    removeGameConnection: (gameConnection) => {
      set((state) => {
        state.gameConnections = state.gameConnections.filter(
          (gConn) => gConn.socketId !== gameConnection.socketId,
        );

        const userStillConnected = state.gameConnections.some(
          (gConn) => gConn.userId === gameConnection.userId,
        );

        if (userStillConnected) return;

        state.messages.push({
          id: getUUID(),
          type: RoomMessageType.GENERAL,
          content: `${gameConnection.userId.slice(0, 6)} left`,
        });
      });
    },
  })),
);
