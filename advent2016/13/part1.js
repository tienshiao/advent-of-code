const _ = require('lodash');

const input = 1362;
const final = {
  x: 31,
  y: 39
};

let history = {};

function isWall(x, y) {
  const value = x*x + 3*x + 2*x*y + y + y*y + input;
  return value.toString(2).split('').filter((bit) => { return bit == 1; }).length % 2 == 1;
}

function isValidState(state) {
  const x = state.x;
  const y = state.y;
  if (x < 0 || y < 0) {
    return false;
  }
  // not valid if a previous state in history
  if (history[`${x},${y}`]) {
    return false;
  }
  if (isWall(x, y)) {
    return false;
  }
  return true;
}

function isFinalState(x, y) {
  return x == final.x && y == final.y;
}

function makeNextMove(lastMove) {
  // NESW
  const moves = ['N', 'E', 'S', 'W', null];
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

  if (move == 'N') {
    newState.y -= 1;
  } else if (move == 'E') {
    newState.x += 1;
  } else if (move == 'S') {
    newState.y += 1;
  } else if (move == 'W') {
    newState.x -= 1;
  }
  return newState;
}

let totalState = {
  depth: 0,
  move: null,
  current: {
    x: 1,
    y: 1
  }
};

let queue = [totalState];
while (queue.length) {
  const thisState = queue.shift();
  console.log(thisState);
  let nextMove = thisState.move;
  do {
    do {
      nextMove = makeNextMove(nextMove);
      if (nextMove === null) {
        // no next move
        break;
      }
    } while (!isValidState(applyMove(thisState, nextMove)));

    if (nextMove) {
      const nextState = {
        depth: thisState.depth + 1,
        move: null,
        current: applyMove(thisState, nextMove)
      };
      queue.push(nextState);
      history[`${nextState.current.x},${nextState.current.y}`] = true;
      if (isFinalState(nextState.current.x, nextState.current.y)) {
        console.log(nextState);
        return;
      }
    } else {
      // no more valid at current state
      break;
    }
  } while (nextMove);
}



