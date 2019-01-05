import { Input } from '../interfaces';

function printState(scores: number[], elf1: number, elf2: number) {
  let output = '';
  for (let i = 0; i < scores.length; i++) {
    if (i == elf1) {
      output += '(' + scores[i] + ')';
    } else if (i == elf2) {
      output += '[' + scores[i] + ']';
    } else {
      output += ' ' + scores[i] + ' ';
    }
  }
  console.log(scores.length, elf1, elf2, output);
}

async function part1(input: Input) {
  const max = Number(input.raw);

  let scores = [3, 7];
  let elf1 = 0;
  let elf2 = 1;

  // printState(scores, elf1, elf2);

  while (scores.length < max + 10) {
    // make new recipes;
    const sum = scores[elf1] + scores[elf2];
    if (sum > 9) {
      scores.push(1, sum % 10);
    } else {
      scores.push(sum);
    }

    // move elfs
    elf1 = (elf1 + scores[elf1] + 1) % scores.length;
    elf2 = (elf2 + scores[elf2] + 1) % scores.length;

    // printState(scores, elf1, elf2);
    if (scores.length % 1000 === 0) {
      console.log(scores.length);
    }
  }

  return scores.slice(max, max+10).join('');
}

function printState2b(scores: Uint8Array, length: number, elf1: number, elf2: number) {
  let output = '';
  for (let i = 0; i < length; i++) {
    if (i == elf1) {
      output += '(' + scores[i] + ')';
    } else if (i == elf2) {
      output += '[' + scores[i] + ']';
    } else {
      output += ' ' + scores[i] + ' ';
    }
  }
  console.log(length, elf1, elf2, output);
}

async function part2(input: Input) {
  const sequence = input.raw.trim();

  let scores = [3, 7];
  let elf1 = 0;
  let elf2 = 1;

  // printState(scores, elf1, elf2);

  while (true) {
    // make new recipes;
    const sum = Number(scores[elf1]) + Number(scores[elf2]);
     if (sum > 9) {
      scores.push(1, sum % 10);
    } else {
      scores.push(sum);
    }

    // move elfs
    elf1 = (elf1 + scores[elf1] + 1) % scores.length;
    elf2 = (elf2 + scores[elf2] + 1) % scores.length;

    // printState(scores, elf1, elf2);
    if (scores.length % 1000 === 0) {
      console.log(scores.length);
    }

    const initial = Math.max(scores.length - sequence.length, 0);
    let match = true;
    for (let i = 0; i < sequence.length; i++) {
      if (scores[i + initial] !== Number(sequence[i])) {
        match = false;
        break;
      }
    }

    if (match) {
      return initial;
    }
  }
}

async function part2b(input: Input) {
  const sequence = input.raw.trim();

  let scores = new Uint8Array(124395000 * 8);
  scores[0] = 3;
  scores[1] = 7;
  let length = 2;

  let elf1 = 0;
  let elf2 = 1;

  // printState(scores, elf1, elf2);

  while (true) {
    // make new recipes;
    const sum = Number(scores[elf1]) + Number(scores[elf2]);
    if (sum > 9) {
      scores[length] = 1;
      scores[length+1] = sum % 10;
      length += 2;
    } else {
      scores[length] = sum;
      length++;
    }

    // move elfs
    elf1 = (elf1 + scores[elf1] + 1) % length;
    elf2 = (elf2 + scores[elf2] + 1) % length;

    if (length % 1000 === 0) {
      console.log(length);
    }
    if (length >= scores.length) {
      break;
    }

    const initial = Math.max(length - sequence.length - 2, 0);
    let match = true;
    for (let i = 0; i < sequence.length; i++) {
      if (scores[i + initial] !== Number(sequence[i])) {
        match = false;
        break;
      }
    }

    if (match) {
      return initial;
    }
  }
}
module.exports = [
  part1,
  part2b
];
