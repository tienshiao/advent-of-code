const fs = require('fs');

const string = fs.readFileSync('input2', 'utf8');
const lines = string.split('\n');

console.log(lines);

let oldTotal = 0;
let total = 0;
for (let i = 0; i < lines.length; i++) {
  const vals = lines[i].split(/\s+/);
  for (let j = 0; j < vals.length; j++) {
    const current = parseInt(vals[j]);
    for (let k = 0; k < vals.length; k++) {
      if (k == j) {
        continue;
      }
      const top = parseInt(vals[k]);
      if (top / current == Math.floor(top / current)) {
        total += top / current;
        console.log(top, current);
        break;
      } else if (current / top == Math.floor(current / top) ) {
        total += current / top;
        console.log(current, top);
        break;
      }
    }
  }
}

console.log(total /2);