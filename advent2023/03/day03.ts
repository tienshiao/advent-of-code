function isDigit(input: string): boolean {
  return input.length === 1 && input >= '0' && input <= '9';
}

function isSymbol(input: string): boolean {
  return input.length === 1 && input !== '.' && !isDigit(input);
}

type Extraction = {
  number: number;
  start: number;
}

function extractNumber(input: string, index: number): Extraction {
  // move backwards until we find a symbol
  let start = index;
  while (input[start] && isDigit(input[start])) {
    start--;
  }
  start++;
  // move forwards until we find a symbol
  let end = index;
  while (input[end] && isDigit(input[end])) {
    end++;
  }
  end--;
  const number = parseInt(input.substring(start, end + 1));
  return {
    number,
    start,
  };
}

function safeGet(input: string[], x: number, y: number): string {
  if (x < 0 || y < 0 || y >= input.length || x >= input[y].length) {
    return '.';
  }
  return input[y][x];
}

function hash(y: number, x: number): number {
  return y * 10000 + x;
}

function part1(input: string[]) {
  const alreadyAdded = new Set<number>();
  let sum = 0;
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (isSymbol(char)) {
        for (let dy = -1; dy < 2; dy++) {
          for (let dx = -1; dx < 2; dx++) {
            if (dy === 0 && dx === 0) {
              continue;
            }
            const nextChar = safeGet(input, x + dx, y + dy);
            if (isDigit(nextChar)) {
              console.log(`Found ${nextChar} at ${x + dx}, ${y + dy}`);
              const {number, start} = extractNumber(input[y + dy], x + dx);
              console.log(`Extracted ${number} at ${start}`);
              const hashValue = hash(y + dy, start);
              if (!alreadyAdded.has(hashValue)) {
                sum += number;
                alreadyAdded.add(hashValue);
              }
            }
          }
        }
      }
    }
  }
  return sum;
}

function part2(input: string[]) {
  let sum = 0;
  for (let y = 0; y < input.length; y++) {
    const line = input[y];
    for (let x = 0; x < line.length; x++) {
      const char = line[x];
      if (char === '*') {
        const alreadyAdded = new Set<number>();
        const numbers: number[] = [];
        for (let dy = -1; dy < 2; dy++) {
          for (let dx = -1; dx < 2; dx++) {
            if (dy === 0 && dx === 0) {
              continue;
            }
            const nextChar = safeGet(input, x + dx, y + dy);
            if (isDigit(nextChar)) {
              console.log(`Found ${nextChar} at ${x + dx}, ${y + dy}`);
              const {number, start} = extractNumber(input[y + dy], x + dx);
              console.log(`Extracted ${number} at ${start}`);
              const hashValue = hash(y + dy, start);
              if (!alreadyAdded.has(hashValue)) {
                numbers.push(number);
                alreadyAdded.add(hashValue);
              }
            }
          }
        }
        if (numbers.length < 2) {
          continue;
        }
        sum += numbers.reduce((acc, value) => {
          return acc * value;
        }, 1);
      }
    }
  }
  return sum;
}

async function main() {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);
  const input = inputString.trim().split('\n');

  if (part === '1') {
    console.log(part1(input));
  } else if (part === '2') {
    console.log(part2(input));
  }
}

main();
