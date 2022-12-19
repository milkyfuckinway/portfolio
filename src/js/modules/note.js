const noteList = document.querySelectorAll('.note');
const noteFooter = document.querySelector('.note__footer');

let initialX = 0;
let initialY = 0;
let initialzIndex = 0;
let moveElement = false;

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

noteList.forEach((item) => {
  const buttonCollapse = item.querySelector('.note__collapse');
  const buttonExpand = item.querySelector('.note__expand');
  const buttonClose = item.querySelector('.note__close');
  const noteWindow = item.querySelector('.note__window');
  const noteHeader = item.querySelector('.note__header');
  const noteFile = item.querySelector('.note__file');

  noteFile.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.remove('note__collapsed');
    stopMovement();
  });

  buttonCollapse.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__collapsed');
    const newReference = document.createElement('div');
    newReference.classList.add('note__reference');
    newReference.textContent = item.children[0].textContent;
    noteFooter.appendChild(newReference);
    newReference.addEventListener(events[deviceType].click, () => {
      newReference.remove();
      noteWindow.classList.remove('note__collapsed');
    });
  });

  buttonClose.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__collapsed');
  });

  buttonExpand.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.remove('note__collapsed');
  });

  noteWindow.addEventListener(events[deviceType].click, () => {
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  noteHeader.addEventListener(events[deviceType].down, (evt) => {
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    moveElement = true;
    document.addEventListener(events[deviceType].move, onMoveEvent);
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
    document.addEventListener(events[deviceType].up, stopMovement);
  }
});
