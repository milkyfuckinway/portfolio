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

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${desktop.offsetWidth / 2 /* + initialWindowCounterHorisontal*/}px`;
  elem.style.top = `${desktop.offsetHeight / 2 /* +  initialWindowCounterVertical*/}px`;
  elem.style.transform = 'translate(-50%, -50%)';
};

const setCurrentWindowActive = (win, ref) => {
  lastFile = ref;
  const newzIndex = initialzIndex + 1;
  win.style.zIndex = `${newzIndex}`;
  initialzIndex = newzIndex;
  const allWindows = desktop.querySelectorAll('.window');
  allWindows.forEach((c) => {
    c.classList.remove('window--active');
  });
  win.classList.add('window--active');
};

const setCurrentReferenceActive = (ref) => {
  const allReferences = desktop.querySelectorAll('.reference');
  allReferences.forEach((b) => {
    b.classList.remove('reference--active');
  });
  ref.classList.add('reference--active');
};

fileList.forEach((item) => {
  function onFileOpen(evt) {
    evt.target.removeEventListener(events[deviceType].click, onFileOpen);
    const fileName = evt.target.querySelector('.file__name');
    const pathIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    const newWindow = windowTemplate.cloneNode(true);
    const newWindowPath = newWindow.querySelector('.window__path');
    const windowDraggableArea = newWindow.querySelector('.window__draggable-area');
    const reference = referenceTemplate.cloneNode(true);
    const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    newWindowPath.textContent = fileName.textContent;
    windowDraggableArea.insertBefore(pathIcon, newWindowPath);
    desktop.appendChild(newWindow);
    setStartPosition(newWindow);
    setCurrentWindowActive(newWindow, reference);
    setCurrentReferenceActive(reference);

    const onMoveEvent = (e) => {
      const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      newWindow.style.left = `${newWindow.offsetLeft - (initialX - newX)}px`;
      newWindow.style.top = `${newWindow.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    };

    const onMoveStop = () => {
      document.removeEventListener(events[deviceType].move, onMoveEvent);
    };

    const onWindowDrag = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (!newWindow.classList.contains('window--fullscreen')) {
        initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        document.addEventListener(events[deviceType].move, onMoveEvent);
        document.addEventListener(events[deviceType].up, onMoveStop);
      }
    };

    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
    newWindow.addEventListener(events[deviceType].down, () => {
      setCurrentWindowActive(newWindow, reference);
      setCurrentReferenceActive(reference);
    });

    const onCollapseButton = () => {
      setCurrentReferenceActive(reference);
      if (newWindow.classList.contains('window--collapsed')) {
        newWindow.classList.remove('window--collapsed');
        setCurrentWindowActive(newWindow, reference);
      } else {
        if (reference === lastFile) {
          newWindow.classList.add('window--collapsed');
        } else {
          setCurrentWindowActive(newWindow, reference);
        }
      }
    };

    const windowButtonCollapse = newWindow.querySelector('.window__button--collapse');
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);

    const onCloseButton = () => {
      newWindow.remove();
      pathIcon.remove();
      item.addEventListener(events[deviceType].click, onFileOpen);
      reference.remove();
      clonedTargetContent.remove();
      referenceIcon.remove();
    };

    const windowButtonClose = newWindow.querySelector('.window__button--close');
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);

    const onExpandButton = () => {
      if (newWindow.classList.contains('window--fullscreen')) {
        newWindow.classList.remove('window--fullscreen');
      } else {
        newWindow.classList.add('window--fullscreen');
      }
    };
    const windowButtonExpand = newWindow.querySelector('.window__button--expand');
    windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);

    /* apply content to the new window */
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
    /* create reference */
    const referenceText = reference.querySelector('.reference__text');
    referenceText.textContent = fileName.textContent;
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);
  }

  if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
    item.addEventListener(events[deviceType].click, onFileOpen);
  }
});
