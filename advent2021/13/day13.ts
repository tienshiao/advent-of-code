class Grid13 {
  dots: Record<string, boolean>;
  width: number;
  height: number;

  constructor(dots: {x: number, y: number}[]) {
    this.dots = {};
    this.width = 0;
    this.height = 0;
    for (const dot of dots) {
      this.set(dot.x, dot.y, true);
      this.width = Math.max(this.width, dot.x);
      this.height = Math.max(this.height, dot.y);
    }
    this.width++;
    this.height++;
  }

  get(x: number, y: number): boolean {
    const val = this.dots[`${x},${y}`];
    if (val) {
      return val;
    }
    return false;
  }

  set(x: number, y: number, value: boolean) {
    this.dots[`${x},${y}`] = value;
  }

  foldH(foldX: number) {
    const newDots: Record<string, boolean> = {};

    for (const key in this.dots) {
      const [x, y] = key.split(',').map(Number);
      if (x < foldX) {
        newDots[key] = this.dots[key];
      } else {
        newDots[`${foldX - (x - foldX)},${y}`] = this.dots[key];
      }
    }

    this.dots = newDots;
    this.width = foldX;
  }

  foldV(foldY: number) {
    const newDots: Record<string, boolean> = {};

    for (const key in this.dots) {
      const [x, y] = key.split(',').map(Number);
      if (y < foldY) {
        newDots[key] = this.dots[key];
      } else {
        newDots[`${x},${foldY - (y - foldY)}`] = this.dots[key];
      }
    }

    this.dots = newDots;
    this.height = foldY;
  }

  toString(): string {
    let lines = '';
    for (let y = 0; y < this.height; y++) {
      let line = '';
      for (let x = 0; x < this.width; x++) {
        if (this.get(x, y)) {
          line += '#';
        } else {
          line += '.';
        }
      }
      lines += line + '\n';
    }

    return lines;
  }
}

function part1(grid: Grid13, directions: string[]): number {
  const [type, value] = directions[0].split('=');
  const axis = +value;
  if (type === 'fold along y') {
    grid.foldV(axis);
  } else if (type === 'fold along x') {
    grid.foldH(axis);
  }

  console.log(grid.toString());
  return Object.keys(grid.dots).length;
}

function part2(grid: Grid13, directions: string[]): number {
  for (const direction of directions) {
    const [type, value] = direction.split('=');
    const axis = +value;
    if (type === 'fold along y') {
      grid.foldV(axis);
    } else if (type === 'fold along x') {
      grid.foldH(axis);
    }
  }

  console.log(grid.toString());
  return Object.keys(grid.dots).length;
  return 0;
}

function parseInput(inputString: string): [ { x: number, y:number }[], string[]] {
  const [dotLines, directionLines] = inputString.split('\n\n');
  const dots: { x: number, y: number }[] = [];
  for (const line of dotLines.split('\n')) {
    const [x, y] = line.split(',').map(Number);
    dots.push({x, y});
  }

  return [dots, directionLines.split('\n')];
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const [dots, directions] = parseInput(inputString.trim());
  // console.log(dots);

  const grid = new Grid13(dots);
  console.log(grid.toString());

  if (part === '1') {
    console.log(part1(grid, directions));
  } else if (part === '2') {
    console.log(part2(grid, directions));
  }
}

await main();
