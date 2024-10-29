"use client";

import { useState } from "react";

import { Slot } from "@/components/board/slot";
import { initializeBoard } from "@/helpers/board";

export function Board() {
  const [board] = useState(() => initializeBoard([1, 3, 2, 5, 4]));

  return (
    <div className="flex flex-col gap-[0px] sm:gap-0.5 rounded-full sm:px-[60px] sm:py-[26px] w-fit">
      {board.map((row, rowIndex) => (
        <div
          className="flex gap-[3px] sm:gap-[7px] justify-center"
          // eslint-disable-next-line react/no-array-index-key
          key={rowIndex}
        >
          {row.map((slot) => {
            if (!slot) return null;
            return <Slot key={slot.id} slot={slot} isSelected={false} />;
          })}
        </div>
      ))}
    </div>
  );
}
