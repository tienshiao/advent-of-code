const fs = require('fs');
const _ = require('lodash');
const ndarray = require('ndarray');

const string = fs.readFileSync('input1', 'utf8');
const mapstring = string.split('\n');
console.log(string);
console.log(mapstring);

const height = mapstring.length;
let width = 0;

mapstring.forEach(ms => {
  if (ms.length > width) {
    width = ms.length;
  }
});

const map = ndarray(new Array(height * width), [height, width]);

// load map
for (let i = 0; i < mapstring.length; i++) {
  const ms = mapstring[i].split('');
  for (let j = 0; j < ms.length; j++) {
    console.log(i, j, ms[j]);
    map.set(i, j, ms[j]);
  }
}

let pos = {
  x: null,
  y: 0
};

let direction = 'd'; // u, l , r

// find starting position
for (let i = 0; i < width; i++) {
  const val = map.get(0, i);
  if (val === '|') {
    pos.x = i;
    break;
  }
}

console.log(pos);
console.log(map.get(0, 6));

const letters = [];

function step(pos, direction) {
  if (direction == 'd') {
    return {
      x: pos.x,
      y: pos.y + 1
    };
  } else if (direction == 'u') {
    return {
      x: pos.x,
      y: pos.y - 1
    };
  } else if (direction == 'l') {
    return {
      x: pos.x - 1,
      y: pos.y
    };
  } else if (direction == 'r') {
    return {
      x: pos.x + 1,
      y: pos.y
    };
  }
}

function findNewDirection(currentPos, oldDirection) {
  const directions = 'udlr'.split('');
  const dMap = {
    'u': 'd',
    'd': 'u',
    'l': 'r',
    'r': 'l'
  };

  for (let d of directions) {
    if (d !== dMap[oldDirection]) {
      const pos = step(currentPos, d);
      const val = map.get(pos.y, pos.x);
      if (val && val != ' ') {
        console.log(val);
        return d;
      }
    }
  }
}

let prevpos = null;
let steps = 0;
while(true) {
  const newpos = step(pos, direction);

  if (newpos.y < 0 || newpos.y > height || newpos.x < 0 || newpos.x > width) {
    break;
  }

  steps++;
  const nextchar = map.get(newpos.y, newpos.x);
  console.log(newpos, nextchar);
  if (nextchar === '+') {
    // need to change directions
    direction = findNewDirection(newpos, direction);
  }
  if (nextchar != '|' && nextchar != '-' && nextchar != '+') {
    if (nextchar == ' ') {
      break;
    }
    letters.push(nextchar);
    console.log(letters);
  }
  pos = newpos;
}

console.log(letters.join(''));
console.log(steps);
