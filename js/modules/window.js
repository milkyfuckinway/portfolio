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
    reference.classList.add('reference--active');
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

  const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  const referenceText = reference.querySelector('.reference__text');
  referenceText.textContent = fileName.textContent;
  reference.insertBefore(referenceIcon, referenceText);
  desktopFooter.appendChild(reference);
  reference.addEventListener(events[deviceType].click, onCollapseButton);

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
}

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlJyk7XHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGxhc3RGaWxlO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsID0gMDtcclxubGV0IG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbmxldCBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcbmNvbnN0IGRlc2t0b3BXaWR0aCA9IGRlc2t0b3Aub2Zmc2V0V2lkdGg7XHJcbmNvbnN0IGRlc2t0b3BIZWlnaHQgPSBkZXNrdG9wLm9mZnNldEhlaWdodDtcclxuY29uc3QgaGFsZkRlc2t0b3BXaWR0aCA9IGRlc2t0b3BXaWR0aCAvIDI7XHJcbmNvbnN0IGhhbGZEZXNrdG9wSGVpZ2h0ID0gZGVza3RvcEhlaWdodCAvIDI7XHJcbmNvbnN0IHdpbmRvd1dpZHRoID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNyk7XHJcbmNvbnN0IHdpbmRvd0hlaWdodCA9IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0ICogMC43KTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuZGVza3RvcC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5maWxlJykpIHtcclxuICAgIG9uRmlsZU9wZW4oZXZ0KTtcclxuICB9XHJcbn0pO1xyXG5cclxuY29uc3Qgc2V0U3RhcnRQb3NpdGlvbiA9IChlbGVtKSA9PiB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gIGVsZW0uc3R5bGUubGVmdCA9IGAke2hhbGZEZXNrdG9wV2lkdGggKyBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUudG9wID0gYCR7aGFsZkRlc2t0b3BIZWlnaHQgKyBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsfXB4YDtcclxuICBlbGVtLnN0eWxlLndpZHRoID0gYCR7d2luZG93V2lkdGh9cHhgO1xyXG4gIGVsZW0uc3R5bGUuaGVpZ2h0ID0gYCR7d2luZG93SGVpZ2h0fXB4YDtcclxuICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsICsgKGRlc2t0b3BXaWR0aCAtIHdpbmRvd1dpZHRoKSAvIDIgKyAxMCArIHdpbmRvd1dpZHRoID49IGRlc2t0b3BXaWR0aCkge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsID0gMDtcclxuICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsICs9IDEwO1xyXG4gICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgKz0gMTtcclxuICB9XHJcbiAgaWYgKGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKyAoZGVza3RvcEhlaWdodCAtIHdpbmRvd0hlaWdodCkgLyAyICsgMzAgKyB3aW5kb3dIZWlnaHQgPj0gZGVza3RvcEhlaWdodCkge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbiAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsICs9IDMwO1xyXG4gICAgb2Zmc2V0VmVydGljYWxDb3VudGVyICs9IDE7XHJcbiAgfVxyXG59O1xyXG5cclxuZnVuY3Rpb24gb25GaWxlT3BlbihldnQpIHtcclxuICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGUnKTtcclxuICBldnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gIGNvbnN0IGZpbGVMYWJlbCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2xhYmVsJyk7XHJcbiAgY29uc3QgZmlsZU5hbWUgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7XHJcbiAgY29uc3QgcGF0aEljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IG5ld1dpbmRvdyA9IHdpbmRvd1RlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCBuZXdXaW5kb3dQYXRoID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX3BhdGgnKTtcclxuICBjb25zdCB3aW5kb3dIZWFkZXIgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcbiAgY29uc3Qgd2luZG93RHJhZ2dhYmxlQXJlYSA9IHdpbmRvd0hlYWRlci5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgY29uc3QgY2xvbmVkVGFyZ2V0Q29udGVudCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2NvbnRlbnQnKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgbmV3V2luZG93LmFwcGVuZENoaWxkKGNsb25lZFRhcmdldENvbnRlbnQpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgndmlzdWFsbHktaGlkZGVuJyk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQnKTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2NvbnRlbnQnKTtcclxuICBpZiAoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudC0tZm9sZGVyJyk7XHJcbiAgfVxyXG5cclxuICBuZXdXaW5kb3dQYXRoLnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgd2luZG93RHJhZ2dhYmxlQXJlYS5pbnNlcnRCZWZvcmUocGF0aEljb24sIG5ld1dpbmRvd1BhdGgpO1xyXG4gIGRlc2t0b3AuYXBwZW5kQ2hpbGQobmV3V2luZG93KTtcclxuICBzZXRTdGFydFBvc2l0aW9uKG5ld1dpbmRvdyk7XHJcbiAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuXHJcbiAgY29uc3Qgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSA9ICgpID0+IHtcclxuICAgIGxhc3RGaWxlID0gcmVmZXJlbmNlO1xyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDE7XHJcbiAgICBuZXdXaW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy53aW5kb3ctLWFjdGl2ZScpLmZvckVhY2goKGEpID0+IHtcclxuICAgICAgYS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1hY3RpdmUnKTtcclxuICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpLmZvckVhY2goKGIpID0+IHtcclxuICAgICAgaWYgKGIgPT09IGxhc3RGaWxlKSB7XHJcbiAgICAgICAgYi5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGIuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG5cclxuICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQgPT09IHRydWUpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgY29uc3QgY2FsY1ggPSBpbml0aWFsWCAtIG5ld1g7XHJcbiAgICAgIGNvbnN0IGNhbGNZID0gaW5pdGlhbFkgLSBuZXdZO1xyXG4gICAgICBjb25zdCBsZWZ0UG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0TGVmdCAtIGNhbGNYfXB4YDtcclxuICAgICAgY29uc3QgdG9wUG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gY2FsY1l9cHhgO1xyXG4gICAgICBuZXdXaW5kb3cuc3R5bGUubGVmdCA9IGxlZnRQb3NpdGlvbjtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLnRvcCA9IHRvcFBvc2l0aW9uO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICB9O1xyXG4gIGNvbnN0IG9uTW92ZVRocm90dGxlZCA9IHRocm90dGxlKG9uTW92ZUV2ZW50LCAxMCk7XHJcblxyXG4gIGNvbnN0IG9uTW92ZVN0b3AgPSAoKSA9PiB7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVUaHJvdHRsZWQpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBvbldpbmRvd0RyYWcoZSkge1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgaWYgKGUuY2FuY2VsYWJsZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIW5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVUaHJvdHRsZWQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tY29sbGFwc2VkJykpIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChyZWZlcmVuY2UgPT09IGxhc3RGaWxlKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3QgcmVmZXJlbmNlVGV4dCA9IHJlZmVyZW5jZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlX190ZXh0Jyk7XHJcbiAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUocmVmZXJlbmNlSWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgZGVza3RvcEZvb3Rlci5hcHBlbmRDaGlsZChyZWZlcmVuY2UpO1xyXG4gIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcblxyXG4gIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpbGUnKTtcclxuICAgIGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZS0tb3BlbmVkJyk7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICBuZXdXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICBwYXRoSWNvbi5yZW1vdmUoKTtcclxuICAgIHJlZmVyZW5jZS5yZW1vdmUoKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQucmVtb3ZlKCk7XHJcbiAgICByZWZlcmVuY2VJY29uLnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIGlmIChvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsIC09IDMwO1xyXG4gICAgfVxyXG4gICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciAtPSAxO1xyXG4gICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgLT0gMTA7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25FeHBhbmRCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKHJlZmVyZW5jZSwgbmV3V2luZG93KTtcclxuICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgbmV3V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIChlKSA9PiB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKSkge1xyXG4gICAgICBvbldpbmRvd0RyYWcoZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fY29udGVudCcpKSB7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgbmV3V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoZSkgPT4ge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKSkge1xyXG4gICAgICBvbkNvbGxhcHNlQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1jbG9zZScpKSB7XHJcbiAgICAgIG9uQ2xvc2VCdXR0b24oKTtcclxuICAgIH1cclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWV4cGFuZCcpKSB7XHJcbiAgICAgIG9uRXhwYW5kQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuIl0sImZpbGUiOiJ3aW5kb3cuanMifQ==
