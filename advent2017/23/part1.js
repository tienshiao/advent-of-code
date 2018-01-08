const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const commands = string.split('\n');

const registers = {};
let sound = null;
let pc = 0;

function getVal(input) {
  if (input.match(/\d+/)) {
    return parseInt(input);
  } else {
    return registers[input] || 0;
  }
}

let mul = 0;
while(true) {
  if (pc < 0 || pc >= commands.length) {
    console.log('out of bounds');
    break;
  }
  const command = commands[pc].split(' ');
  const c = command[0];
  const x = command[1];
  const y = command[2];

  if (c === 'set') {
    registers[x] = getVal(y);
  } else if (c === 'sub') {
    registers[x] = getVal(x) - getVal(y);
  } else if (c === 'mul') {
    registers[x] = getVal(x) * getVal(y);
    mul++;
  } else if (c === 'jnz') {
    if (getVal(x) !== 0) {
      pc += getVal(y);
      continue;
    }
  }
  console.log(registers);
  pc++;
}

console.log(mul);