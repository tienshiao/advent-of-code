type State = {
  path: string[];
  position: string;
  visited: Set<string>;
};

type State2 = {
  path: string[];
  position: string;
  visited: Set<string>;
  doubleVisted: string | null;
};


function makeGraph(connections: string[][]): Record<string, string[]> {
  const graph: Record<string, string[]> = {};

  connections.forEach(([from, to]) => {
    const node = graph[from] || [];
    node.push(to);
    graph[from] = node;

    const node2 = graph[to] || [];
    node2.push(from);
    graph[to] = node2;
  });

  return graph;
}

function part1(graph: Record<string, string[]>): number {
  let count = 0;

  // Breadth first search
  const queue: State[] = [{
    position: 'start',
    path: [ 'start' ],
    visited: new Set()
  }];

  while (queue.length) {
    const state = queue.shift()!;
    if (isLowercase(state.position) && state.visited.has(state.position)) {
      continue;
    }

    for (const child of graph[state.position] || []) {
      if (child === 'end') {
        console.log(state.path.concat(child));
        count++;
      } else {
        queue.push({
          position: child,
          path: state.path.concat(child),
          visited: new Set([...state.visited, state.position]),
        });
      }
    }
  }

  return count;
}

function part2(graph: Record<string, string[]>): number {
  let count = 0;

  // Breadth first search
  const queue: State2[] = [{
    position: 'start',
    path: [ 'start' ],
    visited: new Set(),
    doubleVisted: null,
  }];

  while (queue.length) {
    const state = queue.shift()!;
    // console.log(state);
    for (const child of graph[state.position] || []) {
      if (child === 'end') {
        console.log(state.path.concat(child));
        count++;
      } else if (child === 'start') {
        continue;
      } else {
        if (isLowercase(child) && state.visited.has(child)) {
          if (state.doubleVisted === null) {
            queue.push({
              position: child,
              path: state.path.concat(child),
              visited: new Set([...state.visited, state.position]),
              doubleVisted: child,
            });
          }
          continue;
        }

        queue.push({
          position: child,
          path: state.path.concat(child),
          visited: new Set([...state.visited, state.position]),
          doubleVisted: state.doubleVisted,
        });
      }
    }
  }

  return count;
}

function isLowercase(input: string): boolean {
  return input.toLowerCase() === input;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const connections = inputString.trim().split('\n').map((line) => {
    return line.split('-');
  });
  // console.log(connections);

  const graph = makeGraph(connections);
  // console.log(graph);

  if (part === '1') {
    console.log(part1(graph));
  } else if (part === '2') {
    console.log(part2(graph));
  }
}

await main();
