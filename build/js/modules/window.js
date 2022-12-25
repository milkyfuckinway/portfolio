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

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${desktop.offsetWidth / 2 /* + initialWindowCounterHorisontal*/}px`;
  elem.style.top = `${desktop.offsetHeight / 2 /* +  initialWindowCounterVertical*/}px`;
  elem.style.width = `${Math.round(window.innerWidth * 0.7)}px`;
  elem.style.height = `${Math.round(window.innerHeight * 0.7)}px`;
};

const setCurrentWindowActive = (win, ref) => {
  lastFile = ref;
  const newzIndex = initialzIndex + 1;
  win.style.zIndex = `${newzIndex}`;
  initialzIndex = newzIndex;
  const allWindows = desktop.querySelectorAll('.window');
  allWindows.forEach((c) => {
    c.classList.remove('window--active');
  });
  win.classList.add('window--active');
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
    setCurrentWindowActive(newWindow, reference);
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
    const onMoveEventThrottled = throttle(onMoveEvent, 10);
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

    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
    newWindow.addEventListener(events[deviceType].down, () => {
      setCurrentWindowActive(newWindow, reference);
      setCurrentReferenceActive(reference);
    });

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

    const windowButtonCollapse = newWindow.querySelector('.window__button--collapse');
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);

    const onCloseButton = () => {
      newWindow.remove();
      pathIcon.remove();
      item.addEventListener(events[deviceType].click, onFileOpen);
      reference.remove();
      clonedTargetContent.remove();
      referenceIcon.remove();
    };

    const windowButtonClose = newWindow.querySelector('.window__button--close');
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);

    const onExpandButton = () => {
      if (newWindow.classList.contains('window--fullscreen')) {
        newWindow.classList.remove('window--fullscreen');
      } else {
        newWindow.classList.add('window--fullscreen');
      }
    };
    const windowButtonExpand = newWindow.querySelector('.window__button--expand');
    windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);

    /* apply content to the new window */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZmlsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdEZpbGU7XHJcbmxldCBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG5cclxuZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBkZXNrdG9wRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxufSk7XHJcblxyXG5jb25zdCBzZXRTdGFydFBvc2l0aW9uID0gKGVsZW0pID0+IHtcclxuICBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgZWxlbS5zdHlsZS5sZWZ0ID0gYCR7ZGVza3RvcC5vZmZzZXRXaWR0aCAvIDIgLyogKyBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwqL31weGA7XHJcbiAgZWxlbS5zdHlsZS50b3AgPSBgJHtkZXNrdG9wLm9mZnNldEhlaWdodCAvIDIgLyogKyAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCovfXB4YDtcclxuICBlbGVtLnN0eWxlLndpZHRoID0gYCR7TWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJXaWR0aCAqIDAuNyl9cHhgO1xyXG4gIGVsZW0uc3R5bGUuaGVpZ2h0ID0gYCR7TWF0aC5yb3VuZCh3aW5kb3cuaW5uZXJIZWlnaHQgKiAwLjcpfXB4YDtcclxufTtcclxuXHJcbmNvbnN0IHNldEN1cnJlbnRXaW5kb3dBY3RpdmUgPSAod2luLCByZWYpID0+IHtcclxuICBsYXN0RmlsZSA9IHJlZjtcclxuICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICB3aW4uc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgaW5pdGlhbHpJbmRleCA9IG5ld3pJbmRleDtcclxuICBjb25zdCBhbGxXaW5kb3dzID0gZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93Jyk7XHJcbiAgYWxsV2luZG93cy5mb3JFYWNoKChjKSA9PiB7XHJcbiAgICBjLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgfSk7XHJcbiAgd2luLmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbn07XHJcblxyXG5jb25zdCBzZXRDdXJyZW50UmVmZXJlbmNlQWN0aXZlID0gKHJlZikgPT4ge1xyXG4gIGNvbnN0IGFsbFJlZmVyZW5jZXMgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWZlcmVuY2UnKTtcclxuICBhbGxSZWZlcmVuY2VzLmZvckVhY2goKGIpID0+IHtcclxuICAgIGIuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICB9KTtcclxuICByZWYuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxufTtcclxuXHJcbmZpbGVMaXN0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICBjb25zdCBvbkZpbGVPcGVuVGhyb3R0bGVkID0gdGhyb3R0bGUob25GaWxlT3BlbiwgMTAwKTtcclxuICBmdW5jdGlvbiBvbkZpbGVPcGVuKGV2dCkge1xyXG4gICAgZXZ0LnRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3BlblRocm90dGxlZCk7XHJcbiAgICBjb25zdCBmaWxlTmFtZSA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKTtcclxuICAgIGNvbnN0IHBhdGhJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IG5ld1dpbmRvdyA9IHdpbmRvd1RlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IG5ld1dpbmRvd1BhdGggPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fcGF0aCcpO1xyXG4gICAgY29uc3Qgd2luZG93RHJhZ2dhYmxlQXJlYSA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gICAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgY2xvbmVkVGFyZ2V0Q29udGVudCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2NvbnRlbnQnKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCByZWZlcmVuY2VJY29uID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld1dpbmRvd1BhdGgudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCBuZXdXaW5kb3dQYXRoKTtcclxuICAgIGRlc2t0b3AuYXBwZW5kQ2hpbGQobmV3V2luZG93KTtcclxuICAgIHNldFN0YXJ0UG9zaXRpb24obmV3V2luZG93KTtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUobmV3V2luZG93LCByZWZlcmVuY2UpO1xyXG4gICAgc2V0Q3VycmVudFJlZmVyZW5jZUFjdGl2ZShyZWZlcmVuY2UpO1xyXG5cclxuICAgIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGUpID0+IHtcclxuICAgICAgaWYgKG1vdmVFbGVtZW50ID09PSB0cnVlKSB7XHJcbiAgICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICAgIG5ld1dpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7bmV3V2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgICAgbmV3V2luZG93LnN0eWxlLnRvcCA9IGAke25ld1dpbmRvdy5vZmZzZXRUb3AgLSAoaW5pdGlhbFkgLSBuZXdZKX1weGA7XHJcbiAgICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IG9uTW92ZUV2ZW50VGhyb3R0bGVkID0gdGhyb3R0bGUob25Nb3ZlRXZlbnQsIDEwKTtcclxuICAgIGNvbnN0IG9uTW92ZVN0b3AgPSAoKSA9PiB7XHJcbiAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50VGhyb3R0bGVkKTtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgfTtcclxuICAgIGNvbnN0IG9uV2luZG93RHJhZyA9IChlKSA9PiB7XHJcbiAgICAgIGlmIChlLmNhbmNlbGFibGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudFRocm90dGxlZCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dEcmFnKTtcclxuICAgIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoKSA9PiB7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUobmV3V2luZG93LCByZWZlcmVuY2UpO1xyXG4gICAgICBzZXRDdXJyZW50UmVmZXJlbmNlQWN0aXZlKHJlZmVyZW5jZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50UmVmZXJlbmNlQWN0aXZlKHJlZmVyZW5jZSk7XHJcbiAgICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShuZXdXaW5kb3csIHJlZmVyZW5jZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlZmVyZW5jZSA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKG5ld1dpbmRvdywgcmVmZXJlbmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgd2luZG93QnV0dG9uQ29sbGFwc2UgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpO1xyXG4gICAgd2luZG93QnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICAgIG5ld1dpbmRvdy5yZW1vdmUoKTtcclxuICAgICAgcGF0aEljb24ucmVtb3ZlKCk7XHJcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICAgIGNsb25lZFRhcmdldENvbnRlbnQucmVtb3ZlKCk7XHJcbiAgICAgIHJlZmVyZW5jZUljb24ucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkNsb3NlID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKTtcclxuICAgIHdpbmRvd0J1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkV4cGFuZCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWV4cGFuZCcpO1xyXG4gICAgd2luZG93QnV0dG9uRXhwYW5kLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkV4cGFuZEJ1dHRvbik7XHJcblxyXG4gICAgLyogYXBwbHkgY29udGVudCB0byB0aGUgbmV3IHdpbmRvdyAqL1xyXG4gICAgbmV3V2luZG93LmFwcGVuZENoaWxkKGNsb25lZFRhcmdldENvbnRlbnQpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCd2aXN1YWxseS1oaWRkZW4nKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50Jyk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2NvbnRlbnQnKTtcclxuICAgIGlmIChldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgICAgY29uc3QgaW5uZXJGaWxlcyA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG4gICAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudC0tZm9sZGVyJyk7XHJcbiAgICAgIGlubmVyRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG4gICAgICAgIGZpbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qIGNyZWF0ZSByZWZlcmVuY2UgKi9cclxuICAgIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLXRleHQnKSB8fCBpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW5UaHJvdHRsZWQpO1xyXG4gIH1cclxufSk7XHJcbiJdLCJmaWxlIjoid2luZG93LmpzIn0=
