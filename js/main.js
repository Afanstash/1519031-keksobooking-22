// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// https://qna.habr.com/q/159435
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/min

function getRandomNumber(countMin, countMax, n) {
  let minInt = Math.min(countMin, countMax);
  let maxInt = Math.max(countMin, countMax);
  let mathRandomNumber = Math.random();
  let randomNumber = parseInt((mathRandomNumber * (maxInt - minInt + 1) + minInt) * Math.pow(10, n)) / Math.pow(10, n);

  if (minInt < 0 || maxInt < 0) {
    return 'Введите положительные числа!';
  }
  if (minInt === maxInt) {
    return minInt;
  }
  while (randomNumber < minInt || randomNumber > maxInt) {
    mathRandomNumber = Math.random();
    randomNumber = parseInt((mathRandomNumber * (maxInt - minInt + 1) + minInt) * Math.pow(10, n)) / Math.pow(10, n);
  }
  return randomNumber;
}
getRandomNumber(1.564239, 4.564239, 2);
