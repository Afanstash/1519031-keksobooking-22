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
const fd = cardData.offer.photos;
const rr = cardElement.querySelector('.popup__photos');
for (let i = 0; i < fd.length; i++) {
  let clonedElement = rr.cloneNode(true);
  clonedElement.children[0].src = fd[i];
  rr.appendChild(clonedElement);
}


cardElement.querySelector('.popup__avatar').src = cardData.author.avatar;

mapListElement.append(cardElement);
