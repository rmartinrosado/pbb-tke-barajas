/* ===== v545: VISOR DE FOTOS A PANTALLA COMPLETA con zoom de dos dedos y desplazamiento (16/11/2026) =====
   · compVer(src, lista?, i?) → pantalla completa: pellizco con dos dedos (1× a 8×) en el punto donde pellizcas,
     un dedo desplaza la foto ampliada, doble toque amplía 2,5× / vuelve a 1×, ✕ para cerrar.
     Con lista de varias fotos: flechas ‹ › y deslizar con un dedo sin ampliar para pasar de foto.
   · fotoOrden: permutar fotos ARRASTRÁNDOLAS. Grupo = contenedor con data-fg="nombre"; cada foto = elemento con data-fi="i".
     Mantener pulsada la foto (≈0,3 s) y arrastrarla sobre otra → se intercambian. Un toque corto → abre el visor.
     window.FOTO_ORDEN[nombre] = {mueve(i,j), toca(i)} ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
#vzCapa{position:fixed;inset:0;z-index:100003;background:#000;touch-action:none;overflow:hidden;user-select:none;-webkit-user-select:none}
#vzCapa img{position:absolute;left:50%;top:50%;max-width:100%;max-height:100%;transform-origin:50% 50%;will-change:transform;pointer-events:none;-webkit-user-drag:none}
#vzCapa .vzx{position:absolute;top:max(12px,env(safe-area-inset-top));right:12px;width:48px;height:48px;border-radius:50%;border:2px solid #fff;background:rgba(0,0,0,.55);color:#fff;font:800 24px/1 system-ui,sans-serif;z-index:3}
#vzCapa .vzf{position:absolute;top:50%;width:44px;height:64px;margin-top:-32px;border:0;border-radius:10px;background:rgba(0,0,0,.45);color:#fff;font:700 30px/1 system-ui,sans-serif;z-index:3}
#vzCapa .vzf.a{left:6px}#vzCapa .vzf.b{right:6px}
#vzCapa .vzk{position:absolute;left:12px;bottom:calc(14px + env(safe-area-inset-bottom,0px));padding:4px 10px;border-radius:12px;background:rgba(0,0,0,.6);color:#fff;font:700 13px/1.4 system-ui,sans-serif;z-index:3;pointer-events:none}
.foFant{position:fixed;z-index:100004;pointer-events:none;opacity:.85;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.45);transform:translate(-50%,-50%) scale(1.06);background:#fff;object-fit:contain}
[data-fg] [data-fi] img{-webkit-touch-callout:none;-webkit-user-select:none;user-select:none}
[data-fi].foLev{outline:3px solid #ff7a00;outline-offset:1px;opacity:.55}
[data-fi].foDst{outline:3px dashed #0b6e99;outline-offset:2px}`;
document.head.appendChild(st);

window.compVer=function(src,lista,ix){
 const L=Array.isArray(lista)&&lista.length?lista.slice():[src];let i=Math.max(0,typeof ix=="number"?ix:L.indexOf(src));if(i<0)i=0;
 let o=document.getElementById("vzCapa");if(o)o.remove();o=document.createElement("div");o.id="vzCapa";
 o.innerHTML=`<img alt=""><button type="button" class="vzx" aria-label="Cerrar">✕</button>${L.length>1?'<button type="button" class="vzf a" aria-label="Anterior">‹</button><button type="button" class="vzf b" aria-label="Siguiente">›</button>':""}<span class="vzk"></span>`;
 ["click","dblclick","touchend","touchstart","pointerdown"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));
 document.body.appendChild(o);const im=o.querySelector("img"),k=o.querySelector(".vzk");
 let s=1,tx=0,ty=0;const P=new Map();let g=null,t0=0,mov=false;
 const caja=()=>{const W=o.clientWidth,H=o.clientHeight,nw=im.naturalWidth||W,nh=im.naturalHeight||H,f=Math.min(W/nw,H/nh,1e9);return{W,H,dw:nw*f,dh:nh*f}};
 const pon=()=>{const c=caja();const mx=Math.max(0,(c.dw*s-c.W)/2),my=Math.max(0,(c.dh*s-c.H)/2);tx=Math.max(-mx,Math.min(mx,tx));ty=Math.max(-my,Math.min(my,ty));
  im.style.width=c.dw+"px";im.style.height=c.dh+"px";im.style.maxWidth="none";im.style.maxHeight="none";
  im.style.transform=`translate(-50%,-50%) translate(${tx}px,${ty}px) scale(${s})`;k.textContent=(L.length>1?(i+1)+"/"+L.length+" · ":"")+(s>1.02?s.toFixed(1).replace(".",",")+"×":"Pellizca para ampliar")};
 const ve=n=>{i=(n+L.length)%L.length;s=1;tx=ty=0;im.onload=pon;im.src=L[i];pon()};
 const est=()=>{const v=[...P.values()];g=v.length>=2?{d:Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y)||1,cx:(v[0].x+v[1].x)/2,cy:(v[0].y+v[1].y)/2,s,tx,ty}:v.length==1?{x:v[0].x,y:v[0].y,tx,ty,s}:null};
 o.addEventListener("pointerdown",e=>{if(e.target.closest("button"))return;e.preventDefault();try{o.setPointerCapture(e.pointerId)}catch(_){}P.set(e.pointerId,{x:e.clientX,y:e.clientY});if(P.size==1)mov=false;est()});
 o.addEventListener("pointermove",e=>{if(!P.has(e.pointerId)||!g)return;e.preventDefault();P.set(e.pointerId,{x:e.clientX,y:e.clientY});const v=[...P.values()];
  if(v.length>=2){mov=true;const d=Math.hypot(v[0].x-v[1].x,v[0].y-v[1].y),ns=Math.max(1,Math.min(8,g.s*d/g.d)),r=o.getBoundingClientRect();
   const ox=g.cx-r.left-r.width/2,oy=g.cy-r.top-r.height/2,cx=(v[0].x+v[1].x)/2,cy=(v[0].y+v[1].y)/2;
   tx=ox-(ox-g.tx)*ns/g.s+(cx-g.cx);ty=oy-(oy-g.ty)*ns/g.s+(cy-g.cy);s=ns;pon()}
  else{const dx=v[0].x-g.x,dy=v[0].y-g.y;if(Math.abs(dx)+Math.abs(dy)>8)mov=true;if(s>1.02){tx=g.tx+dx;ty=g.ty+dy;pon()}}});
 const fin=e=>{if(!P.has(e.pointerId))return;const p=P.get(e.pointerId);P.delete(e.pointerId);
  if(P.size==0&&g&&g.x!=null&&s<=1.02&&L.length>1){const dx=p.x-g.x;if(Math.abs(dx)>60){ve(i+(dx<0?1:-1));g=null;return}}
  if(P.size==0&&!mov){const t=Date.now();if(t-t0<320){const r=o.getBoundingClientRect();if(s>1.02){s=1;tx=ty=0}else{s=2.5;tx=-(p.x-r.left-r.width/2)*1.5;ty=-(p.y-r.top-r.height/2)*1.5}pon();t0=0}else t0=t}
  est()};
 o.addEventListener("pointerup",fin);o.addEventListener("pointercancel",fin);
 o.addEventListener("wheel",e=>{e.preventDefault();s=Math.max(1,Math.min(8,s*(e.deltaY<0?1.15:1/1.15)));pon()},{passive:false});
 o.querySelector(".vzx").onclick=e=>{e.stopPropagation();o.remove()};
 const a=o.querySelector(".vzf.a"),b=o.querySelector(".vzf.b");if(a)a.onclick=()=>ve(i-1);if(b)b.onclick=()=>ve(i+1);
 window.addEventListener("resize",()=>{if(o.isConnected)pon()});ve(i)};

/* ---------- permutar fotos arrastrándolas ---------- */
window.FOTO_ORDEN=window.FOTO_ORDEN||{};
let D=null;
const item=el=>el&&el.closest&&el.closest("[data-fg] [data-fi]");
const grupo=it=>it&&it.closest("[data-fg]");
const enPunto=(x,y)=>{const e=document.elementFromPoint(x,y);const it=item(e);return it&&D&&grupo(it)===D.g?it:null};
function empieza(it,x,y){const g=grupo(it);if(!g)return;D={it,g,fg:g.dataset.fg,i:+it.dataset.fi,x,y,arm:false,mov:false,dst:null,tm:null,ft:null}}
function arma(){if(!D||D.arm)return;D.arm=true;D.it.classList.add("foLev");try{navigator.vibrate&&navigator.vibrate(15)}catch(e){}
 const im=D.it.querySelector("img");if(im){const f=document.createElement("img");f.src=im.src;f.className="foFant";const r=im.getBoundingClientRect();f.style.width=r.width+"px";f.style.height=r.height+"px";f.style.left=D.x+"px";f.style.top=D.y+"px";document.body.appendChild(f);D.ft=f}}
