function calcGapY(y, r) {
  return (Math.sqrt(3) * y) / 2 + (Math.sqrt(3) - 1) * r;
}

const gapY = calcGapY(2, 4);

console.log(gapY);
