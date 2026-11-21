/* ===== v640: INCORPORAR · ASIGNAR CÓDIGO SEGÚN PLANOS =====
   Al incorporar un componente con foto:
   · En la lista «📦 Componentes en la foto», cada elemento lleva debajo su descripción según los planos, el folio, la
     ubicación en campo y si ya está incorporado o pendiente de importar.
   · Cuando la IA propone la ficha, encima de «Código (de los planos)» sale la caja «🎯 Asignar código según planos» con
     casillas: código, descripción según planos, ubicación en campo y estado (✓ ya incorporado · 📋 pendiente de importar ·
     ⚠️ no está en la lista de los planos). Lo marcado se asigna al componente (código y, si está vacío, el título).
     Los candidatos son el código que propone la IA, el que escribió el técnico, los de la foto y los elementos de los
     planos cuyo nombre encaja con el título. ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nC=c=>String(c||"").toUpperCase().replace(/^\+/,"").replace(/\s+/g,"");
const nP=c=>nC(c).replace(/\./g,"");
const partes=c=>String(c||"").split(/\s*(?:\/|,|\+|\by\b)\s*/).map(nC).filter(x=>x&&!/^SINC/.test(x)&&/^[A-Z]{1,5}\d*-[A-Z]{1,3}\d/.test(x));
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const PL=()=>window.COMP_PLANOS||[];
const fila=c=>PL().find(r=>nP(r[0])===nP(c));
const fichas=c=>(window.COMP_CAMPO||[]).filter(x=>String(x.id||"").toUpperCase().split(/\s*(?:\/|,|\+)\s*/).map(nP).includes(nP(c)));
function info(c){const r=fila(c),f=fichas(c);
 const ubiP=r?r[2]:"";const ubiC=typeof window.compUbiDe=="function"?window.compUbiDe({id:c}):"";
 const ubi=[ubiP,ubiC&&nrm(ubiC)!==nrm(ubiP)?ubiC:""].filter(Boolean).join(" · ");
 const est=f.length?{k:"ya",t:`✓ ya incorporado${f[0].id!==c?" en "+f[0].id:""}`}:r?{k:"pend",t:"📋 pendiente de importar"}:{k:"no",t:"⚠️ no está en la lista de los planos"};
 return {c,desc:r?r[1]:"",folio:r&&r[3]?`folio ${r[3]}${r[4]&&r[4]!="J"?" · "+r[4]:" · rev. J"}`:"",ubi,est,f}}

/* 1) lista de elementos de la foto: descripción según planos, ubicación y estado */
function enriqueceLista(){document.querySelectorAll("#ic_selw .icg-row").forEach(row=>{if(row.querySelector(".icpi"))return;const b=row.querySelector("b");if(!b)return;
 const cs=partes(b.textContent);if(!cs.length)return;
 row.querySelector("span").insertAdjacentHTML("beforeend",cs.map(c=>{const I=info(c);return `<small class="icpi">${I.desc?`📘 ${E(I.desc)}${I.folio?` <i>(${E(I.folio)})</i>`:""}`:"📘 sin descripción en los planos"}${I.ubi?` · 📍 ${E(I.ubi)}`:""} · <span class="icpe icpe-${I.est.k}">${E(I.est.t)}</span></small>`}).join(""))})}

/* 2) caja de asignación sobre «Código (de los planos)» */
function candidatos(){const S=[],add=c=>{c=nC(c);if(c&&!S.some(x=>nP(x)===nP(c)))S.push(c)};
 partes((document.getElementById("ip_cod")||{}).value).forEach(add);
 partes((document.getElementById("ic_cod")||{}).value).forEach(add);
 document.querySelectorAll("#ic_selw .icg-row b").forEach(b=>partes(b.textContent).forEach(add));
 const tit=nrm((document.getElementById("ip_tit")||{}).value||"");
 const ws=tit.split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!/^(rele|relé|del|para|con|pupitre|armario|cabina|modulo|electrico|componente|bloque)$/.test(w));
 if(ws.length){const pref=S.length?nC(S[0]).split("-")[0]:"";
  PL().map(r=>{const d=nrm(r[1]);let n=ws.filter(w=>d.includes(w)).length;if(pref&&nC(r[0]).split("-")[0]===pref)n+=.5;return {r,n}})
   .filter(x=>x.n>=1).sort((a,b)=>b.n-a.n).slice(0,5).forEach(x=>add(x.r[0]))}
 return S.slice(0,9)}
