const input = 'nbysizxe';

function knotHash(input) {
  const listLength = 256;
  let list = [];
  const lengths = input.split('').map(n => n.charCodeAt(0)).concat([17, 31, 73, 47, 23]);

  for (let i = 0; i < listLength; i++) {
    list.push(i);
  }

  let pos = 0;
  let skip = 0;

  function splice(target, sub, pos) {
    for (let i = 0; i < sub.length; i++) {
      target[(pos + i) % target.length] = sub[i];
    }
  }

  for (let r = 0; r < 64; r++) {
    for (let i = 0; i < lengths.length; i++) {
      const length = lengths[i];

      let double = list.concat(list);
      const sublist = double.slice(pos, pos + length);
      const r_sublist = sublist.reverse();

      splice(list, r_sublist, pos);

      pos = (pos + length + skip) % list.length;
      skip++;

    }
  }

  const dense = [];
  for (let i = 0; i < 16; i++) {
    dense[i] = list[i * 16];
    for (let j = 1; j < 16; j++) {
      dense[i] = dense[i] ^ list[i * 16 + j];
    }
  }

  function d2h(d) {
    var s = (+d).toString(16);
    if(s.length < 2) {
        s = '0' + s;
    }
    return s;
  }

  return dense.map(n => d2h(n)).join('');
}

function hex2bin(hex) {
  let retval = '';
  const input = hex.split('');
  for(let i = 0; i < hex.length; i++) {
    const val = parseInt(input[i], 16);
    let s = val.toString(2);
    for (let j = s.length; j < 4; j++) {
      s = '0' + s;
    }
    retval += s;
  }

  return retval;
}

function count(bin) {
  const input = bin.split('');
  let total = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '1') {
      total++;
    }
  }
  return total;
}

let bits = 0;
for (let i = 0; i < 128; i++) {
  const val = input + '-' + i;
  console.log(val);
  const hash = knotHash(val);
  console.log(hash);
  const bin = hex2bin(hash);
  console.log(bin);
  bits += count(bin);
}

console.log(bits);
