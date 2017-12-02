const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

let stats = [];

let total = 0;

lines.forEach(line => {
  const sequences = getSequences(line);
  if (matchingSequences(sequences)) {
    total++;
  }
});

console.log(total);

function getSequences(line) {
  let index = 0;
  let status = false;
  let inBrackets = false;

  let aba = [];
  let bab = [];

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

    const test = line.substr(index, 3);
    if (test.length < 3) {
      index++;
      continue;
    }

    if (testABA(test)) {
      if (inBrackets) {
        bab.push(test);
      } else {
        aba.push(test);
      }
    }
    index++;
  }

  return { aba, bab };
}

function testABA(input) {
  return input.charAt(0) == input.charAt(2) &&
    input.charAt(0) != input.charAt(1);
}

function matchingSequences(sequences) {
  const aba = sequences.aba;
  const bab = sequences.bab;

  for (const a of aba) {
    for (const b of bab) {
      if (a.charAt(0) == b.charAt(1) && a.charAt(1) == b.charAt(0)) {
        return true;
      }
    }
  }

  return false;
}