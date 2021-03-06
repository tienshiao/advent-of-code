const fs = require('fs');

const string = fs.readFileSync('input1', 'utf8');
let lines = string.split('\n');
//const lines = [ 'aa bb cc dd ee aaa' ];
lines = lines.map(l => parseInt(l));
console.log(lines, lines.length);

let pc = 0;
let steps = 0;
while(pc >= 0 && pc < lines.length) {
  const oldPc = pc;
  const jump = lines[pc];
  pc += lines[pc];
  if (jump >= 3) {
    lines[oldPc]--;
  } else {
    lines[oldPc]++;
  }
  steps++;
}

console.log(steps);