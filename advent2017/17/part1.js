const steps = 377;
const target = 50000000;

const buffer = [ 0 ];

let size = 1;
let pos = 0;
for (let i = 0; i < target; i++) {
  pos = (pos + steps) % buffer.length;
  buffer.splice(pos + 1, 0, i + 1);

  pos = pos + 1;
  if (i % 1000 === 0) {
    console.log(i);
  }
}

console.log(buffer[pos+1]);

const i = buffer.findIndex(0);
console.log(buffer[i + 1]);