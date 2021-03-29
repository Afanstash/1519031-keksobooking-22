const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const fileChooserAvatar = document.querySelector('.ad-form__field input[type=file]');
const previewAvatar = document.querySelector('.ad-form-header__preview img');

const fileChooserHouse = document.querySelector('.ad-form__upload input[type=file]');
const previewHouse = document.querySelector('.ad-form__photo');
const newFoto = document.createElement('img');

previewHouse.style.textAlign = 'center';
previewHouse.style.display = 'flex';
previewHouse.style.alignItems = 'center';
previewHouse.style.padding = '0 15px';

newFoto.width = 40;
newFoto.height = 44;
newFoto.alt = 'Фото жилья';
previewHouse.appendChild(newFoto);

const inputChangeHandler = (fileChooser, foto) => {
  fileChooser.addEventListener('change', () => {
    const file = fileChooser.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => {
      return fileName.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        foto.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
};

inputChangeHandler(fileChooserHouse, newFoto);
inputChangeHandler(fileChooserAvatar, previewAvatar);

export {previewAvatar, newFoto};
