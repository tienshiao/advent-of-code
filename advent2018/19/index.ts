import { Input } from '../interfaces';

interface Sample {
  before: number[],
  instruction: number[]
  after: number[],
}

interface State {
  ip: number;
  ipRegister: number;
  registers: number[];
}

interface Instruction {
  name: string,
  implementation: (state: State, a: number, b: number, c: number) => State
}

const instructionsByName: { [name: string]: Instruction } = {
  'addr': {
    name: 'addr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] + newState.registers[b];
      return newState;
    }
  },
  'addi': {
    name: 'addi',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] + b;
      return newState;
    }
  },

  'mulr': {
    name: 'mulr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] * newState.registers[b];
      return newState;
    }
  },
  'muli': {
    name: 'muli',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] * b;
      return newState;
    }
  },

  'banr': {
    name: 'banr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] & newState.registers[b];
      return newState;
    }
  },
  'bani': {
    name: 'bani',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] & b;
      return newState;
    }
  },

  'borr': {
    name: 'borr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] | newState.registers[b];
      return newState;
    }
  },
  'bori': {
    name: 'bori',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a] | b;
      return newState;
    }
  },

  'setr': {
    name: 'setr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = newState.registers[a];
      return newState;
    }
  },
  'seti': {
    name: 'seti',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = a;
      return newState;
    }
  },

  'gtir': {
    name: 'gtir',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = (a > newState.registers[b]) ? 1 : 0;
      return newState;
    }
  },
  'gtri': {
    name: 'gtri',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = (newState.registers[a] > b) ? 1 : 0;
      return newState;
    }
  },
  'gtrr': {
    name: 'gtrr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = (newState.registers[a] > newState.registers[b]) ? 1 : 0;
      return newState;
    }
  },

  'eqir': {
    name: 'eqir',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = (a === newState.registers[b]) ? 1 : 0;
      return newState;
    }
  },
  'eqri': {
    name: 'eqri',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = (newState.registers[a] === b) ? 1 : 0;
      return newState;
    }
  },
  'eqrr': {
    name: 'eqrr',
    implementation: (state, a, b, c) => {
      const newState = {
        ip: state.ip,
        ipRegister: state.ipRegister,
        registers: [...state.registers]
      };
      newState.registers[c] = (newState.registers[a] === newState.registers[b]) ? 1 : 0;
      return newState;
    }
  },
}

function isEqualState(s1: State, s2: State) {
  return JSON.stringify(s1) === JSON.stringify(s2);
}

function printState(oldState: State, newState: State, line: string) {
  console.log(`ip=${oldState.ip} [${oldState.registers.join()}] ${line.trim()} [${newState.registers.join()}]`);
}

async function part1(input: Input) {
  const program = input.lines.slice(1);

  const directive = input.lines[0].split(' ');

  let state = {
    ip: 0,
    ipRegister: Number(directive[1]),
    registers: [0, 0, 0, 0, 0, 0]
  };

  while(program[state.ip]) {
    const line = program[state.ip];   // assume #ip declaration on first line
    const parts = line.split(' ');
    const instruction = parts[0];
    const parameters = parts.slice(1).map(s => Number(s));

    const impl = instructionsByName[instruction];
    state.registers[state.ipRegister] = state.ip;
    const newState = impl.implementation(state, parameters[0], parameters[1], parameters[2]);
    newState.ip = newState.registers[newState.ipRegister];
    newState.ip++;
    printState(state, newState, line);
    state = newState;
  }

  return state.registers[0];
}

async function part2(input: Input) {
  const program = input.lines.slice(1);

  const directive = input.lines[0].split(' ');

  let state = {
    ip: 0,
    ipRegister: Number(directive[1]),
    registers: [1, 0, 0, 0, 0, 0]
  };

  while(program[state.ip]) {
    const line = program[state.ip];   // assume #ip declaration on first line
    const parts = line.split(' ');
    const instruction = parts[0];
    const parameters = parts.slice(1).map(s => Number(s));

    const impl = instructionsByName[instruction];
    state.registers[state.ipRegister] = state.ip;
    const newState = impl.implementation(state, parameters[0], parameters[1], parameters[2]);
    newState.ip = newState.registers[newState.ipRegister];
    newState.ip++;
    printState(state, newState, line);
    state = newState;
  }

  return state.registers[0];
}

async function part3() {
  const r = [1, 0, 0, 0, 0, 0];

  // start up that calculates initial values 17..35
  r[4] = r[4] + 2;        // => 2
  r[4] = r[4] * r[4];     // => 2*2 = 4
  r[4] = 19 * r[4];       // => 19 * 4 = 76
  r[4] = r[4] * 11;       // => 76 * 11 = 836
  r[3] = r[3] + 3;        // => 3
  r[3] = r[3] * 22;       // => 3 * 22 = 66
  r[3] = r[3] + 4;        // => 66 + 4 = 70
  r[4] = r[4] + r[3];     // => 836 + 70 = 906

  r[3] = 27;
  r[3] = r[3] * 28;       // => 27 * 28 = 756
  r[3] = 29 + r[3];       // => 29 + 756 = 785
  r[3] = 30 * r[3];       // => 30 * 785 = 23_550
  r[3] = r[3] * 14;       // => 23_550 * 14 = 329_700
  r[3] = r[3] * 32;       // => 329_700 * 32 = 10_550_400
  r[4] = r[4] + r[3];     // => 906 + 10_550_400 = 10_551_306

  r[0] = 0;

  r[5] = 1;

  console.log(r);

  while(true) {
    r[2] = 1;

    // main loop 3..11
    while(true) {
      // r[3] = r[5] * r[2];
      // r[3] = r[3] == r[4] ? 1 : 0;
      // if (r[3]) {
      //   r[0] = r[5] + r[0];
      // }
      // r[2] = r[2] + 1;
      if (r[5] * r[2] == r[4]) {
        r[0] += r[5];
      }
      r[2]++;

      if (r[2] % 100000 == 0) {
        console.log(r);
      }

      // r[3] = r[2] > r[4] ? 1 : 0;
      // if (r[3]) {
      //   break;
      // }

      if (r[2] > r[4]) {
        break;
      }
    }

    // outer loop 12..16
    // r[5] = r[5] + 1;
    r[5]++;

    if (r[5] % 10000 == 0) {
      console.log(r);
    }

    // r[3] = r[5] > r[4] ? 1 : 0;
    // if (r[3]) {
    //   break;
    // }
    if (r[5] > r[4]) {
      break;
    }
  }

  return r[0];
}

async function part4() {
  const product = 10_551_306;
  let r0 = 0;

  for (let r5 = 1; r5 <= product; r5++) {
    for (let r2 = 1; r2 <= product; r2++) {
      if (r5 * r2 == product) {
        r0 += r5;
      }
    }
  }

  return r0;
}

module.exports = [
  part1,
  part2,
  part3,
  part4
];
