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

function croquis(e,cs){let h="",zAnt="",lv=0;/* v876: árbol con sangrado (cada nivel cuelga del anterior) */const ML=()=>`margin-left:${Math.min(lv,8)*11}px`;
 const banda=z=>{if(z==zAnt)return "";zAnt=z;return `<div class="ciz">📍 ${E(z)}</div>`};
 if(e.m!="AUX"){h+=banda(MZ(e.m)||zona(e.m));
  lv=1;h+=`<div class="cib ciori"><small>ORIGEN · módulo PLC</small><b>${E(e.m)}</b> <span class="cip">borna ${E(e.b)}</span>${e.c||e.k?` <span class="cip">${E([e.c,e.k].filter(Boolean).join(" · "))}</span>`:""}</div>`}
 const N=(e.n||[]).filter(n=>n.t||n.k=="C"||n.k=="?");let pasado=false;
 N.forEach((n,i)=>{if(n.k=="?"){h+=`<div class="cinota">ℹ️ ${E(n.x||"")}</div>`;return}
  if(n.k=="C"){h+=`<div class="cicom">⏚ común ${E(n.w||"")}</div>`;return}
  const t=nt(n.t);const cw=cable(n.v);
  if(cw)h+=`<div class="cil cilt" style="margin-left:${Math.min(lv,8)*11-5}px">⬇ ${cw}</div>`;else if(i>0||e.m!="AUX")h+=`<div class="cil cilt" style="margin-left:${Math.min(lv,8)*11-5}px">⬇</div>`;
  if(n.k=="M"){h+=banda(MZ(t)||zona(t));h+=`<div class="cib ciori"><small>RETORNO · módulo PLC</small><b>${E(t)}</b>${n.l?` <span class="cip">${E(n.l)}</span>`:""}</div>`;return}
  h+=banda(zona(t));h+=`<div class="citr" style="${ML()}">${bloque(n,cs,i).replace("<b>","<b>└▶ ")}</div>`;lv++;if(cs.has(t))pasado=true});
 return h}

/* ===== v646: CROQUIS DEL MÓDULO PLC =====
   Si el componente es un módulo de E/S (E-A0…E-A10, P-A1…P-A6): ORIGEN = el módulo; DESTINO = cada elemento de campo conectado
   a sus canales, pasando por los borneros y mangueras que hay en campo. Se agrupa por la ubicación del elemento (📍 bandas) y,
   dentro de cada ubicación, por el recorrido común (bornero → manguera → bornero) que se dibuja una sola vez. */
const ESB=t=>/-X\d/.test(t);
function ruta(e){const N=(e.n||[]).filter(n=>n.t&&n.k!="C"&&n.k!="?");const pasos=[];let dest=null;
 for(const n of N){const t=nt(n.t);if(ESB(t)){pasos.push(n);continue}dest=n;break}
 return {pasos,dest}}
const borna=n=>n.ps&&n.ps.length?n.ps.join("-"):(n.p||(String(n.t||"").includes(":")?String(n.t).split(":")[1]:""));
function cab(v,corto){if(!v||!v.length)return "";const x=v[0];
 if(x.h!==undefined)return `<span class="cmw"><i style="background:${COL[x.c]||"#777"}"></i>${corto?"":"hilo "}${E(x.h||"s/n")}</span>`;
 if(x.m)return `<span class="cmw cmwm">🧵 ${E(x.m)}${x.d?` <small>c.${E(x.d)}</small>`:""}</span>`;return ""}
