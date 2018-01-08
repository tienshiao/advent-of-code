let a = 1;
let b = 57;             // 1: set b 57
let c = b;              // 2: set c b

if (a !== 0) {          // 3: jnz a 2
  b = b * 100;          // 5: mul b 100
  b = b - (-100000);    // 6: sub b -100000
  c = b;                // 7: set c b
  c = c - (-17000);     // 8: sub c -17000
}

// b = 105700
// c = 122700
console.log('b', b);
console.log('c', c);

let g = 0;
let h = 0;
let iterations = 0;
while(true) {
  let f = 1;            // 9: set f 1
  let d = 2;            // 10: set d 2

  do {
    let e = 2;          // 11: set e 2

    do {
      // g = d;            // 12: set g d
      // g = g * e;        // 13: mul g e
      // g = g - b;        // 14: sub g b
      // if (g === 0) {    // 15: jnz g 2
      //   f = 0;          // 16: set f 0
      // }
      if (d * e == b) {
        f = 0;
      }

      // e = e - (-1);     // 17: sub e -1
      e++;

      // g = e;            // 18: set g e
      // g = g - b;        // 19: sub g b
    } while (e != b);  // 20: jnz g -8
    //d = d - (-1);       // 21: sub d -1
    d++;

    // g = d;              // 22: set g d
    // g = g - b;          // 23: sub g b
  } while (d != b);    // 24: jnz g -13

  if (f === 0) {        // 25: jnz f 2
    // h = h - (-1);       // 26: sub h -1
    h++;
  }
  // g = b;                // 27: set g b
  // g = g - c;            // 28: sub g c
  if (b == c) {        // 29: jnz g 2
    break;              // 30: jnz 1 3
  } else {
    // b = b - (-17);      // 31: sub b -17
    b += 17;
  }

  console.log(b, h);
}                       // 32: jnz 1 -23

console.log(h);

