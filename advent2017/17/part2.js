const steps = 377;
const target = 50000000;

const buffer = [ 0 ];

let size = 1;
let pos = 0;
let pos1 = null;
for (let i = 0; i < target; i++) {
  pos = (pos + steps) % size;
  if (pos + 1 == 1) {
    pos1 = i + 1;
  }
  size ++;
  pos = pos + 1;
  if (i % 1000 === 0) {
    console.log(i);
  }
}

console.log(pos1);