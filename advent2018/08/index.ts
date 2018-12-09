import { Input } from '../interfaces';

interface Node {
  childrenCount: number;
  metadataCount: number;
  metadata: number[];
  remainder: number[];
  sum: number;
}

function parse(nodes: number[]) {
  console.log(nodes);
  const childrenCount = nodes[0];
  const metadataCount = nodes[1];
  let remainder = nodes.slice(2);
  let sum = 0;

  for (let c = 0; c < childrenCount; c++) {
    const node = parse(remainder);
    sum += node.sum;
    remainder = node.remainder;
  }

  const metadata = remainder.slice(0, metadataCount);
  remainder = remainder.slice(metadataCount);
  sum += metadata.reduce((prev, curr) => prev + curr, 0);

  return {
    childrenCount,
    metadataCount,
    metadata,
    remainder,
    sum
  };
}

function parse2(nodes: number[]) {
  console.log(nodes);
  const childrenCount = nodes[0];
  const metadataCount = nodes[1];
  let remainder = nodes.slice(2);
  let sum = 0;

  const children: Node[] = [];
  for (let c = 0; c < childrenCount; c++) {
    const node = parse2(remainder);
    children.push(node);
    remainder = node.remainder;
  }

  const metadata = remainder.slice(0, metadataCount);
  remainder = remainder.slice(metadataCount);
  if (childrenCount === 0) {
    sum += metadata.reduce((prev, curr) => prev + curr, 0);
  } else {
    for (let i = 0; i < metadata.length; i++) {
      const index = metadata[i] - 1;
      if (index < 0) {
        //do nothing
      } else if (children[index]) {
        sum += children[index].sum;
      }
    }
  }

  return {
    childrenCount,
    metadataCount,
    metadata,
    remainder,
    sum
  };
}

async function part1(input: Input) {
  const nodes = input.lines[0].trim().split(' ').map((i: string) => Number(i));
  let total = parse(nodes);

  return total.sum;
}

async function part2(input: Input) {
  const nodes = input.lines[0].trim().split(' ').map((i: string) => Number(i));
  let total = parse2(nodes);

  return total.sum;
}

module.exports = [
  part1,
  part2
];
