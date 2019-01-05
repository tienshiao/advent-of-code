import { Input } from '../interfaces';

interface Bot {
  x: number;
  y: number;
  z: number;
  r: number;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface Extent {
  minX: number;
  maxX : number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

function calcDistance(b1: Position, b2: Position): number {
  return Math.abs(b1.x - b2.x) + Math.abs(b1.y - b2.y) + Math.abs(b1.z - b2.z);
}

function inRange(b1: Position, b2: Position, radius: number): boolean {
  return calcDistance(b1, b2) <= radius;
}

function intersectsCluster(b: Bot, cluster: Bot[]) {
  for (let cb of cluster) {
    if (!inRange(b, cb, b.r + cb.r)) {
      return false;
    }
  }
  return true;
}

function calcError(p: Position, cluster: Bot[]) {
  let error = 0;
  cluster.forEach(b => {
    const d = calcDistance(p, b);
    error += Math.max(d - b.r, 0);
  })

  return error;
}


async function part1(input: Input) {
  const bots: Bot[] = input.lines.map(l => {
    const match = l.match(/pos=<(\-?\d+),(\-?\d+),(\-?\d+)>, r=(\-?\d+)/) || [];
    return {
      x: +match[1],
      y: +match[2],
      z: +match[3],
      r: +match[4]
    };
  });

  let maxR = Number.MIN_SAFE_INTEGER;
  let maxIndex = 0;
  bots.forEach((b, index) => {
    if (b.r > maxR) {
      maxR = b.r;
      maxIndex = index;
    }
  })

  const referenceBot = bots[maxIndex];
  let count = 0;

  bots.forEach((b, index) => {
    if (inRange(referenceBot, b, referenceBot.r)) {
      count++;
    }
  });

  return count;
}

async function part2(input: Input) {
  const bots: Bot[] = input.lines.map(l => {
    const match = l.match(/pos=<(\-?\d+),(\-?\d+),(\-?\d+)>, r=(\-?\d+)/) || [];
    return {
      x: +match[1],
      y: +match[2],
      z: +match[3],
      r: +match[4]
    };
  });


  const clusters: Bot[][] = [];
  bots.forEach(b1 => {
    const cluster: Bot[] = [ b1 ];
    bots.forEach(b2 => {
      if (intersectsCluster(b2, cluster)) {
        cluster.push(b2);
      }
    });

    if (cluster.length > 1) {
      clusters.push(cluster);
    }
  });

  let bigClusters: Bot[][] = [];
  let max = 0;
  clusters.forEach(c => {
    if (c.length > max) {
      bigClusters = [c];
      max = c.length;
    } else if (c.length === max) {
      bigClusters.push(c);
    }
  })

  // end up with a bunch of duplicate clusters
  // const cluster = bigClusters[0];
  const cluster = bots;
  console.log(cluster);

  const zeroBot = { x: 0, y: 0, z: 0, r: 0 };
  let i = 0;
  let currPos = { x: 0, y: 0, z: 0, r: 0};
  let currError = Number.MAX_SAFE_INTEGER;
  let lastPos: Position;
  while (true) {
    const directions = [{
      ...currPos,
      x: currPos.x + 1
    }, {
      ...currPos,
      x: currPos.x - 1
    }, {
      ...currPos,
      y: currPos.y + 1
    }, {
      ...currPos,
      y: currPos.y - 1
    }, {
      ...currPos,
      z: currPos.z + 1
    }, {
      ...currPos,
      z: currPos.z - 1
    }];

    let currBestDirection = currPos;
    let currBestError = Number.MAX_SAFE_INTEGER;
    directions.forEach(d => {
      if (lastPos && calcDistance(d, lastPos) === 0) {
        // don't go backwards
        return;
      }
      const error = calcError(d, cluster);
      if (error < currBestError) {
        currBestDirection = d;
        currBestError = error;
      }
    });

    if (currBestError < currError) {
      // found a new best
      currPos = currBestDirection;
      currError = currBestError;
    } else {
      // could not find a better one
      break;
    }

    lastPos = currPos;
    i++;
    if (i % 100_000 === 0) {
      console.log(i, currPos, currError);
    }
  }
  console.log(currPos, currError);
  return calcDistance(currPos, zeroBot);
}

module.exports = [
  part1,
  part2
];