function mapaModulo(c,cs){const C=window.CABLEADO||{};
 const L=Object.values(C).filter(e=>cs.has(String(e.m).toUpperCase())).sort((a,b)=>String(a.b).localeCompare(String(b.b),"es",{numeric:true}));
 if(!L.length)return "";const mod=L[0].m,zM=MZ(mod)||zona(mod);
 const G={},orden=[];
 L.forEach(e=>{const {pasos,dest}=ruta(e);const z=dest?zona(dest.t):"Sin conexión";
  const tr=[];pasos.forEach(n=>{const t=nt(n.t);const m=(n.v||[]).find(x=>x.m);if(m&&!tr.includes("W:"+m.m))tr.push("W:"+m.m);if(!tr.includes("X:"+t))tr.push("X:"+t)});
  if(dest){const m=(dest.v||[]).find(x=>x.m);if(m&&!tr.includes("W:"+m.m))tr.push("W:"+m.m)}
  if(!G[z]){G[z]={};orden.push(z)}const k=tr.join(">");(G[z][k]=G[z][k]||[]).push({e,pasos,dest})});
 orden.sort((a,b)=>(b==zM)-(a==zM)||(a=="Sin conexión")-(b=="Sin conexión"));
 const chip=x=>{const [k,v]=[x.slice(0,1),x.slice(2)];return k=="W"?`<span class="cmtw">🧵 manguera <b>${E(v)}</b></span>`:`<span class="cmtx"><small>${E(zona(v))}</small>bornero <b>${E(v)}</b></span>`};
 const fila=({e,pasos,dest})=>{let h=`<span class="cmb">${E(e.b)}<small>${E([e.c,e.k].filter(Boolean).join(" "))}</small></span>`;
  pasos.forEach(n=>{h+=`<span class="cma">→</span>${cab(n.v,1)}<span class="cmx">${E(nt(n.t))}<small>:${E(borna(n))}</small></span>`});
  if(dest){const t=nt(dest.t),dst=cs.has(t);h+=`<span class="cma">→</span>${cab(dest.v,1)}<span class="cme">${E(t)}${borna(dest)?`<small> ${E(borna(dest))}</small>`:""}</span>`}
  else h+=`<span class="cma">·</span><span class="cmr">reserva / sin cableado en el plano</span>`;
  let nom="";try{nom=dest&&typeof window.nombreElemento=="function"?String(window.nombreElemento(nt(dest.t))||""):""}catch(_){}
  return `<div class="cmfi"><div class="cmfp">${h}</div><div class="cmfd">${E(e.d||"")}${nom&&nom!=nt(dest.t)?` <small>· ${E(nom)}</small>`:""} <small>· folio ${E(e.f)}</small></div></div>`};
 const nEl=new Set(L.map(e=>{const d=ruta(e).dest;return d?nt(d.t):""}).filter(Boolean)).size;
 let h=`<div class="cmmap"><div class="cmori"><small>ORIGEN · módulo PLC · 📍 ${E(zM)}</small><b>${E(mod)}</b> <span>${L.length} canales · ${nEl} elementos de campo · ${orden.filter(z=>z!="Sin conexión").length} ubicaciones</span></div><div class="cmtree">`;
 orden.forEach(z=>{const T=G[z];
  h+=`<div class="cmz"><div class="cmzt">📍 ${E(z)}${z==zM?" <small>(mismo armario que el módulo)</small>":""}</div>`;
  Object.keys(T).forEach(k=>{const tr=k?k.split(">"):[];
   h+=`<div class="cmrt">${tr.length?`<div class="cmtr"><span class="cmtrl">Recorrido</span>${tr.map(chip).join('<span class="cma">⇢</span>')}</div>`:z!="Sin conexión"?`<div class="cmtr"><span class="cmtrl">Directo</span><span class="cmtw">hilo del armario, sin bornero intermedio</span></div>`:""}${T[k].map(fila).join("")}</div>`});
  h+=`</div>`});
 return h+`</div></div>`}

