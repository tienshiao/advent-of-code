import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';
import PriorityQueue from 'ts-priority-queue';
import { ADDRGETNETWORKPARAMS } from 'dns';

function makeMap(depth: number, targetX: number, targetY: number, width: number, height: number) {
  const map = new TwoDimArray(width, height, 0);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x< width; x++) {
      let geoIndex;
      if (x === 0 && y === 0) {
        geoIndex = 0;
      } else if (x === targetX && y === targetY) {
        geoIndex = 0;
      } else if (y === 0) {
        geoIndex = x * 16807;
      } else if (x === 0) {
        geoIndex = y * 48271;
      } else {
        geoIndex = map.get(x-1, y) * map.get(x, y-1);
      }

      const erosion = (geoIndex + depth) % 20183;
      map.set(x, y, erosion);
    }
  }

  return map;
}

function printMap(map: TwoDimArray<number>, targetX: number, targetY: number) {
  let output = '';
  for (let y = 0; y <= targetY * 1.5; y++) {
    for (let x = 0; x<= targetX * 1.5; x++) {
      const erosion = map.get(x, y);
      const type = erosion % 3;
      if (type === 0) {
        output += '.';
      } else if (type === 1) {
        output += '=';
      } else if (type === 2) {
        output += '|';
      }
    }
    output += '\n';
  }

  console.log(output);
}

function calcRisk(map: TwoDimArray<number>) {
  let risk = 0;
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const erosion = map.get(x, y);
      risk += erosion % 3;
    }
  }

  return risk;
}

function makeKey(position: number, tool: string) {
  return `${position},${tool}`;
}

function parseKey(key: string): { position: number, tool: string } {
  const parts = key.split(',');
  return {
    position: Number(parts[0]),
    tool: parts[1]
  }
}

function findNextPosition(visited: { [key: string]: boolean }, distance: { [key: string]: number }, map: TwoDimArray<number>): { key: string, cost: number } {
  let minDistance = Number.MAX_SAFE_INTEGER;
  let minKey = '';

  Object.keys(distance).forEach(key => {
    const v = visited[key];
    if (!v) {
      const d = distance[key];
      if (d < minDistance) {
        minDistance = d;
        minKey = key;
      }
    }
  });

  return {
    key: minKey,
    cost : minDistance
  };
}

interface AdjacentPaths {
  position: number;
  tool: string;
}

function findAdjacentPositions(position: number, visited: { [key: string]: boolean }, map: TwoDimArray<number>): AdjacentPaths[] {
  const adjacent: AdjacentPaths[] = [];
  const x = position % map.width;
  const y = Math.floor(position / map.width);
  const tools = ['c', 't', 'n'];

  for (let y2 = y - 1; y2 <= y + 1; y2++) {
    for (let x2 = x - 1; x2 <= x + 1; x2++) {
      if (x2 < 0 || x2 >= map.width || y2 < 0 || y2 >= map.height) {
        continue;
      }

      // no diagonals
      if (Math.abs(y2 - y) +  Math.abs(x2 - x) > 1) {
        continue;
      }

      const newPos = y2 * map.width + x2;
      for (let t of tools) {
        if (visited[makeKey(newPos, t)]) {
          continue;
        }
        adjacent.push({ position: newPos, tool: t });
      }
    }
  }

  return adjacent;
}

function checkTool(type: number, tool: string) {
  if (type === 0) {
    return tool === 'c' || tool === 't';
  } else if (type === 1) {
    return tool === 'c' || tool === 'n';
  } else if (type === 2) {
    return tool === 't' || tool === 'n';
  }
}

function findCost(position: number, curTool: string, adjacent: number, newTool: string, map: TwoDimArray<number>): number {
  const pX = position % map.width;
  const pY = Math.floor(position / map.width);
  const aX = adjacent % map.width;
  const aY = Math.floor(adjacent / map.width);
  const currRegion = map.get(pX, pY) % 3;
  const nextRegion = map.get(aX, aY) % 3;

  let cost = position === adjacent ? 0 : 1;

  // if (adjacent === 1) console.log(currRegion, curTool, nextRegion, newTool);
  // check if we can actually switch to the tool
  if (!checkTool(currRegion, newTool)) {
    // if (adjacent === 1) console.log('failed curr region');
    return Number.MAX_SAFE_INTEGER;
  } else if (!checkTool(nextRegion, newTool)) {
    // if (adjacent === 1) console.log('failed new region');
    return Number.MAX_SAFE_INTEGER;
  }

  if (curTool !== newTool) {
    cost += 7;
  }

  return cost;
}

async function part1(input: Input) {
  const depth = Number(input.lines[0].match(/(\d+)/)![1]);
  const [_, targetX, targetY] = input.lines[1].match(/(\d+),(\d+)/)!.map(s => Number(s));
  console.log(`Depth: ${depth}; Target: ${targetX}, ${targetY}`);

  const map = makeMap(depth, targetX, targetY, 2000, 2000);

  return calcRisk(map);
}

async function part2(input: Input) {
  const width = 100;
  const height = 1000;
  const depth = Number(input.lines[0].match(/(\d+)/)![1]);
  const [_, targetX, targetY] = input.lines[1].match(/(\d+),(\d+)/)!.map(s => Number(s));
  console.log(`Depth: ${depth}; Target: ${targetX}, ${targetY}`);


  const map = makeMap(depth, targetX, targetY, width, height);
  const targetKey = makeKey(targetY * map.width + targetX, 't');

  printMap(map, targetX, targetY);

  // key = position,tool
  const visited: { [key: string]: boolean } = {};
  const distance: { [key: string]: number } = {};
  distance[makeKey(0, 't')] = 1;

  while (true) {
    // find position not visited with minimum distance value
    const { key, cost } = findNextPosition(visited, distance, map);
    console.log('found next', parseKey(key), cost);
    const { position, tool } = parseKey(key);
    // if position is target, break and return with distance
    if (key === targetKey) {
      return cost - 1;
    }

    visited[key] = true;

    // find adjacent positions
    const adjacent: AdjacentPaths[] = findAdjacentPositions(position, visited, map);
    // update distances
    adjacent.forEach(adj => {
      const cost = findCost(position, tool, adj.position, adj.tool, map);
      // console.log(position, tool, adj, cost);
      if (cost < Number.MAX_SAFE_INTEGER) {
        const newD = distance[key] + cost;
        const newKey = makeKey(adj.position, adj.tool);
        const oldD = distance[newKey] || Number.MAX_SAFE_INTEGER;
        if (newD < oldD) {
          distance[newKey] = newD;
        }
      }
    });
  }
}

module.exports = [
  part1,
  part2
];
