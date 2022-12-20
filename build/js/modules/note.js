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
  const noteDraggableArea = item.querySelector('.note__draggable-area');
  const noteFile = item.querySelector('.note__file');
  const referenceTemplate = document.querySelector('.note__reference');
  const cloneReference = referenceTemplate.cloneNode(true);

  const onCollapse = () => {
    if (noteWindow.classList.contains('note__window--collapsed')) {
      noteWindow.classList.remove('note__window--collapsed');
    } else {
      noteWindow.classList.add('note__window--collapsed');
    }
  };

  const openWindow = () => {
    noteWindow.classList.remove('note__window--collapsed');
    noteFile.classList.add('note__file--active');
    noteWindow.style.left = '50%';
    noteWindow.style.top = '50%';
    noteWindow.style.transform = 'translate(-50%, -50%)';
    stopMovement();
    cloneReference.querySelector('.note__refrence-text').textContent =
      item.querySelector('.note__file-name').textContent;
    cloneReference.addEventListener('click', onCollapse);
    noteFooter.appendChild(cloneReference);
    noteFile.removeEventListener(events[deviceType].click, openWindow);
  };

  noteFile.addEventListener(events[deviceType].click, openWindow);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapse);

  buttonClose.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__window--collapsed');
    noteFile.classList.remove('note__file--active');
    cloneReference.remove();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG4gIHRvdWNoOiB7XHJcbiAgICBkb3duOiAndG91Y2hzdGFydCcsXHJcbiAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgIHVwOiAndG91Y2hlbmQnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxufTtcclxuXHJcbmxldCBkZXZpY2VUeXBlID0gJyc7XHJcblxyXG5jb25zdCBpc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgZGV2aWNlVHlwZSA9ICd0b3VjaCc7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbm5vdGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCBidXR0b25Db2xsYXBzZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2NvbGxhcHNlJyk7XHJcbiAgY29uc3QgYnV0dG9uRXhwYW5kID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZXhwYW5kJyk7XHJcbiAgY29uc3QgYnV0dG9uQ2xvc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19jbG9zZScpO1xyXG4gIGNvbnN0IG5vdGVXaW5kb3cgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX193aW5kb3cnKTtcclxuICBjb25zdCBub3RlRHJhZ2dhYmxlQXJlYSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgY29uc3Qgbm90ZUZpbGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19maWxlJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZV9fcmVmZXJlbmNlJyk7XHJcbiAgY29uc3QgY2xvbmVSZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gIGNvbnN0IG9uQ29sbGFwc2UgPSAoKSA9PiB7XHJcbiAgICBpZiAobm90ZVdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJykpIHtcclxuICAgICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9wZW5XaW5kb3cgPSAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBub3RlRmlsZS5jbGFzc0xpc3QuYWRkKCdub3RlX19maWxlLS1hY3RpdmUnKTtcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS50b3AgPSAnNTAlJztcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbiAgICBzdG9wTW92ZW1lbnQoKTtcclxuICAgIGNsb25lUmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19yZWZyZW5jZS10ZXh0JykudGV4dENvbnRlbnQgPVxyXG4gICAgICBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19maWxlLW5hbWUnKS50ZXh0Q29udGVudDtcclxuICAgIGNsb25lUmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Db2xsYXBzZSk7XHJcbiAgICBub3RlRm9vdGVyLmFwcGVuZENoaWxkKGNsb25lUmVmZXJlbmNlKTtcclxuICAgIG5vdGVGaWxlLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvcGVuV2luZG93KTtcclxuICB9O1xyXG5cclxuICBub3RlRmlsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb3BlbldpbmRvdyk7XHJcblxyXG4gIGJ1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNvbGxhcHNlKTtcclxuXHJcbiAgYnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LmFkZCgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIG5vdGVGaWxlLmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX2ZpbGUtLWFjdGl2ZScpO1xyXG4gICAgY2xvbmVSZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICBub3RlRmlsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb3BlbldpbmRvdyk7XHJcbiAgfSk7XHJcblxyXG4gIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgaWYgKG5vdGVXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCdub3RlX193aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgbm90ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gIH0pO1xyXG5cclxuICBub3RlRHJhZ2dhYmxlQXJlYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoZXZ0LmNhbmNlbGFibGUpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgaWYgKCFub3RlV2luZG93LmNsYXNzTGlzdC5jb250YWlucygnbm90ZV9fd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBzdG9wTW92ZW1lbnQoKSB7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25Nb3ZlRXZlbnQoZXZ0KSB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBub3RlV2luZG93LnN0eWxlLmxlZnQgPSBgJHtub3RlV2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIG5vdGVXaW5kb3cuc3R5bGUudG9wID0gYCR7bm90ZVdpbmRvdy5vZmZzZXRUb3AgLSAoaW5pdGlhbFkgLSBuZXdZKX1weGA7XHJcbiAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJub3RlLmpzIn0=
