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

let initialX = 0;
let initialY = 0;
let initialzIndex = 0;
let moveElement = false;

const file = document.querySelector('.file');
const desktopFooter = document.querySelector('.desktop__footer');
const referenceTemplate = document.querySelector('.reference');

for (let i = 0; i < 100; i++) {
  const fileClone = file.cloneNode(true);
  document.querySelector('.desktop__wrapper').appendChild(fileClone);
}

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = item.querySelector('.window');
  const buttonCollapse = item.querySelector('.window__button--collapse');
  const buttonExpand = item.querySelector('.window__button--expand');
  const buttonClose = item.querySelector('.window__button--close');
  const noteDraggableArea = item.querySelector('.window__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
  const icon = item.querySelector('.file__icon').cloneNode(true);
  const windowHeader = item.querySelector('.window__header');

  const placeOnTop = () => {
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    lastFile = reference;
    const windowHeaderList = document.querySelectorAll('.window__header');
    windowHeaderList.forEach((thing) => {
      thing.classList.remove('window__header--active');
    });
    windowHeader.classList.add('window__header--active');
  };

  const setActive = () => {
    const referenceList = document.querySelectorAll('.reference');
    referenceList.forEach((refernce) => {
      refernce.classList.remove('reference--active');
    });
    reference.classList.add('reference--active');
  };

  const onCollapseButton = () => {
    setActive();
    if (window.classList.contains('window--collapsed')) {
      window.classList.remove('window--collapsed');
      placeOnTop();
    } else {
      if (reference !== lastFile) {
        placeOnTop();
      } else {
        window.classList.add('window--collapsed');
      }
    }
  };

  const onFileOpen = () => {
    const referenceText = reference.querySelector('.reference__text');
    window.classList.remove('window--collapsed');
    fileLabel.classList.add('file__label--active');
    window.style.left = '50%';
    window.style.top = '50%';
    window.style.transform = 'translate(-50%, -50%)';
    referenceText.textContent =
      item.querySelector('.file__name').textContent;
    reference.addEventListener('click', onCollapseButton);
    reference.classList.add('reference--active');
    reference.insertBefore(icon, referenceText);
    desktopFooter.appendChild(reference);
    fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
    stopMovement();
    setActive();
    placeOnTop();
  };

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  };

  const onExpandButton = () => {
    window.classList.remove('window--collapsed');
    window.classList.toggle('window--fullscreen');
  };

  const onWindowClick = () => {
    setActive();
    placeOnTop();
  };

  const onMoveEvent = (evt) => {
    if (moveElement) {
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      window.style.left = `${window.offsetLeft - (initialX - newX)}px`;
      window.style.top = `${window.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  };

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
    document.removeEventListener(events[deviceType].up, stopMovement);
  }

  const onWindowDrag = (evt) => {
    if (evt.cancelable) {
      evt.preventDefault();
    }
    if (!window.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveEvent);
      document.addEventListener(events[deviceType].up, stopMovement);
    }
  };

  fileLabel.addEventListener(events[deviceType].click, onFileOpen);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapseButton);

  buttonClose.addEventListener(events[deviceType].click, onCloseButton);

  buttonExpand.addEventListener(events[deviceType].click, onExpandButton);

  window.addEventListener(events[deviceType].down, onWindowClick);

  noteDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZScpO1xyXG5jb25zdCBkZXNrdG9wRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcclxuICBjb25zdCBmaWxlQ2xvbmUgPSBmaWxlLmNsb25lTm9kZSh0cnVlKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fd3JhcHBlcicpLmFwcGVuZENoaWxkKGZpbGVDbG9uZSk7XHJcbn1cclxuXHJcbmxldCBsYXN0RmlsZTtcclxuXHJcbmNvbnN0IGZpbGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuXHJcbmZpbGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCB3aW5kb3cgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuICBjb25zdCBidXR0b25Db2xsYXBzZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpO1xyXG4gIGNvbnN0IGJ1dHRvbkV4cGFuZCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKTtcclxuICBjb25zdCBidXR0b25DbG9zZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jbG9zZScpO1xyXG4gIGNvbnN0IG5vdGVEcmFnZ2FibGVBcmVhID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IGZpbGVMYWJlbCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX2xhYmVsJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IGljb24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IHdpbmRvd0hlYWRlciA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcblxyXG4gIGNvbnN0IHBsYWNlT25Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICAgIHdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IHdpbmRvd0hlYWRlckxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93X19oZWFkZXInKTtcclxuICAgIHdpbmRvd0hlYWRlckxpc3QuZm9yRWFjaCgodGhpbmcpID0+IHtcclxuICAgICAgdGhpbmcuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93X19oZWFkZXItLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICB3aW5kb3dIZWFkZXIuY2xhc3NMaXN0LmFkZCgnd2luZG93X19oZWFkZXItLWFjdGl2ZScpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNldEFjdGl2ZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHJlZmVyZW5jZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJyk7XHJcbiAgICByZWZlcmVuY2VMaXN0LmZvckVhY2goKHJlZmVybmNlKSA9PiB7XHJcbiAgICAgIHJlZmVybmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uQ29sbGFwc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBzZXRBY3RpdmUoKTtcclxuICAgIGlmICh3aW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocmVmZXJlbmNlICE9PSBsYXN0RmlsZSkge1xyXG4gICAgICAgIHBsYWNlT25Ub3AoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRmlsZU9wZW4gPSAoKSA9PiB7XHJcbiAgICBjb25zdCByZWZlcmVuY2VUZXh0ID0gcmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2VfX3RleHQnKTtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIHdpbmRvdy5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICB3aW5kb3cuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICB3aW5kb3cuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbiAgICByZWZlcmVuY2VUZXh0LnRleHRDb250ZW50ID1cclxuICAgICAgaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUoaWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgICBkZXNrdG9wRm9vdGVyLmFwcGVuZENoaWxkKHJlZmVyZW5jZSk7XHJcbiAgICBmaWxlTGFiZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgICBzZXRBY3RpdmUoKTtcclxuICAgIHBsYWNlT25Ub3AoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgcmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC50b2dnbGUoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uV2luZG93Q2xpY2sgPSAoKSA9PiB7XHJcbiAgICBzZXRBY3RpdmUoKTtcclxuICAgIHBsYWNlT25Ub3AoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbk1vdmVFdmVudCA9IChldnQpID0+IHtcclxuICAgIGlmIChtb3ZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIHdpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7d2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIHdpbmRvdy5zdHlsZS50b3AgPSBgJHt3aW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBzdG9wTW92ZW1lbnQoKSB7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBvbldpbmRvd0RyYWcgPSAoZXZ0KSA9PiB7XHJcbiAgICBpZiAoZXZ0LmNhbmNlbGFibGUpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZmlsZUxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuXHJcbiAgYnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG5cclxuICBidXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25DbG9zZUJ1dHRvbik7XHJcblxyXG4gIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25FeHBhbmRCdXR0b24pO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dDbGljayk7XHJcblxyXG4gIG5vdGVEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93RHJhZyk7XHJcbn0pO1xyXG5cclxuZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBkZXNrdG9wRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxufSk7XHJcbiJdLCJmaWxlIjoibm90ZS5qcyJ9
