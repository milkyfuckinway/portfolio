
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

const fileList = document.querySelectorAll('.file');
const noteFooter = document.querySelector('.note__footer');

fileList.forEach((item) => {
  const buttonCollapse = item.querySelector('.note__collapse');
  const buttonExpand = item.querySelector('.note__expand');
  const buttonClose = item.querySelector('.note__close');
  const noteWindow = item.querySelector('.note__window');
  const noteDraggableArea = item.querySelector('.note__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const referenceTemplate = document.querySelector('.note__reference');
  const cloneReference = referenceTemplate.cloneNode(true);

  const onCollapse = () =>
    noteWindow.classList.contains('note__window--collapsed')
      ? noteWindow.classList.remove('note__window--collapsed')
      : noteWindow.classList.add('note__window--collapsed');

  const onFileOpen = () => {
    noteWindow.classList.remove('note__window--collapsed');
    fileLabel.classList.add('file__label--active');
    noteWindow.style.left = '50%';
    noteWindow.style.top = '50%';
    noteWindow.style.transform = 'translate(-50%, -50%)';
    stopMovement();
    cloneReference.querySelector('.note__refrence-text').textContent =
      item.querySelector('.file__name').textContent;
    cloneReference.addEventListener('click', onCollapse);
    noteFooter.appendChild(cloneReference);
    fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
  };

  fileLabel.addEventListener(events[deviceType].click, onFileOpen);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapse);

  buttonClose.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__window--collapsed');
    fileLabel.classList.remove('file__label--active');
    cloneReference.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  });

  buttonExpand.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.remove('note__window--collapsed');
    if (noteWindow.classList.contains('note__window--fullscreen')) {
      noteWindow.classList.remove('note__window--fullscreen');
    } else {
      noteWindow.classList.add('note__window--fullscreen');
    }
  });

  noteWindow.addEventListener(events[deviceType].down, () => {
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  noteDraggableArea.addEventListener(events[deviceType].down, (evt) => {
    if (evt.cancelable) {
      evt.preventDefault();
    }
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    document.addEventListener(events[deviceType].move, onMoveEvent);
    document.addEventListener(events[deviceType].up, stopMovement);
    if (!noteWindow.classList.contains('note__window--fullscreen')) {
      moveElement = true;
    }
  });

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
  }

  function onMoveEvent(evt) {
    if (moveElement) {
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      noteWindow.style.left = `${noteWindow.offsetLeft - (initialX - newX)}px`;
      noteWindow.style.top = `${noteWindow.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  }
});

noteFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  noteFooter.scrollLeft += evt.deltaY;
});
