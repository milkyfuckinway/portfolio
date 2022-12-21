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

for(let i = 0; i < 1000; i++) {
  const fileClone = file.cloneNode(true);
  document.querySelector('.desktop__wrapper').appendChild(fileClone);
}

const fileList = document.querySelectorAll('.file');
fileList.forEach((item) => {
  const window = item.querySelector('.window');
  const buttonCollapse = item.querySelector('.window__button--collapse');
  const buttonExpand = item.querySelector('.window__button--expand');
  const buttonClose = item.querySelector('.window__button--close');
  const noteDraggableArea = item.querySelector('.window__draggable-area');
  const fileLabel = item.querySelector('.file__label');
  const reference = referenceTemplate.cloneNode(true);

  const setActive = () => {
    const referenceList = document.querySelectorAll('.reference');
    referenceList.forEach((refernce) => {
      refernce.classList.remove('reference--active');
    });
    reference.classList.add('reference--active');
    const newzIndex = initialzIndex + 1;
    window.style.zIndex = `${newzIndex}`;
    initialzIndex = newzIndex;
  };

  const onCollapse = () =>{
    window.classList.toggle('window--collapsed');
    console.log('onCollapse');
    setActive();
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
    reference.addEventListener('click', onCollapse);
    reference.classList.add('reference--active');
    desktopFooter.appendChild(reference);
    fileLabel.removeEventListener(events[deviceType].click, onFileOpen);
    console.log('onFileOpen');
    setActive();
  };

  const onCloseButton = () => {
    window.classList.add('window--collapsed');
    fileLabel.classList.remove('file__label--active');
    reference.remove();
    fileLabel.addEventListener(events[deviceType].click, onFileOpen);
    console.log('onCloseButton');
  };

  const onExpandButton = () => {
    window.classList.remove('window--collapsed');
    window.classList.toggle('window--fullscreen');
    console.log('onExpandButton');
  };

  const onWindowClick = () => {
    setActive();
    console.log('onWindowClick');
  };

  const onMoveEvent = (evt) => {
    console.log('onMoveEvent');
    if (moveElement) {
      const newX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      const newY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      window.style.left = `${window.offsetLeft - (initialX - newX)}px`;
      window.style.top = `${window.offsetTop - (initialY - newY)}px`;
      initialX = newX;
      initialY = newY;
      console.log('onMoveEvent = true');
    }
  };

  const onWindowDrag = (evt) => {
    console.log('onWindowDrag');
    if (evt.cancelable) {
      evt.preventDefault();
    }
    if (!window.classList.contains('window--fullscreen')) {
      moveElement = true;
      initialX = !isTouchDevice() ? evt.clientX : evt.touches[0].clientX;
      initialY = !isTouchDevice() ? evt.clientY : evt.touches[0].clientY;
      document.addEventListener(events[deviceType].move, onMoveEvent);
      document.addEventListener(events[deviceType].up, stopMovement);
      console.log('onWindowDrag = true');
    }
  };

  fileLabel.addEventListener(events[deviceType].click, onFileOpen);

  buttonCollapse.addEventListener(events[deviceType].click, onCollapse);

  buttonClose.addEventListener(events[deviceType].click, onCloseButton);

  buttonExpand.addEventListener(events[deviceType].click, onExpandButton);

  window.addEventListener(events[deviceType].down, onWindowClick);

  noteDraggableArea.addEventListener(events[deviceType].down, onWindowDrag);

  function stopMovement() {
    moveElement = false;
    document.removeEventListener(events[deviceType].move, onMoveEvent);
    document.removeEventListener(events[deviceType].up, stopMovement);
    console.log('stopMovement');
  }
});

desktopFooter.addEventListener('wheel', (evt) => {
  evt.preventDefault();
  desktopFooter.scrollLeft += evt.deltaY;
  console.log('wheel');
});

