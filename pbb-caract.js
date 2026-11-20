/* ===== v634: CARACTERÍSTICAS DE LAS PBB (pantalla «+ PBB») · 1ª característica: Nº DE TÚNELES (2 o 3 cuerpos) =====
   · Se guardan en Supabase, tabla posiciones, columna jsonb «caract» (p. ej. {"tuneles":3}); compartidas con todos los
     técnicos y copia en el móvil para trabajar sin cobertura. Solo el administrador las cambia.
   · En «+ PBB», cada PBB del listado lleva su distintivo (2T / 3T / ?) y al tocarla se abre su ficha de características.
     Botón para dejar todas las «sin definir» en 2 túneles.
   · La app lo usa en las OT y el SOS: pbbCuerpos(pos) → franja del modelo y resolución de antiatrapamiento solo del túnel
     que existe (cuerpos.js) y el modelo va en el contexto de todas las consultas a la IA (pbbModeloTxt).
   Para añadir más características: entrada nueva en CAR (clave, nombre, opciones). ===== */
(function(){
"use strict";
const E=s=>typeof esc=="function"?esc(s):String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const LK="pbb_car";
let PCAR={};try{PCAR=JSON.parse(localStorage.getItem(LK)||"{}")||{}}catch(e){PCAR={}}
window.PCAR=PCAR;
const guarda=()=>{try{localStorage.setItem(LK,JSON.stringify(PCAR))}catch(e){}};
/* catálogo de características (ampliable) */
const CAR=[{k:"tuneles",n:"Nº de túneles (cuerpos)",ops:[[2,"2 túneles","A-B · antiatrapamiento solo del túnel INTERIOR"],[3,"3 túneles","A-B-C · antiatrapamiento del túnel INTERIOR y del túnel MEDIO"]],
 badge:v=>v?v+"T":"?"}];
window.pbbCar=pos=>PCAR[String(pos||"").trim().toUpperCase()]||{};

/* --- modelo para el resto de la app --- */
const prev=window.pbbCuerpos;
window.pbbCuerpos=function(pos){const v=+((window.pbbCar(pos)||{}).tuneles||0);if(v==2||v==3)return v;return typeof prev=="function"?prev(pos):null};
window.pbbModeloTxt=function(pos){try{const n=pbbCuerpos(pos);return n?` (PBB de ${n} túneles/cuerpos: ${n==3?"A-B-C, con túnel medio":"A-B, sin túnel medio"})`:""}catch(e){return""}};

/* --- carga desde Supabase --- */
async function carga(){try{if(typeof sb=="undefined"||!sb)return false;const r=await sb.from("posiciones").select("num,caract");if(r.error||!r.data)return false;
 const N={};r.data.forEach(x=>{if(x.caract&&typeof x.caract=="object"&&Object.keys(x.caract).length)N[String(x.num).toUpperCase()]=x.caract});
 PCAR=window.PCAR=N;guarda();return true}catch(e){return false}}
window.pbbCarCarga=carga;
let tries=0;const iv=setInterval(async()=>{tries++;let u=false;try{u=typeof user!="undefined"&&!!user}catch(e){}if((u&&await carga())||tries>60)clearInterval(iv)},2000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)carga()});

/* --- estilos --- */
const st=document.createElement("style");st.textContent=`
.tlst .pcb{position:relative;font-size:13px;padding:4px 9px;border-radius:999px;border:1px solid color-mix(in srgb,var(--pr,#7c3aed) 40%,transparent);background:transparent;color:inherit;width:auto;margin:0;font-weight:600;display:inline-flex;align-items:center;gap:5px;cursor:pointer}
.tlst .pcb.rem{border-color:#ef6c00;color:#ef6c00;font-weight:700;background:color-mix(in srgb,#ef6c00 12%,transparent)}
.tlst .pcb i{font-style:normal;font-size:10.5px;font-weight:800;padding:1px 5px;border-radius:6px;background:#2e9e44;color:#fff;letter-spacing:.2px}
.tlst .pcb i.p3{background:#7c3aed}.tlst .pcb i.pq{background:#9ca3af;color:#111}
.pcnota{font-size:12.5px;margin:8px 0 2px;opacity:.85}
.pcbulk{margin-top:8px;width:100%;padding:9px;font-weight:700}
.pcf h3{margin:0}.pcf .pcsec{margin-top:14px;padding:10px;border:1px solid color-mix(in srgb,var(--mu,#888) 40%,transparent);border-radius:10px}
.pcf .pcsec>b{display:block;margin-bottom:8px;font-size:14.5px}
.pcf .pcops{display:flex;flex-direction:column;gap:8px}
.pcf .pcop{width:100%;margin:0;text-align:left;padding:10px 12px;border-radius:10px;border:2px solid color-mix(in srgb,var(--mu,#888) 45%,transparent);background:transparent;color:inherit;font-weight:700;font-size:15px}
.pcf .pcop small{display:block;font-weight:500;font-size:12.5px;opacity:.8;margin-top:2px}
.pcf .pcop.on{border-color:#2e9e44;background:color-mix(in srgb,#2e9e44 16%,transparent)}
.pcf .pcop.off{opacity:.9}`;document.head.appendChild(st);

