// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// https://qna.habr.com/q/159435
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/min

function getRandomNumber(countMin, countMax, n = 0) {
  let minNumber = Math.min(countMin, countMax);
  let maxNumber = Math.max(countMin, countMax);
  let mathRandomNumber = Math.random();
  let randomNumber = parseInt((mathRandomNumber * (maxNumber - minNumber + 1) + minNumber) * Math.pow(10, n)) / Math.pow(10, n);

  if (minNumber < 0 || maxNumber < 0) {
    return 'Введите положительные числа!';
  }
  if (minNumber === maxNumber) {
    return minNumber;
  }
  while (randomNumber < minNumber || randomNumber > maxNumber) {
    mathRandomNumber = Math.random();
    randomNumber = parseInt((mathRandomNumber * (maxNumber - minNumber + 1) + minNumber) * Math.pow(10, n)) / Math.pow(10, n);
  }
  return randomNumber;
}
getRandomNumber(1.564239, 4.564239, 2);
