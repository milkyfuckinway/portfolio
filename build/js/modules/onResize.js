import { throttle } from './throttle.js';
import { setGrid } from './setGrid.js';

window.addEventListener('resize', () => {
  throttle(setGrid(), 1000);
});

//# sourceMappingURL=onResize.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL29uUmVzaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRocm90dGxlIH0gZnJvbSAnLi90aHJvdHRsZS5qcyc7XHJcbmltcG9ydCB7IHNldEdyaWQgfSBmcm9tICcuL3NldEdyaWQuanMnO1xyXG5cclxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICB0aHJvdHRsZShzZXRHcmlkKCksIDEwMDApO1xyXG59KTtcclxuIl0sImZpbGUiOiJvblJlc2l6ZS5qcyJ9
