const _ = require('lodash');

// let state = {
//   'polonium generator': 0,   // PG
//   'thulium generator': 0,    // TG
//   'thulium chip': 0,         // TM
//   'promethium generator': 0, // XG
//   'ruthenium generator': 0,  // RG
//   'ruthenium chip': 0,       // RM
//   'cobalt generator': 0,     // CG
//   'cobalt chip': 0,          // CM
//   'polonium chip': 1,        // PC
//   'promethium chip': 1       // XC
// };

const NUM_OF_FLOORS = 4;

const parts = [ 'CG', 'CM', 'PG', 'PM', 'RG', 'RM', 'TG', 'TM', 'XG', 'XM' ];

// complements
const complements = {
  EE: 'EE',
  CG: 'CM',
  CM: 'CG',
  PG: 'PM',
  PM: 'PG',
  RG: 'RM',
  RM: 'RG',
  TG: 'TM',
  TM: 'TG',
  XG: 'XM',
  XM: 'XG'
};

// inital state
let state = {
  EE: 0,
  PG: 0,
  TG: 0,
  TM: 0,
  XG: 0,
  RG: 0,
  RM: 0,
  CG: 0,
  CM: 0,
  PM: 1,
  XM: 1
};

let history = [];

let totalState = {
  depth: 0,
  move: {
    elevator: null,
    take: [],
  },
  current: _.cloneDeep(state)
};
// possible moves - EE goes up/down, take 1 (iterate), take 2 (iterate)


function isMicroChip(part) {
  return part.charAt(1) == 'M';
}

function isGenerator(part) {
  return part.charAt(1) == 'G';
}

function isValidState(state) {
  // not valid if a previous state in history
  const found = _.find(history, (value) => {
    return _.isEqual(value.current, state);
  });
  if (found) {
    return false;
  }
  for (let i = 0; i < NUM_OF_FLOORS; i++) {
    const parts = _.keys(_.pickBy(state, (floor) => { return floor == i; }));
    const generators = parts.filter((part) => { return !isMicroChip(part); });
    const microchips = parts.filter((part) => { return isMicroChip(part); });

    for (let m of microchips) {
      const complement = complements[m];
      if (generators.indexOf(complement) > -1) {
        // same floor as complementary generator, so OK
        continue;
      } else if (generators.length == 0) {
        // no generators, so OK
        continue;
      } else {
        // no complementary generator, not a valid state
        return false;
      }
    }
  }
  return true;
}

function isFinalState(state) {
  const finalState = {
    EE: 3,
    PG: 3,
    TG: 3,
    TM: 3,
    XG: 3,
    RG: 3,
    RM: 3,
    CG: 3,
    CM: 3,
    PM: 3,
    XM: 3
  };
  return _.isEqual(state, finalState);
}

function nextParts(lastTake) {
  let nextTake = null;
  if (lastTake.length === 0) {
    nextTake = [parts[0]];
  } else if (lastTake.length == 1) {
    const nextPart = parts[parts.indexOf(lastTake[0]) + 1];
    if (nextPart) {
      nextTake = [nextPart];
    } else {
      nextTake = [parts[0], parts[0]]; // not a valid move, but OK for advancing
    }
  } else if (lastTake.length == 2) {
    const nextPart = parts[parts.indexOf(lastTake[1]) + 1];
    if (nextPart) {
      nextTake = [lastTake[0], nextPart];
    } else {
      const nextFirstPart = parts[parts.indexOf(lastTake[0]) + 1];
      if (nextFirstPart) {
        nextTake = [nextFirstPart, parts[0]];
      } else {
        // overflowed, no more parts
      }
    }
  }
  return nextTake;
}

function makeNextMove(lastMove) {
  let nextMove = {
    elevator: lastMove.elevator,
    take: []
  } ;
  if (!lastMove.elevator) {
    nextMove.elevator = +1; // default to going up
  } else if (lastMove.elevator == 1) {
    const nextTake = nextParts(lastMove.take);
    if (nextTake) {
      nextMove.take = nextTake;
    } else {
      // no more moves, reset to go down and empty take
      nextMove =  {
        elevator: -1,
        take: []
      };
    }
  } else if (lastMove.elevator == -1) {
    const nextTake = nextParts(lastMove.take);
    if (nextTake) {
      nextMove.take = nextTake;
    } else {
      // no more moves
      nextMove = null;
    }
  }
  return nextMove;
}

function addToHistory(totalState, move) {
  history.push({
    move: _.cloneDeep(move),
    current: _.cloneDeep(totalState.current)
  });
}

function applyMove(totalState, move) {
  let newState = _.cloneDeep(totalState.current);
  newState.EE = newState.EE + move.elevator;
  move.take.forEach((part) => {
    newState[part] = newState.EE;
  });
  return newState;
}

function isValidMove(totalState, move) {
  // check elevator (can't move up on top floor, can't move down on bottom floor
  if (totalState.current.EE === 0 && move.elevator == -1) {
    return false;
  } else if (totalState.current.EE === NUM_OF_FLOORS - 1 && move.elevator == 1) {
    return false;
  } else if (move.take.length == 0) {
    return false;
  } else if (move.take.length == 1) {
    if (totalState.current[move.take[0]] != totalState.current.EE) {
      // part we're moving is not on the current floor
      return false;
    }
  } else if (move.take.length == 2) {
    if (move.take[0] == move.take[1]) {
      // can't take 2 of the same thing
      return false;
    } else if (totalState.current[move.take[0]] != totalState.current.EE ||
               totalState.current[move.take[1]] != totalState.current.EE) {
      // parts are not on the current floor
      return false;
    } else if ((isMicroChip(move.take[0]) && isGenerator(move.take[1]) && complements[move.take[0]] != move.take[1]) ||
               (isMicroChip(move.take[1]) && isGenerator(move.take[0]) && complements[move.take[0]] != move.take[1])) {
      // parts can not be moved together
      return false;
  } else if (move.elevator == -1) {
    if (isMicroChip(move.take[0]) || isMicroChip(move.take[1])) {
      // don't take microchips down
      return false;
    }
  }
  return true;
}

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
    } while(!(isValidMove(thisState, nextMove) && isValidState(applyMove(thisState, nextMove))));

    if (nextMove) {
      const nextState = {
        depth: thisState.depth + 1,
        move: {
          elevator: null,
          take: []
        },
        current: applyMove(thisState, nextMove)
      };
      queue.push(nextState);
      history.push(nextState);
      if (isFinalState(nextState.current)) {
        console.log(nextState);
        return;
      }
    } else {
      // no more valid at current state
      break;
    }
  } while (nextMove);
}



