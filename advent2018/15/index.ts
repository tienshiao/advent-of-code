import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

enum UnitType {
  Goblin = 'G',
  Elf = 'E'
}

interface DistanceAndPath {
  distance: number;
  path: Position[];
}

interface Position {
  x: number;
  y: number;
}

interface PositionCandidate extends Position {
  distance: number;
  path: Position[];
}

interface Unit {
  type: UnitType;
  attack: number;
  hitPoints: number;
  x: number;
  y: number;
}

function printState(rounds: number, units: Unit[], map: TwoDimArray<string>) {
  console.log(rounds);

  let output = '';
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const unit = units.find(u => u.x === x && u.y === y);
      if (unit) {
        output += unit.type;
      } else {
        output += map.get(x, y);
      }
    }
    output += '\n';
  }
  console.log(output);
  console.log(units);
}

function calcPosScore(pos: Position, map: TwoDimArray<string>) {
  return pos.y * map.width + pos.x;
}

function isOccupied(pos: Position, units: Unit[]): boolean {
  return !!units.find(u => u.x === pos.x && u.y === pos.y);
}

function isOpen(pos: Position, units: Unit[], map: TwoDimArray<string>): boolean {
  return map.get(pos.x, pos.y) === '.' && !isOccupied(pos, units);
}

function findInRange(unit: Unit, units: Unit[]): Unit[] {
  return units
    .filter(u => u.type !== unit.type)
    .filter(e => Math.abs(e.x - unit.x) + Math.abs(e.y - unit.y) === 1);
}

interface BfsState {
  position: Position;
  depth: number,
  path: Position[]
}

// returns null if unreachable
function calcDistanceAndPath(from: Position, to: Position, units: Unit[], map: TwoDimArray<string>): DistanceAndPath | null {
  // implement BFS
  const queue: BfsState[] = [{
    position: from,
    depth: 0,
    path: []
  }];
  const visited = [];

  while (queue.length) {
    let { position, depth, path } = queue.shift()!;

    // is this the destination?
    if (position.x === to.x && position.y === to.y) {
      return {
        distance: depth,
        path: [...path, to]
      };
    }

    // nope
    visited[calcPosScore(position, map)] = true;

    // QUESTION: is it sufficient to queue in reading order? maybe
    let newPos = {
      x: position.x,
      y: position.y - 1
    }
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: newPos,
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }

    newPos = {
      x: position.x - 1,
      y: position.y
    };
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: {
            x: position.x - 1,
            y: position.y
          },
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }

    newPos = {
      x: position.x + 1,
      y: position.y
    };
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: {
            x: position.x + 1,
            y: position.y
          },
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }

    newPos = {
      x: position.x,
      y: position.y + 1
    }
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: {
            x: position.x,
            y: position.y + 1
          },
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }
  }
  return null;
}

function move(unit: Unit, units: Unit[], map: TwoDimArray<string>) {
  const enemies = units.filter(u => u.type !== unit.type);
  // find in range
  const positionCandidates: PositionCandidate[] = [];
  enemies.forEach(e => {
    if (isOpen({ x: e.x, y: e.y - 1 }, units, map)) {
      const dp = calcDistanceAndPath(unit, { x: e.x, y: e.y - 1}, units, map);
      if (dp) {
        positionCandidates.push({
          x: e.x,
          y: e.y - 1,
          ...dp
        });
      }
    }
    if (isOpen({ x: e.x - 1, y: e.y }, units, map)) {
      const dp = calcDistanceAndPath(unit, { x: e.x - 1, y: e.y }, units, map);
      if (dp) {
        positionCandidates.push({
          x: e.x - 1,
          y: e.y,
          ...dp
        });
      }
    }
    if (isOpen({ x: e.x + 1, y: e.y }, units, map)) {
      const dp = calcDistanceAndPath(unit, { x: e.x + 1, y: e.y }, units, map);
      if (dp) {
        positionCandidates.push({
          x: e.x + 1,
          y: e.y,
          ...dp
        });
      }
    }
    if (isOpen({ x: e.x, y: e.y + 1}, units, map)) {
      const dp = calcDistanceAndPath(unit, { x: e.x, y: e.y + 1 }, units, map);
      if (dp) {
        positionCandidates.push({
          x: e.x,
          y: e.y + 1 ,
          ...dp
        });
      }
    }
  });

  if (positionCandidates.length === 0) {
    // no reachable destinations
    return;
  }

  // find nearest
  // sort by distance, reading order
  const chosen = positionCandidates.sort((a, b) => {
    if (a.distance != b.distance) {
      return a.distance - b.distance;
    } else {
      return calcPosScore(a, map) - calcPosScore(b, map);
    }
  })[0];

  unit.x = chosen.path[1].x;
  unit.y = chosen.path[1].y;
}

