import chalk from 'chalk';

import { Input } from '../interfaces';
import TwoDimArray from '../lib/TwoDimArray';

const MAX = 200;

enum Direction {
  Left = 0,
  Straight,
  Right
}

function loadMap(lines: string[]) {
  const map = new TwoDimArray(MAX, MAX, ' ');
  lines.forEach((line, y) => {
    line.split('').forEach((cell, x) => {
      map.set(x, y, cell);
    });
  });

  return map;
}

function isCart(char: string) {
  return char === '^' || char === '>' || char === 'v' || char === '<' || char === 'X';
}

function cleanMap(map:TwoDimArray<string>, height: number) {
  const clean = new TwoDimArray(MAX, MAX, ' ');
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      let char = map.get(x, y);
      if (char === '^' || char === 'v') {
        char = '|';
      } else if (char === '>' || char === '<') {
        char = '-';
      }
      clean.set(x, y, char);
    }
  }
  return clean;
}

function copyMap(map:TwoDimArray<string>, height: number) {
  const copy = new TwoDimArray(MAX, MAX, ' ');
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      let char = map.get(x, y);
      copy.set(x, y, char);
    }
  }
  return copy;
}

function cleanCrashes(map:TwoDimArray<string>, clean:TwoDimArray<string>, height: number) {
  const copy = new TwoDimArray(MAX, MAX, ' ');
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      let char = map.get(x, y);
      if (char === 'X') {
        char = clean.get(x, y);
      }
      copy.set(x, y, char);
    }
  }
  return copy;
}

function loadCartState(map: TwoDimArray<string>, height: number) {
  let cartNextState: { [key:string]: Direction } = {};

  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      const char = map.get(x, y);
      if (isCart(char)) {
        const key = `${x},${y}`;
        cartNextState[key] = Direction.Left;
      }
    }
  }

  return cartNextState;
}

function tick(map: TwoDimArray<string>, clean: TwoDimArray<string>, cartNextState: { [key:string]: Direction }, height: number, part: number) {
  let cleaned = false;
  const cartNextNextState: { [key:string]: Direction } = {};
  const moved: { [key:string]: boolean } = {};
  const newMap = copyMap(map, height);
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      if (moved[`${x},${y}`]) {
        continue;
      }
      const char = newMap.get(x, y);
      if (isCart(char)) {
        let nextState = cartNextState[`${x},${y}`];
        let newX = x;
        let newY = y;
        if (char === '^') {
          newY--;
        } else if (char === '>') {
          newX++;
        } else if (char === 'v') {
          newY++;
        } else if (char === '<') {
          newX--;
        }

        const dest = newMap.get(newX, newY);
        let newChar = char;
        if (newMap.get(x,y) === 'X') {
          // already crashed
          if (part === 1) {
            continue;
          } else {
            console.log('Should not happen in part 2');
          }
        }
        if (isCart(dest)) {
          if (part === 1) {
            newChar = 'X';
          } else {
            console.log('cleaning');
            cleaned = true;
            newChar = clean.get(newX, newY);
          }
        } else if (dest === '/') {
          if (char === '^') {
            newChar = '>';
          } else if (char === '>') {
            newChar = '^';
          } else if (char === 'v') {
            newChar = '<';
          } else if (char === '<') {
            newChar = 'v';
          }
        } else if (dest === '\\') {
          if (char === '^') {
            newChar = '<';
          } else if (char === '>') {
            newChar = 'v';
          } else if (char === 'v') {
            newChar = '>';
          } else if (char === '<') {
            newChar = '^';
          }
        } else if (dest === '+') {
          if (char === '^') {
            if (nextState === Direction.Left) {
              newChar = '<';
            } else if (nextState === Direction.Straight) {
              newChar = '^';
            } else if (nextState === Direction.Right) {
              newChar = '>';
            }
          } else if (char === '>') {
            if (nextState === Direction.Left) {
              newChar = '^';
            } else if (nextState === Direction.Straight) {
              newChar = '>';
            } else if (nextState === Direction.Right) {
              newChar = 'v';
            }
          } else if (char === 'v') {
            if (nextState === Direction.Left) {
              newChar = '>';
            } else if (nextState === Direction.Straight) {
              newChar = 'v';
            } else if (nextState === Direction.Right) {
              newChar = '<';
            }
          } else if (char === '<') {
            if (nextState === Direction.Left) {
              newChar = 'v';
            } else if (nextState === Direction.Straight) {
              newChar = '<';
            } else if (nextState === Direction.Right) {
              newChar = '^';
            }
          }

          if (nextState === Direction.Left) {
            nextState = Direction.Straight;
          } else if (nextState === Direction.Straight) {
            nextState = Direction.Right;
          } else if (nextState === Direction.Right) {
            nextState = Direction.Left;
          }
        }
        newMap.set(x, y, clean.get(x, y));
        newMap.set(newX, newY, newChar);
        if (isCart(newChar)) {
          cartNextNextState[`${newX},${newY}`] = nextState;
          moved[`${newX},${newY}`] = true;
        }
      }
    }
  }

  if (cleaned) {
    console.log('New count', countCarts(newMap, height));
    printMap(map, height);
    printMap(newMap, height);
  }
  return { map:newMap, cartNextState: cartNextNextState };
}

