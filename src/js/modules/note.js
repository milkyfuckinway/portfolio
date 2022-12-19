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
    stopMovement();
    newReference.addEventListener(events[deviceType].click, () => {
      newReference.remove();
      noteWindow.classList.remove('note__collapsed');
    });
  });

  buttonClose.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__collapsed');
    stopMovement();
  });

  buttonExpand.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.remove('note__collapsed');
    stopMovement();
  });

  noteHeader.addEventListener(events[deviceType].down, (evt) => {
    evt.preventDefault();
    initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    moveElement = true;
    noteWindow.addEventListener(events[deviceType].move, onMoveEvent);
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  function stopMovement() {
    moveElement = false;
    noteWindow.removeEventListener(events[deviceType].move, onMoveEvent);
  }

  function onMoveEvent(evt) {
    evt.preventDefault();
    const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    noteWindow.style.left = `${noteWindow.offsetLeft - (initialX - newX)}px`;
    noteWindow.style.top = `${noteWindow.offsetTop - (initialY - newY)}px`;
    initialX = newX;
    initialY = newY;
    noteWindow.addEventListener('mouseleave', stopMovement);
    noteWindow.addEventListener(events[deviceType].up, stopMovement);
  }
});

// let firstPositionX = 0;
// let firstPositionY = -25;
// const randomPosition = () => {
//   noteList.forEach((item, index) => {
//     const newPositionX = firstPositionX + 10;
//     const newPositionY = firstPositionY + 35;
//     const newzIndex = initialzIndex + 2;
//     item.style.left = `${newPositionX}px`;
//     item.style.top = `${newPositionY}px`;
//     item.style.zIndex = newzIndex;
//     firstPositionX = newPositionX;
//     firstPositionY = newPositionY;
//     initialzIndex = newzIndex;
//     if (index === 2) {
//       firstPositionX = 0;
//     }
//   });
// };
// randomPosition();
