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

const getFilterCheckbox = (ad, featureName) => {
  return !(filterState[featureName] && !ad.offer.features.includes(featureName));
};

const getFilterSelectHousingType = (ad) => {
  return !(filterState.type && filterState.type !== 'any' && ad.offer.type !== filterState.type);
};

const getFilterSelectForNumber = (ad, keyName) => {
  return !(filterState[keyName] && filterState[keyName] !== 'any' && ad.offer[keyName] !== Number(filterState[keyName]));
};

const getFilterSelecthousingPrice = (ad) => {
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
  return true;
};

const getFiltration = (ad) => {
  return (getFilterCheckbox(ad, 'conditioner')
    && getFilterCheckbox(ad, 'elevator')
    && getFilterCheckbox(ad, 'washer')
    && getFilterCheckbox(ad, 'parking')
    && getFilterCheckbox(ad, 'dishwasher')
    && getFilterCheckbox(ad, 'wifi')
    && getFilterSelectHousingType(ad)
    && getFilterSelectForNumber(ad, 'guests')
    && getFilterSelectForNumber(ad, 'rooms')
    && getFilterSelecthousingPrice(ad));
};

const getFilter = () => {
  markers.forEach(marker => marker.remove());
  markers.length = 0;//очистили массив

  filteredData
    .filter(getFiltration)
    .slice(0, SIMILAR_ADS_COUNT)
    .forEach((point) => {
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

const resetFilter = () => {
  const mapCheckboxes = mapFilters.querySelectorAll('.map__checkbox');
  housingTypeSelect.value = housingTypeSelect.querySelector('[value="any"]').value;
  housingPriceSelect.value = housingPriceSelect.querySelector('[value="any"]').value;
  housingRoomsSelect.value = housingRoomsSelect.querySelector('[value="any"]').value;
  housingGuestsSelect.value = housingGuestsSelect.querySelector('[value="any"]').value;
  mapCheckboxes.forEach( checkbox => {
    checkbox.checked = false;
  });
  Object.keys(filterState)//вернули массив со всеми ключами
    .forEach( (key) => {
      filterState[key] = undefined;
    })
  debounced();
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
