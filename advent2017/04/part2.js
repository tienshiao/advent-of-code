const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8');
const lines = string.split('\n');
//const lines = [ 'aa bb cc dd ee aaa' ];

function isAnagram(a, b) {
  return a.split('').sort().join() == b.split('').sort().join();
}

function isValid(input) {
  const parts = input.split(/\s+/);
  for (let i = 0; i < parts.length; i++) {
    const matches = _.filter(parts, p => {
      return isAnagram(p, parts[i]);
    });
    if (matches.length > 1) {
      return false;
    }
  }
  return true;
}

let total = 0;
for (let i = 0; i < lines.length; i++) {
  if (isValid(lines[i])) {
    total++;
  }
}

console.log(total);