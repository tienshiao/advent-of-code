const discs = [
  { positions: 17, initial: 15 },
  { positions: 3, initial: 2 },
  { positions: 19, initial: 4 },
  { positions: 13, initial: 2 },
  { positions: 7, initial: 2 },
  { positions: 5, initial: 0 },
  { positions: 11, initial: 0 }
];

let i = 0;

while (true) {
  const result = discs.map((disc, index) => {
    return (disc.initial + index + 1 + i) % disc.positions;
  }).reduce((a, b) => {
    return a + b;
  }, 0);
  if (result === 0) {
    console.log('time', i);
    return;
  }
  i++;
}