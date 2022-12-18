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
      evt.preventDefault();
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
      evt.preventDefault();
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
let firstPositionX = 50;
let firstPositionY = 50;
const randomPosition = () => {
  noteList.forEach((item) => {
    const newPositionX = firstPositionX + 25;
    const newPositionY = firstPositionY + 35;
    const newzIndex = initialzIndex + 2;
    item.style.left = `${newPositionX}px`;
    item.style.top = `${newPositionY}px`;
    item.style.zIndex = newzIndex;
    firstPositionX = newPositionX;
    firstPositionY = newPositionY;
    initialzIndex = newzIndex;
  }
  );
};
randomPosition();

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgfSxcclxuICB0b3VjaDoge1xyXG4gICAgZG93bjogJ3RvdWNoc3RhcnQnLFxyXG4gICAgbW92ZTogJ3RvdWNobW92ZScsXHJcbiAgICB1cDogJ3RvdWNoZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxubm90ZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKGV2dCkgPT4ge1xyXG4gICAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3RlX19oZWFkZXInKSkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgICAgaXRlbS5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIH19KTtcclxuXHJcbiAgY29uc3Qgc3RvcE1vdmVtZW50ID0gKCkgPT4ge1xyXG4gICAgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuICAgIGNvbnNvbGUubG9nKCdzdG9wbW92ZW1lbnQnKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBvbk1vdmVFdmVudChldnQpIHtcclxuICAgIGNvbnNvbGUubG9nKCdvbk1vdmVFdmVudCcpO1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGl0ZW0uc3R5bGUubGVmdCA9IGAke2l0ZW0ub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpfXB4YDtcclxuICAgICAgaXRlbS5zdHlsZS50b3AgPSBgJHtpdGVtLm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBzdG9wTW92ZW1lbnQpO1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbmxldCBmaXJzdFBvc2l0aW9uWCA9IDUwO1xyXG5sZXQgZmlyc3RQb3NpdGlvblkgPSA1MDtcclxuY29uc3QgcmFuZG9tUG9zaXRpb24gPSAoKSA9PiB7XHJcbiAgbm90ZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgY29uc3QgbmV3UG9zaXRpb25YID0gZmlyc3RQb3NpdGlvblggKyAyNTtcclxuICAgIGNvbnN0IG5ld1Bvc2l0aW9uWSA9IGZpcnN0UG9zaXRpb25ZICsgMzU7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIGl0ZW0uc3R5bGUubGVmdCA9IGAke25ld1Bvc2l0aW9uWH1weGA7XHJcbiAgICBpdGVtLnN0eWxlLnRvcCA9IGAke25ld1Bvc2l0aW9uWX1weGA7XHJcbiAgICBpdGVtLnN0eWxlLnpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIGZpcnN0UG9zaXRpb25YID0gbmV3UG9zaXRpb25YO1xyXG4gICAgZmlyc3RQb3NpdGlvblkgPSBuZXdQb3NpdGlvblk7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gIH1cclxuICApO1xyXG59O1xyXG5yYW5kb21Qb3NpdGlvbigpO1xyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
