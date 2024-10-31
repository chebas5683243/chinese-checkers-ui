"use client";

import { useEffect } from "react";

import { Slot } from "@/components/board/slot";
import { getMoveLastStep, isRepeatedStep, isStepValid } from "@/helpers/move";
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

  if (isCreatingGame || !board) {
    return <div>Cargando</div>;
  }

  async function animateStep(from: HexCoordinates, to: HexCoordinates) {
    const fromSlot = document.getElementById(`Slot ${from.r},${from.q}`);
    const toSlot = document.getElementById(`Slot ${to.r},${to.q}`);

    if (!fromSlot || !toSlot) return;

    const fromSlotRect = fromSlot.getBoundingClientRect();
    const toSlotRect = toSlot.getBoundingClientRect();

    const deltaX = toSlotRect.x - fromSlotRect.x;
    const deltaY = toSlotRect.y - fromSlotRect.y;

    const animation = fromSlot.animate(
      [
        { transform: `scale(1) translate(0px, 0px)` },
        { transform: `scale(1.5) translate(${deltaX / 4}px, ${deltaY / 4}px)` },
        { transform: `scale(1) translate(${deltaX}px, ${deltaY}px)` },
      ],
      {
        duration: 1000,
        easing: "ease",
      },
    );

    await animation.finished;
  }

  function checkIfStepIsValid(hexCoords: HexCoordinates): {
    isValid: boolean;
    needsAnimation: boolean;
    lastStep?: HexCoordinates;
  } {
    const isFirstStep = !currentMove;

    if (isFirstStep) {
      return {
        isValid: true,
        needsAnimation: false,
      };
    }

    const isRepeated = isRepeatedStep(
      currentMove.from,
      currentMove.steps,
      hexCoords,
    );

    if (isRepeated) {
      return {
        isValid: true,
        needsAnimation: false,
      };
    }

    const lastStep = getMoveLastStep(currentMove);

    return {
      isValid: isStepValid(board!, lastStep, hexCoords),
      lastStep,
      needsAnimation: true,
    };
  }

  async function onSlotClick(isLastStep: boolean, hexCoords: HexCoordinates) {
    const { isValid, needsAnimation, lastStep } = checkIfStepIsValid(hexCoords);

    if (!isValid) return;

    if (needsAnimation && lastStep) {
      await animateStep(lastStep, hexCoords);
    }

    if (isLastStep) {
      confirmMove();
      return;
    }

    updateMove(hexCoords);
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

            const steps = currentMove?.steps;
            const isSelected = !!steps?.some(
              (step) => step.q === qIndex && step.r === rIndex,
            );

            const lastStep = steps?.[steps.length - 1];
            const isLastStep = lastStep?.q === qIndex && lastStep?.r === rIndex;

            const hexCoords = { r: rIndex, q: qIndex };

            return (
              <Slot
                key={slot.id}
                slot={slot}
                onClick={() => onSlotClick(isLastStep, hexCoords)}
                hexCoords={{ r: rIndex, q: qIndex }}
                isSelected={isSelected}
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
