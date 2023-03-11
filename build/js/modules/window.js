import { throttle } from './throttle.js';
import { isTouchDevice, deviceType } from './checkDeviceType.js';

isTouchDevice();
const createDesktop = () => {
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

  const coefficientWidth = () => {
    if (desktopWidth < 500) {
      return 0.9;
    } else {
      return 0.5;
    }
  };

  const coefficientHeight = () => {
    if (desktopWidth < 500) {
      return 0.7;
    } else {
      return 0.5;
    }
  };

  const windowWidth = Math.round(window.innerWidth * coefficientWidth());
  const windowHeight = Math.round(window.innerHeight * coefficientHeight());
  const textIconTemplate = template.querySelector('.file__icon--text');
  const linkIconTemplate = template.querySelector('.file__icon--link');
  const folderIconTemplate = template.querySelector('.file__icon--folder');
  const fileList = document.querySelectorAll('.file');

  const setIcon = (item) => {
    if (item.classList.contains('file--text')) {
      return textIconTemplate;
    }
    if (item.classList.contains('file--link')) {
      return linkIconTemplate;
    }
    if (item.classList.contains('file--folder')) {
      return folderIconTemplate;
    }
  };

  fileList.forEach((file) => {
    const textIcon = setIcon(file).cloneNode(true);
    const fileLabel = file.querySelector('.file__label');
    const fileName = file.querySelector('.file__name');
    fileLabel.insertBefore(textIcon, fileName);
  });

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
      initialWindowCounterHorizontal += 8;
      offsetHorizontalCounter += 1;
    }
    if (initialWindowCounterVertical + (desktopHeight - windowHeight) / 2 + 30 + windowHeight >= desktopHeight) {
      initialWindowCounterVertical = 0;
      offsetVerticalCounter = 0;
    } else {
      initialWindowCounterVertical += 40;
      offsetVerticalCounter += 1;
    }
  };

  const onFileOpen = (evt) => {
    evt.preventDefault();
    evt.target.classList.remove('file');
    evt.target.classList.add('file--opened');
    const fileLabel = evt.target.querySelector('.file__label');
    const fileName = evt.target.querySelector('.file__name');
    const fileIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    fileIcon.classList.remove('file__icon--desktop');
    const newWindow = windowTemplate.cloneNode(true);
    const newWindowPath = newWindow.querySelector('.window__path');
    const windowHeader = newWindow.querySelector('.window__header');
    const windowDraggableArea = windowHeader.querySelector('.window__draggable-area');
    const reference = referenceTemplate.cloneNode(true);
    newWindowPath.textContent = fileName.textContent;
    windowDraggableArea.insertBefore(fileIcon, newWindowPath);
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
        initialWindowCounterVertical -= 40;
      }
      if (offsetHorizontalCounter > 0) {
        offsetHorizontalCounter -= 1;
        initialWindowCounterHorizontal -= 10;
      }
    };

    const referenceIcon = evt.target.querySelector('.file__icon').cloneNode(true);
    referenceIcon.classList.remove('file__icon--desktop');
    const referenceText = reference.querySelector('.reference__text');
    referenceText.textContent = fileName.textContent;
    reference.insertBefore(referenceIcon, referenceText);
    desktopFooter.appendChild(reference);
    reference.addEventListener(events[deviceType].click, onCollapseButton);

    newWindow.addEventListener(events[deviceType].down, (e) => {
      if (e.target.closest('.window__draggable-area')) {
        onWindowDrag(e);
      }
      if (e.target.closest('.window')) {
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
};
export { createDesktop };

//# sourceMappingURL=window.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3dpbmRvdy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUuanMnO1xyXG5pbXBvcnQgeyBpc1RvdWNoRGV2aWNlLCBkZXZpY2VUeXBlIH0gZnJvbSAnLi9jaGVja0RldmljZVR5cGUuanMnO1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5jb25zdCBjcmVhdGVEZXNrdG9wID0gKCkgPT4ge1xyXG4gIGNvbnN0IGV2ZW50cyA9IHtcclxuICAgIG1vdXNlOiB7XHJcbiAgICAgIGRvd246ICdtb3VzZWRvd24nLFxyXG4gICAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgICAgdXA6ICdtb3VzZXVwJyxcclxuICAgICAgY2xpY2s6ICdjbGljaycsXHJcbiAgICB9LFxyXG4gICAgdG91Y2g6IHtcclxuICAgICAgZG93bjogJ3RvdWNoc3RhcnQnLFxyXG4gICAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gICAgfSxcclxuICB9O1xyXG5cclxuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50ZW1wbGF0ZScpO1xyXG4gIGNvbnN0IGRlc2t0b3AgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcCcpO1xyXG4gIGNvbnN0IGRlc2t0b3BGb290ZXIgPSBkZXNrdG9wLnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wX19mb290ZXInKTtcclxuICBjb25zdCB3aW5kb3dUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3cnKTtcclxuICBjb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxuICBjb25zdCBkZXNrdG9wV2lkdGggPSBkZXNrdG9wLm9mZnNldFdpZHRoO1xyXG4gIGNvbnN0IGRlc2t0b3BIZWlnaHQgPSBkZXNrdG9wLm9mZnNldEhlaWdodDtcclxuICBjb25zdCBoYWxmRGVza3RvcFdpZHRoID0gZGVza3RvcFdpZHRoIC8gMjtcclxuICBjb25zdCBoYWxmRGVza3RvcEhlaWdodCA9IGRlc2t0b3BIZWlnaHQgLyAyO1xyXG5cclxuICBjb25zdCBjb2VmZmljaWVudFdpZHRoID0gKCkgPT4ge1xyXG4gICAgaWYgKGRlc2t0b3BXaWR0aCA8IDUwMCkge1xyXG4gICAgICByZXR1cm4gMC45O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIDAuNTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBjb2VmZmljaWVudEhlaWdodCA9ICgpID0+IHtcclxuICAgIGlmIChkZXNrdG9wV2lkdGggPCA1MDApIHtcclxuICAgICAgcmV0dXJuIDAuNztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiAwLjU7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgd2luZG93V2lkdGggPSBNYXRoLnJvdW5kKHdpbmRvdy5pbm5lcldpZHRoICogY29lZmZpY2llbnRXaWR0aCgpKTtcclxuICBjb25zdCB3aW5kb3dIZWlnaHQgPSBNYXRoLnJvdW5kKHdpbmRvdy5pbm5lckhlaWdodCAqIGNvZWZmaWNpZW50SGVpZ2h0KCkpO1xyXG4gIGNvbnN0IHRleHRJY29uVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbi0tdGV4dCcpO1xyXG4gIGNvbnN0IGxpbmtJY29uVGVtcGxhdGUgPSB0ZW1wbGF0ZS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9faWNvbi0tbGluaycpO1xyXG4gIGNvbnN0IGZvbGRlckljb25UZW1wbGF0ZSA9IHRlbXBsYXRlLnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uLS1mb2xkZXInKTtcclxuICBjb25zdCBmaWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcblxyXG4gIGNvbnN0IHNldEljb24gPSAoaXRlbSkgPT4ge1xyXG4gICAgaWYgKGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS10ZXh0JykpIHtcclxuICAgICAgcmV0dXJuIHRleHRJY29uVGVtcGxhdGU7XHJcbiAgICB9XHJcbiAgICBpZiAoaXRlbS5jbGFzc0xpc3QuY29udGFpbnMoJ2ZpbGUtLWxpbmsnKSkge1xyXG4gICAgICByZXR1cm4gbGlua0ljb25UZW1wbGF0ZTtcclxuICAgIH1cclxuICAgIGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnZmlsZS0tZm9sZGVyJykpIHtcclxuICAgICAgcmV0dXJuIGZvbGRlckljb25UZW1wbGF0ZTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBmaWxlTGlzdC5mb3JFYWNoKChmaWxlKSA9PiB7XHJcbiAgICBjb25zdCB0ZXh0SWNvbiA9IHNldEljb24oZmlsZSkuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgZmlsZUxhYmVsID0gZmlsZS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbGFiZWwnKTtcclxuICAgIGNvbnN0IGZpbGVOYW1lID0gZmlsZS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gICAgZmlsZUxhYmVsLmluc2VydEJlZm9yZSh0ZXh0SWNvbiwgZmlsZU5hbWUpO1xyXG4gIH0pO1xyXG5cclxuICBsZXQgaW5pdGlhbEluZGV4ID0gMDtcclxuICBsZXQgaW5pdGlhbFggPSAwO1xyXG4gIGxldCBpbml0aWFsWSA9IDA7XHJcbiAgbGV0IGxhc3RSZWZlcmVuY2U7XHJcbiAgbGV0IG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgbGV0IGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG4gIGxldCBpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWwgPSAwO1xyXG4gIGxldCBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPSAwO1xyXG4gIGxldCBvZmZzZXRIb3Jpem9udGFsQ291bnRlciA9IDA7XHJcblxyXG4gIGNvbnN0IHNldFN0YXJ0UG9zaXRpb24gPSAoZWxlbSkgPT4ge1xyXG4gICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgZWxlbS5zdHlsZS5sZWZ0ID0gYCR7aGFsZkRlc2t0b3BXaWR0aCArIGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXpvbnRhbH1weGA7XHJcbiAgICBlbGVtLnN0eWxlLnRvcCA9IGAke2hhbGZEZXNrdG9wSGVpZ2h0ICsgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbH1weGA7XHJcbiAgICBlbGVtLnN0eWxlLndpZHRoID0gYCR7d2luZG93V2lkdGh9cHhgO1xyXG4gICAgZWxlbS5zdHlsZS5oZWlnaHQgPSBgJHt3aW5kb3dIZWlnaHR9cHhgO1xyXG4gICAgaWYgKGluaXRpYWxXaW5kb3dDb3VudGVySG9yaXpvbnRhbCArIChkZXNrdG9wV2lkdGggLSB3aW5kb3dXaWR0aCkgLyAyICsgMTAgKyB3aW5kb3dXaWR0aCA+PSBkZXNrdG9wV2lkdGgpIHtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsID0gMDtcclxuICAgICAgb2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJIb3Jpem9udGFsICs9IDg7XHJcbiAgICAgIG9mZnNldEhvcml6b250YWxDb3VudGVyICs9IDE7XHJcbiAgICB9XHJcbiAgICBpZiAoaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArIChkZXNrdG9wSGVpZ2h0IC0gd2luZG93SGVpZ2h0KSAvIDIgKyAzMCArIHdpbmRvd0hlaWdodCA+PSBkZXNrdG9wSGVpZ2h0KSB7XHJcbiAgICAgIGluaXRpYWxXaW5kb3dDb3VudGVyVmVydGljYWwgPSAwO1xyXG4gICAgICBvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPSAwO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCArPSA0MDtcclxuICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyICs9IDE7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25GaWxlT3BlbiA9IChldnQpID0+IHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlJyk7XHJcbiAgICBldnQudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2ZpbGUtLW9wZW5lZCcpO1xyXG4gICAgY29uc3QgZmlsZUxhYmVsID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbGFiZWwnKTtcclxuICAgIGNvbnN0IGZpbGVOYW1lID0gZXZ0LnRhcmdldC5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpO1xyXG4gICAgY29uc3QgZmlsZUljb24gPSBldnQudGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoJy5maWxlX19pY29uJykuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgZmlsZUljb24uY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9faWNvbi0tZGVza3RvcCcpO1xyXG4gICAgY29uc3QgbmV3V2luZG93ID0gd2luZG93VGVtcGxhdGUuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgY29uc3QgbmV3V2luZG93UGF0aCA9IG5ld1dpbmRvdy5xdWVyeVNlbGVjdG9yKCcud2luZG93X19wYXRoJyk7XHJcbiAgICBjb25zdCB3aW5kb3dIZWFkZXIgPSBuZXdXaW5kb3cucXVlcnlTZWxlY3RvcignLndpbmRvd19faGVhZGVyJyk7XHJcbiAgICBjb25zdCB3aW5kb3dEcmFnZ2FibGVBcmVhID0gd2luZG93SGVhZGVyLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdXaW5kb3dQYXRoLnRleHRDb250ZW50ID0gZmlsZU5hbWUudGV4dENvbnRlbnQ7XHJcbiAgICB3aW5kb3dEcmFnZ2FibGVBcmVhLmluc2VydEJlZm9yZShmaWxlSWNvbiwgbmV3V2luZG93UGF0aCk7XHJcbiAgICBkZXNrdG9wLmFwcGVuZENoaWxkKG5ld1dpbmRvdyk7XHJcbiAgICBzZXRTdGFydFBvc2l0aW9uKG5ld1dpbmRvdyk7XHJcbiAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgY29uc3QgY2xvbmVkVGFyZ2V0Q29udGVudCA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2NvbnRlbnQnKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICBuZXdXaW5kb3cuYXBwZW5kQ2hpbGQoY2xvbmVkVGFyZ2V0Q29udGVudCk7XHJcbiAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc3VhbGx5LWhpZGRlbicpO1xyXG4gICAgY2xvbmVkVGFyZ2V0Q29udGVudC5jbGFzc0xpc3QuYWRkKCd3aW5kb3dfX2NvbnRlbnQnKTtcclxuICAgIGNsb25lZFRhcmdldENvbnRlbnQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZV9fY29udGVudCcpO1xyXG4gICAgaWYgKGV2dC50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdmaWxlLS1mb2xkZXInKSkge1xyXG4gICAgICBjbG9uZWRUYXJnZXRDb250ZW50LmNsYXNzTGlzdC5hZGQoJ2dyaWQtLWZvbGRlcicpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHNldEN1cnJlbnRXaW5kb3dBY3RpdmUgPSAoKSA9PiB7XHJcbiAgICAgIGxhc3RSZWZlcmVuY2UgPSByZWZlcmVuY2U7XHJcbiAgICAgIGNvbnN0IG5ld0luZGV4ID0gaW5pdGlhbEluZGV4ICsgMTtcclxuICAgICAgbmV3V2luZG93LnN0eWxlLnpJbmRleCA9IGAke25ld0luZGV4fWA7XHJcbiAgICAgIGluaXRpYWxJbmRleCA9IG5ld0luZGV4O1xyXG4gICAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgICAgZGVza3RvcC5xdWVyeVNlbGVjdG9yQWxsKCcud2luZG93LS1hY3RpdmUnKS5mb3JFYWNoKChhKSA9PiB7XHJcbiAgICAgICAgYS5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWFjdGl2ZScpO1xyXG4gICAgICB9KTtcclxuICAgICAgbmV3V2luZG93LmNsYXNzTGlzdC5hZGQoJ3dpbmRvdy0tYWN0aXZlJyk7XHJcbiAgICAgIGRlc2t0b3AucXVlcnlTZWxlY3RvckFsbCgnLnJlZmVyZW5jZScpLmZvckVhY2goKGIpID0+IHtcclxuICAgICAgICBpZiAoYiA9PT0gbGFzdFJlZmVyZW5jZSkge1xyXG4gICAgICAgICAgYi5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBiLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG5cclxuICAgIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGUpID0+IHtcclxuICAgICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICBjb25zdCBuZXdYID0gIWlzVG91Y2hEZXZpY2UoKSA/IGUuY2xpZW50WCA6IGUudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZS5jbGllbnRZIDogZS50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgICAgY29uc3QgY2FsY1ggPSBpbml0aWFsWCAtIG5ld1g7XHJcbiAgICAgICAgY29uc3QgY2FsY1kgPSBpbml0aWFsWSAtIG5ld1k7XHJcbiAgICAgICAgY29uc3QgbGVmdFBvc2l0aW9uID0gYCR7bmV3V2luZG93Lm9mZnNldExlZnQgLSBjYWxjWH1weGA7XHJcbiAgICAgICAgY29uc3QgdG9wUG9zaXRpb24gPSBgJHtuZXdXaW5kb3cub2Zmc2V0VG9wIC0gY2FsY1l9cHhgO1xyXG4gICAgICAgIG5ld1dpbmRvdy5zdHlsZS5sZWZ0ID0gbGVmdFBvc2l0aW9uO1xyXG4gICAgICAgIG5ld1dpbmRvdy5zdHlsZS50b3AgPSB0b3BQb3NpdGlvbjtcclxuICAgICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgICAgaW5pdGlhbFkgPSBuZXdZO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IG9uTW92ZVRocm90dGxlZCA9IHRocm90dGxlKG9uTW92ZUV2ZW50LCAxMCk7XHJcblxyXG4gICAgY29uc3Qgb25Nb3ZlU3RvcCA9ICgpID0+IHtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0ubW92ZSwgb25Nb3ZlVGhyb3R0bGVkKTtcclxuICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIG9uTW92ZVN0b3ApO1xyXG4gICAgICBtb3ZlRWxlbWVudCA9IGZhbHNlO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbldpbmRvd0RyYWcgPSAoZSkgPT4ge1xyXG4gICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGlmIChlLmNhbmNlbGFibGUpIHtcclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFggOiBlLnRvdWNoZXNbMF0uY2xpZW50WDtcclxuICAgICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBlLmNsaWVudFkgOiBlLnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVUaHJvdHRsZWQpO1xyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLnVwLCBvbk1vdmVTdG9wKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbkNvbGxhcHNlQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgICBpZiAobmV3V2luZG93LmNsYXNzTGlzdC5jb250YWlucygnd2luZG93LS1jb2xsYXBzZWQnKSkge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAocmVmZXJlbmNlID09PSBsYXN0UmVmZXJlbmNlKSB7XHJcbiAgICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1jb2xsYXBzZWQnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvbkV4cGFuZEJ1dHRvbiA9ICgpID0+IHtcclxuICAgICAgc2V0Q3VycmVudFdpbmRvd0FjdGl2ZShyZWZlcmVuY2UsIG5ld1dpbmRvdyk7XHJcbiAgICAgIGlmIChuZXdXaW5kb3cuY2xhc3NMaXN0LmNvbnRhaW5zKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKSkge1xyXG4gICAgICAgIG5ld1dpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWZ1bGxzY3JlZW4nKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBuZXdXaW5kb3cuY2xhc3NMaXN0LmFkZCgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3Qgb25DbG9zZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgICAgZXZ0LnRhcmdldC5jbGFzc0xpc3QuYWRkKCdmaWxlJyk7XHJcbiAgICAgIGV2dC50YXJnZXQuY2xhc3NMaXN0LnJlbW92ZSgnZmlsZS0tb3BlbmVkJyk7XHJcbiAgICAgIHNldEN1cnJlbnRXaW5kb3dBY3RpdmUoKTtcclxuICAgICAgbmV3V2luZG93LnJlbW92ZSgpO1xyXG4gICAgICByZWZlcmVuY2UucmVtb3ZlKCk7XHJcbiAgICAgIGZpbGVMYWJlbC5jbGFzc0xpc3QucmVtb3ZlKCdmaWxlX19sYWJlbC0tYWN0aXZlJyk7XHJcbiAgICAgIGlmIChvZmZzZXRWZXJ0aWNhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgICAgb2Zmc2V0VmVydGljYWxDb3VudGVyIC09IDE7XHJcbiAgICAgICAgaW5pdGlhbFdpbmRvd0NvdW50ZXJWZXJ0aWNhbCAtPSA0MDtcclxuICAgICAgfVxyXG4gICAgICBpZiAob2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgPiAwKSB7XHJcbiAgICAgICAgb2Zmc2V0SG9yaXpvbnRhbENvdW50ZXIgLT0gMTtcclxuICAgICAgICBpbml0aWFsV2luZG93Q291bnRlckhvcml6b250YWwgLT0gMTA7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVmZXJlbmNlSWNvbiA9IGV2dC50YXJnZXQucXVlcnlTZWxlY3RvcignLmZpbGVfX2ljb24nKS5jbG9uZU5vZGUodHJ1ZSk7XHJcbiAgICByZWZlcmVuY2VJY29uLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2ljb24tLWRlc2t0b3AnKTtcclxuICAgIGNvbnN0IHJlZmVyZW5jZVRleHQgPSByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpO1xyXG4gICAgcmVmZXJlbmNlVGV4dC50ZXh0Q29udGVudCA9IGZpbGVOYW1lLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmluc2VydEJlZm9yZShyZWZlcmVuY2VJY29uLCByZWZlcmVuY2VUZXh0KTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIHJlZmVyZW5jZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25Db2xsYXBzZUJ1dHRvbik7XHJcblxyXG4gICAgbmV3V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIChlKSA9PiB7XHJcbiAgICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19kcmFnZ2FibGUtYXJlYScpKSB7XHJcbiAgICAgICAgb25XaW5kb3dEcmFnKGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93JykpIHtcclxuICAgICAgICBzZXRDdXJyZW50V2luZG93QWN0aXZlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIG5ld1dpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKGUpID0+IHtcclxuICAgICAgaWYgKGUudGFyZ2V0LmNsb3Nlc3QoJy53aW5kb3dfX2J1dHRvbi0tY29sbGFwc2UnKSkge1xyXG4gICAgICAgIG9uQ29sbGFwc2VCdXR0b24oKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLndpbmRvd19fYnV0dG9uLS1jbG9zZScpKSB7XHJcbiAgICAgICAgb25DbG9zZUJ1dHRvbigpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCcud2luZG93X19idXR0b24tLWV4cGFuZCcpKSB7XHJcbiAgICAgICAgb25FeHBhbmRCdXR0b24oKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfTtcclxuXHJcbiAgZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgZGVza3RvcEZvb3Rlci5zY3JvbGxMZWZ0ICs9IGV2dC5kZWx0YVk7XHJcbiAgfSk7XHJcblxyXG4gIGRlc2t0b3AuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIChldnQpID0+IHtcclxuICAgIGlmIChldnQudGFyZ2V0LmNsb3Nlc3QoJy5maWxlJykgJiYgIWV2dC50YXJnZXQuY2xvc2VzdCgnLmZpbGUtLWxpbmsnKSkge1xyXG4gICAgICBvbkZpbGVPcGVuKGV2dCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcbmV4cG9ydCB7IGNyZWF0ZURlc2t0b3AgfTtcclxuIl0sImZpbGUiOiJ3aW5kb3cuanMifQ==
