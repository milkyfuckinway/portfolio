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




//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ub3RlJyk7XHJcbmNvbnN0IG5vdGVIZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZV9faGVhZGVyJyk7XHJcblxyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgfSxcclxuICB0b3VjaDoge1xyXG5cclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgfVxyXG59O1xyXG5cclxubGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICBjYXRjaChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbm5vdGVIZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQudGFyZ2V0ID09PSBub3RlSGVhZGVyKSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICB9XHJcbn0pO1xyXG5cclxuY29uc3Qgc3RvcE1vdmVtZW50ID0gKCkgPT4ge1xyXG4gIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgY29uc29sZS5sb2coJ3N0b3Btb3ZlbWVudCcpO1xyXG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Nb3ZlRXZlbnQgKGV2dCkge1xyXG4gIGNvbnNvbGUubG9nKCdvbk1vdmVFdmVudCcpO1xyXG4gIGlmKG1vdmVFbGVtZW50KSB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICBub3RlLnN0eWxlLnRvcCA9IGAke25vdGUub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSkgfXB4YDtcclxuICAgIG5vdGUuc3R5bGUubGVmdCA9IGAke25vdGUub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpIH1weGA7XHJcbiAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgc3RvcE1vdmVtZW50KTtcclxuICAgIG5vdGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgfVxyXG59O1xyXG5cclxuXHJcblxyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
