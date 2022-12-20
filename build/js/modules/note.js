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
  const noteDraggableArea = item.querySelector('.note__draggable-area');
  const noteFile = item.querySelector('.note__file');

  const openWindow = () => {
    noteWindow.classList.remove('note__window--collapsed');
    noteFile.classList.add('note__file--active');
    noteWindow.style.left = '50%';
    noteWindow.style.top = '50%';
    noteWindow.style.transform = 'translate(-50%, -50%)';
    stopMovement();
    noteFile.removeEventListener(events[deviceType].up, openWindow);
  };

  noteFile.addEventListener(events[deviceType].up, openWindow);

  buttonCollapse.addEventListener(events[deviceType].up, () => {
    noteWindow.classList.add('note__window--collapsed');
    const newReference = document.createElement('div');
    newReference.classList.add('note__reference');
    newReference.textContent = item.children[0].textContent;
    noteFooter.appendChild(newReference);
    newReference.addEventListener(events[deviceType].up, () => {
      newReference.remove();
      noteWindow.classList.remove('note__window--collapsed');
    });
  });

  buttonClose.addEventListener(events[deviceType].up, () => {
    noteWindow.classList.add('note__window--collapsed');
    noteFile.classList.remove('note__file--active');
    noteFile.addEventListener(events[deviceType].up, openWindow);
  });

  buttonExpand.addEventListener(events[deviceType].up, () => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgfSxcclxuICB0b3VjaDoge1xyXG4gICAgZG93bjogJ3RvdWNoc3RhcnQnLFxyXG4gICAgbW92ZTogJ3RvdWNobW92ZScsXHJcbiAgICB1cDogJ3RvdWNoZW5kJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxubm90ZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IGJ1dHRvbkNvbGxhcHNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fY29sbGFwc2UnKTtcclxuICBjb25zdCBidXR0b25FeHBhbmQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19leHBhbmQnKTtcclxuICBjb25zdCBidXR0b25DbG9zZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2Nsb3NlJyk7XHJcbiAgY29uc3Qgbm90ZVdpbmRvdyA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX3dpbmRvdycpO1xyXG4gIGNvbnN0IG5vdGVEcmFnZ2FibGVBcmVhID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICBjb25zdCBub3RlRmlsZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2ZpbGUnKTtcclxuXHJcbiAgY29uc3Qgb3BlbldpbmRvdyA9ICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIG5vdGVGaWxlLmNsYXNzTGlzdC5hZGQoJ25vdGVfX2ZpbGUtLWFjdGl2ZScpO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9ICc1MCUnO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC01MCUsIC01MCUpJztcclxuICAgIHN0b3BNb3ZlbWVudCgpO1xyXG4gICAgbm90ZUZpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9wZW5XaW5kb3cpO1xyXG4gIH07XHJcblxyXG4gIG5vdGVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvcGVuV2luZG93KTtcclxuXHJcbiAgYnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LmFkZCgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIGNvbnN0IG5ld1JlZmVyZW5jZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgbmV3UmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ25vdGVfX3JlZmVyZW5jZScpO1xyXG4gICAgbmV3UmVmZXJlbmNlLnRleHRDb250ZW50ID0gaXRlbS5jaGlsZHJlblswXS50ZXh0Q29udGVudDtcclxuICAgIG5vdGVGb290ZXIuYXBwZW5kQ2hpbGQobmV3UmVmZXJlbmNlKTtcclxuICAgIG5ld1JlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgKCkgPT4ge1xyXG4gICAgICBuZXdSZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIH0pO1xyXG4gIH0pO1xyXG5cclxuICBidXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgbm90ZUZpbGUuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fZmlsZS0tYWN0aXZlJyk7XHJcbiAgICBub3RlRmlsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb3BlbldpbmRvdyk7XHJcbiAgfSk7XHJcblxyXG4gIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgaWYgKG5vdGVXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3RlX193aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgbm90ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gIH0pO1xyXG5cclxuICBub3RlRHJhZ2dhYmxlQXJlYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoZXZ0LmNhbmNlbGFibGUpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgaWYgKCFub3RlV2luZG93LmNsYXNzTGlzdC5jb250YWlucygnbm90ZV9fd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBzdG9wTW92ZW1lbnQoKSB7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25Nb3ZlRXZlbnQoZXZ0KSB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBub3RlV2luZG93LnN0eWxlLmxlZnQgPSBgJHtub3RlV2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIG5vdGVXaW5kb3cuc3R5bGUudG9wID0gYCR7bm90ZVdpbmRvdy5vZmZzZXRUb3AgLSAoaW5pdGlhbFkgLSBuZXdZKX1weGA7XHJcbiAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJub3RlLmpzIn0=
