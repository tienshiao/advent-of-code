const fs = require('fs');
const _ = require('lodash');

//const file = fs.readFileSync('input2', 'utf8');
const input = fs.readFileSync('input.txt', 'utf8');

//const input = '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN';

console.log(expandSub(input));

function expandSub(input) {
  console.log(input);
  let length = 0;
  let i = 0;
  while(i < input.length) {
    const char = input[i];
    if (char == '(') {
      const end = input.indexOf(')', i+1);
      const text = input.slice(i+1, end);
      const matches = text.match(/(\d+)x(\d+)/);
      const x = parseInt(matches[1]);
      const y = parseInt(matches[2]);

      const sub = input.slice(end + 1, end + 1 + x);
      const sublen = expandSub(sub);

      i = end + x;
      length = length + sublen * y;
    } else {
      length++;
    }
    i++;
  }
  return length;
}