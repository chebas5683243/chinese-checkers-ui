"use client";

import { useState } from "react";
import { initializeBoard } from "@/helpers/board";
import { cn } from "@/lib/utils";

export default function Home() {

  const [board] = useState(() => initializeBoard());

  return (
      <div className="flex flex-col gap-1 sm:gap-[6px]">
        {board.map((row, rowIndex) => (
          <div className="flex gap-[10px] sm:gap-[14px] justify-center" key={rowIndex}>
            {row.map((slot, slotIndex) => { 
              if (!slot) return null;

              return (
                <div
                  key={slotIndex}
                  className={cn("size-[18px] sm:size-6 border border-gray-300 rounded-full",
                    slot.isEmpty ? "bg-gray-100" : "bg-gray-400"
                  )}
                >
                  <span className="text-red-400">{slot.isEmpty ? "" : "a"}</span>
                </div>
              )
            })}
          </div>
        ))}
      </div>
  );
}
