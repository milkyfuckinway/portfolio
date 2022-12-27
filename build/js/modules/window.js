import { throttle } from './throttle.js';
import { isTouchDevice, deviceType } from './checkDeviceType.js';

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

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const referenceTemplate = template.querySelector('.reference');
const desktopWidth = desktop.offsetWidth;
const desktopHeight = desktop.offsetHeight;
const halfDesktopWidth = desktopWidth / 2;
const halfDesktopHeight = desktopHeight / 2;

const coefficientWidth = () => {
  if (desktopWidth < 500) {
    return 0.9;
  } else {
    return 0.5;
  }
};

const coefficientHeight = () => {
  if (desktopWidth < 500) {
    return 0.7;
  } else {
    return 0.5;
  }
};

const windowWidth = Math.round(window.innerWidth * coefficientWidth());
const windowHeight = Math.round(window.innerHeight * coefficientHeight());

const fileList = document.querySelectorAll('.file');
fileList[1].children[0].classList.add('file__label--active');

let initialIndex = 0;
let initialX = 0;
let initialY = 0;
let lastReference;
let moveElement = false;
let initialWindowCounterVertical = 0;
let initialWindowCounterHorizontal = 0;
let offsetVerticalCounter = 0;
let offsetHorizontalCounter = 0;

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${halfDesktopWidth + initialWindowCounterHorizontal}px`;
  elem.style.top = `${halfDesktopHeight + initialWindowCounterVertical}px`;
  elem.style.width = `${windowWidth}px`;
  elem.style.height = `${windowHeight}px`;
  if (initialWindowCounterHorizontal + (desktopWidth - windowWidth) / 2 + 10 + windowWidth >= desktopWidth) {
    initialWindowCounterHorizontal = 0;
    offsetHorizontalCounter = 0;
  } else {
    initialWindowCounterHorizontal += 8;
    offsetHorizontalCounter += 1;
  }
  if (initialWindowCounterVertical + (desktopHeight - windowHeight) / 2 + 30 + windowHeight >= desktopHeight) {
    initialWindowCounterVertical = 0;
    offsetVerticalCounter = 0;
  } else {
    initialWindowCounterVertical += 40;
    offsetVerticalCounter += 1;
  }
};

const onFileOpen = (evt) => {
  evt.preventDefault();
  evt.target.classList.remove('file');
  evt.target.classList.add('file--opened');
  const fileLabel = evt.target.querySelector('.file__label');
  const fileName = evt.target.querySelector('.file__name');
  const fileIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  fileIcon.classList.remove('file__icon--desktop');
  const newWindow = windowTemplate.cloneNode(true);
  const newWindowPath = newWindow.querySelector('.window__path');
  const windowHeader = newWindow.querySelector('.window__header');
  const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
  const reference = referenceTemplate.cloneNode(true);
  newWindowPath.textContent = fileName.textContent;
  windowDraggableArea.insertBefore(fileIcon, newWindowPath);
  desktop.appendChild(newWindow);
  setStartPosition(newWindow);
  fileLabel.classList.add('file__label--active');
  const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
  newWindow.appendChild(clonedTargetContent);
  clonedTargetContent.classList.remove('visually-hidden');
  clonedTargetContent.classList.add('window__content');
  clonedTargetContent.classList.remove('file__content');
  if (evt.target.classList.contains('file--folder')) {
    clonedTargetContent.classList.add('grid--folder');
  }

  const setCurrentWindowActive = () => {
    lastReference = reference;
    const newIndex = initialIndex + 1;
    newWindow.style.zIndex = `${newIndex}`;
    initialIndex = newIndex;
    reference.classList.add('reference--active');
    desktop.querySelectorAll('.window--active').forEach((a) => {
      a.classList.remove('window--active');
    });
    newWindow.classList.add('window--active');
    desktop.querySelectorAll('.reference').forEach((b) => {
      if (b === lastReference) {
        b.classList.add('reference--active');
      } else {
        b.classList.remove('reference--active');
      }
    });
  };

  setCurrentWindowActive();

  const onMoveEvent = (e) => {
    if (moveElement) {
      e.stopPropagation();
      const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      const calcX = initialX - newX;
      const calcY = initialY - newY;
      const leftPosition = `${newWindow.offsetLeft - calcX}px`;
      const topPosition = `${newWindow.offsetTop - calcY}px`;
      newWindow.style.left = leftPosition;
      newWindow.style.top = topPosition;
      initialX = newX;
      initialY = newY;
    }
  };

  const onMoveThrottled = throttle(onMoveEvent, 10);

  const onMoveStop = () => {
    document.removeEventListener(events[deviceType].move, onMoveThrottled);
    document.removeEventListener(events[deviceType].up, onMoveStop);
    moveElement = false;
  };

  const onWindowDrag = (e) => {
    setCurrentWindowActive();
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
    if (!newWindow.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveThrottled);
      document.addEventListener(events[deviceType].up, onMoveStop);
    }
  };

  const onCollapseButton = () => {
    if (newWindow.classList.contains('window--collapsed')) {
      newWindow.classList.remove('window--collapsed');
      setCurrentWindowActive();
    } else {
      if (reference === lastReference) {
        newWindow.classList.add('window--collapsed');
      } else {
        setCurrentWindowActive();
      }
    }
  };

  const onExpandButton = () => {
    setCurrentWindowActive(reference, newWindow);
    if (newWindow.classList.contains('window--fullscreen')) {
      newWindow.classList.remove('window--fullscreen');
    } else {
      newWindow.classList.add('window--fullscreen');
    }
  };

  const onCloseButton = () => {
    evt.target.classList.add('file');
    evt.target.classList.remove('file--opened');
    setCurrentWindowActive();
    newWindow.remove();
    reference.remove();
    fileLabel.classList.remove('file__label--active');
    if (offsetVerticalCounter > 0) {
      offsetVerticalCounter -= 1;
      initialWindowCounterVertical -= 30;
    }
    if (offsetHorizontalCounter > 0) {
      offsetHorizontalCounter -= 1;
      initialWindowCounterHorizontal -= 10;
    }
  };

  const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  referenceIcon.classList.remove('file__icon--desktop');
  const referenceText = reference.querySelector('.reference__text');
  referenceText.textContent = fileName.textContent;
  reference.insertBefore(referenceIcon, referenceText);
  desktopFooter.appendChild(reference);
  reference.addEventListener(events[deviceType].click, onCollapseButton);

  newWindow.addEventListener(events[deviceType].down, (e) => {
    if (e.target.closest('.window__draggable-area')) {
      onWindowDrag(e);
    }
    if (e.target.closest('.window__content')) {
      setCurrentWindowActive();
    }
  });

  newWindow.addEventListener(events[deviceType].click, (e) => {
    if (e.target.closest('.window__button--collapse')) {
      onCollapseButton();
    }
    if (e.target.closest('.window__button--close')) {
      onCloseButton();
    }
    if (e.target.closest('.window__button--expand')) {
      onExpandButton();
    }
  });
};

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

desktop.addEventListener(events[deviceType].click, (evt) => {
  if (evt.target.closest('.file') && !evt.target.closest('.file--link')) {
    onFileOpen(evt);
  }
});

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBpc1RvdWNoRGV2aWNlLCBkZXZpY2VUeXBlIH0gZnJvbSAnLi9jaGVja0RldmljZVR5cGUuanMnO1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcGxhdGUnKTtcclxuY29uc3QgZGVza3RvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wJyk7XHJcbmNvbnN0IGRlc2t0b3BGb290ZXIgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wX19mb290ZXInKTtcclxuY29uc3Qgd2luZG93VGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcud2luZG93Jyk7XHJcbmNvbnN0IHJlZmVyZW5jZVRlbXBsYXRlID0gdGVtcGxhdGUucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZScpO1xyXG5jb25zdCBkZXNrdG9wV2lkdGggPSBkZXNrdG9wLm9mZnNldFdpZHRoO1xyXG5jb25zdCBkZXNrdG9wSGVpZ2h0ID0gZGVza3RvcC5vZmZzZXRIZWlnaHQ7XHJcbmNvbnN0IGhhbGZEZXNrdG9wV2lkdGggPSBkZXNrdG9wV2lkdGggLyAyO1xyXG5jb25zdCBoYWxmRGVza3RvcEhlaWdodCA9IGRlc2t0b3BIZWlnaHQgLyAyO1xyXG5cclxuY29uc3QgY29lZmZpY2llbnRXaWR0aCA9ICgpID0+IHtcclxuICBpZiAoZGVza3RvcFdpZHRoIDwgNTAwKSB7XHJcbiAgICByZXR1cm4gMC45O1xyXG4gIH0gZWxzZSB7XHJcbiAgICByZXR1cm4gMC41O1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IGNvZWZmaWNpZW50SGVpZ2h0ID0gKCkgPT4ge1xyXG4gIGlmIChkZXNrdG9wV2lkdGggPCA1MDApIHtcclxuICAgIHJldHVybiAwLjc7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAwLjU7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgd2luZG93V2lkdGggPSBNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoICogY29lZmZpY2llbnRXaWR0aCgpKTtcclxuY29uc3Qgd2luZG93SGVpZ2h0ID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJIZWlnaHQgKiBjb2VmZmljaWVudEhlaWdodCgpKTtcclxuXHJcbmNvbnN0IGZpbGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuZmlsZUxpc3RbMV0uY2hpbGRyZW5bMF0uY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG5cclxubGV0IGluaXRpYWxJbmRleCA9IDA7XHJcbmxldCBpbml0aWFsWCA9IDA7XHJcbmxldCBpbml0aWFsWSA9IDA7XHJcbmxldCBsYXN0UmVmZXJlbmNlO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsID0gMDtcclxubGV0IG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbmxldCBvZmZzZXRIb3Jpem9udGFsQ291bnRlciA9IDA7XHJcblxyXG5jb25zdCBzZXRTdGFydFBvc2l0aW9uID0gKGVsZW0pID0+IHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgZWxlbS5zdHlsZS5sZWZ0ID0gYCR7aGFsZkRlc2t0b3BXaWR0aCArIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXpvbnRhbH1weGA7XHJcbiAgZWxlbS5zdHlsZS50b3AgPSBgJHtoYWxmRGVza3RvcEhlaWdodCArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUud2lkdGggPSBgJHt3aW5kb3dXaWR0aH1weGA7XHJcbiAgZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHt3aW5kb3dIZWlnaHR9cHhgO1xyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWwgKyAoZGVza3RvcFdpZHRoIC0gd2luZG93V2lkdGgpIC8gMiArIDEwICsgd2luZG93V2lkdGggPj0gZGVza3RvcFdpZHRoKSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWwgPSAwO1xyXG4gICAgb2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWwgKz0gODtcclxuICAgIG9mZnNldEhvcml6b250YWxDb3VudGVyICs9IDE7XHJcbiAgfVxyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsICsgKGRlc2t0b3BIZWlnaHQgLSB3aW5kb3dIZWlnaHQpIC8gMiArIDMwICsgd2luZG93SGVpZ2h0ID49IGRlc2t0b3BIZWlnaHQpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG4gICAgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArPSA0MDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciArPSAxO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IG9uRmlsZU9wZW4gPSAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlJyk7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlLS1vcGVuZWQnKTtcclxuICBjb25zdCBmaWxlTGFiZWwgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gIGNvbnN0IGZpbGVJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICBmaWxlSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19pY29uLS1kZXNrdG9wJyk7XHJcbiAgY29uc3QgbmV3V2luZG93ID0gd2luZG93VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IG5ld1dpbmRvd1BhdGggPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fcGF0aCcpO1xyXG4gIGNvbnN0IHdpbmRvd0hlYWRlciA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuICBjb25zdCB3aW5kb3dEcmFnZ2FibGVBcmVhID0gd2luZG93SGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIG5ld1dpbmRvd1BhdGgudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICB3aW5kb3dEcmFnZ2FibGVBcmVhLmluc2VydEJlZm9yZShmaWxlSWNvbiwgbmV3V2luZG93UGF0aCk7XHJcbiAgZGVza3RvcC5hcHBlbmRDaGlsZChuZXdXaW5kb3cpO1xyXG4gIHNldFN0YXJ0UG9zaXRpb24obmV3V2luZG93KTtcclxuICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gIGNvbnN0IGNsb25lZFRhcmdldENvbnRlbnQgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19jb250ZW50JykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIG5ld1dpbmRvdy5hcHBlbmRDaGlsZChjbG9uZWRUYXJnZXRDb250ZW50KTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50Jyk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19jb250ZW50Jyk7XHJcbiAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS1mb2xkZXInKSkge1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCdncmlkLS1mb2xkZXInKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHNldEN1cnJlbnRXaW5kb3dBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBsYXN0UmVmZXJlbmNlID0gcmVmZXJlbmNlO1xyXG4gICAgY29uc3QgbmV3SW5kZXggPSBpbml0aWFsSW5kZXggKyAxO1xyXG4gICAgbmV3V2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld0luZGV4fWA7XHJcbiAgICBpbml0aWFsSW5kZXggPSBuZXdJbmRleDtcclxuICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93LS1hY3RpdmUnKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgIGEuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWZlcmVuY2UnKS5mb3JFYWNoKChiKSA9PiB7XHJcbiAgICAgIGlmIChiID09PSBsYXN0UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgYi5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGIuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG5cclxuICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgY29uc3QgY2FsY1ggPSBpbml0aWFsWCAtIG5ld1g7XHJcbiAgICAgIGNvbnN0IGNhbGNZID0gaW5pdGlhbFkgLSBuZXdZO1xyXG4gICAgICBjb25zdCBsZWZ0UG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0TGVmdCAtIGNhbGNYfXB4YDtcclxuICAgICAgY29uc3QgdG9wUG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gY2FsY1l9cHhgO1xyXG4gICAgICBuZXdXaW5kb3cuc3R5bGUubGVmdCA9IGxlZnRQb3NpdGlvbjtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLnRvcCA9IHRvcFBvc2l0aW9uO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbk1vdmVUaHJvdHRsZWQgPSB0aHJvdHRsZShvbk1vdmVFdmVudCwgMTApO1xyXG5cclxuICBjb25zdCBvbk1vdmVTdG9wID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlVGhyb3R0bGVkKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25XaW5kb3dEcmFnID0gKGUpID0+IHtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZVRocm90dGxlZCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tY29sbGFwc2VkJykpIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChyZWZlcmVuY2UgPT09IGxhc3RSZWZlcmVuY2UpIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUocmVmZXJlbmNlLCBuZXdXaW5kb3cpO1xyXG4gICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlJyk7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgbmV3V2luZG93LnJlbW92ZSgpO1xyXG4gICAgcmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIGlmIChvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsIC09IDMwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9mZnNldEhvcml6b250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRIb3Jpem9udGFsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWwgLT0gMTA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgcmVmZXJlbmNlSWNvbi5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19pY29uLS1kZXNrdG9wJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlVGV4dCA9IHJlZmVyZW5jZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlX190ZXh0Jyk7XHJcbiAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUocmVmZXJlbmNlSWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgZGVza3RvcEZvb3Rlci5hcHBlbmRDaGlsZChyZWZlcmVuY2UpO1xyXG4gIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZSkgPT4ge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJykpIHtcclxuICAgICAgb25XaW5kb3dEcmFnKGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2NvbnRlbnQnKSkge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJykpIHtcclxuICAgICAgb25Db2xsYXBzZUJ1dHRvbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKSkge1xyXG4gICAgICBvbkNsb3NlQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKSkge1xyXG4gICAgICBvbkV4cGFuZEJ1dHRvbigpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBkZXNrdG9wRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxufSk7XHJcblxyXG5kZXNrdG9wLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmZpbGUnKSAmJiAhZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmlsZS0tbGluaycpKSB7XHJcbiAgICBvbkZpbGVPcGVuKGV2dCk7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJ3aW5kb3cuanMifQ==
