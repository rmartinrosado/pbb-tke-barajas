/* ===== v489: zoom con dos dedos DENTRO de la caja de la foto del PLC (Cotejar PLC) =====
   · Pellizco con dos dedos: amplía / reduce (1× a 6×) en el punto donde pellizcas, sin salir de la caja.
   · Con la foto ampliada, un dedo la desplaza; sin ampliar, un dedo hace scroll de la página como siempre.
   · Doble toque: amplía a 2,5× donde tocas / vuelve a 1×.
   · Un toque sin ampliar abre la foto a pantalla completa como antes. ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`.gfzw{position:relative;overflow:hidden;border-radius:8px;touch-action:pan-y;line-height:0}
.gfzw.zoom{touch-action:none}.gfzw>img{transform-origin:0 0;will-change:transform;display:block;width:100%}
.gfzw .gfzk{position:absolute;left:8px;bottom:8px;z-index:3;padding:3px 8px;border-radius:10px;background:rgba(0,0,0,.6);color:#fff;font:700 12px/1.4 system-ui,sans-serif;pointer-events:none;display:none}
.gfzw.zoom .gfzk{display:block}`;document.head.appendChild(st);
function monta(img){if(img.dataset.fz)return;img.dataset.fz=1;
 const w=document.createElement("div");w.className="gfzw";img.before(w);w.appendChild(img);
 const kb=document.createElement("div");kb.className="gfzk";w.appendChild(kb);
 const cl=img.getAttribute("onclick");img.removeAttribute("onclick");
 let k=1,x=0,y=0,P=null,ult=0,movido=false;
 const lim=()=>{const W=w.clientWidth,H=w.clientHeight;x=Math.min(0,Math.max(W-W*k,x));y=Math.min(0,Math.max(H-H*k,y))};
 const ap=()=>{lim();img.style.transform=k>1.001?`translate(${x}px,${y}px) scale(${k})`:"";w.classList.toggle("zoom",k>1.001);kb.textContent=k.toFixed(1).replace(".",",")+"×"};
 const pt=(t)=>{const r=w.getBoundingClientRect();return {x:t.clientX-r.left,y:t.clientY-r.top}};
 const zoomEn=(nk,cx,cy)=>{nk=Math.max(1,Math.min(6,nk));x=cx-(cx-x)*nk/k;y=cy-(cy-y)*nk/k;k=nk;if(k<=1.001){k=1;x=0;y=0}ap()};
 w.addEventListener("touchstart",e=>{movido=false;
  if(e.touches.length==2){e.preventDefault();const a=pt(e.touches[0]),b=pt(e.touches[1]);P={d:Math.hypot(a.x-b.x,a.y-b.y),k,x,y,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2}}
  else if(e.touches.length==1&&k>1){const a=pt(e.touches[0]);P={pan:1,sx:a.x,sy:a.y,x,y}}},{passive:false});
 w.addEventListener("touchmove",e=>{if(!P)return;
  if(e.touches.length==2&&P.d){e.preventDefault();movido=true;const a=pt(e.touches[0]),b=pt(e.touches[1]);const d=Math.hypot(a.x-b.x,a.y-b.y),cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
   let nk=Math.max(1,Math.min(6,P.k*d/P.d));x=cx-(P.cx-P.x)*nk/P.k;y=cy-(P.cy-P.y)*nk/P.k;k=nk;if(k<=1.001){k=1;x=0;y=0}ap()}
  else if(e.touches.length==1&&P.pan&&k>1){e.preventDefault();const a=pt(e.touches[0]);if(Math.hypot(a.x-P.sx,a.y-P.sy)>6)movido=true;x=P.x+(a.x-P.sx);y=P.y+(a.y-P.sy);ap()}},{passive:false});
 w.addEventListener("touchend",e=>{if(e.touches.length==0){P=null;
   const t=e.changedTouches[0];if(!movido&&t){const n=Date.now();if(n-ult<300){e.preventDefault();ult=0;const a=pt(t);if(k>1)zoomEn(1,0,0);else zoomEn(2.5,a.x,a.y);w.__dbl=n}else ult=n}}
  else if(e.touches.length==1&&k>1){const a=pt(e.touches[0]);P={pan:1,sx:a.x,sy:a.y,x,y}}},{passive:false});
 /* toque simple sin ampliar → pantalla completa (como antes); se espera por si es doble toque */
 img.addEventListener("click",()=>{if(k>1||movido)return;setTimeout(()=>{if(k>1||Date.now()-(w.__dbl||0)<500||(ult&&Date.now()-ult<300))return;if(cl&&typeof gZoom=="function")gZoom(img.src)},320)});
 /* rueda / trackpad (pruebas en ordenador) */
 w.addEventListener("wheel",e=>{if(!e.ctrlKey&&k<=1)return;e.preventDefault();const a=pt(e);zoomEn(k*(e.deltaY<0?1.15:1/1.15),a.x,a.y)},{passive:false});
 ap()}
const busca=()=>document.querySelectorAll(".gfix img:not([data-fz])").forEach(monta);
let tm=null;new MutationObserver(()=>{if(!tm)tm=setTimeout(()=>{tm=null;busca()},120)}).observe(document.documentElement,{childList:true,subtree:true});busca();
})();