//# sourceMappingURL=note.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL25vdGUuanMiXSwic291cmNlc0NvbnRlbnQiOlsibGV0IGRldmljZVR5cGUgPSAnJztcclxuXHJcbmNvbnN0IGlzVG91Y2hEZXZpY2UgPSAoKSA9PiB7XHJcbiAgdHJ5IHtcclxuICAgIGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdUb3VjaEV2ZW50Jyk7XHJcbiAgICBkZXZpY2VUeXBlID0gJ3RvdWNoJztcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgZGV2aWNlVHlwZSA9ICdtb3VzZSc7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG59O1xyXG5cclxuaXNUb3VjaERldmljZSgpO1xyXG5cclxuY29uc3QgZXZlbnRzID0ge1xyXG4gIG1vdXNlOiB7XHJcbiAgICBkb3duOiAnbW91c2Vkb3duJyxcclxuICAgIG1vdmU6ICdtb3VzZW1vdmUnLFxyXG4gICAgdXA6ICdtb3VzZXVwJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbiAgdG91Y2g6IHtcclxuICAgIGRvd246ICd0b3VjaHN0YXJ0JyxcclxuICAgIG1vdmU6ICd0b3VjaG1vdmUnLFxyXG4gICAgdXA6ICd0b3VjaGVuZCcsXHJcbiAgICBjbGljazogJ2NsaWNrJyxcclxuICB9LFxyXG59O1xyXG5cclxubGV0IGluaXRpYWxYID0gMDtcclxubGV0IGluaXRpYWxZID0gMDtcclxubGV0IGluaXRpYWx6SW5kZXggPSAwO1xyXG5sZXQgbW92ZUVsZW1lbnQgPSBmYWxzZTtcclxuXHJcbmNvbnN0IGZpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZmlsZScpO1xyXG5jb25zdCBkZXNrdG9wRm9vdGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmRlc2t0b3BfX2Zvb3RlcicpO1xyXG5jb25zdCByZWZlcmVuY2VUZW1wbGF0ZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWZlcmVuY2UnKTtcclxuXHJcbmZvcihsZXQgaSA9IDA7IGkgPCAxMDAwOyBpKyspIHtcclxuICBjb25zdCBmaWxlQ2xvbmUgPSBmaWxlLmNsb25lTm9kZSh0cnVlKTtcclxuICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fd3JhcHBlcicpLmFwcGVuZENoaWxkKGZpbGVDbG9uZSk7XHJcbn1cclxuXHJcbmNvbnN0IGZpbGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZpbGUnKTtcclxuZmlsZUxpc3QuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gIGNvbnN0IHdpbmRvdyA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLndpbmRvdycpO1xyXG4gIGNvbnN0IGJ1dHRvbkNvbGxhcHNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNvbGxhcHNlJyk7XHJcbiAgY29uc3QgYnV0dG9uRXhwYW5kID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWV4cGFuZCcpO1xyXG4gIGNvbnN0IGJ1dHRvbkNsb3NlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcud2luZG93X19idXR0b24tLWNsb3NlJyk7XHJcbiAgY29uc3Qgbm90ZURyYWdnYWJsZUFyZWEgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy53aW5kb3dfX2RyYWdnYWJsZS1hcmVhJyk7XHJcbiAgY29uc3QgZmlsZUxhYmVsID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbGFiZWwnKTtcclxuICBjb25zdCByZWZlcmVuY2UgPSByZWZlcmVuY2VUZW1wbGF0ZS5jbG9uZU5vZGUodHJ1ZSk7XHJcblxyXG4gIGNvbnN0IHNldEFjdGl2ZSA9ICgpID0+IHtcclxuICAgIGNvbnN0IHJlZmVyZW5jZUxpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcucmVmZXJlbmNlJyk7XHJcbiAgICByZWZlcmVuY2VMaXN0LmZvckVhY2goKHJlZmVybmNlKSA9PiB7XHJcbiAgICAgIHJlZmVybmNlLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZmVyZW5jZS0tYWN0aXZlJyk7XHJcbiAgICB9KTtcclxuICAgIHJlZmVyZW5jZS5jbGFzc0xpc3QuYWRkKCdyZWZlcmVuY2UtLWFjdGl2ZScpO1xyXG4gICAgY29uc3QgbmV3ekluZGV4ID0gaW5pdGlhbHpJbmRleCArIDE7XHJcbiAgICB3aW5kb3cuc3R5bGUuekluZGV4ID0gYCR7bmV3ekluZGV4fWA7XHJcbiAgICBpbml0aWFsekluZGV4ID0gbmV3ekluZGV4O1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uQ29sbGFwc2UgPSAoKSA9PntcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QudG9nZ2xlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgY29uc29sZS5sb2coJ29uQ29sbGFwc2UnKTtcclxuICAgIHNldEFjdGl2ZSgpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRmlsZU9wZW4gPSAoKSA9PiB7XHJcbiAgICBzdG9wTW92ZW1lbnQoKTtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QucmVtb3ZlKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5hZGQoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIHdpbmRvdy5zdHlsZS5sZWZ0ID0gJzUwJSc7XHJcbiAgICB3aW5kb3cuc3R5bGUudG9wID0gJzUwJSc7XHJcbiAgICB3aW5kb3cuc3R5bGUudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtNTAlLCAtNTAlKSc7XHJcbiAgICByZWZlcmVuY2UucXVlcnlTZWxlY3RvcignLnJlZmVyZW5jZV9fdGV4dCcpLnRleHRDb250ZW50ID1cclxuICAgICAgaXRlbS5xdWVyeVNlbGVjdG9yKCcuZmlsZV9fbmFtZScpLnRleHRDb250ZW50O1xyXG4gICAgcmVmZXJlbmNlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Db2xsYXBzZSk7XHJcbiAgICByZWZlcmVuY2UuY2xhc3NMaXN0LmFkZCgncmVmZXJlbmNlLS1hY3RpdmUnKTtcclxuICAgIGRlc2t0b3BGb290ZXIuYXBwZW5kQ2hpbGQocmVmZXJlbmNlKTtcclxuICAgIGZpbGVMYWJlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICBjb25zb2xlLmxvZygnb25GaWxlT3BlbicpO1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgfTtcclxuXHJcbiAgY29uc3Qgb25DbG9zZUJ1dHRvbiA9ICgpID0+IHtcclxuICAgIHdpbmRvdy5jbGFzc0xpc3QuYWRkKCd3aW5kb3ctLWNvbGxhcHNlZCcpO1xyXG4gICAgZmlsZUxhYmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2ZpbGVfX2xhYmVsLS1hY3RpdmUnKTtcclxuICAgIHJlZmVyZW5jZS5yZW1vdmUoKTtcclxuICAgIGZpbGVMYWJlbC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25GaWxlT3Blbik7XHJcbiAgICBjb25zb2xlLmxvZygnb25DbG9zZUJ1dHRvbicpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uRXhwYW5kQnV0dG9uID0gKCkgPT4ge1xyXG4gICAgd2luZG93LmNsYXNzTGlzdC5yZW1vdmUoJ3dpbmRvdy0tY29sbGFwc2VkJyk7XHJcbiAgICB3aW5kb3cuY2xhc3NMaXN0LnRvZ2dsZSgnd2luZG93LS1mdWxsc2NyZWVuJyk7XHJcbiAgICBjb25zb2xlLmxvZygnb25FeHBhbmRCdXR0b24nKTtcclxuICB9O1xyXG5cclxuICBjb25zdCBvbldpbmRvd0NsaWNrID0gKCkgPT4ge1xyXG4gICAgc2V0QWN0aXZlKCk7XHJcbiAgICBjb25zb2xlLmxvZygnb25XaW5kb3dDbGljaycpO1xyXG4gIH07XHJcblxyXG4gIGNvbnN0IG9uTW92ZUV2ZW50ID0gKGV2dCkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coJ29uTW92ZUV2ZW50Jyk7XHJcbiAgICBpZiAobW92ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgbmV3WCA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WCA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFg7XHJcbiAgICAgIGNvbnN0IG5ld1kgPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFkgOiBldnQudG91Y2hlc1swXS5jbGllbnRZO1xyXG4gICAgICB3aW5kb3cuc3R5bGUubGVmdCA9IGAke3dpbmRvdy5vZmZzZXRMZWZ0IC0gKGluaXRpYWxYIC0gbmV3WCl9cHhgO1xyXG4gICAgICB3aW5kb3cuc3R5bGUudG9wID0gYCR7d2luZG93Lm9mZnNldFRvcCAtIChpbml0aWFsWSAtIG5ld1kpfXB4YDtcclxuICAgICAgaW5pdGlhbFggPSBuZXdYO1xyXG4gICAgICBpbml0aWFsWSA9IG5ld1k7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdvbk1vdmVFdmVudCA9IHRydWUnKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBjb25zdCBvbldpbmRvd0RyYWcgPSAoZXZ0KSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZygnb25XaW5kb3dEcmFnJyk7XHJcbiAgICBpZiAoZXZ0LmNhbmNlbGFibGUpIHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXdpbmRvdy5jbGFzc0xpc3QuY29udGFpbnMoJ3dpbmRvdy0tZnVsbHNjcmVlbicpKSB7XHJcbiAgICAgIG1vdmVFbGVtZW50ID0gdHJ1ZTtcclxuICAgICAgaW5pdGlhbFggPSAhaXNUb3VjaERldmljZSgpID8gZXZ0LmNsaWVudFggOiBldnQudG91Y2hlc1swXS5jbGllbnRYO1xyXG4gICAgICBpbml0aWFsWSA9ICFpc1RvdWNoRGV2aWNlKCkgPyBldnQuY2xpZW50WSA6IGV2dC50b3VjaGVzWzBdLmNsaWVudFk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLm1vdmUsIG9uTW92ZUV2ZW50KTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0udXAsIHN0b3BNb3ZlbWVudCk7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdvbldpbmRvd0RyYWcgPSB0cnVlJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgZmlsZUxhYmVsLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmNsaWNrLCBvbkZpbGVPcGVuKTtcclxuXHJcbiAgYnV0dG9uQ29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uY2xpY2ssIG9uQ29sbGFwc2UpO1xyXG5cclxuICBidXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25DbG9zZUJ1dHRvbik7XHJcblxyXG4gIGJ1dHRvbkV4cGFuZC5hZGRFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5jbGljaywgb25FeHBhbmRCdXR0b24pO1xyXG5cclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudHNbZGV2aWNlVHlwZV0uZG93biwgb25XaW5kb3dDbGljayk7XHJcblxyXG4gIG5vdGVEcmFnZ2FibGVBcmVhLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnRzW2RldmljZVR5cGVdLmRvd24sIG9uV2luZG93RHJhZyk7XHJcblxyXG4gIGZ1bmN0aW9uIHN0b3BNb3ZlbWVudCgpIHtcclxuICAgIG1vdmVFbGVtZW50ID0gZmFsc2U7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS5tb3ZlLCBvbk1vdmVFdmVudCk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50c1tkZXZpY2VUeXBlXS51cCwgc3RvcE1vdmVtZW50KTtcclxuICAgIGNvbnNvbGUubG9nKCdzdG9wTW92ZW1lbnQnKTtcclxuICB9XHJcbn0pO1xyXG5cclxuZGVza3RvcEZvb3Rlci5hZGRFdmVudExpc3RlbmVyKCd3aGVlbCcsIChldnQpID0+IHtcclxuICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICBkZXNrdG9wRm9vdGVyLnNjcm9sbExlZnQgKz0gZXZ0LmRlbHRhWTtcclxuICBjb25zb2xlLmxvZygnd2hlZWwnKTtcclxufSk7XHJcbiJdLCJmaWxlIjoibm90ZS5qcyJ9
