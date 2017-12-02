const total = 3005290;
//const total = 5;
let elves = [];

for (let i = 0; i < total; i++) {
  elves.push({ elf: i + 1, presents: 1});
}

let i = 0;
while(true) {
  const one = elves[i];
  const across = (i + Math.floor(elves.length / 2)) % elves.length;
  const two = elves[across];
  console.log(i, one, two);
  one.presents += two.presents;
  elves.splice(across, 1);
  if (elves.length == 1) {
    break;
  }
  i++;
  if (i > elves.length) {
    i = 0;
  }
}

console.log(elves);