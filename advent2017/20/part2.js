const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const particleString = string.split('\n');

const particleExample = {
  pos: { x: 0, y: 0, z: 0 },
  vel: { x: 0, y: 0, z: 0 },
  accel: { x: 0, y: 0, z: 0 },
};

let particles = particleString.map(ps => {
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

function step(p) {
  return {
    pos: {
      x: p.pos.x + p.vel.x + p.accel.x,
      y: p.pos.y + p.vel.y + p.accel.y,
      z: p.pos.z + p.vel.z + p.accel.z
    },
    vel: {
      x: p.vel.x + p.accel.x,
      y: p.vel.y + p.accel.y,
      z: p.vel.z + p.accel.z
    },
    accel: {
      x: p.accel.x,
      y: p.accel.y,
      z: p.accel.z
    }
  };
}

function posEqual(p1, p2) {
  return p1.pos.x === p2.pos.x &&
         p1.pos.y === p2.pos.y &&
         p1.pos.z === p2.pos.z;
}

for (let t = 0; t < 1000; t++) {
  // step all particles
  particles = particles.map(p => step(p));

  // mark collisions
  for (let i = 0; i < particles.length; i++) {
    let collision = false;
    if (!particles[i]) {
      continue;
    }
    for (let j = i + 1; j < particles.length; j++) {
      if (!particles[j]) {
        continue;
      }
      if (posEqual(particles[i], particles[j])) {
        particles[j] = null;
        collision = true;
      }
    }
    if (collision) {
      particles[i] = null;
    }
  }

  // filter out collisions
  particles = particles.filter(p => !!p);
  console.log(t, particles.length);
}

console.log(particles.length);