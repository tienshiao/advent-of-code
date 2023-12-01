function parseFirstNumber(input: string) {
  for (const x of input) {
    const num = parseInt(x, 10);
    if (!isNaN(num)) {
      return num;
    }
  }

  return NaN;
}

function part1(input: string[]) {
  const numbers = input.map((n) => {
    const first = parseFirstNumber(n);
    const second = parseFirstNumber(n.split('').reverse().join());
    return first * 10 + second;
  });

  const sum = numbers.reduce((acc, n) => acc + n, 0);
  return sum;
}

const numbers = {
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '7': 7,
  '8': 8,
  '9': 9,
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5,
  'six': 6,
  'seven': 7,
  'eight': 8,
  'nine': 9,
};

function parseFirstNumberV2(input: string) {
  for (let i = 0; i < input.length; i++) {
    for (const [key, value] of Object.entries(numbers)) {
      if (input.startsWith(key, i)) {
        return value;
      }
    }
  }

  return NaN;
}

function reverseString(input: string) {
  return input.split('').reverse().join('');
}

function parseLastNumberV2(input: string) {
  input = reverseString(input);
  for (let i = 0; i < input.length; i++) {
    for (const [key, value] of Object.entries(numbers)) {
      if (input.startsWith(reverseString(key), i)) {
        return value;
      }
    }
  }

  return NaN;
}

function part2(input: string[]) {
  const numbers = input.map((n) => {
    const first = parseFirstNumberV2(n);
    const second = parseLastNumberV2(n);
    return first * 10 + second;
  });

  const sum = numbers.reduce((acc, n) => acc + n, 0);
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
