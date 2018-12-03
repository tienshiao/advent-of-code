import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

interface Claim {
  id: number;
  x: number,
  y: number,
  width: number,
  height: number
}

async function part1(input: Input) {
  const { lines } = input;
  const grid = new TwoDimArray(2000, 2000, 0);

  lines.forEach(line => {
    const matches = line.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
    if (matches) {
      const claim: Claim = {
        id: Number(matches[1]),
        x: Number(matches[2]),
        y: Number(matches[3]),
        width: Number(matches[4]),
        height: Number(matches[5])
      }

      // fill;
      for (let i = claim.x; i < claim.x + claim.width; i++) {
        for (let j = claim.y; j < claim.y + claim.height; j++) {
          grid.set(i, j, grid.get(i, j) + 1);
        }
      }
    }
  });

  let overlap = 0;
  for (let i = 0; i < 2000; i++) {
    for (let j = 0; j < 2000; j++) {
      const val = grid.get(i, j);
      if (val > 1) {
        overlap++;
      }
    }
  }

  return overlap;
}

async function part2(input: Input) {
  const { lines } = input;
  const grid = new TwoDimArray(2000, 2000, 0);
  const overlaps: boolean[] = [];

  lines.forEach(line => {
    const matches = line.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/);
    if (matches) {
      const claim: Claim = {
        id: Number(matches[1]),
        x: Number(matches[2]),
        y: Number(matches[3]),
        width: Number(matches[4]),
        height: Number(matches[5])
      }

      // fill;
      for (let i = claim.x; i < claim.x + claim.width; i++) {
        for (let j = claim.y; j < claim.y + claim.height; j++) {
          const val = grid.get(i, j);
          if (val) {
            overlaps[val] = true;
            overlaps[claim.id] = true;
          }
          grid.set(i, j, claim.id);
        }
      }
    }
  });

  for (let i = 1; i < lines.length + 1; i++) {
    if (!overlaps[i]) {
      return i;
    }
  }
}

module.exports = [
  part1,
  part2
];
