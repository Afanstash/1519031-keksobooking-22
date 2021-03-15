import {similarData} from './data.js';
// console.log(similarData[0].location);
// console.log(similarData[0].location.x);


const place = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец',
};

const createCustomPopup = (cardData) => {
  // const mapListElement = document.querySelector('#map-canvas');
  const cardPopupTemplate = document.querySelector('#card').content.querySelector('.popup');
  // const cardData = similarData[0];
  const cardElement = cardPopupTemplate.cloneNode(true);
  cardElement.querySelector('.popup__title').textContent = cardData.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = cardData.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = `${cardData.offer.price} ₽/ночь`;
  cardElement.querySelector('.popup__type').textContent = place[cardData.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = `${cardData.offer.rooms} комнаты для ${cardData.offer.guests} гостей`;
  cardElement.querySelector('.popup__text--time').textContent = `Заезд после ${cardData.offer.checkin}, выезд до ${cardData.offer.checkout}`;

  // Доступные удобства
  const cardFeatures = cardData.offer.features;
  // console.log(cardFeatures.length);
  const popupFeatures = cardElement.querySelector('.popup__features');

  if (cardFeatures.length === 0) {
    popupFeatures.remove();
    // console.log('Удален элемент содержащий класс удобства (.popup__features)!');
  }

  popupFeatures.innerHTML = '';
  for (let i = 0; i < cardFeatures.length; i++) {
    const newFeaturesElement = document.createElement('li');
    newFeaturesElement.classList.add('popup__feature');
    const addClassFeature = `popup__feature--${cardFeatures[i]}`;
    newFeaturesElement.classList.add(addClassFeature);
    popupFeatures.appendChild(newFeaturesElement);
  }

  // Описание объекта недвижимости
  cardElement.querySelector('.popup__description').textContent = cardData.offer.description;
  const cardPhotos = cardData.offer.photos;
  const popupPhotos = cardElement.querySelector('.popup__photos');
  // Фотографии
  const popupPhotosElement = popupPhotos.querySelector('.popup__photo');
  const mainClonedElement = popupPhotosElement.cloneNode(true);
  popupPhotosElement.remove();//вызываем на элементе, который хотим удалить
  for (let i = 0; i < cardPhotos.length; i++) {
    const clonedElement = mainClonedElement.cloneNode(true);
    clonedElement.src = cardPhotos[i];
    popupPhotos.appendChild(clonedElement);
  }

  cardElement.querySelector('.popup__avatar').src = cardData.author.avatar;
  // mapListElement.append(cardElement);
  return cardElement;
};

const adForm = document.querySelector('.ad-form');
adForm.classList.add('ad-form--disabled');
const adFormChildren = adForm.children;
// console.log(adFormChildren);

for (let adFormChild of adFormChildren) {
  adFormChild.setAttribute('disabled', '');
}

const mapFilters  = document.querySelector('.map__filters ');
mapFilters.classList.add('map__filters--disabled');
const mapFiltersChildren = mapFilters.children;
// console.log(mapFiltersChildren);

for (let mapFiltersChild of mapFiltersChildren) {
  mapFiltersChild.setAttribute('disabled', '');
}

/* global L:readonly */
const map = L.map('map-canvas')
  .on('load', () => {
    // console.log('Карта инициализирована');

    adForm.classList.remove('ad-form--disabled');
    for (let adFormChild of adFormChildren) {
      adFormChild.removeAttribute('disabled', '');
    }

    mapFilters.classList.remove('map__filters--disabled');
    for (let mapFiltersChild of mapFiltersChildren) {
      mapFiltersChild.removeAttribute('disabled', '');
    }
  })
  .setView({
    lat: 35.6895,
    lng: 139.69171,
  }, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: 'img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  {
    lat: 35.6895,
    lng: 139.69171,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);
mainPinMarker.addTo(map);

mainPinMarker
  .on('moveend', (evt) => {
    const {lat, lng} = evt.target.getLatLng();
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  });

const points = similarData;
// console.log(points);

// points.forEach(({location}) => {
//   const icon = L.icon({
//     iconUrl: 'img/pin.svg',
//     iconSize: [40, 40],
//     iconAnchor: [20, 40],
//   });

//   const marker = L.marker(
//     {
//       lat: location.x,
//       lng: location.y,
//     },
//     {
//       icon,
//     },
//   );

//   marker
//     .addTo(map);
// });

points.forEach((point) => {
  const icon = L.icon({
    iconUrl: 'img/pin.svg',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  const marker = L.marker(
    {
      lat: point.location.x,
      lng: point.location.y,
    },
    {
      icon,
    },
  );

  marker
    .addTo(map)
    .bindPopup(createCustomPopup(point),
      {
        keepInView: true,
      },
    );
});
