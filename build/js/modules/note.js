import { throttle } from './throttle.js';

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
let initialWindowCounterVertical = 0;
let initialWindowCounterHorisontal = 0;
let offsetVerticalCounter = 0;
let offsetHorisontalCounter = 0;

const template = document.querySelector('.template');
const referenceTemplate = template.querySelector('.reference');
const windowTemplate = template.querySelector('.window');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const desktopWrapper = desktop.querySelector('.desktop__wrapper');

const file = document.querySelector('.file');
for (let i = 0; i < 100; i++) {
  const fileClone = file.cloneNode(true);
  document.querySelector('.desktop__wrapper').appendChild(fileClone);
}

let lastFile;

const fileList = document.querySelectorAll('.file');

fileList.forEach((item) => {
  console.log('fileList forEach');
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

  if (window) {
    windowDraggableArea.insertBefore(pathIcon, windowPath);
    console.log('windowPath');
  }

  const placeOnTop = () => {
    console.log('placeOnTop');
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    lastFile = reference;
    const windowHeaderList = desktop.querySelectorAll('.window__header');
    windowHeaderList.forEach((thing) => {
      thing.classList.remove('window__header--active');
    });
    windowHeader.classList.add('window__header--active');
  };

  const setActive = () => {
    console.log('setActive');
    const referenceList = document.querySelectorAll('.reference');
    referenceList.forEach((refernce) => {
      refernce.classList.remove('reference--active');
    });
    reference.classList.add('reference--active');
  };

  const onCollapseButton = () => {
    console.log('onCollapseButton');
    setActive();
    if (window.classList.contains('window--collapsed')) {
      window.classList.remove('window--collapsed');
      placeOnTop();
      console.log(' containsonCollapseButton');
    } else {
      if (reference !== lastFile) {
        console.log(' creference !== lastFile');
        placeOnTop();
      } else {
        window.classList.add('window--collapsed');
        console.log('window--collapse');
      }
    }
  };

  const onCloseButton = () => {
    console.log('onCloseButton');
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    removeWindowListeners();
    reference.remove();
    window.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
    if (offsetVerticalCounter > 0) {
      offsetVerticalCounter -= 1;
      initialWindowCounterVertical -= 30;
      console.log('offsetVerticalCounter');
    }
    if (offsetHorisontalCounter > 0) {
      console.log('offsetHorisontalCounter');
      offsetHorisontalCounter -= 1;
      initialWindowCounterHorisontal -= 10;
    }
  };

  const onExpandButton = () => {
    console.log('onExpandButton');
    window.classList.remove('window--collapsed');
    window.classList.toggle('window--fullscreen');
  };

  const onWindowClick = () => {
    console.log('onWindowClick');
    setActive();
    placeOnTop();
  };

  let i = 0;
  const onMoveEvent = (evt) => {
    console.log(i);
    i += 1;
    console.log('onMoveEvent');
    if (moveElement) {
      console.log('onMoveEvent moveElement');
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      window.style.left = `${window.offsetLeft - (initialX - newX)}px`;
      window.style.top = `${window.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  };

  const onMoveThrottled = throttle(onMoveEvent, 10);

  function stopMovement() {
    console.log('stopMovement');
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveThrottled);
    document.removeEventListener(events[deviceType].up, stopMovement);
  }

  const onWindowDrag = (evt) => {
    console.log('onWindowDrag');
    if (evt.cancelable) {
      console.log('preventDefault');
      evt.preventDefault();
    }
    if (!window.classList.contains('window--fullscreen')) {
      console.log('contains(window--fullscreen))');
      moveElement = true;
      initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveThrottled);
      document.addEventListener(events[deviceType].up, stopMovement);
    }
  };

  if (fileLabel) {
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
    console.log('fileLabel');
  }
  function onFileOpen() {
    console.log('onFileOpen');
    if (item.classList.contains('file--text') || item.classList.contains('file--folder')) {
      const fileContent = item.querySelector('.file__content');
      if (fileContent) {
        window.appendChild(fileContent);
        fileContent.classList.remove('visually-hidden');
        fileContent.classList.add('window__content');
        fileContent.classList.remove('file__content');
        if (item.classList.contains('file--folder')) {
          fileContent.classList.add('window--folder');
        }
      }
      desktop.appendChild(window);
      window.classList.remove('window--collapsed');
      fileLabel.classList.add('file__label--active');
      window.style.left = `${desktop.offsetWidth / 2 + initialWindowCounterHorisontal}px`;
      window.style.top = `${desktop.offsetHeight / 2 + initialWindowCounterVertical}px`;
      if (initialWindowCounterHorisontal + (desktopWrapper.offsetWidth - window.offsetWidth) / 2 + 10 + window.offsetWidth >= desktopWrapper.offsetWidth) {
        initialWindowCounterHorisontal = 0;
        offsetHorisontalCounter = 0;
        console.log(true, offsetHorisontalCounter);
      } else {
        initialWindowCounterHorisontal += 10;
        offsetHorisontalCounter += 1;
      }
      if (initialWindowCounterVertical + (desktopWrapper.offsetHeight - window.offsetHeight) / 2 + 30 + window.offsetHeight >= desktopWrapper.offsetHeight) {
        initialWindowCounterVertical = 0;
        offsetVerticalCounter = 0;
        console.log(true, offsetVerticalCounter);
      } else {
        initialWindowCounterVertical += 30;
        offsetVerticalCounter += 1;
      }
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
      if (window) {
        addWindowListeners();
      }
    }
  }
  function addWindowListeners() {
    console.log('addWindowListeners');
    windowButtonCollapse.addEventListener(events[deviceType].click, onCollapseButton);
    windowButtonClose.addEventListener(events[deviceType].click, onCloseButton);
    windowButtonExpand.addEventListener(events[deviceType].click, onExpandButton);
    window.addEventListener(events[deviceType].down, onWindowClick);
    windowDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);
  }
  function removeWindowListeners() {
    console.log('removeWindowListeners');
    windowButtonCollapse.removeEventListener(events[deviceType].click, onCollapseButton);
    windowButtonClose.removeEventListener(events[deviceType].click, onCloseButton);
    windowButtonExpand.removeEventListener(events[deviceType].click, onExpandButton);
    window.removeEventListener(events[deviceType].down, onWindowClick);
    windowDraggableArea.removeEventListener(events[deviceType].down, onWindowDrag);
  }
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tICcuL3Rocm90dGxlLmpzJztcclxuXHJcbmxldCBkZXZpY2VUeXBlID0gJyc7XHJcblxyXG5jb25zdCBpc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgZGV2aWNlVHlwZSA9ICd0b3VjaCc7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG4gIHRvdWNoOiB7XHJcbiAgICBkb3duOiAndG91Y2hzdGFydCcsXHJcbiAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgIHVwOiAndG91Y2hlbmQnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxufTtcclxuXHJcbmxldCBpbml0aWFsWCA9IDA7XHJcbmxldCBpbml0aWFsWSA9IDA7XHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbmxldCBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsID0gMDtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCA9IDA7XHJcbmxldCBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPSAwO1xyXG5sZXQgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG5cclxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcGxhdGUnKTtcclxuY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcucmVmZXJlbmNlJyk7XHJcbmNvbnN0IHdpbmRvd1RlbXBsYXRlID0gdGVtcGxhdGUucXVlcnlTZWxlY3RvcignLndpbmRvdycpO1xyXG5jb25zdCBkZXNrdG9wID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3AnKTtcclxuY29uc3QgZGVza3RvcEZvb3RlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCBkZXNrdG9wV3JhcHBlciA9IGRlc2t0b3AucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX3dyYXBwZXInKTtcclxuXHJcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZScpO1xyXG5mb3IgKGxldCBpID0gMDsgaSA8IDEwMDsgaSsrKSB7XHJcbiAgY29uc3QgZmlsZUNsb25lID0gZmlsZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX3dyYXBwZXInKS5hcHBlbmRDaGlsZChmaWxlQ2xvbmUpO1xyXG59XHJcblxyXG5sZXQgbGFzdEZpbGU7XHJcblxyXG5jb25zdCBmaWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcblxyXG5maWxlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgY29uc29sZS5sb2coJ2ZpbGVMaXN0IGZvckVhY2gnKTtcclxuICBjb25zdCB3aW5kb3cgPSB3aW5kb3dUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgY29uc3Qgd2luZG93RHJhZ2dhYmxlQXJlYSA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IHdpbmRvd0hlYWRlciA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19oZWFkZXInKTtcclxuICBjb25zdCB3aW5kb3dQYXRoID0gd2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX3BhdGgnKTtcclxuICBjb25zdCB3aW5kb3dCdXR0b25Db2xsYXBzZSA9IHdpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJyk7XHJcbiAgY29uc3Qgd2luZG93QnV0dG9uRXhwYW5kID0gd2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2J1dHRvbi0tZXhwYW5kJyk7XHJcbiAgY29uc3Qgd2luZG93QnV0dG9uQ2xvc2UgPSB3aW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19fYnV0dG9uLS1jbG9zZScpO1xyXG4gIGNvbnN0IGZpbGVMYWJlbCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX2xhYmVsJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlID0gcmVmZXJlbmNlVGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IGZpbGVOYW1lID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZUljb24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIHJlZmVyZW5jZS5pbnNlcnRCZWZvcmUocmVmZXJlbmNlSWNvbiwgcmVmZXJlbmNlVGV4dCk7XHJcbiAgY29uc3QgcGF0aEljb24gPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG5cclxuICBpZiAod2luZG93KSB7XHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmluc2VydEJlZm9yZShwYXRoSWNvbiwgd2luZG93UGF0aCk7XHJcbiAgICBjb25zb2xlLmxvZygnd2luZG93UGF0aCcpO1xyXG4gIH1cclxuXHJcbiAgY29uc3QgcGxhY2VPblRvcCA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdwbGFjZU9uVG9wJyk7XHJcbiAgICBjb25zdCBuZXd6SW5kZXggPSBpbml0aWFsekluZGV4ICsgMTtcclxuICAgIHdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBsYXN0RmlsZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IHdpbmRvd0hlYWRlckxpc3QgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3JBbGwoJy53aW5kb3dfX2hlYWRlcicpO1xyXG4gICAgd2luZG93SGVhZGVyTGlzdC5mb3JFYWNoKCh0aGluZykgPT4ge1xyXG4gICAgICB0aGluZy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3dfX2hlYWRlci0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIHdpbmRvd0hlYWRlci5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2hlYWRlci0tYWN0aXZlJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgc2V0QWN0aXZlID0gKCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ3NldEFjdGl2ZScpO1xyXG4gICAgY29uc3QgcmVmZXJlbmNlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5yZWZlcmVuY2UnKTtcclxuICAgIHJlZmVyZW5jZUxpc3QuZm9yRWFjaCgocmVmZXJuY2UpID0+IHtcclxuICAgICAgcmVmZXJuY2UuY2xhc3NMaXN0LnJlbW92ZSgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIH0pO1xyXG4gICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Db2xsYXBzZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkNvbGxhcHNlQnV0dG9uJyk7XHJcbiAgICBzZXRBY3RpdmUoKTtcclxuICAgIGlmICh3aW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgY29udGFpbnNvbkNvbGxhcHNlQnV0dG9uJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocmVmZXJlbmNlICE9PSBsYXN0RmlsZSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCcgY3JlZmVyZW5jZSAhPT0gbGFzdEZpbGUnKTtcclxuICAgICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3dpbmRvdy0tY29sbGFwc2UnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uQ2xvc2VCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnb25DbG9zZUJ1dHRvbicpO1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgcmVtb3ZlV2luZG93TGlzdGVuZXJzKCk7XHJcbiAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICB3aW5kb3cucmVtb3ZlKCk7XHJcbiAgICBmaWxlTGFiZWwuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRmlsZU9wZW4pO1xyXG4gICAgaWYgKG9mZnNldFZlcnRpY2FsQ291bnRlciA+IDApIHtcclxuICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyIC09IDE7XHJcbiAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgLT0gMzA7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdvZmZzZXRWZXJ0aWNhbENvdW50ZXInKTtcclxuICAgIH1cclxuICAgIGlmIChvZmZzZXRIb3Jpc29udGFsQ291bnRlciA+IDApIHtcclxuICAgICAgY29uc29sZS5sb2coJ29mZnNldEhvcmlzb250YWxDb3VudGVyJyk7XHJcbiAgICAgIG9mZnNldEhvcmlzb250YWxDb3VudGVyIC09IDE7XHJcbiAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCAtPSAxMDtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdvbkV4cGFuZEJ1dHRvbicpO1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnRvZ2dsZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25XaW5kb3dDbGljayA9ICgpID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdvbldpbmRvd0NsaWNrJyk7XHJcbiAgICBzZXRBY3RpdmUoKTtcclxuICAgIHBsYWNlT25Ub3AoKTtcclxuICB9O1xyXG5cclxuICBsZXQgaSA9IDA7XHJcbiAgY29uc3Qgb25Nb3ZlRXZlbnQgPSAoZXZ0KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhpKTtcclxuICAgIGkgKz0gMTtcclxuICAgIGNvbnNvbGUubG9nKCdvbk1vdmVFdmVudCcpO1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdvbk1vdmVFdmVudCBtb3ZlRWxlbWVudCcpO1xyXG4gICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRYIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgY29uc3QgbmV3WSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIHdpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7d2luZG93Lm9mZnNldExlZnQgLSAoaW5pdGlhbFggLSBuZXdYKX1weGA7XHJcbiAgICAgIHdpbmRvdy5zdHlsZS50b3AgPSBgJHt3aW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbk1vdmVUaHJvdHRsZWQgPSB0aHJvdHRsZShvbk1vdmVFdmVudCwgMTApO1xyXG5cclxuICBmdW5jdGlvbiBzdG9wTW92ZW1lbnQoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnc3RvcE1vdmVtZW50Jyk7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlVGhyb3R0bGVkKTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgY29uc3Qgb25XaW5kb3dEcmFnID0gKGV2dCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ29uV2luZG93RHJhZycpO1xyXG4gICAgaWYgKGV2dC5jYW5jZWxhYmxlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdwcmV2ZW50RGVmYXVsdCcpO1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGlmICghd2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1mdWxsc2NyZWVuJykpIHtcclxuICAgICAgY29uc29sZS5sb2coJ2NvbnRhaW5zKHdpbmRvdy0tZnVsbHNjcmVlbikpJyk7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZVRocm90dGxlZCk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBzdG9wTW92ZW1lbnQpO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGlmIChmaWxlTGFiZWwpIHtcclxuICAgIGZpbGVMYWJlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICBjb25zb2xlLmxvZygnZmlsZUxhYmVsJyk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIG9uRmlsZU9wZW4oKSB7XHJcbiAgICBjb25zb2xlLmxvZygnb25GaWxlT3BlbicpO1xyXG4gICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS10ZXh0JykgfHwgaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICAgIGNvbnN0IGZpbGVDb250ZW50ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fY29udGVudCcpO1xyXG4gICAgICBpZiAoZmlsZUNvbnRlbnQpIHtcclxuICAgICAgICB3aW5kb3cuYXBwZW5kQ2hpbGQoZmlsZUNvbnRlbnQpO1xyXG4gICAgICAgIGZpbGVDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gICAgICAgIGZpbGVDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudCcpO1xyXG4gICAgICAgIGZpbGVDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2NvbnRlbnQnKTtcclxuICAgICAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWZvbGRlcicpKSB7XHJcbiAgICAgICAgICBmaWxlQ29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWZvbGRlcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBkZXNrdG9wLmFwcGVuZENoaWxkKHdpbmRvdyk7XHJcbiAgICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgICB3aW5kb3cuc3R5bGUubGVmdCA9IGAke2Rlc2t0b3Aub2Zmc2V0V2lkdGggLyAyICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsfXB4YDtcclxuICAgICAgd2luZG93LnN0eWxlLnRvcCA9IGAke2Rlc2t0b3Aub2Zmc2V0SGVpZ2h0IC8gMiArIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWx9cHhgO1xyXG4gICAgICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpc29udGFsICsgKGRlc2t0b3BXcmFwcGVyLm9mZnNldFdpZHRoIC0gd2luZG93Lm9mZnNldFdpZHRoKSAvIDIgKyAxMCArIHdpbmRvdy5vZmZzZXRXaWR0aCA+PSBkZXNrdG9wV3JhcHBlci5vZmZzZXRXaWR0aCkge1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXNvbnRhbCA9IDA7XHJcbiAgICAgICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgPSAwO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRydWUsIG9mZnNldEhvcmlzb250YWxDb3VudGVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcmlzb250YWwgKz0gMTA7XHJcbiAgICAgICAgb2Zmc2V0SG9yaXNvbnRhbENvdW50ZXIgKz0gMTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wV3JhcHBlci5vZmZzZXRIZWlnaHQgLSB3aW5kb3cub2Zmc2V0SGVpZ2h0KSAvIDIgKyAzMCArIHdpbmRvdy5vZmZzZXRIZWlnaHQgPj0gZGVza3RvcFdyYXBwZXIub2Zmc2V0SGVpZ2h0KSB7XHJcbiAgICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbiAgICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyID0gMDtcclxuICAgICAgICBjb25zb2xlLmxvZyh0cnVlLCBvZmZzZXRWZXJ0aWNhbENvdW50ZXIpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKz0gMzA7XHJcbiAgICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgd2luZG93LnN0eWxlLnRyYW5zZm9ybSA9ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSknO1xyXG4gICAgICB3aW5kb3dQYXRoLnRleHRDb250ZW50ID0gYEM6LyR7ZmlsZU5hbWUudGV4dENvbnRlbnR9YDtcclxuICAgICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkNvbGxhcHNlQnV0dG9uKTtcclxuICAgICAgcmVmZXJlbmNlLmNsYXNzTGlzdC5hZGQoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgICAgZmlsZUxhYmVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICAgICAgc3RvcE1vdmVtZW50KCk7XHJcbiAgICAgIHNldEFjdGl2ZSgpO1xyXG4gICAgICBwbGFjZU9uVG9wKCk7XHJcbiAgICAgIGlmICh3aW5kb3cpIHtcclxuICAgICAgICBhZGRXaW5kb3dMaXN0ZW5lcnMoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBmdW5jdGlvbiBhZGRXaW5kb3dMaXN0ZW5lcnMoKSB7XHJcbiAgICBjb25zb2xlLmxvZygnYWRkV2luZG93TGlzdGVuZXJzJyk7XHJcbiAgICB3aW5kb3dCdXR0b25Db2xsYXBzZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcbiAgICB3aW5kb3dCdXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25DbG9zZUJ1dHRvbik7XHJcbiAgICB3aW5kb3dCdXR0b25FeHBhbmQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uRXhwYW5kQnV0dG9uKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5kb3duLCBvbldpbmRvd0NsaWNrKTtcclxuICAgIHdpbmRvd0RyYWdnYWJsZUFyZWEuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dEcmFnKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gcmVtb3ZlV2luZG93TGlzdGVuZXJzKCkge1xyXG4gICAgY29uc29sZS5sb2coJ3JlbW92ZVdpbmRvd0xpc3RlbmVycycpO1xyXG4gICAgd2luZG93QnV0dG9uQ29sbGFwc2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG4gICAgd2luZG93QnV0dG9uQ2xvc2UucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ2xvc2VCdXR0b24pO1xyXG4gICAgd2luZG93QnV0dG9uRXhwYW5kLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkV4cGFuZEJ1dHRvbik7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dDbGljayk7XHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93RHJhZyk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG4iXSwiZmlsZSI6Im5vdGUuanMifQ==
