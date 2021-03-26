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

const openFilters = () => {
  mapFilters.classList.remove('map__filters--disabled');
  for (let mapFiltersChild of mapFiltersChildren) {
    mapFiltersChild.removeAttribute('disabled');
  }
};



// const setHousingTypeClick = () => {
//   housingTypeSelect.addEventListener('change', () => {
//     const currentHousingType = housingTypeSelect.value;
//     // return currentHousingType;
//     // console.log(currentHousingType);
//   });
// };

// const getAdRank = (ad) => {

//   let rank = 0;

//   if (ad.offer.type === housingTypeSelect.value) {
//     rank += 2;
//     console.log(rank);
//     console.log(ad.offer.type);
//     console.log(housingTypeSelect.value);
//   } else {
//     rank += 1;
//   }
//   return rank;
// };

// const sortAds = (adA, adB) => {
//   const rankA = getAdRank(adA);
//   const rankB = getAdRank(adB);

//   return rankB - rankA;
// }

/* global L:readonly */
const map = L.map('map-canvas')
  .on('load', () => {
    // console.log('Карта инициализирована');

    adForm.classList.remove('ad-form--disabled');
    for (let adFormChild of adFormChildren) {
      adFormChild.removeAttribute('disabled');
    }

    // mapFilters.classList.remove('map__filters--disabled');
    // for (let mapFiltersChild of mapFiltersChildren) {
    //   mapFiltersChild.removeAttribute('disabled');
    // }
  })
  .setView({
    lat: 35.6895,
    lng: 139.69171,
  }, 8);

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


const housingTypeSelect= mapFilters.querySelector('#housing-type');
const housingPriceSelect= mapFilters.querySelector('#housing-price');
const housingRoomsSelect= mapFilters.querySelector('#housing-rooms');
const housingGuestsSelect= mapFilters.querySelector('#housing-guests');
const filterWifiSelect= mapFilters.querySelector('#filter-wifi');
const filterDishwasherSelect= mapFilters.querySelector('#filter-dishwasher');
const filterParkingSelect= mapFilters.querySelector('#filter-parking');
const filterWasherSelect= mapFilters.querySelector('#filter-washer');
const filterElevatorSelect= mapFilters.querySelector('#filter-elevator');
const filterConditionerSelect= mapFilters.querySelector('#filter-conditioner');
const SIMILAR_ADS_COUNT = 10;//.slice(0, SIMILAR_ADS_COUNT)
const filteredData =[];
const filterState = {};//будем записывать текущее состояние всех select
const markers = [];

housingTypeSelect.addEventListener('change', () => {
  filterState.type = housingTypeSelect.value;
  filter();
});

housingPriceSelect.addEventListener('change', () => {
  filterState.price = housingPriceSelect.value;
  filter();
});

housingRoomsSelect.addEventListener('change', () => {
  filterState.rooms = housingRoomsSelect.value;
  filter();
});

housingGuestsSelect.addEventListener('change', () => {
  filterState.guests = housingGuestsSelect.value;
  filter();
});

filterWifiSelect.addEventListener('change', () => {
  filterState.wifi = filterWifiSelect.checked;
  filter();
});

filterDishwasherSelect.addEventListener('change', () => {
  filterState.dishwasher = filterDishwasherSelect.checked;
  filter();
});

filterParkingSelect.addEventListener('change', () => {
  filterState.parking = filterParkingSelect.checked;
  filter();
});

filterWasherSelect.addEventListener('change', () => {
  filterState.washer = filterWasherSelect.checked;
  filter();
});

filterElevatorSelect.addEventListener('change', () => {
  filterState.elevator = filterElevatorSelect.checked;
  filter();
});

filterConditionerSelect.addEventListener('change', () => {
  filterState.conditioner = filterConditionerSelect.checked;
  filter();
});

const filter = () => {
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
  // console.log(similarAds);
  //filteredData.push(similarAds);//в массив записали массив
  filteredData.push(...similarAds);//в массив записали содержимое массива
  filter();
  // console.log(similarAds);
  // const newAds = similarAds.filter( ad => ad.offer.type === 'house' );
  // const newAds = similarAds.filter( ad => {
  //   housingTypeSelect.addEventListener('change', () => {
  //     const currentHousingType = housingTypeSelect.value;
  //     if (ad.offer.type === currentHousingType) {
  //       console.log(currentHousingType);
  //     }
  //   });
  //   return true;
  // });
  // console.log(newAds);


};

const onFail = (errorMessage) => {
  showAlert(errorMessage);
  // console.warn(errorMessage);
};

getData('https://22.javascript.pages.academy/keksobooking/data', {}, onSuccess, openFilters, onFail);

export {resetMainPinMarker};
