const getData = (url, options, onSuccess, onFilters, onFail) => {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      // console.log(response);
      onSuccess(response);
      onFilters();
    })
    .catch(() => {
      onFail('Произошла ошибка при загрузке данных с сервера');
    });
};

export {getData};

// Пример
// const getUtcData = (callback) => {
//   const data = new Date().getUTCFullYear();
//   callback(data);
// };
// getUtcData((gg) => {
//   console.log(gg);
// });
// .then((response) => {
//         if (response.ok) {
//           onSuccess();
//         } else {
//           showAlert('Не удалось отправить форму. Попробуйте ещё раз');
//         }
//       })
//       .catch(() => {
//         showAlert('Не удалось отправить форму. Попробуйте ещё раз');
//       });
