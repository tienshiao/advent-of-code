function part1(positions: number[]): number {
  const max = positions.reduce((a, b) => Math.max(a, b), 0);
  const min = positions.reduce((a, b) => Math.min(a, b), 0);

  let least = Number.MAX_SAFE_INTEGER;
  let leastPos = -1;
  for (let i = min; i <= max; i++) {
    const totalDistance = positions.reduce((a, b) => a + Math.abs(b - i), 0);
    if (totalDistance < least) {
      least = totalDistance;
      leastPos = i;
    }
  }

  console.log(leastPos, least);

  return least;
}

function part2(positions: number[]): number {
  const max = positions.reduce((a, b) => Math.max(a, b), 0);
  const min = positions.reduce((a, b) => Math.min(a, b), 0);

  let least = Number.MAX_SAFE_INTEGER;
  let leastPos = -1;
  for (let i = min; i <= max; i++) {
    const totalCost = positions.reduce((a, b) => a + calcCost(Math.abs(b - i)), 0);
    if (totalCost < least) {
      least = totalCost;
      leastPos = i;
    }
  }

  console.log(leastPos, least);

  return least;
}

const memo: Record<string, number> = {};
function calcCost(distance: number): number {
  // distance 0 -> 0
  // distance 1 -> 1
  // distance 2 -> 1 + 2 = 3
  // distance 3 -> 1 + 2 + 3 = 6
  // distance 4 -> 1 + 2 + 3 + 4 = 10

  // console.log('calcCost', distance);
  if (distance === 0) {
    return 0;
  } else if (distance === 1) {
    return 1;
  } else if (memo[distance]) {
    return memo[distance];
  } else {
    const cost = calcCost(distance - 1) + distance;
    memo[distance] = cost;
    return cost;
  }
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const positions = inputString.trim().split(',').map(Number);
  console.log(positions);

  if (part === '1') {
    console.log(part1(positions));
  } else if (part === '2') {
    console.log(part2(positions));
  }
}

await main();
