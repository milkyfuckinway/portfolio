const setGrid = () => {
  const desktopWrapper = document.querySelector('.desktop__wrapper');
  const gridWidth = desktopWrapper.offsetWidth;
  if (gridWidth < 370) {
    const gridElementWidth = `${(gridWidth - 20 - 3 * 5) / 4}px`;
    document.documentElement.style.setProperty('--gridbox', `${gridElementWidth}`);
    document.documentElement.style.setProperty('--gridcount', `${4}`);
  }
  if (gridWidth > 371 && gridWidth < 500) {
    const gridElementWidth = `${(gridWidth - 20 - 4 * 5) / 5}px`;
    document.documentElement.style.setProperty('--gridbox', `${gridElementWidth}`);
    document.documentElement.style.setProperty('--gridcount', `${5}`);
  }
};

setGrid();

export { setGrid };
