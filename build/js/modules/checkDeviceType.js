let deviceType="";const isTouchDevice=()=>{try{return document.createEvent("TouchEvent"),deviceType="touch",!0}catch(e){return deviceType="mouse",!1}};isTouchDevice();export{deviceType,isTouchDevice};