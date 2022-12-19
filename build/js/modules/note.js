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
//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgfSxcclxuICB0b3VjaDoge1xyXG4gICAgZG93bjogJ3RvdWNoc3RhcnQnLFxyXG4gICAgbW92ZTogJ3RvdWNobW92ZScsXHJcbiAgICB1cDogJ3RvdWNoZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxubm90ZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKGV2dCkgPT4ge1xyXG4gICAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3RlX19oZWFkZXInKSkge1xyXG4gICAgICBpZighZGV2aWNlVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICAgICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDI7XHJcbiAgICAgIGl0ZW0uc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICB9fSk7XHJcblxyXG4gIGNvbnN0IHN0b3BNb3ZlbWVudCA9ICgpID0+IHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBjb25zb2xlLmxvZygnc3RvcG1vdmVtZW50Jyk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gb25Nb3ZlRXZlbnQoZXZ0KSB7XHJcbiAgICBjb25zb2xlLmxvZygnb25Nb3ZlRXZlbnQnKTtcclxuICAgIGlmIChtb3ZlRWxlbWVudCkge1xyXG4gICAgICBpZighZGV2aWNlVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgaXRlbS5zdHlsZS5sZWZ0ID0gYCR7aXRlbS5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICBpdGVtLnN0eWxlLnRvcCA9IGAke2l0ZW0ub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIHN0b3BNb3ZlbWVudCk7XHJcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG59KTtcclxubGV0IGZpcnN0UG9zaXRpb25YID0gMDtcclxubGV0IGZpcnN0UG9zaXRpb25ZID0gLTI1O1xyXG5jb25zdCByYW5kb21Qb3NpdGlvbiA9ICgpID0+IHtcclxuICBub3RlTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coaW5kZXgpO1xyXG4gICAgY29uc3QgbmV3UG9zaXRpb25YID0gZmlyc3RQb3NpdGlvblggKyAxMDtcclxuICAgIGNvbnN0IG5ld1Bvc2l0aW9uWSA9IGZpcnN0UG9zaXRpb25ZICsgMzU7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIGl0ZW0uc3R5bGUubGVmdCA9IGAke25ld1Bvc2l0aW9uWH1weGA7XHJcbiAgICBpdGVtLnN0eWxlLnRvcCA9IGAke25ld1Bvc2l0aW9uWX1weGA7XHJcbiAgICBpdGVtLnN0eWxlLnpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIGZpcnN0UG9zaXRpb25YID0gbmV3UG9zaXRpb25YO1xyXG4gICAgZmlyc3RQb3NpdGlvblkgPSBuZXdQb3NpdGlvblk7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgaWYgKGluZGV4ID09PSAyKSB7XHJcbiAgICAgIGZpcnN0UG9zaXRpb25YID0gMDtcclxuICAgIH1cclxuICB9XHJcbiAgKTtcclxufTtcclxucmFuZG9tUG9zaXRpb24oKTtcclxuXHJcblxyXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCAoZXZ0KSA9PiB7XHJcbiAgY29uc29sZS5sb2coZXZ0LCBldnQudGFyZ2V0KTtcclxufSkiXSwiZmlsZSI6Im5vdGUuanMifQ==
