const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

function run(input) {
  let pc = 0;
  let registers = {
    a: input,
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

  const out = [];

  do {
    const line = lines[pc];
    // console.log(pc, line);

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
    } else if ((matches = line.match(/out (\w+)/))) {
      const register = matches[1];
      out.push(registers[register]);
      // console.log('out', out);
      if (registers.b == 2) {
        return;
      }
    }
    pc++;
    // console.log(registers);

    if (pc == 3) {
      registers.d += (registers.b * registers.c);
      registers.b = 0;
      registers.c = 0;
      pc = 8;
    } else if (pc == 10) {
      registers.c = registers.a % 2 ? 1 : 2;
      registers.a = Math.floor(registers.a / 2);
      registers.b = 0;
      pc = 20;
    } else if (pc == 29) {
      return out;
    }
  } while(pc < lines.length);
}

function isFinal(input) {
  if (input[0] == input[input.length - 1]) {
    return false;
  } else if (input.length % 2 == 1) {
    return false;
  }
  for (let i = 0; i < input.length; i++) {
    if (i % 2 != input[i]) {
      return false;
    }
  }
  return true;
}

let testInput = 0;
let output;
do {
  output = run(testInput);
  console.log(testInput, output);
  testInput++;
} while(!isFinal(output));

console.log('winner', output);