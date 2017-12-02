const _ = require('lodash');
const crypto = require('crypto');

function md5(input) {
  return crypto.createHash('md5').update(input).digest("hex");
}

const input = 'vkjiggvb';
const final = {
  x: 3,
  y: 3
};


function isValidState(state) {
  const x = state.x;
  const y = state.y;
  if (x < 0 || y < 0) {
    return false;
  }
  if (x > 3 || y > 3) {
    return false;
  }
  return true;
}

function isFinalState(x, y) {
  return x == final.x && y == final.y;
}

function makeNextMove(lastMove) {
  const moves = ['U', 'D', 'L', 'R', null];
  if (lastMove === null) {
    return moves[0];
  } else {
    return moves[moves.indexOf(lastMove) + 1];
  }
}

function applyMove(totalState, move) {
  let newState = {
    x: totalState.current.x,
    y: totalState.current.y
  };

  if (move == 'U') {
    newState.y -= 1;
  } else if (move == 'R') {
    newState.x += 1;
  } else if (move == 'D') {
    newState.y += 1;
  } else if (move == 'L') {
    newState.x -= 1;
  }
  return newState;
}

function isValidMove(path, direction) {
  const hash4 = md5(input + path).substr(0, 4);
  const dirs = 'UDLR';
  const door = hash4.charAt(dirs.indexOf(direction));
  return parseInt(door, 16) > 10;
}

let totalState = {
  depth: '',
  move: null,
  current: {
    x: 0,
    y: 0
  }
};

let queue = [totalState];
while (queue.length) {
  const thisState = queue.shift();
  //console.log(thisState);
  let nextMove = thisState.move;
  do {
    do {
      nextMove = makeNextMove(nextMove);
      if (nextMove === null) {
        // no next move
        break;
      }
    } while (!(isValidMove(thisState.depth, nextMove) && isValidState(applyMove(thisState, nextMove))));

    if (nextMove) {
      const nextState = {
        depth: thisState.depth + nextMove,
        move: null,
        current: applyMove(thisState, nextMove)
      };
      if (isFinalState(nextState.current.x, nextState.current.y)) {
        console.log('found', nextState.depth.length, nextState);
      } else {
        queue.push(nextState);
      }
    } else {
      // no more valid at current state
      break;
    }
  } while (nextMove);
}



