import { throttle } from './throttle.js';
import { events, isTouchDevice, deviceType } from './checkDeviceType.js';

isTouchDevice();

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const fileList = document.querySelectorAll('.file');
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
const setCurrentWindowActive = (ref, win, drag, collapse, close, expand) => {
  lastFile = ref;
  const newzIndex = initialzIndex + 1;
  win.style.zIndex = `${newzIndex}`;
  initialzIndex = newzIndex;
  win.classList.add('window--active');
  desktop.querySelectorAll('.window').forEach((a) => {
    a.classList.remove('window--active');
    a.querySelector('.window__draggable-area').removeEventListener(events[deviceType].down, drag);
    a.querySelector('.window__button--collapse').removeEventListener(events[deviceType].click, collapse);
    a.querySelector('.window__button--close').removeEventListener(events[deviceType].click, close);
    a.querySelector('.window__button--expand').removeEventListener(events[deviceType].click, expand);
    if (a === win) {
      a.classList.add('window--active');
      a.querySelector('.window__draggable-area').addEventListener(events[deviceType].down, drag);
      a.querySelector('.window__button--collapse').addEventListener(events[deviceType].click, collapse);
      a.querySelector('.window__button--close').addEventListener(events[deviceType].click, close);
      a.querySelector('.window__button--expand').addEventListener(events[deviceType].click, expand);
    }
  });
  desktop.querySelectorAll('.reference').forEach((b) => {
    if (b === lastFile) {
      b.classList.add('reference--active');
    } else {
      b.classList.remove('reference--active');
    }
  });
};

