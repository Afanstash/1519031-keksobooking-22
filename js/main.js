//Точка входа. Модуль, который связывает другие модули

import {similarData} from './data.js';
// similarData;
// console.log(similarData);
window.application = {myVariable: similarData};// в консоли браузера доступно чрез запись: application.myVariable;
