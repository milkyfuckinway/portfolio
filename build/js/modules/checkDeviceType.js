let deviceType="";const isTouchDevice=()=>{try{return document.createEvent("TouchEvent"),deviceType="touch",!0}catch(e){return deviceType="mouse",!1}};isTouchDevice();const events={mouse:{down:"mousedown",move:"mousemove",up:"mouseup",click:"click"},touch:{down:"touchstart",move:"touchmove",up:"touchend",click:"click"}};export{deviceType,isTouchDevice,events};