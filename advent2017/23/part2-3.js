let c = 122700;

function isPrime(x) {
  for (let i = 2; i < Math.sqrt(x); i++) {
    if (x % i === 0) {
      return false;
    }
  }
  return true;
}

let h = 0;
for (let b = 105700; b <= c; b += 17) {
  if (!isPrime(b)) {
    h++;
  }
}

console.log(h);