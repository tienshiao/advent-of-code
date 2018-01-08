const genASeed = 703;
const genBSeed = 516;
const genAFactor = 16807;
const genBFactor = 48271;
const target = 40000000;

let a = genASeed;
let b = genBSeed;

function generate(input, factor) {
  return (input * factor) % 2147483647;
}

function compare16(a, b) {
  return (a & 0xffff) === (b & 0xffff);
}

let matches = 0;
for (let i = 0; i < target; i++) {
  a = generate(a, genAFactor);
  b = generate(b, genBFactor);

  if (compare16(a, b)) {
    console.log('matched', i, matches);
    matches++;
  }

  if (i % 1000 === 0) {
    console.log(i, matches);
  }
}

console.log(matches);


