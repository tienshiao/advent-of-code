const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
//const string = 'ne,ne,ne';
//const string = 'ne,ne,s,s';
//const string = 'se,sw,se,sw,sw';
const parts = string.split(',');


/*
Hex grids can be represented as normal square grids by:
- rotating 45 degrees (roughly)
- offsetting each row by half

  \ n  /
nw +--+ ne
  /    \
-+ 0,0  +-
  \    /
sw +--+ se
  / s  \

becomes:

 nw  |  n
--+--+--+--
sw| 0,0 |ne
--+--+--+--
 s   |  se

becomes:

  0,1  |  1,1
----+--+--+----
-1,0| 0,0 | 1,0
----+--+--+----
 0,-1  |  1,-1

expands to:
-1,2| 0,2 | 1,2
----+--+--+----
  0,1  |  1,1
----+--+--+----
-1,0| 0,0 | 1,0
----+--+--+----
 0,-1  |  1,-1

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
  } else if (pos.y % 2 === 0) {
    if (move === 'n') {
      return {
        x: pos.x + 1,
        y: pos.y + 1
      };
    } else if (move === 'nw') {
      return {
        x: pos.x,
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
  } else if (Math.abs(pos.y % 2) === 1) {
    if (move === 'n') {
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
        x: pos.x - 1,
        y: pos.y - 1
      };
    } else if (move === 'se') {
      return {
        x: pos.x,
        y: pos.y - 1
      };
    }
  }
}

for (let i = 0; i < parts.length; i++) {
  curr = applyMove(curr, parts[i]);
  console.log(curr);
}

const target = curr;

// breadth first search
const visited = {}; // don't revisit old positions
const states = [];

states.push({
  depth: 0,
  pos: { x: 0, y: 0 }
});

while(states.length) {
  const state = states.shift();
  if (_.isEqual(state.pos, target)) {
    console.log('found at depth', state.depth);
    break;
  }

  // queue up next set of states
  for (let i = 0; i < moves.length; i++) {
    const next = applyMove(state.pos, moves[i]);
    if (!visited[JSON.stringify(next)]) {
      visited[JSON.stringify(next)] = true;
      states.push({
        depth: state.depth + 1,
        pos: next
      });
    }
  }
}