import { throttle } from './throttle.js';
import { setGrid } from './setGrid.js';
import { setSize } from './positionFunctions.js';

window.addEventListener('resize', () => {
  throttle(setGrid(), 1000);
  throttle(setSize(), 1000);
});