function mueve(x,y){if(!D)return;if(Math.abs(x-D.x)+Math.abs(y-D.y)>8)D.mov=true;if(!D.arm)return;if(D.ft){D.ft.style.left=x+"px";D.ft.style.top=y+"px"}
 const t=enPunto(x,y);if(D.dst&&D.dst!==t)D.dst.classList.remove("foDst");D.dst=t&&t!==D.it?t:null;if(D.dst)D.dst.classList.add("foDst")}
function acaba(cancel){if(!D)return;const d=D;D=null;clearTimeout(d.tm);d.it.classList.remove("foLev");if(d.dst)d.dst.classList.remove("foDst");if(d.ft)d.ft.remove();
 const H=window.FOTO_ORDEN[d.fg]||{};if(cancel)return;
 if(d.arm&&d.dst){const j=+d.dst.dataset.fi;if(j!==d.i&&H.mueve)H.mueve(d.i,j)}
 else if(!d.arm&&!d.mov&&H.toca)H.toca(d.i)}
const enImg=e=>e.target&&e.target.tagName=="IMG"&&item(e.target);
document.addEventListener("touchstart",e=>{const it=enImg(e);if(!it||e.touches.length>1){if(D)acaba(true);return}if(D)acaba(true);const t=e.touches[0];empieza(it,t.clientX,t.clientY);D.tm=setTimeout(arma,300)},{passive:true,capture:true});
document.addEventListener("touchmove",e=>{if(!D)return;const t=e.touches[0];if(!D.arm){if(Math.abs(t.clientX-D.x)+Math.abs(t.clientY-D.y)>8){clearTimeout(D.tm);D.mov=true}return}
 e.preventDefault();mueve(t.clientX,t.clientY)},{passive:false,capture:true});
