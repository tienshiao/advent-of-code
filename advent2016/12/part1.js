const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

let pc = 0;
let registers = {
  a: 0,
  b: 0,
  c: 1,
  d: 0
};

do {
  const line = lines[pc];

  let matches;
  if ((matches = line.match(/cpy (\d+) (\w+)/))) {
    const value = matches[1];
    const register = matches[2];
    registers[register] = parseInt(value);
  } else if ((matches = line.match(/cpy (\w+) (\w+)/))) {
    const src = matches[1];
    const dest = matches[2];
    registers[dest] = registers[src];
  } else if ((matches = line.match(/inc (\w+)/))) {
    const register = matches[1];
    registers[register] += 1;
  } else if ((matches = line.match(/dec (\w+)/))) {
    const register = matches[1];
    registers[register] -= 1;
  } else if ((matches = line.match(/jnz (\w+) (-?\d+)/))) {
    const register = matches[1];
    const offset = matches[2];
    if (registers[register] !== 0) {
      pc += parseInt(offset);
      continue;
    }
  }
  pc++;
} while(pc < lines.length);

console.log(registers);