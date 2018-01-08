const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const particleString = string.split('\n');

const particleExample = {
  pos: { x: 0, y: 0, z: 0 },
  vel: { x: 0, y: 0, z: 0 },
  accel: { x: 0, y: 0, z: 0 },
};

const particles = particleString.map(ps => {
  const match = ps.match(/p=<(.*?)>, v=<(.*?)>, a=<(.*?)>/);
  const pos = match[1].split(',').map(s => {
    return parseInt(s.trim());
  });
  const vel = match[2].split(',').map(s => {
    return parseInt(s.trim());
  });
  const accel = match[3].split(',').map(s => {
    return parseInt(s.trim());
  });
  return {
    pos: {
      x: pos[0],
      y: pos[1],
      z: pos[2]
    },
    vel: {
      x: vel[0],
      y: vel[1],
      z: vel[2]
    },
    accel: {
      x: accel[0],
      y: accel[1],
      z: accel[2]
    }
  };
});

function calcAccel(p) {
  return p.accel.x * p.accel.x + p.accel.y * p.accel.y + p.accel.z * p.accel.z;
}

let minp = particles[0];
let minpIndex = 0;
for (let i = 1; i < particles.length; i++) {
  const p = particles[i];
  if (calcAccel(p) < calcAccel(minp)) {
    minpIndex = i;
    minp = p;
  }
}

console.log(minpIndex, minp);