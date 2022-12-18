const note = document.querySelector('.note');
const noteHeader = document.querySelector('.note__header');

let initialX = 0;
let initialY = 0;
let moveElement = false;

const events = {
  mouse: {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
  },
  touch: {

    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
  }
};

let deviceType = '';

const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    deviceType = 'touch';
    return true;
  }
  catch(err) {
    deviceType = 'mouse';
    return false;
  }
};

isTouchDevice();

noteHeader.addEventListener(events[deviceType].down, (evt) => {
  if (evt.target === noteHeader) {
    evt.preventDefault();
    initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    moveElement = true;
    document.addEventListener(events[deviceType].move, onMoveEvent);
  }
});

const stopMovement = () => {
  moveElement = false;
  console.log('stopmovement');
  document.removeEventListener(events[deviceType].move, onMoveEvent);
}

function onMoveEvent (evt) {
  console.log('onMoveEvent');
  if(moveElement) {
    evt.preventDefault();
    const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    note.style.top = `${note.offsetTop - (initialY - newY) }px`;
    note.style.left = `${note.offsetLeft - (initialX - newX) }px`;
    initialX = newX;
    initialY = newY;
    document.addEventListener('mouseleave', stopMovement);
    note.addEventListener(events[deviceType].up, stopMovement);
  }
};



