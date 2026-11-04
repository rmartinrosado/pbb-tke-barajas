/* v318: pasos de medida en la inspección cable a cable (Módulos PLC, polímetro de la OT, HZ) como en el Check.
 Cada punto de la ruta muestra, en pasos numerados de una línea:
   1. escala del polímetro (V⎓, V~ u Ω) · 2. dónde va la punta roja · 3. dónde va la punta negra (0 V de la zona del punto)
   4. qué debe marcar · 5. aviso de pulsos de test (seguridades) · 6. qué significa si no da el valor (texto de la ruta).
 Sustituye a la línea «Esperado: …» de cada paso. */
(function(){
"use strict";
const e_=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const Z0={E:"+E-X68:2 (0 V, hilo 205)",P:"+P-X92:2 (0 V, hilo 205)",C:"+C-X51:2 (0 V, hilo 205)",IT:"+IT-X51:2 (0 V, hilo 205)",ET:"+ET-X51:2 (0 V, hilo 205)",
 CO:"+IT-X51:2 (0 V, hilo 205)",H:"+H-X51:30 (0 V, hilo 205)",T:"+H-X51:30 (0 V, hilo 205)",R:"+IT-X50:2 (0 V, hilo 205)",CBTH:"+E-X61:21 (0 V PBB, hilo 205)",SS:"+E-X68:2 (0 V, hilo 205)",MT:"+E-X68:2 (0 V, hilo 205)"};
const Z24={E:"+E-X68:1 (+24 V, hilo 189)",P:"+P-X92:1 (+24 V, hilo 332)",C:"+C-X51:1 (+24 V, hilo 189)",IT:"+IT-X51:1 (+24 V, hilo 189)",ET:"+ET-X51:1 (+24 V, hilo 189)",
 CO:"+CO3-X51:1 (+24 V, hilo 189)",H:"+H-X51:1 (+24 V, hilo 189)",T:"+H-X51:1 (+24 V, hilo 189)",R:"+IT-X50:1 (+24 V, hilo 613)",CBTH:"+E-X61:10 (+24 V, hilo 189)",SS:"+E-X68:1 (+24 V, hilo 189)",MT:"+E-X68:1 (+24 V, hilo 189)"};
function zona(q,mod){let z=(q.u&&q.u[0])||"";if((!z||z==="F")&&typeof gUbiZ=="function"){try{z=gUbiZ(q)[0]}catch(e){}}
 if(!Z0[z])z=String(mod||(typeof gIMod!="undefined"?gIMod:"")||"").charAt(0)==="P"?"P":"E";return z}
function punto(q){const n=q.nodo||String(q.p||"").split(" · ")[0];return n.replace(/\s*—\s*salida del sensor\/elemento$/,"")}
window.insMidePasos=function(q,mod){const e=String(q.e||""),B="<b>"+e_(punto(q))+"</b>",z=zona(q,mod),s=[];
 if(/Ω|continuidad|ohm/i.test(e)){
  s.push("Corta la tensión del circuito.","Polímetro en <b>Ω o continuidad</b>.","Puntas: "+e_(q.p||"").replace(/↔/g,"<b>↔</b>")+".","Debe marcar <b>"+e_(e)+"</b>.")}
 else if(/V~|Vac|VAC|400 ?V|230 ?V/.test(e)){
  s.push("Polímetro en <b>V~</b>.","Roja en "+B+".","Negra en la otra fase o el neutro indicado en el plano.","Debe marcar <b>"+e_(e)+"</b>.")}
 else if(/^0 ?V(?! en reposo)/.test(e)){
  s.push("Polímetro en <b>V⎓</b>. Se comprueba el retorno de 0 V.","Roja en <b>"+e_(Z24[z])+"</b>.","Negra en "+B+".","Debe marcar <b>≈ 24 V⎓</b> (con la carga o la orden activa).","Si marca 0 V: el retorno está cortado entre este punto y el 0 V.")}
 else{
  s.push("Polímetro en <b>V⎓</b>.","Roja en "+B+".","Negra en <b>"+e_(Z0[z])+"</b>.");
  if(/en reposo/.test(e))s.push("Debe marcar <b>"+e_(e.replace(/\s*y LED coherente/,""))+"</b>.","Comprueba que el LED del módulo cambia a la vez.");
  else s.push("Debe marcar <b>"+e_(e)+"</b>.");
  if(/pulsos|UT/.test(e+" "+(q.p||"")))s.push("Pulso de test: puede oscilar o marcar algo menos.")}
 if(q.x)s.push("Si no da el valor: "+e_(q.x));
 return s};
/* v319: versión corta para el PDF (escala · roja · negra) */
window.insMideCorto=function(q,mod){const s=window.insMidePasos(q,mod).map(x=>x.replace(/<[^>]+>/g,"").replace(/\.$/,""));return s.slice(0,3).join(" · ").replace(/^Polímetro en /,"").replace(/\. Se comprueba el retorno de 0 V/," (retorno 0 V)").replace(/V⎓/g,"V DC").replace(/V~/g,"V AC").replace(/Ω/g,"ohm")};
window.insMide=function(q,mod){return '<span class="imide"><span class="imt">Medir</span><ol>'+window.insMidePasos(q,mod).map(x=>"<li>"+x+"</li>").join("")+"</ol></span>"};

/* ---------- guía de campo: pasos con una medida escrita («220 V entre E-X66:1 y E-X66:2», «24 V en E-X62:1-2») ---------- */
const RM=/(\d+(?:,\d+)?) ?(V~|V⎓|VDC|VAC|V DC|V AC|V)(?![A-Za-z])\s+(entre|en)\s+(\+?[A-Z][A-Z0-9]*(?:\.\d+)?-[A-Z0-9]+(?:\.\d+)?)(?::(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?)?(?:\s+y\s+(\+?[A-Z][A-Z0-9]*(?:\.\d+)?-[A-Z0-9]+(?:\.\d+)?(?::\d+(?:\.\d+)?)?))?/g;
const zonaRef=r=>{const m=String(r).replace(/^\+/,"").match(/^([A-Z]+)\d*(?:\.\d+)?-/);const z=m?m[1]:"E";return Z0[z]?z:z==="CP"?"P":"E"};
const pre=r=>r.charAt(0)==="+"?r:"+"+r;
window.guiaMidePasos=function(txt){const out=[];let m;RM.lastIndex=0;
 while((m=RM.exec(String(txt||"")))){const v=m[1],u=m[2],ref=pre(m[4]),b1=m[5],b2=m[6],ref2=m[7]?pre(m[7]):"";
  const ac=/~|AC/.test(u)||(!/DC|⎓/.test(u)&&/^(220|230|380|400)$/.test(v));const A=ref+(b1?":"+b1:"");
  let B=ref2||(b2?ref+":"+b2:"");const s=[];
  s.push("Polímetro en <b>"+(ac?"V~":"V⎓")+"</b>.");
  if(!b1&&!ref2&&!/-X/.test(ref)){s.push("Puntas en las dos bornas de <b>"+e_(ref)+"</b> (bobina / elemento).")}
  else if(!B&&ac&&/^(380|400)$/.test(v)){s.push("Puntas entre dos fases de <b>"+e_(A)+"</b> (L1-L2, L1-L3, L2-L3).")}
  else{s.push("Roja en <b>"+e_(A)+"</b>.");s.push("Negra en <b>"+e_(B||(ac?"el neutro (ver folio)":Z0[zonaRef(ref)]))+"</b>.")}
  s.push("Debe marcar <b>"+e_(v+" "+(ac?"V~":"V⎓"))+"</b>.");
  out.push({t:m[0],s})}
 return out};
const MIRA="span[data-u]";
function marca(el){if(el.dataset.mide)return;el.dataset.mide="1";const c=el.cloneNode(true);c.querySelectorAll("details").forEach(d=>d.remove());
 const l=window.guiaMidePasos(c.textContent);if(!l.length)return;
 const box=document.createElement("span");box.className="imide";
 box.innerHTML=l.map(x=>'<span class="imt">Medir · '+e_(x.t)+'</span><ol>'+x.s.map(y=>"<li>"+y+"</li>").join("")+"</ol>").join("");
 const d=el.querySelector(":scope>details");if(d)el.insertBefore(box,d);else el.appendChild(box)}
function barre(root){if(root.nodeType!==1)return;if(root.matches&&root.matches(MIRA))marca(root);root.querySelectorAll&&root.querySelectorAll(MIRA).forEach(marca)}
new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(barre))).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener("DOMContentLoaded",()=>barre(document.body));
/* al pasar la guía a «Actuación guiada» de la OT, la medida va debajo del paso */
window.guiaMideTexto=function(p){return window.guiaMidePasos(p).map(x=>"   Medir: "+x.s.map(y=>y.replace(/<[^>]+>/g,"").replace(/\.$/,"")).join(" · ")).join("\n")};

const st=document.createElement("style");st.textContent=`
.imide{display:block;margin:6px 0 2px;padding:5px 7px;border-left:3px solid #f0a020;border-radius:0 6px 6px 0;background:color-mix(in srgb,#f0a020 12%,transparent);font-size:12.5px;line-height:1.35}
.imide .imt{display:block;margin-top:3px;font-weight:800;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#f0a020;margin-bottom:2px}
.imide ol{margin:0;padding-left:16px;display:flex;flex-direction:column;gap:1px}
.imide li::marker{color:#f0a020;font-weight:700}`;
document.head.appendChild(st);
})();
