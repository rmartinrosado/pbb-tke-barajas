/* ===== v639: INSTALACIÓN DEL COMPONENTE (origen → destino) dentro de cada ficha de Componentes de campo =====
   Para el catálogo (consulta sin OT): de cada circuito del plano en que interviene el componente (cableado del esquema rev. J,
   canal a canal del PLC y circuitos auxiliares), un croquis en bloques:
     ORIGEN (módulo PLC y borna, con su señal) → borneros / mangueras intermedios (con el hilo o el conductor) → DESTINO
     (el componente y sus bornas) → retorno al módulo si lo hay.
   Cada cambio de ubicación (Armario E, Pupitre, Cabina, Túnel, Elevación…) se separa con una banda para situarse en campo.
   Mismos datos que el «Croquis entre borneros» de la guía de campo; si el componente no está cableado al PLC (potencia,
   protecciones, transformadores) se dice y se remite al folio, sin inventar. ===== */
(function(){
"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nt=t=>String(t||"").replace(/^[+-]/,"").replace(/:.*$/,"").replace(/\([^)]*\)/,"").trim().toUpperCase();
const ZN={E:"Armario E",E1:"Armario E",P:"Armario de pupitre",CP:"Pupitre (panel)",C:"Cabina",C4:"Suelo cabina",IT:"Túnel A (interior)",MT:"Túnel B",ET:"Túnel C (exterior)",
 H:"Elevación",CO:"Columna rotonda",CO3:"Columna rotonda",R:"Rotonda",T:"Bogie / traslación",CBTH:"CBTH",SS:"Escalera",A:"Túnel"};
const zona=t=>{const p=nt(t).split("-")[0];return ZN[p]||ZN[p.replace(/\d+$/,"")]||"Otros"};
const COL={RD:"#d32f2f",BU:"#1e5bd8",BK:"#333",BN:"#8d5524",GY:"#8a8a8a",WH:"#9e9e9e",OG:"#ef6c00",VT:"#7b1fa2",YE:"#c79a00",GN:"#2e9e44",GNYE:"#2e9e44",PK:"#e91e63"};
const cods=id=>String(id||"").toUpperCase().split(/\s*(?:\/|,|\+|\by\b)\s*/).map(x=>x.replace(/\s+/g,"").replace(/^\+/,"")).filter(Boolean);
const MZ=m=>/^P-A/.test(m)?"Armario de pupitre":/^E-A/.test(m)?"Armario E":"";

function circuitos(c){const C=window.CABLEADO||{};const cs=new Set(cods(c&&c.id));if(!cs.size)return [];
 const out=[];Object.keys(C).forEach(k=>{const e=C[k];const n=(e.n||[]);if(!n.some(x=>x.t&&cs.has(nt(x.t))))return;out.push(e)});
 /* primero los del PLC, luego los auxiliares; sin repetir el mismo canal */
 return out.sort((a,b)=>(a.m=="AUX")-(b.m=="AUX")||String(a.m+a.b).localeCompare(String(b.m+b.b),"es",{numeric:true})).slice(0,14)}

function cable(v){if(!v||!v.length)return "";const x=v[0];
 if(x.h!==undefined)return `<span class="ciw"><i style="background:${COL[x.c]||"#777"}"></i>hilo <b>${E(x.h||"s/n")}</b>${x.c?" "+E(x.c):""}</span>`;
 if(x.m)return `<span class="ciw ciwm">🧵 manguera <b>${E(x.m)}</b>${x.d?` · cond. ${E(x.d)}`:""}${x.t&&x.t!="FABRICANTE"?` <small>(${E(x.t)})</small>`:""}</span>`;
 return ""}

function bloque(n,cs,i){const t=nt(n.t);const dest=cs.has(t);
 const bornas=n.ps&&n.ps.length?n.ps.join("-"):(n.p||(String(n.t||"").includes(":")?String(n.t).split(":")[1]:""));
 const tipo=/-X\d/.test(t)?"Bornero":n.k=="M"?"Módulo PLC":n.k=="E"?(dest?"DESTINO · componente":"Elemento"):n.k=="P"?"Punto":"";
 return `<div class="cib${dest?" cidest":""}"><small>${E(tipo)}</small><b>${E(t)}</b>${bornas?` <span class="cip">${/-X\d/.test(t)?"borna":"bornas"} ${E(bornas)}</span>`:""}${n.l?` <span class="cip">${E(n.l)}</span>`:""}</div>`}

function croquis(e,cs){let h="",zAnt="";
 const banda=z=>{if(z==zAnt)return "";zAnt=z;return `<div class="ciz">📍 ${E(z)}</div>`};
 if(e.m!="AUX"){h+=banda(MZ(e.m)||zona(e.m));
  h+=`<div class="cib ciori"><small>ORIGEN · módulo PLC</small><b>${E(e.m)}</b> <span class="cip">borna ${E(e.b)}</span>${e.c||e.k?` <span class="cip">${E([e.c,e.k].filter(Boolean).join(" · "))}</span>`:""}</div>`}
 const N=(e.n||[]).filter(n=>n.t||n.k=="C"||n.k=="?");let pasado=false;
 N.forEach((n,i)=>{if(n.k=="?"){h+=`<div class="cinota">ℹ️ ${E(n.x||"")}</div>`;return}
  if(n.k=="C"){h+=`<div class="cicom">⏚ común ${E(n.w||"")}</div>`;return}
  const t=nt(n.t);const cw=cable(n.v);
  if(cw)h+=`<div class="cil">${cw}</div>`;else if(i>0||e.m!="AUX")h+=`<div class="cil"><span class="ciw ciwv">│</span></div>`;
  if(n.k=="M"){h+=banda(MZ(t)||zona(t));h+=`<div class="cib ciori"><small>RETORNO · módulo PLC</small><b>${E(t)}</b>${n.l?` <span class="cip">${E(n.l)}</span>`:""}</div>`;return}
  h+=banda(zona(t));h+=bloque(n,cs,i);if(cs.has(t))pasado=true});
 return h}

window.compInstalHTML=function(c){if(!c)return "";const L=circuitos(c);const cs=new Set(cods(c.id));
 const pl=(window.COMP_PLANOS||[]).find(r=>cs.has(String(r[0]).toUpperCase()));
 if(!L.length)return `<details class="cinst"><summary><span class="cnverde">INSTALACIÓN · ORIGEN → DESTINO</span></summary><div class="cimu">Este componente no aparece en el cableado del PLC cargado (suele pasar con potencia, protecciones, transformadores y borneros sueltos).${pl&&pl[3]?` Ver el <b>folio ${E(pl[3])}</b> del esquema rev. J.`:" Ver su folio en el esquema."}</div></details>`;
 return `<details class="cinst"><summary><span class="cnverde">INSTALACIÓN · ORIGEN → DESTINO</span> <small>${L.length} circuito${L.length>1?"s":""}</small></summary>
 <div class="cimu">Esquema rev. J (504/508 y 507 tienen esquema propio: mismos elementos, puede cambiar el hilo). Bandas 📍 = ubicación en campo.</div>`+
 L.map(e=>`<details class="cic"><summary><b>${E(e.d||e.b)}</b> <small>${e.m!="AUX"?E(e.m+" "+e.b):"circuito auxiliar"} · folio ${E(e.f)}</small></summary><div class="cicr">${croquis(e,cs)}</div></details>`).join("")+`</details>`};

/* dentro de la ficha (catálogo y «Ver ficha completa» de las OT) */
function engancha(){if(typeof window.compFicha!="function"||window.compFicha.__ci)return;const o=window.compFicha;
 const f=function(c){const h=o.apply(this,arguments);try{return c?h+window.compInstalHTML(c):h}catch(e){return h}};f.__ci=1;window.compFicha=f}
engancha();setTimeout(engancha,0);setTimeout(engancha,1500);

const st=document.createElement("style");st.textContent=`
details.cinst{margin:12px 0 4px;border:1px solid var(--line,#ccc);border-radius:10px;padding:6px 8px;background:var(--card,transparent)}
details.cinst>summary{cursor:pointer;list-style:none;display:flex;align-items:center;gap:8px;flex-wrap:wrap}details.cinst>summary::-webkit-details-marker{display:none}
details.cinst>summary .cnverde{display:inline-block;margin:0}
.cimu{font-size:12px;opacity:.8;margin:6px 2px}
details.cic{margin:8px 0;border-left:3px solid #2e9e44;padding-left:8px}details.cic>summary{cursor:pointer;font-size:13.5px;line-height:1.3}details.cic>summary small{display:block;opacity:.75}
.cicr{margin:6px 0 4px}
.ciz{margin:8px 0 4px;padding:3px 8px;border-radius:6px;background:#1e5bd8;color:#fff;font-weight:800;font-size:12px;letter-spacing:.3px}
.cib{border:2px solid #8a8a8a;border-radius:8px;padding:5px 8px;font-size:13.5px;background:var(--card,#fff)}
.cib small{display:block;font-size:10.5px;font-weight:800;opacity:.7;letter-spacing:.3px;text-transform:uppercase}
.cib .cip{display:inline-block;margin-left:4px;padding:0 6px;border-radius:5px;background:#e8eef9;color:#1a3a7a;font-size:12px;font-weight:700}
.ciori{border-color:#7b1fa2}.cidest{border-color:#e08a00;box-shadow:0 0 0 2px #e08a0033}
.cil{display:flex;justify-content:center;margin:2px 0}
.ciw{display:inline-flex;align-items:center;gap:5px;font-size:12px;padding:1px 8px;border-left:3px solid #777}
.ciw i{display:inline-block;width:14px;height:4px;border-radius:2px}
.ciwm{border-left-color:#ef6c00}.ciwv{border:0;opacity:.5}
.cicom{font-size:12px;opacity:.85;margin:4px 0 0 4px}.cinota{font-size:12px;margin:4px 0;padding:5px 7px;border-radius:7px;background:#e8eef9;color:#1a3a7a}`;
document.head.appendChild(st);
})();
