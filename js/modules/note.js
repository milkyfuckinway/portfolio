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

  const openWindow = () => {
    noteWindow.classList.remove('note__window--collapsed');
    noteWindow.style.left = '20px';
    noteWindow.style.top = '20px';
    stopMovement();
    noteFile.removeEventListener(events[deviceType].click,openWindow);
  };

  noteFile.addEventListener(events[deviceType].click,openWindow);

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
    noteFile.addEventListener(events[deviceType].click,openWindow);
  });

  buttonExpand.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.remove('note__window--collapsed');
  });

  noteWindow.addEventListener(events[deviceType].click, () => {
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  noteHeader.addEventListener(events[deviceType].down, (evt) => {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG4gIHRvdWNoOiB7XHJcbiAgICBkb3duOiAndG91Y2hzdGFydCcsXHJcbiAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgIHVwOiAndG91Y2hlbmQnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxufTtcclxuXHJcbmxldCBkZXZpY2VUeXBlID0gJyc7XHJcblxyXG5jb25zdCBpc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgZGV2aWNlVHlwZSA9ICd0b3VjaCc7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbm5vdGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCBidXR0b25Db2xsYXBzZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2NvbGxhcHNlJyk7XHJcbiAgY29uc3QgYnV0dG9uRXhwYW5kID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZXhwYW5kJyk7XHJcbiAgY29uc3QgYnV0dG9uQ2xvc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19jbG9zZScpO1xyXG4gIGNvbnN0IG5vdGVXaW5kb3cgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX193aW5kb3cnKTtcclxuICBjb25zdCBub3RlSGVhZGVyID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9faGVhZGVyJyk7XHJcbiAgY29uc3Qgbm90ZUZpbGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19maWxlJyk7XHJcblxyXG4gIGNvbnN0IG9wZW5XaW5kb3cgPSAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLmxlZnQgPSAnMjBweCc7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9ICcyMHB4JztcclxuICAgIHN0b3BNb3ZlbWVudCgpO1xyXG4gICAgbm90ZUZpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssb3BlbldpbmRvdyk7XHJcbiAgfTtcclxuXHJcbiAgbm90ZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssb3BlbldpbmRvdyk7XHJcblxyXG4gIGJ1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBjb25zdCBuZXdSZWZlcmVuY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIG5ld1JlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdub3RlX19yZWZlcmVuY2UnKTtcclxuICAgIG5ld1JlZmVyZW5jZS50ZXh0Q29udGVudCA9IGl0ZW0uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQ7XHJcbiAgICBub3RlRm9vdGVyLmFwcGVuZENoaWxkKG5ld1JlZmVyZW5jZSk7XHJcbiAgICBuZXdSZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgICAgbmV3UmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgYnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LmFkZCgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIG5vdGVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLG9wZW5XaW5kb3cpO1xyXG4gIH0pO1xyXG5cclxuICBidXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICB9KTtcclxuXHJcbiAgbm90ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKCkgPT4ge1xyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDI7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICB9KTtcclxuXHJcbiAgbm90ZUhlYWRlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZXZ0KSA9PiB7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMjtcclxuICAgIG5vdGVXaW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gIH0pO1xyXG5cclxuICBmdW5jdGlvbiBzdG9wTW92ZW1lbnQoKSB7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gb25Nb3ZlRXZlbnQoZXZ0KSB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBub3RlV2luZG93LnN0eWxlLmxlZnQgPSBgJHtub3RlV2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIG5vdGVXaW5kb3cuc3R5bGUudG9wID0gYCR7bm90ZVdpbmRvdy5vZmZzZXRUb3AgLSAoaW5pdGlhbFkgLSBuZXdZKX1weGA7XHJcbiAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgfVxyXG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJub3RlLmpzIn0=
