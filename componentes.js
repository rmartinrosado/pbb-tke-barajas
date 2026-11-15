/* ===== v460: COMPONENTE DE CAMPO · guía de especificaciones técnicas (15/11/2026) =====
   Ficha técnica de los elementos de campo (electromecánicos, eléctricos o electrónicos) que pueden intervenir en la avería,
   con fotos recortadas del componente (cada vista en su caja blanca con su rótulo) y el código / título del elemento.
   · SOS: va entre «1 · SACAR EN SERVICIO YA» y «2 · REPARAR».  · Guía de campo de la OT: debajo de «Seguridad antes de intervenir».
   Para añadir un componente: una entrada más en COMP (re = palabras del aviso que lo traen). ===== */
(function(){
"use strict";
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const E=s=>typeof esc=="function"?esc(s):String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const COMP=[
 {id:"ET-B9",t:"Láser de medida de extensión / retracción",fab:"SICK DL50-P1123 · ref. 1 047 361",
  /* límites de extensión / retracción o fallo de la medida analógica de extensión */
  re:t=>/et-?b9|dl50|laser de (medida de )?extension/.test(t)||/(limite|medida|analog|laser|longitud)/.test(t)&&/extensi|retracc|longitud/.test(t),
  fotos:[["componentes/dl50-frontal.jpg","Vista frontal · placa de características y conexionado"],["componentes/dl50-superior.jpg","Vista superior · display y teclas de ajuste (▼ ▲ Set Esc)"],["componentes/dl50-trasera.jpg","Vista trasera · etiqueta del modelo y conector M12"]],
  esp:[["Función","Medida de distancia por láser del túnel (extensión / retracción) → salida analógica 4-20 mA al PLC"],
   ["Alimentación","10 … 30 VDC (Class 2) · consumo máx. 1,8 W"],
   ["Salida analógica QA","4 … 20 mA"],["Salida conmutada Q","≤ 100 mA · carga < 30 VDC"],
   ["Láser","Clase 1 (EN/IEC 60825-1)"],["Temperatura","−30 … +65 °C · envolvente tipo 1"],
   ["Conector","M12 macho, 5 pines"],["En el PLC","E-A4 · AIN02 (borna 1.2 / 2.2) · regleta E-X62:4 · manguera E-W13 (3×0,75 apantallada) · folio 62"]],
  pin:[["1","Marrón (BN)","L+","+24 VDC"],["3","Azul (BU)","M","0 V"],["4","Negro (BK)","Q","Salida conmutada"],["2","Blanco (WH)","QA","Salida 4-20 mA"],["5","Gris (GY)","MF","Entrada / salida multifunción"]],
  med:["24 VDC entre pin 1 (BN) y pin 3 (BU) en el conector.","4-20 mA en serie en la salida analógica, variando al extender y retraer el túnel.","Con 24 V y sin señal → óptica sucia, haz tapado o desalineado, blanco / reflector movido o sensor averiado."],
  av:"OJO AL SUSTITUIR: en el esquema rev. J la señal llega por el hilo NEGRO (BK) de E-W13 a E-X62:4. En este DL50 el negro (pin 4) es la salida CONMUTADA Q; la 4-20 mA es el BLANCO (pin 2, QA). Comprobar en el montaje qué hilo lleva la medida antes de conectar."}
];
const casa=t=>{t=nrm(t);return COMP.filter(c=>{try{return c.re(t)}catch(e){return false}})};
window.compCampo=casa;
const ficha=c=>`<div class="cmpf"><div class="cmpt"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}</div><div class="cmpm">${E(c.fab)}</div>
 <div class="cmpfs">${c.fotos.map(([src,v])=>`<figure class="cmpfo" onclick="compVer('${src}')"><img src="${src}" alt="${E(c.id+" · "+v)}" loading="lazy"><figcaption><b>${E(c.id)}</b> · ${E(v)}</figcaption></figure>`).join("")}</div>
 <table class="cmpe">${c.esp.map(([k,v])=>`<tr><th>${E(k)}</th><td>${E(v)}</td></tr>`).join("")}</table>
 <div class="cmpst">Conexionado (conector M12)</div><table class="cmpp"><tr><th>Pin</th><th>Color</th><th>Señal</th><th>Función</th></tr>${c.pin.map(r=>`<tr>${r.map(x=>`<td>${E(x)}</td>`).join("")}</tr>`).join("")}</table>
 <div class="cmpst">Medir en campo</div><ol class="cmpo">${c.med.map(x=>`<li>${E(x)}</li>`).join("")}</ol>${c.av?`<div class="gav">⚠️ ${E(c.av)}</div>`:""}</div>`;
window.compCampoHTML=function(t){const L=casa(t);if(!L.length)return"";return L.map(ficha).join("")};
/* foto a pantalla completa (✕ para volver) */
window.compVer=function(src){let o=document.getElementById("cmpv");if(o)o.remove();o=document.createElement("div");o.id="cmpv";
 o.style.cssText="position:fixed;inset:0;z-index:100000;background:#fff;display:flex;align-items:center;justify-content:center";
 o.innerHTML=`<img src="${src}" alt="" style="max-width:96%;max-height:90%;object-fit:contain"><button type="button" aria-label="Cerrar" style="position:fixed;top:max(12px,env(safe-area-inset-top));right:12px;width:48px;height:48px;border-radius:50%;border:2px solid #333;background:#fff;color:#111;font-size:24px;font-weight:800">✕</button>`;
 o.querySelector("button").onclick=e=>{e.stopPropagation();o.remove()};["click","dblclick","touchend"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));document.body.appendChild(o)};
/* ---- SOS: entre el bloque 1 y el 2 ---- */
const pon=()=>{const r=document.getElementById("sr_res");if(!r)return;const h2=r.querySelector(".ub2");if(!h2||r.querySelector(".ubcmp"))return;
 const t=[(document.getElementById("sr_ob")||{}).value,(document.getElementById("sr_a")||{}).value,(document.getElementById("sr_t")||{}).value].filter(Boolean).join(" ")||window.__sosFotoAl||"";
 const h=compCampoHTML(t);if(!h)return;const d=document.createElement("div");d.innerHTML=`<div class="ubh ubcmp">🔩 COMPONENTE DE CAMPO · especificaciones técnicas</div><div class="ubb ubbcmp">${h}</div>`;
 r.insertBefore(d.firstChild,h2);r.insertBefore(d.firstChild,h2)};
if(typeof window.sosAnaliza=="function"){const o=window.sosAnaliza;window.sosAnaliza=async function(){const x=await o.apply(this,arguments);try{pon()}catch(e){}return x}}
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});
/* ---- Guía de campo de la OT: debajo de «Seguridad antes de intervenir» ---- */
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{
 if(document.querySelector('details.gd[data-k="CMP"]'))return r;const ab=typeof gOTs=="function"?gOTs():[];const i=ab.find(x=>x.id==gOT)||ab[0];if(!i||(i.tipo&&i.tipo!="PAS"))return r;
 const h=compCampoHTML([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));if(!h)return r;
 const seg=document.querySelector('details.gd[data-k="SEG"]');if(!seg)return r;const d=document.createElement("details");d.className="card gd";d.dataset.k="CMP";
 d.innerHTML=`<summary><b>🔩 Componente de campo · especificaciones técnicas</b></summary>${h}`;seg.after(d)}catch(e){console.warn("componentes",e)}return r}}
