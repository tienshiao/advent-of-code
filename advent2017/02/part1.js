const fs = require('fs');

const string = fs.readFileSync('test', 'utf8');
const lines = string.split('\n');

console.log(lines);

let total = 0;
for (let i = 0; i < lines.length; i++) {
  const vals = lines[i].split(/\s+/);
  let max = -1;
  let min = 100000000000000000;
  for (let j = 0; j < vals.length; j++) {
    const current = parseInt(vals[j]);
    if (current > max) {
      max = current;
    }
    if (current < min) {
      min = current;
    }
    console.log(max, min);
  }
  total += max - min;
}

console.log(total);