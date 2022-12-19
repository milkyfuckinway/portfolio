const noteList = document.querySelectorAll('.note');

let initialX = 0;
let initialY = 0;
let initialzIndex = 0;
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
  item.addEventListener(events[deviceType].down, (evt) => {
    if (evt.target.classList.contains('note__header')) {
      if(!deviceType === 'touch') {
        evt.preventDefault();
      }
      initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      moveElement = true;
      document.addEventListener(events[deviceType].move, onMoveEvent);
      const newzIndex = initialzIndex + 2;
      item.style.zIndex = `${newzIndex}`;
      initialzIndex = newzIndex;
    }});

  const stopMovement = () => {
    moveElement = false;
    console.log('stopmovement');
    document.removeEventListener(events[deviceType].move, onMoveEvent);
  };

  function onMoveEvent(evt) {
    console.log('onMoveEvent');
    if (moveElement) {
      if(!deviceType === 'touch') {
        evt.preventDefault();
      }
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      item.style.left = `${item.offsetLeft - (initialX - newX)}px`;
      item.style.top = `${item.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
      document.addEventListener('mouseleave', stopMovement);
      item.addEventListener(events[deviceType].up, stopMovement);
    }
  }
});
let firstPositionX = 0;
let firstPositionY = -25;
const randomPosition = () => {
  noteList.forEach((item, index) => {
    console.log(index);
    const newPositionX = firstPositionX + 10;
    const newPositionY = firstPositionY + 35;
    const newzIndex = initialzIndex + 2;
    item.style.left = `${newPositionX}px`;
    item.style.top = `${newPositionY}px`;
    item.style.zIndex = newzIndex;
    firstPositionX = newPositionX;
    firstPositionY = newPositionY;
    initialzIndex = newzIndex;
    if (index === 2) {
      firstPositionX = 0;
    }
  }
  );
};
randomPosition();


document.addEventListener(events[deviceType].move, (evt) => {
  console.log(evt, evt.target);
})