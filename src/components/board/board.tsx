"use client";

import { useEffect, useMemo } from "react";

import { Slot } from "@/components/board/slot";
import { USER_ID } from "@/constants/dummy";
import { animateMove } from "@/helpers/animations";
import { createHex } from "@/helpers/hex";
import {
  checkIfSlotInPath,
  checkIfIsLastMove,
  getMoveValidationInformation,
} from "@/helpers/move";
import { getTurnInformation } from "@/helpers/turn";
import { useGame } from "@/hooks/use-game-store";
import { HexCoordinates } from "@/models/turn";

export function Board() {
  const {
    start: startGame,
    isCreatingGame,
    board,
    updateTurnMoves,
    game,
    players,
    currentTurn,
    confirmTurnMoves,
    turns,
  } = useGame();

  const me = useMemo(
    () => players?.find((player) => player.userId === USER_ID),
    [players],
  );

  const turnInformation = useMemo(
    () => getTurnInformation({ game, players, nTurns: turns?.length }),
    [game, players, turns],
  );

  useEffect(() => {
    startGame();
  }, [startGame]);

  async function onSlotClick(
    isLastMove: boolean,
    selectedSlot: HexCoordinates,
  ) {
    const { isValid, needsAnimation, lastMove } = getMoveValidationInformation(
      me,
      board,
      turnInformation?.groupTurn,
      currentTurn,
      selectedSlot,
    );

    if (!isValid) return;

    if (needsAnimation && lastMove) {
      await animateMove(lastMove, selectedSlot);
    }

    if (isLastMove) {
      confirmTurnMoves();
      return;
    }

    updateTurnMoves(selectedSlot);
  }

  if (isCreatingGame || !board) {
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
