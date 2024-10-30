import { HexCoordinates } from "@/models/move";

export function hexSum(
  hex1: HexCoordinates,
  hex2: HexCoordinates,
): HexCoordinates {
  return {
    q: hex1.q + hex2.q,
    r: hex1.r + hex2.r,
  };
}

export function hexSubtract(
  hex1: HexCoordinates,
  hex2: HexCoordinates,
): HexCoordinates {
  return {
    q: hex1.q - hex2.q,
    r: hex1.r - hex2.r,
  };
}

export function hexMultiplty(hex: HexCoordinates, k: number): HexCoordinates {
  return {
    q: hex.q * k,
    r: hex.r * k,
  };
}

export function hexDivide(hex: HexCoordinates, k: number): HexCoordinates {
  return {
    q: hex.q / k,
    r: hex.r / k,
  };
}

export function hexCompare(
  hex1: HexCoordinates,
  hex2: HexCoordinates,
): boolean {
  return hex1.q === hex2.q && hex1.r === hex2.r;
}
