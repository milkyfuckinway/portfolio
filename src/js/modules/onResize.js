import { throttle } from './throttle.js';
import { setGrid } from './setGrid.js';

window.addEventListener('resize', () => {
  throttle(setGrid(), 1000);
});
