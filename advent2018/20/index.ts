import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

interface Cell {
  n: boolean;
  e: boolean;
  s: boolean;
  w: boolean;
}

interface Extent {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}

interface Position {
  x: number;
  y: number;
}

function drawPath(x: number, y: number, expr: string[], map: TwoDimArray<Cell>) {
  let i = 0;

  let currX = x;
  let currY = y;

  while (i < expr.length) {
    if (expr[i] === '(') {
      i++;
      let openParens = 1;
      const inner = [];
      while (openParens) {
        if (expr[i] === '(') {
          openParens++;
        } else if (expr[i] === ')') {
          openParens--;
        }
        inner.push(expr[i]);
        i++;
      }
      inner.pop();

      const branches: string[][] = [];
      // split by | at top level
      let branch: string[] = [];
      let depth = 0;
      inner.forEach(dir => {
        if (dir === '(') {
          branch.push(dir);
          depth++;
        } else if (dir === ')') {
          branch.push(dir);
          depth--;
        } else if (dir === '|' && depth === 0) {
          branches.push(branch);
          branch = [];
        } else {
          branch.push(dir);
        }
      });
      branches.push(branch);
      // console.log(inner.join(''), branches);

      // loop through and execute recursively
      branches.forEach(branch => {
        drawPath(currX, currY, branch, map);
      });
    } else {
      const dir = expr[i];
      if (dir === 'N') {
        const oldCell = map.get(currX, currY);
        map.set(currX, currY, { ...oldCell, n: true });
        currY--;
        const newCell = map.get(currX, currY);
        map.set(currX, currY, { ...newCell, s: true });
      } else if (dir === 'E') {
        const oldCell = map.get(currX, currY);
        map.set(currX, currY, { ...oldCell, e: true });
        currX++;
        const newCell = map.get(currX, currY);
        map.set(currX, currY, { ...newCell, w: true });
      } else if (dir === 'S') {
        const oldCell = map.get(currX, currY);
        map.set(currX, currY, { ...oldCell, s: true });
        currY++;
        const newCell = map.get(currX, currY);
        map.set(currX, currY, { ...newCell, n: true });
      } else if (dir === 'W') {
        const oldCell = map.get(currX, currY);
        map.set(currX, currY, { ...oldCell, w: true });
        currX--;
        const newCell = map.get(currX, currY);
        map.set(currX, currY, { ...newCell, e: true });
      } else {
        console.log('Unexpected', dir);
      }
      i++;
    }
  }
}

function makeMap(dimension: number, line: string) {
  const center = dimension/2;
  const expr = line.split('').slice(1, -1);
  const map = new TwoDimArray(dimension, dimension, { n: false, e: false, s: false, w: false});

  let x = center;
  let y = center;

  drawPath(x, y, expr, map);

  return map;
}

function findExtent(map: TwoDimArray<Cell>) {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const { n, e, s, w } = map.get(x, y);
      if (n || e || s || w) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  return {
    minX, minY,
    maxX, maxY
  }
}

function printMap(currX: number, currY: number, map: TwoDimArray<Cell>, extent: Extent) {

  let output = '';
  for (let y = extent.minY; y <= extent.maxY; y++) {
    let top = '';
    let middle = '';
    for (let x = extent.minX; x <= extent.maxX; x++) {
      const cell = map.get(x, y);
      if (cell.n) {
        top += '#-';
      } else {
        top += '##';
      }
      if (cell.w) {
        middle += '|';
      } else {
        middle += '#';
      }

      if (currX === x && currY === y) {
        middle += 'X';
      } else {
        middle += '.';
      }

      if (x === extent.maxX) {
        top += '#';
        middle += '#';
      }
    }
    output += top + '\n' + middle + '\n';

    if (y === extent.maxY) {
      for (let i = extent.minX; i <= extent.maxX; i++) {
        output += '##';
      }
      output += '#';
    }
  }

  console.log(output);
}

interface BFSState {
  position: Position;
  depth: number;
}

function linearPosition(pos: Position, width: number) {
  return pos.y * width + pos.x;
}

function bfs(from: Position, to: Position, map: TwoDimArray<Cell>): number {
  const visited: boolean[] = [];
  const queue = [{
    position: from,
    depth: 0
  }];

  while(queue.length) {
    const { position, depth } = queue.shift()!;
    if (visited[linearPosition(position, map.width)]) {
      continue;
    }
    visited[linearPosition(position, map.width)] = true;

    if (position.x === to.x && position.y === to.y) {
      return depth;
    }

    const cell = map.get(position.x, position.y);

    if (cell.n) {
      queue.push({
        position: { x: position.x, y: position.y - 1 },
        depth: depth + 1
      })
    }
    if (cell.e) {
      queue.push({
        position: { x: position.x + 1, y: position.y },
        depth: depth + 1
      })
    }
    if (cell.s) {
      queue.push({
        position: { x: position.x, y: position.y + 1 },
        depth: depth + 1
      })
    }
    if (cell.w) {
      queue.push({
        position: { x: position.x - 1, y: position.y },
        depth: depth + 1
      })
    }
  }

  return 0;
}

async function part1(input: Input) {
  const dim = 2000;
  const center = dim/2;
  const map = makeMap(dim, input.lines[0].trim());
  const extent = findExtent(map);

  printMap(center, center, map, extent);

  let maxD = 0;
  for (let y = extent.minY; y <= extent.maxY; y++) {
    for (let x = extent.minX; x <= extent.maxX; x++) {
      const distance = bfs({ x: center, y: center }, { x, y }, map);
      if (distance > maxD) {
        maxD = distance;
      }
    }
  }

  return maxD;
}

async function part2(input: Input) {
  const limit = 1000;
  const dim = 2000;
  const center = dim/2;
  const map = makeMap(dim, input.lines[0].trim());
  const extent = findExtent(map);

  printMap(center, center, map, extent);

  let count = 0;
  for (let y = extent.minY; y <= extent.maxY; y++) {
    for (let x = extent.minX; x <= extent.maxX; x++) {
      const distance = bfs({ x: center, y: center }, { x, y }, map);
      if (distance >= limit) {
        count++
      }
    }
  }

  return count;
}

module.exports = [
  part1,
  part2
];
