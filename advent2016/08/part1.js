const fs = require('fs');
const _ = require('lodash');

//const file = fs.readFileSync('input2', 'utf8');
const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

const width = 50;
const height = 6;
let framebuffer = new Array(width * height);


lines.forEach(line => {
  let matches;
  if ((matches = line.match(/rect (\d+)x(\d+)/))) {
    turnOn(matches[1], matches[2]);
  } else if ((matches = line.match(/rotate row y=(\d+) by (\d+)/))) {
    rotateRow(matches[1], matches[2]);
  } else if ((matches = line.match(/rotate column x=(\d+) by (\d+)/))) {
    rotateColumn(matches[1], matches[2]);
  } else {
    console.log('Unmatched', line);
  }
//  console.log(line);
//  print();
});

let total = 0;
framebuffer.forEach((pixel) => {
  if (pixel) {
    total++;
  }
});
print();
console.log(total);

/**
 * Returns state of pixel at column X, row y
 * @param {number} x - column
 * @param {number} y - row
 * @returns {boolean}
 */
function getPixel(x, y) {
  const offset = y * width + x;
  return !!framebuffer[offset];
}

/**
 * Sets state of pixel at column X, row y
 * @param {number} x - column
 * @param {number} y - row
 * @param {boolean} state - row
 */
function setPixel(x, y, state) {
  const offset = y * width + x;
  framebuffer[offset] = state;
}

/**
 * Turns on a block in the upper left of width and height
 * @param {number} width
 * @param {number} height
 */
function turnOn(width, height) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      setPixel(x, y, true);
    }
  }
}

/**
 * Rotates column (down) by count amount
 * @param {number} column - column to rotate, 0 is leftmost
 * @param {number} count - amount to rotate by
 */
function rotateColumn(column, count) {
  // get array of current column, then rotate, then set
  let current = [];
  for (let y = 0; y < height; y++) {
    current.push(getPixel(parseInt(column), y));
  }

  current = arrayRotate(current, -count);

  for (let y = 0; y < height; y++) {
    setPixel(parseInt(column), y, current[y]);
  }
}

/**
 * Rotates row (right) by count amount
 * @param {number} row - column to rotate, 0 is leftmost
 * @param {number} count - amount to rotate by
 */
function rotateRow(row, count) {
  // get array of current row, then rotate, then set
  let current = [];
  for (let x = 0; x < width; x++) {
    current.push(getPixel(x, parseInt(row)));
  }

  current = arrayRotate(current, -count);

  for (let x = 0; x < width; x++) {
    setPixel(x, parseInt(row), current[x]);
  }
}


function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}

function print() {
  for (let y = 0; y < height; y++) {
    let line = '';
    for (let x = 0; x < width; x++) {
      line += getPixel(x, y) ? '#' : ' ';
    }
    console.log(line);
  }
}