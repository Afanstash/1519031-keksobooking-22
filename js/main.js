// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function resultRandomInt(countMin, countMax) {
  let mathRandomInt = Math.random();
  let randomInt = Math.floor(mathRandomInt * (countMax - countMin +1)) + countMin;

  if (countMin < 0 || countMax < 0) {
    return 'Введите положительные числа!';
  }
  if (countMin > countMax) {
    return 'Неверно введён диапазон!';
  }
  if (countMin === countMax) {
    return countMin;
  }
  if (randomInt < countMin || randomInt > countMax) {
    mathRandomInt = Math.random();
    randomInt = Math.floor(mathRandomInt * (countMax - countMin +1)) + countMin;
  } else  return randomInt;
  // console.log(resultRandomInt(1, 4));
}

resultRandomInt(1, 4);

// https://qna.habr.com/q/159435
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
function resultRandomIntKeksobooking(countMin, countMax, n) {
  // countMin = parseInt(countMin * Math.pow(10, n)) / Math.pow(10, n);
  // countMax = parseInt(countMax * Math.pow(10, n)) / Math.pow(10, n);
  let mathRandomInt = Math.random();
  let randomInt = parseInt((mathRandomInt * (countMax - countMin +1) + countMin) * Math.pow(10, n)) / Math.pow(10, n);

  if (countMin < 0 || countMax < 0) {
    return 'Введите положительные числа!';
  } else if (countMin > countMax) {
    return 'Неверно введён диапазон!';
  } else if (countMin === countMax) {
    return countMin;
  } else if (randomInt < countMin || randomInt > countMax) {
    mathRandomInt = Math.random();
    randomInt = parseInt((mathRandomInt * (countMax - countMin +1) + countMin) * Math.pow(10, n)) / Math.pow(10, n);
  } else  return randomInt;
  // console.log(resultRandomIntKeksobooking(1, 4 , 2));
}
resultRandomIntKeksobooking(1.564239, 4.564239 , 2);

// function keksobooking(countMin, countMax, n) {
//   countMin = parseInt(countMin * Math.pow(10, n)) / Math.pow(10, n);
//   countMax = parseInt(countMax * Math.pow(10, n)) / Math.pow(10, n);
//   return 'count one: ' + countMin + ', count two: ' + countMax;
// }
