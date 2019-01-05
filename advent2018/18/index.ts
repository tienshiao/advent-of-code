import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

function loadMap(lines: string[]) {
  const size = lines.length;
  const map = new TwoDimArray(size, size, '.');
  lines.forEach((line, y) => {
    line.split('').forEach((cell, x) => {
      map.set(x, y, cell);
    })
  });

  return map;
}

function getAdjacent(x: number, y: number, map: TwoDimArray<string>) {
  const cells = [];
  for (let y2 = y - 1; y2 <= y + 1; y2++) {
    for (let x2 = x - 1; x2 <= x + 1; x2++) {
      if (x2 < 0 || x2 >= map.width) {
      } else if (y2 < 0 || y2 >= map.height) {
      } else if (x2 === x && y2 === y) {
      } else {
        cells.push(map.get(x2, y2));
      }
    }
  }
  return cells;
}

function countType(type: string, cells: string[]) {
  return cells.reduce((prev, curr) => {
    if (curr === type) {
      return prev + 1;
    } else {
      return prev;
    }
  }, 0);
}

function advanceMap(map: TwoDimArray<string>) {
  const newMap = new TwoDimArray(map.width, map.height, ',');

  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const current = map.get(x, y);
      const cells = getAdjacent(x, y, map);

      let next = current;
      if (current === '.') {
        // open
        if (countType('|', cells) >= 3) {
          next = '|';
        }
      } else if (current === '|') {
        // trees
        if (countType('#', cells) >= 3) {
          next = '#';
        }
      } else if (current === '#') {
        // lumberyard
        if (countType('#', cells) >= 1 &&
            countType('|', cells) >= 1) {
          next = current;   // stays a lumberyard
        } else {
          next = '.';
        }
      }

      newMap.set(x, y, next);
    }
  }

  return newMap;
}

function printMap(map: TwoDimArray<string>) {
  let output = '';
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      output += map.get(x, y);
    }
    output += '\n';
  }

  console.log(output);
}

function countMapType(type: string, map: TwoDimArray<string>) {
  let count = 0;
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (map.get(x, y) === type) {
        count++;
      }
    }
  }

  return count;
}

function scoreMap(map: TwoDimArray<string>) {
  return countMapType('|', map) * countMapType('#', map);
}

async function part1(input: Input) {
  const MAX_MINUTES = 10;
  let map = loadMap(input.lines);

  printMap(map);

  for (let minutes = 0; minutes < MAX_MINUTES; minutes++) {
    map = advanceMap(map);
    console.log(minutes + 1);
    printMap(map);
  }

  return countMapType('|', map) * countMapType('#', map);
}

async function part2(input: Input) {
  const MAX_MINUTES = 1_000_000_000;
  // const MAX_MINUTES = 10_000;
  const cache: { [key: string] : { next: string, score: number } } = {};
  let map = loadMap(input.lines);

  printMap(map);

  let oldMap = map.data.join('');
  for (let minutes = 0; minutes < MAX_MINUTES; minutes++) {
    if (cache[oldMap]) {
      oldMap = cache[oldMap].next;
    } else {
      const newMap = advanceMap(map);
      cache[map.data.join('')] = {
        next: newMap.data.join(''),
        score: scoreMap(map)
      };
      map = newMap;
      oldMap = map.data.join('');
    }

    if (minutes % 10000 === 0) {
      console.log(minutes, cache[oldMap] && cache[oldMap].score);
    }

    //218491
  }

  return cache[oldMap].score;
}

module.exports = [
  part1,
  part2
];
