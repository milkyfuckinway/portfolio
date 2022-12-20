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
    click: 'click'
  },
  touch: {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
    click: 'click'
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
  const noteDraggableArea = item.querySelector('.note__draggable-area');
  const noteFile = item.querySelector('.note__file');

  const openWindow = () => {
    noteWindow.classList.remove('note__window--collapsed');
    noteFile.classList.add('note__file--active');
    noteWindow.style.left = '50%';
    noteWindow.style.top = '50%';
    noteWindow.style.transform = 'translate(-50%, -50%)';
    stopMovement();
    noteFile.removeEventListener(events[deviceType].click, openWindow);
  };

  noteFile.addEventListener(events[deviceType].click, openWindow);

  buttonCollapse.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__window--collapsed');
    const newReference = document.createElement('div');
    newReference.classList.add('note__reference');
    newReference.textContent = item.children[0].textContent;
    noteFooter.appendChild(newReference);
    newReference.addEventListener(events[deviceType].click, () => {
      newReference.remove();
      noteWindow.classList.remove('note__window--collapsed');
    });
  });

  buttonClose.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__window--collapsed');
    noteFile.classList.remove('note__file--active');
    noteFile.addEventListener(events[deviceType].click, openWindow);
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
    if (!noteWindow.classList.contains('note__window--fullscreen')) {
      moveElement = true;
    }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJ1xyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJ1xyXG4gIH0sXHJcbn07XHJcblxyXG5sZXQgZGV2aWNlVHlwZSA9ICcnO1xyXG5cclxuY29uc3QgaXNUb3VjaERldmljZSA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RvdWNoRXZlbnQnKTtcclxuICAgIGRldmljZVR5cGUgPSAndG91Y2gnO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBkZXZpY2VUeXBlID0gJ21vdXNlJztcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5ub3RlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgY29uc3QgYnV0dG9uQ29sbGFwc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19jb2xsYXBzZScpO1xyXG4gIGNvbnN0IGJ1dHRvbkV4cGFuZCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2V4cGFuZCcpO1xyXG4gIGNvbnN0IGJ1dHRvbkNsb3NlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fY2xvc2UnKTtcclxuICBjb25zdCBub3RlV2luZG93ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fd2luZG93Jyk7XHJcbiAgY29uc3Qgbm90ZURyYWdnYWJsZUFyZWEgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IG5vdGVGaWxlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZmlsZScpO1xyXG5cclxuICBjb25zdCBvcGVuV2luZG93ID0gKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgbm90ZUZpbGUuY2xhc3NMaXN0LmFkZCgnbm90ZV9fZmlsZS0tYWN0aXZlJyk7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xyXG4gICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgICBub3RlRmlsZS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb3BlbldpbmRvdyk7XHJcbiAgfTtcclxuXHJcbiAgbm90ZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9wZW5XaW5kb3cpO1xyXG5cclxuICBidXR0b25Db2xsYXBzZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgY29uc3QgbmV3UmVmZXJlbmNlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBuZXdSZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgnbm90ZV9fcmVmZXJlbmNlJyk7XHJcbiAgICBuZXdSZWZlcmVuY2UudGV4dENvbnRlbnQgPSBpdGVtLmNoaWxkcmVuWzBdLnRleHRDb250ZW50O1xyXG4gICAgbm90ZUZvb3Rlci5hcHBlbmRDaGlsZChuZXdSZWZlcmVuY2UpO1xyXG4gICAgbmV3UmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICAgIG5ld1JlZmVyZW5jZS5yZW1vdmUoKTtcclxuICAgICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgfSk7XHJcbiAgfSk7XHJcblxyXG4gIGJ1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBub3RlRmlsZS5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX19maWxlLS1hY3RpdmUnKTtcclxuICAgIG5vdGVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvcGVuV2luZG93KTtcclxuICB9KTtcclxuXHJcbiAgYnV0dG9uRXhwYW5kLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBpZiAobm90ZVdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBub3RlV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sICgpID0+IHtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAyO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgfSk7XHJcblxyXG4gIG5vdGVEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIChldnQpID0+IHtcclxuICAgIGlmIChldnQuY2FuY2VsYWJsZSkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAyO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICBpZiAoIW5vdGVXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3RlX193aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0b3BNb3ZlbWVudCgpIHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk1vdmVFdmVudChldnQpIHtcclxuICAgIGlmIChtb3ZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIG5vdGVXaW5kb3cuc3R5bGUubGVmdCA9IGAke25vdGVXaW5kb3cub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpfXB4YDtcclxuICAgICAgbm90ZVdpbmRvdy5zdHlsZS50b3AgPSBgJHtub3RlV2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICB9XHJcbn0pO1xyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
