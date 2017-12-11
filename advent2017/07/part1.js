const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8');
let lines = string.split('\n');

let root = null;

function makeProgram(line) {
  console.log(line);
  const matches = line.match(/^(\w+) \((\d+)\)(.*)$/);
  const name = matches[1];
  const weight = matches[2];
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

console.log(nodes);

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


while (nodes.length) {
  const n = nodes.shift();

  const p = findParentOf(n.name, nodes);
  if (p) {
    p.children.push(n);
  } else {
    // this is the root
    console.log(n.name);
    console.log(p);
    break;
  }

}
