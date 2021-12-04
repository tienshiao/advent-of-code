
function part1(input: number[]): number {
  let prev: number | undefined = undefined;
  let increased = 0;

  for (const current of input) {
    if (prev === undefined) {
      prev = current;
      continue;
    }

    if (current > prev) {
      increased++;
    }

    prev = current;
  }

  return increased;
}

function part2(input: number[]): number {
  let prev: number | undefined = undefined;
  let increased = 0;

  for (let i = 2; i < input.length; i++) {
    const current = input[i] + input[i - 1] + input[i - 2];

    if (prev === undefined) {
      prev = current;
      continue;
    }

    if (current > prev) {
      increased++;
    }

    prev = current;
  }

  return increased;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);
  const input = inputString.trim().split('\n').map(Number);

  if (part === '1') {
    console.log(part1(input));
  } else if (part === '2') {
    console.log(part2(input));
  }
}

main();
