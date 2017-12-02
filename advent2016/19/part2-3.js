const total = 3005290;
//const total = 5;
let elves = [];

for (let i = 0; i < total; i++) {
  elves[i] = 1;
}

function next(current) {
  let i = current + 1;
  while (i < elves.length) {
    if (elves[i]) {
      return i;
    }
    i++;
  }
  i = 0;
  while (i < current) {
    if (elves[i]) {
      return i;
    }
    i++;
  }
  return null;
}

function skip(current, count) {
  // console.log('skip', current, count);
  let i = current + 1;
  while (i < elves.length) {
    if (elves[i]) {
      count--;
      if (!count) {
        break;
      }
    }
    i++;
  }
  if (!count) {
    return i;
  }
  i = 0;
  while (i < current) {
    if (elves[i]) {
      count--;
      if (!count) {
        break;
      }
    }
    i++;
  }
  return i;
}

let length = total;
let i = 0;
let counter = 0;
while(true) {
  const one = i;
  let distance = Math.floor(length / 2);
  const across = skip(i, distance);
  // console.log(one, across);
  elves[one] += elves[across];
  elves[across] = 0;
  // console.log(elves);
  length--;
  if (length == 1) {
    break;
  }
  i = next(i);
  counter++;
  if (counter % 1000 === 0) {
    console.log(one, across);
  }
}

for (let i = 0; i < total; i++) {
  if (elves[i]) {
    console.log(i + 1);
  }
}