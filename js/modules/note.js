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

const desktopFooter = document.querySelector('.desktop__footer');
const referenceTemplate = document.querySelector('.reference');

// const file = document.querySelector('.file');
// for (let i = 0; i < 100; i++) {
//   const fileClone = file.cloneNode(true);
//   document.querySelector('.desktop__wrapper').appendChild(fileClone);
// }

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = item.querySelector('.window');
  const buttonCollapse = item.querySelector('.window__button--collapse');
  const buttonExpand = item.querySelector('.window__button--expand');
  const buttonClose = item.querySelector('.window__button--close');
  const windowDraggableArea = item.querySelector('.window__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
  const windowHeader = item.querySelector('.window__header');
  const windowPath = item.querySelector('.window__path');
  const fileName = item.querySelector('.file__name');
  const referenceText = reference.querySelector('.reference__text');
  const referenceIcon = item.querySelector('.file__icon').cloneNode(true);
  reference.insertBefore(referenceIcon, referenceText);
  const pathIcon = item.querySelector('.file__icon').cloneNode(true);
  if (windowPath) {
    windowDraggableArea.insertBefore(pathIcon, windowPath);
  }

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
    if (item.classList.contains('file--text')) {
      window.classList.remove('window--collapsed');
      fileLabel.classList.add('file__label--active');
      window.style.left = '50%';
      window.style.top = '50%';
      window.style.transform = 'translate(-50%, -50%)';
      referenceText.textContent = fileName.textContent;
      reference.addEventListener('click', onCollapseButton);
      reference.classList.add('reference--active');
      desktopFooter.appendChild(reference);
      fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
      stopMovement();
      setActive();
      placeOnTop();
    }
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

  if (fileLabel) {
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  }
  if (buttonCollapse) {
    buttonCollapse.addEventListener(events[deviceType].click, onCollapseButton);
  }
  if (buttonClose) {
    buttonClose.addEventListener(events[deviceType].click, onCloseButton);
  }
  if (buttonExpand) {
    buttonExpand.addEventListener(events[deviceType].click, onExpandButton);
  }
  if (window) {
    window.addEventListener(events[deviceType].down, onWindowClick);
  }
  if (windowDraggableArea) {
    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
  }
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGRlc2t0b3BGb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fZm9vdGVyJyk7XHJcbmNvbnN0IHJlZmVyZW5jZVRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZScpO1xyXG5cclxuLy8gY29uc3QgZmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWxlJyk7XHJcbi8vIGZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcclxuLy8gICBjb25zdCBmaWxlQ2xvbmUgPSBmaWxlLmNsb25lTm9kZSh0cnVlKTtcclxuLy8gICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fd3JhcHBlcicpLmFwcGVuZENoaWxkKGZpbGVDbG9uZSk7XHJcbi8vIH1cclxuXHJcbmxldCBsYXN0RmlsZTtcclxuXHJcbmNvbnN0IGZpbGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuXHJcbmZpbGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCB3aW5kb3cgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuICBjb25zdCBidXR0b25Db2xsYXBzZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpO1xyXG4gIGNvbnN0IGJ1dHRvbkV4cGFuZCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKTtcclxuICBjb25zdCBidXR0b25DbG9zZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jbG9zZScpO1xyXG4gIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgY29uc3QgZmlsZUxhYmVsID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbGFiZWwnKTtcclxuICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3Qgd2luZG93SGVhZGVyID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuICBjb25zdCB3aW5kb3dQYXRoID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgY29uc3QgZmlsZU5hbWUgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlVGV4dCA9IHJlZmVyZW5jZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlX190ZXh0Jyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICBjb25zdCBwYXRoSWNvbiA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgaWYgKHdpbmRvd1BhdGgpIHtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCB3aW5kb3dQYXRoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHBsYWNlT25Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICAgIHdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IHdpbmRvd0hlYWRlckxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93X19oZWFkZXInKTtcclxuICAgIHdpbmRvd0hlYWRlckxpc3QuZm9yRWFjaCgodGhpbmcpID0+IHtcclxuICAgICAgdGhpbmcuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93X19oZWFkZXItLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICB3aW5kb3dIZWFkZXIuY2xhc3NMaXN0LmFkZCgnd2luZG93X19oZWFkZXItLWFjdGl2ZScpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IHNldEFjdGl2ZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHJlZmVyZW5jZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJyk7XHJcbiAgICByZWZlcmVuY2VMaXN0LmZvckVhY2goKHJlZmVybmNlKSA9PiB7XHJcbiAgICAgIHJlZmVybmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uQ29sbGFwc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBzZXRBY3RpdmUoKTtcclxuICAgIGlmICh3aW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocmVmZXJlbmNlICE9PSBsYXN0RmlsZSkge1xyXG4gICAgICAgIHBsYWNlT25Ub3AoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRmlsZU9wZW4gPSAoKSA9PiB7XHJcbiAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLXRleHQnKSkge1xyXG4gICAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgICAgd2luZG93LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgd2luZG93LnN0eWxlLnRvcCA9ICc1MCUnO1xyXG4gICAgICB3aW5kb3cuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbiAgICAgIHJlZmVyZW5jZVRleHQudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICAgICAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICBkZXNrdG9wRm9vdGVyLmFwcGVuZENoaWxkKHJlZmVyZW5jZSk7XHJcbiAgICAgIGZpbGVMYWJlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICAgIHN0b3BNb3ZlbWVudCgpO1xyXG4gICAgICBzZXRBY3RpdmUoKTtcclxuICAgICAgcGxhY2VPblRvcCgpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICBmaWxlTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnRvZ2dsZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25XaW5kb3dDbGljayA9ICgpID0+IHtcclxuICAgIHNldEFjdGl2ZSgpO1xyXG4gICAgcGxhY2VPblRvcCgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGV2dCkgPT4ge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgd2luZG93LnN0eWxlLmxlZnQgPSBgJHt3aW5kb3cub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpfXB4YDtcclxuICAgICAgd2luZG93LnN0eWxlLnRvcCA9IGAke3dpbmRvdy5vZmZzZXRUb3AgLSAoaW5pdGlhbFkgLSBuZXdZKX1weGA7XHJcbiAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHN0b3BNb3ZlbWVudCgpIHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG9uV2luZG93RHJhZyA9IChldnQpID0+IHtcclxuICAgIGlmIChldnQuY2FuY2VsYWJsZSkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBpZiAoZmlsZUxhYmVsKSB7XHJcbiAgICBmaWxlTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH1cclxuICBpZiAoYnV0dG9uQ29sbGFwc2UpIHtcclxuICAgIGJ1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxuICB9XHJcbiAgaWYgKGJ1dHRvbkNsb3NlKSB7XHJcbiAgICBidXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25DbG9zZUJ1dHRvbik7XHJcbiAgfVxyXG4gIGlmIChidXR0b25FeHBhbmQpIHtcclxuICAgIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25FeHBhbmRCdXR0b24pO1xyXG4gIH1cclxuICBpZiAod2luZG93KSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dDbGljayk7XHJcbiAgfVxyXG4gIGlmICh3aW5kb3dEcmFnZ2FibGVBcmVhKSB7XHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93RHJhZyk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
