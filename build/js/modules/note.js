let deviceType = '';

const isTouchDevice = () => {
  try {
    document.createEvent('TouchEvent');
    deviceType = 'touch';
    return true;
  } catch (err) {
    deviceType = 'mouse';
    return false;
  }
};

isTouchDevice();

const events = {
  mouse: {
    down: 'mousedown',
    move: 'mousemove',
    up: 'mouseup',
    click: 'click',
  },
  touch: {
    down: 'touchstart',
    move: 'touchmove',
    up: 'touchend',
    click: 'click',
  },
};

let initialX = 0;
let initialY = 0;
let initialzIndex = 0;
let moveElement = false;

const file = document.querySelector('.file');
const desktopFooter = document.querySelector('.desktop__footer');
const referenceTemplate = document.querySelector('.reference');

for (let i = 0; i < 1000; i++) {
  const fileClone = file.cloneNode(true);
  document.querySelector('.desktop__wrapper').appendChild(fileClone);
}

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = item.querySelector('.window');
  const buttonCollapse = item.querySelector('.window__button--collapse');
  const buttonExpand = item.querySelector('.window__button--expand');
  const buttonClose = item.querySelector('.window__button--close');
  const noteDraggableArea = item.querySelector('.window__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
  const windowHeader = item.querySelector('.window__header');

  const placeOnTop = () => {
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    lastFile = reference;
    const windowHeaderList = document.querySelectorAll('.window__header');
    windowHeaderList.forEach((thing) => {
      thing.classList.remove('window__header--active');
    });
    windowHeader.classList.add('window__header--active');
  };

  const setActive = () => {
    const referenceList = document.querySelectorAll('.reference');
    referenceList.forEach((refernce) => {
      refernce.classList.remove('reference--active');
    });
    reference.classList.add('reference--active');
  };

  const onCollapseButton = () => {
    setActive();
    if (window.classList.contains('window--collapsed')) {
      window.classList.remove('window--collapsed');
      placeOnTop();
    } else {
      if (reference !== lastFile) {
        placeOnTop();
      } else {
        window.classList.add('window--collapsed');
      }
    }
  };

  const onFileOpen = () => {
    stopMovement();
    window.classList.remove('window--collapsed');
    fileLabel.classList.add('file__label--active');
    window.style.left = '50%';
    window.style.top = '50%';
    window.style.transform = 'translate(-50%, -50%)';
    reference.querySelector('.reference__text').textContent =
      item.querySelector('.file__name').textContent;
    reference.addEventListener('click', onCollapseButton);
    reference.classList.add('reference--active');
    desktopFooter.appendChild(reference);
    fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
    setActive();
    placeOnTop();
  };

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
    placeOnTop();
  };

  const onExpandButton = () => {
    window.classList.remove('window--collapsed');
    window.classList.toggle('window--fullscreen');
    placeOnTop();
  };

  const onWindowClick = () => {
    setActive();
    placeOnTop();
  };

  const onMoveEvent = (evt) => {
    if (moveElement) {
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      window.style.left = `${window.offsetLeft - (initialX - newX)}px`;
      window.style.top = `${window.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  };

  const onWindowDrag = (evt) => {
    if (evt.cancelable) {
      evt.preventDefault();
    }
    if (!window.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveEvent);
      document.addEventListener(events[deviceType].up, stopMovement);
    }
  };

  fileLabel.addEventListener(events[deviceType].click, onFileOpen);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapseButton);

  buttonClose.addEventListener(events[deviceType].click, onCloseButton);

  buttonExpand.addEventListener(events[deviceType].click, onExpandButton);

  window.addEventListener(events[deviceType].down, onWindowClick);

  noteDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
    document.removeEventListener(events[deviceType].up, stopMovement);
  }
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZScpO1xyXG5jb25zdCBkZXNrdG9wRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxuXHJcbmZvciAobGV0IGkgPSAwOyBpIDwgMTAwMDsgaSsrKSB7XHJcbiAgY29uc3QgZmlsZUNsb25lID0gZmlsZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX3dyYXBwZXInKS5hcHBlbmRDaGlsZChmaWxlQ2xvbmUpO1xyXG59XHJcblxyXG5sZXQgbGFzdEZpbGU7XHJcblxyXG5jb25zdCBmaWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcblxyXG5maWxlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgY29uc3Qgd2luZG93ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93Jyk7XHJcbiAgY29uc3QgYnV0dG9uQ29sbGFwc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKTtcclxuICBjb25zdCBidXR0b25FeHBhbmQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tZXhwYW5kJyk7XHJcbiAgY29uc3QgYnV0dG9uQ2xvc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKTtcclxuICBjb25zdCBub3RlRHJhZ2dhYmxlQXJlYSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICBjb25zdCBmaWxlTGFiZWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCB3aW5kb3dIZWFkZXIgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2hlYWRlcicpO1xyXG5cclxuICBjb25zdCBwbGFjZU9uVG9wID0gKCkgPT4ge1xyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDE7XHJcbiAgICB3aW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gICAgbGFzdEZpbGUgPSByZWZlcmVuY2U7XHJcbiAgICBjb25zdCB3aW5kb3dIZWFkZXJMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvd19faGVhZGVyJyk7XHJcbiAgICB3aW5kb3dIZWFkZXJMaXN0LmZvckVhY2goKHRoaW5nKSA9PiB7XHJcbiAgICAgIHRoaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvd19faGVhZGVyLS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93SGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19faGVhZGVyLS1hY3RpdmUnKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzZXRBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCByZWZlcmVuY2VMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpO1xyXG4gICAgcmVmZXJlbmNlTGlzdC5mb3JFYWNoKChyZWZlcm5jZSkgPT4ge1xyXG4gICAgICByZWZlcm5jZS5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBpZiAod2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgcGxhY2VPblRvcCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJlZmVyZW5jZSAhPT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkZpbGVPcGVuID0gKCkgPT4ge1xyXG4gICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QuYWRkKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICB3aW5kb3cuc3R5bGUubGVmdCA9ICc1MCUnO1xyXG4gICAgd2luZG93LnN0eWxlLnRvcCA9ICc1MCUnO1xyXG4gICAgd2luZG93LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xyXG4gICAgcmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2VfX3RleHQnKS50ZXh0Q29udGVudCA9XHJcbiAgICAgIGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKS50ZXh0Q29udGVudDtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ29sbGFwc2VCdXR0b24pO1xyXG4gICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICBkZXNrdG9wRm9vdGVyLmFwcGVuZENoaWxkKHJlZmVyZW5jZSk7XHJcbiAgICBmaWxlTGFiZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBwbGFjZU9uVG9wKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25DbG9zZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIHJlZmVyZW5jZS5yZW1vdmUoKTtcclxuICAgIGZpbGVMYWJlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICBwbGFjZU9uVG9wKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25FeHBhbmRCdXR0b24gPSAoKSA9PiB7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QudG9nZ2xlKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgIHBsYWNlT25Ub3AoKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbldpbmRvd0NsaWNrID0gKCkgPT4ge1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBwbGFjZU9uVG9wKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlRXZlbnQgPSAoZXZ0KSA9PiB7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICB3aW5kb3cuc3R5bGUubGVmdCA9IGAke3dpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICB3aW5kb3cuc3R5bGUudG9wID0gYCR7d2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25XaW5kb3dEcmFnID0gKGV2dCkgPT4ge1xyXG4gICAgaWYgKGV2dC5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG4gICAgaWYgKCF3aW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IHRydWU7XHJcbiAgICAgIGluaXRpYWxYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgaW5pdGlhbFkgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZpbGVMYWJlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcblxyXG4gIGJ1dHRvbkNvbGxhcHNlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxuXHJcbiAgYnV0dG9uQ2xvc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ2xvc2VCdXR0b24pO1xyXG5cclxuICBidXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRXhwYW5kQnV0dG9uKTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93Q2xpY2spO1xyXG5cclxuICBub3RlRHJhZ2dhYmxlQXJlYS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCBvbldpbmRvd0RyYWcpO1xyXG5cclxuICBmdW5jdGlvbiBzdG9wTW92ZW1lbnQoKSB7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
