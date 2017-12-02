const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

const width = lines[0].length;
const height = lines.length;

const destinations = [];
const routeCosts = {}; // key = '0:1', '0:2'; value = number of steps

// map/grid implementation
const map = [];

function get(map, x, y) {
  return map[x + y * width];
}

function set(map, x, y, val) {
  map[x + y * width] = val;
}

function print(map) {
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      const char = get(map, x, y);
      row.push(char);
    }
    console.log(row.join(''));
  }
}

function bfs(src, dest) {
  function generateMoves(state) {
    const moves = [];

    // N
    const north = get(map, state.x, state.y - 1);
    if (north == '.') {
      moves.push('N');
    }
    // E
    const east = get(map, state.x + 1, state.y);
    if (east == '.') {
      moves.push('E');
    }
    // S
    const south = get(map, state.x, state.y + 1);
    if (south == '.') {
      moves.push('S');
    }
    // W
    const west = get(map, state.x - 1, state.y);
    if (west == '.') {
      moves.push('W');
    }

    return moves;
  }

  function applyMove(state, move) {
    const newState = {
      depth: state.depth + 1,
      x: state.x,
      y: state.y
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

  const history = {};

  function isFinalState(state) {
    return state.x === destinations[dest].x && state.y === destinations[dest].y;
  }

  let totalState = {
    depth: 0,
    x: destinations[src].x,
    y: destinations[src].y
  };

  const queue = [totalState];
  while (queue.length) {
    const thisState = queue.shift();

    const moves = generateMoves(thisState);
    for (const move of moves) {
      const nextState = applyMove(thisState, move);
      const hash = `${nextState.x},${nextState.y}`;
      if (history[hash]) {
        continue;
      } else if (isFinalState(nextState)) {
        return nextState.depth;
      }
      queue.push(nextState);
      history[hash] = true;
    }
  }

  return 9999999;
}

// load map
let y = 0;
lines.forEach(line => {
  let x = 0;
  line.split('').forEach(char => {
    if (char == '#') {
      set(map, x, y, '#');
    } else if (char == '.') {
      set(map, x, y, '.');
    } else {
      const i = parseInt(char);
      if (i === 0 || i) {
        destinations[i] = { x, y };
      }
      set(map, x, y, '.');
    }
    x++;
  });
  y++;
});

print(map);
console.log(destinations);

// find cost between points
for (let src = 0; src < destinations.length; src++) {
  for (let dest = src + 1; dest < destinations.length; dest++) {
    const key = `${src}:${dest}`;
    const cost = bfs(src, dest);
    routeCosts[key] = cost;
  }
}

console.log(routeCosts);

// compute costs for permutations
const destinationNumbers = destinations.map((val, index) => {
  return index;
});

function getCost(start, end) {
  if (start < end) {
    return routeCosts[`${start}:${end}`];
  } else {
    return routeCosts[`${end}:${start}`];
  }
}

function generateMoves(state) {
  if (state.route.length == destinations.length) {
    return [0];
  }
  const moves = _.difference(destinationNumbers, state.route);
  return moves;
}

function applyMove(state, move) {
  const newState = _.cloneDeep(state);
  newState.depth++;
  newState.cost += getCost(state.route[state.route.length - 1], move);
  newState.route.push(move);
  return newState;
}

function isFinalState(state) {
  return state.route.length == destinations.length + 1;
}

let totalState = {
  depth: 0,
  cost: 0,
  route: [0]
};

const queue = [totalState];
let shortest = null;
while (queue.length) {
  const thisState = queue.shift();
  console.log(thisState);
  const moves = generateMoves(thisState);
  console.log(moves);
  for (const move of moves) {
    const nextState = applyMove(thisState, move);
    if (isFinalState(nextState)) {
      console.log(nextState);

      if (shortest) {
        if (nextState.cost < shortest.cost) {
          shortest = nextState;
        }
      } else {
        shortest = nextState;
      }
    }
    queue.push(nextState);
  }
}

console.log('shortest', shortest);