function cajaHTML(C){const sel=new Set(partes((document.getElementById("ip_cod")||{}).value).map(nP));
 if(!C.length)return `<div id="ic_asig" class="icasig"><b>🎯 Asignar código según planos</b><div class="mu" style="font-size:12px;margin-top:4px">Sin código propuesto. Escribe el código abajo o en «Código si lo sabes» y vuelve a identificar.</div></div>`;
 return `<div id="ic_asig" class="icasig"><b>🎯 Asignar código según planos</b><div class="mu" style="font-size:11.5px;margin:2px 0 6px">Marca el código de este componente. Cada código es una ficha independiente: si ya está incorporado se integra en su ficha; si no, se crea una nueva.</div>`+
  C.map(c=>{const I=info(c);return `<label class="icas-row${sel.has(nP(c))?" on":""}"><input type="checkbox" data-asig="${E(c)}" ${sel.has(nP(c))?"checked":""}><span><b class="cmpid">${E(c)}</b> ${I.desc?E(I.desc):"<i>sin descripción en los planos</i>"}${I.folio?` <small>(${E(I.folio)})</small>`:""}
   <small class="icas-u">📍 ${E(I.ubi||"ubicación sin dato en los planos")}</small><small class="icpe icpe-${I.est.k}">${E(I.est.t)}</small></span></label>`}).join("")+`</div>`}
function pintaCaja(){const ip=document.getElementById("ip_cod");if(!ip)return;const old=document.getElementById("ic_asig");
 /* orden fijo mientras dura la propuesta: lo nuevo que se escriba se añade al final */
 let C=[];try{C=old&&old.dataset.c?JSON.parse(old.dataset.c):[]}catch(e){}if(!C.length)C=candidatos();else partes(ip.value).forEach(c=>{if(!C.some(x=>nP(x)===nP(c)))C.push(c)});
 const h=cajaHTML(C);if(old){if(old.dataset.h===h)return;old.outerHTML=h}else{const lab=ip.previousElementSibling&&ip.previousElementSibling.tagName=="LABEL"?ip.previousElementSibling:ip;lab.insertAdjacentHTML("beforebegin",h)}
 const n=document.getElementById("ic_asig");if(n){n.dataset.h=h;n.dataset.c=JSON.stringify(C)}}
document.addEventListener("change",e=>{const cb=e.target.closest&&e.target.closest("[data-asig]");if(!cb)return;
 const box=document.getElementById("ic_asig");const marc=[...box.querySelectorAll("[data-asig]")].filter(x=>x.checked).map(x=>x.dataset.asig);
 const ip=document.getElementById("ip_cod");if(ip){ip.value=marc.join(" / ");ip.dispatchEvent(new Event("input",{bubbles:true}))}
 const it=document.getElementById("ip_tit");if(it&&!it.value.trim()&&marc.length){const d=marc.map(c=>(fila(c)||[])[1]).filter(Boolean).join(" + ");if(d){it.value=d;it.dispatchEvent(new Event("input",{bubbles:true}))}}
 if(marc.length&&typeof msg=="function")msg(`Código asignado: ${marc.join(" / ")}`);pintaCaja()});
document.addEventListener("input",e=>{if(e.target&&e.target.id=="ip_cod"){clearTimeout(window.__icasT);window.__icasT=setTimeout(pintaCaja,400)}});

let t=0;new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{enriqueceLista();pintaCaja()}catch(e){}},150)}).observe(document.body,{childList:true,subtree:true});

const st=document.createElement("style");st.textContent=`
.icpi{display:block;font-size:11.5px;line-height:1.3;margin-top:2px;opacity:.9}.icpi i{opacity:.75}
.icpe{font-weight:700}.icpe-ya{color:#16a34a}.icpe-pend{color:#d97706}.icpe-no{color:#c62828}
.icasig{margin:10px 0 8px;padding:9px 10px;border:2px solid #16a34a;border-radius:10px;background:color-mix(in srgb,#16a34a 8%,var(--card,#fff))}
.icas-row{display:flex;gap:8px;align-items:flex-start;padding:7px 4px;border-top:1px solid var(--line,#ddd);margin:0;font-size:13.5px;line-height:1.3;cursor:pointer}
.icas-row:first-of-type{border-top:0}.icas-row input{width:20px;height:20px;flex:0 0 auto;margin-top:2px}
.icas-row.on{background:color-mix(in srgb,#16a34a 14%,transparent);border-radius:8px}
.icas-row small{display:block;font-size:12px;margin-top:2px}.icas-u{opacity:.85}`;document.head.appendChild(st);
})();
