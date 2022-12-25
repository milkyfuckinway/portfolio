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

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${desktop.offsetWidth / 2 /* + initialWindowCounterHorisontal*/}px`;
  elem.style.top = `${desktop.offsetHeight / 2 /* +  initialWindowCounterVertical*/}px`;
  elem.style.transform = 'translate(-50%, -50%)';
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
  function onFileOpen(evt) {
    evt.target.removeEventListener(events[deviceType].click, onFileOpen);
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
      const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      newWindow.style.left = `${newWindow.offsetLeft - (initialX - newX)}px`;
      newWindow.style.top = `${newWindow.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    };

    const onMoveStop = () => {
      document.removeEventListener(events[deviceType].move, onMoveEvent);
    };

    const onWindowDrag = (e) => {
      if (e.cancelable) {
        e.preventDefault();
      }
      if (!newWindow.classList.contains('window--fullscreen')) {
        initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
        document.addEventListener(events[deviceType].move, onMoveEvent);
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
    item.addEventListener(events[deviceType].click, onFileOpen);
  }
});

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZmlsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdEZpbGU7XHJcblxyXG5kZXNrdG9wRm9vdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2dCkgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGRlc2t0b3BGb290ZXIuc2Nyb2xsTGVmdCArPSBldnQuZGVsdGFZO1xyXG59KTtcclxuXHJcbmNvbnN0IHNldFN0YXJ0UG9zaXRpb24gPSAoZWxlbSkgPT4ge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICBlbGVtLnN0eWxlLmxlZnQgPSBgJHtkZXNrdG9wLm9mZnNldFdpZHRoIC8gMiAvKiArIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCovfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiAvKiArICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsKi99cHhgO1xyXG4gIGVsZW0uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbn07XHJcblxyXG5jb25zdCBzZXRDdXJyZW50V2luZG93QWN0aXZlID0gKHdpbiwgcmVmKSA9PiB7XHJcbiAgbGFzdEZpbGUgPSByZWY7XHJcbiAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDE7XHJcbiAgd2luLnN0eWxlLnpJbmRleCA9IGAke25ld3pJbmRleH1gO1xyXG4gIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgY29uc3QgYWxsV2luZG93cyA9IGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvdycpO1xyXG4gIGFsbFdpbmRvd3MuZm9yRWFjaCgoYykgPT4ge1xyXG4gICAgYy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gIH0pO1xyXG4gIHdpbi5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG59O1xyXG5cclxuY29uc3Qgc2V0Q3VycmVudFJlZmVyZW5jZUFjdGl2ZSA9IChyZWYpID0+IHtcclxuICBjb25zdCBhbGxSZWZlcmVuY2VzID0gZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJyk7XHJcbiAgYWxsUmVmZXJlbmNlcy5mb3JFYWNoKChiKSA9PiB7XHJcbiAgICBiLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgfSk7XHJcbiAgcmVmLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbn07XHJcblxyXG5maWxlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgZnVuY3Rpb24gb25GaWxlT3BlbihldnQpIHtcclxuICAgIGV2dC50YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgY29uc3QgZmlsZU5hbWUgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7XHJcbiAgICBjb25zdCBwYXRoSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCBuZXdXaW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBjb25zdCBuZXdXaW5kb3dQYXRoID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX3BhdGgnKTtcclxuICAgIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICAgIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIGNvbnN0IGNsb25lZFRhcmdldENvbnRlbnQgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19jb250ZW50JykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdXaW5kb3dQYXRoLnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmluc2VydEJlZm9yZShwYXRoSWNvbiwgbmV3V2luZG93UGF0aCk7XHJcbiAgICBkZXNrdG9wLmFwcGVuZENoaWxkKG5ld1dpbmRvdyk7XHJcbiAgICBzZXRTdGFydFBvc2l0aW9uKG5ld1dpbmRvdyk7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKG5ld1dpbmRvdywgcmVmZXJlbmNlKTtcclxuICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuXHJcbiAgICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7bmV3V2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbldpbmRvd0RyYWcgPSAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dEcmFnKTtcclxuICAgIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCAoKSA9PiB7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUobmV3V2luZG93LCByZWZlcmVuY2UpO1xyXG4gICAgICBzZXRDdXJyZW50UmVmZXJlbmNlQWN0aXZlKHJlZmVyZW5jZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50UmVmZXJlbmNlQWN0aXZlKHJlZmVyZW5jZSk7XHJcbiAgICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShuZXdXaW5kb3csIHJlZmVyZW5jZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHJlZmVyZW5jZSA9PT0gbGFzdEZpbGUpIHtcclxuICAgICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKG5ld1dpbmRvdywgcmVmZXJlbmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgd2luZG93QnV0dG9uQ29sbGFwc2UgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpO1xyXG4gICAgd2luZG93QnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG5cclxuICAgIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICAgIG5ld1dpbmRvdy5yZW1vdmUoKTtcclxuICAgICAgcGF0aEljb24ucmVtb3ZlKCk7XHJcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICAgIGNsb25lZFRhcmdldENvbnRlbnQucmVtb3ZlKCk7XHJcbiAgICAgIHJlZmVyZW5jZUljb24ucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkNsb3NlID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKTtcclxuICAgIHdpbmRvd0J1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkV4cGFuZCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWV4cGFuZCcpO1xyXG4gICAgd2luZG93QnV0dG9uRXhwYW5kLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkV4cGFuZEJ1dHRvbik7XHJcblxyXG4gICAgLyogYXBwbHkgY29udGVudCB0byB0aGUgbmV3IHdpbmRvdyAqL1xyXG4gICAgbmV3V2luZG93LmFwcGVuZENoaWxkKGNsb25lZFRhcmdldENvbnRlbnQpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCd2aXN1YWxseS1oaWRkZW4nKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50Jyk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2NvbnRlbnQnKTtcclxuICAgIGlmIChldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgICAgY29uc3QgaW5uZXJGaWxlcyA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG4gICAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudC0tZm9sZGVyJyk7XHJcbiAgICAgIGlubmVyRmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4ge1xyXG4gICAgICAgIGZpbGUuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8qIGNyZWF0ZSByZWZlcmVuY2UgKi9cclxuICAgIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLXRleHQnKSB8fCBpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH1cclxufSk7XHJcbiJdLCJmaWxlIjoid2luZG93LmpzIn0=
