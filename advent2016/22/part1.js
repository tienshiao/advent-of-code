const fs = require('fs');
const _ = require('lodash');

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
    usePercent: parseInt(matches[6])
  };
});

let pairs = 0;
for (let nodeA of devices) {
  if (nodeA.used) {
    pairs += devices.filter(nodeB => {
      if (nodeA.x == nodeB.x && nodeA.y == nodeB.y) {
        return false;
      }
      return nodeA.used <= nodeB.avail;
    }).length;
  }
}

console.log(pairs);
