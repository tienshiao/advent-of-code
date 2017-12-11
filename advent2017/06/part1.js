const fs = require('fs');

const string = fs.readFileSync('input1', 'utf8');
let banks = string.split(/\s+/);
banks = banks.map(b => parseInt(b));

console.log(banks);

const history = {};

function findHighest(banks) {
  let highBank = -1;
  let max = -1;
  for (let i = 0; i < banks.length; i++) {
    if (banks[i] > max) {
      max = banks[i];
      highBank = i;
    }
  }

  return highBank;
}

let iterations = 0;
while (true) {
  // find highest
  const highBank = findHighest(banks);
  const blocks = banks[highBank];

  banks[highBank] = 0;
  // redistribute
  for (let i = 0; i < blocks; i++) {
    banks[(highBank + 1 + i) % banks.length]++;
  }
  console.log(banks);

  iterations++;
  if (history[JSON.stringify(banks)] === true) {
    break;
  }
  history[JSON.stringify(banks)] = true;
}

console.log(iterations);