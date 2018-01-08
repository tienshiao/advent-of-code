const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const lines = string.split('\n');
const components = lines.map(l => {
  const parts = l.split('/');
  const bridge = parts.map(x => parseInt(x)).sort();
  return bridge;
}).sort();

console.log(components);

// bridge
const root = {
  last: 0,
  components: components,
//  chain: [],
  length: 0,
  strength: 0
};

let queue = [ root ];
let maxStr = 0;
let maxLength = 0;

while (queue.length) {
  const curr = queue.shift();
  const candidates = curr.components.filter(x => curr.last == x[0] || curr.last == x[1]);

  for (let c of candidates) {
    const newLast = (curr.last == c[0]) ? c[1] : c[0];
    const b = {
      last: newLast,
//      chain: curr.chain.concat([ c ]),
      components: curr.components.filter(x => x != c),
      length: curr.length + 1,
      strength: curr.strength + c[0] + c[1]
    };
    queue.push(b);

    if (b.length == maxLength) {
      if (b.strength > maxStr) {
        maxLength = b.length;
        maxStr = b.strength;
      }
    } else if (b.length > maxLength) {
      maxLength = b.length;
      maxStr = b.strength;
    }
  }
  console.log(queue.length);
}
console.log(maxStr);