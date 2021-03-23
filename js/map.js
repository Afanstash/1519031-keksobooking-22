// import {similarData} from './data.js';//тестовые данные больше не нужны
import {createCustomPopup} from './popup.js';
import {showAlert} from './util.js';
import {getData} from './api.js';

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
      adFormChild.removeAttribute('disabled');
    }

    mapFilters.classList.remove('map__filters--disabled');
    for (let mapFiltersChild of mapFiltersChildren) {
      mapFiltersChild.removeAttribute('disabled');
    }
  })
  .setView({
    lat: 35.6895,
    lng: 139.69171,
  }, 9);

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

const inputAddress = document.querySelector('#address');
inputAddress.setAttribute('readonly', '');

const setAddress = (latlng) => {
  const {lat, lng} = latlng.getLatLng();
  inputAddress.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

setAddress(mainPinMarker);

mainPinMarker
  .on('moveend', (evt) => {
    setAddress(evt.target);
  });

const resetMainPinMarker = () => {
  mainPinMarker.setLatLng({lat: 35.6895, lng: 139.69171});
  setAddress(mainPinMarker);
};

// const points = similarData; //тестовые данные больше не нужны
const onSuccess = (similarAds) => {
  // console.log(similarAds);
  similarAds.forEach((point) => {
    const icon = L.icon({
      iconUrl: 'img/pin.svg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    const marker = L.marker(
      {
        lat: point.location.lat,
        lng: point.location.lng,
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
};

const onFail = (errorMessage) => {
  showAlert(errorMessage);
  // console.warn(errorMessage);
};

getData('https://22.javascript.pages.academy/keksobooking/data', {}, onSuccess, onFail);

export {resetMainPinMarker};
