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

const setCurrentWindowActive = (win) => {
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
  lastFile = ref;
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
    newWindowPath.textContent = `C:/${fileName.textContent}`;
    windowDraggableArea.insertBefore(pathIcon, newWindowPath);
    desktop.appendChild(newWindow);
    setStartPosition(newWindow);
    setCurrentWindowActive(newWindow);
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
        initialX = !isTouchDevice() ? e.clientX : evt.touches[0].clientX;
        initialY = !isTouchDevice() ? e.clientY : evt.touches[0].clientY;
        document.addEventListener(events[deviceType].move, onMoveEvent);
        document.addEventListener(events[deviceType].up, onMoveStop);
      }
    };

    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
    newWindow.addEventListener(events[deviceType].down, () => {
      setCurrentWindowActive(newWindow);
      setCurrentReferenceActive(reference);
    });

    const onCollapseButton = () => {
      if (lastFile === reference) {
        if (newWindow.classList.contains('window--collapsed')) {
          newWindow.classList.remove('window--collapsed');
        } else {
          newWindow.classList.add('window--collapsed');
        }
      } else {
        setCurrentWindowActive(newWindow);
        setCurrentReferenceActive(reference);
      }
      setCurrentWindowActive(newWindow);
    };

    const windowButtonCollapse = newWindow.querySelector('.window__button--collapse');
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);

    const onCloseButton = () => {
      newWindow.remove();
      item.addEventListener(events[deviceType].click, onFileOpen);
      reference.remove();
    };

    const windowButtonClose = newWindow.querySelector('.window__button--close');
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);

    // windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);

    /* apply content to the new window */
    const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
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
    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);
  }

  if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
    item.addEventListener(events[deviceType].click, onFileOpen);
  }
});

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBldmVudHMsIGlzVG91Y2hEZXZpY2UsIGRldmljZVR5cGUgfSBmcm9tICcuL2NoZWNrRGV2aWNlVHlwZS5qcyc7XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZmlsZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuZmlsZScpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdEZpbGU7XHJcblxyXG5kZXNrdG9wRm9vdGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgKGV2dCkgPT4ge1xyXG4gIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gIGRlc2t0b3BGb290ZXIuc2Nyb2xsTGVmdCArPSBldnQuZGVsdGFZO1xyXG59KTtcclxuXHJcbmNvbnN0IHNldFN0YXJ0UG9zaXRpb24gPSAoZWxlbSkgPT4ge1xyXG4gIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICBlbGVtLnN0eWxlLmxlZnQgPSBgJHtkZXNrdG9wLm9mZnNldFdpZHRoIC8gMiAvKiArIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCovfXB4YDtcclxuICBlbGVtLnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiAvKiArICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsKi99cHhgO1xyXG4gIGVsZW0uc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbn07XHJcblxyXG5jb25zdCBzZXRDdXJyZW50V2luZG93QWN0aXZlID0gKHdpbikgPT4ge1xyXG4gIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAxO1xyXG4gIHdpbi5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gIGNvbnN0IGFsbFdpbmRvd3MgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy53aW5kb3cnKTtcclxuICBhbGxXaW5kb3dzLmZvckVhY2goKGMpID0+IHtcclxuICAgIGMuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1hY3RpdmUnKTtcclxuICB9KTtcclxuICB3aW4uY2xhc3NMaXN0LmFkZCgnd2luZG93LS1hY3RpdmUnKTtcclxufTtcclxuXHJcbmNvbnN0IHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUgPSAocmVmKSA9PiB7XHJcbiAgbGFzdEZpbGUgPSByZWY7XHJcbiAgY29uc3QgYWxsUmVmZXJlbmNlcyA9IGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpO1xyXG4gIGFsbFJlZmVyZW5jZXMuZm9yRWFjaCgoYikgPT4ge1xyXG4gICAgYi5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gIH0pO1xyXG4gIHJlZi5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG59O1xyXG5cclxuZmlsZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gIGZ1bmN0aW9uIG9uRmlsZU9wZW4oZXZ0KSB7XHJcbiAgICBldnQudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gICAgY29uc3QgcGF0aEljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgbmV3V2luZG93ID0gd2luZG93VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgbmV3V2luZG93UGF0aCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgICBjb25zdCB3aW5kb3dEcmFnZ2FibGVBcmVhID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdXaW5kb3dQYXRoLnRleHRDb250ZW50ID0gYEM6LyR7ZmlsZU5hbWUudGV4dENvbnRlbnR9YDtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCBuZXdXaW5kb3dQYXRoKTtcclxuICAgIGRlc2t0b3AuYXBwZW5kQ2hpbGQobmV3V2luZG93KTtcclxuICAgIHNldFN0YXJ0UG9zaXRpb24obmV3V2luZG93KTtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUobmV3V2luZG93KTtcclxuICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuXHJcbiAgICBjb25zdCBvbk1vdmVFdmVudCA9IChlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7bmV3V2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbldpbmRvd0RyYWcgPSAoZSkgPT4ge1xyXG4gICAgICBpZiAoZS5jYW5jZWxhYmxlKSB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICghbmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93RHJhZyk7XHJcbiAgICBuZXdXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKCkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKG5ld1dpbmRvdyk7XHJcbiAgICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IG9uQ29sbGFwc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICAgIGlmIChsYXN0RmlsZSA9PT0gcmVmZXJlbmNlKSB7XHJcbiAgICAgICAgaWYgKG5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tY29sbGFwc2VkJykpIHtcclxuICAgICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShuZXdXaW5kb3cpO1xyXG4gICAgICAgIHNldEN1cnJlbnRSZWZlcmVuY2VBY3RpdmUocmVmZXJlbmNlKTtcclxuICAgICAgfVxyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKG5ld1dpbmRvdyk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkNvbGxhcHNlID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKTtcclxuICAgIHdpbmRvd0J1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxuXHJcbiAgICBjb25zdCBvbkNsb3NlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBuZXdXaW5kb3cucmVtb3ZlKCk7XHJcbiAgICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHdpbmRvd0J1dHRvbkNsb3NlID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKTtcclxuICAgIHdpbmRvd0J1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNsb3NlQnV0dG9uKTtcclxuXHJcbiAgICAvLyB3aW5kb3dCdXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRXhwYW5kQnV0dG9uKTtcclxuXHJcbiAgICAvKiBhcHBseSBjb250ZW50IHRvIHRoZSBuZXcgd2luZG93ICovXHJcbiAgICBjb25zdCBjbG9uZWRUYXJnZXRDb250ZW50ID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fY29udGVudCcpLmNsb25lTm9kZSh0cnVlKTtcclxuICAgIG5ld1dpbmRvdy5hcHBlbmRDaGlsZChjbG9uZWRUYXJnZXRDb250ZW50KTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgndmlzdWFsbHktaGlkZGVuJyk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudCcpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19jb250ZW50Jyk7XHJcbiAgICBpZiAoZXZ0LnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICAgIGNvbnN0IGlubmVyRmlsZXMgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuICAgICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQtLWZvbGRlcicpO1xyXG4gICAgICBpbm5lckZpbGVzLmZvckVhY2goKGZpbGUpID0+IHtcclxuICAgICAgICBmaWxlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICAvKiBjcmVhdGUgcmVmZXJlbmNlICovXHJcbiAgICBjb25zdCByZWZlcmVuY2VUZXh0ID0gcmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2VfX3RleHQnKTtcclxuICAgIHJlZmVyZW5jZVRleHQudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICAgIGNvbnN0IHJlZmVyZW5jZUljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLXRleHQnKSB8fCBpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgIGl0ZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH1cclxufSk7XHJcbiJdLCJmaWxlIjoid2luZG93LmpzIn0=
