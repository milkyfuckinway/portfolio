export function throttle(t,e){let l=null;return function(...n){l||(l=setTimeout((()=>{t(...n),clearTimeout(l),l=null}),e))}}