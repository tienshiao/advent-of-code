class Grid {
  lines: string[];

  constructor(inputString: string) {
    this.lines = inputString.trim().split('\n');
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
    return parseInt(this.lines[y][x], 10);
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
}

function part1(grid: Grid): number {
  const lowPoints = [];

  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const current = grid.get(x, y);
      const adjacent = grid.getAdjacent(x, y);
      if (adjacent.every(n => n.value > current!)) {
        lowPoints.push(current!);
      }
    }
  }

  return lowPoints.reduce((a, b) => a + b + 1, 0);
}

function part2(grid: Grid): number {
  const lowPoints = [];

  for (let x = 0; x < grid.width; x++) {
    for (let y = 0; y < grid.height; y++) {
      const current = grid.get(x, y);
      const adjacent = grid.getAdjacent(x, y);
      if (adjacent.every(n => n.value > current!)) {
        lowPoints.push({x, y});
      }
    }
  }

  const sizes = [];
  for (const lowPoint of lowPoints) {
    const {x, y} = lowPoint;
    // bfs
    const queue: {x: number; y: number}[] = [{x, y}];
    const visited = new Set<string>();
    while (queue.length > 0) {
      const {x, y} = queue.shift()!;
      const key = `${x}-${y}`;
      if (visited.has(key)) {
        continue;
      }
      visited.add(key);

      const adjacent = grid.getAdjacent(x, y);
      // console.log(adjacent);
      for (const n of adjacent) {
        if (n.value !== 9) {
          queue.push({x: n.x, y: n.y});
        }
      }
      // console.log(queue);
    }

    // console.log(visited)
    sizes.push(visited.size);
  }

  // console.log(sizes);
  return sizes.sort((a, b) => a - b).slice(-3).reduce((a, b) => a * b, 1);
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  if (part === '1') {
    console.log(part1(new Grid(inputString)));
  } else if (part === '2') {
    console.log(part2(new Grid(inputString)));
  }
}

await main();
