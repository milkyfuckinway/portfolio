
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

const fileList = document.querySelectorAll('.file');
const noteFooter = document.querySelector('.note__footer');

fileList.forEach((item) => {
  const buttonCollapse = item.querySelector('.note__collapse');
  const buttonExpand = item.querySelector('.note__expand');
  const buttonClose = item.querySelector('.note__close');
  const noteWindow = item.querySelector('.note__window');
  const noteDraggableArea = item.querySelector('.note__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const referenceTemplate = document.querySelector('.note__reference');
  const cloneReference = referenceTemplate.cloneNode(true);

  const onCollapse = () =>
    noteWindow.classList.contains('note__window--collapsed')
      ? noteWindow.classList.remove('note__window--collapsed')
      : noteWindow.classList.add('note__window--collapsed');

  const onFileOpen = () => {
    noteWindow.classList.remove('note__window--collapsed');
    fileLabel.classList.add('file__label--active');
    noteWindow.style.left = '50%';
    noteWindow.style.top = '50%';
    noteWindow.style.transform = 'translate(-50%, -50%)';
    stopMovement();
    cloneReference.querySelector('.note__refrence-text').textContent =
      item.querySelector('.file__name').textContent;
    cloneReference.addEventListener('click', onCollapse);
    noteFooter.appendChild(cloneReference);
    fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
  };

  fileLabel.addEventListener(events[deviceType].click, onFileOpen);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapse);

  buttonClose.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.add('note__window--collapsed');
    fileLabel.classList.remove('file__label--active');
    cloneReference.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
  });

  buttonExpand.addEventListener(events[deviceType].click, () => {
    noteWindow.classList.remove('note__window--collapsed');
    if (noteWindow.classList.contains('note__window--fullscreen')) {
      noteWindow.classList.remove('note__window--fullscreen');
    } else {
      noteWindow.classList.add('note__window--fullscreen');
    }
  });

  noteWindow.addEventListener(events[deviceType].down, () => {
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  });

  noteDraggableArea.addEventListener(events[deviceType].down, (evt) => {
    if (evt.cancelable) {
      evt.preventDefault();
    }
    const newzIndex = initialzIndex + 2;
    noteWindow.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
    initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
    initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
    document.addEventListener(events[deviceType].move, onMoveEvent);
    document.addEventListener(events[deviceType].up, stopMovement);
    if (!noteWindow.classList.contains('note__window--fullscreen')) {
      moveElement = true;
    }
  });

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
  }

  function onMoveEvent(evt) {
    if (moveElement) {
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      noteWindow.style.left = `${noteWindow.offsetLeft - (initialX - newX)}px`;
      noteWindow.style.top = `${noteWindow.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
    }
  }
});

noteFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  noteFooter.scrollLeft += evt.deltaY;
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmxldCBkZXZpY2VUeXBlID0gJyc7XHJcblxyXG5jb25zdCBpc1RvdWNoRGV2aWNlID0gKCkgPT4ge1xyXG4gIHRyeSB7XHJcbiAgICBkb2N1bWVudC5jcmVhdGVFdmVudCgnVG91Y2hFdmVudCcpO1xyXG4gICAgZGV2aWNlVHlwZSA9ICd0b3VjaCc7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGNhdGNoIChlcnIpIHtcclxuICAgIGRldmljZVR5cGUgPSAnbW91c2UnO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufTtcclxuXHJcbmlzVG91Y2hEZXZpY2UoKTtcclxuXHJcbmNvbnN0IGV2ZW50cyA9IHtcclxuICBtb3VzZToge1xyXG4gICAgZG93bjogJ21vdXNlZG93bicsXHJcbiAgICBtb3ZlOiAnbW91c2Vtb3ZlJyxcclxuICAgIHVwOiAnbW91c2V1cCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG4gIHRvdWNoOiB7XHJcbiAgICBkb3duOiAndG91Y2hzdGFydCcsXHJcbiAgICBtb3ZlOiAndG91Y2htb3ZlJyxcclxuICAgIHVwOiAndG91Y2hlbmQnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxufTtcclxuXHJcbmxldCBpbml0aWFsWCA9IDA7XHJcbmxldCBpbml0aWFsWSA9IDA7XHJcbmxldCBpbml0aWFsekluZGV4ID0gMDtcclxubGV0IG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcblxyXG5jb25zdCBmaWxlTGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5maWxlJyk7XHJcbmNvbnN0IG5vdGVGb290ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZV9fZm9vdGVyJyk7XHJcblxyXG5maWxlTGlzdC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgY29uc3QgYnV0dG9uQ29sbGFwc2UgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19jb2xsYXBzZScpO1xyXG4gIGNvbnN0IGJ1dHRvbkV4cGFuZCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLm5vdGVfX2V4cGFuZCcpO1xyXG4gIGNvbnN0IGJ1dHRvbkNsb3NlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fY2xvc2UnKTtcclxuICBjb25zdCBub3RlV2luZG93ID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcubm90ZV9fd2luZG93Jyk7XHJcbiAgY29uc3Qgbm90ZURyYWdnYWJsZUFyZWEgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5ub3RlX19kcmFnZ2FibGUtYXJlYScpO1xyXG4gIGNvbnN0IGZpbGVMYWJlbCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX2xhYmVsJyk7XHJcbiAgY29uc3QgcmVmZXJlbmNlVGVtcGxhdGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubm90ZV9fcmVmZXJlbmNlJyk7XHJcbiAgY29uc3QgY2xvbmVSZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gIGNvbnN0IG9uQ29sbGFwc2UgPSAoKSA9PlxyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJylcclxuICAgICAgPyBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJylcclxuICAgICAgOiBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcblxyXG4gIGNvbnN0IG9uRmlsZU9wZW4gPSAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBmaWxlTGFiZWwuY2xhc3NMaXN0LmFkZCgnZmlsZV9fbGFiZWwtLWFjdGl2ZScpO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9ICc1MCUnO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKC01MCUsIC01MCUpJztcclxuICAgIHN0b3BNb3ZlbWVudCgpO1xyXG4gICAgY2xvbmVSZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLm5vdGVfX3JlZnJlbmNlLXRleHQnKS50ZXh0Q29udGVudCA9XHJcbiAgICAgIGl0ZW0ucXVlcnlTZWxlY3RvcignLmZpbGVfX25hbWUnKS50ZXh0Q29udGVudDtcclxuICAgIGNsb25lUmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Db2xsYXBzZSk7XHJcbiAgICBub3RlRm9vdGVyLmFwcGVuZENoaWxkKGNsb25lUmVmZXJlbmNlKTtcclxuICAgIGZpbGVMYWJlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgfTtcclxuXHJcbiAgZmlsZUxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuXHJcbiAgYnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2UpO1xyXG5cclxuICBidXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgKCkgPT4ge1xyXG4gICAgbm90ZVdpbmRvdy5jbGFzc0xpc3QuYWRkKCdub3RlX193aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIGNsb25lUmVmZXJlbmNlLnJlbW92ZSgpO1xyXG4gICAgZmlsZUxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuICB9KTtcclxuXHJcbiAgYnV0dG9uRXhwYW5kLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCAoKSA9PiB7XHJcbiAgICBub3RlV2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ25vdGVfX3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICBpZiAobm90ZVdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG5vdGVXaW5kb3cuY2xhc3NMaXN0LnJlbW92ZSgnbm90ZV9fd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBub3RlV2luZG93LmNsYXNzTGlzdC5hZGQoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG5cclxuICBub3RlV2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sICgpID0+IHtcclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAyO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgfSk7XHJcblxyXG4gIG5vdGVEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIChldnQpID0+IHtcclxuICAgIGlmIChldnQuY2FuY2VsYWJsZSkge1xyXG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IG5ld3pJbmRleCA9IGluaXRpYWx6SW5kZXggKyAyO1xyXG4gICAgbm90ZVdpbmRvdy5zdHlsZS56SW5kZXggPSBgJHtuZXd6SW5kZXh9YDtcclxuICAgIGluaXRpYWx6SW5kZXggPSBuZXd6SW5kZXg7XHJcbiAgICBpbml0aWFsWCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICAgIGlmICghbm90ZVdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ25vdGVfX3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgIH1cclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gc3RvcE1vdmVtZW50KCkge1xyXG4gICAgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG9uTW92ZUV2ZW50KGV2dCkge1xyXG4gICAgaWYgKG1vdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IG5ld1ggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBjb25zdCBuZXdZID0gIWlzVG91Y2hEZXZpY2UoKSA/IGV2dC5jbGllbnRZIDogZXZ0LnRvdWNoZXNbMF0uY2xpZW50WTtcclxuICAgICAgbm90ZVdpbmRvdy5zdHlsZS5sZWZ0ID0gYCR7bm90ZVdpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICBub3RlV2luZG93LnN0eWxlLnRvcCA9IGAke25vdGVXaW5kb3cub2Zmc2V0VG9wIC0gKGluaXRpYWxZIC0gbmV3WSl9cHhgO1xyXG4gICAgICBpbml0aWFsWCA9IG5ld1g7XHJcbiAgICAgIGluaXRpYWxZID0gbmV3WTtcclxuICAgIH1cclxuICB9XHJcbn0pO1xyXG5cclxubm90ZUZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBub3RlRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxufSk7XHJcbiJdLCJmaWxlIjoibm90ZS5qcyJ9
