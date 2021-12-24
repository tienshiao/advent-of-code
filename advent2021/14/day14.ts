function count(input: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    counts[char] = (counts[char] || 0) + 1;
  }

  return counts;
}

function score(counts: Record<string, number>): number {
  let maxCount = 0;
  let minCount = Number.MAX_SAFE_INTEGER;
  for (const key in counts) {
    const count = counts[key];
    if (count > maxCount) {
      maxCount = count;
    }
    if (count < minCount) {
      minCount = count;
    }
  }

  return maxCount - minCount;
}

function part1(template: string, rules: Record<string, string>, iterations: number): number {
  console.log(template);
  for (let i = 0; i < iterations; i++) {
    const newString = [];
    newString.push(template[0]);
    for (let j = 0; j < template.length - 1; j++) {
      const rule = `${template[j]}${template[j + 1]}`;
      if (rules[rule]) {
        newString.push(rules[rule]);
      }
      newString.push(template[j + 1]);
    }
    template = newString.join('');
    // console.log(`After step ${i + 1}: ${template.length} ${template}`);
    console.log(`After step ${i + 1}: ${template.length}`);
    const counts = count(template);
    console.log(counts);
    console.log(score(counts));
  }

  const counts = count(template);
  return score(counts);
}

function part2(template: string, rules: Record<string, string>, iterations: number): number {
  const counts: Record<string, number> = {};
  const seq = sequence(template, rules, iterations);
  let total = 0;
  for (const char of seq) {
    // console.log(char);
    counts[char] = (counts[char] || 0) + 1;
    total++;
    if (total % 1_000_000 === 0) {
      console.log(total, counts);
    }
  }

  return score(counts);
}

function *sequence(template: string, rules: Record<string, string>, depth: number): IterableIterator<string> {
 for (let i = 0; i < template.length - 1; i++) {
    let curr = template[i];
    let currDepth = 0;
    const stack = [{ value: template[i + 1], depth: 0 }];

    while (stack.length > 0) {
      for (let j = currDepth; j < depth; j++) {
        const { value: next } = stack[stack.length - 1];
        const rule = `${curr}${next}`;
        if (rules[rule]) {
          stack.push({ value: rules[rule], depth: j + 1 });
        } else {
          break;
        }
      }

      // console.log(stack);

      yield curr;

      const top = stack.pop()!;
      curr = top.value;
      currDepth = top.depth;

      // console.log('curr', curr, stack);
    }
  }
  yield template[template.length - 1];
}

function part2b(template: string, rules: Record<string, string>, iterations: number): number {
  let totals: Record<string, number> = {};
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template[i] + template[i + 1];
    console.log(pair);

    const counts = calculateCounts(pair, rules, iterations);

    totals = add(totals, counts);
    totals[template[i + 1]] = totals[template[i + 1]] - 1; // don't trailing value
  }
  totals[template[template.length - 1]] = totals[template[template.length - 1]] + 1; // add trailing value

  console.log(totals);
  return score(totals);
}

const memo: Record<string, Record<string, number>> = {};
function calculateCounts(pair: string, rules: Record<string, string>, iterations: number): Record<string, number> {
  const key = `${pair}-${iterations}`;
  if (memo[key]) {
    return memo[key];
  }

  let retval: Record<string, number> = {};
  if (iterations == 0) {
    retval = count(pair);
  } else {
    const insertVal = rules[pair];
    retval = add(calculateCounts(pair[0] +  insertVal, rules, iterations - 1), calculateCounts(insertVal + pair[1], rules, iterations - 1));
    retval[insertVal] = retval[insertVal] - 1; // don't double count the middle value
  }

  memo[key] = retval;
  // console.log(key, retval, iterations)
  return retval;
}

function add(left: Record<string, number>, right: Record<string, number>): Record<string, number> {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  const total: Record<string, number> = {};
  for (const key of keys) {
    total[key] = (left[key] || 0) + (right[key] || 0);
  }

  return total;
}

function parseInput14(input: string): [string, Record<string, string>] {
  const [template, rulesString] = input.split('\n\n');
  const rules = rulesString.split('\n').map((rule) => rule.split(' -> ')).reduce((acc, [input, output]) => {
    acc[input] = output;
    return acc;
  }, {} as { [input: string]: string });

  return [template, rules];
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  const [template, rules] = parseInput14(inputString.trim());

  if (part === '1') {
    console.log(part1(template, rules, 10));
  } else if (part === '2') {
    console.log(part2b(template, rules, 40));
  }
}

await main();
