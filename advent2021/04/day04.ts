
type Board = number[][];

function parseInput(input: string[]): [number[], Board[]] {
  const numbers = input[0].split(',').map(Number);
  const boards = input.slice(1).map((board) => {
    const rows = board.split('\n');
    return rows.map((row) => row.trim().split(/ +/).map(Number));
  });

  return [numbers, boards];
}

// originally make number negative to mark, but that doesn't work for 0
// so instead, set to -1 to mark
// technically, we do get a -0 but the checkWin function would get more complicated
function mark(board: Board, val: number): void {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] === val) {
        board[i][j] = -1;
      }
    }
  }
}

function checkWin(board: Board): boolean {
  for (let i = 0; i < board.length; i++) {
    let countIJ = 0;
    let countJI = 0;
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] < 0) {
        countIJ++;
      }
      if (board[j][i] < 0) {
        countJI++;
      }
    }
    if (countIJ === 5 || countJI === 5) {
      return true;
    }
  }

  return false;
}

function unmarkedSum(board: Board): number {
  let sum = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] >= 0) {
        sum += board[i][j];
      }
    }
  }
  return sum;
}

function part1(numbers: number[], boards: Board[]): number {
  for (const n of numbers) {
    for (const board of boards) {
      mark(board, n);
      if (checkWin(board)) {
        return n * unmarkedSum(board);
      }
    }
  }
  return 0;
}

function part2(numbers: number[], boards: Board[]): number {
  const wonBoards = new Set<number>();

  for (const n of numbers) {
    for (let i = 0; i < boards.length; i++) {
      const board = boards[i];
      mark(board, n);
      if (checkWin(board)) {
        wonBoards.add(i);
        if (wonBoards.size === boards.length) {
          return n * unmarkedSum(board);
        }
      }
    }
  }
  return 0;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const [numbers, boards] = parseInput(inputString.trim().split('\n\n'));

  if (part === '1') {
    console.log(part1(numbers, boards));
  } else if (part === '2') {
    console.log(part2(numbers, boards));
  }
}

await main();
