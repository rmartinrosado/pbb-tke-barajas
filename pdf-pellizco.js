/* ===== v280: visor de planos (hoja del PDF o imagen) · ZOOM PELLIZCANDO CON DOS DEDOS =====
 Además de los botones − / +, en el visor (#vw) se amplía o reduce pellizcando: mientras se mueven los dedos la hoja
 se escala al momento y, al soltar, se vuelve a dibujar nítida a ese zoom manteniendo bajo los dedos el mismo punto del plano.
 Con un dedo se sigue desplazando la hoja como antes. Zoom de 0,5× a 6×. El resto de la PWA sigue sin zoom del navegador. ===== */
(function(){
"use strict";
const MIN=.5,MAX=6;
/* los botones + / − también llegan hasta 6× */
try{zoom=function(d){zm=Math.min(MAX,Math.max(MIN,zm+d));if(cur=="pdf")drawPg();else{const im=document.querySelector("#vw img");if(im)im.style.width=zm*100+"%"}}}catch(e){}
let T=null;
const hoja=vw=>vw.querySelector(":scope>canvas")||vw.querySelector(":scope>img");
const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY)||1;
const mid=t=>({x:(t[0].clientX+t[1].clientX)/2,y:(t[0].clientY+t[1].clientY)/2});
document.addEventListener("touchstart",e=>{const vw=e.target.closest&&e.target.closest("#vw");if(!vw||e.touches.length!=2)return;
 const h=hoja(vw);if(!h)return;const r=h.getBoundingClientRect(),m=mid(e.touches);
 T={vw,h,d0:dist(e.touches),z0:zm,s:1,ox:m.x-r.left,oy:m.y-r.top,m};
 h.style.transformOrigin=`${T.ox}px ${T.oy}px`;h.style.willChange="transform";e.preventDefault()},{passive:false,capture:true});
document.addEventListener("touchmove",e=>{if(!T||e.touches.length!=2)return;e.preventDefault();e.stopPropagation();
 T.s=Math.min(MAX/T.z0,Math.max(MIN/T.z0,dist(e.touches)/T.d0));T.m=mid(e.touches);
 T.h.style.transform=`scale(${T.s})`},{passive:false,capture:true});
async function fin(){const t=T;T=null;if(!t)return;const z=Math.min(MAX,Math.max(MIN,t.z0*t.s)),k=z/t.z0;
 if(Math.abs(k-1)<.02){t.h.style.transform="";t.h.style.willChange="";return}
 zm=z;t.h.style.transform="";
 if(cur=="pdf"){try{await drawPg()}catch(e){}}else t.h.style.width=zm*100+"%";
 const h=hoja(t.vw);if(t.h!==h){t.h.style.transform=""}if(h){h.style.transform="";h.style.willChange="";
  /* el punto que estaba bajo los dedos se queda bajo los dedos */
  const r=h.getBoundingClientRect();t.vw.scrollLeft+=r.left+t.ox*k-t.m.x;t.vw.scrollTop+=r.top+t.oy*k-t.m.y}}
document.addEventListener("touchend",e=>{if(T&&e.touches.length<2)fin()},{capture:true});
document.addEventListener("touchcancel",()=>{if(T)fin()},{capture:true});
const st=document.createElement("style");st.textContent="#vw{touch-action:pan-x pan-y}#vw>canvas,#vw>img{transform-origin:0 0}";document.head.appendChild(st);
})();
