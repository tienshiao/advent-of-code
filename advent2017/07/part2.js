const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8');
let lines = string.split('\n');

function makeProgram(line) {
  console.log(line);
  const matches = line.match(/^(\w+) \((\d+)\)(.*)$/);
  const name = matches[1];
  const weight = parseInt(matches[2]);
  const rest = matches[3];
  let deps = [];
  const matches2 = rest.match(/ -> (.*)$/);
  if (matches2) {
    deps = matches2[1].split(', ');
  }
  return {
    name,
    weight,
    deps,
    children: []
  };
}

const nodes = lines.map(l => makeProgram(l));

// console.log(nodes);

function findParentOf(name, nodes) {
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.deps.indexOf(name) > -1) {
      return n;
    }
    if (n.children.length > 0) {
      const retval = findParentOf(name, n.children);
      if (retval) {
        return retval;
      }
    }
  }
}

function calcWeightOf(node) {
  return node.weight +
    node.children.reduce((prev, curr) => {
      return prev + calcWeightOf(curr);
    }, 0);
}

while (nodes.length > 1) {
  const n = nodes.shift();

  const p = findParentOf(n.name, nodes);
  if (p) {
    p.children.push(n);
  } else {
    // this is the root
    // push to the end of the array
    nodes.push(n);
  }
}

console.log(nodes[0]);

const root = nodes[0];

// display top level inbalance to display how much we're off by
root.children.forEach(n => {
  console.log(n.name, calcWeightOf(n));
});

// search inbalanced children until we find one with balanced children
let curr = root;
while (true) {
  const weights = curr.children.map(c => {
    return { node: c, totalWeight: calcWeightOf(c) };
  });
  // find weight that is different
  const weightCount = {};
  for (let i = 0; i < weights.length; i++) {
    weightCount[weights[i].totalWeight] = (weightCount[weights[i].totalWeight] || 0) + 1;
  }
  let offWeight = null;
  _.each(weightCount, (val, key) => {
    if (val == 1) {
      offWeight = parseInt(key);
    }
  });
  if (!offWeight) {
    console.log('=====>', curr);
    break;
  }
  const offIndex = _.findIndex(weights, { totalWeight: offWeight });
  curr = curr.children[offIndex];
}