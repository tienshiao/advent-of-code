const input = '01110110101001000';
const targetLength = 35651584;


function reverseReplace(input) {
  return input.split('').map((bit) => {
    if (bit == '1') {
      return '0';
    } else {
      return '1';
    }
  }).reverse().join('');
}

function checksum(input) {
  let output = '';
  let i = 0;
  while (i < input.length) {
    const bit0 = input.charAt(i);
    const bit1 = input.charAt(i + 1);
    if (bit0 == bit1) {
      output += '1';
    } else {
      output += '0';
    }
    i += 2;
  }
  if (output.length % 2 === 0) {
    return checksum(output);
  } else {
    return output;
  }
}

let val = input;
while (val.length < targetLength) {
  val = val + '0' + reverseReplace(val);
  //console.log(val);
  console.log(val.length);
}

//console.log('dragon', val);

const truncated = val.substr(0, targetLength);

//console.log('truncated', truncated);

console.log('checksum', checksum(truncated));