const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const commands = string.split(',');

let programs = 'abcdefghijklmnop'.split('');

const target = 1000000000;

for (let j = 0; j < target; j++) {
  for (let c of commands) {
    let match;
    if ((match = c.match(/s(\d+)/))) {
      // spin
      const count = parseInt(match[1]);
      //console.log(c, '= spin', count);
      for (let i = 0; i < count; i++) {
        const x = programs.pop();
        programs.unshift(x);
      }
    } else if ((match = c.match(/x(\d+)\/(\d+)/))) {
      // exchange
      const aIndex = parseInt(match[1]);
      const a = programs[aIndex];
      const bIndex = parseInt(match[2]);
      const b = programs[bIndex];

      //console.log(c, '= exchange', aIndex, bIndex);

      programs[aIndex] = b;
      programs[bIndex] = a;
    } else if ((match = c.match(/p(\w)\/(\w)/))) {
      // partner
      const a = match[1];
      const b = match[2];

      //console.log(c, '= partner', a, b);

      for (let i = 0; i < programs.length; i++) {
        if (programs[i] === a) {
          programs[i] = b;
        } else if (programs[i] === b) {
          programs[i] = a;
        }
      }
    } else {
      //console.log('Unmatched', c);
      break;
    }
    //console.log(programs.join(''));
  }
  if (j % 1000 === 0) {
    console.log(j, programs.join(''));
  }
}

console.log(programs.join(''));
