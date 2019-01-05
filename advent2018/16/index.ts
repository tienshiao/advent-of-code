import { Input } from '../interfaces';

interface Sample {
  before: number[],
  instruction: number[]
  after: number[],
}

type State = number[];

interface Instruction {
  name: string,
  implementation: (state: State, a: number, b: number, c: number) => State
}

const instructionsByName: { [name: string]: Instruction } = {
  'addr': {
    name: 'addr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] + newState[b];
      return newState;
    }
  },
  'addi': {
    name: 'addi',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] + b;
      return newState;
    }
  },

  'mulr': {
    name: 'mulr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] * newState[b];
      return newState;
    }
  },
  'muli': {
    name: 'muli',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] * b;
      return newState;
    }
  },

  'banr': {
    name: 'banr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] & newState[b];
      return newState;
    }
  },
  'bani': {
    name: 'bani',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] & b;
      return newState;
    }
  },

  'borr': {
    name: 'borr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] | newState[b];
      return newState;
    }
  },
  'bori': {
    name: 'bori',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a] | b;
      return newState;
    }
  },

  'setr': {
    name: 'setr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = newState[a];
      return newState;
    }
  },
  'seti': {
    name: 'seti',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = a;
      return newState;
    }
  },

  'gtir': {
    name: 'gtir',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = (a > newState[b]) ? 1 : 0;
      return newState;
    }
  },
  'gtri': {
    name: 'gtri',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = (newState[a] > b) ? 1 : 0;
      return newState;
    }
  },
  'gtrr': {
    name: 'gtrr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = (newState[a] > newState[b]) ? 1 : 0;
      return newState;
    }
  },

  'eqir': {
    name: 'eqir',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = (a === newState[b]) ? 1 : 0;
      return newState;
    }
  },
  'eqri': {
    name: 'eqri',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = (newState[a] === b) ? 1 : 0;
      return newState;
    }
  },
  'eqrr': {
    name: 'eqrr',
    implementation: (state, a, b, c) => {
      const newState = [...state];
      newState[c] = (newState[a] === newState[b]) ? 1 : 0;
      return newState;
    }
  },
}

function isEqualState(s1: State, s2: State) {
  return JSON.stringify(s1) === JSON.stringify(s2);
}

function parseSamples(lines: string[]): Sample[] {
  let samples = [];
  let i = 0;
  while (i < lines.length) {
    const bmatch = lines[i].match(/(\d+), (\d+), (\d+), (\d+)/);
    i++;
    const imatch = lines[i].match(/(\d+) (\d+) (\d+) (\d+)/);
    i++;
    const amatch = lines[i].match(/(\d+), (\d+), (\d+), (\d+)/);
    i++;
    // blank line
    i++

    samples.push({
      before: bmatch!.slice(1).map(s => Number(s)),
      instruction: imatch!.slice(1).map(s => Number(s)),
      after: amatch!.slice(1).map(s => Number(s))
    });
  }
  return samples;
}

function checkInstruction(opcode: number, instruction: Instruction, samples: Sample[]) {
  const subsamples = samples.filter(s => s.instruction[0] === opcode);

  for (let sample of subsamples) {
    const state = instruction.implementation(sample.before, sample.instruction[1], sample.instruction[2], sample.instruction[3]);
    if (!isEqualState(state, sample.after)) {
      return false;
    }
  }
  return true;
}

async function part1(input: Input) {
  const samples = parseSamples(input.lines);

  let threeOrMore = 0;
  samples.forEach(sample => {
    let match = 0;
    Object.values(instructionsByName).forEach(instruction => {
      const state = instruction.implementation(sample.before, sample.instruction[1], sample.instruction[2], sample.instruction[3]);
      if (isEqualState(state, sample.after)) {
        match++;
      }
    });

    if (match == 1) {
      threeOrMore++;
    }
  });

  return threeOrMore;
}

async function part2(input: Input) {
  const samples = parseSamples(input.lines);

  const instructions = Object.values(instructionsByName);
  instructions.forEach(instruction => {
    for (let i = 0; i < 16; i++) {
      if (checkInstruction(i, instruction, samples)) {
        console.log(instruction.name, i);
      }
    }
  });

}

async function part3(input: Input) {
  const opcodes = [
    'seti',
    'eqir',
    'setr',
    'gtir',
    'addi',
    'muli',
    'mulr',
    'gtrr',
    'bani',
    'gtri',
    'bori',
    'banr',
    'borr',
    'eqri',
    'eqrr',
    'addr'
  ];

  let state = [0, 0, 0, 0];

  input.lines.forEach(line => {
    const numeric = line.split(' ').map(s => Number(s));
    const instruction = instructionsByName[opcodes[numeric[0]]];
    state = instruction.implementation(state, numeric[1], numeric[2], numeric[3]);
  });

  return state[0];
}

module.exports = [
  part1,
  part2,
  part3
];
