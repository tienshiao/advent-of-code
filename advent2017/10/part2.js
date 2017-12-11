const _ = require('lodash');

const lengthInput = '225,171,131,2,35,5,0,13,1,246,54,97,255,98,254,110';
//const lengthInput = '';
const listLength = 256;
let list = [];
const lengths = lengthInput.split('').map(n => n.charCodeAt(0)).concat([17, 31, 73, 47, 23]);

console.log(lengths);

for (let i = 0; i < listLength; i++) {
  list.push(i);
}

let pos = 0;
let skip = 0;

function splice(target, sub, pos) {
  for (let i = 0; i < sub.length; i++) {
    target[(pos + i) % target.length] = sub[i];
  }
}

for (let r = 0; r < 64; r++) {
  for (let i = 0; i < lengths.length; i++) {
    const length = lengths[i];

    let double = list.concat(list);
    const sublist = double.slice(pos, pos + length);
    const r_sublist = sublist.reverse();

    splice(list, r_sublist, pos);

    pos = (pos + length + skip) % list.length;
    skip++;

  }
}

const dense = [];

for (let i = 0; i < 16; i++) {
  dense[i] = list[i * 16];
  for (let j = 1; j < 16; j++) {
    dense[i] = dense[i] ^ list[i * 16 + j];
  }
}

function d2h(d) {
  var s = (+d).toString(16);
  if(s.length < 2) {
      s = '0' + s;
  }
  return s;
}

const output = dense.map(n => d2h(n)).join('');
console.log(output);



