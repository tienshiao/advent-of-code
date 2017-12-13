const fs = require('fs');
const _ = require('lodash');

const string = fs.readFileSync('input1', 'utf8').trim();
const lines = string.split('\n');

// build graph
const programs = [];
for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const parts = l.split(' <-> ');
  const p = parseInt(parts[0]);

  if (p !== i) {
    console.log('expected mismatch', p, i);
    break;
  }
  const connections = parts[1].split(', ');
  programs[i] = connections;
}

const visited = [];
let groups = 0;

for (let i = 0; i < programs.length; i++) {
  if (visited[i]) {
    continue;
  }
  groups++;

  const nodes = [i];
  while (nodes.length) {
    const n = nodes.shift();
    if (visited[n]) {
      continue;
    }

    visited[n] = true;

    const connections = programs[n];
    connections.forEach(c => {
      nodes.push(c);
    });
  }
}

console.log(groups);