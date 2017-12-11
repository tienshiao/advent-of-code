const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8');
let lines = string.split('\n');


const registers = {};

function makeCommand(line) {
  const parts = line.split(' ');
  return {
    target: parts[0],
    operation: parts[1],
    arg: parseInt(parts[2]),
    reg: parts[4],
    condition: parts[5],
    val: parseInt(parts[6])
  };
}

function executeCommand(c) {
  if (c.operation == 'inc') {
    registers[c.target] = (registers[c.target] || 0) + c.arg;
  } else if (c.operation == 'dec') {
    registers[c.target] = (registers[c.target] || 0) - c.arg;
  } else {
    console.log('Operation unsupported', c);
  }
}

for (let i = 0; i < lines.length; i++) {
  const command = makeCommand(lines[i]);
  console.log(JSON.stringify(command));

  if (command.condition == '>') {
    if ((registers[command.reg] || 0) > command.val) {
      executeCommand(command);
    }
  } else if (command.condition == '>=') {
    if ((registers[command.reg] || 0) >= command.val) {
      executeCommand(command);
    }
  } else if (command.condition == '<') {
    if ((registers[command.reg] || 0) < command.val) {
      executeCommand(command);
    }
  } else if (command.condition == '<=') {
    if ((registers[command.reg] || 0) <= command.val) {
      executeCommand(command);
    }
  } else if (command.condition == '==') {
    if ((registers[command.reg] || 0) == command.val) {
      executeCommand(command);
    }
  } else if (command.condition == '!=') {
    if ((registers[command.reg] || 0) != command.val) {
      executeCommand(command);
    }
  } else {
    console.log('Unsupported', command);
    break;
  }
  console.log(JSON.stringify(registers));
}

console.log(registers);