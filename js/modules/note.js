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

const template = document.querySelector('.template');
const referenceTemplate = template.querySelector('.reference');
const windowTemplate = template.querySelector('.window');
const destkop = document.querySelector('.desktop');
const desktopFooter = destkop.querySelector('.desktop__footer');

// const file = document.querySelector('.file');
// for (let i = 0; i < 100; i++) {
//   const fileClone = file.cloneNode(true);
//   document.querySelector('.desktop__wrapper').appendChild(fileClone);
// }

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  const window = windowTemplate.cloneNode(true);
  const windowDraggableArea = window.querySelector('.window__draggable-area');
  const windowHeader = window.querySelector('.window__header');
  const windowPath = window.querySelector('.window__path');
  const windowButtonCollapse = window.querySelector('.window__button--collapse');
  const windowButtonExpand = window.querySelector('.window__button--expand');
  const windowButtonClose = window.querySelector('.window__button--close');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);
  const fileName = item.querySelector('.file__name');
  const referenceText = reference.querySelector('.reference__text');
  const referenceIcon = item.querySelector('.file__icon').cloneNode(true);
  reference.insertBefore(referenceIcon, referenceText);
  const pathIcon = item.querySelector('.file__icon').cloneNode(true);

  if (windowPath) {
    windowDraggableArea.insertBefore(pathIcon, windowPath);
  }

  const placeOnTop = () => {
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    lastFile = reference;
    const windowHeaderList = destkop.querySelectorAll('.window__header');
    console.log(windowHeaderList);
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

  function onFileOpen() {
    if (item.classList.contains('file--text')) {
      const fileContent = item.querySelector('.file__content');
      if (fileContent) {
        window.appendChild(fileContent);
        fileContent.classList.remove('visually-hidden');
        fileContent.classList.add('window__content');
      }
      destkop.appendChild(window);
      window.classList.remove('window--collapsed');
      fileLabel.classList.add('file__label--active');
      window.style.left = '50%';
      window.style.top = '50%';
      window.style.transform = 'translate(-50%, -50%)';
      windowPath.textContent = `C:/${fileName.textContent}`;
      referenceText.textContent = fileName.textContent;
      reference.addEventListener('click', onCollapseButton);
      reference.classList.add('reference--active');
      desktopFooter.appendChild(reference);
      fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
      stopMovement();
      setActive();
      placeOnTop();
    }
  }

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
    window.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  };

  const onExpandButton = () => {
    window.classList.remove('window--collapsed');
    window.classList.toggle('window--fullscreen');
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

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
    document.removeEventListener(events[deviceType].up, stopMovement);
  }

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

  if (fileLabel) {
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  }

  if (windowButtonCollapse) {
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);
  }

  if (windowButtonClose) {
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);
  }

  if (windowButtonExpand) {
    windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);
  }

  if (window) {
    window.addEventListener(events[deviceType].down, onWindowClick);
  }

  if (windowDraggableArea) {
    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
  }
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRlbXBsYXRlJyk7XHJcbmNvbnN0IHJlZmVyZW5jZVRlbXBsYXRlID0gdGVtcGxhdGUucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZScpO1xyXG5jb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuY29uc3QgZGVzdGtvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wJyk7XHJcbmNvbnN0IGRlc2t0b3BGb290ZXIgPSBkZXN0a29wLnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wX19mb290ZXInKTtcclxuXHJcbi8vIGNvbnN0IGZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZScpO1xyXG4vLyBmb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XHJcbi8vICAgY29uc3QgZmlsZUNsb25lID0gZmlsZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbi8vICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX3dyYXBwZXInKS5hcHBlbmRDaGlsZChmaWxlQ2xvbmUpO1xyXG4vLyB9XHJcblxyXG5sZXQgbGFzdEZpbGU7XHJcblxyXG5jb25zdCBmaWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcblxyXG5maWxlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgY29uc3Qgd2luZG93ID0gd2luZG93VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IHdpbmRvd0RyYWdnYWJsZUFyZWEgPSB3aW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fZHJhZ2dhYmxlLWFyZWEnKTtcclxuICBjb25zdCB3aW5kb3dIZWFkZXIgPSB3aW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcbiAgY29uc3Qgd2luZG93UGF0aCA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgY29uc3Qgd2luZG93QnV0dG9uQ29sbGFwc2UgPSB3aW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpO1xyXG4gIGNvbnN0IHdpbmRvd0J1dHRvbkV4cGFuZCA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWV4cGFuZCcpO1xyXG4gIGNvbnN0IHdpbmRvd0J1dHRvbkNsb3NlID0gd2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tY2xvc2UnKTtcclxuICBjb25zdCBmaWxlTGFiZWwgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19sYWJlbCcpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCBmaWxlTmFtZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKTtcclxuICBjb25zdCByZWZlcmVuY2VUZXh0ID0gcmVmZXJlbmNlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2VfX3RleHQnKTtcclxuICBjb25zdCByZWZlcmVuY2VJY29uID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuICByZWZlcmVuY2UuaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUljb24sIHJlZmVyZW5jZVRleHQpO1xyXG4gIGNvbnN0IHBhdGhJY29uID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbicpLmNsb25lTm9kZSh0cnVlKTtcclxuXHJcbiAgaWYgKHdpbmRvd1BhdGgpIHtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuaW5zZXJ0QmVmb3JlKHBhdGhJY29uLCB3aW5kb3dQYXRoKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHBsYWNlT25Ub3AgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICAgIHdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IHdpbmRvd0hlYWRlckxpc3QgPSBkZXN0a29wLnF1ZXJ5U2VsZWN0b3JBbGwoJy53aW5kb3dfX2hlYWRlcicpO1xyXG4gICAgY29uc29sZS5sb2cod2luZG93SGVhZGVyTGlzdCk7XHJcbiAgICB3aW5kb3dIZWFkZXJMaXN0LmZvckVhY2goKHRoaW5nKSA9PiB7XHJcbiAgICAgIHRoaW5nLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvd19faGVhZGVyLS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgd2luZG93SGVhZGVyLmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19faGVhZGVyLS1hY3RpdmUnKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBzZXRBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICBjb25zdCByZWZlcmVuY2VMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpO1xyXG4gICAgcmVmZXJlbmNlTGlzdC5mb3JFYWNoKChyZWZlcm5jZSkgPT4ge1xyXG4gICAgICByZWZlcm5jZS5jbGFzc0xpc3QucmVtb3ZlKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgfSk7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBpZiAod2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgcGxhY2VPblRvcCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHJlZmVyZW5jZSAhPT0gbGFzdEZpbGUpIHtcclxuICAgICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmdW5jdGlvbiBvbkZpbGVPcGVuKCkge1xyXG4gICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS10ZXh0JykpIHtcclxuICAgICAgY29uc3QgZmlsZUNvbnRlbnQgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19jb250ZW50Jyk7XHJcbiAgICAgIGlmIChmaWxlQ29udGVudCkge1xyXG4gICAgICAgIHdpbmRvdy5hcHBlbmRDaGlsZChmaWxlQ29udGVudCk7XHJcbiAgICAgICAgZmlsZUNvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgndmlzdWFsbHktaGlkZGVuJyk7XHJcbiAgICAgICAgZmlsZUNvbnRlbnQuY2xhc3NMaXN0LmFkZCgnd2luZG93X19jb250ZW50Jyk7XHJcbiAgICAgIH1cclxuICAgICAgZGVzdGtvcC5hcHBlbmRDaGlsZCh3aW5kb3cpO1xyXG4gICAgICB3aW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgICAgd2luZG93LnN0eWxlLmxlZnQgPSAnNTAlJztcclxuICAgICAgd2luZG93LnN0eWxlLnRvcCA9ICc1MCUnO1xyXG4gICAgICB3aW5kb3cuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbiAgICAgIHdpbmRvd1BhdGgudGV4dENvbnRlbnQgPSBgQzovJHtmaWxlTmFtZS50ZXh0Q29udGVudH1gO1xyXG4gICAgICByZWZlcmVuY2VUZXh0LnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ29sbGFwc2VCdXR0b24pO1xyXG4gICAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgZGVza3RvcEZvb3Rlci5hcHBlbmRDaGlsZChyZWZlcmVuY2UpO1xyXG4gICAgICBmaWxlTGFiZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgICBzdG9wTW92ZW1lbnQoKTtcclxuICAgICAgc2V0QWN0aXZlKCk7XHJcbiAgICAgIHBsYWNlT25Ub3AoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICB3aW5kb3cucmVtb3ZlKCk7XHJcbiAgICBmaWxlTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnRvZ2dsZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25XaW5kb3dDbGljayA9ICgpID0+IHtcclxuICAgIHNldEFjdGl2ZSgpO1xyXG4gICAgcGxhY2VPblRvcCgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGV2dCkgPT4ge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgd2luZG93LnN0eWxlLmxlZnQgPSBgJHt3aW5kb3cub2Zmc2V0TGVmdCAtIChpbml0aWFsWCAtIG5ld1gpfXB4YDtcclxuICAgICAgd2luZG93LnN0eWxlLnRvcCA9IGAke3dpbmRvdy5vZmZzZXRUb3AgLSAoaW5pdGlhbFkgLSBuZXdZKX1weGA7XHJcbiAgICAgIGluaXRpYWxYID0gbmV3WDtcclxuICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGZ1bmN0aW9uIHN0b3BNb3ZlbWVudCgpIHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICB9XHJcblxyXG4gIGNvbnN0IG9uV2luZG93RHJhZyA9IChldnQpID0+IHtcclxuICAgIGlmIChldnQuY2FuY2VsYWJsZSkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgbW92ZUVsZW1lbnQgPSB0cnVlO1xyXG4gICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlRXZlbnQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBpZiAoZmlsZUxhYmVsKSB7XHJcbiAgICBmaWxlTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvd0J1dHRvbkNvbGxhcHNlKSB7XHJcbiAgICB3aW5kb3dCdXR0b25Db2xsYXBzZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBpZiAod2luZG93QnV0dG9uQ2xvc2UpIHtcclxuICAgIHdpbmRvd0J1dHRvbkNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkNsb3NlQnV0dG9uKTtcclxuICB9XHJcblxyXG4gIGlmICh3aW5kb3dCdXR0b25FeHBhbmQpIHtcclxuICAgIHdpbmRvd0J1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25FeHBhbmRCdXR0b24pO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvdykge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93Q2xpY2spO1xyXG4gIH1cclxuXHJcbiAgaWYgKHdpbmRvd0RyYWdnYWJsZUFyZWEpIHtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dEcmFnKTtcclxuICB9XHJcbn0pO1xyXG5cclxuZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBkZXNrdG9wRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxufSk7XHJcbiJdLCJmaWxlIjoibm90ZS5qcyJ9
