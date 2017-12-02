const fs = require('fs');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');
const values = [];

for (let i = 0; i < lines.length; i += 3) {
  const values0 = lines[i].trim().split(/\s+/);
  const values1 = lines[i + 1].trim().split(/\s+/);
  const values2 = lines[i + 2].trim().split(/\s+/);

  values.push([values0[0], values1[0], values2[0]]);
  values.push([values0[1], values1[1], values2[1]]);
  values.push([values0[2], values1[2], values2[2]]);
}

let total = 0;
values.forEach((values) => {
  const iVals = values.map((value) => {
    return parseInt(value);
  });
  if (isTriangle(iVals)) {
    total++;
  }
});

console.log(total);

function isTriangle(i) {
  return (i[0] + i[1] > i[2]) &&
    (i[1] + i[2] > i[0]) &&
    (i[2] + i[0] > i[1]);
}