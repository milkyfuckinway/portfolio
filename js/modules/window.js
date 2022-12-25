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

const setCurrentReferenceActive = (ref) => {
  const allReferences = desktop.querySelectorAll('.reference');
  allReferences.forEach((b) => {
    b.classList.remove('reference--active');
  });
  ref.classList.add('reference--active');
};

fileList.forEach((item) => {
  const onFileOpenThrottled = throttle(onFileOpen, 100);
  function onFileOpen(evt) {
    evt.target.removeEventListener(events[deviceType].click, onFileOpenThrottled);
    const fileName = evt.target.querySelector('.file__name');
    const pathIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    const newWindow = windowTemplate.cloneNode(true);
    const newWindowPath = newWindow.querySelector('.window__path');
    const windowDraggableArea = newWindow.querySelector('.window__draggable-area');
    const reference = referenceTemplate.cloneNode(true);
    const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    newWindowPath.textContent = fileName.textContent;
    windowDraggableArea.insertBefore(pathIcon, newWindowPath);
    desktop.appendChild(newWindow);
    setStartPosition(newWindow);
    setCurrentReferenceActive(reference);

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

    const onMoveEventThrottled = throttle(onMoveEvent);

    const onMoveStop = () => {
      document.removeEventListener(events[deviceType].move, onMoveEventThrottled);
      document.removeEventListener(events[deviceType].up, onMoveStop);
      moveElement = false;
    };

    const onWindowDrag = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (!newWindow.classList.contains('window--fullscreen')) {
        moveElement = true;
        initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        document.addEventListener(events[deviceType].move, onMoveEventThrottled);
        document.addEventListener(events[deviceType].up, onMoveStop);
      }
    };

    const onCollapseButton = () => {
      setCurrentReferenceActive(reference);
      if (newWindow.classList.contains('window--collapsed')) {
        newWindow.classList.remove('window--collapsed');
        setCurrentWindowActive(newWindow, reference);
      } else {
        if (reference === lastFile) {
          newWindow.classList.add('window--collapsed');
        } else {
          setCurrentWindowActive(newWindow, reference);
        }
      }
    };

    const onCloseButton = () => {
      newWindow.remove();
      pathIcon.remove();
      item.addEventListener(events[deviceType].click, onFileOpenThrottled);
      reference.remove();
      clonedTargetContent.remove();
      referenceIcon.remove();
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
      if (newWindow.classList.contains('window--fullscreen')) {
        newWindow.classList.remove('window--fullscreen');
      } else {
        newWindow.classList.add('window--fullscreen');
      }
    };

    const windowButtonExpand = newWindow.querySelector('.window__button--expand');
    const windowButtonClose = newWindow.querySelector('.window__button--close');
    const windowButtonCollapse = newWindow.querySelector('.window__button--collapse');

    function setCurrentWindowActive() {
      lastFile = reference;
      const newzIndex = initialzIndex + 1;
      newWindow.style.zIndex = `${newzIndex}`;
      initialzIndex = newzIndex;
      const allWindows = desktop.querySelectorAll('.window');
      allWindows.forEach((c) => {
        c.classList.remove('window--active');
        const allDraggebleAreas = c.querySelector('.window__draggable-area');
        allDraggebleAreas.removeEventListener(events[deviceType].down, onWindowDrag);
        const allButtonCollapse = c.querySelector('.window__button--collapse');
        allButtonCollapse.removeEventListener(events[deviceType].click, onCollapseButton);
        const allButtonClose = c.querySelector('.window__button--close');
        allButtonClose.removeEventListener(events[deviceType].click, onCloseButton);
        const allButtonExpand = c.querySelector('.window__button--expand');
        allButtonExpand.removeEventListener(events[deviceType].click, onExpandButton);
      });
      windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
      windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);
      windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);
      windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);
      newWindow.classList.add('window--active');
    }

    setCurrentWindowActive();

    newWindow.addEventListener(events[deviceType].down, () => {
      setCurrentWindowActive(newWindow, reference);
      setCurrentReferenceActive(reference);
    });

    /* apply content to the new window */
    newWindow.appendChild(clonedTargetContent);
    clonedTargetContent.classList.remove('visually-hidden');
    clonedTargetContent.classList.add('window__content');
    clonedTargetContent.classList.remove('file__content');
    if (evt.target.classList.contains('file--folder')) {
      const innerFiles = newWindow.querySelectorAll('.file');
      clonedTargetContent.classList.add('window__content--folder');
      innerFiles.forEach((file) => {
        file.addEventListener(events[deviceType].click, onFileOpenThrottled);
      });
    }
    /* create reference */
    const referenceText = reference.querySelector('.reference__text');
    referenceText.textContent = fileName.textContent;
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);
  }

  if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
    item.addEventListener(events[deviceType].click, onFileOpenThrottled);
  }
});

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZmlsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdEZpbGU7XHJcbmxldCBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG5sZXQgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbmxldCBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG5sZXQgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxubGV0IG9mZnNldEhvcmlzb250YWxDb3VudGVyID0gMDtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuY29uc3Qgc2V0U3RhcnRQb3NpdGlvbiA9IChlbGVtKSA9PiB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gIGVsZW0uc3R5bGUubGVmdCA9IGAke2Rlc2t0b3Aub2Zmc2V0V2lkdGggLyAyICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUud2lkdGggPSBgJHtNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoICogMC43KX1weGA7XHJcbiAgZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHtNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNyl9cHhgO1xyXG4gIGlmIChpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKyAoZGVza3RvcC5vZmZzZXRXaWR0aCAtIGVsZW0ub2Zmc2V0V2lkdGgpIC8gMiArIDEwICsgZWxlbS5vZmZzZXRXaWR0aCA+PSBkZXNrdG9wLm9mZnNldFdpZHRoKSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgPSAwO1xyXG4gICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKz0gMTA7XHJcbiAgICBvZmZzZXRIb3Jpc29udGFsQ291bnRlciArPSAxO1xyXG4gIH1cclxuICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wLm9mZnNldEhlaWdodCAtIGVsZW0ub2Zmc2V0SGVpZ2h0KSAvIDIgKyAzMCArIGVsZW0ub2Zmc2V0SGVpZ2h0ID49IGRlc2t0b3Aub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsID0gMDtcclxuICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciA9IDA7XHJcbiAgfSBlbHNlIHtcclxuICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKz0gMzA7XHJcbiAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgKz0gMTtcclxuICB9XHJcbn07XHJcblxyXG5jb25zdCBzZXRDdXJyZW50UmVmZXJlbmNlQWN0aXZlID0gKHJlZikgPT4ge1xyXG4gIGNvbnN0IGFsbFJlZmVyZW5jZXMgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWZlcmVuY2UnKTtcclxuICBhbGxSZWZlcmVuY2VzLmZvckVhY2goKGIpID0+IHtcclxuICAgIGIuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICB9KTtcclxuICByZWYuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxufTtcclxuXHJcbmZpbGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCBvbkZpbGVPcGVuVGhyb3R0bGVkID0gdGhyb3R0bGUob25GaWxlT3BlbiwgMTAwKTtcclxuICBmdW5jdGlvbiBvbkZpbGVPcGVuKGV2dCkge1xyXG4gICAgZXZ0LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3BlblRocm90dGxlZCk7XHJcbiAgICBjb25zdCBmaWxlTmFtZSA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKTtcclxuICAgIGNvbnN0IHBhdGhJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IG5ld1dpbmRvdyA9IHdpbmRvd1RlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IG5ld1dpbmRvd1BhdGggPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fcGF0aCcpO1xyXG4gICAgY29uc3Qgd2luZG93RHJhZ2dhYmxlQXJlYSA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgY2xvbmVkVGFyZ2V0Q29udGVudCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2NvbnRlbnQnKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCByZWZlcmVuY2VJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld1dpbmRvd1BhdGgudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCBuZXdXaW5kb3dQYXRoKTtcclxuICAgIGRlc2t0b3AuYXBwZW5kQ2hpbGQobmV3V2luZG93KTtcclxuICAgIHNldFN0YXJ0UG9zaXRpb24obmV3V2luZG93KTtcclxuICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuXHJcbiAgICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICAgIGlmIChtb3ZlRWxlbWVudCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBuZXdXaW5kb3cuc3R5bGUubGVmdCA9IGAke25ld1dpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlRXZlbnRUaHJvdHRsZWQgPSB0aHJvdHRsZShvbk1vdmVFdmVudCk7XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnRUaHJvdHRsZWQpO1xyXG4gICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9uV2luZG93RHJhZyA9IChlKSA9PiB7XHJcbiAgICAgIGlmIChlLmNhbmNlbGFibGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudFRocm90dGxlZCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9uQ29sbGFwc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuICAgICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tY29sbGFwc2VkJykpIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKG5ld1dpbmRvdywgcmVmZXJlbmNlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVmZXJlbmNlID09PSBsYXN0RmlsZSkge1xyXG4gICAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUobmV3V2luZG93LCByZWZlcmVuY2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBuZXdXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICAgIHBhdGhJY29uLnJlbW92ZSgpO1xyXG4gICAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuVGhyb3R0bGVkKTtcclxuICAgICAgcmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgICBjbG9uZWRUYXJnZXRDb250ZW50LnJlbW92ZSgpO1xyXG4gICAgICByZWZlcmVuY2VJY29uLnJlbW92ZSgpO1xyXG4gICAgICBpZiAob2Zmc2V0VmVydGljYWxDb3VudGVyID4gMCkge1xyXG4gICAgICAgIG9mZnNldFZlcnRpY2FsQ291bnRlciAtPSAxO1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgLT0gMzA7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKG9mZnNldEhvcmlzb250YWxDb3VudGVyID4gMCkge1xyXG4gICAgICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyIC09IDE7XHJcbiAgICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsIC09IDEwO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBpZiAobmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkV4cGFuZCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWV4cGFuZCcpO1xyXG4gICAgY29uc3Qgd2luZG93QnV0dG9uQ2xvc2UgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jbG9zZScpO1xyXG4gICAgY29uc3Qgd2luZG93QnV0dG9uQ29sbGFwc2UgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKSB7XHJcbiAgICAgIGxhc3RGaWxlID0gcmVmZXJlbmNlO1xyXG4gICAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gICAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgICBjb25zdCBhbGxXaW5kb3dzID0gZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93Jyk7XHJcbiAgICAgIGFsbFdpbmRvd3MuZm9yRWFjaCgoYykgPT4ge1xyXG4gICAgICAgIGMuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1hY3RpdmUnKTtcclxuICAgICAgICBjb25zdCBhbGxEcmFnZ2VibGVBcmVhcyA9IGMucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICAgICAgICBhbGxEcmFnZ2VibGVBcmVhcy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCBvbldpbmRvd0RyYWcpO1xyXG4gICAgICAgIGNvbnN0IGFsbEJ1dHRvbkNvbGxhcHNlID0gYy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJyk7XHJcbiAgICAgICAgYWxsQnV0dG9uQ29sbGFwc2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG4gICAgICAgIGNvbnN0IGFsbEJ1dHRvbkNsb3NlID0gYy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNsb3NlJyk7XHJcbiAgICAgICAgYWxsQnV0dG9uQ2xvc2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ2xvc2VCdXR0b24pO1xyXG4gICAgICAgIGNvbnN0IGFsbEJ1dHRvbkV4cGFuZCA9IGMucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1leHBhbmQnKTtcclxuICAgICAgICBhbGxCdXR0b25FeHBhbmQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRXhwYW5kQnV0dG9uKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dEcmFnKTtcclxuICAgICAgd2luZG93QnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG4gICAgICB3aW5kb3dCdXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25DbG9zZUJ1dHRvbik7XHJcbiAgICAgIHdpbmRvd0J1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25FeHBhbmRCdXR0b24pO1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1hY3RpdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcblxyXG4gICAgbmV3V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sICgpID0+IHtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShuZXdXaW5kb3csIHJlZmVyZW5jZSk7XHJcbiAgICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIC8qIGFwcGx5IGNvbnRlbnQgdG8gdGhlIG5ldyB3aW5kb3cgKi9cclxuICAgIG5ld1dpbmRvdy5hcHBlbmRDaGlsZChjbG9uZWRUYXJnZXRDb250ZW50KTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgndmlzdWFsbHktaGlkZGVuJyk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudCcpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19jb250ZW50Jyk7XHJcbiAgICBpZiAoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICAgIGNvbnN0IGlubmVyRmlsZXMgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuICAgICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQtLWZvbGRlcicpO1xyXG4gICAgICBpbm5lckZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcclxuICAgICAgICBmaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuVGhyb3R0bGVkKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKiBjcmVhdGUgcmVmZXJlbmNlICovXHJcbiAgICBjb25zdCByZWZlcmVuY2VUZXh0ID0gcmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2VfX3RleHQnKTtcclxuICAgIHJlZmVyZW5jZVRleHQudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICAgIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUocmVmZXJlbmNlSWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgICBkZXNrdG9wRm9vdGVyLmFwcGVuZENoaWxkKHJlZmVyZW5jZSk7XHJcbiAgICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG4gIH1cclxuXHJcbiAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS10ZXh0JykgfHwgaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICBpdGVtLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuVGhyb3R0bGVkKTtcclxuICB9XHJcbn0pO1xyXG4iXSwiZmlsZSI6IndpbmRvdy5qcyJ9
