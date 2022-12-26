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
