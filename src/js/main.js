import './modules/setGrid.js';
import './modules/onResize.js';
import { createDesktop } from './modules/window.js';

window.addEventListener('DOMContentLoaded', () => {
  const loaidngBar = document.querySelector('.loading__bar');
  loaidngBar.classList.remove('on-load');
  loaidngBar.classList.add('loaded');
  createDesktop();
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 2000);
  // Utils
  // ---------------------------------
  // Modules
  // ---------------------------
  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {});
});
