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

export { deviceType, isTouchDevice, events };

//# sourceMappingURL=checkDeviceType.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL2NoZWNrRGV2aWNlVHlwZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZGV2aWNlVHlwZSA9ICcnO1xyXG5cclxuY29uc3QgaXNUb3VjaERldmljZSA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RvdWNoRXZlbnQnKTtcclxuICAgIGRldmljZVR5cGUgPSAndG91Y2gnO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBkZXZpY2VUeXBlID0gJ21vdXNlJztcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5jb25zdCBldmVudHMgPSB7XHJcbiAgbW91c2U6IHtcclxuICAgIGRvd246ICdtb3VzZWRvd24nLFxyXG4gICAgbW92ZTogJ21vdXNlbW92ZScsXHJcbiAgICB1cDogJ21vdXNldXAnLFxyXG4gICAgY2xpY2s6ICdjbGljaycsXHJcbiAgfSxcclxuICB0b3VjaDoge1xyXG4gICAgZG93bjogJ3RvdWNoc3RhcnQnLFxyXG4gICAgbW92ZTogJ3RvdWNobW92ZScsXHJcbiAgICB1cDogJ3RvdWNoZW5kJyxcclxuICAgIGNsaWNrOiAnY2xpY2snLFxyXG4gIH0sXHJcbn07XHJcblxyXG5leHBvcnQgeyBkZXZpY2VUeXBlLCBpc1RvdWNoRGV2aWNlLCBldmVudHMgfTtcclxuIl0sImZpbGUiOiJjaGVja0RldmljZVR5cGUuanMifQ==
