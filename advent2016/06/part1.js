const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

let stats = [];

lines.forEach(line => {
  const letters = line.split('');
  letters.forEach((letter, index) => {
    let stat = stats[index];
    if (stat) {
      if (stat[letter]) {
        stat[letter] += 1;
      } else {
        stat[letter] = 1;
      }
    } else {
      stat = {};
      stat[letter] = 1;
    }
    stats[index] = stat;
  });
});

stats.forEach(stat => {
  let sortedPairs = _.toPairs(stat).sort((a, b) => {
    if (a[1] < b[1]) {
      return -1;
    } else if (a[1] > b[1]) {
      return 1;
    }
    return 0;
  });
  //console.log(sortedPairs);
  console.log(sortedPairs[0]);
});

