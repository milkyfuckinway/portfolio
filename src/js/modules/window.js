import { throttle } from './throttle.js';
import { events, isTouchDevice, deviceType } from './checkDeviceType.js';

isTouchDevice();

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const referenceTemplate = template.querySelector('.reference');
const desktopWidth = desktop.offsetWidth;
const desktopHeight = desktop.offsetHeight;
const halfDesktopWidth = desktopWidth / 2;
const halfDesktopHeight = desktopHeight / 2;
const windowWidth = Math.round(window.innerWidth * 0.7);
const windowHeight = Math.round(window.innerHeight * 0.7);

let initialIndex = 0;
let initialX = 0;
let initialY = 0;
let lastReference;
let moveElement = false;
let initialWindowCounterVertical = 0;
let initialWindowCounterHorizontal = 0;
let offsetVerticalCounter = 0;
let offsetHorizontalCounter = 0;

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${halfDesktopWidth + initialWindowCounterHorizontal}px`;
  elem.style.top = `${halfDesktopHeight + initialWindowCounterVertical}px`;
  elem.style.width = `${windowWidth}px`;
  elem.style.height = `${windowHeight}px`;
  if (initialWindowCounterHorizontal + (desktopWidth - windowWidth) / 2 + 10 + windowWidth >= desktopWidth) {
    initialWindowCounterHorizontal = 0;
    offsetHorizontalCounter = 0;
  } else {
    initialWindowCounterHorizontal += 10;
    offsetHorizontalCounter += 1;
  }
  if (initialWindowCounterVertical + (desktopHeight - windowHeight) / 2 + 30 + windowHeight >= desktopHeight) {
    initialWindowCounterVertical = 0;
    offsetVerticalCounter = 0;
  } else {
    initialWindowCounterVertical += 30;
    offsetVerticalCounter += 1;
  }
};

const onFileOpen = (evt) => {
  evt.target.classList.remove('file');
  evt.target.classList.add('file--opened');
  const fileLabel = evt.target.querySelector('.file__label');
  const fileName = evt.target.querySelector('.file__name');
  const pathIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  const newWindow = windowTemplate.cloneNode(true);
  const newWindowPath = newWindow.querySelector('.window__path');
  const windowHeader = newWindow.querySelector('.window__header');
  const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
  const reference = referenceTemplate.cloneNode(true);
  newWindowPath.textContent = fileName.textContent;
  windowDraggableArea.insertBefore(pathIcon, newWindowPath);
  desktop.appendChild(newWindow);
  setStartPosition(newWindow);
  fileLabel.classList.add('file__label--active');
  const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
  newWindow.appendChild(clonedTargetContent);
  clonedTargetContent.classList.remove('visually-hidden');
  clonedTargetContent.classList.add('window__content');
  clonedTargetContent.classList.remove('file__content');
  if (evt.target.classList.contains('file--folder')) {
    clonedTargetContent.classList.add('window__content--folder');
  }

  const setCurrentWindowActive = () => {
    lastReference = reference;
    const newIndex = initialIndex + 1;
    newWindow.style.zIndex = `${newIndex}`;
    initialIndex = newIndex;
    reference.classList.add('reference--active');
    desktop.querySelectorAll('.window--active').forEach((a) => {
      a.classList.remove('window--active');
    });
    newWindow.classList.add('window--active');
    desktop.querySelectorAll('.reference').forEach((b) => {
      if (b === lastReference) {
        b.classList.add('reference--active');
      } else {
        b.classList.remove('reference--active');
      }
    });
  };

  setCurrentWindowActive();

  const onMoveEvent = (e) => {
    if (moveElement) {
      e.stopPropagation();
      const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      const calcX = initialX - newX;
      const calcY = initialY - newY;
      const leftPosition = `${newWindow.offsetLeft - calcX}px`;
      const topPosition = `${newWindow.offsetTop - calcY}px`;
      newWindow.style.left = leftPosition;
      newWindow.style.top = topPosition;
      initialX = newX;
      initialY = newY;
    }
  };

  const onMoveThrottled = throttle(onMoveEvent, 10);

  const onMoveStop = () => {
    document.removeEventListener(events[deviceType].move, onMoveThrottled);
    document.removeEventListener(events[deviceType].up, onMoveStop);
    moveElement = false;
  };

  const onWindowDrag = (e) => {
    setCurrentWindowActive();
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
    if (!newWindow.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveThrottled);
      document.addEventListener(events[deviceType].up, onMoveStop);
    }
  };

  const onCollapseButton = () => {
    if (newWindow.classList.contains('window--collapsed')) {
      newWindow.classList.remove('window--collapsed');
      setCurrentWindowActive();
    } else {
      if (reference === lastReference) {
        newWindow.classList.add('window--collapsed');
      } else {
        setCurrentWindowActive();
      }
    }
  };

  const onExpandButton = () => {
    setCurrentWindowActive(reference, newWindow);
    if (newWindow.classList.contains('window--fullscreen')) {
      newWindow.classList.remove('window--fullscreen');
    } else {
      newWindow.classList.add('window--fullscreen');
    }
  };

  const onCloseButton = () => {
    evt.target.classList.add('file');
    evt.target.classList.remove('file--opened');
    setCurrentWindowActive();
    newWindow.remove();
    reference.remove();
    fileLabel.classList.remove('file__label--active');
    if (offsetVerticalCounter > 0) {
      offsetVerticalCounter -= 1;
      initialWindowCounterVertical -= 30;
    }
    if (offsetHorizontalCounter > 0) {
      offsetHorizontalCounter -= 1;
      initialWindowCounterHorizontal -= 10;
    }
  };

  const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  const referenceText = reference.querySelector('.reference__text');
  referenceText.textContent = fileName.textContent;
  reference.insertBefore(referenceIcon, referenceText);
  desktopFooter.appendChild(reference);
  reference.addEventListener(events[deviceType].click, onCollapseButton);

  newWindow.addEventListener(events[deviceType].down, (e) => {
    if (e.target.closest('.window__draggable-area')) {
      onWindowDrag(e);
    }
    if (e.target.closest('.window__content')) {
      setCurrentWindowActive();
    }
  });

  newWindow.addEventListener(events[deviceType].click, (e) => {
    if (e.target.closest('.window__button--collapse')) {
      onCollapseButton();
    }
    if (e.target.closest('.window__button--close')) {
      onCloseButton();
    }
    if (e.target.closest('.window__button--expand')) {
      onExpandButton();
    }
  });
};

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

desktop.addEventListener(events[deviceType].click, (evt) => {
  if (evt.target.closest('.file') && !evt.target.closest('.file--link')) {
    onFileOpen(evt);
  }
});