document.addEventListener("touchend",e=>{if(!D)return;if(D.arm||(!D.mov))e.preventDefault();acaba(false)},{passive:false,capture:true});
document.addEventListener("touchcancel",()=>acaba(true),true);
/* ratón (ordenador): arrastrar directamente */
document.addEventListener("mousedown",e=>{const it=enImg(e);if(!it)return;e.preventDefault();empieza(it,e.clientX,e.clientY)});
document.addEventListener("mousemove",e=>{if(!D)return;if(!D.arm&&Math.abs(e.clientX-D.x)+Math.abs(e.clientY-D.y)>6)arma();mueve(e.clientX,e.clientY)});
document.addEventListener("mouseup",()=>{if(D)acaba(false)},true);
/* v548: la capa de Editar ficha corta el «touchend» (stopPropagation) y la foto fantasma se quedaba pegada al salir.
   Ahora todo va en fase de captura y, por seguridad, nunca queda una foto fantasma sin arrastre en curso. */
const limpia=()=>{if(D)acaba(true);document.querySelectorAll(".foFant").forEach(x=>x.remove());document.querySelectorAll(".foLev,.foDst").forEach(x=>x.classList.remove("foLev","foDst"))};
document.addEventListener("visibilitychange",limpia);window.addEventListener("pagehide",limpia);window.addEventListener("blur",limpia);
document.addEventListener("pointerup",()=>{setTimeout(()=>{if(!D)document.querySelectorAll(".foFant").forEach(x=>x.remove())},60)},true);
setInterval(()=>{if(!D&&document.querySelector(".foFant"))limpia()},1500);
window.fotoOrdenLimpia=limpia;
})();
