/* ===== v460-v461: COMPONENTE DE CAMPO · guía de especificaciones técnicas (15/11/2026) =====
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
  fotos:[["componentes/dl50-frontal.jpg","Vista frontal · placa y conexionado"],["componentes/dl50-superior.jpg","Vista superior · display y teclas"],["componentes/dl50-trasera.jpg","Vista trasera · modelo y conector M12"]],
  esp:[["Función","Medida de distancia por láser del túnel (extensión / retracción) → salida analógica 4-20 mA al PLC"],
   ["Alimentación","10 … 30 VDC (Class 2) · consumo máx. 1,8 W"],
   ["Salida analógica QA","4 … 20 mA"],["Salida conmutada Q","≤ 100 mA · carga < 30 VDC"],
   ["Láser","Clase 1 (EN/IEC 60825-1)"],["Temperatura","−30 … +65 °C · envolvente tipo 1"],
   ["Conector","M12 macho, 5 pines"],["En el PLC","E-A4 · AIN02 (borna 1.2 / 2.2) · regleta E-X62:4 · manguera E-W13 (3×0,75 apantallada) · folio 62"]],
  pin:[["1","Marrón (BN)","L+","+24 VDC"],["3","Azul (BU)","M","0 V"],["4","Negro (BK)","Q","Salida conmutada"],["2","Blanco (WH)","QA","Salida 4-20 mA"],["5","Gris (GY)","MF","Entrada / salida multifunción"]],
  med:["24 VDC entre pin 1 (BN) y pin 3 (BU) en el conector.","4-20 mA en serie en la salida analógica, variando al extender y retraer el túnel.","Con 24 V y sin señal → óptica sucia, haz tapado o desalineado, blanco / reflector movido o sensor averiado."],
  av:"OJO AL SUSTITUIR: en el esquema rev. J la señal llega por el hilo NEGRO (BK) de E-W13 a E-X62:4. En este DL50 el negro (pin 4) es la salida CONMUTADA Q; la 4-20 mA es el BLANCO (pin 2, QA). Comprobar en el montaje qué hilo lleva la medida antes de conectar."}
,
 {id:"C-R10",t:"Potenciómetro de giro de cabina",fab:"VISHAY Spectrol · MOD 132-2-0-103",
  /* fallo de la medida analógica de giro de cabina (medidor de cabina, AIN03) */
  re:t=>/c-?r10|e-?r10|potenciometro (de )?(giro )?(de )?(la )?cabina/.test(t)||/(medida|medidor|analog|potenciom)/.test(t)&&/cabina/.test(t)&&!/extensi|retracc|altura|ultrason|rotonda/.test(t),
  fotos:[["componentes/cr10-frontal.jpg","Vista frontal · placa (modelo y resistencia) y cables 1-2-3"],["componentes/cr10-lateral.jpg","Vista lateral · eje, rosca de fijación y terminales"]],
  esp:[["Función","Mide el giro de la cabina: el eje va acoplado al giro y el cursor da una tensión proporcional al ángulo"],
   ["Resistencia","10 kΩ ± 3 % (entre extremos 1 y 3)"],["Linealidad","± 0,5 %"],
   ["Montaje","Casquillo roscado con tuerca, tetón antigiro y eje con ranura"],["Placa","MOD 132-2-0-103 · código 0331 · México"],
   ["En el PLC","C-R10 (1-2-3) → manguera E-W9 (3×0,75 apantallada) → E-X65:1/2/3 (pantalla :4) → convertidor E-R10 (WAS5 PRO RTD) → 4-20 mA → E-A4 AIN03 (borna 1.3 / 2.3) · folio 62"]],
  pint:"Conexionado (terminales soldados)",
  pin:[["1","Rojo · marca 1","Extremo","Alimentación del convertidor"],["2","Rojo · marca 2","Cursor","Señal (varía al girar)"],["3","Rojo · marca 3","Extremo","Retorno del convertidor"]],
  med:["SIN TENSIÓN (desconectado de E-X65): entre 1 y 3 ≈ 10 kΩ (9,7 … 10,3 kΩ), fijo al girar.","Entre 1-2 y entre 2-3 el valor sube y baja SUAVE al girar la cabina, sin saltos ni abiertos; 1-2 + 2-3 = 1-3.","Abierto, saltos o valor fijo al girar → potenciómetro gastado o acoplamiento al eje suelto / patinando.","Potenciómetro bien y sin medida → manguera E-W9, bornas E-X65 o convertidor E-R10 (4-20 mA en su salida)."],
  av:"AL SUSTITUIR: mismo modelo (10 kΩ, lineal). Antes de desmontar, marcar la posición del eje y del acoplamiento; montar el nuevo en la misma posición para no descalibrar la medida de giro de cabina."},
 /* v463: acoplamiento entre el giro de cabina y el eje del potenciómetro C-R10 (sale con el C-R10) */
 {id:"ACOPL. C-R10",t:"Acoplamiento elástico del potenciómetro de giro de cabina",fab:"Acoplamiento de fuelle metálico con bujes de apriete (tornillo allen)",
  re:t=>/acoplamiento/.test(t)&&/cabina|potenciom|c-?r10/.test(t)||COMP[1].re(t),
  fotos:[["componentes/acop-cr10-lateral.jpg","Vista lateral · fuelle y bujes con tornillo de apriete"],["componentes/acop-cr10-axial.jpg","Vista axial · alojamiento del eje y ranura de apriete"]],
  esp:[["Función","Une el eje del giro de cabina con el eje del potenciómetro C-R10: transmite el giro sin holgura y absorbe desalineaciones"],
   ["Tipo","Fuelle metálico (acero inoxidable) entre dos bujes de aluminio"],
   ["Fijación","Cada buje abraza su eje con una ranura y un tornillo allen de apriete"],
   ["Si el tornillo está flojo","El buje PATINA y la medida no sigue al giro: salta, se queda fija o se descalibra"],["Si el fuelle está roto","Giro con holgura o sin transmisión al potenciómetro"]],
  pint:"",pin:[],
  med:["Con la PBB parada: sujetar el eje del giro y mover el acoplamiento con la mano. No debe haber holgura ni patinar ningún buje.","Comprobar el apriete de los dos tornillos allen y que el fuelle no tiene grietas ni ondas aplastadas.","Girar la cabina despacio mirando el eje del potenciómetro: debe girar a la vez, sin saltos. Si el eje no sigue, el fallo está en el acoplamiento.","Al apretar o cambiar el acoplamiento, dejar el potenciómetro en la MISMA posición que tenía (marcar antes) y comprobar en la Magelis que la medida de giro de cabina es correcta."],
  av:"Si la medida de giro de cabina falla con el potenciómetro bien medido (1-3 ≈ 10 kΩ y 1-2 / 2-3 variando suave), revisar SIEMPRE el acoplamiento antes de cambiar el convertidor E-R10."},
 /* v464: barrera de seguridad de rotonda · emisor SICK L29S (R-B1 / R-B3); receptores R-B2 / R-B4 */
 {id:"R-B1 / R-B3",t:"Emisor de la barrera de seguridad de rotonda",fab:"SICK L29S-3D3430 · P/N 2075831 · lote AB 2420",
  re:t=>/barrera (de )?(seguridad )?(de )?(la )?rotonda|r-?b[1-4]\b|\b294\b|\bl29s?\b|fotocelula.{0,20}rotonda/.test(t),
  fotos:[["componentes/rb-l29s-frontal.jpg","Vista frontal · placa (modelo, 24 V, pines) y cable con conector"],["componentes/rb-l29s-trasera.jpg","Vista trasera · normas de seguridad (Type 2, Cat. 2)"],["componentes/rb-l29s-conector.jpg","Vista conector · M12 macho, 4 pines"]],
  esp:[["Función","Emisor de la barrera fotoeléctrica de seguridad que vigila la rotonda; su receptor (R-B2 / R-B4) avisa al PLC de seguridad si se corta el haz (evento 294)"],
   ["Seguridad","Type 2 (IEC 61496) · Cat. 2, PL c (EN ISO 13849) · SILCL 1 (EN 62061) · IEC 61508"],
   ["Alimentación","24 VDC · I < 30 mA"],["Tiempo de respuesta","≤ 540 µs"],["Protección","IP69K"],
   ["Conector","Cable corto con M12 macho de 4 pines (manguera ITR-W1, SAC-4P-20,0-PUR/M12FS apantallada)"],
   ["Test (PLC → emisor)","E-A1 OUT16, borna 4.4, hilo 645 → E-X70:3 → IT-X50:3 (EIT-W10) → ITR-W1 → R-B1 pin 4 (T1) · folio 55 y 89"],["Señal (receptor → PLC)","R-B4 pin 4 → ITR-W4 → IT-X50:6 → E-X70:6, hilo 646 → E-A10 IN03S, borna 3.1 · folio 70 y 89"]],
  pint:"Conexionado (M12, según placa)",
  pin:[["1","Marrón (BN)","+ (L+)","+24 VDC"],["2","Blanco (WH)","T2","Entrada de test 2"],["3","Azul (BU)","− (M)","0 V"],["4","Negro (BK)","T1","Entrada de test 1 (test del PLC, hilo 645)"]],
  med:["24 VDC entre pin 1 (BN) y pin 3 (BU) en el conector del emisor.","Con la rotonda libre, la entrada E-A10 IN03S (barrera) debe estar ENCENDIDA FIJA. Al cortar el haz con la mano se apaga y salta el evento 294.","Si el evento 294 se activa y desactiva varias veces en pocos segundos: ópticas sucias o desalineadas, soporte flojo, cable dañado o algo que corta el haz.","Limpiar las ópticas de emisor y receptor, realinear y comprobar que el LED queda fijo."],
  av:"No se puentea la barrera de rotonda: es una entrada de seguridad. AL SUSTITUIR: emisor con la misma referencia L29S-3D3430; el receptor es su pieza pareja (comprobar la referencia en su placa). Alinear y probar el corte del haz antes de dejar la PBB en servicio."}
];
window.COMP_CAMPO=COMP; /* v470: «Incorporar» añade aquí los componentes guardados en Supabase */
const casa=t=>{t=nrm(t);return COMP.filter(c=>{try{return c.re(t)}catch(e){return false}})};
window.compCampo=casa;
const ficha=c=>`<div class="cmpf"><div class="cmpt"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}</div><div class="cmpm">${E(c.fab)}</div>
 <div class="cmpfs" style="grid-template-columns:repeat(${c.fotos.length},minmax(0,1fr))">${c.fotos.map(([src,v])=>`<figure class="cmpfo" onclick="compVer('${src}')"><img src="${src}" alt="${E(c.id+" · "+v)}" loading="lazy"><figcaption><b>${E(c.id)}</b> · ${E(v)}</figcaption></figure>`).join("")}</div>
 <table class="cmpe">${c.esp.map(([k,v])=>`<tr><th>${E(k)}</th><td>${E(v)}</td></tr>`).join("")}</table>
 ${c.pin&&c.pin.length?`<div class="cmpst">${E(c.pint||"Conexionado (conector M12)")}</div><table class="cmpp"><tr><th>Pin</th><th>Color</th><th>Señal</th><th>Función</th></tr>${c.pin.map(r=>`<tr>${r.map(x=>`<td>${E(x)}</td>`).join("")}</tr>`).join("")}</table>`:""}
 <div class="cmpst">Medir en campo</div><ol class="cmpo">${c.med.map(x=>`<li>${E(x)}</li>`).join("")}</ol>${c.av?`<div class="gav">⚠️ ${E(c.av)}</div>`:""}</div>`;
