import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

interface Vector {
  x: number,
  y: number,
  dx: number,
  dy: number
}

function calcHeight(vectors: Vector[]) {
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;

  vectors.forEach(v => {
    if (v.y < minY) {
      minY = v.y;
    }
    if (v.y > maxY) {
      maxY = v.y;
    }
  });

  return maxY - minY + 1;
}

function print(vectors: Vector[]) {
  let minY = Number.MAX_VALUE;
  let maxY = Number.MIN_VALUE;
  let minX = Number.MAX_VALUE;
  let maxX = Number.MIN_VALUE;

  vectors.forEach(v => {
    if (v.y < minY) {
      minY = v.y;
    }
    if (v.y > maxY) {
      maxY = v.y;
    }
    if (v.x < minX) {
      minX = v.x;
    }
    if (v.x > maxX) {
      maxX = v.x;
    }
  });

  let height = maxY - minY + 1;
  let width = maxX - minX + 1;
  const sky = new TwoDimArray(width, height, '.' );
  vectors.forEach(v => {
    sky.set(v.x - minX, v.y - minY, '#');
  });

  let string = '';
  for (let y = 0; y < height; y++) {
    string = '';
    for (let x = 0; x < width; x++) {
      string += sky.get(x, y);
    }
    console.log(string);
  }
}

async function part1(input: Input) {
  let vectors: Vector[] = input.lines.map(line => {
    const match = line.match(/position=<\s*([\-\d]+),\s*([\-\d]+)> velocity=<\s*([\-\d]+),\s*([\-\d]+)>/);
    if (match) {
      return {
        x: Number(match[1]),
        y: Number(match[2]),
        dx: Number(match[3]),
        dy: Number(match[4])
      };
    } else {
      return {
        x: 0,
        y: 0,
        dx: 0,
        dy: 0
      };
    }
  });

  // print(vectors);

  let seconds = 0;
  let lastHeight = Number.MAX_VALUE;
  let lastVectors: Vector[] = [];
  while (true) {
    const height = calcHeight(vectors);
    console.log(seconds, height);
    if (height < lastHeight) {
      lastHeight = height;
    } else if (height > lastHeight) {
      break;
    }

    lastVectors = vectors;
    vectors = vectors.map(v => ({
      x: v.x + v.dx,
      y: v.y + v.dy,
      dx: v.dx,
      dy: v.dy
    }));

    seconds++;
    // console.log(seconds);
    // print(vectors);
  }

  print(lastVectors);
}

async function part2(input: Input) {
}

module.exports = [
  part1,
  part2
];
