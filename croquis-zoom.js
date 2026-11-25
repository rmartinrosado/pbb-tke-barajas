/* ===== v907: ZOOM CON DOS DEDOS dentro de los croquis de puente (svg.pzk) =====
   · Pellizco con dos dedos: amplía / reduce el DIBUJO dentro de su caja (cambia el viewBox; la caja no crece ni se mueve la página).
   · Con el dibujo ampliado, un dedo lo desplaza; sin ampliar, un dedo hace scroll normal de la pantalla.
   · Doble toque: vuelve al dibujo completo.
   · El toque simple sigue ampliando / reduciendo la caja (croquis-mitad.js); tras un pellizco o arrastre ese toque se ignora. ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
svg.pzk{touch-action:pan-y}
svg.pzk.pzkz{touch-action:none;outline:2px solid #ffcc00;outline-offset:-2px}`;
document.head.appendChild(st);
const vbDe=s=>{const v=(s.getAttribute("viewBox")||"").split(/[\s,]+/).map(Number);return v.length==4&&v.every(isFinite)?v:null};
const vb0=s=>{if(!s._vb0)s._vb0=vbDe(s);return s._vb0};
const pon=(s,v)=>{const o=vb0(s);let [x,y,w,h]=v;
 w=Math.min(o[2],Math.max(o[2]/8,w));h=w*o[3]/o[2];
 x=Math.min(o[0]+o[2]-w,Math.max(o[0],x));y=Math.min(o[1]+o[3]-h,Math.max(o[1],y));
 s.setAttribute("viewBox",`${x} ${y} ${w} ${h}`);s.classList.toggle("pzkz",w<o[2]-.5)};
const reset=s=>{const o=vb0(s);if(o){s.setAttribute("viewBox",o.join(" "));s.classList.remove("pzkz")}};
const dist=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
const mid=(a,b)=>({x:(a.clientX+b.clientX)/2,y:(a.clientY+b.clientY)/2});
/* punto de pantalla → coordenadas del dibujo con un viewBox dado */
const aSvg=(s,v,p)=>{const r=s.getBoundingClientRect();return{x:v[0]+(p.x-r.left)/r.width*v[2],y:v[1]+(p.y-r.top)/r.height*v[3]}};
let G=null,ultTap=0;
document.addEventListener("touchstart",e=>{const s=e.target.closest&&e.target.closest("svg.pzk");if(!s||!vb0(s))return;
 const v=vbDe(s);
 if(e.touches.length==2){e.preventDefault();const m=mid(e.touches[0],e.touches[1]);G={s,t:"p",v,d:dist(e.touches[0],e.touches[1]),P:aSvg(s,v,m),mov:0}}
 else if(e.touches.length==1&&s.classList.contains("pzkz")){e.preventDefault();const t=e.touches[0];G={s,t:"m",v,x:t.clientX,y:t.clientY,mov:0}}
 else G=null},{passive:false,capture:true});
document.addEventListener("touchmove",e=>{if(!G)return;const s=G.s,r=s.getBoundingClientRect();
 if(G.t=="p"&&e.touches.length==2){e.preventDefault();const d=dist(e.touches[0],e.touches[1]);if(!d)return;
  const w=G.v[2]*G.d/d,h=w*G.v[3]/G.v[2],m=mid(e.touches[0],e.touches[1]);
  /* el punto que estaba bajo los dedos sigue bajo los dedos */
  pon(s,[G.P.x-(m.x-r.left)/r.width*w,G.P.y-(m.y-r.top)/r.height*h,w,h]);G.mov=1}
 else if(G.t=="m"&&e.touches.length==1){e.preventDefault();const t=e.touches[0],dx=(t.clientX-G.x)/r.width*G.v[2],dy=(t.clientY-G.y)/r.height*G.v[3];
  if(Math.abs(t.clientX-G.x)+Math.abs(t.clientY-G.y)>4)G.mov=1;pon(s,[G.v[0]-dx,G.v[1]-dy,G.v[2],G.v[3]])}},{passive:false,capture:true});
document.addEventListener("touchend",e=>{const s=e.target.closest&&e.target.closest("svg.pzk");
 if(G&&G.mov){G.s._noClick=Date.now()}
 /* doble toque sobre un dibujo ampliado: vuelve a verlo entero */
 if(s&&!e.touches.length&&!(G&&G.mov)&&s.classList.contains("pzkz")){const n=Date.now();if(n-ultTap<320){reset(s);s._noClick=n;ultTap=0}else ultTap=n}
 if(!e.touches.length)G=null},{capture:true});
/* iOS: que el pellizco sobre el croquis no amplíe toda la página */
["gesturestart","gesturechange"].forEach(t=>document.addEventListener(t,e=>{if(e.target.closest&&e.target.closest("svg.pzk"))e.preventDefault()},{passive:false,capture:true}));
/* el toque que termina un pellizco/arrastre no debe ampliar/reducir la caja (window captura antes que document) */
window.addEventListener("click",e=>{const s=e.target.closest&&e.target.closest("svg.pzk");if(s&&s._noClick&&Date.now()-s._noClick<450){e.stopImmediatePropagation();e.preventDefault()}},true);
/* con el dibujo ampliado, el toque simple tampoco cambia el tamaño de la caja (se usa para mover) */
window.addEventListener("click",e=>{const s=e.target.closest&&e.target.closest("svg.pzk.pzkz");if(s){e.stopImmediatePropagation();e.preventDefault()}},true);
window.croquisZoomReset=reset;
})();
