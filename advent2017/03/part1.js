const target = 289326;

let currCoord = {
  x: 0,
  y: 0
};

let currDirection = 's';

const nextDirection = {
  e: 'n',
  n: 'w',
  w: 's',
  s: 'e'
};

function makeNextCoord(currentCoord, direction) {
  if (direction == 'e') {
    return {
      x: currentCoord.x + 1,
      y: currentCoord.y
    };
  }
  if (direction == 'n') {
    return {
      x: currentCoord.x,
      y: currentCoord.y + 1
    };
  }
  if (direction == 'w') {
    return {
      x: currentCoord.x - 1,
      y: currentCoord.y,
    };
  }
  if (direction == 's') {
    return {
      x: currentCoord.x,
      y: currentCoord.y - 1
    };
  }
}

function makeCoordKey(coord) {
  return `${coord.x}:${coord.y}`;
}

const visited = { '0:0': 1 };

for (i = 2; i <= target; i++) {
  let next = makeNextCoord(currCoord, nextDirection[currDirection]);
  let nextKey = makeCoordKey(next);
  if (!visited[nextKey]) {
    currDirection = nextDirection[currDirection];
  } else {
    // continue in current direction
    next = makeNextCoord(currCoord, currDirection);
    nextKey = makeCoordKey(next);
  }
  visited[nextKey] = i;
  currCoord = next;
  console.log(i, currDirection, currCoord);
}

console.log(currCoord.x, currCoord.y, Math.abs(currCoord.x) + Math.abs(currCoord.y));