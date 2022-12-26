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

// const layerCoords = {
//   x: 0,
//   y: 0,
// };

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

desktop.addEventListener(events[deviceType].click, (evt) => {
  if (evt.target.closest('.file') && !evt.target.closest('.file--link')) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlJyk7XHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGxhc3RGaWxlO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsID0gMDtcclxubGV0IG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbmxldCBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcbmNvbnN0IGRlc2t0b3BXaWR0aCA9IGRlc2t0b3Aub2Zmc2V0V2lkdGg7XHJcbmNvbnN0IGRlc2t0b3BIZWlnaHQgPSBkZXNrdG9wLm9mZnNldEhlaWdodDtcclxuY29uc3QgaGFsZkRlc2t0b3BXaWR0aCA9IGRlc2t0b3BXaWR0aCAvIDI7XHJcbmNvbnN0IGhhbGZEZXNrdG9wSGVpZ2h0ID0gZGVza3RvcEhlaWdodCAvIDI7XHJcbmNvbnN0IHdpbmRvd1dpZHRoID0gTWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNyk7XHJcbmNvbnN0IHdpbmRvd0hlaWdodCA9IE1hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0ICogMC43KTtcclxuXHJcbi8vIGNvbnN0IGxheWVyQ29vcmRzID0ge1xyXG4vLyAgIHg6IDAsXHJcbi8vICAgeTogMCxcclxuLy8gfTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuZGVza3RvcC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5maWxlJykgJiYgIWV2dC50YXJnZXQuY2xvc2VzdCgnLmZpbGUtLWxpbmsnKSkge1xyXG4gICAgb25GaWxlT3BlbihldnQpO1xyXG4gIH1cclxufSk7XHJcblxyXG5jb25zdCBzZXRTdGFydFBvc2l0aW9uID0gKGVsZW0pID0+IHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgZWxlbS5zdHlsZS5sZWZ0ID0gYCR7aGFsZkRlc2t0b3BXaWR0aCArIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbH1weGA7XHJcbiAgZWxlbS5zdHlsZS50b3AgPSBgJHtoYWxmRGVza3RvcEhlaWdodCArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUud2lkdGggPSBgJHt3aW5kb3dXaWR0aH1weGA7XHJcbiAgZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHt3aW5kb3dIZWlnaHR9cHhgO1xyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKyAoZGVza3RvcFdpZHRoIC0gd2luZG93V2lkdGgpIC8gMiArIDEwICsgd2luZG93V2lkdGggPj0gZGVza3RvcFdpZHRoKSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG4gICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKz0gMTA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciArPSAxO1xyXG4gIH1cclxuICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wSGVpZ2h0IC0gd2luZG93SGVpZ2h0KSAvIDIgKyAzMCArIHdpbmRvd0hlaWdodCA+PSBkZXNrdG9wSGVpZ2h0KSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsID0gMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKz0gMzA7XHJcbiAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgKz0gMTtcclxuICB9XHJcbn07XHJcblxyXG5mdW5jdGlvbiBvbkZpbGVPcGVuKGV2dCkge1xyXG4gIGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZScpO1xyXG4gIGV2dC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnZmlsZS0tb3BlbmVkJyk7XHJcbiAgY29uc3QgZmlsZUxhYmVsID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbGFiZWwnKTtcclxuICBjb25zdCBmaWxlTmFtZSA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKTtcclxuICBjb25zdCBwYXRoSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3QgbmV3V2luZG93ID0gd2luZG93VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IG5ld1dpbmRvd1BhdGggPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fcGF0aCcpO1xyXG4gIGNvbnN0IHdpbmRvd0hlYWRlciA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuICBjb25zdCB3aW5kb3dEcmFnZ2FibGVBcmVhID0gd2luZG93SGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuICBjb25zdCBjbG9uZWRUYXJnZXRDb250ZW50ID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fY29udGVudCcpLmNsb25lTm9kZSh0cnVlKTtcclxuICBuZXdXaW5kb3cuYXBwZW5kQ2hpbGQoY2xvbmVkVGFyZ2V0Q29udGVudCk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCd2aXN1YWxseS1oaWRkZW4nKTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudCcpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fY29udGVudCcpO1xyXG4gIGlmIChldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50LS1mb2xkZXInKTtcclxuICB9XHJcblxyXG4gIG5ld1dpbmRvd1BhdGgudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICB3aW5kb3dEcmFnZ2FibGVBcmVhLmluc2VydEJlZm9yZShwYXRoSWNvbiwgbmV3V2luZG93UGF0aCk7XHJcbiAgZGVza3RvcC5hcHBlbmRDaGlsZChuZXdXaW5kb3cpO1xyXG4gIHNldFN0YXJ0UG9zaXRpb24obmV3V2luZG93KTtcclxuICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG5cclxuICBjb25zdCBzZXRDdXJyZW50V2luZG93QWN0aXZlID0gKCkgPT4ge1xyXG4gICAgbGFzdEZpbGUgPSByZWZlcmVuY2U7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICAgIG5ld1dpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvdy0tYWN0aXZlJykuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJykuZm9yRWFjaCgoYikgPT4ge1xyXG4gICAgICBpZiAoYiA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBiLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYi5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcblxyXG4gIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGUpID0+IHtcclxuICAgIGlmIChtb3ZlRWxlbWVudCkge1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WCA6IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBjb25zdCBjYWxjWCA9IGluaXRpYWxYIC0gbmV3WDtcclxuICAgICAgY29uc3QgY2FsY1kgPSBpbml0aWFsWSAtIG5ld1k7XHJcbiAgICAgIGNvbnN0IGxlZnRQb3NpdGlvbiA9IGAke25ld1dpbmRvdy5vZmZzZXRMZWZ0IC0gY2FsY1h9cHhgO1xyXG4gICAgICBjb25zdCB0b3BQb3NpdGlvbiA9IGAke25ld1dpbmRvdy5vZmZzZXRUb3AgLSBjYWxjWX1weGA7XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS5sZWZ0ID0gbGVmdFBvc2l0aW9uO1xyXG4gICAgICBuZXdXaW5kb3cuc3R5bGUudG9wID0gdG9wUG9zaXRpb247XHJcbiAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgfVxyXG4gIH07XHJcbiAgY29uc3Qgb25Nb3ZlVGhyb3R0bGVkID0gdGhyb3R0bGUob25Nb3ZlRXZlbnQsIDEwKTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZVRocm90dGxlZCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uV2luZG93RHJhZyA9IChlKSA9PiB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgaWYgKGUuY2FuY2VsYWJsZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIW5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVUaHJvdHRsZWQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Db2xsYXBzZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocmVmZXJlbmNlID09PSBsYXN0RmlsZSkge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlZmVyZW5jZUljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gIHJlZmVyZW5jZVRleHQudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICByZWZlcmVuY2UuaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUljb24sIHJlZmVyZW5jZVRleHQpO1xyXG4gIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG5cclxuICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlJyk7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgbmV3V2luZG93LnJlbW92ZSgpO1xyXG4gICAgcGF0aEljb24ucmVtb3ZlKCk7XHJcbiAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LnJlbW92ZSgpO1xyXG4gICAgcmVmZXJlbmNlSWNvbi5yZW1vdmUoKTtcclxuICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICBpZiAob2Zmc2V0VmVydGljYWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgLT0gMTtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCAtPSAzMDtcclxuICAgIH1cclxuICAgIGlmIChvZmZzZXRIb3Jpc29udGFsQ291bnRlciA+IDApIHtcclxuICAgICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgLT0gMTtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsIC09IDEwO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShyZWZlcmVuY2UsIG5ld1dpbmRvdyk7XHJcbiAgICBpZiAobmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZSkgPT4ge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJykpIHtcclxuICAgICAgb25XaW5kb3dEcmFnKGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2NvbnRlbnQnKSkge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJykpIHtcclxuICAgICAgb25Db2xsYXBzZUJ1dHRvbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKSkge1xyXG4gICAgICBvbkNsb3NlQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKSkge1xyXG4gICAgICBvbkV4cGFuZEJ1dHRvbigpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiJdLCJmaWxlIjoid2luZG93LmpzIn0=
