/* ===== v711: GUÍA DE CAMPO DE LA OT desde la LLAVE de la tarjeta =====
   · La llave de la tarjeta de la OT abre la guía de campo de ESA OT (antes abría la inspección cable a cable).
   · Al abrirla se lanza el cotejo de planos (Gemini, gratis): si ya hay resultado guardado para el mismo texto de la OT y los
     mismos planos se muestra tal cual; si la OT ha cambiado, se recalcula.
   · PRIMERA ACTUACIÓN según planos, arriba de la guía: las alarmas del manual RCS que nombra la OT (por número o por texto)
     con su puente provisional y los croquis dibujados (módulo de seguridad E-A8/E-A9/E-A10, puentes de resistencia de las
     medidas analógicas en E-X62 / E-R10 / E-X65…), igual que «1 · Sacar en servicio ya» del SOS. ===== */
(function(){"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const otAct=()=>{try{return typeof gOT!="undefined"&&gOT&&Array.isArray(inc)?inc.find(x=>x.id==gOT):null}catch(e){return null}};
const alarmasOT=i=>{const out=[];const add=x=>{if(x&&!out.some(y=>y.c==x.c))out.push(x)};
 try{if(i.alCod&&window.RCS_AL)add(RCS_AL.find(z=>z.c==i.alCod))}catch(e){}
 const t=[i.desc,i.def,i.com,i.obs,typeof i.alarmas=="string"?i.alarmas:""].filter(Boolean).join("\n");
 try{if(typeof rcsListaAl=="function")rcsListaAl(t).forEach(add)}catch(e){}
 try{if(typeof rcsDetecta=="function")rcsDetecta(t.replace(/\n/g," · ")).forEach(z=>add(z.x))}catch(e){}
 return out};
let ult="";
function pinta(){if(typeof view=="undefined"||view!="tec")return;const app=document.getElementById("app");if(!app)return;
 const i=otAct();let b=document.getElementById("gpaplan");
 if(!i||i.estado=="cerrada"){if(b)b.remove();return}
 const X=alarmasOT(i);const key=i.id+"|"+X.map(x=>x.c).join(",");
 if(!X.length){if(b)b.remove();return}
 if(!b||b.dataset.k!==key){const S=typeof rcsSacarHTML=="function"?rcsSacarHTML(X):null;if(!S){if(b)b.remove();return}
  if(!b){b=document.createElement("div");b.id="gpaplan";b.className="card gpap"}
  b.dataset.k=key;b.dataset.cro=S.croH?"1":"";
  b.innerHTML=`<div class="gpaph">🚨 PRIMERA ACTUACIÓN · SACAR EN SERVICIO YA <small>según planos · alarma${X.length>1?"s":""} ${E(X.map(x=>x.c).join(" · "))}</small></div>${S.croH}${S.cardH}`}
 /* sitio: tras el cotejo de planos (o la cabecera de la guía), antes de todo lo demás */
 const ref=document.getElementById("gpcot")||[...app.querySelectorAll(".card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
 if(ref){if(ref.nextElementSibling!==b)ref.insertAdjacentElement("afterend",b)}else if(b.parentNode!==app)app.prepend(b);
 /* el croquis por texto de la guía (#gcroq) se pliega cuando hay croquis de planos, para no dar dos puentes distintos */
 const gc=document.getElementById("gcroq");if(gc)gc.style.display=b.dataset.cro?"none":""}
let tm=0;const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);
 new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=0;try{pinta()}catch(e){console.warn("guia-pa",e)}},120)}).observe(a,{childList:true,subtree:true});pinta()};ini();
/* llave de la tarjeta → guía de campo de la OT + cotejo de planos */
window.repOT=function(id){const i=Array.isArray(inc)&&inc.find(x=>x.id==id);if(!i)return;
 try{if(typeof closeSheet=="function")closeSheet()}catch(e){}
 gOT=id;try{if(typeof gSyncOT!="undefined")gSyncOT=id}catch(e){}
 try{gTipo=GUIA.tipos[i.tipo]?i.tipo:"PAS"}catch(e){}
 go("tec");
 let k=0;const sube=()=>{const p=document.getElementById("gpaplan")||document.getElementById("gpcot");if(p){p.scrollIntoView({block:"start",behavior:"smooth"});return}if(++k<25)setTimeout(sube,150)};setTimeout(sube,250);
 /* cotejo de planos: arranca con Gemini si no hay resultado guardado para este texto de la OT */
 let n=0;const cot=()=>{if(typeof pcCompleta=="function"&&document.getElementById("g_doc")){pcCompleta(false).catch(()=>{});return}if(++n<25)setTimeout(cot,200)};setTimeout(cot,400)};
const st=document.createElement("style");st.textContent=`.gpap{border:2px solid #d32f2f!important;padding:10px!important}
.gpaph{font:800 13px/1.35 var(--tkmo,monospace);letter-spacing:.5px;color:#d32f2f;margin-bottom:6px}.gpaph small{display:block;font-weight:700;letter-spacing:0;color:var(--mu,#78909c)}
.gpap .svsac{margin-top:8px}`;document.head.appendChild(st);
})();
