import { getPieceId, getSlotId } from "./slot";
import { Z_INDEX_MOVING_PIECE } from "@/constants/z-indexes";
import { HexCoordinates } from "@/models/move";

export async function animateStepMovement(
  from: HexCoordinates,
  to: HexCoordinates,
) {
  const fromSlot = document.getElementById(getPieceId(from));
  const toSlot = document.getElementById(getSlotId(to));

  if (!fromSlot || !toSlot) return;

  fromSlot.style.zIndex = Z_INDEX_MOVING_PIECE.toString();

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
