import { throttle } from './throttle.js';
import { isTouchDevice, deviceType } from './checkDeviceType.js';

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

const template = document.querySelector('.template');
const desktop = document.querySelector('.desktop');
const desktopFooter = desktop.querySelector('.desktop__footer');
const windowTemplate = template.querySelector('.window');
const referenceTemplate = template.querySelector('.reference');
const desktopWidth = desktop.offsetWidth;
const desktopHeight = desktop.offsetHeight;
const halfDesktopWidth = desktopWidth / 2;
const halfDesktopHeight = desktopHeight / 2;
const windowWidth = Math.round(window.innerWidth * 0.7);
const windowHeight = Math.round(window.innerHeight * 0.7);

const fileList = document.querySelectorAll('.file');
fileList[1].children[0].classList.add('file__label--active');

let initialIndex = 0;
let initialX = 0;
let initialY = 0;
let lastReference;
let moveElement = false;
let initialWindowCounterVertical = 0;
let initialWindowCounterHorizontal = 0;
let offsetVerticalCounter = 0;
let offsetHorizontalCounter = 0;

const setStartPosition = (elem) => {
  elem.classList.remove('window--collapsed');
  elem.style.left = `${halfDesktopWidth + initialWindowCounterHorizontal}px`;
  elem.style.top = `${halfDesktopHeight + initialWindowCounterVertical}px`;
  elem.style.width = `${windowWidth}px`;
  elem.style.height = `${windowHeight}px`;
  if (initialWindowCounterHorizontal + (desktopWidth - windowWidth) / 2 + 10 + windowWidth >= desktopWidth) {
    initialWindowCounterHorizontal = 0;
    offsetHorizontalCounter = 0;
  } else {
    initialWindowCounterHorizontal += 10;
    offsetHorizontalCounter += 1;
  }
  if (initialWindowCounterVertical + (desktopHeight - windowHeight) / 2 + 30 + windowHeight >= desktopHeight) {
    initialWindowCounterVertical = 0;
    offsetVerticalCounter = 0;
  } else {
    initialWindowCounterVertical += 30;
    offsetVerticalCounter += 1;
  }
};

const onFileOpen = (evt) => {
  evt.preventDefault();
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
  newWindowPath.textContent = fileName.textContent;
  windowDraggableArea.insertBefore(pathIcon, newWindowPath);
  desktop.appendChild(newWindow);
  setStartPosition(newWindow);
  fileLabel.classList.add('file__label--active');
  const clonedTargetContent = evt.target.querySelector('.file__content').cloneNode(true);
  newWindow.appendChild(clonedTargetContent);
  clonedTargetContent.classList.remove('visually-hidden');
  clonedTargetContent.classList.add('window__content');
  clonedTargetContent.classList.remove('file__content');
  if (evt.target.classList.contains('file--folder')) {
    clonedTargetContent.classList.add('grid--folder');
  }

  const setCurrentWindowActive = () => {
    lastReference = reference;
    const newIndex = initialIndex + 1;
    newWindow.style.zIndex = `${newIndex}`;
    initialIndex = newIndex;
    reference.classList.add('reference--active');
    desktop.querySelectorAll('.window--active').forEach((a) => {
      a.classList.remove('window--active');
    });
    newWindow.classList.add('window--active');
    desktop.querySelectorAll('.reference').forEach((b) => {
      if (b === lastReference) {
        b.classList.add('reference--active');
      } else {
        b.classList.remove('reference--active');
      }
    });
  };

  setCurrentWindowActive();

  const onMoveEvent = (e) => {
    if (moveElement) {
      e.stopPropagation();
      const newX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      const newY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      const calcX = initialX - newX;
      const calcY = initialY - newY;
      const leftPosition = `${newWindow.offsetLeft - calcX}px`;
      const topPosition = `${newWindow.offsetTop - calcY}px`;
      newWindow.style.left = leftPosition;
      newWindow.style.top = topPosition;
      initialX = newX;
      initialY = newY;
    }
  };

  const onMoveThrottled = throttle(onMoveEvent, 10);

  const onMoveStop = () => {
    document.removeEventListener(events[deviceType].move, onMoveThrottled);
    document.removeEventListener(events[deviceType].up, onMoveStop);
    moveElement = false;
  };

  const onWindowDrag = (e) => {
    setCurrentWindowActive();
    e.stopPropagation();
    if (e.cancelable) {
      e.preventDefault();
    }
    if (!newWindow.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? e.clientX : e.touches[0].clientX;
      initialY = !isTouchDevice() ? e.clientY : e.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveThrottled);
      document.addEventListener(events[deviceType].up, onMoveStop);
    }
  };

  const onCollapseButton = () => {
    if (newWindow.classList.contains('window--collapsed')) {
      newWindow.classList.remove('window--collapsed');
      setCurrentWindowActive();
    } else {
      if (reference === lastReference) {
        newWindow.classList.add('window--collapsed');
      } else {
        setCurrentWindowActive();
      }
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

  const onCloseButton = () => {
    evt.target.classList.add('file');
    evt.target.classList.remove('file--opened');
    setCurrentWindowActive();
    newWindow.remove();
    reference.remove();
    fileLabel.classList.remove('file__label--active');
    if (offsetVerticalCounter > 0) {
      offsetVerticalCounter -= 1;
      initialWindowCounterVertical -= 30;
    }
    if (offsetHorizontalCounter > 0) {
      offsetHorizontalCounter -= 1;
      initialWindowCounterHorizontal -= 10;
    }
  };

  const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
  const referenceText = reference.querySelector('.reference__text');
  referenceText.textContent = fileName.textContent;
  reference.insertBefore(referenceIcon, referenceText);
  desktopFooter.appendChild(reference);
  reference.addEventListener(events[deviceType].click, onCollapseButton);

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
};

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
});

