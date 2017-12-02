const fs = require('fs');
const _ = require('lodash');

const file = fs.readFileSync('input', 'utf8');
const lines = file.split('\n');

let botsAndOutputs = {};

class Bot {
  constructor(name) {
    this.name = name;
    this.values = [];
    this.highOut = '';
    this.lowOut = '';
  }

  addValue(value) {
    this.values.push(parseInt(value));
    if (this.values.length == 2) {
      // activated when it has two values
      console.log('activated', this);
      if ((this.values[0] == 61 && this.values[1] == 17) ||
          (this.values[0] == 17 && this.values[1] == 61)) {
        console.log('WINNER', this.name, this.values);
      }
      if (this.values[0] < this.values[1]) {
        botsAndOutputs[this.lowOut].addValue(this.values[0]);
        botsAndOutputs[this.highOut].addValue(this.values[1]);
      } else {
        botsAndOutputs[this.highOut].addValue(this.values[0]);
        botsAndOutputs[this.lowOut].addValue(this.values[1]);
      }
      this.values = [];
    }
  }
}

// wire up first
lines.filter((line) => {
  return line.match(/(.*) gives low to (.*) and high to (.*)/);
}).forEach((line) => {
  process(line);
});

// load data
lines.filter((line) => {
  return line.match(/value (\d+) goes to (.*)/);
}).forEach((line) => {
  process(line);
});

console.log(botsAndOutputs['output 0'].values[0] * botsAndOutputs['output 1'].values[0] * botsAndOutputs['output 2'].values[0]);

function process(line) {
  let match;
  if ((match = line.match(/value (\d+) goes to (.*)/))) {
    const val = match[1];
    const bot = match[2];

    if (!botsAndOutputs[bot]) {
      botsAndOutputs[bot] = new Bot(bot);
    }
    botsAndOutputs[bot].addValue(val);
  } else if ((match = line.match(/(.*) gives low to (.*) and high to (.*)/))) {
    const bot = match[1];
    const lowOut = match[2];
    const highOut = match[3];

    if (!botsAndOutputs[bot]) {
      botsAndOutputs[bot] = new Bot(bot);
    }

    botsAndOutputs[bot].lowOut = lowOut;
    if (!botsAndOutputs[lowOut]) {
      botsAndOutputs[lowOut] = new Bot(lowOut);
    }
    botsAndOutputs[bot].highOut = highOut;
    if (!botsAndOutputs[highOut]) {
      botsAndOutputs[highOut] = new Bot(highOut);
    }

  } else {
    console.log('unmatched', line);
  }
}