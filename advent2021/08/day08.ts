const segmentsToNumber = {
  'abcefg': 0,
  'cf': 1,
  'acdeg': 2,
  'acdfg': 3,
  'bcdf': 4,
  'abdfg': 5,
  'abdefg': 6,
  'acf': 7,
  'abcdefg': 8,
  'abcdfg': 9,
};

function part1(lines: string[]): number {
  const digits = lines.map((line) => {
    const [_, output] = line.split('|');
    const digits = output.trim().split(' ');
    return digits;
  });

  let count = 0;
  digits.forEach((line) => {
    line.forEach((digit) => {
      if (digit.length === 2 ||
          digit.length === 4 ||
          digit.length === 3 ||
          digit.length === 7) {
        count++;
      }
    });
  });

  return count;
}

function part2(lines: string[]): number {
  let total = 0;
  for (const line of lines) {
    const [pattern, output] = line.split('|');
    const mapping = makeMapping(pattern.trim().split(' '));

    let acc = 0;
    for (const digit of output.trim().split(' ')) {
      acc = acc * 10 +  convert(mapping, digit);
    }

    total += acc;
  }

  return total;
}

function normalize(input: string): string {
  return input.split('').sort().join('');
}

function makeMapping(patterns: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};

  // figure out top by subtracting 1 from 7
  const top = findTop(patterns);
  mapping[top] = 'a';

  // figure out bottom by orring 7 and 4 and finding the missing segment
  const bottom = findBottom(patterns);
  mapping[bottom] = 'g';

  const occurences = makeOccurences(patterns);

  // figure out topleft from occurrence count
  const [topleft] = occurences[6];
  mapping[topleft] = 'b';

  // figure out bottomleft from occurrence count
  const [bottomleft] = occurences[4];
  mapping[bottomleft] = 'e';

  // figure out bottomright from occurrence count
  const [bottomright] = occurences[9];
  mapping[bottomright] = 'f';

  // figure out topright from occurrence count - top
  const topright = occurences[8].find((segment) => segment !== top);
  mapping[topright!] = 'c';

  // figure out middle from occurrence count and must exist in 4
  const middle = occurences[7].find((segment) => segment !== bottom);
  mapping[middle!] = 'd';

  return mapping;
}

function convert(mapping: Record<string, string>, digit: string): number {
  let correct = '';
  for (const char of digit) {
    correct += mapping[char];
  }

  return segmentsToNumber[normalize(correct) as keyof typeof segmentsToNumber];
}

function findTop(patterns: string[]): string {
  const one = patterns.find((pattern) => pattern.length == 2);
  const seven = patterns.find((pattern) => pattern.length == 3);
  const top = seven!.split('').find((char) => !one!.includes(char));

  return top!;
}

function findBottom(patterns: string[]): string {
  const seven = patterns.find((pattern) => pattern.length == 3);
  const four = patterns.find((pattern) => pattern.length == 4);
  const nine = patterns.find((pattern) => {
    if (pattern.length !== 6) {
      return false;
    }

    if (seven!.split('').every((char) => pattern!.includes(char)) &&
        four!.split('').every((char) => pattern!.includes(char))) {
      return true;
    }

    return false;
  });

  const bottom = nine!.split('').find((char) => !(seven!.includes(char) || four!.includes(char)));
  return bottom!;
}

function makeOccurences(patterns: string[]): Record<number, string[]> {
  const occurences: Record<number, string[]> = {};

  const counts: Record<string, number> = {};
  patterns.forEach((pattern) => {
    for (const char of pattern) {
      counts[char] = (counts[char] || 0) + 1;
    }
  });

  for (const [key, value] of Object.entries(counts)) {
    occurences[value] = (occurences[value] || []).concat(key);
  }

  return occurences;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const lines = inputString.trim().split('\n');

  if (part === '1') {
    console.log(part1(lines));
  } else if (part === '2') {
    console.log(part2(lines));
  }
}

await main();
