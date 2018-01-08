const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const input = string.split('\n');
const initialSize = input.length;
const offset = Math.floor(initialSize / 2);
const iterations = 10000000;
const map = { };
const mapDim = {
  x1: -offset,
  y1: +offset,
  x2: +offset,
  y2: -offset
};

function makeKey(x, y) {
  return `${x},${y}`;
}

function printMap() {
  const string = [];
  for (let y = mapDim.y1 + 1; y >= mapDim.y2; y--) {
    for (let x = mapDim.x1; x < mapDim.x2 + 1; x++) {
      string.push(map[makeKey(x, y)] || '.');
    }
    string.push('\n');
  }
  console.log(string.join(''));
}

// load map;
for (let i = 0; i < input.length; i++) {
  const line = input[i].split('');
  for (let j = 0; j < line.length; j++) {
    map[makeKey(j - offset, offset - i)] = line[j];
  }
}

printMap();

let pos = {
  x: 0,
  y: 0
};

const leftMapping = {
  n: 'w',
  e: 'n',
  s: 'e',
  w: 's'
};
const rightMapping = {
  n: 'e',
  e: 's',
  s: 'w',
  w: 'n',
};
const reverseMapping = {
  n: 's',
  e: 'w',
  s: 'n',
  w: 'e'
};

let direction = 'n';

function rotate() {
  const curr = map[makeKey(pos.x, pos.y)];
  if (curr == '#') {
    direction = rightMapping[direction];
    // console.log('infected, turning right to', direction);
  } else if (curr == 'W') {
    direction = direction;
  } else if (curr == 'F') {
    direction = reverseMapping[direction];
  } else {
    direction = leftMapping[direction];
    // console.log('clean, turning left to', direction);
  }
}

let infectionsCaused = 0;

function infectOrClean() {
  const key = makeKey(pos.x, pos.y);
  const curr = map[key];
  let newVal = null;
  if (curr == '#') {
    map[key] = 'F';
    // console.log('# -> flagged', pos.x, pos.y);
  } else if (curr == 'W') {
    map[key] = '#';
    // console.log('W -> infected', pos.x, pos.y);
    infectionsCaused++;
  } else if (curr == 'F') {
    map[key] = '.';
    // console.log('F -> cleaned', pos.x, pos.y);
  } else {
    map[key] = 'W';
    // console.log('. -> weakened', pos.x, pos.y);
  }
}

function move() {
  if (direction == 'n') {
    pos.y += 1;
  } else if (direction == 'e') {
    pos.x += 1;
  } else if (direction == 's') {
    pos.y -= 1;
  } else if (direction == 'w') {
    pos.x -= 1;
  }
  // console.log('pos', pos);

  if (pos.x > mapDim.x2) {
    mapDim.x2 = pos.x;
  }
  if (pos.x < mapDim.x1) {
    mapDim.x1 = pos.x;
  }
  if (pos.y < mapDim.y2) {
    mapDim.y2 = pos.y;
  }
  if (pos.y > mapDim.y1) {
    mapDim.y1 = pos.y;
  }
}

for (let i = 0; i < iterations; i++) {
  if (i % 1000 === 0) {
    console.log(i);
  }
  rotate();
  infectOrClean();
  move();
  // console.log(map);
  // printMap();
}

console.log(infectionsCaused);