window.compFicha=ficha;
window.compCampoHTML=function(t){const L=casa(t);if(!L.length)return"";return L.map(ficha).join("")};
/* foto a pantalla completa (✕ para volver) */
window.compVer=function(src){let o=document.getElementById("cmpv");if(o)o.remove();o=document.createElement("div");o.id="cmpv";
 o.style.cssText="position:fixed;inset:0;z-index:100000;background:#fff;display:flex;align-items:center;justify-content:center";
 o.innerHTML=`<img src="${src}" alt="" style="max-width:96%;max-height:90%;object-fit:contain"><button type="button" aria-label="Cerrar" style="position:fixed;top:max(12px,env(safe-area-inset-top));right:12px;width:48px;height:48px;border-radius:50%;border:2px solid #333;background:#fff;color:#111;font-size:24px;font-weight:800">✕</button>`;
 o.querySelector("button").onclick=e=>{e.stopPropagation();o.remove()};["click","dblclick","touchend"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));document.body.appendChild(o)};
/* ---- SOS: entre el bloque 1 y el 2 ---- */
const pon=()=>{const r=document.getElementById("sr_res");if(!r)return;const h2=r.querySelector(".ub2");if(!h2||r.querySelector(".ubcmp"))return;
 const t=[(document.getElementById("sr_ob")||{}).value,(document.getElementById("sr_a")||{}).value,(document.getElementById("sr_t")||{}).value].filter(Boolean).join(" ")||window.__sosFotoAl||"";
 const h=compCampoHTML(t);if(!h)return;const d=document.createElement("div");d.innerHTML=`<div class="ubh ubcmp">🔩 COMPONENTE DE CAMPO<small>Especificaciones técnicas</small></div><div class="ubb ubbcmp">${h}</div>`;
 r.insertBefore(d.firstChild,h2);r.insertBefore(d.firstChild,h2)};
