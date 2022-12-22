let deviceType = '';

const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    deviceType = 'touch';
    return true;
  } catch (err) {
    deviceType = 'mouse';
    return false;
  }
};

isTouchDevice();

const events = {
  mouse: {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
    click: 'click',
  },
  touch: {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
    click: 'click',
  },
};

let initialX = 0;
let initialY = 0;
let initialzIndex = 0;
let moveElement = false;

const template = document.querySelector('.template');
const referenceTemplate = template.querySelector('.reference');
const windowTemplate = template.querySelector('.window');
const destkop = document.querySelector('.desktop');
const desktopFooter = destkop.querySelector('.desktop__footer');

// const file = document.querySelector('.file');
// for (let i = 0; i < 100; i++) {
//   const fileClone = file.cloneNode(true);
//   document.querySelector('.desktop__wrapper').appendChild(fileClone);
// }

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = windowTemplate.cloneNode(true);
  const windowDraggableArea = window.querySelector('.window__draggable-area');
  const windowHeader = window.querySelector('.window__header');
  const windowPath = window.querySelector('.window__path');
  const windowButtonCollapse = window.querySelector('.window__button--collapse');
  const windowButtonExpand = window.querySelector('.window__button--expand');
  const windowButtonClose = window.querySelector('.window__button--close');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
  const fileName = item.querySelector('.file__name');
  const referenceText = reference.querySelector('.reference__text');
  const referenceIcon = item.querySelector('.file__icon').cloneNode(true);
  reference.insertBefore(referenceIcon, referenceText);
  const pathIcon = item.querySelector('.file__icon').cloneNode(true);

  if (windowPath) {
    windowDraggableArea.insertBefore(pathIcon, windowPath);
  }

  const placeOnTop = () => {
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    lastFile = reference;
    const windowHeaderList = destkop.querySelectorAll('.window__header');
    console.log(windowHeaderList);
    windowHeaderList.forEach((thing) => {
      thing.classList.remove('window__header--active');
    });
    windowHeader.classList.add('window__header--active');
  };

  const setActive = () => {
    const referenceList = document.querySelectorAll('.reference');
    referenceList.forEach((refernce) => {
      refernce.classList.remove('reference--active');
    });
    reference.classList.add('reference--active');
  };

  const onCollapseButton = () => {
    setActive();
    if (window.classList.contains('window--collapsed')) {
      window.classList.remove('window--collapsed');
      placeOnTop();
    } else {
      if (reference !== lastFile) {
        placeOnTop();
      } else {
        window.classList.add('window--collapsed');
      }
    }
  };

  function onFileOpen() {
    if (item.classList.contains('file--text')) {
      const fileContent = item.querySelector('.file__content');
      if (fileContent) {
        window.appendChild(fileContent);
        fileContent.classList.remove('visually-hidden');
        fileContent.classList.add('window__content');
      }
      destkop.appendChild(window);
      window.classList.remove('window--collapsed');
      fileLabel.classList.add('file__label--active');
      window.style.left = '50%';
      window.style.top = '50%';
      window.style.transform = 'translate(-50%, -50%)';
      windowPath.textContent = `C:/${fileName.textContent}`;
      referenceText.textContent = fileName.textContent;
      reference.addEventListener('click', onCollapseButton);
      reference.classList.add('reference--active');
      desktopFooter.appendChild(reference);
      fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
      stopMovement();
      setActive();
      placeOnTop();
    }
  }

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
    window.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  };

  const onExpandButton = () => {
    window.classList.remove('window--collapsed');
    window.classList.toggle('window--fullscreen');
  };

  const onWindowClick = () => {
    setActive();
    placeOnTop();
  };

  const onMoveEvent = (evt) => {
    if (moveElement) {
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      window.style.left = `${window.offsetLeft - (initialX - newX)}px`;
      window.style.top = `${window.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  };

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
    document.removeEventListener(events[deviceType].up, stopMovement);
  }

  const onWindowDrag = (evt) => {
    if (evt.cancelable) {
      evt.preventDefault();
    }
    if (!window.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveEvent);
      document.addEventListener(events[deviceType].up, stopMovement);
    }
  };

  if (fileLabel) {
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  }

  if (windowButtonCollapse) {
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);
  }

  if (windowButtonClose) {
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);
  }

  if (windowButtonExpand) {
    windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);
  }

  if (window) {
    window.addEventListener(events[deviceType].down, onWindowClick);
  }

  if (windowDraggableArea) {
    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
  }
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});
