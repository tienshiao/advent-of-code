const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
//const string = 'ne,ne,ne';
//const string = 'ne,ne,s,s';
//const string = 'se,sw,se,sw,sw';
const parts = string.split(',');

/*
For part2, we represent the grid with both x and y "along the grain".
According to: http://keekerdc.com/2011/03/hexagon-grids-coordinate-systems-and-distance-calculations/
Then we add a z axis for calculating distance.
*/

let curr = {
  x: 0,
  y: 0
};

const moves = [ 'ne', 'sw', 'n', 'nw', 's', 'se' ];

function applyMove(pos, move) {
  if (move === 'ne') {
    return {
      x: pos.x + 1,
      y: pos.y
    };
  } else if (move === 'sw') {
    return {
      x: pos.x - 1,
      y: pos.y
    };
  } else if (move === 'n') {
    return {
      x: pos.x,
      y: pos.y + 1
    };
  } else if (move === 'nw') {
    return {
      x: pos.x - 1,
      y: pos.y + 1
    };
  } else if (move === 's') {
    return {
      x: pos.x,
      y: pos.y - 1
    };
  } else if (move === 'se') {
    return {
      x: pos.x + 1,
      y: pos.y - 1
    };
  }
}

function calcDistance(pos) {
  const z = 0 - pos.x - pos.y;
  return Math.max(Math.abs(pos.x), Math.abs(pos.y), Math.abs(z));
}

let max = 0;
for (let i = 0; i < parts.length; i++) {
  curr = applyMove(curr, parts[i]);
  console.log(curr);
  const distance = calcDistance(curr);
  if (distance > max) {
    max = distance;
  }
}
console.log(max);