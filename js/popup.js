import {similarData} from './data.js';

const place = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец',
};

const mapListElement = document.querySelector('#map-canvas');

const cardPopupTemplate = document.querySelector('#card').content.querySelector('.popup');

const cardData = similarData[0];

const cardElement = cardPopupTemplate.cloneNode(true);

cardElement.querySelector('.popup__title').textContent = cardData.offer.title;
cardElement.querySelector('.popup__text--address').textContent = cardData.offer.address;
cardElement.querySelector('.popup__text--price').textContent = `${cardData.offer.price} ₽/ночь`;
cardElement.querySelector('.popup__type').textContent = place[cardData.offer.type];
cardElement.querySelector('.popup__text--capacity').textContent = `${cardData.offer.rooms} комнаты для ${cardData.offer.guests} гостей`;
cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${cardData.offer.checkin}, выезд до ${cardData.offer.checkout}`;

// Доступные удобства

const cardFeatures = cardData.offer.features;
// console.log(cardFeatures);
// console.log('длина массива: ' + cardFeatures.length);
const popupFeatures = cardElement.querySelector('.popup__features');

// вариант 1
popupFeatures.innerHTML = '';
for (let i = 0; i < cardFeatures.length; i++) {
  const newFeaturesElement = document.createElement('li');
  newFeaturesElement.classList.add('popup__feature');
  const addClassFeature = `popup__feature--${cardFeatures[i]}`;
  newFeaturesElement.classList.add(addClassFeature);
  popupFeatures.appendChild(newFeaturesElement);
}

// вариант 2
// popupFeatures.innerHTML = '';
// cardFeatures.forEach(nameFeature => {
//   // console.log(nameFeature);
//   popupFeatures.innerHTML += `<li class="popup__feature popup__feature--${nameFeature}"></li>`;
// });

// Описание объекта недвижимости
cardElement.querySelector('.popup__description').textContent = cardData.offer.description;

const cardPhotos = cardData.offer.photos;
const popupPhotos = cardElement.querySelector('.popup__photos');

// Фотографии
// вариант 1
// const popupPhotosElement = popupPhotos.querySelector('.popup__photo');
// // console.log(popupPhotosElement);
// // console.log(cardPhotos);
// // console.log('длина массива: ' + cardPhotos.length);
// popupPhotosElement.src = cardPhotos[0];
// for (let i = 1; i < cardPhotos.length; i++) {
//   const clonedElement = popupPhotosElement.cloneNode(true);
//   clonedElement.src = cardPhotos[i];
//   popupPhotos.appendChild(clonedElement);
// }

// вариант 2
const popupPhotosElement = popupPhotos.querySelector('.popup__photo');
const mainClonedElement = popupPhotosElement.cloneNode(true);
popupPhotosElement.remove();//вызываем на элементе, который хотим удалить
for (let i = 0; i < cardPhotos.length; i++) {
  const clonedElement = mainClonedElement.cloneNode(true);
  clonedElement.src = cardPhotos[i];
  popupPhotos.appendChild(clonedElement);
}

// вариант 3
// popupPhotos.innerHTML = '';// очищаем div, используем в .forEach в данном случае//вызываем на родителе элементов, которые хотим удалить

// cardData.offer.photos.forEach(imgUrl => {
//   popupPhotos.innerHTML += `<img src="${imgUrl}" class="popup__photo" width="45" height="40" alt="Фотография жилья">`;
// });



cardElement.querySelector('.popup__avatar').src = cardData.author.avatar;

mapListElement.append(cardElement);
