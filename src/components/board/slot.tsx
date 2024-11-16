import { Z_INDEX_PIECE, Z_INDEX_SLOT } from "@/constants/z-indexes";
import type { Slot as ISlot } from "@/helpers/board";
import { printHex } from "@/helpers/hex";
import { getPieceId, getSlotId } from "@/helpers/slot";
import { Group } from "@/models/group";
import { HexCoordinates } from "@/models/turn";
import { cn } from "@/utils/cn";

interface SlotProps {
  slot: ISlot;
  isInCurrentPath: boolean;
  onClick: () => void;
  hexCoords: HexCoordinates;
  isLastMove: boolean;
}

export function Slot({
  slot,
  isInCurrentPath,
  onClick,
  hexCoords,
  isLastMove,
}: SlotProps) {
  const pieceId = getPieceId(hexCoords);
  const slotId = getSlotId(hexCoords);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        aria-label={slotId}
        id={slotId}
        type="button"
        style={{ zIndex: Z_INDEX_SLOT }}
        className={cn(
          "flex justify-center items-center",
          "size-[20px] sm:size-[30px] rounded-full",
          "ring-1 ring-gray-300 ring-opacity-50",
          "hover:ring-2 hover:ring-purple-300",
          "bg-hole-sphere",
        )}
      >
        <span style={{ fontSize: "4px" }}>{printHex(hexCoords)}</span>
      </button>
      {slot.group !== undefined && (
        <button
          onClick={onClick}
          aria-label={pieceId}
          id={pieceId}
          type="button"
          style={{ zIndex: Z_INDEX_PIECE }}
          className={cn(
            "absolute top-0 left-0",
            "flex justify-center items-center",
            "size-[20px] sm:size-[30px] rounded-full",
            "ring-1 ring-gray-300 ring-opacity-50",
            "hover:ring-2 hover:ring-purple-300",
            {
              "ring sm:ring-2 ring-purple-600 hover:ring-purple-600":
                isLastMove,
            },
            {
              "bg-red-sphere": slot.group === Group.GROUP_1,
              "bg-blue-sphere": slot.group === Group.GROUP_2,
              "bg-yellow-sphere": slot.group === Group.GROUP_3,
              "bg-green-sphere": slot.group === Group.GROUP_4,
              "bg-white-sphere": slot.group === Group.GROUP_5,
              "bg-black-sphere": slot.group === Group.GROUP_6,
            },
          )}
        >
          <span style={{ fontSize: "4px" }}>{printHex(hexCoords)}</span>
          {isInCurrentPath && (
            <div className="size-1 bg-purple-600 rounded-full" />
          )}
        </button>
      )}
    </div>
  );
}
