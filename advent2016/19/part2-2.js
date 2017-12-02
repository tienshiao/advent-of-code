const total = 3005290;
//const total = 5;
let elvesList = { elf: 1, presents: 1, next: null };

let previous = elvesList;
for (let i = 1; i < total; i++) {
  previous.next = { elf: i + 1, presents: 1, next: null };
  previous = previous.next;
}
previous.next = elvesList;

let i = 0;
let current = elvesList;

const acrossElf = 1 + Math.floor(total / 2);
let across = elvesList;
let acrossSub1;
while (across.elf != acrossElf) {
  acrossSub1 = across;
  across = across.next;
}

let length = total;
while(elvesList.next != elvesList) {
  const one = current;
  //console.log(one.elf, across.elf, acrossSub1.elf);
  //console.log(one.elf);
  if (one.elf == across.elf) {
    console.log(one);
    break;
  }

//console.log(one.elf, one.presents, across.elf, across.presents);
  one.presents += across.presents;
//console.log(one.elf, one.presents, across.elf, across.presents);

  // unlink current across
  //console.log('unlink', acrossSub1.elf, across.next.elf);
  acrossSub1.next = across.next;
  //console.log('unlink', acrossSub1.elf, acrossSub1.next.elf);

  // advance current pointer
  current = one.next;

  if (length % 2 === 0) {
    // skip 1
    across = across.next;
    //console.log('skip 1', acrossSub1.elf, across.elf);
  } else {
    // skip 2
    acrossSub1 = across.next;
    across = across.next.next;
    //console.log('skip 2', acrossSub1.elf, across.elf);
  }
  length--;
  console.log(length);
}