window.compInstalHTML=function(c){if(!c)return "";const cs=new Set(cods(c.id));
 const mm=mapaModulo(c,cs);
 if(mm){const CL=circuitos(c),C=window.CABLEADO||{};const D=Object.values(C).filter(e=>cs.has(String(e.m).toUpperCase())&&(e.n||[]).length).sort((a,b)=>String(a.b).localeCompare(String(b.b),"es",{numeric:true}));
  return `<details class="cinst"><summary><span class="cnverde">INSTALACIÓN · ORIGEN → DESTINO</span> <small class="cimod">CROQUIS DEL MÓDULO</small></summary>
  <div class="cimu">Esquema rev. J (504/508 y 507: mismos elementos, puede cambiar el hilo). Origen = módulo; destino = elemento de campo; en medio, borneros (bornero:borna) y mangueras (🧵 · c. = conductor). Bandas 📍 = ubicación en campo.</div>${mm}
  <details class="cic"><summary><b>Detalle canal a canal (ida y retorno)</b> <small>${D.length} canales cableados</small></summary>${D.map(e=>`<details class="cic"><summary><b>${E(e.d||e.b)}</b> <small>${E(e.m+" "+e.b)} · folio ${E(e.f)}</small></summary><div class="cicr">${croquis(e,cs)}</div></details>`).join("")}</details></details>`}
 const L=circuitos(c);
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
.cimod{font-weight:800;letter-spacing:.4px}
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
.cmmap{margin:6px 0 8px}.cmori{border:2px solid #7b1fa2;border-radius:9px;padding:6px 9px;background:#7b1fa20d}.cmori small{display:block;font-size:10.5px;font-weight:800;opacity:.75;letter-spacing:.3px}.cmori b{font-size:16px}.cmori span{font-size:12px;opacity:.8;margin-left:4px}
.cmtree{margin:0 0 0 12px;padding-left:12px;border-left:3px solid #7b1fa2}
.cmz{position:relative;margin-top:10px}.cmz::before{content:"";position:absolute;left:-12px;top:12px;width:10px;border-top:3px solid #7b1fa2}
.cmzt{padding:3px 8px;border-radius:6px;background:#1e5bd8;color:#fff;font-weight:800;font-size:12.5px}.cmzt small{font-weight:600;opacity:.85}
.cmrt{margin:6px 0 0 8px;padding-left:8px;border-left:2px dashed #1e5bd866}
.cmtr{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin:4px 0;font-size:12px}.cmtrl{font-size:10.5px;font-weight:800;text-transform:uppercase;opacity:.65;margin-right:2px}
.cmtx{border:2px solid #8a8a8a;border-radius:7px;padding:2px 7px;background:var(--card,#fff)}.cmtx small{display:block;font-size:9.5px;opacity:.7;font-weight:700}
.cmtw{border:2px solid #ef6c00;border-radius:7px;padding:2px 7px;background:#ef6c0010}
.cmfi{margin:5px 0;padding:5px 7px;border-radius:8px;background:#8881}.cmfp{display:flex;flex-wrap:wrap;align-items:center;gap:3px;font-size:12px}
.cmb{border:2px solid #7b1fa2;border-radius:6px;padding:1px 6px;font-weight:800}.cmb small{margin-left:4px;font-weight:600;opacity:.7}
.cmx{border:1px solid #8a8a8a;border-radius:6px;padding:1px 5px;font-weight:700}.cmx small{opacity:.75}
.cme{border:2px solid #e08a00;border-radius:6px;padding:1px 6px;font-weight:800;background:#e08a0014}.cme small{font-weight:600;opacity:.75}
.cmr{font-style:italic;opacity:.7}.cma{opacity:.55;font-weight:800}
.cmw{display:inline-flex;align-items:center;gap:3px;font-size:11px;opacity:.9}.cmw i{display:inline-block;width:10px;height:4px;border-radius:2px}.cmwm{color:#c25400}
.cmfd{font-size:12.5px;margin-top:3px;font-weight:700}.cmfd small{font-weight:500;opacity:.75}
.cicom{font-size:12px;opacity:.85;margin:4px 0 0 4px}.cinota{font-size:12px;margin:4px 0;padding:5px 7px;border-radius:7px;background:#e8eef9;color:#1a3a7a}`;
document.head.appendChild(st);
})();

/* v876: estilo del árbol origen → destino */
(function(){const st=document.createElement("style");st.textContent=`.citr .cib{border-left:4px solid #78909c}.citr .cidest{border-left-color:#f2b705}.cil.cilt{justify-content:flex-start!important;text-align:left!important;border-left:2px dashed #64b5f6;padding-left:6px;color:#1e88e5;font-weight:700;font-size:11.5px}`;document.head.appendChild(st)})();
