import { Input } from '../interfaces';

function removePairs(input: string) {
  const result: string[] = [];
  const arr = input.split('');

  let i = 0
  while (i < arr.length) {
    if (i == arr.length - 1) {
      result.push(arr[i]);
      i++;
    } else if (arr[i].toLowerCase() === arr[i+1].toLowerCase() && arr[i] !== arr[i+1]) {
      i += 2;
    } else {
      result.push(arr[i]);
      i++;
    }
  }

  return result.join('');
}

function react(input: string) {
  let line = input;
  let oldLength = 0;

  while(oldLength != line.length) {
    oldLength = line.length;
    line = removePairs(line);
  }

  return line;
}

async function part1(input: Input) {
  let line = react(input.lines[0].trim());

  return line.length;
}

async function part2(input: Input) {
  let line = input.lines[0].trim();

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  let minLength = line.length;

  alphabet.forEach(letter => {
    const result = react(line.replace(new RegExp(letter, 'gi'), ''));
    if (result.length < minLength) {
      minLength = result.length;
    }
  });

  return minLength;
}

module.exports = [
  part1,
  part2
];
