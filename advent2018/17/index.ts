import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

interface MapExtent {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function makeMap(lines: string[]) {
  const map = new TwoDimArray(2000, 2000, '.');
  lines.forEach(line => {
    const match = line.match(/(\w)=(\d+), (\w)=(\d+)\.\.(\d+)/);
    if (match) {
      if (match[1] === 'x') {
        const x = Number(match[2]);
        for (let i = Number(match[4]); i <= Number(match[5]); i++) {
          map.set(x, i, '#');
        }
      } else if (match[1] === 'y') {
        const y = Number(match[2]);
        for (let i = Number(match[4]); i <= Number(match[5]); i++) {
          map.set(i, y, '#');
        }
      }
    }
  });

  map.set(500, 0, '+');

  return map;
}

function findMapExtent(map: TwoDimArray<string>): MapExtent {
  let minX = Number.MAX_SAFE_INTEGER;
  let maxX = Number.MIN_SAFE_INTEGER;
  let minY = Number.MAX_SAFE_INTEGER;
  let maxY = Number.MIN_SAFE_INTEGER;
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      if (map.get(x, y) === '#') {
        if (x < minX) {
          minX = x;
        }
        if (x > maxX) {
          maxX = x;
        }
        if (y < minY) {
          minY = y;
        }
        if (y > maxY) {
          maxY = y;
        }
      }
    }
  }

  return {
    minX: minX - 1,
    maxX: maxX + 1,
    minY,
    maxY
  };
}

function isFillable(x: number, y: number, map: TwoDimArray<string>, extent: MapExtent): boolean {
  let leftSide = false;
  for (let i = x; i >= extent.minX; i--) {
    const below = map.get(i, y + 1);
    if (below !== '#' && below !== '~') {
      leftSide = false;
      break;
    }
    if (map.get(i, y) === '#') {
      leftSide = true;
      break;
    }
  }

  let rightSide = false;
  for (let i = x; i <= extent.maxX; i++) {
    const below = map.get(i, y + 1);
    if (below !== '#' && below !== '~') {
      rightSide = false;
      break;
    }
    if (map.get(i, y) === '#') {
      rightSide = true;
      break;
    }
  }

  return leftSide && rightSide;
}

function fillRest(x: number, y: number, map: TwoDimArray<string>, extent: MapExtent) {
  for (let i = x; i >= extent.minX; i--) {
    if (map.get(i, y) === '#') {
      break;
    } else {
      map.set(i, y, '~');
    }
  }

  for (let i = x; i <= extent.maxX; i++) {
    if (map.get(i, y) === '#') {
      break;
    } else {
      map.set(i, y, '~');
    }
  }
}

function fillRunning(x: number, y: number, map: TwoDimArray<string>, extent: MapExtent) {
  const facets = [];
  for (let i = x; i >= extent.minX; i--) {
    if (map.get(i, y) === '#') {
      break;
    }
    const below = map.get(i, y + 1);
    if (below !== '#' && below !== '~') {
      if (map.get(i, y) !== '*') {
        // new facet
        map.set(i, y, '*');
        facets.push({ x: i, y })
      }
      break;
    }
    map.set(i, y, '|');
  }

  for (let i = x; i <= extent.maxX; i++) {
    if (map.get(i, y) === '#') {
      break;
    }
    const below = map.get(i, y + 1);
    if (below !== '#' && below !== '~') {
      if (map.get(i, y) !== '*') {
        map.set(i, y, '*');
        facets.push({ x: i, y })
      }
      break;
    }
    map.set(i, y, '|');
  }

  return facets;
}

function fillFacet(x: number, y: number, map: TwoDimArray<string>, extent: MapExtent) {
  const cursor = {
    x: x,
    y: y
  };
  while(true) {
    // mark as |
    if (map.get(cursor.x, cursor.y) === '.') {
      map.set(cursor.x, cursor.y, '|');
    }
    cursor.y++;

    if (cursor.y > extent.maxY) {
      break;
    }
    const nextCell = map.get(cursor.x, cursor.y);
    if (nextCell === '#' || nextCell === '~') {
      break;
    }
  }
  cursor.y--;   // backup one level
  if (cursor.y >= extent.maxY) {
    // this facet is done
    return;
  }
  if (cursor.y === y) {
    // this facet is done
    return;
  }
  // until we hit U shape made of clay/water at rest (~) that can be filled
  if (isFillable(cursor.x, cursor.y, map, extent)) {
    // console.log('fill rest', cursor);
    // fill
    fillRest(cursor.x, cursor.y, map, extent);

    // pour some more water, out of same facet;
    fillFacet(x, y, map, extent);
  } else {
    // spills over
    // console.log('fill running', cursor);
    const newFacets = fillRunning(cursor.x, cursor.y, map, extent);
    if (newFacets.length) {
      newFacets.forEach(facet => {
        fillFacet(facet.x, facet.y, map, extent);
      })
      fillFacet(x, y, map, extent);
    }
  }
}

function printMap(map: TwoDimArray<string>, extent: MapExtent) {
  let output = '';
  for (let y = 0; y <= extent.maxY; y++) {
    for (let x = extent.minX; x <= extent.maxX; x++) {
      output += map.get(x, y);
    }
    output += '\n';
  }
  console.log(output);
}

function countWater(map: TwoDimArray<string>, extent: MapExtent) {
  let water = 0;
  for (let y = extent.minY; y <= extent.maxY; y++) {
    for (let x = extent.minX; x <= extent.maxX; x++) {
      const cell =map.get(x, y);
      if (cell === '|' || cell === '~' || cell === '*') {
        water++;
      }
    }
  }
  return water;
}

function countRestWater(map: TwoDimArray<string>, extent: MapExtent) {
  let water = 0;
  for (let y = extent.minY; y <= extent.maxY; y++) {
    for (let x = extent.minX; x <= extent.maxX; x++) {
      const cell = map.get(x, y);
      if (cell === '~') {
        water++;
      }
    }
  }
  return water;
}

async function part1(input: Input) {
  const map: TwoDimArray<string> = makeMap(input.lines);
  const extent = findMapExtent(map);

  printMap(map, extent);


  fillFacet(500, 0, map, extent);

  printMap(map, extent);

  return countWater(map, extent);
}

async function part2(input: Input) {
  const map: TwoDimArray<string> = makeMap(input.lines);
  const extent = findMapExtent(map);

  fillFacet(500, 0, map, extent);

  return countRestWater(map, extent);
}

module.exports = [
  part1,
  part2
];