function move2(unit: Unit, units: Unit[], map: TwoDimArray<string>) {
  const enemies = units.filter(u => u.type !== unit.type);

  const positionCandidates: Position[] = [];
  enemies.forEach(e => {
    if (isOpen({ x: e.x, y: e.y - 1 }, units, map)) {
      positionCandidates.push({
        x: e.x,
        y: e.y - 1
      });
    }
    if (isOpen({ x: e.x - 1, y: e.y }, units, map)) {
      positionCandidates.push({
        x: e.x - 1,
        y: e.y,
      });
    }
    if (isOpen({ x: e.x + 1, y: e.y }, units, map)) {
      positionCandidates.push({
        x: e.x + 1,
        y: e.y,
      });
    }
    if (isOpen({ x: e.x, y: e.y + 1}, units, map)) {
      positionCandidates.push({
        x: e.x,
        y: e.y + 1 ,
      });
    }
  });

  if (positionCandidates.length === 0) {
    // no reachable destinations
    return;
  }

  // implement BFS
  const queue: BfsState[] = [{
    position: { x: unit.x, y: unit.y },
    depth: 0,
    path: []
  }];
  const visited = [];

  while (queue.length) {
    let { position, depth, path } = queue.shift()!;
    if (visited[calcPosScore(position, map)]) {
      continue;
    }

    // console.log('checking', position, depth);

    // is this the destination?
    // TODO: don't use enemies directly, if they're all surrounded we end up doing full BFS, should incorporate beginning of move1
    if (positionCandidates.find(e => e.x === position.x && e.y === position.y)) {
      path = [...path, position];
      unit.x = path[1].x;
      unit.y = path[1].y;
      return;
    }

    // nope
    visited[calcPosScore(position, map)] = true;

    // QUESTION: is it sufficient to queue in reading order? maybe
    let newPos = {
      x: position.x,
      y: position.y - 1
    }
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: newPos,
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }

    newPos = {
      x: position.x - 1,
      y: position.y
    };
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: {
            x: position.x - 1,
            y: position.y
          },
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }

    newPos = {
      x: position.x + 1,
      y: position.y
    };
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: {
            x: position.x + 1,
            y: position.y
          },
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }

    newPos = {
      x: position.x,
      y: position.y + 1
    }
    if (isOpen(newPos, units, map)) {
      if (!visited[calcPosScore(newPos, map)]) {
        queue.push({
          position: {
            x: position.x,
            y: position.y + 1
          },
          depth: depth + 1,
          path: [...path, position]
        });
      }
    }
  }
}

function attack(unit: Unit, enemies: Unit[], map: TwoDimArray<string>) {
  const sortedEnemies = enemies.sort((a, b) => {
    if (a.hitPoints !== b.hitPoints) {
      return a.hitPoints - b.hitPoints;
    } else {
      return calcPosScore(a, map) - calcPosScore(b, map);
    }
  });

  const target = sortedEnemies[0];
  target.hitPoints -= unit.attack;
}

async function part1(input: Input, elfPower = 3) {
  let units: Unit[] = [];
  const map = new TwoDimArray(input.lines[0].length, input.lines.length, '#');

  // load map
  input.lines.forEach((line, y) => {
    line.split('').forEach((cell, x) => {
      if (cell === 'G') {
        units.push({
          type: UnitType.Goblin,
          hitPoints: 200,
          attack: 3,
          x, y
        });
        map.set(x, y, '.');
      } else if (cell === 'E') {
        units.push({
          type: UnitType.Elf,
          hitPoints: 200,
          attack: elfPower,
          x, y
        });
        map.set(x, y, '.');
      } else {
        map.set(x, y, cell);
      }
    });
  });

  let rounds = 0;
  printState(rounds, units, map);

  while(true) {
    let earlyExit = false;
    // check if there are any enemies left
    const elfs = units.filter(u => u.type === UnitType.Elf);
    if (elfs.length === 0) {
      break;
    }
    const goblins = units.filter(u => u.type === UnitType.Goblin);
    if (goblins.length === 0) {
      break;
    }

    units = units.filter(u => u.hitPoints > 0);
    units = units.sort((a, b) => calcPosScore(a, map) - calcPosScore(b, map))
    for (let unit of units) {
      // check to make sure unit hasn't already been killed
      if (unit.hitPoints > 0) {
        let enemies = units.filter(u => u.type !== unit.type && u.hitPoints > 0);
        if (enemies.length === 0) {
          earlyExit = true;
          break;
        }
        let enemiesInRange = findInRange(unit, enemies);
        if (enemiesInRange.length === 0) {
          move2(unit, units, map);
          enemiesInRange = findInRange(unit, units);
        }
        if (enemiesInRange.length) {
          attack(unit, enemiesInRange, map);
        }
      }
    }

    if (earlyExit) {
      break;
    }

    rounds++;
    // printState(rounds, units, map);
  }

  units = units.filter(u => u.hitPoints > 0);
  printState(rounds, units, map);
  return {
    units,
    output: rounds * units.reduce((prev, curr) => prev + curr.hitPoints, 0)
  };
}

async function part2b(input: Input) {
  let elves = 0;

  // load map
  input.lines.forEach((line, y) => {
    line.split('').forEach((cell, x) => {
      if (cell === 'E') {
        elves++;
      }
    });
  });


  let elfPower = 4;
  while (true) {
    const results = await part1(input, elfPower);

    if (results.units.filter(u => u.type == UnitType.Elf && u.hitPoints > 0).length < elves) {
      elfPower++;
    } else {
      return results.output;
    }
    // if (elfPower > 20) {
    //   break;
    // }
  }

}

module.exports = [
  part1,
  part2b
];
