import { throttle } from './throttle.js';
import { events, isTouchDevice, deviceType } from './checkDeviceType.js';

isTouchDevice();

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const referenceTemplate = template.querySelector('.reference');
const desktopWidth = desktop.offsetWidth;
const desktopHeight = desktop.offsetHeight;
const halfDesktopWidth = desktopWidth / 2;
const halfDesktopHeight = desktopHeight / 2;
const windowWidth = Math.round(window.innerWidth * 0.7);
const windowHeight = Math.round(window.innerHeight * 0.7);

let initialzIndex = 0;
let initialX = 0;
let initialY = 0;
let lastReference;
let moveElement = false;
let initialWindowCounterVertical = 0;
let initialWindowCounterHorisontal = 0;
let offsetVerticalCounter = 0;
let offsetHorisontalCounter = 0;

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${halfDesktopWidth + initialWindowCounterHorisontal}px`;
  elem.style.top = `${halfDesktopHeight + initialWindowCounterVertical}px`;
  elem.style.width = `${windowWidth}px`;
  elem.style.height = `${windowHeight}px`;
  if (initialWindowCounterHorisontal + (desktopWidth - windowWidth) / 2 + 10 + windowWidth >= desktopWidth) {
    initialWindowCounterHorisontal = 0;
    offsetHorisontalCounter = 0;
  } else {
    initialWindowCounterHorisontal += 10;
    offsetHorisontalCounter += 1;
  }
  if (initialWindowCounterVertical + (desktopHeight - windowHeight) / 2 + 30 + windowHeight >= desktopHeight) {
    initialWindowCounterVertical = 0;
    offsetVerticalCounter = 0;
  } else {
    initialWindowCounterVertical += 30;
    offsetVerticalCounter += 1;
  }
};

const onFileOpen = (evt) => {
  evt.target.classList.remove('file');
  evt.target.classList.add('file--opened');
  const fileLabel = evt.target.querySelector('.file__label');
  const fileName = evt.target.querySelector('.file__name');
  const pathIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  const newWindow = windowTemplate.cloneNode(true);
  const newWindowPath = newWindow.querySelector('.window__path');
  const windowHeader = newWindow.querySelector('.window__header');
  const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
  const reference = referenceTemplate.cloneNode(true);
  newWindowPath.textContent = fileName.textContent;
  windowDraggableArea.insertBefore(pathIcon, newWindowPath);
  desktop.appendChild(newWindow);
  setStartPosition(newWindow);
  fileLabel.classList.add('file__label--active');
  const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
  newWindow.appendChild(clonedTargetContent);
  clonedTargetContent.classList.remove('visually-hidden');
  clonedTargetContent.classList.add('window__content');
  clonedTargetContent.classList.remove('file__content');
  if (evt.target.classList.contains('file--folder')) {
    clonedTargetContent.classList.add('window__content--folder');
  }

  const setCurrentWindowActive = () => {
    lastReference = reference;
    const newzIndex = initialzIndex + 1;
    newWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
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
    fileLabel.classList.remove('file__label--active');
    if (offsetVerticalCounter > 0) {
      offsetVerticalCounter -= 1;
      initialWindowCounterVertical -= 30;
    }
    if (offsetHorisontalCounter > 0) {
      offsetHorisontalCounter -= 1;
      initialWindowCounterHorisontal -= 10;
    }
  };

  const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlJyk7XHJcbmNvbnN0IGRlc2t0b3BXaWR0aCA9IGRlc2t0b3Aub2Zmc2V0V2lkdGg7XHJcbmNvbnN0IGRlc2t0b3BIZWlnaHQgPSBkZXNrdG9wLm9mZnNldEhlaWdodDtcclxuY29uc3QgaGFsZkRlc2t0b3BXaWR0aCA9IGRlc2t0b3BXaWR0aCAvIDI7XHJcbmNvbnN0IGhhbGZEZXNrdG9wSGVpZ2h0ID0gZGVza3RvcEhlaWdodCAvIDI7XHJcbmNvbnN0IHdpbmRvd1dpZHRoID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNyk7XHJcbmNvbnN0IHdpbmRvd0hlaWdodCA9IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0ICogMC43KTtcclxuXHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGxhc3RSZWZlcmVuY2U7XHJcbmxldCBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbmxldCBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG5sZXQgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxubGV0IG9mZnNldEhvcmlzb250YWxDb3VudGVyID0gMDtcclxuXHJcbmNvbnN0IHNldFN0YXJ0UG9zaXRpb24gPSAoZWxlbSkgPT4ge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICBlbGVtLnN0eWxlLmxlZnQgPSBgJHtoYWxmRGVza3RvcFdpZHRoICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2hhbGZEZXNrdG9wSGVpZ2h0ICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbH1weGA7XHJcbiAgZWxlbS5zdHlsZS53aWR0aCA9IGAke3dpbmRvd1dpZHRofXB4YDtcclxuICBlbGVtLnN0eWxlLmhlaWdodCA9IGAke3dpbmRvd0hlaWdodH1weGA7XHJcbiAgaWYgKGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCArIChkZXNrdG9wV2lkdGggLSB3aW5kb3dXaWR0aCkgLyAyICsgMTAgKyB3aW5kb3dXaWR0aCA+PSBkZXNrdG9wV2lkdGgpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCA9IDA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCArPSAxMDtcclxuICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyICs9IDE7XHJcbiAgfVxyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsICsgKGRlc2t0b3BIZWlnaHQgLSB3aW5kb3dIZWlnaHQpIC8gMiArIDMwICsgd2luZG93SGVpZ2h0ID49IGRlc2t0b3BIZWlnaHQpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG4gICAgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArPSAzMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciArPSAxO1xyXG4gIH1cclxufTtcclxuXHJcbmNvbnN0IG9uRmlsZU9wZW4gPSAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlJyk7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlLS1vcGVuZWQnKTtcclxuICBjb25zdCBmaWxlTGFiZWwgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gIGNvbnN0IHBhdGhJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCBuZXdXaW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3QgbmV3V2luZG93UGF0aCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgY29uc3Qgd2luZG93SGVhZGVyID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2hlYWRlcicpO1xyXG4gIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSB3aW5kb3dIZWFkZXIucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgbmV3V2luZG93UGF0aC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCBuZXdXaW5kb3dQYXRoKTtcclxuICBkZXNrdG9wLmFwcGVuZENoaWxkKG5ld1dpbmRvdyk7XHJcbiAgc2V0U3RhcnRQb3NpdGlvbihuZXdXaW5kb3cpO1xyXG4gIGZpbGVMYWJlbC5jbGFzc0xpc3QuYWRkKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgY29uc3QgY2xvbmVkVGFyZ2V0Q29udGVudCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2NvbnRlbnQnKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgbmV3V2luZG93LmFwcGVuZENoaWxkKGNsb25lZFRhcmdldENvbnRlbnQpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgndmlzdWFsbHktaGlkZGVuJyk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQnKTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2NvbnRlbnQnKTtcclxuICBpZiAoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudC0tZm9sZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBzZXRDdXJyZW50V2luZG93QWN0aXZlID0gKCkgPT4ge1xyXG4gICAgbGFzdFJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAxO1xyXG4gICAgbmV3V2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93LS1hY3RpdmUnKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgIGEuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWZlcmVuY2UnKS5mb3JFYWNoKChiKSA9PiB7XHJcbiAgICAgIGlmIChiID09PSBsYXN0UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgYi5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGIuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG5cclxuICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgY29uc3QgY2FsY1ggPSBpbml0aWFsWCAtIG5ld1g7XHJcbiAgICAgIGNvbnN0IGNhbGNZID0gaW5pdGlhbFkgLSBuZXdZO1xyXG4gICAgICBjb25zdCBsZWZ0UG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0TGVmdCAtIGNhbGNYfXB4YDtcclxuICAgICAgY29uc3QgdG9wUG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gY2FsY1l9cHhgO1xyXG4gICAgICBuZXdXaW5kb3cuc3R5bGUubGVmdCA9IGxlZnRQb3NpdGlvbjtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLnRvcCA9IHRvcFBvc2l0aW9uO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbk1vdmVUaHJvdHRsZWQgPSB0aHJvdHRsZShvbk1vdmVFdmVudCwgMTApO1xyXG5cclxuICBjb25zdCBvbk1vdmVTdG9wID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlVGhyb3R0bGVkKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25XaW5kb3dEcmFnID0gKGUpID0+IHtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZVRocm90dGxlZCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tY29sbGFwc2VkJykpIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChyZWZlcmVuY2UgPT09IGxhc3RSZWZlcmVuY2UpIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUocmVmZXJlbmNlLCBuZXdXaW5kb3cpO1xyXG4gICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlJyk7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgbmV3V2luZG93LnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIGlmIChvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsIC09IDMwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgLT0gMTA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3QgcmVmZXJlbmNlVGV4dCA9IHJlZmVyZW5jZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlX190ZXh0Jyk7XHJcbiAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUocmVmZXJlbmNlSWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgZGVza3RvcEZvb3Rlci5hcHBlbmRDaGlsZChyZWZlcmVuY2UpO1xyXG4gIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZSkgPT4ge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJykpIHtcclxuICAgICAgb25XaW5kb3dEcmFnKGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2NvbnRlbnQnKSkge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJykpIHtcclxuICAgICAgb25Db2xsYXBzZUJ1dHRvbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKSkge1xyXG4gICAgICBvbkNsb3NlQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKSkge1xyXG4gICAgICBvbkV4cGFuZEJ1dHRvbigpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBkZXNrdG9wRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxufSk7XHJcblxyXG5kZXNrdG9wLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoZXZ0KSA9PiB7XHJcbiAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLmZpbGUnKSAmJiAhZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmlsZS0tbGluaycpKSB7XHJcbiAgICBvbkZpbGVPcGVuKGV2dCk7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJ3aW5kb3cuanMifQ==
