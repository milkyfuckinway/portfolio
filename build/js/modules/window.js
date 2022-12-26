import { throttle } from './throttle.js';
import { events, isTouchDevice, deviceType } from './checkDeviceType.js';

isTouchDevice();

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const referenceTemplate = template.querySelector('.reference');
let initialzIndex = 0;
let initialX = 0;
let initialY = 0;
let lastFile;
let moveElement = false;
let initialWindowCounterVertical = 0;
let initialWindowCounterHorisontal = 0;
let offsetVerticalCounter = 0;
let offsetHorisontalCounter = 0;
const desktopWidth = desktop.offsetWidth;
const desktopHeight = desktop.offsetHeight;
const halfDesktopWidth = desktopWidth / 2;
const halfDesktopHeight = desktopHeight / 2;
const windowWidth = Math.round(window.innerWidth * 0.7);
const windowHeight = Math.round(window.innerHeight * 0.7);

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

desktop.addEventListener(events[deviceType].click, (evt) => {
  if (evt.target.closest('.file')) {
    onFileOpen(evt);
  }
  if (evt.target.closest('.reference')) {
    console.log('reference');
  }
});

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

function onFileOpen(evt) {
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

  const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
  newWindow.appendChild(clonedTargetContent);
  clonedTargetContent.classList.remove('visually-hidden');
  clonedTargetContent.classList.add('window__content');
  clonedTargetContent.classList.remove('file__content');
  if (evt.target.classList.contains('file--folder')) {
    clonedTargetContent.classList.add('window__content--folder');
  }

  const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  newWindowPath.textContent = fileName.textContent;
  windowDraggableArea.insertBefore(pathIcon, newWindowPath);
  desktop.appendChild(newWindow);
  setStartPosition(newWindow);
  fileLabel.classList.add('file__label--active');

  const setCurrentWindowActive = () => {
    lastFile = reference;
    const newzIndex = initialzIndex + 1;
    newWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    desktop.querySelectorAll('.window--active').forEach((a) => {
      a.classList.remove('window--active');
    });
    newWindow.classList.add('window--active');
    desktop.querySelectorAll('.reference').forEach((b) => {
      if (b === lastFile) {
        b.classList.add('reference--active');
      } else {
        b.classList.remove('reference--active');
      }
    });
  };

  setCurrentWindowActive();
  const onMoveEvent = (e) => {
    if (moveElement === true) {
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

  function onWindowDrag(e) {
    setCurrentWindowActive();
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
  }

  const onCollapseButton = () => {
    setCurrentWindowActive();
    if (newWindow.classList.contains('window--collapsed')) {
      newWindow.classList.remove('window--collapsed');
      setCurrentWindowActive();
    } else {
      if (reference === lastFile) {
        newWindow.classList.add('window--collapsed');
      } else {
        setCurrentWindowActive();
      }
    }
  };

  const onCloseButton = () => {
    evt.target.classList.add('file');
    evt.target.classList.remove('file--opened');
    setCurrentWindowActive();
    newWindow.remove();
    pathIcon.remove();
    reference.remove();
    clonedTargetContent.remove();
    referenceIcon.remove();
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

  const onExpandButton = () => {
    setCurrentWindowActive(reference, newWindow);
    if (newWindow.classList.contains('window--fullscreen')) {
      newWindow.classList.remove('window--fullscreen');
    } else {
      newWindow.classList.add('window--fullscreen');
    }
  };

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

  const referenceText = reference.querySelector('.reference__text');
  referenceText.textContent = fileName.textContent;
  reference.insertBefore(referenceIcon, referenceText);
  desktopFooter.appendChild(reference);
  reference.addEventListener(events[deviceType].click, onCollapseButton);
}

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlJyk7XHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGxhc3RGaWxlO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsID0gMDtcclxubGV0IG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbmxldCBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcbmNvbnN0IGRlc2t0b3BXaWR0aCA9IGRlc2t0b3Aub2Zmc2V0V2lkdGg7XHJcbmNvbnN0IGRlc2t0b3BIZWlnaHQgPSBkZXNrdG9wLm9mZnNldEhlaWdodDtcclxuY29uc3QgaGFsZkRlc2t0b3BXaWR0aCA9IGRlc2t0b3BXaWR0aCAvIDI7XHJcbmNvbnN0IGhhbGZEZXNrdG9wSGVpZ2h0ID0gZGVza3RvcEhlaWdodCAvIDI7XHJcbmNvbnN0IHdpbmRvd1dpZHRoID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNyk7XHJcbmNvbnN0IHdpbmRvd0hlaWdodCA9IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0ICogMC43KTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuZGVza3RvcC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5maWxlJykpIHtcclxuICAgIG9uRmlsZU9wZW4oZXZ0KTtcclxuICB9XHJcbiAgaWYgKGV2dC50YXJnZXQuY2xvc2VzdCgnLnJlZmVyZW5jZScpKSB7XHJcbiAgICBjb25zb2xlLmxvZygncmVmZXJlbmNlJyk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmNvbnN0IHNldFN0YXJ0UG9zaXRpb24gPSAoZWxlbSkgPT4ge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICBlbGVtLnN0eWxlLmxlZnQgPSBgJHtoYWxmRGVza3RvcFdpZHRoICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2hhbGZEZXNrdG9wSGVpZ2h0ICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbH1weGA7XHJcbiAgZWxlbS5zdHlsZS53aWR0aCA9IGAke3dpbmRvd1dpZHRofXB4YDtcclxuICBlbGVtLnN0eWxlLmhlaWdodCA9IGAke3dpbmRvd0hlaWdodH1weGA7XHJcbiAgaWYgKGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCArIChkZXNrdG9wV2lkdGggLSB3aW5kb3dXaWR0aCkgLyAyICsgMTAgKyB3aW5kb3dXaWR0aCA+PSBkZXNrdG9wV2lkdGgpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCA9IDA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCArPSAxMDtcclxuICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyICs9IDE7XHJcbiAgfVxyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsICsgKGRlc2t0b3BIZWlnaHQgLSB3aW5kb3dIZWlnaHQpIC8gMiArIDMwICsgd2luZG93SGVpZ2h0ID49IGRlc2t0b3BIZWlnaHQpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG4gICAgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArPSAzMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciArPSAxO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIG9uRmlsZU9wZW4oZXZ0KSB7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlJyk7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlLS1vcGVuZWQnKTtcclxuICBjb25zdCBmaWxlTGFiZWwgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gIGNvbnN0IHBhdGhJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCBuZXdXaW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3QgbmV3V2luZG93UGF0aCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgY29uc3Qgd2luZG93SGVhZGVyID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2hlYWRlcicpO1xyXG4gIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSB3aW5kb3dIZWFkZXIucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gIGNvbnN0IGNsb25lZFRhcmdldENvbnRlbnQgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19jb250ZW50JykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIG5ld1dpbmRvdy5hcHBlbmRDaGlsZChjbG9uZWRUYXJnZXRDb250ZW50KTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50Jyk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19jb250ZW50Jyk7XHJcbiAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS1mb2xkZXInKSkge1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQtLWZvbGRlcicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgbmV3V2luZG93UGF0aC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCBuZXdXaW5kb3dQYXRoKTtcclxuICBkZXNrdG9wLmFwcGVuZENoaWxkKG5ld1dpbmRvdyk7XHJcbiAgc2V0U3RhcnRQb3NpdGlvbihuZXdXaW5kb3cpO1xyXG4gIGZpbGVMYWJlbC5jbGFzc0xpc3QuYWRkKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcblxyXG4gIGNvbnN0IHNldEN1cnJlbnRXaW5kb3dBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAxO1xyXG4gICAgbmV3V2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvdy0tYWN0aXZlJykuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJykuZm9yRWFjaCgoYikgPT4ge1xyXG4gICAgICBpZiAoYiA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBiLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYi5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgY29uc3Qgb25Nb3ZlRXZlbnQgPSAoZSkgPT4ge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50ID09PSB0cnVlKSB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGNvbnN0IGNhbGNYID0gaW5pdGlhbFggLSBuZXdYO1xyXG4gICAgICBjb25zdCBjYWxjWSA9IGluaXRpYWxZIC0gbmV3WTtcclxuICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID0gYCR7bmV3V2luZG93Lm9mZnNldExlZnQgLSBjYWxjWH1weGA7XHJcbiAgICAgIGNvbnN0IHRvcFBvc2l0aW9uID0gYCR7bmV3V2luZG93Lm9mZnNldFRvcCAtIGNhbGNZfXB4YDtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLmxlZnQgPSBsZWZ0UG9zaXRpb247XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSB0b3BQb3NpdGlvbjtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgfTtcclxuICBjb25zdCBvbk1vdmVUaHJvdHRsZWQgPSB0aHJvdHRsZShvbk1vdmVFdmVudCwgMTApO1xyXG5cclxuICBjb25zdCBvbk1vdmVTdG9wID0gKCkgPT4ge1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlVGhyb3R0bGVkKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gb25XaW5kb3dEcmFnKGUpIHtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIGlmIChlLmNhbmNlbGFibGUpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WCA6IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlVGhyb3R0bGVkKTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgY29uc3Qgb25Db2xsYXBzZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocmVmZXJlbmNlID09PSBsYXN0RmlsZSkge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpbGUnKTtcclxuICAgIGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZS0tb3BlbmVkJyk7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICBuZXdXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICBwYXRoSWNvbi5yZW1vdmUoKTtcclxuICAgIHJlZmVyZW5jZS5yZW1vdmUoKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQucmVtb3ZlKCk7XHJcbiAgICByZWZlcmVuY2VJY29uLnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIGlmIChvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsIC09IDMwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgLT0gMTA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25FeHBhbmRCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKHJlZmVyZW5jZSwgbmV3V2luZG93KTtcclxuICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbmV3V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIChlKSA9PiB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKSkge1xyXG4gICAgICBvbldpbmRvd0RyYWcoZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fY29udGVudCcpKSB7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgbmV3V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoZSkgPT4ge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKSkge1xyXG4gICAgICBvbkNvbGxhcHNlQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1jbG9zZScpKSB7XHJcbiAgICAgIG9uQ2xvc2VCdXR0b24oKTtcclxuICAgIH1cclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWV4cGFuZCcpKSB7XHJcbiAgICAgIG9uRXhwYW5kQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gIHJlZmVyZW5jZVRleHQudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICByZWZlcmVuY2UuaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUljb24sIHJlZmVyZW5jZVRleHQpO1xyXG4gIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG59XHJcbiJdLCJmaWxlIjoid2luZG93LmpzIn0=
