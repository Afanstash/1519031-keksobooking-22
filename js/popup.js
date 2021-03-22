const place = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец',
};

const createCustomPopup = (cardData) => {
  // const mapListElement = document.querySelector('#map-canvas');
  const cardPopupTemplate = document.querySelector('#card').content.querySelector('.popup');
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

  // Фотографии
  const cardPhotos = cardData.offer.photos;
  const popupPhotos = cardElement.querySelector('.popup__photos');

  if (cardPhotos.length === 0) {
    popupPhotos.remove();
    // console.log('Удален элемент содержащий класс фото (.popup__photos)!');
  }

  const popupPhotosElement = popupPhotos.querySelector('.popup__photo');
  const mainClonedElement = popupPhotosElement.cloneNode(true);
  popupPhotosElement.remove();//вызываем на элементе, который хотим удалить
  for (let i = 0; i < cardPhotos.length; i++) {
    const clonedElement = mainClonedElement.cloneNode(true);
    clonedElement.src = cardPhotos[i];
    popupPhotos.appendChild(clonedElement);
  }



  // Аватар
  cardElement.querySelector('.popup__avatar').src = cardData.author.avatar;
  // mapListElement.append(cardElement);
  return cardElement;
};

export {createCustomPopup};

// данные с сервера
// author: Object { avatar: "img/avatars/default.png" }
// ​location: Object { lat: 35.411018333025694, lng: 139.96204376220706 }
// ​​
// offer: {…}
// ​address: "102-0094 Tōkyō-to, Chiyoda-ku, Kioichō, 3"
// ​​​checkin: "11:00"
// ​​​checkout: "10:00"
// ​​​description: "Один из лучших хостелов для душевного общения. Ужинаем вместе и играем в «Мафию» по вечерам, вкусно готовим. Ежедневная уборка, бесплатный Wi-Fi, чистое постельное белье."
// ​​​features: Array(6) [ "wifi", "dishwasher", "parking", … ]
// ​​​guests: 6
// ​​​photos: Array [ "https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/earvin-huang-a8danBUbgw0.jpg" ]
// ​​​price: 5000
// ​​​rooms: 3
// ​​​title: "Хостел «Для друзей»"
// ​​​type: "bungalow"
