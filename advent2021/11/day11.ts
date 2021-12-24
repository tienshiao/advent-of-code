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

  increment(x: number, y: number): number | null {
    if (x < 0 || x >= this.lines[0].length) {
      return null;
    }
    if (y < 0 || y >= this.lines.length) {
      return null;
    }
    this.lines[y][x] += 1;

    return this.lines[y][x];
  }


  getAdjacent(x: number, y: number): { x: number, y: number, value: number }[] {
    const adjacent = [
      { x, y: y - 1, value: this.get(x, y - 1) },
      { x: x + 1, y, value: this.get(x + 1, y) },
      { x, y: y + 1, value: this.get(x, y + 1) },
      { x: x - 1, y, value: this.get(x - 1, y) },

      { x: x - 1, y: y - 1, value: this.get(x - 1, y - 1) },
      { x: x + 1, y: y - 1, value: this.get(x + 1, y - 1) },
      { x: x + 1, y: y + 1, value: this.get(x + 1, y + 1) },
      { x: x - 1, y: y + 1, value: this.get(x - 1, y + 1) },
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

function part1(grid: Grid, steps: number): number {
  let flashes = 0;
  for (let step = 0; step < steps; step++) {
    // queue of cells to flash
    let queue = [];

    // each level increases by 1
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const val = grid.increment(x, y);
        if (val && val > 9) {
          queue.push({ x, y });
          flashes += 1;
        }
      }
    }

    // flash and increment adjacent
    while(queue.length > 0) {
      const { x, y } = queue.shift()!;
      const adjacent = grid.getAdjacent(x, y);
      adjacent.forEach(({ x, y }) => {
        const curr = grid.get(x, y);
        if (!curr) {
          return;
        }
        if (curr == 10) {
          // already flashed, skip
          return;
        }

        const val = grid.increment(x, y);
        if (val && val > 9) {
          queue.push({ x, y });
          flashes += 1;
        }
      });
    }

    // flashed ones get reset to 0
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const val = grid.get(x, y);
        if (val && val > 9) {
          grid.set(x, y, 0);
        }
      }
    }

    // console.log(`After step ${step+1}`);
    // console.log(grid.toString());
  }

  return flashes;
}

function part2(grid: Grid): number {
  let step = -1;
  while (true) {
    step += 1;
    // queue of cells to flash
    let queue = [];

    // each level increases by 1
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const val = grid.increment(x, y);
        if (val && val > 9) {
          queue.push({ x, y });
        }
      }
    }

    // flash and increment adjacent
    while(queue.length > 0) {
      const { x, y } = queue.shift()!;
      const adjacent = grid.getAdjacent(x, y);
      adjacent.forEach(({ x, y }) => {
        const curr = grid.get(x, y);
        if (!curr) {
          return;
        }
        if (curr == 10) {
          // already flashed, skip
          return;
        }

        const val = grid.increment(x, y);
        if (val && val > 9) {
          queue.push({ x, y });
        }
      });
    }

    // flashed ones get reset to 0
    let resets = 0;
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const val = grid.get(x, y);
        if (val && val > 9) {
          grid.set(x, y, 0);
          resets += 1;
        }
      }
    }
    console.log(`After step ${step+1} resets: ${resets}`);
    if (resets == 100) {
      return step + 1;
    }
  }

  return 0;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  if (part === '1') {
    console.log(part1(new Grid(inputString), 100));
  } else if (part === '2') {
    console.log(part2(new Grid(inputString)));
  }
}

await main();
