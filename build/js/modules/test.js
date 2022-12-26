(function createWindows() {
  const block = document.querySelector('#rec415511991');
  const taskbar = document.querySelector('.taskbar');
  const cards = block.querySelectorAll('[data-elem-type="html"]');
  let current = null;
  let zIndex = 50;
  let wrapped = 0;
  const layerCoords = {
    x: 0,
    y: 0,
  };

  const dragEnd = () => (current = null);
  const drag = (e) => {
    if (current) {
      current.style.top = `${e.pageY - block.offsetTop - layerCoords.y}px`;
      current.style.left = `${e.pageX - layerCoords.x}px`;
    }
  };
  const touchDrag = (e) => {
    if (current) {
      e.preventDefault();
      e.stopPropagation();
      drag(e.targetTouches[0]);
    }
  };
  const hideCard = (card) => card.classList.add('hidden-card');
  const showCard = (card) => card.classList.remove('hidden-card');
  const createTask = (card) => {
    hideCard(card);
    wrapped++;

    const task = document.createElement('div');
    task.classList.add('task');
    task.textContent = card.querySelector('.card-head__title').textContent;

    const showThisCard = () => {
      wrapped--;
      showCard(card);
      task.removeEventListener('click', showThisCard);
      task.remove();
      taskbar.style = `--wrapped: ${wrapped}`;
    };

    task.addEventListener('click', showThisCard);

    taskbar.appendChild(task);
    taskbar.style = `--wrapped: ${wrapped}`;
  };

  cards.forEach((card) => {
    const head = card.querySelector('.card-head');
    const collapse = card.querySelector('.card-head__button-collapse');
    // const fullscreen = card.querySelector('.card-head__button-fullscreen');
    const close = card.querySelector('.card-head__button-close');

    const setCurrentCard = (e) => {
      if (e.touches) {
        const { top, left } = e.currentTarget.getBoundingClientRect();
        const [touch] = e.touches;
        layerCoords.x = touch.clientX - left;
        layerCoords.y = touch.clientY - top;
      } else {
        layerCoords.x = e.layerX;
        layerCoords.y = e.layerY;
      }
      current = card;
      card.style.zIndex = ++zIndex;
    };

    collapse.addEventListener('click', () => createTask(card));
    close.addEventListener('click', () => hideCard(card));

    head.addEventListener('mousedown', setCurrentCard);
    head.addEventListener('touchstart', setCurrentCard);
    block.addEventListener('mouseup', dragEnd);
    block.addEventListener('touchend', dragEnd);
  });

  window.addEventListener('mousemove', drag);
  block.addEventListener('touchmove', touchDrag);
})();

