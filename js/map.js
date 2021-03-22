// import {similarData} from './data.js';//тестовые данные больше не нужны
import {createCustomPopup} from './popup.js';
import {setResetDataOnForm} from './form.js';
import {isEscEvent} from './util.js';

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
inputAddress.value = `${mainPinMarker.getLatLng().lat.toFixed(5)}, ${mainPinMarker.getLatLng().lng.toFixed(5)}`;
inputAddress.setAttribute('readonly', '');

mainPinMarker
  .on('moveend', (evt) => {
    const {lat, lng} = evt.target.getLatLng();
    inputAddress.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  });

// const points = similarData; //тестовые данные больше не нужны

fetch('https://22.javascript.pages.academy/keksobooking/data')
  .then((response) => response.json())
  // {
  //   if (response.ok) {
  //     response.json()
  //   } else {
  //     showAlert('Не удалось получить данные с сервера!');
  //   }
  // })
  // .catch(() => {
  //   showAlert('Не удалось получить данные с сервера!');
  // })
  .then((similarAds) => {
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
  });

const setUserFormSubmit = (onSuccess) => {
  adForm.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const formData = new FormData(evt.target);

    fetch(
      'https://22.javascript.pages.academy/keksobooking',
      {
        method: 'POST',
        body: formData,
      },
    )
    // .then(() => onSuccess());
      .then((response) => {
        if (response.ok) {
          onSuccess();
          mainPinMarker.setLatLng({lat: 35.6895, lng: 139.69171});
          inputAddress.value = `${mainPinMarker.getLatLng().lat.toFixed(5)}, ${mainPinMarker.getLatLng().lng.toFixed(5)}`;
        } else {
          const successPopupTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
          const errorButton = successPopupTemplate.querySelector('.error__button');
          const mainTagOnDocument = document.querySelector('main');
          mainTagOnDocument.append(successPopupTemplate);

          errorButton.addEventListener('click', (evt) => {
            if (evt.target) {
              successPopupTemplate.remove(successPopupTemplate);
            }
          });

          document.addEventListener('click', (evt) => {
            if (evt.target) {
              successPopupTemplate.remove(successPopupTemplate);
            }
          });

          document.addEventListener('keydown', (evt) => {
            if (isEscEvent(evt)) {
              successPopupTemplate.remove(successPopupTemplate);
            }
          });
        }
      });
    // .catch(() => {
    //   showAlert('Не удалось отправить форму. Попробуйте ещё раз');
    // });
  });
};

setUserFormSubmit(setResetDataOnForm);
