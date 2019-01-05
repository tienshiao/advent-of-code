import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

function calcPowerCell(serial: number, x: number, y: number): number {
  const rackId = x + 10;
  let powerLevel = rackId * y;
  powerLevel = powerLevel + serial;
  powerLevel = powerLevel * rackId;
  powerLevel = Math.trunc(powerLevel / 100 % 10);
  powerLevel = powerLevel - 5;
  return powerLevel;
}

function calcPowerSquare(serial: number, grid: TwoDimArray<number>, x: number, y: number, size = 3) {
  let total = 0;
  for (let dx = 0; dx < size; dx++) {
    for (let dy = 0; dy < size; dy++) {
      // const cache = grid.get(x+dx, y+dy);
      // if (cache > Number.MIN_VALUE) {
      //   total += cache;
      // } else {
      const newVal = calcPowerCell(serial, x + dx, y + dy);
        // grid.set(x+dx, y+dy, newVal);
        total += newVal;
      // }
    }
  }

  return total;
}

async function part1(input: Input) {
  const serial = Number(input.lines[0].trim());
  const grid = new TwoDimArray(300, 300, -10000);

  let maxPower = Number.MIN_VALUE;
  let maxX = 0;
  let maxY = 0;
  for (let x = 0; x < 300-3; x++) {
    for (let y = 0; y < 300-3; y++) {
      const power = calcPowerSquare(serial, grid, x, y, 3);
      if (power > maxPower) {
        maxPower = power;
        maxX = x;
        maxY = y;
      }
    }
  }

  return `${maxX},${maxY}`;
}

async function part2(input: Input) {
  const serial = Number(input.lines[0].trim());
  const grid = new TwoDimArray(300, 300, -10000);

  let maxPower = Number.MIN_VALUE;
  let maxX = 0;
  let maxY = 0;
  let maxS = 0;
  for (let x = 0; x < 300; x++) {
    for (let y = 0; y < 300; y++) {
      console.log(x, y);
      console.log(maxX, maxY, maxS);
      for (let s = 1; s < (300 - Math.max(x, y)); s++) {
        const power = calcPowerSquare(serial, grid, x, y, s);
        if (power > maxPower) {
          maxPower = power;
          maxX = x;
          maxY = y;
          maxS = s;
        }
      }
    }
  }

  return `${maxX},${maxY},${maxS}`;
}

module.exports = [
  part1,
  part2
];
