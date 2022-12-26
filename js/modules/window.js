// import { throttle } from './throttle.js';
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
  elem.style.left = `${desktop.offsetWidth / 2 + initialWindowCounterHorisontal}px`;
  elem.style.top = `${desktop.offsetHeight / 2 + initialWindowCounterVertical}px`;
  elem.style.width = `${Math.round(window.innerWidth * 0.7)}px`;
  elem.style.height = `${Math.round(window.innerHeight * 0.7)}px`;
  if (initialWindowCounterHorisontal + (desktop.offsetWidth - elem.offsetWidth) / 2 + 10 + elem.offsetWidth >= desktop.offsetWidth) {
    initialWindowCounterHorisontal = 0;
    offsetHorisontalCounter = 0;
  } else {
    initialWindowCounterHorisontal += 10;
    offsetHorisontalCounter += 1;
  }
  if (initialWindowCounterVertical + (desktop.offsetHeight - elem.offsetHeight) / 2 + 30 + elem.offsetHeight >= desktop.offsetHeight) {
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
      newWindow.style.left = `${newWindow.offsetLeft - (initialX - newX)}px`;
      newWindow.style.top = `${newWindow.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  };

  const onMoveStop = () => {
    desktop.removeEventListener(events[deviceType].move, onMoveEvent);
    windowDraggableArea.removeEventListener(events[deviceType].up, onMoveStop);
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
      desktop.addEventListener(events[deviceType].move, onMoveEvent);
      windowDraggableArea.addEventListener(events[deviceType].up, onMoveStop);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlJyk7XHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGxhc3RGaWxlO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsID0gMDtcclxubGV0IG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbmxldCBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcblxyXG5kZXNrdG9wRm9vdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2dCkgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGRlc2t0b3BGb290ZXIuc2Nyb2xsTGVmdCArPSBldnQuZGVsdGFZO1xyXG59KTtcclxuXHJcbmRlc2t0b3AuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIChldnQpID0+IHtcclxuICBpZiAoZXZ0LnRhcmdldC5jbG9zZXN0KCcuZmlsZScpKSB7XHJcbiAgICBvbkZpbGVPcGVuKGV2dCk7XHJcbiAgfVxyXG4gIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5yZWZlcmVuY2UnKSkge1xyXG4gICAgY29uc29sZS5sb2coJ3JlZmVyZW5jZScpO1xyXG4gIH1cclxufSk7XHJcblxyXG5jb25zdCBzZXRTdGFydFBvc2l0aW9uID0gKGVsZW0pID0+IHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgZWxlbS5zdHlsZS5sZWZ0ID0gYCR7ZGVza3RvcC5vZmZzZXRXaWR0aCAvIDIgKyBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUudG9wID0gYCR7ZGVza3RvcC5vZmZzZXRIZWlnaHQgLyAyICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbH1weGA7XHJcbiAgZWxlbS5zdHlsZS53aWR0aCA9IGAke01hdGgucm91bmQod2luZG93LmlubmVyV2lkdGggKiAwLjcpfXB4YDtcclxuICBlbGVtLnN0eWxlLmhlaWdodCA9IGAke01hdGgucm91bmQod2luZG93LmlubmVySGVpZ2h0ICogMC43KX1weGA7XHJcbiAgaWYgKGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCArIChkZXNrdG9wLm9mZnNldFdpZHRoIC0gZWxlbS5vZmZzZXRXaWR0aCkgLyAyICsgMTAgKyBlbGVtLm9mZnNldFdpZHRoID49IGRlc2t0b3Aub2Zmc2V0V2lkdGgpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCA9IDA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCArPSAxMDtcclxuICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyICs9IDE7XHJcbiAgfVxyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsICsgKGRlc2t0b3Aub2Zmc2V0SGVpZ2h0IC0gZWxlbS5vZmZzZXRIZWlnaHQpIC8gMiArIDMwICsgZWxlbS5vZmZzZXRIZWlnaHQgPj0gZGVza3RvcC5vZmZzZXRIZWlnaHQpIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG4gICAgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArPSAzMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciArPSAxO1xyXG4gIH1cclxufTtcclxuXHJcbmZ1bmN0aW9uIG9uRmlsZU9wZW4oZXZ0KSB7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlJyk7XHJcbiAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlLS1vcGVuZWQnKTtcclxuICBjb25zdCBmaWxlTGFiZWwgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gIGNvbnN0IHBhdGhJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCBuZXdXaW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3QgbmV3V2luZG93UGF0aCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgY29uc3Qgd2luZG93SGVhZGVyID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2hlYWRlcicpO1xyXG4gIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSB3aW5kb3dIZWFkZXIucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gIGNvbnN0IGNsb25lZFRhcmdldENvbnRlbnQgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19jb250ZW50JykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIG5ld1dpbmRvdy5hcHBlbmRDaGlsZChjbG9uZWRUYXJnZXRDb250ZW50KTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50Jyk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19jb250ZW50Jyk7XHJcbiAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS1mb2xkZXInKSkge1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQtLWZvbGRlcicpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgbmV3V2luZG93UGF0aC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCBuZXdXaW5kb3dQYXRoKTtcclxuICBkZXNrdG9wLmFwcGVuZENoaWxkKG5ld1dpbmRvdyk7XHJcbiAgc2V0U3RhcnRQb3NpdGlvbihuZXdXaW5kb3cpO1xyXG4gIGZpbGVMYWJlbC5jbGFzc0xpc3QuYWRkKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcblxyXG4gIGNvbnN0IHNldEN1cnJlbnRXaW5kb3dBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAxO1xyXG4gICAgbmV3V2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvdy0tYWN0aXZlJykuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJykuZm9yRWFjaCgoYikgPT4ge1xyXG4gICAgICBpZiAoYiA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBiLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYi5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcblxyXG4gIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGUpID0+IHtcclxuICAgIGlmIChtb3ZlRWxlbWVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WCA6IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBuZXdXaW5kb3cuc3R5bGUubGVmdCA9IGAke25ld1dpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICBuZXdXaW5kb3cuc3R5bGUudG9wID0gYCR7bmV3V2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgIGRlc2t0b3AucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgd2luZG93RHJhZ2dhYmxlQXJlYS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIG9uV2luZG93RHJhZyhlKSB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGRlc2t0b3AuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IG9uQ29sbGFwc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICBpZiAobmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJlZmVyZW5jZSA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlJyk7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgbmV3V2luZG93LnJlbW92ZSgpO1xyXG4gICAgcGF0aEljb24ucmVtb3ZlKCk7XHJcbiAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LnJlbW92ZSgpO1xyXG4gICAgcmVmZXJlbmNlSWNvbi5yZW1vdmUoKTtcclxuICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICBpZiAob2Zmc2V0VmVydGljYWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgLT0gMTtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCAtPSAzMDtcclxuICAgIH1cclxuICAgIGlmIChvZmZzZXRIb3Jpc29udGFsQ291bnRlciA+IDApIHtcclxuICAgICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgLT0gMTtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsIC09IDEwO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShyZWZlcmVuY2UsIG5ld1dpbmRvdyk7XHJcbiAgICBpZiAobmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoZSkgPT4ge1xyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJykpIHtcclxuICAgICAgb25XaW5kb3dEcmFnKGUpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2NvbnRlbnQnKSkge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcblxyXG4gIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJykpIHtcclxuICAgICAgb25Db2xsYXBzZUJ1dHRvbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKSkge1xyXG4gICAgICBvbkNsb3NlQnV0dG9uKCk7XHJcbiAgICB9XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKSkge1xyXG4gICAgICBvbkV4cGFuZEJ1dHRvbigpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBjb25zdCByZWZlcmVuY2VUZXh0ID0gcmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2VfX3RleHQnKTtcclxuICByZWZlcmVuY2VUZXh0LnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICBkZXNrdG9wRm9vdGVyLmFwcGVuZENoaWxkKHJlZmVyZW5jZSk7XHJcbiAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxufVxyXG4iXSwiZmlsZSI6IndpbmRvdy5qcyJ9
