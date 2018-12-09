import { Input } from '../interfaces';

interface Point {
  x: number,
  y: number
}

function calcDistance(p1: Point, p2: Point) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

async function part1(input: Input) {
  const points: Point[] = input.lines.map(line => {
    const match = line.match(/^(\d+), (\d+)$/);
    if (match) {
      return {
        x: Number(match[1]),
        y: Number(match[2])
      }
    } else {
      return { x: 0, y: 0 };
    }
  });

  console.log(points);

  let minX = 9999999999;
  let minXpoints: number[] = [];
  let minY = 9999999999;
  let minYpoints: number[] = [];
  let maxX = 0;
  let maxXpoints: number[] = [];
  let maxY = 0;
  let maxYpoints: number[] = [];
  // find min/max values and discard those
  points.forEach((p, index) => {
    if (p.x < minX) {
      minX = p.x;
      minXpoints = [index];
    } else if (p.x === minX) {
      minXpoints.push(index);
    }

    if (p.x > maxX) {
      maxX = p.x;
      maxXpoints = [index];
    } else if (p.x === maxX) {
      maxXpoints.push(index);
    }

    if (p.y < minY) {
      minY = p.y;
      minYpoints = [index];
    } else if (p.y === minY) {
      minYpoints.push(index);
    }

    if (p.y > maxY) {
      maxY = p.y;
      maxYpoints = [index];
    } else if (p.y === maxY) {
      maxYpoints.push(index);
    }
  });

  console.log(minX, minY);
  console.log(maxX, maxY);

  const blacklist: number[] = [...minXpoints, ...maxXpoints, ...minYpoints, ...maxYpoints];
  const closest1: { [key: number]: number } = {};

  for (let x = -1000; x < 1000; x++) {
    for (let y = -1000; y < 1000; y++) {
      let min = 9999999;
      let index = -1;
      for (let i = 0; i < points.length; i++) {
        const distance = calcDistance({x, y}, points[i]);
        if (distance < min) {
          min = distance;
          index = i;
        } else if (distance === min) {
          index = -1;
        }
      }
      closest1[index] = closest1[index] ? closest1[index] + 1 : 1;
    }
  }


  const closest2: { [key: number]: number } = {};
  for (let x = -500; x < 500; x++) {
    for (let y = -500; y < 500; y++) {
      let min = 9999999;
      let index = -1;
      for (let i = 0; i < points.length; i++) {
        const distance = calcDistance({x, y}, points[i]);
        if (distance < min) {
          min = distance;
          index = i;
        } else if (distance === min) {
          index = -1;
        }
      }
      closest2[index] = closest2[index] ? closest2[index] + 1 : 1;
    }
  }


  console.log(closest1);
  console.log(closest2);
  console.log(blacklist);
  let max = 0;
  // diff closest1 and closest2, ignore if it changes
  for (let i = 0; i < points.length; i++) {
    if (closest1[i] === closest2[i]) {
      if (closest1[i] > max) {
        max = closest1[i];
      }
    }
  }

  return max;
}

async function part2(input: Input) {
  const totalMax = 10000;

  const points: Point[] = input.lines.map(line => {
    const match = line.match(/^(\d+), (\d+)$/);
    if (match) {
      return {
        x: Number(match[1]),
        y: Number(match[2])
      }
    } else {
      return { x: 0, y: 0 };
    }
  });


  let safe = 0;
  for (let x = 0; x < 500; x++) {
    for (let y = 0; y < 500; y++) {
      let total = 0;
      for (let i = 0; i < points.length; i++) {
        const distance = calcDistance({x, y}, points[i]);
        total += distance;
        if (total > totalMax) {
          break;
        }
      }
      if (total < totalMax) {
        safe++;
      }
    }
  }

  return safe;
}

module.exports = [
  part1,
  part2
];
