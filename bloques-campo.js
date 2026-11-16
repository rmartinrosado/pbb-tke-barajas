/* ===== v510: Inspección cable a cable · croquis y esquema por BLOQUES DE CAMPO =====
   En «Elementos de campo» (análisis / inspección cable a cable), debajo de cada recorrido:
    1) Croquis: los pasos del recorrido en su orden, agrupados por zona (Armario eléctrico AE | Pupitre | Cabina | túneles…),
       cada zona en su bloque y separada de la siguiente por una línea discontinua. Borneros dibujados como regleta con
       sus bornas; elementos (disyuntores, guardamotores, relés, motores, sensores…) como caja; hilos y mangueras sobre la
       línea que une los pasos (la manguera que cambia de zona va sobre la línea discontinua).
    2) Esquema: tabla por zona con los borneros y los elementos separados, en el orden del recorrido.
   Solo se lee lo que ya se ve en pantalla (no cambia datos). ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TAG=/\+?\b([A-Z]{1,5}\d?-[A-Z]{1,3}\d+(?:\.\d+)?(?:\/\d+)?)/;
const ZK={AE:"#6c1daa","Armario E":"#6c1daa","Armario eléctrico":"#6c1daa","Panel pupitre":"#1565c0","Suelo cabina":"#00838f",Pupitre:"#1565c0","Mandos pupitre":"#1565c0",Cabina:"#00838f","Túnel A":"#ef6c00","Túnel B":"#e65100","Túnel C":"#bf360c",Columna:"#2e7d32",Elevación:"#2e7d32",Bogie:"#558b2f",Rotonda:"#6d4c41",Escalera:"#5d4037",CBTH:"#455a64",Campo:"#757575"};
function zonaDe(tag,txt){const b=/\[([^\]]+)\]/.exec(txt||"");if(b)return b[1].trim();
 try{if(tag&&typeof elZona=="function"){const z=elZona(tag);if(z)return z.c}}catch(e){}return ""}
/* pasos del recorrido tal como se ven */
function pasosDe(elr){const bc=elr.querySelector(".bcol.bcpa")||elr.querySelector(".bcol");let L=[];
 if(bc)L=[...bc.querySelectorAll(":scope>.bcv")].map(x=>x.textContent);
 if(L.length<2){const c=elr.cloneNode(true);c.querySelectorAll(".els,.elb,details,svg,.bqd").forEach(x=>x.remove());L=c.textContent.split("→")}
 return L.map(s=>s.replace(/\s+/g," ").trim()).filter(Boolean)}
function clasifica(L){let fol="";const P=[];
 L.forEach(s=>{const f=/·\s*(folio[^·]*(?:·.*)?)$/i.exec(s);if(f){fol=f[1].trim();s=s.slice(0,f.index).trim()}
  const m=TAG.exec(s);
  if(/^(hilos?|común)\b/i.test(s)){P.push({k:"h",t:s});return}
  if(m&&/-W\d/.test(m[1])){P.push({k:"w",tag:m[1],t:s.replace(/^manguera\s*/i,""),z:zonaDe(m[1],s)});return}
  if(!m){P.push({k:"h",t:s});return}
  const tag=m[1],antes=s.slice(0,m.index).replace(/^(borna|elemento)\s*/i,"").trim();
  let resto=s.slice(m.index+m[0].length).replace(/\[[^\]]*\]/g,"").trim();
  const pins=/^:/.test(resto)?resto.replace(/^:\s*/,""):"";const extra=pins?"":resto.replace(/^[·,\s]+/,"");
  let nom=antes;if(!nom||/^(bornero|borna)$/i.test(nom)){try{const nn=typeof nombreElemento=="function"&&nombreElemento(tag.replace(/\/.*$/,""),"");if(nn)nom=nn}catch(e){}}
  P.push({k:/-X\d/.test(tag)?"x":"e",tag,nom,pins,extra,z:zonaDe(tag,s)})});
 /* zonas: los pasos sin zona heredan la del anterior */
 let z="";P.forEach(p=>{if(p.k=="h")return;if(p.k=="w"){return}if(!p.z)p.z=z;z=p.z||z});
 return {P,fol}}
