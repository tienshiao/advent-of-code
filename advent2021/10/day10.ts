const scores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

// Part2 gives the scores based on the closing symbols
// We use the open symbols instead
const scores2 = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
};

const open = '{[(<';
const close = '}])>';

function part1(lines: string[]): number {
  let total = 0;
  for (const line of lines) {
    const stack = [];

    for (const char of line) {
      if (open.includes(char)) {
        stack.push(char);
      } else {
        const last = stack[stack.length - 1];

        if (open.indexOf(last) === close.indexOf(char)) {
          stack.pop();
        } else {
          total += scores[char as keyof typeof scores];
          break;
        }
      }
    }
  }
  return total;
}

function part2(lines: string[]): number {
  const scores = [];
  for (const line of lines) {
    let stack = [];

    for (const char of line) {
      if (open.includes(char)) {
        stack.push(char);
      } else {
        const last = stack[stack.length - 1];

        if (open.indexOf(last) === close.indexOf(char)) {
          stack.pop();
        } else {
          stack = [];
          break;
        }
      }
    }

    if (stack.length > 0) {
      let total = 0;
      for (const char of stack.reverse()) {
        total = total * 5 + scores2[char as keyof typeof scores2];
      }
      scores.push(total);
    }
  }

  return scores.sort((a, b) => a - b)[Math.floor(scores.length/2)];
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
