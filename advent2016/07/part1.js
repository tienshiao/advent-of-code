const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

let stats = [];

let total = 0;

lines.forEach(line => {
  if (testLine(line)) {
    total++;
  }
});

console.log(total);

function testLine(line) {
  let index = 0;
  let status = false;
  let inBrackets = false;

  while (index < line.length) {
    if (line.charAt(index) == '[') {
      inBrackets = true;
      index++;
      continue;
    } else if (line.charAt(index) == ']') {
      inBrackets = false;
      index++;
      continue;
    }

    const test = line.substr(index, 4);
    if (test.length < 4) {
      index++;
      continue;
    }

    const abba = testABBA(test);
    if (abba) {
      if (inBrackets) {
        // short circuit
        return false;
      } else {
        status = true;
      }
    }
    index++;
  }

  return status;
}

function testABBA(input) {
  return input.charAt(0) == input.charAt(3) &&
    input.charAt(1) == input.charAt(2) &&
    input.charAt(0) != input.charAt(1);
}

function testABA(input) {
  return input.charAt(0) == input.charAt(2) &&
    input.charAt(0) != input.charAt(1);
}