/* bloques consecutivos por zona; hilos y mangueras = enlaces entre cajas */
function bloques(P){const B=[];let pend=[];
 P.forEach(p=>{if(p.k=="h"||p.k=="w"){pend.push(p);return}
  const z=p.z||"Campo";let b=B[B.length-1];if(!b||b.z!=z){b={z,it:[]};B.push(b)}
  b.it.push(Object.assign(p,{lk:pend}));pend=[]});
 return B}
const corta=(s,n)=>s.length>n?s.slice(0,n-1)+"…":s;
function svg(B){const W=340,x0=92,bw=236,eh=30,xh=34,gap=20,cx=x0+bw/2;let y=6,h="",lines="",prev=null;
 B.forEach((b,bi)=>{const k=ZK[b.z]||"#757575";const y0=y;
  if(bi){/* línea discontinua entre zonas */lines+=`<line x1="2" y1="${y-gap/2-2}" x2="${W-2}" y2="${y-gap/2-2}" stroke="#94a3b8" stroke-width="1.3" stroke-dasharray="6 4"/>`}
  b.it.forEach((p,ii)=>{const ht=p.k=="x"?xh:eh;
   if(prev){const ya=prev.y+prev.h,yb=y;h+=`<line x1="${cx}" y1="${ya}" x2="${cx}" y2="${yb}" stroke="currentColor" stroke-width="1.6" opacity=".7"/>`;
    const lab=p.lk.map(l=>l.k=="w"?"〰 "+l.tag:l.t.replace(/^hilos?\s*/i,"h. ")).join(" · ");
    if(lab){const cruza=ii==0;const tw=Math.min(150,lab.length*5.6+12),ly=(ya+yb)/2,lx=Math.min(cx+6,W-tw-2);
     h+=`<rect x="${lx}" y="${ly-7}" width="${tw}" height="14" rx="7" fill="${cruza?"#f59e0b":"#94a3b8"}" fill-opacity="${cruza?".22":".14"}" stroke="${cruza?"#d97706":"#94a3b8"}" stroke-width=".8"/><text x="${lx+6}" y="${ly+3.5}" class="bqk">${E(corta(lab,28))}</text>`}}
   h+=`<g class="bqit" data-tag="${E(p.tag)}" role="button" aria-label="Ver repuesto ${E(p.tag)}">`;
   if(p.k=="x"){/* regleta */const n=Math.max(3,Math.min(10,(p.pins.match(/\d+/g)||[]).length||4));
    h+=`<rect x="${x0}" y="${y}" width="${bw}" height="${ht}" rx="4" fill="${k}" fill-opacity=".10" stroke="${k}" stroke-width="1.5"/>`;
    for(let j=0;j<n;j++){const xx=x0+bw-10-j*7;h+=`<rect x="${xx-2.5}" y="${y+4}" width="5" height="${ht-8}" rx="1" fill="${k}" fill-opacity=".45"/>`}
    h+=`<text x="${x0+7}" y="${y+14}" class="bqt">${E(p.tag)}${p.pins?`<tspan class="bqp">:${E(corta(p.pins,18))}</tspan>`:""}</text><text x="${x0+7}" y="${y+27}" class="bqn">${E(corta(p.nom||"Bornero",34))}</text>`}
   else{h+=`<rect x="${x0}" y="${y}" width="${bw}" height="${ht}" rx="9" fill="${k}" fill-opacity=".05" stroke="${k}" stroke-width="1.6"/>`+
    `<text x="${x0+9}" y="${y+12.5}" class="bqt">${E(p.tag)}${p.extra?`<tspan class="bqp"> ${E(corta(p.extra,22))}</tspan>`:""}</text><text x="${x0+9}" y="${y+24.5}" class="bqn">${E(corta(p.nom||"Elemento de campo",36))}</text>`}
   h+=`<text x="${x0+bw-8}" y="${y+(p.k=="x"?ht-4:13)}" text-anchor="end" class="bqr">${p.k=="x"?"":"🔩"}</text></g>`;
   prev={y,h:ht};y+=ht+gap});
  /* rótulo de zona a la izquierda */const yc=(y0+y-gap)/2;
  h+=`<rect x="4" y="${y0}" width="80" height="${y-gap-y0}" rx="8" fill="${k}" fill-opacity=".12" stroke="${k}" stroke-opacity=".5"/><text x="44" y="${yc+4}" text-anchor="middle" class="bqz" style="fill:${k}">${E(corta(b.z.toUpperCase(),12))}</text>`});
 const H=y-gap+6;return `<svg class="bqsvg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Croquis por bloques de campo">${lines}${h}</svg>`}