const st=document.createElement("style");st.textContent=`
.ubcmp{background:#455a64}
.cmpf{margin:8px 0;padding:8px;border:1px solid var(--bd,#cfd8dc);border-radius:10px}
.cmpt{font-weight:800;font-size:15px}.cmpid{display:inline-block;background:#455a64;color:#fff;border-radius:6px;padding:1px 7px;margin-right:4px;font-family:ui-monospace,monospace}
.cmpm{font-size:12.5px;opacity:.8;margin:2px 0 8px}
.cmpfs{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;scroll-snap-type:x mandatory}
.cmpfo{flex:0 0 46%;margin:0;background:#fff;border:1px solid #cfd8dc;border-radius:10px;padding:8px;scroll-snap-align:start;display:flex;flex-direction:column;align-items:center;cursor:zoom-in}
.cmpfo img{width:100%;height:150px;object-fit:contain;background:#fff}
.cmpfo figcaption{font-size:11.5px;line-height:1.25;color:#263238;text-align:center;margin-top:6px}
.cmpe,.cmpp{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
.cmpe th,.cmpe td,.cmpp th,.cmpp td{border-bottom:1px solid var(--bd,#e0e0e0);padding:4px 5px;text-align:left;vertical-align:top}
.cmpe th{width:34%;font-weight:700;opacity:.85}.cmpp th{font-size:12px;opacity:.8}
.cmpst{font-weight:800;font-size:13px;margin-top:10px;text-transform:uppercase;letter-spacing:.03em}
.cmpo{margin:4px 0 6px;padding-left:20px;font-size:13.5px}`;
document.head.appendChild(st);
})();
