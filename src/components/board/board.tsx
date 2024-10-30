"use client";

import { useEffect } from "react";

import { Slot } from "@/components/board/slot";
import { isRepeatedStep, isStepValid } from "@/helpers/move";
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
  } = useGame();

  useEffect(() => {
    startGame();
  }, [startGame]);

  if (isCreatingGame || !board) {
    return <div>Cargando</div>;
  }

  // function animateStep(from: HexCoordinates, to: HexCoordinates) {
  //   const fromSlot = document.getElementById(`Slot ${from.r},${from.q}`);
  //   const toSlot = document.getElementById(`Slot ${to.r},${to.q}`);

  //   if (!fromSlot || !toSlot) return;

  //   const fromSlotRect = fromSlot.getBoundingClientRect();
  //   const toSlotRect = toSlot.getBoundingClientRect();

  //   const deltaX = toSlotRect.x - fromSlotRect.x;
  //   const deltaY = toSlotRect.y - fromSlotRect.y;

  //   fromSlot.animate(
  //     [
  //       { transform: `translate(0px, 0px)` },
  //       { transform: `translate(${deltaX}px, ${deltaY}px)` },
  //     ],
  //     {
  //       duration: 500,
  //       easing: "ease-in-out",
  //     },
  //   );
  // }

  function checkIfStepIsValid(hexCoords: HexCoordinates) {
    if (!currentMove) {
      return {
        isValid: true,
        isRepeated: false,
      };
    }

    if (isRepeatedStep(currentMove.from, currentMove.steps, hexCoords)) {
      return {
        isValid: true,
        isRepeated: true,
      };
    }

    const lastStep =
      currentMove.steps[currentMove.steps.length - 1] ?? currentMove.from;

    return {
      isValid: isStepValid(board!, lastStep, hexCoords),
      isRepeated: false,
    };
  }

  function onSlotClick(isLastStep: boolean, hexCoords: HexCoordinates) {
    const { isValid } = checkIfStepIsValid(hexCoords);

    if (!isValid) return;

    // const lastStep =
    //   currentMove?.steps[currentMove.steps.length - 1] ?? currentMove?.from;

    // if (!isRepeated && currentMove && lastStep) {
    //   console.log(lastStep, hexCoords);
    //   animateStep(lastStep, hexCoords);
    // }

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
