import { getPieceId, getSlotId } from "./slot";
import { Z_INDEX_MOVING_PIECE } from "@/constants/z-indexes";
import { HexCoordinates } from "@/models/turn";

export async function animateMove(from: HexCoordinates, to: HexCoordinates) {
  const piece = document.getElementById(getPieceId(from));
  const slot = document.getElementById(getSlotId(to));

  if (!piece || !slot) return;

  piece.style.zIndex = Z_INDEX_MOVING_PIECE.toString();

  const pieceRect = piece.getBoundingClientRect();
  const slotRect = slot.getBoundingClientRect();

  const deltaX = slotRect.x - pieceRect.x;
  const deltaY = slotRect.y - pieceRect.y;

  const animation = piece.animate(
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
