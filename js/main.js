import"./modules/setGrid.js";import"./modules/onResize.js";import{createDesktop}from"./modules/window.js";window.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector(".loading__bar");e.classList.remove("on-load"),e.classList.add("loaded"),setTimeout((()=>{document.querySelector(".loading").remove()}),2e3),createDesktop(),window.addEventListener("load",(()=>{}))}));