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

const desktopFooter = document.querySelector('.desktop__footer');
const referenceTemplate = document.querySelector('.reference');

// const file = document.querySelector('.file');
// for (let i = 0; i < 100; i++) {
//   const fileClone = file.cloneNode(true);
//   document.querySelector('.desktop__wrapper').appendChild(fileClone);
// }

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = item.querySelector('.window');
  const buttonCollapse = item.querySelector('.window__button--collapse');
  const buttonExpand = item.querySelector('.window__button--expand');
  const buttonClose = item.querySelector('.window__button--close');
  const windowDraggableArea = item.querySelector('.window__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
  const windowHeader = item.querySelector('.window__header');
  const windowPath = item.querySelector('.window__path');
  const fileName = item.querySelector('.file__name');

  const placeOnTop = () => {
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    lastFile = reference;
    const windowHeaderList = document.querySelectorAll('.window__header');
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

  const onFileOpen = () => {
    const referenceText = reference.querySelector('.reference__text');
    window.classList.remove('window--collapsed');
    fileLabel.classList.add('file__label--active');
    window.style.left = '50%';
    window.style.top = '50%';
    window.style.transform = 'translate(-50%, -50%)';
    referenceText.textContent = fileName.textContent;
    reference.addEventListener('click', onCollapseButton);
    reference.classList.add('reference--active');
    const referenceIcon = item.querySelector('.file__icon').cloneNode(true);
    reference.insertBefore(referenceIcon, referenceText);
    const pathIcon = item.querySelector('.file__icon').cloneNode(true);
    windowDraggableArea.insertBefore(pathIcon, windowPath);
    desktopFooter.appendChild(reference);
    fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
    stopMovement();
    setActive();
    placeOnTop();
  };

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
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

  fileLabel.addEventListener(events[deviceType].click, onFileOpen);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapseButton);

  buttonClose.addEventListener(events[deviceType].click, onCloseButton);

  buttonExpand.addEventListener(events[deviceType].click, onExpandButton);

  window.addEventListener(events[deviceType].down, onWindowClick);

  windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});
