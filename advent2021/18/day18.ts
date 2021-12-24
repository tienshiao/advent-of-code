type Snailfish = [number | Snailfish, number | Snailfish];

type SnailfishStream = (number | '[' | ']')[];

class SnailfishParser {
  input: string[]

  constructor(input: string) {
    this.input = input.split('');
  }

  readNext(): string {
    return this.input.shift()!;
  }

  parse(): Snailfish {
    if (this.readNext() !== '[') {
      throw new Error(`expected [, ${this.input}`);
    }
    let left: number | Snailfish;
    let right: number | Snailfish;
    const maybeLeft = this.readNext();
    if (maybeLeft === '[') {
      const buffer = [maybeLeft]
      let bracketCount = 1;
      while (bracketCount > 0) {
        const next = this.readNext();
        buffer.push(next);
        if (next === '[') {
          bracketCount++;
        } else if (next === ']') {
          bracketCount--;
        }
      }

      left = new SnailfishParser(buffer.join('')).parse();
    } else {
      left = parseInt(maybeLeft, 10);
    }

    if (this.readNext() !== ',') {
      throw new Error(`expected comma, ${this.input}`);
    }

    const maybeRight = this.readNext();
    if (maybeRight === '[') {
      const buffer = [maybeRight]
      let bracketCount = 1;
      while (bracketCount > 0) {
        const next = this.readNext();
        buffer.push(next);
        if (next === '[') {
          bracketCount++;
        } else if (next === ']') {
          bracketCount--;
        }
      }

      right = new SnailfishParser(buffer.join('')).parse();
    } else {
      right = parseInt(maybeRight, 10);
    }

    return [left, right];
  }

}

function part1(input: SnailfishStream[]): number {
  let acc = input.shift()!;
  for (const snail of input) {
    const toReduce = ['[' as const, ...acc, ...snail, ']' as const]
    let reduced;
    do {
      reduced = reduce(toReduce);
    } while (!isEqual(toReduce, reduced))

    acc = reduced;
  }
  return 0;
}

function part2(): number {
  return 0;
}

function parseInput(input: string): SnailfishStream[] {
  return input.split('\n').map(line => {
    const retval = line.split('')
    .filter(x => x !== ',')
    .map(char => {
      if (char === '[' || char === ']') {
        return char;
      } else {
        return parseInt(char, 10);
      }
    });
    return retval;
  });
}

function isEqual(left: SnailfishStream, right: SnailfishStream) {
  const leftStr = JSON.stringify(left);
  const rightStr = JSON.stringify(right);
  return leftStr === rightStr;
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const snailfishes = parseInput(inputString.trim());
  console.log(snailfishes)

  if (part === '1') {
    console.log(part1(snailfishes));
  } else if (part === '2') {
    console.log(part2());
  }
}

await main();
