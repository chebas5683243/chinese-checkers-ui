"use client";

import { useEffect } from "react";

import { Slot } from "@/components/board/slot";
import { animateStepMovement } from "@/helpers/animations";
import { createHex } from "@/helpers/hex";
import {
  checkIfSlotInPath,
  checkIfIsLastStep,
  getStepValidationInformation,
} from "@/helpers/move";
import { useGame } from "@/hooks/use-game-store";
import { HexCoordinates } from "@/models/move";

export function Board() {
  const {
    start: startGame,
    isCreatingGame,
    board,
    updateMove,
    currentMove,
    confirmMove,
    moves,
  } = useGame();

  useEffect(() => {
    startGame();
  }, [startGame]);

  async function onSlotClick(
    isLastStep: boolean,
    selectedHexCoords: HexCoordinates,
  ) {
    const { isValid, needsAnimation, lastStep } = getStepValidationInformation(
      board,
      currentMove,
      selectedHexCoords,
    );

    if (!isValid) return;

    if (needsAnimation && lastStep) {
      await animateStepMovement(lastStep, selectedHexCoords);
    }

    if (isLastStep) {
      confirmMove();
      return;
    }

    updateMove(selectedHexCoords);
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
            const isSlotInPath = checkIfSlotInPath(currentMove, hexCoords);
            const isLastStep = checkIfIsLastStep(currentMove, hexCoords);

            return (
              <Slot
                key={slot.id}
                slot={slot}
                onClick={() => onSlotClick(isLastStep, hexCoords)}
                hexCoords={hexCoords}
                isInCurrentPath={isSlotInPath}
                isLastStep={isLastStep}
              />
            );
          })}
        </div>
      ))}
      <div>Moves</div>
      <div>
        {moves?.map((mv) => (
          <div key={mv.id}>{`${mv.from.q} - ${mv.from.r}`}</div>
        ))}
      </div>
      <div>Current Move</div>
      <div>{`${currentMove?.from.q} - ${currentMove?.from.r}`}</div>
      <div>Steps</div>
      <div>
        {currentMove?.steps.map((step) => (
          <div key={`${step.q} - ${step.r}`}>{`${step.q} - ${step.r}`}</div>
        ))}
      </div>
    </div>
  );
}
