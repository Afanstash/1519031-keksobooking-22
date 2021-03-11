// модуль, который отвечает за работу с формой
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
