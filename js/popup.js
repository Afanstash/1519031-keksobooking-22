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
cardElement.querySelector('.popup__features').textContent = cardData.offer.features.join(', ');
cardElement.querySelector('.popup__description').textContent = cardData.offer.description;
const cardPhotos = cardData.offer.photos;
const popupPhotos = cardElement.querySelector('.popup__photos');
const popupPhotosElement = popupPhotos.querySelector('.popup__photo');
// console.log(popupPhotosElement);
// console.log(cardPhotos);
// console.log('длина массива: ' + cardPhotos.length);
popupPhotosElement.src = cardPhotos[0];
for (let i = 1; i < cardPhotos.length; i++) {
  const clonedElement = popupPhotosElement.cloneNode(true);
  clonedElement.src = cardPhotos[i];
  popupPhotos.appendChild(clonedElement);
}

cardElement.querySelector('.popup__avatar').src = cardData.author.avatar;

mapListElement.append(cardElement);
