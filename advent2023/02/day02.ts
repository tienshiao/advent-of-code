type Reveal = {
  red: number;
  green: number;
  blue: number;
}

type Game = {
  id: number;
  reveals: Reveal[];
}

function parseLineToGame(line: string): Game {
  const [gameId, revealsString] = line.split(':').map(s => s.trim());
  const [, id] = gameId.split(' ');
  const reveals = revealsString.split(';').map(revealString => {
    const reveal: Reveal = {
      red: 0,
      green: 0,
      blue: 0,
    };
    const colors = revealString.split(',').map(color => color.trim());
    colors.forEach(color => {
      const [value, key] = color.split(' ').map(s => s.trim());
      reveal[key as keyof Reveal] = parseInt(value);
    });
    return reveal;
  });

  return {
    id: parseInt(id),
    reveals,
  };
}

function part1(input: string[]) {
  const constraints: Reveal = {
    red: 12,
    green: 13,
    blue: 14,
  };

  const games = input.map(parseLineToGame);
  const filtered = games.filter(game => {
    return game.reveals.every(reveal => {
      return Object.entries(reveal).every(([key, value]) => {
        return value <= constraints[key as keyof Reveal];
      });
    });
  });

  return filtered.reduce((acc, game) => {
    return acc + game.id;
  }, 0);
}

function part2(input: string[]) {
  const games = input.map(parseLineToGame);
  const powers = games.map(game => {
    const max: Reveal = {
      red: 0,
      green: 0,
      blue: 0,
    };
    game.reveals.forEach(reveal => {
      Object.entries(reveal).forEach(([key, value]) => {
        max[key as keyof Reveal] = Math.max(max[key as keyof Reveal], value);
      });
    });
    return Object.values(max).reduce((acc, value) => {
      return acc * value;
    }, 1);
  });
  const sum = powers.reduce((acc, power) => {
    return acc + power;
  }, 0);
  return sum;
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
