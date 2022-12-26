// import { throttle } from './throttle.js';
import { events, isTouchDevice, deviceType } from './checkDeviceType.js';

isTouchDevice();

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const fileList = document.querySelectorAll('.file');
const referenceTemplate = template.querySelector('.reference');
let initialzIndex = 0;
let initialX = 0;
let initialY = 0;
let lastFile;
let moveElement = false;
let initialWindowCounterVertical = 0;
let initialWindowCounterHorisontal = 0;
let offsetVerticalCounter = 0;
let offsetHorisontalCounter = 0;

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${desktop.offsetWidth / 2 + initialWindowCounterHorisontal}px`;
  elem.style.top = `${desktop.offsetHeight / 2 + initialWindowCounterVertical}px`;
  elem.style.width = `${Math.round(window.innerWidth * 0.7)}px`;
  elem.style.height = `${Math.round(window.innerHeight * 0.7)}px`;
  if (initialWindowCounterHorisontal + (desktop.offsetWidth - elem.offsetWidth) / 2 + 10 + elem.offsetWidth >= desktop.offsetWidth) {
    initialWindowCounterHorisontal = 0;
    offsetHorisontalCounter = 0;
  } else {
    initialWindowCounterHorisontal += 10;
    offsetHorisontalCounter += 1;
  }
  if (initialWindowCounterVertical + (desktop.offsetHeight - elem.offsetHeight) / 2 + 30 + elem.offsetHeight >= desktop.offsetHeight) {
    initialWindowCounterVertical = 0;
    offsetVerticalCounter = 0;
  } else {
    initialWindowCounterVertical += 30;
    offsetVerticalCounter += 1;
  }
};

fileList.forEach((item) => {
  if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
    item.addEventListener(events[deviceType].click, onFileOpen);
  }
  function onFileOpen(evt) {
    evt.target.removeEventListener(events[deviceType].click, onFileOpen);
    const fileLabel = evt.target.querySelector('.file__label');
    const fileName = evt.target.querySelector('.file__name');
    const pathIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    const newWindow = windowTemplate.cloneNode(true);
    const newWindowPath = newWindow.querySelector('.window__path');
    const windowHeader = newWindow.querySelector('.window__header');
    const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
    const reference = referenceTemplate.cloneNode(true);
    const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    newWindowPath.textContent = fileName.textContent;
    windowDraggableArea.insertBefore(pathIcon, newWindowPath);
    desktop.appendChild(newWindow);
    setStartPosition(newWindow);
    fileLabel.classList.add('file__label--active');

    const setCurrentWindowActive = () => {
      lastFile = reference;
      const newzIndex = initialzIndex + 1;
      newWindow.style.zIndex = `${newzIndex}`;
      initialzIndex = newzIndex;
      desktop.querySelectorAll('.window--active').forEach((a) => {
        a.classList.remove('window--active');
      });
      newWindow.classList.add('window--active');
      desktop.querySelectorAll('.reference').forEach((b) => {
        if (b === lastFile) {
          b.classList.add('reference--active');
        } else {
          b.classList.remove('reference--active');
        }
      });
    };

    setCurrentWindowActive();

    const onMoveEvent = (e) => {
      if (moveElement === true) {
        const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        newWindow.style.left = `${newWindow.offsetLeft - (initialX - newX)}px`;
        newWindow.style.top = `${newWindow.offsetTop - (initialY - newY)}px`;
        initialX = newX;
        initialY = newY;
      }
    };

    const onMoveStop = () => {
      document.removeEventListener(events[deviceType].move, onMoveEvent);
      document.removeEventListener(events[deviceType].up, onMoveStop);
      moveElement = false;
    };

    function onWindowDrag(e) {
      setCurrentWindowActive(reference, newWindow);
      if (e.cancelable) {
        e.preventDefault();
      }
      if (!newWindow.classList.contains('window--fullscreen')) {
        moveElement = true;
        initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        document.addEventListener(events[deviceType].move, onMoveEvent);
        document.addEventListener(events[deviceType].up, onMoveStop);
      }
    }
    const onCollapseButton = () => {
      setCurrentWindowActive();
      if (newWindow.classList.contains('window--collapsed')) {
        newWindow.classList.remove('window--collapsed');
        setCurrentWindowActive();
      } else {
        if (reference === lastFile) {
          newWindow.classList.add('window--collapsed');
        } else {
          setCurrentWindowActive();
        }
      }
    };

    const onCloseButton = () => {
      setCurrentWindowActive();
      newWindow.remove();
      pathIcon.remove();
      item.addEventListener(events[deviceType].click, onFileOpen);
      reference.remove();
      clonedTargetContent.remove();
      referenceIcon.remove();
      fileLabel.classList.remove('file__label--active');
      if (offsetVerticalCounter > 0) {
        offsetVerticalCounter -= 1;
        initialWindowCounterVertical -= 30;
      }
      if (offsetHorisontalCounter > 0) {
        offsetHorisontalCounter -= 1;
        initialWindowCounterHorisontal -= 10;
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

    newWindow.addEventListener(events[deviceType].down, (e) => {
      if (e.target.closest('.window__draggable-area')) {
        onWindowDrag(e);
      }
      if (e.target.closest('.window__button--collapse')) {
        onCollapseButton();
      }
      if (e.target.closest('.window__button--close')) {
        onCloseButton();
      }
      if (e.target.closest('.window__button--expand')) {
        onExpandButton();
      }
      if (e.target.closest('.window__content')) {
        setCurrentWindowActive();
      }
    });

    newWindow.appendChild(clonedTargetContent);
    clonedTargetContent.classList.remove('visually-hidden');
    clonedTargetContent.classList.add('window__content');
    clonedTargetContent.classList.remove('file__content');
    if (evt.target.classList.contains('file--folder')) {
      const innerFiles = newWindow.querySelectorAll('.file');
      clonedTargetContent.classList.add('window__content--folder');
      innerFiles.forEach((file) => {
        file.addEventListener(events[deviceType].click, onFileOpen);
      });
    }

    const referenceText = reference.querySelector('.reference__text');
    referenceText.textContent = fileName.textContent;
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);
  }
});
