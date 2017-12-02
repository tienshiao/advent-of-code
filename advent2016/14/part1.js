const crypto = require('crypto');

function md5(input) {
  return crypto.createHash('md5').update(input).digest("hex");
}

let cache = {};

function stretchedmd5(input) {
  if (cache[input]) {
    return cache[input];
  }
  let hash = input;
  for (i = 0; i < 2017; i++) {
    hash = md5(hash);
  }
  cache[input] = hash;
  return hash;
}

let triples = [];
let fives = [];

const input = 'ihaygndm';
//const input = 'abc';
let index = 0;
let count = 0;

// make tables
for (let i = 0; i < 16; i++) {
  let temp = '';
  for (let j = 0; j < 3; j++) {
    temp += i.toString(16);
  }
  triples.push(temp);
  for (let j = 0; j < 2; j++) {
    temp += i.toString(16);
  }
  fives.push(temp);
}

console.log(triples);
console.log(fives);

function findTriplet(input) {
  let retval = null;
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i) == input.charAt(i + 1) &&
        input.charAt(i) == input.charAt(i + 2)) {
      retval = parseInt(input.charAt(i), 16);
    }
  }
  return retval;
}

while (count < 66) {
  const candidate = input + index;
  const hash = stretchedmd5(candidate);
  let thatCharIndex = null;
  // for (let i = 0; i < triples.length; i++) {
  //   if (hash.indexOf(triples[i]) > -1) {
  //     thatCharIndex = i;
  //     break;
  //   }
  // }

  thatCharIndex = findTriplet(hash);

  if (thatCharIndex !== null) {
    let found = false;
    for (let i = 0; i < 1000; i++) {
      let test = input + (index + 1 + i);
      const testhash = stretchedmd5(test);
      if (testhash.indexOf(fives[thatCharIndex]) > -1) {
        found = true;
      }
    }

    if (found) {
      console.log(count, index, hash);
      count++;
    }
  }

  index++;
}