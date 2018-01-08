const _ = require('lodash');

const INITIAL_STATE = 'a';
const TARGET = 12919244;

let state = INITIAL_STATE;

const tape = {};
let cursor = 0;
let steps = 0;

function step() {
  const currVal = tape[cursor] || 0;
  if (state == 'a') {
    if (currVal === 0) {
      tape[cursor] = 1;
      cursor++;
      state = 'b';
    } else {
      tape[cursor] = 0;
      cursor--;
      state = 'c';
    }
  } else if (state == 'b') {
    if (currVal === 0) {
      tape[cursor] = 1;
      cursor--;
      state = 'a';
    } else {
      tape[cursor] = 1;
      cursor++;
      state = 'd';
    }
  } else if (state == 'c') {
    if (currVal === 0) {
      tape[cursor] = 1;
      cursor++;
      state = 'a';
    } else {
      tape[cursor] = 0;
      cursor--;
      state = 'e';
    }
  } else if (state == 'd') {
    if (currVal === 0) {
      tape[cursor] = 1;
      cursor++;
      state = 'a';
    } else {
      tape[cursor] = 0;
      cursor++;
      state = 'b';
    }
  } else if (state == 'e') {
    if (currVal === 0) {
      tape[cursor] = 1;
      cursor--;
      state = 'f';
    } else {
      tape[cursor] = 1;
      cursor--;
      state = 'c';
    }
  } else if (state == 'f') {
    if (currVal === 0) {
      tape[cursor] = 1;
      cursor++;
      state = 'd';
    } else {
      tape[cursor] = 1;
      cursor++;
      state = 'a';
    }
  }
}

for (let i = 0 ; i < TARGET; i++) {
  step();
  if (i % 1000 === 0) {
    console.log(i);
  }
  // console.log(tape);
}

let checksum = 0;
_.each(tape, x => {
  checksum += x;
});
console.log(checksum);