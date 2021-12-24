class Grid {
  lines: number[][];

  constructor(inputString: string) {
    this.lines = inputString.trim().split('\n').map((line) => line.split('').map(Number));
  }

  get height() {
    return this.lines.length;
  }

  get width() {
    return this.lines[0].length;
  }

  get(x: number, y: number): number | null {
    if (x < 0 || x >= this.lines[0].length) {
      return null;
    }
    if (y < 0 || y >= this.lines.length) {
      return null;
    }
    return this.lines[y][x];
  }

  set(x: number, y: number, value: number) {
    if (x < 0 || x >= this.lines[0].length) {
      return;
    }
    if (y < 0 || y >= this.lines.length) {
      return;
    }
    this.lines[y][x] = value;
  }

  getAdjacent(x: number, y: number): { x: number, y: number, value: number }[] {
    const adjacent = [
      { x, y: y - 1, value: this.get(x, y - 1) },
      { x: x + 1, y, value: this.get(x + 1, y) },
      { x, y: y + 1, value: this.get(x, y + 1) },
      { x: x - 1, y, value: this.get(x - 1, y) },
    ].filter(n => n.value !== null);
    return adjacent as { x: number, y: number, value: number }[];
  }

  toString(): string {
    let lines = '';
    for (let y = 0; y < this.height; y++) {
      let line = '';
      for (let x = 0; x < this.width; x++) {
        line += this.lines[y][x];
      }
      lines += line + '\n';
    }

    return lines;
  }
}


function part1(grid: Grid): number {
  console.log(grid.width, grid.height);
  const goal = { x: grid.width - 1, y: grid.height - 1 };
  const queue = [{ x: 0, y: 0, cost: 0, visited: new Set<string>(), path: [] as string[] }];

  const bests: Record<string, number> = {};

  while(queue.length > 0) {
    const curr = queue.shift()!;
    const key = `${curr.x},${curr.y}`;

    if (curr.visited.has(key)) {
      continue;
    }
    console.log(`${curr.x},${curr.y}`, curr.path.length, curr.cost);

    const adjacents = grid.getAdjacent(curr.x, curr.y);
    for (const cell of adjacents) {
      const cost = curr.cost + grid.get(cell.x, cell.y)!;
      const adjkey = `${cell.x},${cell.y}`;
      const best = bests[adjkey] || Number.MAX_SAFE_INTEGER;
      const goalBest = bests[`${goal.x},${goal.y}`] || Number.MAX_SAFE_INTEGER;
      if (cell.x === goal.x && cell.y === goal.y) {
        if (cost < best) {
          bests[adjkey] = cost;
        }
      } else if (cost >= best || cost >= goalBest) {
        continue;
      } else {
        if (cost < best) {
          bests[adjkey] = cost;
        }
        queue.push({
          x: cell.x,
          y: cell.y,
          cost: curr.cost + grid.get(cell.x, cell.y)!,
          visited: new Set<string>([...curr.visited, key]),
          path: [...curr.path, key],
        });
      }
    }
  }

  return bests[`${goal.x},${goal.y}`];
}

function part1b(grid: Grid): number {
  console.log(grid.width, grid.height);
  const goal = { x: grid.width - 1, y: grid.height - 1 };
  const queue = [{ x: 0, y: 0, cost: 0, visited: new Set<string>(), path: [] as string[] }];

  const bests: Record<string, number> = {};

  while(queue.length > 0) {
    const curr = queue.shift()!;
    const key = `${curr.x},${curr.y}`;

    if (curr.visited.has(key)) {
      continue;
    }
    console.log(`${curr.x},${curr.y}`, curr.path.length, curr.cost);

    const adjacents = grid.getAdjacent(curr.x, curr.y).sort((a, b) => a.value - b.value);
    for (const cell of adjacents) {
      const cost = curr.cost + cell.value;
      const adjkey = `${cell.x},${cell.y}`;
      const best = bests[adjkey] || Number.MAX_SAFE_INTEGER;
      const goalBest = bests[`${goal.x},${goal.y}`] || Number.MAX_SAFE_INTEGER;
      if (cell.x === goal.x && cell.y === goal.y) {
        if (cost < best) {
          bests[adjkey] = cost;
        }
      } else if (cost >= best || cost >= goalBest) {
        continue;
      } else {
        if (cost < best) {
          bests[adjkey] = cost;
        }
        queue.push({
          x: cell.x,
          y: cell.y,
          cost: curr.cost + grid.get(cell.x, cell.y)!,
          visited: new Set<string>([...curr.visited, key]),
          path: [...curr.path, key],
        });
      }
    }
  }

  return bests[`${goal.x},${goal.y}`];
}
function part2(inputGrid: Grid): number {
  const grid = makeBigGrid(inputGrid);
  return part1(grid);
}

function part2b(input: Grid): number {
  const grid = makeBigGrid(input);
  return part1b(grid);
}

function makeBigGrid(input: Grid): Grid {
  const lines = []
  for (let y = 0; y < input.height; y++) {
    const line = [];
    for (let i = 0; i < 5; i++) {
      for (let x = 0; x < input.width; x++) {
        let newval = input.get(x, y)! + i;
        if (newval > 9) {
          newval = newval - 9;
        }
        line.push(newval);
      }
    }
    lines.push(line)
  }

  const bigLines = []
  for (let i = 0; i < 5; i++) {
    for (let y = 0; y < lines.length; y++) {
      const line = [];
      for (let x = 0; x < lines[0].length; x++) {
        let newval = lines[y][x] + i;
        if (newval > 9) {
          newval = newval - 9;
        }
        line.push(newval);
      }
      bigLines.push(line);
    }
  }

  return new Grid(bigLines.map(line => line.join('')).join('\n'));
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  if (part === '1') {
    console.log(part1(new Grid(inputString)));
  } else if (part === '2') {
    console.log(part2b(new Grid(inputString)));
  }
}

await main();
