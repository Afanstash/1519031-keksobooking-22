// модуль с утилитарными функциями

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

export {getRandomNumber};

const getRandomArrayElement = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
}

export {getRandomArrayElement};

function getArray(offerArray, n = 5) {
  return new Array(getRandomNumber(1, n)).fill(null).map(() => getRandomArrayElement(offerArray));
}

export {getArray};
