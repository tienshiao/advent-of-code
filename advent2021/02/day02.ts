
function part1(input: string[]): number {
  let horizontal = 0;
  let depth = 0;

  for (const line of input) {
    const [cmd, param] = line.split(' ');
    const val = parseInt(param);

    if (cmd === 'forward') {
      horizontal += val;
    } else if (cmd === 'up') {
      depth -= val;
    } else if (cmd === 'down') {
      depth += val;
    }
  }

  return horizontal * depth;
}

function part2(input: string[]): number {
  let horizontal = 0;
  let depth = 0;
  let aim = 0;

  for (const line of input) {
    const [cmd, param] = line.split(' ');
    const val = parseInt(param);

    if (cmd === 'forward') {
      horizontal += val;
      depth += aim * val;
    } else if (cmd === 'up') {
      aim -= val;
    } else if (cmd === 'down') {
      aim += val;
    }
  }

  return horizontal * depth;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);
  const input = inputString.trim().split('\n');

  if (part === '1') {
    console.log(part1(input));
  } else if (part === '2') {
    console.log(part2(input));
  }
}

await main();
