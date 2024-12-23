import { getPieceId, getSlotId } from "./slot";
import { Z_INDEX_MOVING_PIECE } from "@/constants/z-indexes";
import { HexCoordinates, Turn } from "@/models/turn";

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
      { transform: `scale(1) translate(${deltaX}px, ${deltaY}px)` },
    ],
    {
      duration: 500,
      easing: "ease-in",
    },
  );

  await animation.finished;
}

export async function animateIncomingTurn(turn: Turn) {
  const animationSequence = [{ transform: `scale(1) translate(0px, 0px)` }];
  const animationOptions = {
    duration: 500 * turn.moves.length,
    easing: "ease-in",
  };

  const piece = document.getElementById(getPieceId(turn.from));

  if (!piece) return;

  piece.style.zIndex = Z_INDEX_MOVING_PIECE.toString();

  const baseRect = piece.getBoundingClientRect();

  for (let i = 0; i < turn.moves.length; i += 1) {
    const slot = document.getElementById(getSlotId(turn.moves[i]));

    if (!slot) return;

    const slotRect = slot.getBoundingClientRect();

    const deltaXPieceFromSlot = slotRect.x - baseRect.x;
    const deltaYPieceFromSlot = slotRect.y - baseRect.y;

    animationSequence.push({
      transform: `scale(1) translate(${deltaXPieceFromSlot}px, ${deltaYPieceFromSlot}px)`,
    });
  }

  const animation = piece.animate(animationSequence, animationOptions);

  await animation.finished;
}
