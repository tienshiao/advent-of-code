type Line = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

function parseInput(input: string[]): Line[] {
  const lines: Line[] = [];
  for (const line of input) {
    const [x1, y1, x2, y2] = line.split(/\D+/).map(Number);
    lines.push({ x1, y1, x2, y2 });
  }
  return lines;
}

function part1(lines: Line[]): number {
  const grid: Record<string, number> = {};
  for (const line of lines) {
    if (line.x1 === line.x2 || line.y1 === line.y2) {
      console.log(line);
      let dx = line.x2 - line.x1;
      let dy = line.y2 - line.y1;

      // normalize
      dx = dx / Math.max(Math.abs(dx), Math.abs(dy));
      dy = dy / Math.max(Math.abs(dx), Math.abs(dy));

      let x = line.x1;
      let y = line.y1;
      while (x != line.x2 || y != line.y2) {
        grid[`${x},${y}`] = grid[`${x},${y}`] ? grid[`${x},${y}`] + 1 : 1;
        x += dx;
        y += dy;
      }
      grid[`${x},${y}`] = grid[`${x},${y}`] ? grid[`${x},${y}`] + 1 : 1;
    }
  }

  // console.log(grid);

  const count = Object.values(grid).filter(v => v > 1).length;
  return count;
}

// my part1 solution already supported diagonal lines
// so I just had to remove the horizontal and vertical line filter/condition
function part2(lines: Line[]): number {
  const grid: Record<string, number> = {};
  for (const line of lines) {
    console.log(line);
    let dx = line.x2 - line.x1;
    let dy = line.y2 - line.y1;

    // normalize
    dx = dx / Math.max(Math.abs(dx), Math.abs(dy));
    dy = dy / Math.max(Math.abs(dx), Math.abs(dy));

    let x = line.x1;
    let y = line.y1;
    while (x != line.x2 || y != line.y2) {
      grid[`${x},${y}`] = grid[`${x},${y}`] ? grid[`${x},${y}`] + 1 : 1;
      x += dx;
      y += dy;
    }
    grid[`${x},${y}`] = grid[`${x},${y}`] ? grid[`${x},${y}`] + 1 : 1;
  }

  // console.log(grid);

  const count = Object.values(grid).filter(v => v > 1).length;
  return count;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const lines = parseInput(inputString.trim().split('\n'));
  console.log(lines);

  if (part === '1') {
    console.log(part1(lines));
  } else if (part === '2') {
    console.log(part2(lines));
  }
}

await main();
