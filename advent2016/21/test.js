function arrayRotate(arr, count) {
  count -= arr.length * Math.floor(count / arr.length);
  arr.push.apply(arr, arr.splice(0, count));
  return arr;
}


function rotate(s) {
  let working = s.split('');
  const index = working.indexOf('x');

  working = arrayRotate(working, -1);
  working = arrayRotate(working, -(index));
  if (index >= 4) {
    working = arrayRotate(working, -1);
  }
  console.log(index, s, working.join(''), working.indexOf('x'));
}

//rotate('01234567');
rotate('x0000000');
rotate('0x000000');
rotate('00x00000');
rotate('000x0000');
rotate('0000x000');
rotate('00000x00');
rotate('000000x0');
rotate('0000000x');