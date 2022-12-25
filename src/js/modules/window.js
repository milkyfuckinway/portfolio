import { throttle } from './throttle.js';
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
const setCurrentWindowActive = (ref, win, drag, collapse, close, expand) => {
  lastFile = ref;
  const newzIndex = initialzIndex + 1;
  win.style.zIndex = `${newzIndex}`;
  initialzIndex = newzIndex;
  win.classList.add('window--active');
  desktop.querySelectorAll('.window').forEach((a) => {
    a.classList.remove('window--active');
    a.querySelector('.window__draggable-area').removeEventListener(events[deviceType].down, drag);
    a.querySelector('.window__button--collapse').removeEventListener(events[deviceType].click, collapse);
    a.querySelector('.window__button--close').removeEventListener(events[deviceType].click, close);
    a.querySelector('.window__button--expand').removeEventListener(events[deviceType].click, expand);
    if (a === win) {
      a.classList.add('window--active');
      a.querySelector('.window__draggable-area').addEventListener(events[deviceType].down, drag);
      a.querySelector('.window__button--collapse').addEventListener(events[deviceType].click, collapse);
      a.querySelector('.window__button--close').addEventListener(events[deviceType].click, close);
      a.querySelector('.window__button--expand').addEventListener(events[deviceType].click, expand);
    }
  });
  desktop.querySelectorAll('.reference').forEach((b) => {
    if (b === lastFile) {
      b.classList.add('reference--active');
    } else {
      b.classList.remove('reference--active');
    }
  });
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
    setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);

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

    function onCollapseButton() {
      if (newWindow.classList.contains('window--collapsed')) {
        newWindow.classList.remove('window--collapsed');
        setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);
      } else {
        if (reference === lastFile) {
          newWindow.classList.add('window--collapsed');
        } else {
          setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);
        }
      }
    }

    function onCloseButton() {
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
    }

    function onExpandButton() {
      if (newWindow.classList.contains('window--fullscreen')) {
        newWindow.classList.remove('window--fullscreen');
      } else {
        newWindow.classList.add('window--fullscreen');
      }
    }

    newWindow.addEventListener(events[deviceType].up, () => {
      setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);
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
