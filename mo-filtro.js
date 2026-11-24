/* ===== v416: fluidez del táctil =====
 La PWA tiene unas 45 «vigías» (MutationObserver) que revisan la pantalla cuando cambia algo. Las animaciones de la guía
 (almena, brazo autonivelador…) cambian sus textos y dibujos 60 veces por segundo y despertaban a TODAS en cada fotograma:
 el teléfono pasaba el tiempo recorriendo la pantalla y el desplazamiento con el dedo iba a tirones.
 Aquí se filtran, para todas las vigías, los cambios que ocurren DENTRO de un dibujo (svg) o de una animación (.gsim),
 salvo que la vigía esté puesta sobre el propio dibujo. No cambia nada de lo que se ve. */
(function(){
"use strict";
const MO=window.MutationObserver;if(!MO||MO.__flt)return;
const ANIM="svg,.gsim";
const dentro=n=>{const e=n&&(n.nodeType==1?n:n.parentNode);return !!(e&&e.closest&&e.closest(ANIM))};
/* ===== v883: táctil y búsquedas más ágiles =====
 Ya hay ~40 vigías sobre TODA la página. Cada cambio (una letra en la búsqueda, un botón) las despertaba a todas, y lo que
 retocaba una volvía a despertar a las demás en cadena, muchas veces seguidas, con el dedo esperando. Ahora las vigías de
 página entera se agrupan: se ejecutan UNA vez por fotograma, justo antes de pintar (requestAnimationFrame), y la cadena
 de retoques se resuelve dentro de ese mismo fotograma (máx. 6 vueltas). Lo que se ve no cambia ni parpadea. */
const rAF0=window.requestAnimationFrame?window.requestAnimationFrame.bind(window):(f=>setTimeout(f,16));
const PEND=new Set();let prog=false;
function corre(o,r){if(!r||!r.length)return;window.__moD=(window.__moD||0)+1;try{o.__cb.call(o,r,o)}catch(e){console.warn(e)}finally{window.__moD--}}
let enF=false,vueltas=0;
function pide(){if(prog)return;prog=true;
 /* dentro del fotograma que se está preparando (retoques que llegan por microtarea): se resuelven antes de pintar */
 if(enF&&vueltas<12){vueltas++;queueMicrotask(vacia)}else rAF0(()=>{enF=true;vueltas=0;setTimeout(()=>{enF=false},0);vacia()})}
function vacia(){prog=false;for(let v=0;v<6&&PEND.size;v++){const L=[...PEND];PEND.clear();
  L.forEach(o=>{const r=o.__q.concat(o.__in?o.__o.takeRecords():o.__o.takeRecords().filter(m=>!dentro(m.target)));o.__q=[];corre(o,r)});
  /* lo que han cambiado estas vigías: se recoge ya, sin esperar a otro fotograma */
  TODAS.forEach(o=>{if(!o.__vivo)return;const r=o.__o.takeRecords();const f=o.__in?r:r.filter(m=>!dentro(m.target));if(f.length){o.__q=o.__q.concat(f);PEND.add(o)}})}
 if(PEND.size)pide()}
const TODAS=new Set();
function F(cb){const self=this;this.__in=false;this.__cb=cb;this.__q=[];this.__ancho=false;this.__vivo=false;
 this.__o=new MO(function(recs){const r=self.__in?recs:recs.filter(m=>!dentro(m.target));if(!r.length)return;
  if(self.__ancho){self.__q=self.__q.concat(r);PEND.add(self);pide();return}
  corre(self,r)})}
F.prototype.observe=function(t,o){if(dentro(t))this.__in=true;
 if(o&&o.subtree&&(t===document||t===document.documentElement||t===document.body)){this.__ancho=true;this.__vivo=true;TODAS.add(this)}
 return this.__o.observe(t,o)};
F.prototype.disconnect=function(){this.__q=[];PEND.delete(this);this.__vivo=false;TODAS.delete(this);return this.__o.disconnect()};
F.prototype.takeRecords=function(){const r=this.__o.takeRecords();const q=this.__q;this.__q=[];PEND.delete(this);return q.concat(this.__in?r:r.filter(m=>!dentro(m.target)))};
F.__flt=1;window.MutationObserver=F;
/* ===== v688: sin parpadeos =====
 Muchas vigías esperaban 60–400 ms (setTimeout) antes de retocar la pantalla: el navegador pintaba primero la versión sin
 retocar y luego la buena → parpadeos y cajas que saltan al tocar cualquier cosa. Ahora, los temporizadores cortos que se
 programan DENTRO de una vigía se ejecutan antes del siguiente pintado (microtarea). Protección: si una misma vigía se
 dispara más de 25 veces en el mismo fotograma, ese fotograma vuelve al temporizador normal (evita bucles). */
const sT=window.setTimeout,cT=window.clearTimeout;let seq=1e9,rst=false;const FK=new Map();let CN=new Map();
const rAF=window.requestAnimationFrame?window.requestAnimationFrame.bind(window):(f=>sT(f,16));
window.setTimeout=function(fn,ms){if(window.__moD>0&&typeof fn=="function"&&(+ms||0)<=400){const k=String(fn).slice(0,160);const c=(CN.get(k)||0)+1;
  if(c<=3){CN.set(k,c);if(!rst){rst=true;rAF(()=>{CN=new Map();rst=false})}
   const id=++seq;FK.set(id,1);const args=[].slice.call(arguments,2);queueMicrotask(()=>{if(!FK.has(id))return;FK.delete(id);try{fn.apply(window,args)}catch(e){console.warn(e)}});return id}}
 return sT.apply(window,arguments)};
window.clearTimeout=function(id){if(FK.has(id)){FK.delete(id);return}return cT.apply(window,arguments)};
})();