function printMap(map: TwoDimArray<string>, height: number) {
  let output = '';
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      const char = map.get(x, y);
      if (isCart(char)){
        output += chalk.red(char);
      } else {
        output += map.get(x, y);
      }
    }
    output += '\n';
  }

  console.log(output);
}

function findCrash(map: TwoDimArray<string>, height: number) {
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      if (map.get(x, y) === 'X') {
        return { x, y };
      }
    }
  }
  return null;
}

function countCarts(map: TwoDimArray<string>, height: number) {
  let count = 0;
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      if (isCart(map.get(x, y))) {
        count++;
      }
    }
  }
  return count;
}

function findCart(map: TwoDimArray<string>, height: number) {
  for (let y = 0; y < MAX && y < height; y++) {
    for (let x = 0; x < MAX; x++) {
      if (isCart(map.get(x, y))) {
        return { x, y };
      }
    }
  }
  return {x: 0, y:0};
}


async function part1(input: Input) {
  const height = input.lines.length;
  let map = loadMap(input.raw.split('\n'));
  let cartNextState = loadCartState(map, height);
  const clean = cleanMap(map, height);
  let crash: { x: number, y: number } | null = null;

  printMap(map, height);
  console.log(cartNextState);

  while(true) {
    const results = tick(map, clean, cartNextState, height, 1);
    map = results.map;
    cartNextState = results.cartNextState;

    printMap(map, height);
    console.log(cartNextState);

    crash = findCrash(map, height);
    if (crash) {
      break;
    }
  }

  // printMap(map, height);

  return `${crash.x},${crash.y}`;
}

async function part2(input: Input) {
  const height = input.lines.length;
  let map = loadMap(input.raw.split('\n'));
  let cartNextState = loadCartState(map, height);
  const clean = cleanMap(map, height);
  let last: { x: number, y: number } = { x:0, y:0 };

  printMap(map, height);
  console.log(cartNextState);
  console.log('initial count', countCarts(map, height));

  while(true) {
    const results = tick(map, clean, cartNextState, height, 2);
    map = results.map;
    cartNextState = results.cartNextState;

    // printMap(map, height);
    // console.log(cartNextState);
    // map = cleanCrashes(map, clean, height);

    const c = countCarts(map, height);
    // console.log('count', c);
    if (c === 1) {
      last = findCart(map, height);
      break;
    } else if (c === 0) {
      console.log('Error, count is 0');
      printMap(map, height);
      break;
    }
  }

  // printMap(map, height);

  return `${last.x},${last.y}`;
}

module.exports = [
  part1,
  part2
];
