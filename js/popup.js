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
  const popupFeatures = cardElement.querySelector('.popup__features');

  if (cardFeatures.length === 0) {
    popupFeatures.remove();
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
  return cardElement;
};

export {createCustomPopup};
