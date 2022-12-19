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
    evt.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgbm90ZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubm90ZScpO1xyXG5jb25zdCBub3RlRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5vdGVfX2Zvb3RlcicpO1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG4gIHRvdWNoOiB7XHJcbiAgICBkb3duOiAndG91Y2hzdGFydCcsXHJcbiAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgIHVwOiAndG91Y2hlbmQnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxufTtcclxuXHJcbmxldCBkZXZpY2VUeXBlID0gJyc7XHJcblxyXG5jb25zdCBpc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgZGV2aWNlVHlwZSA9ICd0b3VjaCc7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbm5vdGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCBidXR0b25Db2xsYXBzZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2NvbGxhcHNlJyk7XHJcbiAgY29uc3QgYnV0dG9uRXhwYW5kID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZXhwYW5kJyk7XHJcbiAgY29uc3QgYnV0dG9uQ2xvc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19jbG9zZScpO1xyXG4gIGNvbnN0IG5vdGVXaW5kb3cgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX193aW5kb3cnKTtcclxuICBjb25zdCBub3RlSGVhZGVyID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9faGVhZGVyJyk7XHJcbiAgY29uc3Qgbm90ZUZpbGUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19maWxlJyk7XHJcblxyXG4gIGNvbnN0IG9wZW5XaW5kb3cgPSAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLmxlZnQgPSAnMjBweCc7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9ICcyMHB4JztcclxuICAgIHN0b3BNb3ZlbWVudCgpO1xyXG4gICAgbm90ZUZpbGUucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssb3BlbldpbmRvdyk7XHJcbiAgfTtcclxuXHJcbiAgbm90ZUZpbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssb3BlbldpbmRvdyk7XHJcblxyXG4gIGJ1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBjb25zdCBuZXdSZWZlcmVuY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgIG5ld1JlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdub3RlX19yZWZlcmVuY2UnKTtcclxuICAgIG5ld1JlZmVyZW5jZS50ZXh0Q29udGVudCA9IGl0ZW0uY2hpbGRyZW5bMF0udGV4dENvbnRlbnQ7XHJcbiAgICBub3RlRm9vdGVyLmFwcGVuZENoaWxkKG5ld1JlZmVyZW5jZSk7XHJcbiAgICBuZXdSZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgICAgbmV3UmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB9KTtcclxuICB9KTtcclxuXHJcbiAgYnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LmFkZCgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIG5vdGVGaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLG9wZW5XaW5kb3cpO1xyXG4gIH0pO1xyXG5cclxuICBidXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssICgpID0+IHtcclxuICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICB9KTtcclxuXHJcbiAgbm90ZVdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKCkgPT4ge1xyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDI7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICB9KTtcclxuXHJcbiAgbm90ZUhlYWRlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZXZ0KSA9PiB7XHJcbiAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAyO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgfSk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0b3BNb3ZlbWVudCgpIHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBvbk1vdmVFdmVudChldnQpIHtcclxuICAgIGlmIChtb3ZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIG5vdGVXaW5kb3cuc3R5bGUubGVmdCA9IGAke25vdGVXaW5kb3cub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpfXB4YDtcclxuICAgICAgbm90ZVdpbmRvdy5zdHlsZS50b3AgPSBgJHtub3RlV2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICB9XHJcbn0pO1xyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
