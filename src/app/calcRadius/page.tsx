"use client";

import { SyntheticEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CalcRadiusPage() {
  const [smallWidth, setSmallWidth] = useState(0);
  const [horizontalGap, setHorizontalGap] = useState(0);

  const [result, setResult] = useState({
    width: 0,
    height: 0,
    verticalGap: 0,
  });

  function calculate(e: SyntheticEvent) {
    e.preventDefault();

    const smallRadius = smallWidth / 2;

    const width = 13 * smallWidth + 12 * horizontalGap;

    const verticalGap =
      (Math.sqrt(3) / 2) * horizontalGap + (Math.sqrt(3) - 2) * smallRadius;

    const height = 17 * smallWidth + 16 * verticalGap;

    setResult({ width, height, verticalGap });
  }

  return (
    <div className="flex flex-col">
      <form onSubmit={calculate}>
        <div className="flex gap-2 items-center">
          <span>Small width:</span>
          <Input
            id="small-width"
            type="number"
            value={smallWidth}
            onChange={(e) => setSmallWidth(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-2 items-center">
          <span>Horizontal gap:</span>
          <Input
            id="horizontal-gap"
            type="number"
            value={horizontalGap}
            onChange={(e) => setHorizontalGap(Number(e.target.value))}
          />
        </div>
        <Button type="submit">Calculate</Button>
      </form>
      <div className="flex flex-col gap-2">
        <div>
          <span>Width:</span>
          <span>{result.width}</span>
        </div>
        <div>
          <span>Height:</span>
          <span>{result.height}</span>
        </div>
        <div>
          <span>Vertical gap:</span>
          <span>{result.verticalGap}</span>
        </div>
      </div>
    </div>
  );
}