fileList.forEach((item) => {
  if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
    item.addEventListener(events[deviceType].click, onFileOpen);
  }
  function onFileOpen(evt) {
    evt.target.removeEventListener(events[deviceType].click, onFileOpen);
    const fileLabel = evt.target.querySelector('.file__label');
    const fileName = evt.target.querySelector('.file__name');
    const pathIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    const newWindow = windowTemplate.cloneNode(true);
    const newWindowPath = newWindow.querySelector('.window__path');
    const windowHeader = newWindow.querySelector('.window__header');
    const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
    const reference = referenceTemplate.cloneNode(true);
    const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    newWindowPath.textContent = fileName.textContent;
    windowDraggableArea.insertBefore(pathIcon, newWindowPath);
    desktop.appendChild(newWindow);
    setStartPosition(newWindow);
    fileLabel.classList.add('file__label--active');
    setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);

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
      document.removeEventListener(events[deviceType].move, onMoveEvent);
      document.removeEventListener(events[deviceType].up, onMoveStop);
      moveElement = false;
    };

    function onWindowDrag(e) {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (!newWindow.classList.contains('window--fullscreen')) {
        moveElement = true;
        initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        document.addEventListener(events[deviceType].move, onMoveEvent);
        document.addEventListener(events[deviceType].up, onMoveStop);
      }
    }

    function onCollapseButton() {
      if (newWindow.classList.contains('window--collapsed')) {
        newWindow.classList.remove('window--collapsed');
        setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);
      } else {
        if (reference === lastFile) {
          newWindow.classList.add('window--collapsed');
        } else {
          setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);
        }
      }
    }

    function onCloseButton() {
      newWindow.remove();
      pathIcon.remove();
      item.addEventListener(events[deviceType].click, onFileOpen);
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
    }

    function onExpandButton() {
      if (newWindow.classList.contains('window--fullscreen')) {
        newWindow.classList.remove('window--fullscreen');
      } else {
        newWindow.classList.add('window--fullscreen');
      }
    }

    newWindow.addEventListener(events[deviceType].up, () => {
      setCurrentWindowActive(reference, newWindow, onWindowDrag, onCollapseButton, onCloseButton, onExpandButton);
    });

    newWindow.appendChild(clonedTargetContent);
    clonedTargetContent.classList.remove('visually-hidden');
    clonedTargetContent.classList.add('window__content');
    clonedTargetContent.classList.remove('file__content');
    if (evt.target.classList.contains('file--folder')) {
      const innerFiles = newWindow.querySelectorAll('.file');
      clonedTargetContent.classList.add('window__content--folder');
      innerFiles.forEach((file) => {
        file.addEventListener(events[deviceType].click, onFileOpen);
      });
    }

    const referenceText = reference.querySelector('.reference__text');
    referenceText.textContent = fileName.textContent;
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);
  }
});

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZmlsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdEZpbGU7XHJcbmxldCBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbmxldCBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG5sZXQgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxubGV0IG9mZnNldEhvcmlzb250YWxDb3VudGVyID0gMDtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2V0U3RhcnRQb3NpdGlvbiA9IChlbGVtKSA9PiB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gIGVsZW0uc3R5bGUubGVmdCA9IGAke2Rlc2t0b3Aub2Zmc2V0V2lkdGggLyAyICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoICogMC43KX1weGA7XHJcbiAgZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHtNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNyl9cHhgO1xyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKyAoZGVza3RvcC5vZmZzZXRXaWR0aCAtIGVsZW0ub2Zmc2V0V2lkdGgpIC8gMiArIDEwICsgZWxlbS5vZmZzZXRXaWR0aCA+PSBkZXNrdG9wLm9mZnNldFdpZHRoKSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG4gICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKz0gMTA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciArPSAxO1xyXG4gIH1cclxuICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wLm9mZnNldEhlaWdodCAtIGVsZW0ub2Zmc2V0SGVpZ2h0KSAvIDIgKyAzMCArIGVsZW0ub2Zmc2V0SGVpZ2h0ID49IGRlc2t0b3Aub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsID0gMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKz0gMzA7XHJcbiAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgKz0gMTtcclxuICB9XHJcbn07XHJcbmNvbnN0IHNldEN1cnJlbnRXaW5kb3dBY3RpdmUgPSAocmVmLCB3aW4sIGRyYWcsIGNvbGxhcHNlLCBjbG9zZSwgZXhwYW5kKSA9PiB7XHJcbiAgbGFzdEZpbGUgPSByZWY7XHJcbiAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDE7XHJcbiAgd2luLnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgd2luLmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93JykuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgYS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgYS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIGRyYWcpO1xyXG4gICAgYS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJykucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIGNvbGxhcHNlKTtcclxuICAgIGEucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jbG9zZScpLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBjbG9zZSk7XHJcbiAgICBhLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tZXhwYW5kJykucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIGV4cGFuZCk7XHJcbiAgICBpZiAoYSA9PT0gd2luKSB7XHJcbiAgICAgIGEuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1hY3RpdmUnKTtcclxuICAgICAgYS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIGRyYWcpO1xyXG4gICAgICBhLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgY29sbGFwc2UpO1xyXG4gICAgICBhLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgY2xvc2UpO1xyXG4gICAgICBhLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tZXhwYW5kJykuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIGV4cGFuZCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJykuZm9yRWFjaCgoYikgPT4ge1xyXG4gICAgaWYgKGIgPT09IGxhc3RGaWxlKSB7XHJcbiAgICAgIGIuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGIuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmZpbGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLXRleHQnKSB8fCBpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBvbkZpbGVPcGVuKGV2dCkge1xyXG4gICAgZXZ0LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICBjb25zdCBmaWxlTGFiZWwgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gICAgY29uc3QgZmlsZU5hbWUgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7XHJcbiAgICBjb25zdCBwYXRoSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCBuZXdXaW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCBuZXdXaW5kb3dQYXRoID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX3BhdGgnKTtcclxuICAgIGNvbnN0IHdpbmRvd0hlYWRlciA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuICAgIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSB3aW5kb3dIZWFkZXIucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IGNsb25lZFRhcmdldENvbnRlbnQgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19jb250ZW50JykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdXaW5kb3dQYXRoLnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmluc2VydEJlZm9yZShwYXRoSWNvbiwgbmV3V2luZG93UGF0aCk7XHJcbiAgICBkZXNrdG9wLmFwcGVuZENoaWxkKG5ld1dpbmRvdyk7XHJcbiAgICBzZXRTdGFydFBvc2l0aW9uKG5ld1dpbmRvdyk7XHJcbiAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShyZWZlcmVuY2UsIG5ld1dpbmRvdywgb25XaW5kb3dEcmFnLCBvbkNvbGxhcHNlQnV0dG9uLCBvbkNsb3NlQnV0dG9uLCBvbkV4cGFuZEJ1dHRvbik7XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlRXZlbnQgPSAoZSkgPT4ge1xyXG4gICAgICBpZiAobW92ZUVsZW1lbnQgPT09IHRydWUpIHtcclxuICAgICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WCA6IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgICAgbmV3V2luZG93LnN0eWxlLmxlZnQgPSBgJHtuZXdXaW5kb3cub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpfXB4YDtcclxuICAgICAgICBuZXdXaW5kb3cuc3R5bGUudG9wID0gYCR7bmV3V2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9uTW92ZVN0b3AgPSAoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBvbldpbmRvd0RyYWcoZSkge1xyXG4gICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIG9uQ29sbGFwc2VCdXR0b24oKSB7XHJcbiAgICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShyZWZlcmVuY2UsIG5ld1dpbmRvdywgb25XaW5kb3dEcmFnLCBvbkNvbGxhcHNlQnV0dG9uLCBvbkNsb3NlQnV0dG9uLCBvbkV4cGFuZEJ1dHRvbik7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlZmVyZW5jZSA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKHJlZmVyZW5jZSwgbmV3V2luZG93LCBvbldpbmRvd0RyYWcsIG9uQ29sbGFwc2VCdXR0b24sIG9uQ2xvc2VCdXR0b24sIG9uRXhwYW5kQnV0dG9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBvbkNsb3NlQnV0dG9uKCkge1xyXG4gICAgICBuZXdXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICAgIHBhdGhJY29uLnJlbW92ZSgpO1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgICAgcmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBjbG9uZWRUYXJnZXRDb250ZW50LnJlbW92ZSgpO1xyXG4gICAgICByZWZlcmVuY2VJY29uLnJlbW92ZSgpO1xyXG4gICAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgICBpZiAob2Zmc2V0VmVydGljYWxDb3VudGVyID4gMCkge1xyXG4gICAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgLT0gMzA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyIC09IDE7XHJcbiAgICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsIC09IDEwO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gb25FeHBhbmRCdXR0b24oKSB7XHJcbiAgICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZXdXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsICgpID0+IHtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShyZWZlcmVuY2UsIG5ld1dpbmRvdywgb25XaW5kb3dEcmFnLCBvbkNvbGxhcHNlQnV0dG9uLCBvbkNsb3NlQnV0dG9uLCBvbkV4cGFuZEJ1dHRvbik7XHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXdXaW5kb3cuYXBwZW5kQ2hpbGQoY2xvbmVkVGFyZ2V0Q29udGVudCk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQnKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fY29udGVudCcpO1xyXG4gICAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS1mb2xkZXInKSkge1xyXG4gICAgICBjb25zdCBpbm5lckZpbGVzID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcbiAgICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50LS1mb2xkZXInKTtcclxuICAgICAgaW5uZXJGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XHJcbiAgICAgICAgZmlsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJ3aW5kb3cuanMifQ==
