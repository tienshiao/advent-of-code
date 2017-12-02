const total = 3005290;
let elvesList = { elf: 1, presents: 1, next: null };

let previous = elvesList;
for (let i = 1; i < total; i++) {
  previous.next = { elf: i + 1, presents: 1, next: null };
  previous = previous.next;
}
previous.next = elvesList;

let i = 0;
let current = elvesList;

while(elvesList.next != elvesList) {
  const one = current;
  console.log(one.elf, one.presents);
  const two = current.next;
  one.presents += two.presents;

  one.next = two.next;
  current = two.next;
}

console.log(elvesList.elf, elvesList.presents);