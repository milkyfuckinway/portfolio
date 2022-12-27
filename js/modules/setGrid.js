const setGrid = () => {
  const desktopWrapper = document.querySelector('.desktop__wrapper');
  const gridWidth = desktopWrapper.offsetWidth;
  if (gridWidth < 370) {
    const gridElementWidth = `${(gridWidth - 20 - 3 * 5) / 4}px`;
    document.documentElement.style.setProperty('--gridbox', `${gridElementWidth}`);
    document.documentElement.style.setProperty('--gridcount', `${4}`);
  }
  if (gridWidth > 371 && gridWidth < 500) {
    const gridElementWidth = `${(gridWidth - 20 - 4 * 5) / 5}px`;
    document.documentElement.style.setProperty('--gridbox', `${gridElementWidth}`);
    document.documentElement.style.setProperty('--gridcount', `${5}`);
  }
};

setGrid();

export { setGrid };

//# sourceMappingURL=setGrid.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3NldEdyaWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3Qgc2V0R3JpZCA9ICgpID0+IHtcclxuICBjb25zdCBkZXNrdG9wV3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kZXNrdG9wX193cmFwcGVyJyk7XHJcbiAgY29uc3QgZ3JpZFdpZHRoID0gZGVza3RvcFdyYXBwZXIub2Zmc2V0V2lkdGg7XHJcbiAgaWYgKGdyaWRXaWR0aCA8IDM3MCkge1xyXG4gICAgY29uc3QgZ3JpZEVsZW1lbnRXaWR0aCA9IGAkeyhncmlkV2lkdGggLSAyMCAtIDMgKiA1KSAvIDR9cHhgO1xyXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWdyaWRib3gnLCBgJHtncmlkRWxlbWVudFdpZHRofWApO1xyXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCctLWdyaWRjb3VudCcsIGAkezR9YCk7XHJcbiAgfVxyXG4gIGlmIChncmlkV2lkdGggPiAzNzEgJiYgZ3JpZFdpZHRoIDwgNTAwKSB7XHJcbiAgICBjb25zdCBncmlkRWxlbWVudFdpZHRoID0gYCR7KGdyaWRXaWR0aCAtIDIwIC0gNCAqIDUpIC8gNX1weGA7XHJcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tZ3JpZGJveCcsIGAke2dyaWRFbGVtZW50V2lkdGh9YCk7XHJcbiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0tZ3JpZGNvdW50JywgYCR7NX1gKTtcclxuICB9XHJcbn07XHJcblxyXG5zZXRHcmlkKCk7XHJcblxyXG5leHBvcnQgeyBzZXRHcmlkIH07XHJcbiJdLCJmaWxlIjoic2V0R3JpZC5qcyJ9
