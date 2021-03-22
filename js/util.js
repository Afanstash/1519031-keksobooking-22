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

const isEnterEvent = (evt) => {
  return evt.key === 'Enter';
};

const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 500;
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  // setTimeout(() => alertContainer.remove());
}

export {getArray, isEnterEvent, isEscEvent, showAlert};