//# sourceMappingURL=test.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3Rlc3QuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGNyZWF0ZVdpbmRvd3MoKSB7XHJcbiAgY29uc3QgYmxvY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmVjNDE1NTExOTkxJyk7XHJcbiAgY29uc3QgdGFza2JhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50YXNrYmFyJyk7XHJcbiAgY29uc3QgY2FyZHMgPSBibG9jay5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1lbGVtLXR5cGU9XCJodG1sXCJdJyk7XHJcbiAgbGV0IGN1cnJlbnQgPSBudWxsO1xyXG4gIGxldCB6SW5kZXggPSA1MDtcclxuICBsZXQgd3JhcHBlZCA9IDA7XHJcbiAgY29uc3QgbGF5ZXJDb29yZHMgPSB7XHJcbiAgICB4OiAwLFxyXG4gICAgeTogMCxcclxuICB9O1xyXG5cclxuICBjb25zdCBkcmFnRW5kID0gKCkgPT4gKGN1cnJlbnQgPSBudWxsKTtcclxuICBjb25zdCBkcmFnID0gKGUpID0+IHtcclxuICAgIGlmIChjdXJyZW50KSB7XHJcbiAgICAgIGN1cnJlbnQuc3R5bGUudG9wID0gYCR7ZS5wYWdlWSAtIGJsb2NrLm9mZnNldFRvcCAtIGxheWVyQ29vcmRzLnl9cHhgO1xyXG4gICAgICBjdXJyZW50LnN0eWxlLmxlZnQgPSBgJHtlLnBhZ2VYIC0gbGF5ZXJDb29yZHMueH1weGA7XHJcbiAgICB9XHJcbiAgfTtcclxuICBjb25zdCB0b3VjaERyYWcgPSAoZSkgPT4ge1xyXG4gICAgaWYgKGN1cnJlbnQpIHtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICBkcmFnKGUudGFyZ2V0VG91Y2hlc1swXSk7XHJcbiAgICB9XHJcbiAgfTtcclxuICBjb25zdCBoaWRlQ2FyZCA9IChjYXJkKSA9PiBjYXJkLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbi1jYXJkJyk7XHJcbiAgY29uc3Qgc2hvd0NhcmQgPSAoY2FyZCkgPT4gY2FyZC5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4tY2FyZCcpO1xyXG4gIGNvbnN0IGNyZWF0ZVRhc2sgPSAoY2FyZCkgPT4ge1xyXG4gICAgaGlkZUNhcmQoY2FyZCk7XHJcbiAgICB3cmFwcGVkKys7XHJcblxyXG4gICAgY29uc3QgdGFzayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGFzay5jbGFzc0xpc3QuYWRkKCd0YXNrJyk7XHJcbiAgICB0YXNrLnRleHRDb250ZW50ID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1oZWFkX190aXRsZScpLnRleHRDb250ZW50O1xyXG5cclxuICAgIGNvbnN0IHNob3dUaGlzQ2FyZCA9ICgpID0+IHtcclxuICAgICAgd3JhcHBlZC0tO1xyXG4gICAgICBzaG93Q2FyZChjYXJkKTtcclxuICAgICAgdGFzay5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dUaGlzQ2FyZCk7XHJcbiAgICAgIHRhc2sucmVtb3ZlKCk7XHJcbiAgICAgIHRhc2tiYXIuc3R5bGUgPSBgLS13cmFwcGVkOiAke3dyYXBwZWR9YDtcclxuICAgIH07XHJcblxyXG4gICAgdGFzay5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dUaGlzQ2FyZCk7XHJcblxyXG4gICAgdGFza2Jhci5hcHBlbmRDaGlsZCh0YXNrKTtcclxuICAgIHRhc2tiYXIuc3R5bGUgPSBgLS13cmFwcGVkOiAke3dyYXBwZWR9YDtcclxuICB9O1xyXG5cclxuICBjYXJkcy5mb3JFYWNoKChjYXJkKSA9PiB7XHJcbiAgICBjb25zdCBoZWFkID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1oZWFkJyk7XHJcbiAgICBjb25zdCBjb2xsYXBzZSA9IGNhcmQucXVlcnlTZWxlY3RvcignLmNhcmQtaGVhZF9fYnV0dG9uLWNvbGxhcHNlJyk7XHJcbiAgICAvLyBjb25zdCBmdWxsc2NyZWVuID0gY2FyZC5xdWVyeVNlbGVjdG9yKCcuY2FyZC1oZWFkX19idXR0b24tZnVsbHNjcmVlbicpO1xyXG4gICAgY29uc3QgY2xvc2UgPSBjYXJkLnF1ZXJ5U2VsZWN0b3IoJy5jYXJkLWhlYWRfX2J1dHRvbi1jbG9zZScpO1xyXG5cclxuICAgIGNvbnN0IHNldEN1cnJlbnRDYXJkID0gKGUpID0+IHtcclxuICAgICAgaWYgKGUudG91Y2hlcykge1xyXG4gICAgICAgIGNvbnN0IHsgdG9wLCBsZWZ0IH0gPSBlLmN1cnJlbnRUYXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3QgW3RvdWNoXSA9IGUudG91Y2hlcztcclxuICAgICAgICBsYXllckNvb3Jkcy54ID0gdG91Y2guY2xpZW50WCAtIGxlZnQ7XHJcbiAgICAgICAgbGF5ZXJDb29yZHMueSA9IHRvdWNoLmNsaWVudFkgLSB0b3A7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgbGF5ZXJDb29yZHMueCA9IGUubGF5ZXJYO1xyXG4gICAgICAgIGxheWVyQ29vcmRzLnkgPSBlLmxheWVyWTtcclxuICAgICAgfVxyXG4gICAgICBjdXJyZW50ID0gY2FyZDtcclxuICAgICAgY2FyZC5zdHlsZS56SW5kZXggPSArK3pJbmRleDtcclxuICAgIH07XHJcblxyXG4gICAgY29sbGFwc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiBjcmVhdGVUYXNrKGNhcmQpKTtcclxuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gaGlkZUNhcmQoY2FyZCkpO1xyXG5cclxuICAgIGhlYWQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgc2V0Q3VycmVudENhcmQpO1xyXG4gICAgaGVhZC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0Jywgc2V0Q3VycmVudENhcmQpO1xyXG4gICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGRyYWdFbmQpO1xyXG4gICAgYmxvY2suYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCBkcmFnRW5kKTtcclxuICB9KTtcclxuXHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGRyYWcpO1xyXG4gIGJsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNobW92ZScsIHRvdWNoRHJhZyk7XHJcbn0pKCk7XHJcbiJdLCJmaWxlIjoidGVzdC5qcyJ9
