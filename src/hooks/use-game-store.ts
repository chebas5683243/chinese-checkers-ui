/* eslint-disable no-param-reassign */
import { createEmptySlot } from "@/helpers/board";
import { hexCompare } from "@/helpers/hex";
import { getTurnLastMove } from "@/helpers/move";
import { getTurnInformation } from "@/helpers/turn";
import { GameConnection } from "@/lib/socket-io";
import { Game, GameStatus } from "@/models/game";
import { RoomMessage, RoomMessageType } from "@/models/message";
import { Player } from "@/models/player";
import { HexCoordinates, Turn } from "@/models/turn";
import { getUUID } from "@/utils/random";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface GameState {
  game: Game | undefined;
  me: Player | undefined;
  currentTurn: Turn | undefined;
  isAnimating: boolean;
  messages: RoomMessage[];
  gameConnections: GameConnection[];
}

interface GameStore extends GameState {
  reset: () => void;
  setupGame: (game: Game) => void;
  setMe: (player: Player) => void;
  updateGameStatus: (status: GameStatus) => void;
  saveCurrentTurn: () => void;
  saveIncomingTurn: (turn: Turn) => void;
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
    me: undefined,
    currentTurn: undefined,
    isAnimating: false,
    messages: [],
    gameConnections: [],

    reset: () => {
      set((state) => {
        state.game = undefined;
        state.me = undefined;
        state.currentTurn = undefined;
        state.isAnimating = false;
        state.messages = [];
        state.gameConnections = [];
      });
    },

    setupGame: (game: Game) => {
      set((state) => {
        state.game = game;
      });
    },

    setMe: (player: Player) => {
      set((state) => {
        state.me = player;
      });
    },

    updateGameStatus: (status) => {
      set(({ game }) => {
        if (!game) return;
        game.status = status;
      });
    },

    saveCurrentTurn: () => {
      set((state) => {
        if (!state.game || !state.currentTurn || !state.game.turns) {
          return;
        }

        state.game.turns = [...state.game.turns, state.currentTurn];
        state.currentTurn = undefined;
      });
    },

    saveIncomingTurn: (turn: Turn) => {
      set((state) => {
        if (!state.game || !state.game.turns || !state.game.board || !turn) {
          return;
        }

        const turnInfo = getTurnInformation(state.game);

        if (turnInfo === undefined) {
          return;
        }

        state.game.turns = [...state.game.turns, turn];
        state.game.board[turn.from.r][turn.from.q] = createEmptySlot(turn.from);

        const lastMove = turn.moves[turn.moves.length - 1];
        state.game.board[lastMove.r][lastMove.q] = {
          isEmpty: false,
          group: turnInfo.groupTurn,
          id: `${lastMove.r}-${lastMove.q}`,
        };
      });
    },

    cancelTurnMoves: () => {
      set((state) => {
        state.currentTurn = undefined;
      });
    },

    updateTurnMoves: (selectedSlot: HexCoordinates) => {
      set((state) => {
        if (!state.game || !state.game.board || !state.game.turns) {
          return;
        }

        if (!state.currentTurn) {
          state.currentTurn = {
            id: getUUID(),
            gameId: "123",
            createdAt: new Date().getTime(),
            from: selectedSlot,
            order: state.game.turns.length + 1,
            moves: [],
          };
          return;
        }

        const { moves } = state.currentTurn;

        const lastMove = getTurnLastMove(state.currentTurn)!;

        const initialSlot = state.game.board[lastMove.r][lastMove.q];

        state.game.board[lastMove.r][lastMove.q] = createEmptySlot(lastMove);
        state.game.board[selectedSlot.r][selectedSlot.q] = {
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
