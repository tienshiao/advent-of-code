import { Input } from '../interfaces';

function countLetters(line: string) {
  const counts: { [index: string]: number } = {};
  const chars = line.trim().split('');
  chars.forEach(c => {
    counts[c] = counts[c] ? counts[c] + 1 : 1;
  });
  return counts;
}

function hasCount(letters: { [index: string]: number }, count: number) {
  for (let l of Object.values(letters)) {
    if (l === count) {
      return true;
    }
  }
  return false;
}

async function part1(input: Input) {
  let twos = 0;
  let threes = 0;

  input.lines.forEach(line => {
    const letters = countLetters(line);
    if (hasCount(letters, 2)) {
      twos++;
    }
    if (hasCount(letters, 3)) {
      threes++;
    }
  });

  return twos * threes;
}

function compare(a: string, b: string) {
  const aChars = a.split('');
  const bChars = b.split('');
  let mismatches = 0;
  for (let i = 0; i < aChars.length; i++) {
    if (aChars[i] === bChars[i]) {
      // do nothing continue
    } else if (aChars[i] !== bChars[i]) {
      mismatches++;
      if (mismatches > 1) {
        return false;
      }
    }
  }
  return mismatches === 1;
}

async function part2(input: Input) {
  const { lines } = input;
  for (let i = 0; i < lines.length; i++) {
    const l1 = lines[i];
    for (let j = 0; j < lines.length; j++) {
      const l2 = lines[j];
      if (compare(l1, l2)) {
        console.log(l1);
        console.log(l2);
        return;
      }
    }
  }
}

module.exports = [
  part1,
  part2
];
