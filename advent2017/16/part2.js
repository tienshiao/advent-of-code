const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
let commands = string.split(',');

let programs = 'abcdefghijklmnop'.split('');
  // transform: dgnaimjkebfhlocp
  //            0123456789012345

const transform = [3, 9, 14, 0, 8, 10, 1, 11, 4, 6, 7, 12, 5, 2, 13, 15];

const target = 1000000000;

let pcommands = commands.filter(c => {
  return c.match(/p(\w)\/(\w)/);
});

let tcommands = commands.filter(c => {
  return !c.match(/p(\w)\/(\w)/);
});

// optimize commands
console.log('before # of commands', pcommands.length);

// search for unnecessary partner
for (let i = 0; i < pcommands.length; i++) {
  const c = pcommands[i];
  if ((match = c.match(/p(\w)\/(\w)/))) {
    const m1 = [match[1], match[2]].sort();
    for (let j = i + 1; j < pcommands.length; j++) {
      const c2 = pcommands[j];
      if ((match2 = c2.match(/p(\w)\/(\w)/))) {
        const m2 = [match2[1], match2[2]].sort();
        if (m1[0] == m2[0] && m1[1] == m2[1]) {
          console.log('found reverse', c, c2);
          pcommands[i] = 'noop';
          pcommands[j] = 'noop';
          break;
        } else if (m1[1] == m2[0] ||
                   m1[1] == m2[1] ||
                   m1[0] == m2[0] ||
                   m1[0] == m2[1]) {
          break;
          console.log('found chain', c, c2, 'replacing c with', `p${m1[0]}/${m2[1]}`);
          commands[i] = `p${m1[0]}/${m2[1]}`;
          commands[j] = 'noop';
          m1[1] = m2[1];
        }
      }
    }
  }
}

pcommands = pcommands.filter(p => {
  return p != 'noop';
});

console.log('after # of commands', pcommands.length);

for (let j = 0; j < target; j++) {
  // apply transform
  const newPrograms = [];
  for (let i = 0; i < programs.length; i++) {
    newPrograms[transform[i]] = programs[i];
  }
  programs = newPrograms;

  //console.log('transform', programs.join(''));

  for (let c of pcommands) {
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
      console.log('Unmatched', c);
      break;
    }
  }

  if ( j% 1000 === 0) {
    console.log(j, programs.join(''));
  }
}

console.log(programs.join(''));
