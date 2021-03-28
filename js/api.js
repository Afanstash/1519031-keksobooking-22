const fetchData = (url, options, onSuccess, onFail) => {
  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      onSuccess(response);
    })
    .catch(() => {
      onFail('Произошла ошибка при загрузке данных с сервера');
    });
};

export {fetchData};
