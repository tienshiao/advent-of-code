const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const lines = string.split('\n');

// build firewall
let firewall = [];

function resetState() {
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const parts = l.split(': ').map(x => parseInt(x));
    // console.log(parts);

    firewall[parts[0]] = { len: parts[1], pos: 0, direction: 1 };
  }
}

const time = 0;

function advanceState() {
  for (let i = 0; i < firewall.length; i++) {
    const f = firewall[i];
    if (f) {
      if (f.pos === 0) {
        f.direction = 1;
      } else if (f.pos === f.len - 1) {
        f.direction = -1;
      }
      f.pos = f.pos + f.direction;
    }
  }
}

function copyState() {
  const newFw = [];
  for (let i = 0; i < firewall.length; i++) {
    newFw[i] = Object.assign({}, firewall[i]);
  }
  return newFw;
}

function testFirewall() {
//  let severity = 0;
  for (let i = 0; i < firewall.length; i++) {
    const f = firewall[i];
    if (f && f.pos === 0) {
      // caught
      // console.log('caught at', i);
      return true;
    }
    advanceState();
  //   console.log(i);
  //   console.log(firewall);
  }
  return false;
}

let delay = 0;
let currDelay = 0;
let savedFw = firewall;
resetState();
while(true) {
  firewall = savedFw;
  for (; currDelay < delay; currDelay++) {
    advanceState();
  }
  savedFw = copyState();

  const s = testFirewall();
  console.log(delay, s);
  if (!s) {
    break;
  }
  delay += 2;
}