import './modules/setGrid.js';
import './modules/onResize.js';
import { createDesktop } from './modules/window.js';

window.addEventListener('DOMContentLoaded', () => {
  const loaidngBar = document.querySelector('.loading__bar');
  loaidngBar.classList.remove('on-load');
  loaidngBar.classList.add('loaded');
  setTimeout(() => {
    document.querySelector('.loading').remove();
  }, 2000);
  createDesktop();
  // Utils
  // ---------------------------------
  // Modules
  // ---------------------------
  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {});
});

//# sourceMappingURL=main.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtYWluLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9tb2R1bGVzL3NldEdyaWQuanMnO1xyXG5pbXBvcnQgJy4vbW9kdWxlcy9vblJlc2l6ZS5qcyc7XHJcbmltcG9ydCB7IGNyZWF0ZURlc2t0b3AgfSBmcm9tICcuL21vZHVsZXMvd2luZG93LmpzJztcclxuXHJcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xyXG4gIGNvbnN0IGxvYWlkbmdCYXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubG9hZGluZ19fYmFyJyk7XHJcbiAgbG9haWRuZ0Jhci5jbGFzc0xpc3QucmVtb3ZlKCdvbi1sb2FkJyk7XHJcbiAgbG9haWRuZ0Jhci5jbGFzc0xpc3QuYWRkKCdsb2FkZWQnKTtcclxuICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5sb2FkaW5nJykucmVtb3ZlKCk7XHJcbiAgfSwgMjAwMCk7XHJcbiAgY3JlYXRlRGVza3RvcCgpO1xyXG4gIC8vIFV0aWxzXHJcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgLy8gTW9kdWxlc1xyXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gIC8vINCy0YHQtSDRgdC60YDQuNC/0YLRiyDQtNC+0LvQttC90Ysg0LHRi9GC0Ywg0LIg0L7QsdGA0LDQsdC+0YLRh9C40LrQtSAnRE9NQ29udGVudExvYWRlZCcsINC90L4g0L3QtSDQstGB0LUg0LIgJ2xvYWQnXHJcbiAgLy8g0LIgbG9hZCDRgdC70LXQtNGD0LXRgiDQtNC+0LHQsNCy0LjRgtGMINGB0LrRgNC40L/RgtGLLCDQvdC1INGD0YfQsNGB0YLQstGD0Y7RidC40LUg0LIg0YDQsNCx0L7RgtC1INC/0LXRgNCy0L7Qs9C+INGN0LrRgNCw0L3QsFxyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCkgPT4ge30pO1xyXG59KTtcclxuIl0sImZpbGUiOiJtYWluLmpzIn0=
