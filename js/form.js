// модуль, который отвечает за работу с формой
import {isEnterEvent, isEscEvent} from './util.js';

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
// const option = type.querySelector('option');

const priceInput = form.querySelector('#price');

// console.log(type.value);
priceInput.placeholder = minPrice[type.value];
priceInput.min = minPrice[type.value];
// console.log(priceInput.value);

type.addEventListener('change', function () {
  // console.log('Цель достигнута!');
  priceInput.placeholder = minPrice[type.value];
  priceInput.min = minPrice[type.value];
  priceInput.value = '';
  // console.log(type.value + ' цена от:' + priceInput.placeholder);
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

// titleInput.addEventListener('invalid', () => {
//   if (titleInput.validity.tooShort) {
//     titleInput.setCustomValidity('Имя должно состоять минимум из 30-ти символов');
//   } else if (titleInput.validity.tooLong) {
//     titleInput.setCustomValidity('Имя не должно превышать 100 символов');
//   } else if (titleInput.validity.valueMissing) {
//     titleInput.setCustomValidity('Обязательное поле');
//   } else {
//     titleInput.setCustomValidity('');
//   }
// });

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

priceInput.addEventListener('invalid', () => {
  if (priceInput.validity.badInput) {
    priceInput.setCustomValidity('Введите число');
  }
  // if (priceInput.validity.rangeUnderflow) {
  //   console.log(priceInput.validity);
  //   priceInput.setCustomValidity('Цена за ночь должна быть не менее ' + priceInput.min + 'руб.');
  // } //почему этот код не нужен?
  if (priceInput.validity.rangeOverflow) {
    priceInput.setCustomValidity('Цена за ночь не должна превышать 1 000 000 руб.');
  }
  if (priceInput.validity.valueMissing) {
    priceInput.setCustomValidity('Обязательное поле');
  }
  priceInput.setCustomValidity('');
  // console.log(priceInput.validity);
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


const setResetDataOnForm = () => {
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

  // console.log('success!!!!!');

  const successPopupTemplate = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
  const mainTagOnDocument = document.querySelector('main');
  mainTagOnDocument.append(successPopupTemplate);

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
};

const formResetButton = form.querySelector('.ad-form__reset');
formResetButton.addEventListener('click', setResetDataOnForm);
formResetButton.addEventListener('keydown', (evt) => {
  if (isEnterEvent(evt)) {
    setResetDataOnForm();// строка 142-156, нужно вынести отдельно. как лучше это сделать?
  }
});

export {setResetDataOnForm};
