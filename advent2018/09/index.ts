import { Input } from '../interfaces';

function print(player: number, index: number, circle: number[]) {
  let circleStr = '';
  circle.forEach((n, i) => {
    if (i === index) {
      circleStr += `(${n}) `;
    } else {
      circleStr += `${n} `;
    }
  });
  console.log(`[${player}]`, circleStr);
}

async function part1(input: Input) {
  const players = 452;
  const lastMarble = 71250 * 100;

  const scores: { [player: number]: number} = {};
  let circle = [ 0 ];

  let currPlayer = 0;
  let currMarbleVal = 1;
  let currMarbleIndex = 0;
  while(true) {
    currPlayer = (currPlayer + 1) % players;

    if (currMarbleVal % 23 === 0) {
      let score = scores[currPlayer] || 0;
      scores[currPlayer] = score + currMarbleVal;
      currMarbleIndex -= 7;
      if (currMarbleIndex < 0) {
        currMarbleIndex += circle.length;
      }
      scores[currPlayer] = score + currMarbleVal + circle[currMarbleIndex];
      circle.splice(currMarbleIndex, 1);
    } else {
      // insert next Marble currMarbleIndex + 1
      currMarbleIndex = (currMarbleIndex + 1) % circle.length + 1;
      circle.splice(currMarbleIndex, 0, currMarbleVal);
    }
    // print(currPlayer, currMarbleIndex, circle);
    currMarbleVal++;
    if (currMarbleVal > lastMarble) {
      break;
    }

    if (currMarbleVal %1000 === 0) console.log(currMarbleVal);
  }

  let max = 0;
  for (let i = 0; i < players; i++) {
    const score = scores[i] || 0;
    if (score > max) {
      max = score;
    }
  }

  return max;
}

interface Node {
  value: number;
  next?: Node;
  previous?: Node;
}

function printLL(player: number, curr: Node, head: Node) {
  let circleStr = '';
  let cursor = head;
  while(true) {
    if (cursor === curr) {
      circleStr += `(${cursor.value}) `;
    } else {
      circleStr += `${cursor.value} `;
    }
    cursor = cursor.next || cursor;
    if (cursor === head) {
      break;
    }
  }
  console.log(`[${player}]`, circleStr);
}

async function part2(input: Input) {
  const players = 452;
  const lastMarble = 71250 * 100;

  const scores: { [player: number]: number} = {};
  let circle: Node = {
    value: 0
  };
  circle.previous = circle;
  circle.next = circle;

  let currPlayer = 0;
  let currMarbleVal = 1;
  let currMarbleNode = circle;

  while(true) {
    currPlayer = (currPlayer + 1) % players;

    if (currMarbleVal % 23 === 0) {
      let score = scores[currPlayer] || 0;
      scores[currPlayer] = score + currMarbleVal;

      // move back 7
      for (let i = 0; i < 7; i++) {
        currMarbleNode = currMarbleNode.previous || currMarbleNode;
      }
      scores[currPlayer] = score + currMarbleVal + currMarbleNode.value;

      currMarbleNode = currMarbleNode.previous || currMarbleNode;
      currMarbleNode.next = currMarbleNode.next && currMarbleNode.next.next;
      currMarbleNode = currMarbleNode.next || currMarbleNode;
    } else {
      currMarbleNode = currMarbleNode.next || currMarbleNode;
      const node = {
        value: currMarbleVal,
        previous: currMarbleNode,
        next: currMarbleNode.next
      };
      if (currMarbleNode.next) currMarbleNode.next.previous = node;
      currMarbleNode.next = node;
      currMarbleNode = currMarbleNode.next;
    }

    // printLL(currPlayer, currMarbleNode, circle);
    currMarbleVal++;
    if (currMarbleVal > lastMarble) {
      break;
    }

    if (currMarbleVal %1000 === 0) console.log(currMarbleVal);
  }

  let max = 0;
  for (let i = 0; i < players; i++) {
    const score = scores[i] || 0;
    if (score > max) {
      max = score;
    }
  }

  return max;
}

module.exports = [
  part1,
  part2
];
