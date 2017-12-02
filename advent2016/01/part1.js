const _ = require('lodash');

let position = {
  x: 0,
  y: 0
};

let visits = {
  '0,0': 1
};

let direction = 'north';
let directionArray = ['north', 'east', 'south', 'west'];
let directionMap = {
  north: {
    y: 1,
    x: 0
  },
  east: {
    y: 0,
    x: 1
  },
  south: {
    y: -1,
    x: 0
  },
  west: {
    y: 0,
    x: -1
  }
};

const routeString = 'L4, R2, R4, L5, L3, L1, R4, R5, R1, R3, L3, L2, L2, R5, R1, L1, L2, R2, R2, L5, R5, R5, L2, R1, R2, L2, L4, L1, R5, R2, R1, R1, L2, L3, R2, L5, L186, L5, L3, R3, L5, R4, R2, L5, R1, R4, L1, L3, R3, R1, L1, R4, R2, L1, L4, R5, L1, R50, L4, R3, R78, R4, R2, L4, R3, L4, R4, L1, R5, L4, R1, L2, R3, L2, R5, R5, L4, L1, L2, R185, L5, R2, R1, L3, R4, L5, R2, R4, L3, R4, L2, L5, R1, R2, L2, L1, L2, R2, L2, R1, L5, L3, L4, L3, L4, L2, L5, L5, R2, L3, L4, R4, R4, R5, L4, L2, R4, L5, R3, R1, L1, R3, L2, R2, R1, R5, L4, R5, L3, R2, R3, R1, R4, L4, R1, R3, L5, L1, L3, R2, R1, R4, L4, R3, L3, R3, R2, L3, L3, R4, L2, R4, L3, L4, R5, R1, L1, R5, R3, R1, R3, R4, L1, R4, R3, R1, L5, L5, L4, R4, R3, L2, R1, R5, L3, R4, R5, L4, L5, R2';
//const routeString = 'R5, L5, R5, R3';
const route = routeString.split(', ');

_.each(route, (step) => {
  console.log('step', step);
  const leftOrRight = step.charAt(0);
  const distance = parseInt(step.substr(1));
  // turn
  if (leftOrRight == 'R') {
    console.log('turn right', leftOrRight);
    let position = directionArray.indexOf(direction) + 1;
    if (position >= directionArray.length) {
      position = 0;
    }
    direction = directionArray[position];
  } else {
    console.log('turn left');
    let position = directionArray.indexOf(direction) - 1;
    if (position < 0) {
      position = directionArray.length - 1;
    }
    direction = directionArray[position];
  }
  console.log('direction', direction);

  // move
  for (let i = 0; i < distance; i++) {
    position.y += directionMap[direction].y;
    position.x += directionMap[direction].x;

    const key = `${position.x},${position.y}`;
    if (visits[key]) {
      visits[key] = visits[key] + 1;
    } else {
      visits[key] = 1;
    }

    if (visits[key] > 1) {
      console.log('position', position);
      console.log('blocks', Math.abs(position.x) + Math.abs(position.y));
      process.exit();
    }
  }
});

console.log('position', position);
console.log('blocks', Math.abs(position.x) + Math.abs(position.y));