desktop.addEventListener(events[deviceType].click, (evt) => {
  if (evt.target.closest('.file') && !evt.target.closest('.file--link')) {
    onFileOpen(evt);
  }
});

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBpc1RvdWNoRGV2aWNlLCBkZXZpY2VUeXBlIH0gZnJvbSAnLi9jaGVja0RldmljZVR5cGUuanMnO1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxuY29uc3QgdGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudGVtcGxhdGUnKTtcclxuY29uc3QgZGVza3RvcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wJyk7XHJcbmNvbnN0IGRlc2t0b3BGb290ZXIgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wX19mb290ZXInKTtcclxuY29uc3Qgd2luZG93VGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcud2luZG93Jyk7XHJcbmNvbnN0IHJlZmVyZW5jZVRlbXBsYXRlID0gdGVtcGxhdGUucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZScpO1xyXG5jb25zdCBkZXNrdG9wV2lkdGggPSBkZXNrdG9wLm9mZnNldFdpZHRoO1xyXG5jb25zdCBkZXNrdG9wSGVpZ2h0ID0gZGVza3RvcC5vZmZzZXRIZWlnaHQ7XHJcbmNvbnN0IGhhbGZEZXNrdG9wV2lkdGggPSBkZXNrdG9wV2lkdGggLyAyO1xyXG5jb25zdCBoYWxmRGVza3RvcEhlaWdodCA9IGRlc2t0b3BIZWlnaHQgLyAyO1xyXG5jb25zdCB3aW5kb3dXaWR0aCA9IE1hdGgucm91bmQod2luZG93LmlubmVyV2lkdGggKiAwLjcpO1xyXG5jb25zdCB3aW5kb3dIZWlnaHQgPSBNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuNyk7XHJcblxyXG5jb25zdCBmaWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcbmZpbGVMaXN0WzFdLmNoaWxkcmVuWzBdLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuXHJcbmxldCBpbml0aWFsSW5kZXggPSAwO1xyXG5sZXQgaW5pdGlhbFggPSAwO1xyXG5sZXQgaW5pdGlhbFkgPSAwO1xyXG5sZXQgbGFzdFJlZmVyZW5jZTtcclxubGV0IG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbmxldCBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsID0gMDtcclxubGV0IGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXpvbnRhbCA9IDA7XHJcbmxldCBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPSAwO1xyXG5sZXQgb2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgPSAwO1xyXG5cclxuY29uc3Qgc2V0U3RhcnRQb3NpdGlvbiA9IChlbGVtKSA9PiB7XHJcbiAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gIGVsZW0uc3R5bGUubGVmdCA9IGAke2hhbGZEZXNrdG9wV2lkdGggKyBpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWx9cHhgO1xyXG4gIGVsZW0uc3R5bGUudG9wID0gYCR7aGFsZkRlc2t0b3BIZWlnaHQgKyBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsfXB4YDtcclxuICBlbGVtLnN0eWxlLndpZHRoID0gYCR7d2luZG93V2lkdGh9cHhgO1xyXG4gIGVsZW0uc3R5bGUuaGVpZ2h0ID0gYCR7d2luZG93SGVpZ2h0fXB4YDtcclxuICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsICsgKGRlc2t0b3BXaWR0aCAtIHdpbmRvd1dpZHRoKSAvIDIgKyAxMCArIHdpbmRvd1dpZHRoID49IGRlc2t0b3BXaWR0aCkge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsID0gMDtcclxuICAgIG9mZnNldEhvcml6b250YWxDb3VudGVyID0gMDtcclxuICB9IGVsc2Uge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsICs9IDEwO1xyXG4gICAgb2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgKz0gMTtcclxuICB9XHJcbiAgaWYgKGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgKyAoZGVza3RvcEhlaWdodCAtIHdpbmRvd0hlaWdodCkgLyAyICsgMzAgKyB3aW5kb3dIZWlnaHQgPj0gZGVza3RvcEhlaWdodCkge1xyXG4gICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCA9IDA7XHJcbiAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPSAwO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBpbml0aWFsV2luZG93Q291bnRlclZlcnRpY2FsICs9IDMwO1xyXG4gICAgb2Zmc2V0VmVydGljYWxDb3VudGVyICs9IDE7XHJcbiAgfVxyXG59O1xyXG5cclxuY29uc3Qgb25GaWxlT3BlbiA9IChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBldnQudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGUnKTtcclxuICBldnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gIGNvbnN0IGZpbGVMYWJlbCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2xhYmVsJyk7XHJcbiAgY29uc3QgZmlsZU5hbWUgPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19uYW1lJyk7XHJcbiAgY29uc3QgcGF0aEljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IG5ld1dpbmRvdyA9IHdpbmRvd1RlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICBjb25zdCBuZXdXaW5kb3dQYXRoID0gbmV3V2luZG93LnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX3BhdGgnKTtcclxuICBjb25zdCB3aW5kb3dIZWFkZXIgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcbiAgY29uc3Qgd2luZG93RHJhZ2dhYmxlQXJlYSA9IHdpbmRvd0hlYWRlci5xdWVyeVNlbGVjdG9yKCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZSA9IHJlZmVyZW5jZVRlbXBsYXRlLmNsb25lTm9kZSh0cnVlKTtcclxuICBuZXdXaW5kb3dQYXRoLnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgd2luZG93RHJhZ2dhYmxlQXJlYS5pbnNlcnRCZWZvcmUocGF0aEljb24sIG5ld1dpbmRvd1BhdGgpO1xyXG4gIGRlc2t0b3AuYXBwZW5kQ2hpbGQobmV3V2luZG93KTtcclxuICBzZXRTdGFydFBvc2l0aW9uKG5ld1dpbmRvdyk7XHJcbiAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICBjb25zdCBjbG9uZWRUYXJnZXRDb250ZW50ID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fY29udGVudCcpLmNsb25lTm9kZSh0cnVlKTtcclxuICBuZXdXaW5kb3cuYXBwZW5kQ2hpbGQoY2xvbmVkVGFyZ2V0Q29udGVudCk7XHJcbiAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QucmVtb3ZlKCd2aXN1YWxseS1oaWRkZW4nKTtcclxuICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ3dpbmRvd19fY29udGVudCcpO1xyXG4gIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fY29udGVudCcpO1xyXG4gIGlmIChldnQudGFyZ2V0LmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LmFkZCgnZ3JpZC0tZm9sZGVyJyk7XHJcbiAgfVxyXG5cclxuICBjb25zdCBzZXRDdXJyZW50V2luZG93QWN0aXZlID0gKCkgPT4ge1xyXG4gICAgbGFzdFJlZmVyZW5jZSA9IHJlZmVyZW5jZTtcclxuICAgIGNvbnN0IG5ld0luZGV4ID0gaW5pdGlhbEluZGV4ICsgMTtcclxuICAgIG5ld1dpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXdJbmRleH1gO1xyXG4gICAgaW5pdGlhbEluZGV4ID0gbmV3SW5kZXg7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLndpbmRvdy0tYWN0aXZlJykuZm9yRWFjaCgoYSkgPT4ge1xyXG4gICAgICBhLmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJykuZm9yRWFjaCgoYikgPT4ge1xyXG4gICAgICBpZiAoYiA9PT0gbGFzdFJlZmVyZW5jZSkge1xyXG4gICAgICAgIGIuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBiLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH07XHJcblxyXG4gIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlRXZlbnQgPSAoZSkgPT4ge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGNvbnN0IGNhbGNYID0gaW5pdGlhbFggLSBuZXdYO1xyXG4gICAgICBjb25zdCBjYWxjWSA9IGluaXRpYWxZIC0gbmV3WTtcclxuICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID0gYCR7bmV3V2luZG93Lm9mZnNldExlZnQgLSBjYWxjWH1weGA7XHJcbiAgICAgIGNvbnN0IHRvcFBvc2l0aW9uID0gYCR7bmV3V2luZG93Lm9mZnNldFRvcCAtIGNhbGNZfXB4YDtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLmxlZnQgPSBsZWZ0UG9zaXRpb247XHJcbiAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSB0b3BQb3NpdGlvbjtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlVGhyb3R0bGVkID0gdGhyb3R0bGUob25Nb3ZlRXZlbnQsIDEwKTtcclxuXHJcbiAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZVRocm90dGxlZCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uV2luZG93RHJhZyA9IChlKSA9PiB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgaWYgKGUuY2FuY2VsYWJsZSkge1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIW5ld1dpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRYIDogZS50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGluaXRpYWxZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WSA6IGUudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVUaHJvdHRsZWQpO1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgb25Nb3ZlU3RvcCk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25Db2xsYXBzZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWNvbGxhcHNlZCcpKSB7XHJcbiAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocmVmZXJlbmNlID09PSBsYXN0UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25FeHBhbmRCdXR0b24gPSAoKSA9PiB7XHJcbiAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKHJlZmVyZW5jZSwgbmV3V2luZG93KTtcclxuICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25DbG9zZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIGV2dC50YXJnZXQuY2xhc3NMaXN0LmFkZCgnZmlsZScpO1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlLS1vcGVuZWQnKTtcclxuICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgIG5ld1dpbmRvdy5yZW1vdmUoKTtcclxuICAgIHJlZmVyZW5jZS5yZW1vdmUoKTtcclxuICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICBpZiAob2Zmc2V0VmVydGljYWxDb3VudGVyID4gMCkge1xyXG4gICAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgLT0gMTtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCAtPSAzMDtcclxuICAgIH1cclxuICAgIGlmIChvZmZzZXRIb3Jpem9udGFsQ291bnRlciA+IDApIHtcclxuICAgICAgb2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgLT0gMTtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsIC09IDEwO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIGNvbnN0IHJlZmVyZW5jZUljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gIHJlZmVyZW5jZVRleHQudGV4dENvbnRlbnQgPSBmaWxlTmFtZS50ZXh0Q29udGVudDtcclxuICByZWZlcmVuY2UuaW5zZXJ0QmVmb3JlKHJlZmVyZW5jZUljb24sIHJlZmVyZW5jZVRleHQpO1xyXG4gIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICByZWZlcmVuY2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2VCdXR0b24pO1xyXG5cclxuICBuZXdXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgKGUpID0+IHtcclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpKSB7XHJcbiAgICAgIG9uV2luZG93RHJhZyhlKTtcclxuICAgIH1cclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19jb250ZW50JykpIHtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBuZXdXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIChlKSA9PiB7XHJcbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1jb2xsYXBzZScpKSB7XHJcbiAgICAgIG9uQ29sbGFwc2VCdXR0b24oKTtcclxuICAgIH1cclxuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWNsb3NlJykpIHtcclxuICAgICAgb25DbG9zZUJ1dHRvbigpO1xyXG4gICAgfVxyXG4gICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tZXhwYW5kJykpIHtcclxuICAgICAgb25FeHBhbmRCdXR0b24oKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbmRlc2t0b3BGb290ZXIuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZXZ0KSA9PiB7XHJcbiAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbn0pO1xyXG5cclxuZGVza3RvcC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGV2dCkgPT4ge1xyXG4gIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5maWxlJykgJiYgIWV2dC50YXJnZXQuY2xvc2VzdCgnLmZpbGUtLWxpbmsnKSkge1xyXG4gICAgb25GaWxlT3BlbihldnQpO1xyXG4gIH1cclxufSk7XHJcbiJdLCJmaWxlIjoid2luZG93LmpzIn0=
