const fs = require('fs');
const _ = require('lodash');
const ndarray = require('ndarray');

const string = fs.readFileSync('input1', 'utf8').trim();
const bookStrings = string.split('\n');

const startString = '.#./..#/###';
const startGrid = convertStringToGrid(startString);
const iterations = 18;

// convertGridToString
function convertGridToString(grid) {
  let retval = [];
  for (let y = 0; y < Math.sqrt(grid.size); y++) {
    for (let x = 0; x < Math.sqrt(grid.size); x++) {
      retval.push(grid.get(y, x));
    }
    retval.push('/');
  }
  retval.pop();
  return retval.join('');
}

// convertStringToGrid
function convertStringToGrid(string) {
  const strings = string.split('/').map(s => s.split(''));
  const size = strings.length;

  const grid = ndarray(new Array(size * size), [size, size]);
  for (let y = 0; y < size; y++) {
    s = strings[y];
    for (let x = 0; x < size; x++) {
      grid.set(y, x, s[x]);
    }
  }

  return grid;
}

// putStringIntoGrid
function putStringIntoGrid(string, grid) {
  const strings = string.split('/').map(s => s.split(''));
  const size = strings.length;

  for (let y = 0; y < size; y++) {
    s = strings[y];
    for (let x = 0; x < size; x++) {
      grid.set(y, x, s[x]);
    }
  }
}

function printGrid(grid) {
  for (let i = 0; i < grid.shape[0]; i++) {
    const arr = [];
    for (let j = 0; j < grid.shape[1]; j++) {
      arr.push(grid.get(i, j));
    }
    console.log(arr.join(''));
  }
}

// makeGridVariants
function makeGridVariants(gridString) {
  // 3 rotations, and 2 flips
  const twoMappings = [
    [ 3, 4, 2, 0, 1 ],  // v flip
    [ 1, 0, 2, 4, 3 ],  // h flip
    [ 3, 0, 2, 4, 1 ]  // rotate 90
  ];
  const threeMappings = [
    [ 8, 9, 10, 3, 4, 5, 6, 7, 0, 1, 2 ], // v flip
    [ 2, 1, 0, 3, 6, 5, 4, 7, 10, 9, 8 ], // h flip
    [ 8, 4, 0, 3, 9, 5, 1, 7, 10, 6, 2 ], // rotate 90
  ];

  const input = gridString.split('');
  const toRotate = [ input ];
  let mappings = null;
  if (input.length == 5) {
    mappings = twoMappings;
  } else {
    mappings = threeMappings;
  }

  const retvals = [];
  for (let i = 0; i < 2; i++) {
    const m = mappings[i];
    let v = '';
    for (let j = 0; j < m.length; j++) {
      v += input[m[j]];
    }
    retvals.push(v);
    toRotate.push(v.split(''));
  }

  // do rotation 3 times
  for (let s of toRotate) {
    const m = mappings[2];
    let prev = s;
    for (let i = 0; i < 3; i++) {
      let v = '';
      for (let j = 0; j < m.length; j++) {
        v += prev[m[j]];
      }
      retvals.push(v);
      prev = v.split('');
    }
  }

  return retvals;
}

// build enhancement lookup
const rules = {};
bookStrings.forEach(s => {
  const parts = s.split(' => ');
  const key = parts[0];
  const val = parts[1];
  rules[key] = val;

  const variants = makeGridVariants(key);
  variants.forEach(v => {
    rules[v] = val;
  });
});

function enhance(grid) {
  const oldSize = Math.sqrt(grid.size);
  let subSize;
  let newSubsSize;
  let newSize;
  let newGrid;
  if (oldSize % 2 === 0) {
    newSize = oldSize * 3 / 2;
    subSize = 2;
    newSubSize = 3;
  } else {
    newSize = oldSize * 4 / 3;
    subSize = 3;
    newSubSize = 4;
  }
  console.log(oldSize, newSize);
  newGrid = ndarray(new Array(newSize * newSize), [ newSize, newSize ]);

  for (let y = 0; y < oldSize / subSize; y++) {
    for (let x = 0; x < oldSize / subSize; x++) {
      // for each subblock
      //   make into gridstring
      //   mind rule
      //   generate new grid
      //   place into block

      const oldUpperLeftY = y * subSize;
      const newUpperLeftY = y * newSubSize;
      const oldUpperLeftX = x * subSize;
      const newUpperLeftX = x * newSubSize;

      const oldLowerRightY = (y + 1) * subSize;
      const newLowerRightY = (y + 1) * newSubSize;
      const oldLowerRightX = (x + 1) * subSize;
      const newLowerRightX = (x + 1) * newSubSize;

      const block = grid.hi(oldLowerRightY, oldLowerRightX).lo(oldUpperLeftY, oldUpperLeftX);
      const blockString = convertGridToString(block);
      const newString = rules[blockString];
      const newBlock = newGrid.hi(newLowerRightY, newLowerRightX).lo(newUpperLeftY, newUpperLeftX);
      if (!newString) {
        console.log(blockString);
        console.log(block);
        console.log('x', x, 'y', y);
      }
      putStringIntoGrid(newString, newBlock);
    }
  }

  return newGrid;
}

let grid = startGrid;
printGrid(grid);

for(let i = 0; i < iterations; i++) {
  grid = enhance(grid);

  console.log(i);
  printGrid(grid);
}

let pixels = 0;
for (let i = 0; i < grid.shape[0]; i++) {
  for (let j = 0; j < grid.shape[1]; j++) {
    if (grid.get(i, j) == '#') {
      pixels++;
    }
  }
}

console.log('pixels', pixels);