/* v474: el Componente de campo ya NO sale en el SOS: solo en la guía de campo de la OT */
/* ---- Guía de campo de la OT: debajo de «Seguridad antes de intervenir» ---- */
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{
 if(document.querySelector('details.gd[data-k="CMP"]'))return r;const ab=typeof gOTs=="function"?gOTs():[];const i=ab.find(x=>x.id==gOT)||ab[0];if(typeof gTipo!="undefined"&&gTipo!="PAS")return r;
 /* v474: entre «Mapa de alimentaciones» y «Cierre de la actuación» */
 const h=i?compCampoHTML([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" ")):"";
 const cie=document.querySelector('details.gd[data-k="CIE"]');if(!cie)return r;const d=document.createElement("details");d.className="card gd";d.dataset.k="CMP";
 d.innerHTML=`<summary><span class="cmpst" style="display:block;min-width:0"><b style="display:block">🔩 Componente de campo</b><small style="display:block;font-weight:600;opacity:.8">Especificaciones técnicas</small></span></summary>${h||""}<button class="sec" type="button" style="width:100%;margin-top:6px" onclick="compCatalogo()">CATÁLOGO + INCORPORAR</button>`;cie.before(d)}catch(e){console.warn("componentes",e)}return r}}
const st=document.createElement("style");st.textContent=`
.ubcmp{background:#455a64}.ubcmp small{display:block;font-size:.78em;font-weight:700;opacity:.9;margin-top:2px;padding-left:1.6em}
.cmpf{margin:8px 0;padding:8px;border:1px solid var(--bd,#cfd8dc);border-radius:10px}
.cmpt{font-weight:800;font-size:15px}.cmpid{display:inline-block;background:#455a64;color:#fff;border-radius:6px;padding:1px 7px;margin-right:4px;font-family:ui-monospace,monospace}
.cmpm{font-size:12.5px;opacity:.8;margin:2px 0 8px}
.cmpfs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.cmpfo{min-width:0;margin:0;background:#fff;border:1px solid #cfd8dc;border-radius:10px;padding:6px 4px;display:flex;flex-direction:column;align-items:center;cursor:zoom-in}
.cmpfo img{width:100%;height:110px;object-fit:contain;background:#fff}
.cmpfo figcaption{font-size:10.5px;line-height:1.2;color:#263238;text-align:center;margin-top:5px;overflow-wrap:anywhere}
.cmpe,.cmpp{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
.cmpe th,.cmpe td,.cmpp th,.cmpp td{border-bottom:1px solid var(--bd,#e0e0e0);padding:4px 5px;text-align:left;vertical-align:top}
.cmpe th{width:34%;font-weight:700;opacity:.85}.cmpp th{font-size:12px;opacity:.8}
.cmpst{font-weight:800;font-size:13px;margin-top:10px;text-transform:uppercase;letter-spacing:.03em}
.cmpo{margin:4px 0 6px;padding-left:20px;font-size:13.5px}`;
document.head.appendChild(st);
})();
