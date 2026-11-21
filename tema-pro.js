/* v680: tema «consola técnica» en TODAS las pantallas (el de Registrar OT y el Panel de control), solo aspecto:
   · cajas neutras (las que llevan el borde por defecto) → marco degradado naranja · morado · azul, cuadrícula tenue y relieve;
     las cajas con color propio (roja de primera actuación, verde de SAI, amarilla de OT, azul del cotejo…) NO se tocan;
   · campos con esquinas redondeadas y halo naranja al enfocar; botones principales con degradado y brillo; pulsación con hundido.
   No cambia textos, tamaños de letra, alineaciones ni el orden de las cajas. */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)";
const st=document.createElement("style");st.textContent=`
#app .card.tkc{position:relative;border-radius:16px!important;border:1.5px solid transparent!important;
 background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box!important;
 box-shadow:0 10px 32px -16px color-mix(in srgb,${PU} 45%,transparent)!important}
#app .card.tkc::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.05;z-index:0;
 background-image:linear-gradient(var(--tx) 1px,transparent 1px),linear-gradient(90deg,var(--tx) 1px,transparent 1px);background-size:22px 22px;
 -webkit-mask-image:linear-gradient(180deg,#000,transparent 60%);mask-image:linear-gradient(180deg,#000,transparent 60%)}
#app .card.tkc>*{position:relative}
#app select,#app input:not([type=checkbox]):not([type=radio]):not([type=range]):not([type=file]),#app textarea{border-radius:12px!important;transition:border-color .2s,box-shadow .2s}
#app select:focus,#app input:not([type=checkbox]):not([type=radio]):focus,#app textarea:focus{outline:0!important;border-color:${OR}!important;
 box-shadow:0 0 0 4px color-mix(in srgb,${OR} 22%,transparent),0 6px 20px -8px ${OR}!important}
#app button.pri{position:relative;overflow:hidden;border-radius:12px!important;box-shadow:0 10px 24px -12px ${OR},0 0 0 1px #fff3 inset}
#app button.pri:not([style*="background"]){background:linear-gradient(135deg,#ffb020,${OR} 45%,#ff4d2e)!important}
#app button.pri::after{content:"";position:absolute;top:0;bottom:0;width:40%;left:-60%;transform:skewX(-20deg);pointer-events:none;
 background:linear-gradient(90deg,transparent,#fff6,transparent);animation:tkShine 3.6s ease-in-out infinite}
@keyframes tkShine{60%,100%{left:130%}}
#app button.sec{border-radius:12px!important}
#app button:active,#app .card.tkc:active{transition:transform .12s}#app button:active{transform:scale(.97)}
@media (prefers-reduced-motion:reduce){#app button.pri::after{animation:none!important}}`;document.head.appendChild(st);
/* caja neutra = su borde es el color por defecto (--bd) y no lleva borde de color en línea */
let bdRef="";
function ref(){const p=document.createElement("div");p.className="card";p.style.cssText="position:absolute;visibility:hidden;left:-9999px";document.body.appendChild(p);
 const c=getComputedStyle(p);bdRef=c.borderTopColor+"|"+c.borderTopWidth;p.remove()}
function marca(){const app=document.getElementById("app");if(!app)return;if(!bdRef)ref();
 app.querySelectorAll(".card:not(.tkc):not(.tkno)").forEach(c=>{
  if(c.closest("#pfix")||c.closest(".tkc")||c.closest("#gpcot")){c.classList.add("tkno");return}
  const s=getComputedStyle(c);const k=s.borderTopColor+"|"+s.borderTopWidth;const inl=/border/.test(c.getAttribute("style")||"");
  const lat=s.borderLeftColor!==s.borderTopColor||s.borderLeftWidth!==s.borderTopWidth;
  if(k===bdRef&&!inl&&!lat&&!/pucard|gsaic|gcroq|otlle|kpi|btn/.test(c.className))c.classList.add("tkc");else c.classList.add("tkno")})}
let t=0;const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);
 new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{marca()}catch(e){}},80)}).observe(a,{childList:true,subtree:true});marca()};ini();
})();
