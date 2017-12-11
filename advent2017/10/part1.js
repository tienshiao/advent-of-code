const _ = require('lodash');

const lengthInput = '225,171,131,2,35,5,0,13,1,246,54,97,255,98,254,110';
//const lengthInput = '3,4,1,5';
const listLength = 256;
let list = [];
const lengths = lengthInput.split(',').map(n => parseInt(n));

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

for (let i = 0; i < lengths.length; i++) {
  const length = lengths[i];

  let double = list.concat(list);
  const sublist = double.slice(pos, pos + length);
  const r_sublist = sublist.reverse();

  splice(list, r_sublist, pos);

  pos = (pos + length + skip) % list.length;
  skip++;

  console.log(list, pos, skip);
}


console.log(list[0] * list[1]);


