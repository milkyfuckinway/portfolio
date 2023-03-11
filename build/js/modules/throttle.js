export function throttle(callee, timeout) {
  let timer = null;
  return function perform(...args) {
    if (timer) {
      return;
    }
    timer = setTimeout(() => {
      callee(...args);
      clearTimeout(timer);
      timer = null;
    }, timeout);
  };
}

//# sourceMappingURL=throttle.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzL3Rocm90dGxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZShjYWxsZWUsIHRpbWVvdXQpIHtcclxuICBsZXQgdGltZXIgPSBudWxsO1xyXG4gIHJldHVybiBmdW5jdGlvbiBwZXJmb3JtKC4uLmFyZ3MpIHtcclxuICAgIGlmICh0aW1lcikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICBjYWxsZWUoLi4uYXJncyk7XHJcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XHJcbiAgICAgIHRpbWVyID0gbnVsbDtcclxuICAgIH0sIHRpbWVvdXQpO1xyXG4gIH07XHJcbn1cclxuIl0sImZpbGUiOiJ0aHJvdHRsZS5qcyJ9
