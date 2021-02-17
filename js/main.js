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

const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
];

const times = [
  '12:00',
  '13:00',
  '14:00',
];

const offerFeatures = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner',
];

const offerPhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
];

const getRandomArrayElement = (elements) => {
  return elements[getRandomNumber(0, elements.length - 1)];
}

function createAuthor() {
  const randomType = '0' + getRandomNumber(0, 8);
  return {avatar: 'img/avatars/user' + randomType + '.png'};
}
createAuthor();

function createLocation() {
  const randomX = getRandomNumber(35.65000, 35.70000, 5);
  const randomY = getRandomNumber(139.70000, 139.80000, 5);
  return {
    x: randomX,
    y: randomY,
  };
}
createLocation();

function getArray(offerArray, n = 5) {
  return new Array(getRandomNumber(1, n)).fill(null).map(() => getRandomArrayElement(offerArray));
}

function newArrayFeatures () {
  let arrayFeatures = [];
  arrayFeatures[0] = getRandomArrayElement(offerFeatures);
  let i = 1;
  let j = getRandomNumber(1, offerFeatures.length);
  // console.log('Количество элементов в массиве должно быть: ' + j);
  while (i < j) {
    const newArrayElement = getRandomArrayElement(offerFeatures);
    // let newArrayElement = getRandomArrayElement(offerFeatures);//цикл каждый раз новый
    // const isExistsInArray = arrayFeatures.includes(newArrayElement);//если нашел, то true
    const isDoesNotExistsInArray = arrayFeatures.every((value) => {//если не нашел, то true
      return value !== newArrayElement;
    });
    // console.log(isDoesNotExistsInArray);
    if (isDoesNotExistsInArray) {
      arrayFeatures[i] = newArrayElement;
      i++;
      // console.log(arrayFeatures);
    }
  }
  // console.log('Итог: ' + arrayFeatures.join(', '));
  return arrayFeatures;
}
newArrayFeatures();


const createData = () => {
  const locationData = createLocation();
  const {x, y} = locationData;
  return {
    author: createAuthor(),
    offer: {
      title: 'Внимание! Супер предложение ^_~',
      address: `${x}, ${y}`,
      // address: x + ', ' + y,
      price: getRandomNumber(0, 100000, 2),
      type: getRandomArrayElement(TYPES),
      rooms: getRandomNumber(0, 10),
      guests: getRandomNumber(0, 20),
      checkin: getRandomArrayElement(times),
      checkout: getRandomArrayElement(times),
      features: newArrayFeatures(),
      description: 'Светлое, просторное.',
      photos: getArray(offerPhotos),
    },
    location: locationData,
  };
}
createData();

const SIMILAR_DATA_COUNT = 10;

const similarData = new Array(SIMILAR_DATA_COUNT).fill(null).map(() => createData());
// console.log(similarData);
similarData;
