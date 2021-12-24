type Packet = {
  version: number;
  type: number;
  literal?: number;
  subPackets?: Packet[];
}

class Bits {
  constructor(public bits: number[]) {}

  readBitsAsNumber(count: number): number {
    const curr = parseInt(this.bits.slice(0, count).map(String).join(''), 2);
    this.bits = this.bits.slice(count);
    return curr;
  }

  readBitsAsBitArray(count: number): number[] {
    const curr = this.bits.slice(0, count);
    this.bits = this.bits.slice(count);
    return curr;
  }
}

function part1(input: number[]): number {
  console.log(input);

  const [packet, remainder] = parsePacket(input);
  console.log(packet);
  return sumVersions(packet);
}

function part2(input: number[]): number {
  const [packet, remainder] = parsePacket(input);

  return evalPacket(packet);
}

function hex2bin(hex: string): string {
  return (parseInt(hex, 16).toString(2)).padStart(4, '0');
}

function parseInput(input: string): number[] {
  const retval = [];
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const bin = hex2bin(char);
    retval.push(...bin.split('').map(Number));
  }

  return retval;
}

function sumVersions(packet: Packet): number {
  if (packet.type === 4) {
    return packet.version;
  } else if (packet.subPackets) {
    return packet.version + packet.subPackets.reduce((acc, subPacket) => acc + sumVersions(subPacket), 0);
  }
  return 0;
}

function parsePacket(input: number[]): [Packet, number[]] {
  const bits = new Bits(input);
  const version = bits.readBitsAsNumber(3);
  const type = bits.readBitsAsNumber(3);
  if (type === 4) {
    const literalArr = [];
    let group;
    do {
      group = bits.readBitsAsBitArray(5);
      literalArr.push(...group.slice(1));
    } while(group[0] === 1);
    return [{
      version,
      type,
      literal: parseInt(literalArr.map(String).join(''), 2),
    }, bits.bits];
  } else {
    const lengthType = bits.readBitsAsNumber(1);
    if (lengthType === 0) {
      const bitlength = bits.readBitsAsNumber(15);
      const subPackets = [];
      let subpacketbits = bits.readBitsAsBitArray(bitlength);
      do {
        const [subpacket, rest] = parsePacket(subpacketbits);
        subPackets.push(subpacket);
        subpacketbits = rest;
      } while (subpacketbits.length > 0);
      return [{
        version,
        type,
        subPackets,
      }, bits.bits];
    } else {
      const packetCount = bits.readBitsAsNumber(11);
      const subPackets = [];
      let subpacketbits = bits.bits;
      for (let i = 0; i < packetCount; i++) {
        const [subpacket, rest] = parsePacket(subpacketbits);
        subPackets.push(subpacket);
        subpacketbits = rest;
      }
      return [{
        version,
        type,
        subPackets,
      }, subpacketbits];
    }
  }
}

function evalPacket(packet: Packet): number {
  const { type, subPackets, literal } = packet;
  if (type === 0) {
    // sum
    return subPackets!.reduce((acc, subpacket) => acc + evalPacket(subpacket), 0);
  } else if (type === 1) {
    // product
    return subPackets!.reduce((acc, subpacket) => acc * evalPacket(subpacket), 1);
  } else if (type === 2) {
    // min
    return subPackets!.reduce((acc, subpacket) => Math.min(acc, evalPacket(subpacket)), Infinity);
  } else if (type === 3) {
    // max
    return subPackets!.reduce((acc, subpacket) => Math.max(acc, evalPacket(subpacket)), -Infinity);
  } else if (type === 4) {
    return literal!;
  } else if (type === 5) {
    // greater than
    return evalPacket(subPackets![0]) > evalPacket(subPackets![1]) ? 1 : 0;
  } else if (type === 6) {
    // less than
    return evalPacket(subPackets![0]) < evalPacket(subPackets![1]) ? 1 : 0;
  } else if (type === 7) {
    // equal
    return evalPacket(subPackets![0]) === evalPacket(subPackets![1]) ? 1 : 0;
  }
  // should never happen
  console.log('Unknown type', type);
  return 0
}

async function main(): Promise<void> {
  const [part, inputFile] = Deno.args;
  const inputString = await Deno.readTextFile(inputFile);

  if (part === '1') {
    console.log(part1(parseInput(inputString.trim())));
  } else if (part === '2') {
    console.log(part2(parseInput(inputString.trim())));
  }
}

await main();
