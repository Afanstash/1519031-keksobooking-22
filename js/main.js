// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// https://qna.habr.com/q/159435
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseFloat
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/parseInt
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/pow
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/min
// https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed

function getRandomNumber(countMin, countMax, n = 0) {
  const minNumber = Math.min(countMin, countMax);
  const maxNumber = Math.max(countMin, countMax);
  const randomNumber = parseFloat((Math.random() * (maxNumber - minNumber) + minNumber).toFixed(n));
  // const randomNumber = +(Math.random() * (maxNumber - minNumber) + minNumber).toFixed(n);
  // const randomNumber = parseInt((Math.random() * (maxNumber - minNumber) + minNumber) * Math.pow(10, n)) / Math.pow(10, n);

  if (minNumber < 0 || maxNumber < 0) {
    return NaN;
  }
  if (minNumber === maxNumber) {
    return minNumber;
  }
  return randomNumber;
}
getRandomNumber(1.564239, 4.564239, 2);
