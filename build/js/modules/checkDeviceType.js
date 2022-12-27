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

export { deviceType, isTouchDevice };

//# sourceMappingURL=checkDeviceType.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL2NoZWNrRGV2aWNlVHlwZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJsZXQgZGV2aWNlVHlwZSA9ICcnO1xyXG5cclxuY29uc3QgaXNUb3VjaERldmljZSA9ICgpID0+IHtcclxuICB0cnkge1xyXG4gICAgZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ1RvdWNoRXZlbnQnKTtcclxuICAgIGRldmljZVR5cGUgPSAndG91Y2gnO1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBkZXZpY2VUeXBlID0gJ21vdXNlJztcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn07XHJcblxyXG5pc1RvdWNoRGV2aWNlKCk7XHJcblxyXG5leHBvcnQgeyBkZXZpY2VUeXBlLCBpc1RvdWNoRGV2aWNlIH07XHJcbiJdLCJmaWxlIjoiY2hlY2tEZXZpY2VUeXBlLmpzIn0=
