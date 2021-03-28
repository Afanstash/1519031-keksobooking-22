// модуль с утилитарными функциями
const isEnterEvent = (evt) => {
  return evt.key === 'Enter';
};

const isEscEvent = (evt) => {
  return evt.key === 'Escape' || evt.key === 'Esc';
};

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = 500;
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = 0;
  alertContainer.style.top = 0;
  alertContainer.style.right = 0;
  alertContainer.style.padding = '10px 3px';
  alertContainer.style.fontSize = '30px';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = 'red';

  alertContainer.textContent = message;

  document.body.append(alertContainer);
}

let popupTemplate;
// let errorButton;
const mainTagOnDocument = document.querySelector('main');


const onClick = (evt) => {
  if (evt.target) {
    closeMessage();
  }
};
const onKeydown = (evt) => {
  if (isEscEvent(evt)) {
    closeMessage();
  }
};

const closeMessage = () => {
  popupTemplate.remove();
  document.removeEventListener('click', onClick);
  document.removeEventListener('keydown', onKeydown);
};

const showErrorMessage = () => {
  popupTemplate = document.querySelector('#error').content.querySelector('.error').cloneNode(true);
  // errorButton = popupTemplate.querySelector('.error__button');
  mainTagOnDocument.append(popupTemplate);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);
}

const showSuccessMessage = () => {
  popupTemplate = document.querySelector('#success').content.querySelector('.success').cloneNode(true);
  mainTagOnDocument.append(popupTemplate);
  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeydown);
}

export {isEnterEvent, isEscEvent, showAlert, showErrorMessage, showSuccessMessage};
