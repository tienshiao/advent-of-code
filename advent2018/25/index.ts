import { Input } from '../interfaces';

type SpaceTimeCoord = number[];
type Constellation = SpaceTimeCoord[]

function calcDistance(c1: SpaceTimeCoord, c2: SpaceTimeCoord) {
  return Math.abs(c1[0] - c2[0]) + Math.abs(c1[1] - c2[1]) + Math.abs(c1[2] - c2[2]) + Math.abs(c1[3] - c2[3]);
}

function isClose(c1: Constellation, c2: Constellation) {
  for (let coord1 of c1) {
    for (let coord2 of c2) {
      if (calcDistance(coord1, coord2) <= 3) {
        return true;
      }
    }
  }
  return false;
}

async function part1(input: Input) {
  const coords: SpaceTimeCoord[] = input.lines.map(l => {
    return l.split(',').map(s => Number(s.trim()));
  })

  let constellations: Constellation[] = coords.map(c => [c]);

  let i = 0;
  while (true) {
    let oldLength = constellations.length;


    const newConstellations: Constellation[] = [];
    while (constellations.length) {
      const refill: Constellation[] = [];
      const c1 = constellations.shift()!;
      const close: Constellation = [...c1];

      while (constellations.length) {
        const c2 = constellations.shift()!;
        if (isClose(close, c2)) {
          close.push(...c2);
        } else {
          refill.push(c2);
        }
      }
      if (close.length) {
        newConstellations.push(close);
      }

      constellations.push(...refill);
    }

    constellations = newConstellations;
    if (constellations.length === oldLength) {
      break;
    }
    i++;
    console.log(i);
  }

  console.log(constellations);

  return constellations.length;
}

async function part2(input: Input) {
}

module.exports = [
  part1,
  part2
];
