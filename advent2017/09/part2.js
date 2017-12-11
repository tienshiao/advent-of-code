const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
//const string = '{{<!!>},{<!!>},{<!!>},{<!!>}}';

const parts = string.split('');

let count = 0;
let gCount = 0;
let score = 0;
let stack = [];
let garbage = false;
while (parts.length > 0) {
  const c = parts.shift();

  if (garbage) {
    if (c =='!') {
      parts.shift();
    } else if (c == '>') {
      garbage = false;
    } else {
      gCount++;
    }
  } else {
    if (c == '{') {
      stack.push(c);
    } else if (c == '}') {
      score += stack.length;
      stack.pop();
      count++;
    } else if (c == '<') {
      garbage = true;
    }
  }
}

console.log(count);
console.log(score);
console.log(gCount);