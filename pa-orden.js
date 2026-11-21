/* v668: PRIMERA ACTUACIÓN EN CAMPO más clara. A la vista solo lo que sirve para SACAR la pasarela:
   procedimiento validado, puentes provisionales con su croquis, portón y avisos. Se pliega lo repetido o de consulta:
   · el paso «Recuperar la pasarela con maniobra controlada (bypass CP-S33)» cuando ya hay procedimiento validado, junto con
     el rescate arrancando con bypass → un único desplegable «🔑 Bypass CP-S33 · detalle y rescate»;
   · las entradas del PLC para MEDIR (LED en reposo) → «📏 Medidas en el PLC (comprobación)»;
   · en los finales de carrera, la explicación y el «Para recuperarla/liberarla» repetido → «ℹ️ Qué ha pasado y cómo se libera». */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`details.paf{margin:8px 0;border:1.5px dashed color-mix(in srgb,var(--mu,#888) 55%,transparent);border-radius:10px;padding:0 10px}
details.paf>summary{list-style:none;cursor:pointer;padding:9px 0;font-weight:800;font-size:14px;display:flex;gap:8px;align-items:center}
details.paf>summary::-webkit-details-marker{display:none}details.paf>summary::after{content:"▾";margin-left:auto;opacity:.7}details.paf[open]>summary::after{content:"▴"}
details.paf>summary .paft{flex:1;min-width:0;text-align:left;line-height:1.3}details.paf>summary small{display:block;font-weight:600;opacity:.7;font-size:12.5px;margin-top:1px}details.paf[open]{padding-bottom:8px}.pahid{display:none!important}`;document.head.appendChild(st);
const T=el=>(el&&el.textContent||"").replace(/\s+/g," ").trim();
function plegar(nodos,tit,sub,cls){nodos=nodos.filter(Boolean);if(!nodos.length)return null;const d=document.createElement("details");d.className="paf"+(cls?" "+cls:"");
 d.innerHTML=`<summary><span class="paft">${tit}${sub?`<small>${sub}</small>`:""}</span></summary>`;nodos[0].parentNode.insertBefore(d,nodos[0]);nodos.forEach(n=>d.appendChild(n));return d}
function arregla(box){if(!box||box.__paBusy)return;box.__paBusy=1;try{
 const val=[...box.querySelectorAll(":scope>.puit")].find(x=>/Procedimiento de recuperaci/i.test(T(x.querySelector("b"))));
 /* v669: la caja verde del procedimiento validado no se muestra (sus pasos ya están en los puentes, el bypass y el rescate) */
 if(val)val.classList.add("pahid");
 /* v669: un croquis de puente por puente: si el mismo (módulo · bornas) sale dos veces, solo se deja el primero */
 {const vis=new Set();box.querySelectorAll(".ppl").forEach(p=>{const t=T(p.querySelector("svg text")||p.querySelector(".ppt"));if(!t)return;if(vis.has(t))p.classList.add("pahid");else{vis.add(t);p.classList.remove("pahid")}})}
 /* 1 · bypass repetido + rescate con bypass */
 if(!box.querySelector(":scope>details.pabyp")){
  const rep=val?[...box.querySelectorAll(":scope>.puac")].find(x=>/^\d+\.\s*Recuperar la pasarela con maniobra controlada/i.test(T(x))):null;
  const rb=box.querySelector(":scope>details.rbyp");
  /* v669: el rescate con llave (naranja) siempre plegado salvo que lo abra el técnico */
  if(rb){if(!rb.__paL){rb.__paL=1;const sm=rb.querySelector(":scope>summary");if(sm)sm.addEventListener("click",()=>{rb.__paU=1})}if(!rb.__paU&&rb.open)rb.open=false}
  /* el rescate con bypass lo coloca su propio módulo (no se mueve); el paso repetido se pliega justo encima */
  if(rep){plegar([rep],"🔑 Bypass CP-S33 · maniobra controlada","SI FALLA BOMBÍN BYPASS","pabyp");
   /* el «2. Si con el bypass no deja maniobrar…» ya no cuelga de un «1.» visible */
   const sig=[...box.querySelectorAll(":scope>.puac")].find(x=>/^2\.\s*Si con el bypass/i.test(T(x)));if(sig&&sig.firstChild&&sig.firstChild.nodeType==3)sig.firstChild.nodeValue=sig.firstChild.nodeValue.replace(/^\s*2\.\s*/,"➜ ")}}
 /* 2 · medidas (en la caja y dentro de cada final de carrera) */
 const medidas=cont=>{[...cont.querySelectorAll(":scope>.anal")].filter(a=>/\(medida\)/i.test(T(a))&&!a.closest("details.pamed")).forEach(a=>{
   const ns=[a];let n=a.nextElementSibling;while(n&&!n.classList.contains("anal")&&!n.matches("details,.lmg,.gnp,.ppl,.ptn")){if(n.classList.contains("puit"))ns.push(n);else break;n=n.nextElementSibling}
   const c=ns.length-1;a.remove();ns.shift();if(ns.length)plegar(ns,"📏 Medidas en el PLC (comprobación)",`${c} entrada${c==1?"":"s"} · LED en reposo`,"pamed")})};
 medidas(box);box.querySelectorAll(".lmg").forEach(medidas);
 /* 3 · explicación y recuperación repetida en el final de carrera de seguridad */
 box.querySelectorAll(":scope>.lmg").forEach(g=>{if(g.querySelector(":scope>details.painf"))return;
  const des=g.querySelector(":scope>.mu.lmd");const rec=[...g.querySelectorAll(":scope>.puac")].find(x=>/^Para (recuperarla|liberarlo)/i.test(T(x)));
  plegar([des,val?rec:null],"ℹ️ Qué ha pasado y cómo se libera","","painf")});
}finally{box.__paBusy=0}}
/* v670: la caja verde «CT de SAI» justo debajo de «AVERÍA:» en la cabecera de la guía */
function sai(){document.querySelectorAll("#app .gotdesc").forEach(dsc=>{const card=dsc.closest(".card");const g=card&&card.querySelector(":scope .gsai:not(.gsaix)");if(g&&dsc.nextElementSibling!==g)dsc.after(g)})}
/* v671: la caja «Resolución IA» (INSTRUCCIONES) va después de la caja azul de la guía filtrada; si no hay filtro, tras la cabecera de la guía */
function resIA(){const app=document.getElementById("app");if(!app)return;const r=[...app.querySelectorAll(":scope>.card")].find(c=>/^Resolución IA$/.test(T(c.querySelector("h3"))));if(!r)return;
 const ai=document.getElementById("aiguia");const head=[...app.querySelectorAll(":scope>.card")].find(c=>/Guía de campo/.test(T(c.querySelector("h3"))));
 const ref=ai&&ai.parentNode===app?ai:head;if(ref&&ref.nextElementSibling!==r)ref.after(r)}
let tm=0;const pasa=()=>{clearTimeout(tm);tm=setTimeout(()=>{try{sai()}catch(e){}try{resIA()}catch(e){}document.querySelectorAll("#gsegl,.gsegl").forEach(arregla)},120)};
const app=()=>document.getElementById("app");
const ini=()=>{const a=app();if(!a)return setTimeout(ini,300);new MutationObserver(pasa).observe(a,{childList:true,subtree:true});pasa()};ini();
})();
