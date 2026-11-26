/* ===== v964: GUÍA DE CAMPO DE LA OT por NIVELES (26/11/2026) =====
   Tras la cabecera de la guía (y la Seguridad, que se queda la primera):
   · NIVEL 1 · Actuación más eficaz
   · NIVEL 2 · Análisis de la OT
   · NIVEL 3 · Inspección cable a cable
   y después el resto (cotejo entre planos, casos de la guía, comprobaciones…), PLEGADO al entrar en la OT. Lo que el técnico
   abra a mano sigue abierto mientras está en esa OT. ===== */
(function(){"use strict";
const $=s=>document.querySelector(s);
const cabG=()=>[...document.querySelectorAll("#app .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
const pon=(ref,el)=>{if(ref&&el&&ref!==el&&ref.nextElementSibling!==el){ref.insertAdjacentElement("afterend",el);return true}return false};
const plegados=new Set();let ocupado=false;
function etiqueta(el,n,sel){if(!el)return;const s=el.querySelector(sel);if(!s)return;
 if(s.dataset.niv==n&&s.querySelector(":scope>.gniv"))return;s.dataset.niv=n;s.querySelectorAll(":scope>.gniv").forEach(x=>x.remove());
 const b=document.createElement("span");b.className="gniv";b.textContent="NIVEL "+n;s.prepend(b)}
function ordena(){if(ocupado||typeof view=="undefined"||view!="tec")return;const cab=cabG();if(!cab)return;ocupado=true;
 try{const ef=$("#app details.gd.gef"),an=$("#anag"),ic=$("#ginsc"),pc=$("#gpcot");
  const seg=$('#app details.gd[data-k="SEG"]'),red=$("#gsegl")||$("#gpte");
  let ult=(red&&red.isConnected?red:null)||(seg&&seg.isConnected?seg:null)||cab;
  [ef,an,ic,pc].forEach(x=>{if(x&&x.isConnected){pon(ult,x);ult=x}});
  etiqueta(ef,1,":scope>summary");etiqueta(an,2,"details.anap>summary");etiqueta(ic,3,":scope>summary");
  /* el resto, plegado al entrar en la OT (una vez por OT y apartado) */
  const ot=typeof gOT!="undefined"?gOT:"";if(!ot)return;
  const resto=[pc,...document.querySelectorAll("#app details.gd[data-k]")].filter(d=>d&&d!==ef&&d.dataset.k!=="SEG");
  resto.forEach(d=>{const k=ot+"|"+(d.id||d.dataset.k||"");if(plegados.has(k))return;plegados.add(k);
   if(d.open){d.open=false;try{if(d.dataset.k&&typeof gAbierto!="undefined")gAbierto.delete(d.dataset.k)}catch(_){}}})}
 catch(e){console.warn("guia-niveles",e)}finally{ocupado=false}}
let t=0;const pide=()=>{clearTimeout(t);t=setTimeout(ordena,60)};
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{ordena()}catch(e){}return r};try{window.vTec=vTec}catch(_){}}
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(pide).observe(a,{childList:true})};ini();
setInterval(()=>{if(typeof view!="undefined"&&view=="tec")ordena()},1500);
/* al salir de la guía y volver a entrar en la OT, el resto vuelve a salir plegado */
if(typeof go=="function"){const og=go;go=function(v){if(v!=="tec")plegados.clear();return og.apply(this,arguments)};try{window.go=go}catch(_){}}
const st=document.createElement("style");st.textContent=`.gniv{display:inline-block;margin:0 6px 4px 0;padding:2px 8px;border-radius:999px;background:#1e88e5;color:#fff;font:800 11px/1.4 var(--tkmo,ui-monospace,monospace);letter-spacing:.8px;vertical-align:middle}`;document.head.appendChild(st);
})();
