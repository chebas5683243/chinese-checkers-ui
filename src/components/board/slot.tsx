import type { Slot as ISlot } from "@/helpers/board";
import { cn } from "@/lib/utils";

interface SlotProps {
  slot: ISlot;
  isSelected: boolean;
}

export function Slot({ slot, isSelected }: SlotProps) {
  return (
    <div
      className={cn(
        "size-[20px] sm:size-[30px] rounded-full",
        "ring-1 ring-gray-300 ring-opacity-50",
        "hover:ring-2 hover:ring-purple-300",
        {
          "ring sm:ring-2 ring-purple-600 hover:ring-purple-600": isSelected,
        },
        {
          "bg-hole-sphere": slot.group === undefined,
          "bg-red-sphere": slot.group === 1,
          "bg-blue-sphere": slot.group === 2,
          "bg-yellow-sphere": slot.group === 3,
          "bg-green-sphere": slot.group === 4,
          "bg-white-sphere": slot.group === 5,
          "bg-black-sphere": slot.group === 6,
        },
      )}
    />
  );
}
