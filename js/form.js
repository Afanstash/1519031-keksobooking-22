// модуль, который отвечает за работу с формой
import {showErrorMessage, showSuccessMessage} from './util.js';
import {resetMainPinMarker} from './map.js';
import {getData} from './api.js';
import {previewAvatar, newFoto} from './foto.js';

const minPrice = {
  'flat': 1000,
  'bungalow': 0,
  'house': 5000,
  'palace': 10000,
};
// Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»:
// «Бунгало» — минимальная цена за ночь 0;
// «Квартира» — минимальная цена за ночь 1 000;
// «Дом» — минимальная цена 5 000;
// «Дворец» — минимальная цена 10 000.
const form = document.querySelector('.ad-form');
const type = form.querySelector('#type');

const priceInput = form.querySelector('#price');
priceInput.placeholder = minPrice[type.value];
priceInput.min = minPrice[type.value];

type.addEventListener('change', function () {
  // console.log('Цель достигнута!');
  priceInput.placeholder = minPrice[type.value];
  priceInput.min = minPrice[type.value];
  priceInput.value = '';
});

//Поля «Время заезда» и «Время выезда» синхронизированы:
//при изменении значения одного поля во втором выделяется соответствующее ему значение.
//Например, если время заезда указано «после 14», то время выезда будет равно «до 14» и наоборот.
const timeIn = form.querySelector('#timein');
const timeOut = form.querySelector('#timeout');

timeIn.addEventListener('change', function () {
  timeOut.value = timeIn.value;
});

timeOut.addEventListener('change', function () {
  timeIn.value = timeOut.value;
});

const titleInput = form.querySelector('#title');

const MIN_NAME_LENGTH = 30;
const MAX_NAME_LENGTH = 100;

titleInput.addEventListener('input', () => {
  const valueLength = titleInput.value.length;

  if (valueLength < MIN_NAME_LENGTH) {
    titleInput.setCustomValidity('Ещё ' + (MIN_NAME_LENGTH - valueLength) +' симв.');
  } else if (valueLength > MAX_NAME_LENGTH) {
    titleInput.setCustomValidity('Удалите лишние ' + (valueLength - MAX_NAME_LENGTH) +' симв.');
  } else {
    titleInput.setCustomValidity('');
  }
  titleInput.reportValidity();
});

priceInput.addEventListener('input', () => {
  priceInput.setCustomValidity('');
});

priceInput.addEventListener('invalid', () => {
  if (priceInput.validity.badInput) {
    priceInput.setCustomValidity('Введите число');
    return;
  }
  if (priceInput.validity.rangeUnderflow) {
    priceInput.setCustomValidity('Цена за ночь должна быть не менее ' + priceInput.min + 'руб.');
    return;
  }
  if (priceInput.validity.rangeOverflow) {
    priceInput.setCustomValidity('Цена за ночь не должна превышать 1 000 000 руб.');
    return;
  }
  if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле');
    return;
  }
  priceInput.setCustomValidity('');
});


const roomNumberSelect = form.querySelector('#room_number');

const capacitySelect = form.querySelector('#capacity');
const capacitySelectChildren = capacitySelect.children;

const checkRoomNumber = () => {
  const roomNumber = Number(roomNumberSelect.value);// числовой формат из цифр, которые в были строкой
  for (let capacitySelectChild of capacitySelectChildren) {
    capacitySelectChild.setAttribute('disabled', '');
    capacitySelectChild.removeAttribute('selected');
  }
  if (roomNumber === 100) {
    capacitySelect.querySelector('[value="0"]').removeAttribute('disabled');
  } else {
    for (let capacitySelectChild of capacitySelectChildren) {
      if (Number(capacitySelectChild.value) > 0 && Number(capacitySelectChild.value) <= roomNumber) {
        capacitySelectChild.removeAttribute('disabled');
      }
    }
  }
  capacitySelect.value = capacitySelect.querySelector('option:not(:disabled)').value;
}
checkRoomNumber();

roomNumberSelect.addEventListener('change', checkRoomNumber);

const resetForm = () => {
  titleInput.value = '';
  priceInput.value = '';
  type.value = type.querySelector('[value="flat"]').value;
  priceInput.placeholder = minPrice[type.value];
  timeIn.value = timeIn.querySelector('[value="12:00"]').value;
  timeOut.value = timeOut.querySelector('[value="12:00"]').value;
  const descriptionTextarea = form.querySelector('#description');
  descriptionTextarea.value = '';
  roomNumberSelect.value = roomNumberSelect.querySelector('[value="1"]').value;
  checkRoomNumber();
  const featuresCheckbox = form.querySelectorAll('.feature__checkbox');
  for (let i = 0; i < featuresCheckbox.length; i++) {
    featuresCheckbox[i].checked = false;
  }
  previewAvatar.src = 'img/muffin-grey.svg';
  newFoto.src = '';
};

const formResetButton = form.querySelector('.ad-form__reset');
formResetButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  resetForm();
  resetMainPinMarker();
});

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const formData = new FormData(evt.target);

  getData('https://22.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body: formData,
    }, () => {
      showSuccessMessage();
      resetForm();
      resetMainPinMarker();
    }, showErrorMessage);
});
