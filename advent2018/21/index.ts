import { Input } from '../interfaces';

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

  let minInstructions = Number.MAX_SAFE_INTEGER;
  let minR0 = 0;
  let currR0 = 0;
  while (currR0 < 1024) {

    let instructions = 0;
    state.registers[0] = currR0;
    while(program[state.ip] && instructions < 100000) {
      const line = program[state.ip];   // assume #ip declaration on first line
      const parts = line.split(' ');
      const instruction = parts[0];
      const parameters = parts.slice(1).map(s => Number(s));

      const impl = instructionsByName[instruction];
      state.registers[state.ipRegister] = state.ip;
      const newState = impl.implementation(state, parameters[0], parameters[1], parameters[2]);
      newState.ip = newState.registers[newState.ipRegister];
      newState.ip++;
      // printState(state, newState, line);
      state = newState;

      instructions++;
    }

    if (!program[state.ip]) {
      console.log('halted', currR0, instructions);
      if (instructions < minInstructions) {
        console.log('new min', currR0, instructions);
        minInstructions = instructions;
        minR0 = currR0;
      }
    }
    currR0++;
  }

  return state.registers[0];
}

async function part1b(input: Input) {
  const history: number[] = [];
  const r = [0, 0, 0, 0, 0, 0];

  // r[0] = 12935750;
  r[0] = 16477902;
  r[3] = 0;

  while (true) {
    r[1] = r[3] | 65536;    // line 6, r1 starts at 65536
    // console.log(r[1]);
    r[3] = 10373714;        // 100111100100101001010010

    while (true) {
      // line 8
      r[5] = r[1] & 255;      // r[5] contains lowest 8 bits of r[1]

      r[3] = r[3] + r[5];
      r[3] = r[3] & 16777215;
      r[3] = r[3] * 65899;
      r[3] = r[3] & 16777215;

      if (256 > r[1]) {
        // console.log('break', r[1], r);
        // line 28
        break;
      }
      // console.log('no break?', r[1], r);

      // line 17
      r[5] = 0;

      r[1] = Math.floor(r[1] / 256);

      // while(true) {
      //   //line 18

      //   // r[4] = r[5] + 1;
      //   // r[4] = r[4] * 256;

      //   r[4] = (r[5] + 1) * 256;
      //   console.log('r4', r[4], r);
      //   if (r[4] > r[1]) {
      //     // line 23
      //     // line 26
      //     r[1] = r[5];              // r[1] = r[1] DIV 256
      //     break;
      //   } else {
      //     // line 24
      //     r[5] = r[5] + 1;

      //   }
      // }
    }

    console.log('r3', r[3]);
    if (r[3] === r[0]) {
      break;
    }

    if (history[r[3]] === 2) {
      break;
    }
    history[r[3]] = (history[r[3]] || 0) +  1;

  }

  return r[3];
}

async function part1c() {
  const r = [0, 0, 0, 0, 0, 0];

  r[3] = 0;

  while (true) {
    r[1] = 0
    r[3] = 10373714;        // 100111100100101001010010

    while (true) {
      // line 8
      r[5] = r[1] & 255;      // r[5] contains lowest 8 bits of r[1]

      r[3] = r[3] + r[5];
      r[3] = r[3] & 16777215;
      r[3] = r[3] * 65899;
      r[3] = r[3] & 16777215;

      if (256 > r[1]) {
        // line 28
        break;
      }

    //   // line 17
    //   r[5] = 0;

    //   while(true) {
    //     //line 18

    //     // r[4] = r[5] + 1;
    //     // r[4] = r[4] * 256;

    //     r[4] = (r[5] + 1) * 256;
    //     if (r[4] > r[1]) {
    //       // line 23
    //       // line 26
    //       r[1] = r[5]
    //       break;
    //     } else {
    //       // line 24
    //       r[5] = r[5] + 1;

    //     }
    //   }
    }

    console.log(r[3]);
    break;
    if (r[3] === r[0]) {
      break;
    }
  }
}

async function part2(input: Input) {
}

module.exports = [
  part1b,
  part2
];
