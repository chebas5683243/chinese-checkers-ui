"use client";

import { Slot } from "@/components/room/slot";
import { animateMove } from "@/helpers/animations";
import { createHex } from "@/helpers/hex";
import {
  checkIfSlotInPath,
  checkIfIsLastMove,
  getMoveValidationInformation,
} from "@/helpers/move";
import { getTurnInformation } from "@/helpers/turn";
import { useHandleIncomingMove } from "@/hooks/room/use-handle-incoming-move";
import { useGame } from "@/hooks/use-game-store";
import { socket } from "@/lib/socket-io";
import { HexCoordinates } from "@/models/turn";

import { useShallow } from "zustand/react/shallow";

export function Board() {
  const {
    game,
    me,
    currentTurn,
    updateTurnMoves,
    saveCurrentTurn,
    resetCurrentTurn,
    toggleAnimation,
  } = useGame(
    useShallow((state) => ({
      updateTurnMoves: state.updateTurnMoves,
      game: state.game,
      currentTurn: state.currentTurn,
      saveCurrentTurn: state.saveCurrentTurn,
      resetCurrentTurn: state.resetCurrentTurn,
      toggleAnimation: state.toggleAnimation,
      me: state.me,
    })),
  );

  useHandleIncomingMove();

  const { turns, board } = game!;

  async function onSlotClick(
    isLastMove: boolean,
    selectedSlot: HexCoordinates,
  ) {
    const turnInformation = getTurnInformation(game);

    if (!me || !turnInformation) return;

    const { isValid, needsAnimation, lastMove } = getMoveValidationInformation(
      me,
      board,
      turnInformation?.groupTurn,
      currentTurn,
      selectedSlot,
    );

    if (!isValid) return;

    if (needsAnimation && lastMove) {
      toggleAnimation();
      await animateMove(lastMove, selectedSlot);
      toggleAnimation();
    }

    if (isLastMove) {
      handleTurnConfirmation();
      return;
    }

    updateTurnMoves(selectedSlot);
  }

  function handleTurnConfirmation() {
    if (!game || !currentTurn) return;

    if (currentTurn.moves.length === 0) {
      resetCurrentTurn();
      return;
    }

    // TODO: boardhash
    socket.emit("sendMove", game.id, currentTurn, "boardHash", (payload) => {
      if (payload.status === "error") {
        console.error(payload.error);
      } else {
        saveCurrentTurn();
      }
    });
  }

  if (!board) {
    return <div>Cargando</div>;
  }

  return (
    <div className="flex flex-col gap-[0px] sm:gap-0.5 rounded-full sm:px-[60px] sm:py-[26px] w-fit">
      {board.map((row, rIndex) => (
        <div
          className="flex gap-[3px] sm:gap-[7px] justify-center"
          // eslint-disable-next-line react/no-array-index-key
          key={rIndex}
        >
          {row.map((slot, qIndex) => {
            if (!slot) return null;

            const hexCoords = createHex(rIndex, qIndex);
            const isSlotInPath = checkIfSlotInPath(currentTurn, hexCoords);
            const isLastMove = checkIfIsLastMove(currentTurn, hexCoords);

            return (
              <Slot
                key={slot.id}
                slot={slot}
                onClick={() => onSlotClick(isLastMove, hexCoords)}
                hexCoords={hexCoords}
                isInCurrentPath={isSlotInPath}
                isLastMove={isLastMove}
              />
            );
          })}
        </div>
      ))}
      <div>Turns</div>
      <div>
        {turns?.map((turn) => (
          <div key={turn.id}>{`${turn.from.q} - ${turn.from.r}`}</div>
        ))}
      </div>
      <div>Current Move</div>
      <div>{`${currentTurn?.from.q} - ${currentTurn?.from.r}`}</div>
      <div>Moves</div>
      <div>
        {currentTurn?.moves.map((move) => (
          <div key={`${move.q} - ${move.r}`}>{`${move.q} - ${move.r}`}</div>
        ))}
      </div>
    </div>
  );
}
