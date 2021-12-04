
function part1(input: string[]): number {
  const width = input[0].length;

  let gamma = '';
  let epsilon = '';

  for (let i = 0; i < width; i++) {
    let one = 0;
    let zero = 0;

    input.forEach((line) => {
      if (line[i] === '1') {
        one++;
      } else {
        zero++;
      }
    });

    if (one > zero) {
      gamma += '1';
      epsilon += '0';
    } else {
      gamma += '0';
      epsilon += '1';
    }
  }

  return parseInt(gamma, 2) * parseInt(epsilon, 2);
}

function part2(input: string[]): number {
  const width = input[0].length;

  let oxygen = '';
  let co2 = '';

  // oxygen
  let working = input.slice();
  for (let i = 0; i < width; i++) {
    let one = 0;
    let zero = 0;

    working.forEach((line) => {
      if (line[i] === '1') {
        one++;
      } else {
        zero++;
      }
    });

    if (one >= zero) {
      working = working.filter((line) => line[i] === '1');
    } else if (one < zero) {
      working = working.filter((line) => line[i] === '0');
    }

    if (working.length === 1) {
      oxygen = working[0];
      break;
    }
  }

  // co2
  working = input.slice();
  for (let i = 0; i < width; i++) {
    let one = 0;
    let zero = 0;

    working.forEach((line) => {
      if (line[i] === '1') {
        one++;
      } else {
        zero++;
      }
    });

    if (one >= zero) {
      working = working.filter((line) => line[i] === '0');
    } else {
      working = working.filter((line) => line[i] === '1');
    }

    if (working.length === 1) {
      co2 = working[0];
      break;
    }
  }

  return parseInt(oxygen, 2) * parseInt(co2, 2);
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
