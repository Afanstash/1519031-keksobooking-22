/* global _:readonly */
/* global L:readonly */
import {createCustomPopup} from './popup.js';
import {showAlert} from './util.js';
import {fetchData} from './api.js';

const adForm = document.querySelector('.ad-form');
const adFormChildren = adForm.children;
const mapFilters  = document.querySelector('.map__filters ');
const mapFiltersChildren = mapFilters.children;
const inputAddress = document.querySelector('#address');

const housingTypeSelect = mapFilters.querySelector('#housing-type');
const housingPriceSelect = mapFilters.querySelector('#housing-price');
const housingRoomsSelect = mapFilters.querySelector('#housing-rooms');
const housingGuestsSelect = mapFilters.querySelector('#housing-guests');
const filterWifiSelect = mapFilters.querySelector('#filter-wifi');
const filterDishwasherSelect = mapFilters.querySelector('#filter-dishwasher');
const filterParkingSelect = mapFilters.querySelector('#filter-parking');
const filterWasherSelect = mapFilters.querySelector('#filter-washer');
const filterElevatorSelect = mapFilters.querySelector('#filter-elevator');
const filterConditionerSelect = mapFilters.querySelector('#filter-conditioner');
const SIMILAR_ADS_COUNT = 10;
const filteredData = [];
const filterState = {};//будем записывать текущее состояние всех select
const markers = [];
const RERENDER_DELAY = 500;
const debounced = _.debounce( () => {getFilter()}, RERENDER_DELAY);

const resetFilter = () => {
  const mapCheckboxs = mapFilters.querySelectorAll('.map__checkbox');
  housingTypeSelect.value = housingTypeSelect.querySelector('[value="any"]').value;
  housingPriceSelect.value = housingPriceSelect.querySelector('[value="any"]').value;
  housingRoomsSelect.value = housingRoomsSelect.querySelector('[value="any"]').value;
  housingGuestsSelect.value = housingGuestsSelect.querySelector('[value="any"]').value;
  // for (let i = 0; i < mapCheckbox.length; i++) {
  //   mapCheckbox[i].checked = false;
  // }
  mapCheckboxs.forEach( checkbox => {
    checkbox.checked = false;
  });
};

const coordinatesOfTheCenterCity = {
  lat: 35.6895,
  lng: 139.69171,
};

adForm.classList.add('ad-form--disabled');
for (let adFormChild of adFormChildren) {
  adFormChild.setAttribute('disabled', '');
}

mapFilters.classList.add('map__filters--disabled');
for (let mapFiltersChild of mapFiltersChildren) {
  mapFiltersChild.setAttribute('disabled', '');
}

const openFilters = () => {
  mapFilters.classList.remove('map__filters--disabled');
  for (let mapFiltersChild of mapFiltersChildren) {
    mapFiltersChild.removeAttribute('disabled');
  }
};

const map = L.map('map-canvas')
  .on('load', () => {

    adForm.classList.remove('ad-form--disabled');
    for (let adFormChild of adFormChildren) {
      adFormChild.removeAttribute('disabled');
    }
  })
  .setView(coordinatesOfTheCenterCity, 8);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const Marker = function (url, sizeX, sizeY, anchorX, anchorY) {
  this.iconUrl = url;
  this.iconSize = [sizeX, sizeY];
  this.iconAnchor = [anchorX, anchorY];
};
const mainPinIcon = L.icon(new Marker('img/main-pin.svg', 52, 52, 26, 52));


const mainPinMarker = L.marker(
  coordinatesOfTheCenterCity,
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);

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
  mainPinMarker.setLatLng(coordinatesOfTheCenterCity);
  setAddress(mainPinMarker);
};

const selectChangeHandler = (select, key, attribute) => {
  select.addEventListener('change', (evt) => {
    filterState[key] = evt.target[attribute];
    debounced();
  });
};

selectChangeHandler(housingTypeSelect, 'type', 'value');
selectChangeHandler(housingPriceSelect, 'price', 'value');
selectChangeHandler(housingRoomsSelect, 'rooms', 'value');
selectChangeHandler(housingGuestsSelect, 'guests', 'value');

selectChangeHandler(filterWifiSelect, 'wifi', 'checked');
selectChangeHandler(filterDishwasherSelect, 'dishwasher', 'checked');
selectChangeHandler(filterParkingSelect, 'parking', 'checked');
selectChangeHandler(filterWasherSelect, 'washer', 'checked');
selectChangeHandler(filterElevatorSelect, 'elevator', 'checked');
selectChangeHandler(filterConditionerSelect, 'conditioner', 'checked');


const getFilter = () => {
  markers.forEach(marker => marker.remove());
  markers.length = 0;//очистили массив

  filteredData.filter( ad => {
    if (filterState.conditioner && !ad.offer.features.includes('conditioner')) {
      return false;
    }
    if (filterState.elevator && !ad.offer.features.includes('elevator')) {
      return false;
    }
    if (filterState.washer && !ad.offer.features.includes('washer')) {
      return false;
    }
    if (filterState.parking && !ad.offer.features.includes('parking')) {
      return false;
    }
    if (filterState.dishwasher && !ad.offer.features.includes('dishwasher')) {
      return false;
    }
    if (filterState.wifi && !ad.offer.features.includes('wifi')) {
      return false;
    }
    if (filterState.guests && filterState.guests !== 'any') {
      if (ad.offer.guests !== Number(filterState.guests)) {
        return false;
      }
    }
    if (filterState.rooms && filterState.rooms !== 'any') {
      if (ad.offer.rooms !== Number(filterState.rooms)) {
        return false;
      }
    }
    if (filterState.price && filterState.price !== 'any') {
      if (filterState.price === 'high' && ad.offer.price <= 50000) {//можно писать 50_000 с нижним подчеркиванием для читаемости цифр
        return false;
      }
      if (filterState.price === 'middle' && (ad.offer.price < 10000 || ad.offer.price > 50000)) {
        return false;
      }
      if (filterState.price === 'low' && ad.offer.price > 10000) {
        return false;
      }
    }
    if (filterState.type && filterState.type !== 'any') {
      if (ad.offer.type !== filterState.type) {
        return false;
      }
    }
    return true;
  }).slice(0, SIMILAR_ADS_COUNT).forEach((point) => {
    const icon = L.icon(new Marker('img/pin.svg', 40, 40, 20, 40));

    const marker = L.marker(
      {
        lat: point.location.lat,
        lng: point.location.lng,
      },
      {
        icon,
      },
    );

    markers.push(marker);

    marker
      .addTo(map)
      .bindPopup(createCustomPopup(point),
        {
          keepInView: true,
        },
      );
  });
};

const onSuccess = (similarAds) => {
  filteredData.push(...similarAds);//в массив записали содержимое массива
  openFilters();
  debounced();
};

const onFail = (errorMessage) => {
  showAlert(errorMessage);
};

fetchData('https://22.javascript.pages.academy/keksobooking/data', {}, onSuccess, onFail);

export {resetMainPinMarker, resetFilter};
