import { throttle } from './throttle.js';
import { isTouchDevice, deviceType, events } from './checkDeviceType.js';
import { setPosition, setSize } from './positionFunctions.js';

const createDesktop = () => {
  const template = document.querySelector('.template');
  const desktop = document.querySelector('.desktop');
  const desktopFooter = desktop.querySelector('.desktop__footer');
  const windowTemplate = template.querySelector('.window');
  const referenceTemplate = template.querySelector('.reference');
  const fileList = document.querySelectorAll('.file');

  const setIcon = (item) => {
    const textIconTemplate = template.querySelector('.file__icon--text');
    const linkIconTemplate = template.querySelector('.file__icon--link');
    const folderIconTemplate = template.querySelector('.file__icon--folder');

    if (item.classList.contains('file--text')) {
      return textIconTemplate;
    }
    if (item.classList.contains('file--link')) {
      return linkIconTemplate;
    }
    if (item.classList.contains('file--folder')) {
      return folderIconTemplate;
    }
  };

  fileList.forEach((file) => {
    const textIcon = setIcon(file).cloneNode(true);
    const fileLabel = file.querySelector('.file__label');
    const fileName = file.querySelector('.file__name');
    fileLabel.insertBefore(textIcon, fileName);
  });

  let initialIndex = 0;
  let initialX = 0;
  let initialY = 0;
  let lastReference;
  let moveElement = false;

  const setStartPosition = (elem) => {
    elem.classList.remove('window--collapsed');
    setSize();
    setPosition(elem);
  };

  const onFileOpen = (evt) => {
    evt.preventDefault();
    evt.target.classList.remove('file');
    evt.target.classList.add('file--opened');
    const fileLabel = evt.target.querySelector('.file__label');
    const fileName = evt.target.querySelector('.file__name');
    const fileIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    fileIcon.classList.remove('file__icon--desktop');
    const newWindow = windowTemplate.cloneNode(true);
    const newWindowPath = newWindow.querySelector('.window__path');
    const windowHeader = newWindow.querySelector('.window__header');
    const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
    const reference = referenceTemplate.cloneNode(true);
    newWindowPath.textContent = fileName.textContent;
    windowDraggableArea.insertBefore(fileIcon, newWindowPath);
    desktop.appendChild(newWindow);
    setStartPosition(newWindow);
    fileLabel.classList.add('file__label--active');
    const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
    newWindow.appendChild(clonedTargetContent);
    clonedTargetContent.classList.remove('visually-hidden');
    clonedTargetContent.classList.add('window__content');
    clonedTargetContent.classList.remove('file__content');

    if (evt.target.classList.contains('file--folder')) {
      clonedTargetContent.classList.add('grid--folder');
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
    };

    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    referenceIcon.classList.remove('file__icon--desktop');
    const referenceText = reference.querySelector('.reference__text');
    referenceText.textContent = fileName.textContent;
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);

    newWindow.addEventListener(events[deviceType].down, (e) => {
      if (e.target.closest('[data-draggable-area]')) {
        onWindowDrag(e);
      }
      if (e.target.closest('.window')) {
        setCurrentWindowActive();
      }
    });

    newWindow.addEventListener(events[deviceType].click, (e) => {
      if (e.target.closest('[data-button-collapse]')) {
        onCollapseButton();
      }
      if (e.target.closest('[data-button-close]')) {
        onCloseButton();
      }
      if (e.target.closest('[data-button-expand]')) {
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
};
export { createDesktop };