/* --- listado de «+ PBB» con distintivo y acceso a la ficha --- */
const oL=window.posLista;
if(typeof oL=="function"){const nuevo=function(){try{const borrar=typeof apBorrar!="undefined"&&apBorrar;
  const rem=p=>typeof esRem=="function"&&esRem(p);
  return TERMS.map(t=>{const l=posDe(t);return `<div class="tgrp"><b>${t} · ${l.length} PBB</b><div class="tlst">${l.length?l.map(p=>{const P=String(p);const v=+(window.pbbCar(P).tuneles||0);
    if(borrar)return `<button type="button" class="pdel" onclick="borraPos('${E(P)}')">${E(P)} ✕</button>`;
    return `<button type="button" class="pcb ${rem(P)?"rem":""}" onclick="pbbCarAbre('${E(P)}')">${E(P)}${rem(P)?"":`<i class="${v==3?"p3":v==2?"":"pq"}">${v?v+"T":"?"}</i>`}</button>`}).join(""):`<span class="mu">Sin PBB dadas de alta</span>`}</div></div>`}).join("")+
   `<div class="remnota">● En naranja: posiciones remotas sin pasarela.</div>`}catch(e){return oL.apply(this,arguments)}};
 try{posLista=nuevo}catch(e){}window.posLista=nuevo}

/* cabecera: la pantalla pasa a ser también la de características */
const oA=window.addPos;
if(typeof oA=="function"){const nuevoA=function(){const r=oA.apply(this,arguments);try{const c=document.getElementById("sheetc");if(!c)return r;
  const h=c.querySelector("h3");if(h&&/Añadir posición/i.test(h.textContent))h.textContent="PBB · alta y características";
  const hd=c.querySelector(".aphdr");if(hd&&!(typeof apBorrar!="undefined"&&apBorrar)&&!c.querySelector(".pcnota")){
   const sinDef=POS.filter(p=>!(typeof esRem=="function"&&esRem(p))&&!window.pbbCar(p).tuneles).length;
   hd.insertAdjacentHTML("afterend",`<div class="pcnota">Toca una PBB para ver o cambiar sus <b>características</b>. Nº de túneles: <b>2T</b> · <b style="color:#a78bfa">3T</b> · <b>?</b> sin definir (${sinDef}).</div>${sinDef&&(typeof admin=="undefined"||admin)?`<button type="button" class="sec pcbulk" onclick="pbbCarTodas2()">Dejar las ${sinDef} sin definir en 2 túneles</button>`:""}`)}}catch(e){}return r};
 try{addPos=nuevoA}catch(e){}window.addPos=nuevoA}

/* --- ficha de características de una PBB --- */
window.pbbCarAbre=function(pos){const c=document.getElementById("sheetc");if(!c)return;const P=String(pos);const car=window.pbbCar(P);
 const rem=typeof esRem=="function"&&esRem(P);let ter="";try{ter=termDe(P)}catch(e){}
 c.innerHTML=`<div class="pcf"><div class="row" style="flex-wrap:nowrap;align-items:center"><button class="sec" onclick="addPos()" style="padding:4px 12px">←</button><h3 style="flex:1;margin-left:8px">PBB ${E(P)} · ${E(ter)}</h3><button class="sec" aria-label="Cerrar" onclick="closeSheet()" style="padding:4px 12px">✕</button></div>
 ${rem?`<div class="gav" style="margin-top:12px">Posición remota sin pasarela: sin túneles.</div>`:CAR.map(k=>`<div class="pcsec"><b>${E(k.n)}</b><div class="pcops">${k.ops.map(([v,t,d])=>`<button type="button" class="pcop ${+car[k.k]==v?"on":""}" onclick="pbbCarPon('${E(P)}','${k.k}',${v})">${car[k.k]==v?"✅ ":""}${E(t)}<small>${E(d)}</small></button>`).join("")}
   <button type="button" class="pcop off ${car[k.k]?"":"on"}" onclick="pbbCarPon('${E(P)}','${k.k}',null)">${car[k.k]?"":"✅ "}Sin definir<small>La app muestra las dos opciones y avisa en la primera actuación</small></button></div></div>`).join("")}
 <div class="mu" style="font-size:12px;margin-top:12px">Se usa en las OT y el SOS de esta PBB: primera actuación, puente provisional, actuación más eficaz, Análisis de OT y consultas a la IA. Solo el administrador puede cambiarlo.</div></div>`;
 const s=document.getElementById("sheet");if(s)s.style.display="flex"};
async function sube(P,nuevo){if(typeof sb=="undefined")return false;const r=await sb.from("posiciones").update({caract:nuevo}).eq("num",P).select("num");return !r.error&&r.data&&r.data.length>0}
window.pbbCarPon=async function(pos,k,v){const P=String(pos).toUpperCase();const old=Object.assign({},window.pbbCar(P));const nuevo=Object.assign({},old);
 if(v==null)delete nuevo[k];else nuevo[k]=v;
 const ok=await sube(P,nuevo);if(!ok){msg("No se pudo guardar (solo el administrador puede cambiar las características)");return}
 if(Object.keys(nuevo).length)PCAR[P]=nuevo;else delete PCAR[P];guarda();
 msg(`PBB ${P}: ${v==null?"nº de túneles sin definir":v+" túneles"}`);pbbCarAbre(P);refresca()};
window.pbbCarTodas2=async function(){const L=POS.map(String).filter(p=>!(typeof esRem=="function"&&esRem(p))&&!window.pbbCar(p).tuneles);if(!L.length)return;
 if(!confirm(`¿Dejar ${L.length} PBB sin definir con 2 túneles?\n(Las de 3 túneles se cambian después tocándolas.)`))return;
 let n=0;for(const P of L){const nuevo=Object.assign({},window.pbbCar(P),{tuneles:2});if(await sube(P,nuevo)){PCAR[P.toUpperCase()]=nuevo;n++}}
 guarda();msg(n?`${n} PBB con 2 túneles`:"No se pudo guardar (solo el administrador)");addPos();refresca()};
function refresca(){try{if(typeof view!="undefined"&&view=="tec"&&typeof vTec=="function")vTec()}catch(e){}}
})();
