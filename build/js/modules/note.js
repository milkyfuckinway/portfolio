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
let initialWindowCounterVertical = 0;
let initialWindowCounterHorisontal = 0;
let offsetVerticalCounter = 0;
let offsetHorisontalCounter = 0;

const template = document.querySelector('.template');
const referenceTemplate = template.querySelector('.reference');
const windowTemplate = template.querySelector('.window');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const desktopWrapper = desktop.querySelector('.desktop__wrapper');

const file = document.querySelector('.file');
for (let i = 0; i < 100; i++) {
  const fileClone = file.cloneNode(true);
  document.querySelector('.desktop__wrapper').appendChild(fileClone);
}

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = windowTemplate.cloneNode(true);
  const windowDraggableArea = window.querySelector('.window__draggable-area');
  const windowHeader = window.querySelector('.window__header');
  const windowPath = window.querySelector('.window__path');
  const windowButtonCollapse = window.querySelector('.window__button--collapse');
  const windowButtonExpand = window.querySelector('.window__button--expand');
  const windowButtonClose = window.querySelector('.window__button--close');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
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
    const windowHeaderList = desktop.querySelectorAll('.window__header');
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

  function onFileOpen() {
    if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
      const fileContent = item.querySelector('.file__content');
      if (fileContent) {
        window.appendChild(fileContent);
        fileContent.classList.remove('visually-hidden');
        fileContent.classList.add('window__content');
        fileContent.classList.remove('file__content');
        if (item.classList.contains('file--folder')) {
          fileContent.classList.add('window--folder');
        }
      }
      desktop.appendChild(window);
      window.classList.remove('window--collapsed');
      fileLabel.classList.add('file__label--active');
      window.style.left = `${desktop.offsetWidth / 2 + initialWindowCounterHorisontal}px`;
      window.style.top = `${desktop.offsetHeight / 2 + initialWindowCounterVertical}px`;
      if (initialWindowCounterHorisontal + (desktopWrapper.offsetWidth - window.offsetWidth) / 2 + 10 + window.offsetWidth >= desktopWrapper.offsetWidth) {
        initialWindowCounterHorisontal = 0;
        offsetHorisontalCounter = 0;
        console.log(true, offsetHorisontalCounter);
      } else {
        initialWindowCounterHorisontal += 10;
        offsetHorisontalCounter += 1;
      }
      if (initialWindowCounterVertical + (desktopWrapper.offsetHeight - window.offsetHeight) / 2 + 30 + window.offsetHeight >= desktopWrapper.offsetHeight) {
        initialWindowCounterVertical = 0;
        offsetVerticalCounter = 0;
        console.log(true, offsetVerticalCounter);
      } else {
        initialWindowCounterVertical += 30;
        offsetVerticalCounter += 1;
      }
      window.style.transform = 'translate(-50%, -50%)';
      windowPath.textContent = `C:/${fileName.textContent}`;
      referenceText.textContent = fileName.textContent;
      reference.addEventListener('click', onCollapseButton);
      reference.classList.add('reference--active');
      desktopFooter.appendChild(reference);
      fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
      stopMovement();
      setActive();
      placeOnTop();
    }
  }

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
    window.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
    if (offsetVerticalCounter > 0) {
      offsetVerticalCounter -= 1;
      initialWindowCounterVertical -= 30;
    }
    if (offsetHorisontalCounter > 0) {
      offsetHorisontalCounter -= 1;
      initialWindowCounterHorisontal -= 10;
    }
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

  if (windowButtonCollapse) {
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);
  }

  if (windowButtonClose) {
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);
  }

  if (windowButtonExpand) {
    windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsID0gMDtcclxubGV0IG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbmxldCBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxuY29uc3Qgd2luZG93VGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcud2luZG93Jyk7XHJcbmNvbnN0IGRlc2t0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcCcpO1xyXG5jb25zdCBkZXNrdG9wRm9vdGVyID0gZGVza3RvcC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fZm9vdGVyJyk7XHJcbmNvbnN0IGRlc2t0b3BXcmFwcGVyID0gZGVza3RvcC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fd3JhcHBlcicpO1xyXG5cclxuY29uc3QgZmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5maWxlJyk7XHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwOyBpKyspIHtcclxuICBjb25zdCBmaWxlQ2xvbmUgPSBmaWxlLmNsb25lTm9kZSh0cnVlKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fd3JhcHBlcicpLmFwcGVuZENoaWxkKGZpbGVDbG9uZSk7XHJcbn1cclxuXHJcbmxldCBsYXN0RmlsZTtcclxuXHJcbmNvbnN0IGZpbGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuXHJcbmZpbGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCB3aW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3Qgd2luZG93RHJhZ2dhYmxlQXJlYSA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IHdpbmRvd0hlYWRlciA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuICBjb25zdCB3aW5kb3dQYXRoID0gd2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX3BhdGgnKTtcclxuICBjb25zdCB3aW5kb3dCdXR0b25Db2xsYXBzZSA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJyk7XHJcbiAgY29uc3Qgd2luZG93QnV0dG9uRXhwYW5kID0gd2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tZXhwYW5kJyk7XHJcbiAgY29uc3Qgd2luZG93QnV0dG9uQ2xvc2UgPSB3aW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jbG9zZScpO1xyXG4gIGNvbnN0IGZpbGVMYWJlbCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX2xhYmVsJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IGZpbGVOYW1lID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUljb24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUocmVmZXJlbmNlSWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgY29uc3QgcGF0aEljb24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuICBpZiAod2luZG93UGF0aCkge1xyXG4gICAgd2luZG93RHJhZ2dhYmxlQXJlYS5pbnNlcnRCZWZvcmUocGF0aEljb24sIHdpbmRvd1BhdGgpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcGxhY2VPblRvcCA9ICgpID0+IHtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAxO1xyXG4gICAgd2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIGxhc3RGaWxlID0gcmVmZXJlbmNlO1xyXG4gICAgY29uc3Qgd2luZG93SGVhZGVyTGlzdCA9IGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvd19faGVhZGVyJyk7XHJcbiAgICB3aW5kb3dIZWFkZXJMaXN0LmZvckVhY2goKHRoaW5nKSA9PiB7XHJcbiAgICAgIHRoaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvd19faGVhZGVyLS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93SGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19faGVhZGVyLS1hY3RpdmUnKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzZXRBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCByZWZlcmVuY2VMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpO1xyXG4gICAgcmVmZXJlbmNlTGlzdC5mb3JFYWNoKChyZWZlcm5jZSkgPT4ge1xyXG4gICAgICByZWZlcm5jZS5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBpZiAod2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgcGxhY2VPblRvcCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJlZmVyZW5jZSAhPT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBvbkZpbGVPcGVuKCkge1xyXG4gICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS10ZXh0JykgfHwgaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fY29udGVudCcpO1xyXG4gICAgICBpZiAoZmlsZUNvbnRlbnQpIHtcclxuICAgICAgICB3aW5kb3cuYXBwZW5kQ2hpbGQoZmlsZUNvbnRlbnQpO1xyXG4gICAgICAgIGZpbGVDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gICAgICAgIGZpbGVDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudCcpO1xyXG4gICAgICAgIGZpbGVDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2NvbnRlbnQnKTtcclxuICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICAgICAgICBmaWxlQ29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZvbGRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBkZXNrdG9wLmFwcGVuZENoaWxkKHdpbmRvdyk7XHJcbiAgICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgICB3aW5kb3cuc3R5bGUubGVmdCA9IGAke2Rlc2t0b3Aub2Zmc2V0V2lkdGggLyAyICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICAgICAgd2luZG93LnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gICAgICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsICsgKGRlc2t0b3BXcmFwcGVyLm9mZnNldFdpZHRoIC0gd2luZG93Lm9mZnNldFdpZHRoKSAvIDIgKyAxMCArIHdpbmRvdy5vZmZzZXRXaWR0aCA+PSBkZXNrdG9wV3JhcHBlci5vZmZzZXRXaWR0aCkge1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCA9IDA7XHJcbiAgICAgICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRydWUsIG9mZnNldEhvcmlzb250YWxDb3VudGVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKz0gMTA7XHJcbiAgICAgICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgKz0gMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wV3JhcHBlci5vZmZzZXRIZWlnaHQgLSB3aW5kb3cub2Zmc2V0SGVpZ2h0KSAvIDIgKyAzMCArIHdpbmRvdy5vZmZzZXRIZWlnaHQgPj0gZGVza3RvcFdyYXBwZXIub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbiAgICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxuICAgICAgICBjb25zb2xlLmxvZyh0cnVlLCBvZmZzZXRWZXJ0aWNhbENvdW50ZXIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKz0gMzA7XHJcbiAgICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgd2luZG93LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xyXG4gICAgICB3aW5kb3dQYXRoLnRleHRDb250ZW50ID0gYEM6LyR7ZmlsZU5hbWUudGV4dENvbnRlbnR9YDtcclxuICAgICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxuICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgICAgZmlsZUxhYmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgICAgIHNldEFjdGl2ZSgpO1xyXG4gICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgcmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgd2luZG93LnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgIGlmIChvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsIC09IDMwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgLT0gMTA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25FeHBhbmRCdXR0b24gPSAoKSA9PiB7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QudG9nZ2xlKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbldpbmRvd0NsaWNrID0gKCkgPT4ge1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBwbGFjZU9uVG9wKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlRXZlbnQgPSAoZXZ0KSA9PiB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICB3aW5kb3cuc3R5bGUubGVmdCA9IGAke3dpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICB3aW5kb3cuc3R5bGUudG9wID0gYCR7d2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gc3RvcE1vdmVtZW50KCkge1xyXG4gICAgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgb25XaW5kb3dEcmFnID0gKGV2dCkgPT4ge1xyXG4gICAgaWYgKGV2dC5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCF3aW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGlmIChmaWxlTGFiZWwpIHtcclxuICAgIGZpbGVMYWJlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgfVxyXG5cclxuICBpZiAod2luZG93QnV0dG9uQ29sbGFwc2UpIHtcclxuICAgIHdpbmRvd0J1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxuICB9XHJcblxyXG4gIGlmICh3aW5kb3dCdXR0b25DbG9zZSkge1xyXG4gICAgd2luZG93QnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ2xvc2VCdXR0b24pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvd0J1dHRvbkV4cGFuZCkge1xyXG4gICAgd2luZG93QnV0dG9uRXhwYW5kLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkV4cGFuZEJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBpZiAod2luZG93KSB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dDbGljayk7XHJcbiAgfVxyXG5cclxuICBpZiAod2luZG93RHJhZ2dhYmxlQXJlYSkge1xyXG4gICAgd2luZG93RHJhZ2dhYmxlQXJlYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCBvbldpbmRvd0RyYWcpO1xyXG4gIH1cclxufSk7XHJcblxyXG5kZXNrdG9wRm9vdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2dCkgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGRlc2t0b3BGb290ZXIuc2Nyb2xsTGVmdCArPSBldnQuZGVsdGFZO1xyXG59KTtcclxuIl0sImZpbGUiOiJub3RlLmpzIn0=
