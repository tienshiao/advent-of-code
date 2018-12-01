async function part1(input) {
  return input.lines.reduce((sum, curr) => sum + Number(curr), 0);
}

async function part2(input) {
  const seen = [true];
  let sum = 0;
  let i = 0;

  while(true) {
    sum = sum + Number(input.lines[i]);
    if (seen[sum]) {
      return sum;
    }
    seen[sum] = true;
    i = (i + 1) % input.lines.length;
  }
}

module.exports = [
  part1,
  part2
];