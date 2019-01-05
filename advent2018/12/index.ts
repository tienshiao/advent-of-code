import { Input } from '../interfaces';
import { Decimal } from 'decimal.js';

interface Instruction {
  input: string[]
  result: string
}

function match(x: number, state: string[], pattern: string[]) {
  for (let i = 0; i < pattern.length; i++) {
    const currPotIndex = x + i - 2;
    let currPot = '.';
    if (currPotIndex < 0 ) {
    } else if (currPotIndex >= state.length) {
    } else {
      // console.log(x, i, currPotIndex, state[currPotIndex], pattern[i])
      currPot = state[currPotIndex];
    }
    if (state[currPotIndex] !== pattern[i]) {
      return false;
    }
  }
  return true;
}

function calcTotal(offset: number, state: string[]): number {
  let total = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] === '#') {
      total += i + offset;
    }
  }

  return total;
}

function calcTotalBig(offset: Decimal, state: string[]): Decimal {
  let total = new Decimal(0);
  for (let i = 0; i < state.length; i++) {
    if (state[i] === '#') {
      total = total.plus(i).plus(offset);
    }
  }

  return total;
}

function printState(gen: number, offset: number, total: number, state: string[]) {
  console.log(String(gen).padStart(3), String(offset).padStart(4), String(total).padStart(5), state.join(''));
}

function trimRight(input: string) {
  return input.replace(/\.+$/, '');
};

function moveWindow(state: string[]): { state: string[], offset: number} {
  const offset = state.indexOf('#');
  let slice:string[] = [];
  if (offset > -1) {
    slice = state.slice(offset);
  }
  return { state: trimRight(slice.join('')).split(''), offset };
}

async function part1(input: Input) {
  const iterations = 20_000;
  const initialState = input.lines[0].split(' ')[2].split('');
  const padding = '....'.split('');

  const instructions: Instruction[] = input.lines.splice(2).map(line => {
    const parts = line.split(' => ');
    return {
      input: parts[0].split(''),
      result: parts[1]
    }
  });

  let offset = 0;
  let state = [...initialState];
  let i = 0;
  for (; i < iterations; i++) {

    // move window to trim
    let window = moveWindow(state);
    state = window.state;
    offset = offset + window.offset;

    // pad window
    offset = offset - padding.length;
    state = [...padding, ...state, ...padding];

    printState(i, offset, calcTotal(offset, state), state);
    let newState: string[] = [];
    for (let s = 0; s < state.length; s++) {
      newState[s] = '.';
      for (let j = 0; j < instructions.length; j++) {
        if (match(s, state, instructions[j].input)) {
          // console.log('match', s, instructions[j])
          newState[s] = instructions[j].result;
          break;
        }
      }
    }
    state = [...newState];
  }

  const total = calcTotal(offset, state);
  printState(i, offset, total, state);

  return total;
}

async function part2(input: Input) {
  // 19999 19891 719422 ....#.#.....#.#...........#.#.....#.#......#.#.....#.#.....#.#..........#.#.......#.#......#.#...........#.#...........#.#.....#.#..........#.#......#.#..............#.#..............#.#......#.#....
  const generation = new Decimal('50000000000');
  const difference = 20_000 - 19_892;
  const offset = new Decimal('19892');
  const state = '....#.#.....#.#...........#.#.....#.#......#.#.....#.#.....#.#..........#.#.......#.#......#.#...........#.#...........#.#.....#.#..........#.#......#.#..............#.#..............#.#......#.#....'.split('');

  return calcTotalBig(generation.minus(difference), state);
}

module.exports = [
  part1,
  part2
];
