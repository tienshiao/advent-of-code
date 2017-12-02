const input = '^^.^..^.....^..^..^^...^^.^....^^^.^.^^....^.^^^...^^^^.^^^^.^..^^^^.^^.^.^.^.^.^^...^^..^^^..^.^^^^';
const maxRows = 400000;
let safe = 0;

function getCharFor(index, previous) {
  const left = previous[index - 1] || '.';
  const center = previous[index];
  const right = previous[index + 1] || '.';

  if (left == '^' && center == '^' && right == '.') {
    return '^';
  } else if (left == '.' && center == '^' && right == '^') {
    return '^';
  } else if (left == '^' && center == '.' && right == '.') {
    return '^';
  } else if (left == '.' && center == '.' && right == '^') {
    return '^';
  }
  return '.';
}

function addSafe(row) {
  row.split('').forEach((x) => {
    if (x == '.') {
      safe += 1;
    }
  });
}

let rows = [];

rows.push(input);
addSafe(input);
for (let i = 1; i < maxRows; i++) {
  const previous = rows[i - 1];
  let thisRow = '';
  for (let j = 0; j < previous.length; j++) {
    thisRow += getCharFor(j, previous);
  }
  rows.push(thisRow);
  addSafe(thisRow);
}

for (let row of rows) {
  console.log(row);
}
console.log(safe);