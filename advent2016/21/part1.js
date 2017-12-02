const fs = require('fs');

//const input = 'abcdefgh';
//const input = 'abcde';
const input = 'fbgdceah';
//const input = 'dbfgaehc';
const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');
const revLines = lines.reverse();

function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

let working = input.split('');
for (let line of revLines) {
  let match = null;
  console.log(line);
  if ((match = line.match(/swap position (\d+) with position (\d+)/))) {
    // swap indexes X Y
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    const temp = working[x];
    working[x] = working[y];
    working[y] = temp;
  } else if ((match = line.match(/swap letter (\w) with letter (\w)/))) {
    const x = match[1];
    const y = match[2];
    working = working.map((l) => {
      if (l == x) {
        return y;
      } else if (l == y) {
        return x;
      } else {
        return l;
      }
    });
  } else if ((match = line.match(/rotate left (\d+) steps?/))) {
    const x = parseInt(match[1]);

    working = arrayRotate(working, -(x));
  } else if ((match = line.match(/rotate right (\d+) steps?/))) {
    const x = parseInt(match[1]);

    working = arrayRotate(working, (x));
  } else if ((match = line.match(/rotate based on position of letter (\w)/))) {
    const x = match[1];

    const index = working.indexOf(x);

    // working = arrayRotate(working, -1);
    // working = arrayRotate(working, -(index));
    // if (index >= 4) {
    //   working = arrayRotate(working, -1);
    // }

              // 0  1  2   3   4  5  6  7
    const map = [1, 1, -2, 2, -1, 3, 0, 4];
    working = arrayRotate(working, map[index]);

  } else if ((match = line.match(/reverse positions (\d+) through (\d+)/))) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);

    const removed = working.splice(x, y-x+1);
    working.splice(x, 0, ...removed.reverse());
  } else if ((match = line.match(/move position (\d+) to position (\d+)/))) {
    const y = parseInt(match[1]);
    const x = parseInt(match[2]);

    const removed = working.splice(x, 1);
    working.splice(y, 0, removed[0]);
  } else {
    console.log('unmatched', line);
  }
  console.log(working);
}

console.log('done', working.join(''));