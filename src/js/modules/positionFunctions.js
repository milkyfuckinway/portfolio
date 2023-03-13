const coefficientWidth = () => {
  if (window.innerWidth < 800) {
    return 0.9;
  } else {
    return 0.7;
  }
};

const coefficientHeight = () => {
  if (window.innerWidth < 800) {
    return 0.7;
  } else {
    return 0.8;
  }
};

const setSize = () => {
  document.documentElement.style.setProperty('--window-width', `${Math.ceil((window.innerWidth * coefficientWidth()) / 10) * 10}px`);
  document.documentElement.style.setProperty('--window-height', `${Math.ceil((window.innerHeight * coefficientHeight()) / 10) * 10}px`);
};

const setPosition = (elem) => {
  elem.style.left = `${Math.round(window.innerWidth / 2)}px`;
  elem.style.top = `${Math.round(window.innerHeight / 2)}px`;
};

export { setSize, setPosition };
