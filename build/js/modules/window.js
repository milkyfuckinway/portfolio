// import { throttle } from './throttle.js';
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
      document.removeEventListener(events[deviceType].move, onMoveEvent);
      document.removeEventListener(events[deviceType].up, onMoveStop);
      moveElement = false;
    };

    function onWindowDrag(e) {
      setCurrentWindowActive(reference, newWindow);
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
      setCurrentWindowActive();
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
      if (e.target.closest('.window__button--collapse')) {
        onCollapseButton();
      }
      if (e.target.closest('.window__button--close')) {
        onCloseButton();
      }
      if (e.target.closest('.window__button--expand')) {
        onExpandButton();
      }
      if (e.target.closest('.window__content')) {
        setCurrentWindowActive();
      }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZmlsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdEZpbGU7XHJcbmxldCBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbmxldCBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG5sZXQgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxubGV0IG9mZnNldEhvcmlzb250YWxDb3VudGVyID0gMDtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2V0U3RhcnRQb3NpdGlvbiA9IChlbGVtKSA9PiB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gIGVsZW0uc3R5bGUubGVmdCA9IGAke2Rlc2t0b3Aub2Zmc2V0V2lkdGggLyAyICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoICogMC43KX1weGA7XHJcbiAgZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHtNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNyl9cHhgO1xyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKyAoZGVza3RvcC5vZmZzZXRXaWR0aCAtIGVsZW0ub2Zmc2V0V2lkdGgpIC8gMiArIDEwICsgZWxlbS5vZmZzZXRXaWR0aCA+PSBkZXNrdG9wLm9mZnNldFdpZHRoKSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG4gICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKz0gMTA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciArPSAxO1xyXG4gIH1cclxuICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wLm9mZnNldEhlaWdodCAtIGVsZW0ub2Zmc2V0SGVpZ2h0KSAvIDIgKyAzMCArIGVsZW0ub2Zmc2V0SGVpZ2h0ID49IGRlc2t0b3Aub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsID0gMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKz0gMzA7XHJcbiAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgKz0gMTtcclxuICB9XHJcbn07XHJcblxyXG5maWxlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS10ZXh0JykgfHwgaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gb25GaWxlT3BlbihldnQpIHtcclxuICAgIGV2dC50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgY29uc3QgZmlsZUxhYmVsID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbGFiZWwnKTtcclxuICAgIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gICAgY29uc3QgcGF0aEljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgbmV3V2luZG93ID0gd2luZG93VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgbmV3V2luZG93UGF0aCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgICBjb25zdCB3aW5kb3dIZWFkZXIgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcbiAgICBjb25zdCB3aW5kb3dEcmFnZ2FibGVBcmVhID0gd2luZG93SGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCBjbG9uZWRUYXJnZXRDb250ZW50ID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fY29udGVudCcpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IHJlZmVyZW5jZUljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgbmV3V2luZG93UGF0aC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgd2luZG93RHJhZ2dhYmxlQXJlYS5pbnNlcnRCZWZvcmUocGF0aEljb24sIG5ld1dpbmRvd1BhdGgpO1xyXG4gICAgZGVza3RvcC5hcHBlbmRDaGlsZChuZXdXaW5kb3cpO1xyXG4gICAgc2V0U3RhcnRQb3NpdGlvbihuZXdXaW5kb3cpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuXHJcbiAgICBjb25zdCBzZXRDdXJyZW50V2luZG93QWN0aXZlID0gKCkgPT4ge1xyXG4gICAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDE7XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgICAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICAgICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93LS1hY3RpdmUnKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgYS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgICB9KTtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpLmZvckVhY2goKGIpID0+IHtcclxuICAgICAgICBpZiAoYiA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICAgIGIuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYi5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuXHJcbiAgICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICAgIGlmIChtb3ZlRWxlbWVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBuZXdXaW5kb3cuc3R5bGUubGVmdCA9IGAke25ld1dpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uV2luZG93RHJhZyhlKSB7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUocmVmZXJlbmNlLCBuZXdXaW5kb3cpO1xyXG4gICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY29uc3Qgb25Db2xsYXBzZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgICBpZiAobmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVmZXJlbmNlID09PSBsYXN0RmlsZSkge1xyXG4gICAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25DbG9zZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgICBuZXdXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICAgIHBhdGhJY29uLnJlbW92ZSgpO1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgICAgcmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBjbG9uZWRUYXJnZXRDb250ZW50LnJlbW92ZSgpO1xyXG4gICAgICByZWZlcmVuY2VJY29uLnJlbW92ZSgpO1xyXG4gICAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgICBpZiAob2Zmc2V0VmVydGljYWxDb3VudGVyID4gMCkge1xyXG4gICAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgLT0gMzA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyIC09IDE7XHJcbiAgICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsIC09IDEwO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKHJlZmVyZW5jZSwgbmV3V2luZG93KTtcclxuICAgICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBuZXdXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKGUpID0+IHtcclxuICAgICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJykpIHtcclxuICAgICAgICBvbldpbmRvd0RyYWcoZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKSkge1xyXG4gICAgICAgIG9uQ29sbGFwc2VCdXR0b24oKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1jbG9zZScpKSB7XHJcbiAgICAgICAgb25DbG9zZUJ1dHRvbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWV4cGFuZCcpKSB7XHJcbiAgICAgICAgb25FeHBhbmRCdXR0b24oKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fY29udGVudCcpKSB7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICBuZXdXaW5kb3cuYXBwZW5kQ2hpbGQoY2xvbmVkVGFyZ2V0Q29udGVudCk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQnKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fY29udGVudCcpO1xyXG4gICAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS1mb2xkZXInKSkge1xyXG4gICAgICBjb25zdCBpbm5lckZpbGVzID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcbiAgICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50LS1mb2xkZXInKTtcclxuICAgICAgaW5uZXJGaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB7XHJcbiAgICAgICAgZmlsZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgfVxyXG59KTtcclxuIl0sImZpbGUiOiJ3aW5kb3cuanMifQ==
