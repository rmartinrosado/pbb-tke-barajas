/* ===== v444: SOS → guía de campo → «Atrás» vuelve al SOS tal cual (12/11/2026) =====
   Al pasar del SOS a la guía de campo (o a otra pantalla) la hoja del SOS se cerraba y la flecha «Atrás» llevaba a Inicio.
   Ahora, al salir del SOS hacia otra pantalla se guarda la hoja entera (posición, avería escrita, alarma, foto leída, resultados
   con lo desplegado y la posición del scroll). La flecha «Atrás» (o volver a Inicio desde esa pantalla con la flecha) la reabre igual.
   Se olvida al cerrar el SOS con la ✕ o al abrir otro SOS nuevo. ===== */
(function(){
"use strict";
let SNAP=null,cerrado=0,yCierre=0;
const esSOS=()=>{const c=document.getElementById("sheetc");return !!(c&&c.querySelector("#sr_ob"))};
const abierta=()=>{const s=document.getElementById("sheet");return !!(s&&s.style.display=="flex")};
function guarda(){const c=document.getElementById("sheetc");if(!c||!esSOS())return;
 const f=document.createDocumentFragment();const y=abierta()?c.scrollTop:yCierre;[...c.childNodes].forEach(n=>f.appendChild(n));
 SNAP={f,y,cls:c.className,origen:typeof view!="undefined"?view:"dash"}}
function repone(){if(!SNAP)return false;const c=document.getElementById("sheetc"),s=document.getElementById("sheet");if(!c||!s)return false;
 const S0=SNAP;SNAP=null;
 /* primero la pantalla de origen (Inicio…), después la hoja del SOS encima */
 try{if(typeof view!="undefined"&&view!=S0.origen&&typeof oG=="function")oG(S0.origen)}catch(e){}
 c.innerHTML="";c.className=S0.cls;c.appendChild(S0.f);const y=S0.y;
 s.style.display="flex";requestAnimationFrame(()=>{c.scrollTop=y});return true}
/* cierre de la hoja del SOS: si justo después se cambia de pantalla, se guarda */
const oC=window.closeSheet;if(typeof oC=="function")window.closeSheet=function(){if(esSOS()&&abierta()){cerrado=Date.now();const c=document.getElementById("sheetc");yCierre=c?c.scrollTop:0}return oC.apply(this,arguments)};
/* cambio de pantalla desde el SOS (con la hoja abierta o recién cerrada para ir a la guía) */
const oG=window.go;if(typeof oG=="function")window.go=function(v){try{
  const desdeSOS=esSOS()&&(abierta()||Date.now()-cerrado<800);
  if(desdeSOS&&typeof view!="undefined"&&v!==view){guarda();const s=document.getElementById("sheet");if(s)s.style.display="none"}
 }catch(e){}return oG.apply(this,arguments)};
/* la ✕ del SOS o un SOS nuevo olvidan lo guardado */
document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#sheetc .soscx"))SNAP=null},true);
const oR=window.sosRap;if(typeof oR=="function")window.sosRap=function(){SNAP=null;return oR.apply(this,arguments)};
/* flecha «Atrás»: si no hay nada encima, vuelve al SOS guardado */
const encima=()=>{for(const el of document.body.children){if(/^(fab|fabm|fabv|fabb|login|lock|splash|navbg|navtab|nvBar|sheet|toast)$/.test(el.id)||/^(SCRIPT|STYLE)$/.test(el.tagName))continue;
  const cs=getComputedStyle(el);if(cs.position!="fixed"||cs.display=="none"||cs.visibility=="hidden"||+cs.opacity==0)continue;
  const r=el.getBoundingClientRect();if(r.width>=innerWidth*.8&&r.height>=innerHeight*.5)return true}return false};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#fabb");if(!b||!SNAP)return;
 const m=document.getElementById("fabm");if(m&&m.classList.contains("on"))return;
 if(abierta()||encima())return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();repone()},true);
window.sosVuelve=repone;
})();
