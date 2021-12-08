function part1(fish: number[], days: number): number {
  for (let i = 0; i < days; i++) {
    const newFish: number[] = [];
    fish = fish.map(f => {
      f = f - 1
      if (f < 0) {
        f = 6;
        newFish.push(8);
      }
      return f;
    });
    fish.push(...newFish);
  }

  return fish.length;
}

function part2(fish: number[], days: number): number {
  let fishAges: Record<string, number> = fish.reduce((acc, f) => {
    acc[f] = (acc[f] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log(fishAges);

  for (let i = 0; i < days; i++) {
    // rotate fishAges
    const newFishAges: Record<string, number> = {};
    for (let j = 0; j < 9; j++) {
      if (j == 0) {
        newFishAges[8] = fishAges[0] || 0;
        newFishAges[6] = (newFishAges[6] || 0) + fishAges[0] || 0;
      } else {
        newFishAges[j - 1] = (newFishAges[j -1] || 0) + fishAges[j] || 0;
      }
    }
    fishAges = newFishAges;
    // console.log(i+1, fishAges);
  }

  return Object.values(fishAges).reduce((acc, f) => acc + f, 0);
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const fish = inputString.trim().split(',').map(Number);
  console.log(fish);

  if (part === '1') {
    console.log(part1(fish, 80));
  } else if (part === '2') {
    console.log(part2(fish, 256));
  }
}

await main();
