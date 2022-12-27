import { throttle } from './throttle.js';

const setGrid = () => {
  const desktopWrapper = document.querySelector('.desktop__wrapper');
  const gridWidth = desktopWrapper.offsetWidth;
  if (gridWidth < 370) {
    const gridElementWidth = `${(gridWidth - 20 - 3 * 5) / 4}px`;
    desktopWrapper.style.gridTemplateColumns = `repeat(4, ${gridElementWidth})`;
    desktopWrapper.style.gridTemplateRows = `repeat(auto-fill, ${gridElementWidth})`;
  }
  if (gridWidth > 371 && gridWidth < 501) {
    const gridElementWidth = `${(gridWidth - 20 - 4 * 5) / 5}px`;
    desktopWrapper.style.gridTemplateColumns = `repeat(5, ${gridElementWidth})`;
    desktopWrapper.style.gridTemplateRows = `repeat(auto-fill, ${gridElementWidth})`;
  }
  if (gridWidth > 501) {
    desktopWrapper.style.gridTemplateColumns = '';
    desktopWrapper.style.gridTemplateRows = '';
  }
};

setGrid();

window.addEventListener('resize', throttle(setGrid, 100));
