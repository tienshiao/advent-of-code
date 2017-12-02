const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');
const lines1 = [
  'aaaaa-bbb-z-y-x-123[abxyz]', 'a-b-c-d-e-f-g-h-987[abcde]', 'not-a-real-room-404[oarel]'
];
let total = 0;

lines.forEach((line) => {
  const parts = line.split('-');
  const last = parts.pop();
  const match = last.match(/(\d+)\[(.*)\]/);
  const sector = match[1];
  const checksum = match[2];

  if (calculateChecksum(parts) == checksum) {
    total += parseInt(sector);
    const input = parts.join(' ');
    const output = input.split('').map((letter) => {
      return rotate(letter, parseInt(sector));
    }).join('');
    console.log(output, sector);
  }
});

console.log(total);

function calculateChecksum(parts) {
  const letters = {};
  const input = parts.join('');
  const sparts = input.split('');
  sparts.forEach((letter) => {
    const temp = letters[letter];
    if (temp) {
      temp.count++;
    } else {
      letters[letter] = { letter: letter, count: 1 };
    }
  });

  const values = _.values(letters);
  values.sort((a, b) => {
    if (a.count < b.count) {
      return 1;
    } else if (a.count > b.count) {
      return -1;
    } else if (a.letter < b.letter) {
      return -1;
    } else if (a.letter > b.letter) {
      return 1;
    } else {
      return 0;
    }
  });

  let checksum = '';
  values.forEach((value) => {
    checksum += value.letter;
  });
  checksum = checksum.substr(0, 5);
  return checksum;
}

function rotate(letter, amount) {
  if (letter == ' ') {
    return letter;
  }
  const i = letter.charCodeAt(0) - 'a'.charCodeAt(0);
  const newValue = (i + amount) % 26;
  return String.fromCharCode(newValue + 'a'.charCodeAt(0));
}