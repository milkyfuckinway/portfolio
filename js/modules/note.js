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
    if (!deviceType === 'touch') {
      evt.preventDefault();
    }
    initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    moveElement = true;
    noteWindow.addEventListener(events[deviceType].move, onMoveEvent);
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  function stopMovement () {
    moveElement = false;
    noteWindow.removeEventListener(events[deviceType].move, onMoveEvent);
  }

  function onMoveEvent(evt) {
    if (moveElement) {
      if (!deviceType === 'touch') {
        evt.preventDefault();
      }
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      noteWindow.style.left = `${noteWindow.offsetLeft - (initialX - newX)}px`;
      noteWindow.style.top = `${noteWindow.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
      noteWindow.addEventListener('mouseleave', stopMovement);
      noteWindow.addEventListener(events[deviceType].up, stopMovement);
    }
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

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG4gIHRvdWNoOiB7XHJcbiAgICBkb3duOiAndG91Y2hzdGFydCcsXHJcbiAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgIHVwOiAndG91Y2hlbmQnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxufTtcclxuXHJcbmxldCBkZXZpY2VUeXBlID0gJyc7XHJcblxyXG5jb25zdCBpc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgZGV2aWNlVHlwZSA9ICd0b3VjaCc7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbm5vdGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCBidXR0b25Db2xsYXBzZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2NvbGxhcHNlJyk7XHJcbiAgY29uc3QgYnV0dG9uRXhwYW5kID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZXhwYW5kJyk7XHJcbiAgY29uc3QgYnV0dG9uQ2xvc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19jbG9zZScpO1xyXG4gIGNvbnN0IG5vdGVXaW5kb3cgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX193aW5kb3cnKTtcclxuICBjb25zdCBub3RlSGVhZGVyID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9faGVhZGVyJyk7XHJcbiAgY29uc3Qgbm90ZUZpbGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19maWxlJyk7XHJcblxyXG4gIG5vdGVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX2NvbGxhcHNlZCcpO1xyXG4gICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgfSk7XHJcblxyXG4gIGJ1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX2NvbGxhcHNlZCcpO1xyXG4gICAgY29uc3QgbmV3UmVmZXJlbmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBuZXdSZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgnbm90ZV9fcmVmZXJlbmNlJyk7XHJcbiAgICBuZXdSZWZlcmVuY2UudGV4dENvbnRlbnQgPSBpdGVtLmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xyXG4gICAgbm90ZUZvb3Rlci5hcHBlbmRDaGlsZChuZXdSZWZlcmVuY2UpO1xyXG4gICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgICBuZXdSZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgICAgbmV3UmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX2NvbGxhcHNlZCcpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGJ1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX2NvbGxhcHNlZCcpO1xyXG4gICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgfSk7XHJcblxyXG4gIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX19jb2xsYXBzZWQnKTtcclxuICAgIHN0b3BNb3ZlbWVudCgpO1xyXG4gIH0pO1xyXG5cclxuICBub3RlSGVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIChldnQpID0+IHtcclxuICAgIGlmICghZGV2aWNlVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgIG5vdGVXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDI7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gc3RvcE1vdmVtZW50ICgpIHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBub3RlV2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uTW92ZUV2ZW50KGV2dCkge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGlmICghZGV2aWNlVHlwZSA9PT0gJ3RvdWNoJykge1xyXG4gICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgbm90ZVdpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7bm90ZVdpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9IGAke25vdGVXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgICAgbm90ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgc3RvcE1vdmVtZW50KTtcclxuICAgICAgbm90ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxuLy8gbGV0IGZpcnN0UG9zaXRpb25YID0gMDtcclxuLy8gbGV0IGZpcnN0UG9zaXRpb25ZID0gLTI1O1xyXG4vLyBjb25zdCByYW5kb21Qb3NpdGlvbiA9ICgpID0+IHtcclxuLy8gICBub3RlTGlzdC5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4vLyAgICAgY29uc3QgbmV3UG9zaXRpb25YID0gZmlyc3RQb3NpdGlvblggKyAxMDtcclxuLy8gICAgIGNvbnN0IG5ld1Bvc2l0aW9uWSA9IGZpcnN0UG9zaXRpb25ZICsgMzU7XHJcbi8vICAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuLy8gICAgIGl0ZW0uc3R5bGUubGVmdCA9IGAke25ld1Bvc2l0aW9uWH1weGA7XHJcbi8vICAgICBpdGVtLnN0eWxlLnRvcCA9IGAke25ld1Bvc2l0aW9uWX1weGA7XHJcbi8vICAgICBpdGVtLnN0eWxlLnpJbmRleCA9IG5ld3pJbmRleDtcclxuLy8gICAgIGZpcnN0UG9zaXRpb25YID0gbmV3UG9zaXRpb25YO1xyXG4vLyAgICAgZmlyc3RQb3NpdGlvblkgPSBuZXdQb3NpdGlvblk7XHJcbi8vICAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4vLyAgICAgaWYgKGluZGV4ID09PSAyKSB7XHJcbi8vICAgICAgIGZpcnN0UG9zaXRpb25YID0gMDtcclxuLy8gICAgIH1cclxuLy8gICB9KTtcclxuLy8gfTtcclxuLy8gcmFuZG9tUG9zaXRpb24oKTtcclxuIl0sImZpbGUiOiJub3RlLmpzIn0=
