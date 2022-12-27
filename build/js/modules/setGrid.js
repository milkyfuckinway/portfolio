import { throttle } from './throttle.js';

const setGrid = () => {
  const desktopWrapper = document.querySelector('.desktop__wrapper');
  const gridWidth = desktopWrapper.offsetWidth;
  if (gridWidth < 370) {
    const gridElementWidth = `${(gridWidth - 20 - 3 * 5) / 4}px`;
    desktopWrapper.style.gridTemplateColumns = `repeat(4, ${gridElementWidth})`;
    desktopWrapper.style.gridTemplateRows = `repeat(auto-fill, ${gridElementWidth})`;
  }
  if (gridWidth > 371 && gridWidth < 501) {
    const gridElementWidth = `${(gridWidth - 20 - 4 * 5) / 5}px`;
    desktopWrapper.style.gridTemplateColumns = `repeat(5, ${gridElementWidth})`;
    desktopWrapper.style.gridTemplateRows = `repeat(auto-fill, ${gridElementWidth})`;
  }
  if (gridWidth > 501) {
    desktopWrapper.style.gridTemplateColumns = '';
    desktopWrapper.style.gridTemplateRows = '';
  }
};

setGrid();

window.addEventListener('resize', throttle(setGrid, 100));

//# sourceMappingURL=setGrid.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3NldEdyaWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdGhyb3R0bGUgfSBmcm9tICcuL3Rocm90dGxlLmpzJztcclxuXHJcbmNvbnN0IHNldEdyaWQgPSAoKSA9PiB7XHJcbiAgY29uc3QgZGVza3RvcFdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZGVza3RvcF9fd3JhcHBlcicpO1xyXG4gIGNvbnN0IGdyaWRXaWR0aCA9IGRlc2t0b3BXcmFwcGVyLm9mZnNldFdpZHRoO1xyXG4gIGlmIChncmlkV2lkdGggPCAzNzApIHtcclxuICAgIGNvbnN0IGdyaWRFbGVtZW50V2lkdGggPSBgJHsoZ3JpZFdpZHRoIC0gMjAgLSAzICogNSkgLyA0fXB4YDtcclxuICAgIGRlc2t0b3BXcmFwcGVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSBgcmVwZWF0KDQsICR7Z3JpZEVsZW1lbnRXaWR0aH0pYDtcclxuICAgIGRlc2t0b3BXcmFwcGVyLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSBgcmVwZWF0KGF1dG8tZmlsbCwgJHtncmlkRWxlbWVudFdpZHRofSlgO1xyXG4gIH1cclxuICBpZiAoZ3JpZFdpZHRoID4gMzcxICYmIGdyaWRXaWR0aCA8IDUwMSkge1xyXG4gICAgY29uc3QgZ3JpZEVsZW1lbnRXaWR0aCA9IGAkeyhncmlkV2lkdGggLSAyMCAtIDQgKiA1KSAvIDV9cHhgO1xyXG4gICAgZGVza3RvcFdyYXBwZXIuc3R5bGUuZ3JpZFRlbXBsYXRlQ29sdW1ucyA9IGByZXBlYXQoNSwgJHtncmlkRWxlbWVudFdpZHRofSlgO1xyXG4gICAgZGVza3RvcFdyYXBwZXIuc3R5bGUuZ3JpZFRlbXBsYXRlUm93cyA9IGByZXBlYXQoYXV0by1maWxsLCAke2dyaWRFbGVtZW50V2lkdGh9KWA7XHJcbiAgfVxyXG4gIGlmIChncmlkV2lkdGggPiA1MDEpIHtcclxuICAgIGRlc2t0b3BXcmFwcGVyLnN0eWxlLmdyaWRUZW1wbGF0ZUNvbHVtbnMgPSAnJztcclxuICAgIGRlc2t0b3BXcmFwcGVyLnN0eWxlLmdyaWRUZW1wbGF0ZVJvd3MgPSAnJztcclxuICB9XHJcbn07XHJcblxyXG5zZXRHcmlkKCk7XHJcblxyXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhyb3R0bGUoc2V0R3JpZCwgMTAwKSk7XHJcbiJdLCJmaWxlIjoic2V0R3JpZC5qcyJ9
