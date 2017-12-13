const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const lines = string.split('\n');

// build firewall
const firewall = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const parts = l.split(': ').map(x => parseInt(x));
  console.log(parts);

  firewall[parts[0]] = { len: parts[1], pos: 0, direction: 1 };
}

console.log(firewall);

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

let severity = 0;
for (let i = 0; i < firewall.length; i++) {
  const f = firewall[i];
  if (f && f.pos === 0) {
    // caught
    console.log('caught at', i);
    severity += i * f.len;
  }
  advanceState();
  console.log(i);
  console.log(firewall);
}

console.log(severity);