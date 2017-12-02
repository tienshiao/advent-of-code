const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

let pc = 0;
let registers = {
  a: 12,
  b: 0,
  c: 0,
  d: 0
};

function toggle(offset) {
  //console.log('toggle', offset);
  const line = lines[pc + offset];
  if (!line) {
    return;
  }

  let newInstruction = null;
  if ((matches = line.match(/(\w+) (\w+) (\w)/))) {
    const instruction = matches[1];
    // two args
    if (instruction == 'jnz') {
      newInstruction = ['cpy', matches[2], matches[3]];
    } else {
      newInstruction = ['jnz', matches[2], matches[3]];
    }
  } else if ((matches = line.match(/(\w+) (\w+)/))) {
    //console.log(matches);
    const instruction = matches[1];
    // one args
    if (instruction == 'inc') {
      newInstruction = ['dec', matches[2]];
    } else {
      newInstruction = ['inc', matches[2]];
    }
  }
  //console.log('toggle', line, newInstruction.join(' '));

  lines[pc + offset] = newInstruction.join(' ');
}

do {
  const line = lines[pc];
  console.log(pc, line);

  let matches;
  if ((matches = line.match(/cpy (-?\d+) (\w+)/))) {
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
    let val = parseInt(register);
    if (isNaN(val)) {
      val = registers[register];
    }
    if (val !== 0) {
      pc += parseInt(offset);
      continue;
    }
  } else if ((matches = line.match(/jnz (\w+) (\w+)/))) {
    const register = matches[1];
    const offset = matches[2];
    let val = parseInt(register);
    if (isNaN(val)) {
      val = registers[register];
    }
    if (val !== 0) {
      pc += registers[offset];
      continue;
    }
  } else if ((matches = line.match(/tgl (\w+)/))) {
    const register = matches[1];
    toggle(registers[register]);
  }
  pc++;
  console.log(registers);

  if (pc == 5) {
    registers.a = registers.c * registers.d;
    registers.c = 0;
    registers.d = 0;
    pc = 10;
  }
} while(pc < lines.length);

console.log(registers);