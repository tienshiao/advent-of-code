const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const commands = string.split('\n');

const machines = [{
    buffer: [],
    registers: { p: 0 },
    pc: 0,
    p: 0
  }, {
    buffer: [],
    registers: { p: 1 },
    pc: 0,
    p: 1
  }];

function getVal(machine, input) {
  if (input.match(/\d+/)) {
    return parseInt(input);
  } else {
    return machine.registers[input] || 0;
  }
}

function send(machine, value) {
  if (machine.p === 0) {
    machines[1].buffer.push(value);
  } else if (machine.p === 1) {
    machines[0].buffer.push(value);
  }
}

let p1send = 0;

function step(machine) {
  if (machine.pc < 0 || machine.pc >= commands.length) {
    console.log('out of bounds');
    return 0;
  }
  const command = commands[machine.pc].split(' ');
  const c = command[0];
  const x = command[1];
  const y = command[2];
  console.log(command);

  if (c === 'snd') {
     send(machine, getVal(machine, x));
     if (machine.p === 1) {
       p1send++;
     }
  } else if (c === 'set') {
    machine.registers[x] = getVal(machine, y);
    console.log(getVal(machine, y));
  } else if (c === 'add') {
    machine.registers[x] = getVal(machine, x) + getVal(machine, y);
  } else if (c === 'mul') {
    machine.registers[x] = getVal(machine, x) * getVal(machine, y);
  } else if (c === 'mod') {
    machine.registers[x] = getVal(machine, x) % getVal(machine, y);
  } else if (c === 'rcv') {
    if (machine.buffer.length) {
      machine.registers[x] = machine.buffer.shift();
    } else {
      return 2;
    }
  } else if (c === 'jgz') {
    if (getVal(machine, x) > 0) {
      machine.pc += getVal(machine, y);
      console.log(machine.p, machine.pc, machine.registers);
      return 1;
    }
  }
  console.log(machine.p, machine.pc, machine.registers);
  machine.pc++;
  return 1;
}


let state1 = 1;
let state2 = 1;
while (state1 || state2) {
  if (state1 == 2 && machines[0].buffer.length === 0 &&
      state2 == 2 && machines[1].buffer.length === 0) {
    break;
  }
  state1 = 1;
  state2 = 1;
  while(state1 == 1) {
    state1 = step(machines[0]);
  }

  while (state2 == 1) {
    state2 = step(machines[1]);
  }
}

console.log(p1send);