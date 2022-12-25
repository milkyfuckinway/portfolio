import{throttle}from"./throttle.js";let deviceType="";const isTouchDevice=()=>{try{return document.createEvent("TouchEvent"),deviceType="touch",!0}catch(e){return deviceType="mouse",!1}};isTouchDevice();const events={mouse:{down:"mousedown",move:"mousemove",up:"mouseup",click:"click"},touch:{down:"touchstart",move:"touchmove",up:"touchend",click:"click"}};let initialX=0,initialY=0,initialzIndex=0,moveElement=!1,initialWindowCounterVertical=0,initialWindowCounterHorisontal=0,offsetVerticalCounter=0,offsetHorisontalCounter=0;const template=document.querySelector(".template"),referenceTemplate=template.querySelector(".reference"),windowTemplate=template.querySelector(".window"),desktop=document.querySelector(".desktop"),desktopFooter=desktop.querySelector(".desktop__footer"),desktopWrapper=desktop.querySelector(".desktop__wrapper"),file=document.querySelector(".file");for(let e=0;e<100;e++){const e=file.cloneNode(!0);document.querySelector(".desktop__wrapper").appendChild(e)}let lastFile;const fileList=document.querySelectorAll(".file");fileList.forEach((e=>{console.log("fileList forEach");const t=windowTemplate.cloneNode(!0),o=t.querySelector(".window__draggable-area"),n=t.querySelector(".window__header"),i=t.querySelector(".window__path"),l=t.querySelector(".window__button--collapse"),s=t.querySelector(".window__button--expand"),c=t.querySelector(".window__button--close"),r=e.querySelector(".file__label"),d=referenceTemplate.cloneNode(!0),a=e.querySelector(".file__name"),v=d.querySelector(".reference__text"),f=e.querySelector(".file__icon").cloneNode(!0);d.insertBefore(f,v);const u=e.querySelector(".file__icon").cloneNode(!0);t&&(o.insertBefore(u,i),console.log("windowPath"));const p=()=>{console.log("placeOnTop");const e=initialzIndex+1;t.style.zIndex=`${e}`,initialzIndex=e,lastFile=d;desktop.querySelectorAll(".window__header").forEach((e=>{e.classList.remove("window__header--active")})),n.classList.add("window__header--active")},w=()=>{console.log("setActive");document.querySelectorAll(".reference").forEach((e=>{e.classList.remove("reference--active")})),d.classList.add("reference--active")},m=()=>{console.log("onCollapseButton"),w(),t.classList.contains("window--collapsed")?(t.classList.remove("window--collapsed"),p(),console.log(" containsonCollapseButton")):d!==lastFile?(console.log(" creference !== lastFile"),p()):(t.classList.add("window--collapsed"),console.log("window--collapse"))},y=()=>{console.log("onCloseButton"),t.classList.add("window--collapsed"),r.classList.remove("file__label--active"),console.log("removeWindowListeners"),l.removeEventListener(events[deviceType].click,m),c.removeEventListener(events[deviceType].click,y),s.removeEventListener(events[deviceType].click,L),t.removeEventListener(events[deviceType].down,h),o.removeEventListener(events[deviceType].down,k),d.remove(),t.remove(),r.addEventListener(events[deviceType].click,E),offsetVerticalCounter>0&&(offsetVerticalCounter-=1,initialWindowCounterVertical-=30,console.log("offsetVerticalCounter")),offsetHorisontalCounter>0&&(console.log("offsetHorisontalCounter"),offsetHorisontalCounter-=1,initialWindowCounterHorisontal-=10)},L=()=>{console.log("onExpandButton"),t.classList.remove("window--collapsed"),t.classList.toggle("window--fullscreen")},h=()=>{console.log("onWindowClick"),w(),p()};let _=0;const C=throttle((e=>{if(console.log(_),_+=1,console.log("onMoveEvent"),moveElement){console.log("onMoveEvent moveElement");const o=isTouchDevice()?e.touches[0].clientX:e.clientX,n=isTouchDevice()?e.touches[0].clientY:e.clientY;t.style.left=t.offsetLeft-(initialX-o)+"px",t.style.top=t.offsetTop-(initialY-n)+"px",initialX=o,initialY=n}}),10);function g(){console.log("stopMovement"),moveElement=!1,document.removeEventListener(events[deviceType].move,C),document.removeEventListener(events[deviceType].up,g)}const k=e=>{console.log("onWindowDrag"),e.cancelable&&(console.log("preventDefault"),e.preventDefault()),t.classList.contains("window--fullscreen")||(console.log("contains(window--fullscreen))"),moveElement=!0,initialX=isTouchDevice()?e.touches[0].clientX:e.clientX,initialY=isTouchDevice()?e.touches[0].clientY:e.clientY,document.addEventListener(events[deviceType].move,C),document.addEventListener(events[deviceType].up,g))};function E(){if(console.log("onFileOpen"),e.classList.contains("file--text")||e.classList.contains("file--folder")){const n=e.querySelector(".file__content");n&&(t.appendChild(n),n.classList.remove("visually-hidden"),n.classList.add("window__content"),n.classList.remove("file__content"),e.classList.contains("file--folder")&&n.classList.add("window--folder")),desktop.appendChild(t),t.classList.remove("window--collapsed"),r.classList.add("file__label--active"),t.style.left=`${desktop.offsetWidth/2+initialWindowCounterHorisontal}px`,t.style.top=`${desktop.offsetHeight/2+initialWindowCounterVertical}px`,initialWindowCounterHorisontal+(desktopWrapper.offsetWidth-t.offsetWidth)/2+10+t.offsetWidth>=desktopWrapper.offsetWidth?(initialWindowCounterHorisontal=0,offsetHorisontalCounter=0,console.log(!0,offsetHorisontalCounter)):(initialWindowCounterHorisontal+=10,offsetHorisontalCounter+=1),initialWindowCounterVertical+(desktopWrapper.offsetHeight-t.offsetHeight)/2+30+t.offsetHeight>=desktopWrapper.offsetHeight?(initialWindowCounterVertical=0,offsetVerticalCounter=0,console.log(!0,offsetVerticalCounter)):(initialWindowCounterVertical+=30,offsetVerticalCounter+=1),t.style.transform="translate(-50%, -50%)",i.textContent=`C:/${a.textContent}`,v.textContent=a.textContent,d.addEventListener("click",m),d.classList.add("reference--active"),desktopFooter.appendChild(d),r.removeEventListener(events[deviceType].click,E),g(),w(),p(),t&&(console.log("addWindowListeners"),l.addEventListener(events[deviceType].click,m),c.addEventListener(events[deviceType].click,y),s.addEventListener(events[deviceType].click,L),t.addEventListener(events[deviceType].down,h),o.addEventListener(events[deviceType].down,k))}}r&&(r.addEventListener(events[deviceType].click,E),console.log("fileLabel"))})),desktopFooter.addEventListener("wheel",(e=>{e.preventDefault(),desktopFooter.scrollLeft+=e.deltaY}));