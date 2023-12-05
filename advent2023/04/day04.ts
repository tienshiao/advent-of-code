type Card = {
  number: number;
  winning: number[]
  have: number[];
}

function parseCard(input: string): Card {
  const [cardNumberString, numbers] = input.split(':').map(s => s.trim());
  const [, numberString] = cardNumberString.split(/\s+/);
  const number = parseInt(numberString);

  const [winningString, haveString] = numbers.split('|').map(s => s.trim());
  const winning = winningString.split(' ').map(s => parseInt(s)).filter(x => !isNaN(x));
  const have = haveString.split(' ').map(s => parseInt(s)).filter(x => !isNaN(x));
  return {
    number,
    winning,
    have,
  };
}

function intersect(a: number[], b: number[]): number[] {
  const aSet = new Set(a);
  return b.filter(x => aSet.has(x));
}

function part1(input: string[]) {
  let points = 0;
  for (const line of input) {
    if (line === '') {
      continue;
    }
    const card = parseCard(line);
    const intersection = intersect(card.winning, card.have);
    if (intersection.length > 0) {
      // console.log(card, intersection, Math.pow(2, intersection.length - 1));
      points += Math.pow(2, intersection.length - 1);
    }
  }

  return points;
}

function part2(input: string[]) {
  const cards: Card[] = [];
  const cardCounts = new Map<number, number>();
  for (const line of input) {
    if (line === '') {
      continue;
    }
    const card = parseCard(line);
    cards.push(card);
    cardCounts.set(card.number, 1);
  }

  for (const [cardNumber, cardCount] of cardCounts.entries()) {
    console.log(cardNumber, cardCount);
  }

  for (const card of cards) {
    const multipier = cardCounts.get(card.number) ?? 1;
    const intersection = intersect(card.winning, card.have);
    if (intersection.length > 0) {
      for (let i = 0; i < intersection.length; i++) {
        const cardNumber = card.number + i + 1;
        const count = cardCounts.get(cardNumber) ?? 1;
        cardCounts.set(cardNumber, count + multipier);
      }
    }
  }

  let count = 0;
  for (const [cardNumber, cardCount] of cardCounts.entries()) {
    console.log(cardNumber, cardCount);
    count += cardCount;
  }

  return count;
}

async function main() {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);
  const input = inputString.trim().split('\n');

  if (part === '1') {
    console.log(part1(input));
  } else if (part === '2') {
    console.log(part2(input));
  }
}

main();
