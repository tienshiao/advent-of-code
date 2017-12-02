const fs = require('fs');
const crypto = require('crypto');
const _ = require('lodash');

const width = 37;
const height = 25;
// const width = 3;
// const height = 3;
const dataX = 36;
const dataY = 0;

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');
const devices = lines.map(line => {
  const matches = line.match(/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/);
  return {
    x: parseInt(matches[1]),
    y: parseInt(matches[2]),
    size: parseInt(matches[3]),
    used: parseInt(matches[4]),
    avail: parseInt(matches[5]),
    percent: parseInt(matches[6])
  };
});

// map/grid implementation
const map = [];

function get(map, x, y) {
  return map[x + y * width];
}

function set(map, x, y, val) {
  map[x + y * width] = val;
}

// create grid
devices.forEach(device => {
  set(map, device.x, device.y, { size: device.size, used: device.used, avail: device.avail });
});

for (let y = 0; y < height; y++) {
  let row = [];
  for (let x = 0; x < width; x++) {
    const device = get(map, x, y);
    if (x == dataX && y == dataY) {
      row.push('G');
    } else if (x === 0 && y === 0) {
      row.push('o');
    } else if (device.used === 0) {
      row.push('_');
    } else if (device.used > 100) {
      row.push('#');
    } else {
      row.push('.');
    }
  }
  console.log(row.join(' '));
}

return;


// state -> string
function makeStateString(state) {
  const temp = {
    data: state.data,
    grid: state.grid
  };

  return crypto.createHash('sha256').update(JSON.stringify(temp)).digest('hex');
}

function generateMoves(grid) {
  const moves = [];
  for (let device of devices) {
    const src = get(grid, device.x, device.y);
    // left
    if (device.x - 1 >= 0) {
      const dest = get(grid, device.x - 1, device.y);
      if (src.used <= dest.avail) {
        moves.push({
          src: { x: device.x, y: device.y },
          dest: { x: device.x - 1, y: device.y }
        });
      }
    }
    // top
    if (device.y - 1 >= 0) {
      const dest = get(grid, device.x, device.y - 1);
      if (src.used <= dest.avail) {
        moves.push({
          src: { x: device.x, y: device.y },
          dest: { x: device.x, y: device.y - 1 }
        });
      }
    }
    // right
    if (device.x + 1 < width) {
      const dest = get(grid, device.x + 1, device.y);
      if (src.used <= dest.avail) {
        moves.push({
          src: { x: device.x, y: device.y },
          dest: { x: device.x + 1, y: device.y }
        });
      }
    }
    // bottom
    if (device.y + 1 < height) {
      const dest = get(grid, device.x, device.y + 1);
      if (src.used <= dest.avail) {
        moves.push({
          src: { x: device.x, y: device.y },
          dest: { x: device.x, y: device.y + 1 }
        });
      }
    }
  }
  return moves;
}

// move = { src: { x, y }, dest: { x, y } }
function applyMove(state, move) {
  const grid = _.cloneDeep(state.grid);
  const src = get(grid, move.src.x, move.src.y);
  const dest = get(grid, move.dest.x, move.dest.y);
  dest.used += src.used;
  dest.avail = dest.size - dest.used;
  src.used = 0;
  src.avail = src.size;

  let data = state.data;
  if (data.x == move.src.x && data.y == move.src.y) {
    data = {
      x: move.dest.x,
      y: move.dest.y
    };
  }
  const newState = {
    depth: state.depth + 1,
    data: data,
    grid: grid
  };

  return newState;
}

let history = {};

function isFinalState(state) {
  return state.data.x === 0 && state.data.y === 0;
}

let totalState = {
  depth: 0,
  data: { x: dataX, y: dataY },
  grid: map
};

let queue = [totalState];
while (queue.length) {
  const thisState = queue.shift();

  const moves = generateMoves(thisState.grid);
  console.log(thisState.depth, moves.length, queue.length);
  for (const move of moves) {
    const nextState = applyMove(thisState, move);
    const hash = makeStateString(nextState);
    if (history[hash]) {
      // already saw this state
      continue;
    } else if (isFinalState(nextState)) {
      console.log(nextState);
      return;
    }
    queue.push(nextState);
    history[hash] = true;
  }
}

console.log('not found');