function tabla(B){return `<table class="bqtb"><tr><th>Zona</th><th>Borneros</th><th>Elementos</th></tr>${B.map(b=>{const k=ZK[b.z]||"#757575";
 const X=b.it.filter(p=>p.k=="x").map(p=>`<span class="bqit" data-tag="${E(p.tag)}"><b>${E(p.tag)}</b>${p.pins?":"+E(p.pins):""}</span>`),L=b.it.filter(p=>p.k=="e").map(p=>`<span class="bqit" data-tag="${E(p.tag)}"><b>${E(p.tag)}</b>${p.nom?" "+E(p.nom):""}</span>`);
 return `<tr><td style="color:${k};border-left:3px solid ${k}"><b>${E(b.z)}</b></td><td>${X.join("<br>")||"–"}</td><td>${L.join("<br>")||"–"}</td></tr>`}).join("")}</table>`}
let n0=0;
function pinta(){document.querySelectorAll(".elus .elu .elr:not([data-bq])").forEach(elr=>{elr.dataset.bq="1";if(elr.closest(".elusd"))return;
 try{const {P,fol}=clasifica(pasosDe(elr));const B=bloques(P);const nIt=B.reduce((a,b)=>a+b.it.length,0);if(nIt<2)return;
  const d=document.createElement("details");d.className="bqd";d.setAttribute("data-nocol","");if(n0++<1)d.open=true;
  d.innerHTML=`<summary>🧩 Croquis por bloques de campo · ${B.map(b=>E(b.z)).join(" ┆ ")}</summary><div class="bqs">Toca un elemento o bornero para ver su ficha de repuesto.</div>${svg(B)}<div class="bqs">Esquema por zonas: borneros y elementos en el orden del recorrido</div>${tabla(B)}${fol?`<div class="bqs">${E(fol)}</div>`:""}`;
  /* v511: tocar la caja de un elemento o bornero abre el catálogo de componentes / repuestos con ese código */
  d.addEventListener("click",e=>{if(e.target.closest("summary"))return;e.stopPropagation();const g=e.target.closest(".bqit");
   if(g&&typeof abreCompTag=="function"){e.preventDefault();abreCompTag(g.dataset.tag)}});
  elr.after(d)}catch(e){console.warn("bloques-campo",e)}})}
const st=document.createElement("style");st.textContent=`.bqd{margin:8px 0 4px;border:1px solid var(--bd,rgba(127,127,127,.35));border-radius:10px;padding:6px 8px}
.bqd>summary{cursor:pointer;font-size:12.5px;font-weight:700;list-style:none}.bqd>summary::-webkit-details-marker{display:none}.bqd>summary::before{content:"▸ "}.bqd[open]>summary::before{content:"▾ "}
.bqsvg{display:block;width:100%;max-width:520px;height:auto;margin:8px auto 4px}
.bqsvg text{fill:currentColor}.bqsvg .bqt{font:800 11.5px system-ui,sans-serif}.bqsvg .bqp{font-weight:600;font-size:10.5px}.bqsvg .bqn{font:500 9.8px system-ui,sans-serif;opacity:.8}
.bqsvg .bqk{font:700 9px system-ui,sans-serif}.bqsvg .bqz{font:800 10px system-ui,sans-serif}
.bqit{cursor:pointer;-webkit-tap-highlight-color:transparent}g.bqit:active rect{fill-opacity:.25}span.bqit{text-decoration:underline dotted;text-underline-offset:2px}.bqsvg .bqr{font-size:11px}
.bqs{font-size:11px;opacity:.75;margin:6px 0 3px}
.bqtb{width:100%;border-collapse:collapse;font-size:11.5px}.bqtb th{text-align:left;font-size:10.5px;opacity:.7;padding:3px 4px;border-bottom:1px solid var(--bd,rgba(127,127,127,.35))}
.bqtb td:first-child{white-space:nowrap}.bqtb td{vertical-align:top;padding:4px;border-bottom:1px dashed var(--bd,rgba(127,127,127,.35));overflow-wrap:anywhere}`;
document.head.appendChild(st);
let t=0;new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{pinta()}catch(e){}},120)}).observe(document.body,{childList:true,subtree:true});
})();
