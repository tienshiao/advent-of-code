const fs = require('fs');

const max = 4294967295;

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');
const sortedLines = lines.sort(compare);

function compare(a, b) {
  const aInt = parseInt(a);
  const bInt = parseInt(b);
  if (aInt < bInt) {
    return -1;
  }
  if (aInt > bInt) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

let blacklist = [];

// collapse blacklists, and first first segment
for (let line of sortedLines) {
  const parts = line.split('-');
  const start = parseInt(parts[0]);
  const end = parseInt(parts[1]);

  const last = blacklist[blacklist.length - 1];

  if (blacklist.length === 0) {
    blacklist.push({ start, end });
  } else if (start <= last.end && end > last.end) {
    // overlaps -- grow the last one instead
    last.end = end;
  } else if (start == last.end + 1 && end > start) {
    // attached to end
    last.end = end;
  } else if (start > last.end + 1 && end >  start) {
    // separate segment
    blacklist.push({ start, end });
  }
}

console.log(blacklist);
let blocked = 0;
for (let block of blacklist) {
  const thisBlock = block.end - block.start;
  console.log(block, thisBlock);
  blocked += thisBlock;
}

console.log('blocked', blocked);
console.log('not blocked', max - blocked);



116
234
117