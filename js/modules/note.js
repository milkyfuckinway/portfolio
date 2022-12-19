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
  const buttonCollapse = item.querySelector('.note__collapse');
  const buttonExpand = item.querySelector('.note__expand');
  const buttonClose = item.querySelector('.note__close');
  const noteWindow = item.querySelector('.note__window');
  const noteHeader = item.querySelector('.note__header');
  const noteFile = item.querySelector('.note__file');

  const openWindow = () => {
    noteWindow.classList.remove('note__window--collapsed');
    noteFile.classList.add('note__file--active');
    noteWindow.style.left = '20px';
    noteWindow.style.top = '20px';
    stopMovement();
    noteFile.removeEventListener(events[deviceType].down,openWindow);
  };

  noteFile.addEventListener(events[deviceType].down,openWindow);

  buttonCollapse.addEventListener(events[deviceType].down, () => {
    noteWindow.classList.add('note__window--collapsed');
    const newReference = document.createElement('div');
    newReference.classList.add('note__reference');
    newReference.textContent = item.children[0].textContent;
    noteFooter.appendChild(newReference);
    newReference.addEventListener(events[deviceType].down, () => {
      newReference.remove();
      noteWindow.classList.remove('note__window--collapsed');
    });
  });

  buttonClose.addEventListener(events[deviceType].down, () => {
    noteWindow.classList.add('note__window--collapsed');
    noteFile.classList.remove('note__file--active');
    noteFile.addEventListener(events[deviceType].down,openWindow);
  });

  buttonExpand.addEventListener(events[deviceType].down, () => {
    noteWindow.classList.remove('note__window--collapsed');
  });

  noteWindow.addEventListener(events[deviceType].down, () => {
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  noteHeader.addEventListener(events[deviceType].down, (evt) => {
    if (evt.cancelable) {
      evt.preventDefault();
    }
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

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgfSxcclxuICB0b3VjaDoge1xyXG4gICAgZG93bjogJ3RvdWNoc3RhcnQnLFxyXG4gICAgbW92ZTogJ3RvdWNobW92ZScsXHJcbiAgICB1cDogJ3RvdWNoZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxubm90ZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IGJ1dHRvbkNvbGxhcHNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fY29sbGFwc2UnKTtcclxuICBjb25zdCBidXR0b25FeHBhbmQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19leHBhbmQnKTtcclxuICBjb25zdCBidXR0b25DbG9zZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2Nsb3NlJyk7XHJcbiAgY29uc3Qgbm90ZVdpbmRvdyA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX3dpbmRvdycpO1xyXG4gIGNvbnN0IG5vdGVIZWFkZXIgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19oZWFkZXInKTtcclxuICBjb25zdCBub3RlRmlsZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2ZpbGUnKTtcclxuXHJcbiAgY29uc3Qgb3BlbldpbmRvdyA9ICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIG5vdGVGaWxlLmNsYXNzTGlzdC5hZGQoJ25vdGVfX2ZpbGUtLWFjdGl2ZScpO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS5sZWZ0ID0gJzIwcHgnO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS50b3AgPSAnMjBweCc7XHJcbiAgICBzdG9wTW92ZW1lbnQoKTtcclxuICAgIG5vdGVGaWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sb3BlbldpbmRvdyk7XHJcbiAgfTtcclxuXHJcbiAgbm90ZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93bixvcGVuV2luZG93KTtcclxuXHJcbiAgYnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgY29uc3QgbmV3UmVmZXJlbmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBuZXdSZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgnbm90ZV9fcmVmZXJlbmNlJyk7XHJcbiAgICBuZXdSZWZlcmVuY2UudGV4dENvbnRlbnQgPSBpdGVtLmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xyXG4gICAgbm90ZUZvb3Rlci5hcHBlbmRDaGlsZChuZXdSZWZlcmVuY2UpO1xyXG4gICAgbmV3UmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sICgpID0+IHtcclxuICAgICAgbmV3UmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgYnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgbm90ZUZpbGUuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fZmlsZS0tYWN0aXZlJyk7XHJcbiAgICBub3RlRmlsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLG9wZW5XaW5kb3cpO1xyXG4gIH0pO1xyXG5cclxuICBidXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gIH0pO1xyXG5cclxuICBub3RlV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sICgpID0+IHtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAyO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgfSk7XHJcblxyXG4gIG5vdGVIZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKGV2dCkgPT4ge1xyXG4gICAgaWYgKGV2dC5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDI7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gc3RvcE1vdmVtZW50KCkge1xyXG4gICAgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uTW92ZUV2ZW50KGV2dCkge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgbm90ZVdpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7bm90ZVdpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9IGAke25vdGVXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gIH1cclxufSk7XHJcbiJdLCJmaWxlIjoibm90ZS5qcyJ9
