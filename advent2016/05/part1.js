const crypto = require('crypto');

function md5(input) {
  return crypto.createHash('md5').update(input).digest("hex");
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
};

const prefix = 'reyedfim';

let i = 0;
let passwordx = '01234567';
let password  = '        ';
while(password.includes(' ')) {
  const hash = md5(prefix + i);
  if (hash.substr(0, 5) == '00000') {
    console.log('found', hash);
    const position = hash.substr(5, 1);
    if (position >= '0' && position < '8') {
      const index = parseInt(position);
      if (password.charAt(index) == ' ') {
        const code = hash.substr(6, 1);
        password = password.replaceAt(index, code);
        console.log('password updated', password);
      }
    }
  }
  i++;

  if (i % 100000 === 0) {
    console.log('checking', i);
  }
}

console.log(password);