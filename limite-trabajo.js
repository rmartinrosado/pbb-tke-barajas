/* ===== v437: LÍMITE DE TRABAJO de EXTENSIÓN / RETRACCIÓN (12/11/2026)
   · Caja propia en la guía PAS (⭐ actuación más eficaz) para «Límite de extensión / retracción activado»:
     inductivos ET-B6 (detector 1 · E-A2 4.1) y ET-B7 (detector 2 · E-A2 3.4), módulo verde E-A2, folio 58.
     Un límite de trabajo no pisa ningún final de carrera ni hace caer los contactores de seguridad.
   · Con ese texto ya no salen las cajas del antiatrapamiento (ni en la OT, ni en el SOS, ni en la lupa) si el aviso no lo nombra.
   · El croquis del puente en E-A2 lo dibuja _croqLista (index.html, v437). ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const PAS=GUIA.tipos.PAS;
const T="Límite de extensión / retracción · inductivos ET-B6 / ET-B7 (E-A2)";
if(PAS.s.some(x=>x.t==T))return;
const SI=PAS.s.push({t:T,ef:1,g:[58,58],
 a:"Es un LÍMITE DE TRABAJO (módulo verde E-A2), no un final de carrera de seguridad: los contactores de seguridad siguen entrados y el bypass Llave bypass seguridades CP-S33 no hace falta. Mover solo en MANUAL, despacio y con un compañero vigilando.",
 p:[
 "QUÉ SIGNIFICA · El túnel ha llegado al tope de trabajo de extensión o de retracción: lo marcan el inductivo ET-B6 (detector 1 extensión/retracción) → E-A2 borna 4.1 y el inductivo ET-B7 (detector 2 extensión/retracción) → E-A2 borna 3.4 (folio 58). El PLC corta solo ese sentido de marcha.",
 "1º · LIBERAR: en MANUAL mover en sentido CONTRARIO. Límite de extensión → RETRACCIÓN · límite de retracción → EXTENSIÓN. Al separarse de la leva el límite desaparece de la Magelis / display.",
 "2º · Si no se libera o el límite sale fuera del tope: PUENTE PROVISIONAL en el módulo E-A2 (croquis arriba). Inductivo ET-B6: borna IN 4.1 con 4.2 (+24 V). Inductivo ET-B7: borna IN 3.4 con 3.5 (+24 V). El LED de la entrada se enciende y el límite se libera. Solo con el túnel a la vista y un compañero vigilando; anotarlo en la OT.",
 "3º · CAUSA: mover hacia el final de EXT y de RET mirando los LED de E-A2 4.1 (ET-B6) y 3.4 (ET-B7): cada uno debe cambiar al pasar por su leva. Si no cambia o cambia fuera de sitio: distancia inductivo–leva (1-4 mm), soporte guía de inductivos movido, leva doblada, inductivo sucio o averiado, cables ET1-W5 / ET1-W6.",
 "4º · AJUSTE: ajustar la distancia del inductivo a su leva o adelantar / retrasar el soporte guía de inductivos para que el límite se marque en su sitio.",
 "5º · PRUEBAS FINALES: QUITAR EL PUENTE y mover la PBB en EXT y en RET todo el recorrido de trabajo, comprobando que la Magelis o el display marcan el límite correspondiente (extensión y retracción) y que la PBB para en él."],
 r:"Esquema general rev. J folio 58 (E-A2: detectores de extensión/retracción ET-B6 / ET-B7)"})-1;
const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const txt=i=>nrm([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));
const RE_AT=/antiatrap|atrapamiento|barrera optica/;
const esLimER=t=>/limite|tope/.test(t)&&/extensi|extend|retracc|retrae|recog|telescop/.test(t)&&!RE_AT.test(t);
window.esLimiteTrabajoER=i=>!!i&&String(i.tipo||"PAS")=="PAS"&&esLimER(txt(i));
const sinAT=g=>!/antiatrap/i.test((PAS.s[g.si]&&PAS.s[g.si].t)||g.t||"");
if(typeof anaOT=="function"){const o=anaOT;window.anaOT=anaOT=function(i){const r=o.apply(this,arguments);try{
  if(!r||r._ler||r.tipo!="PAS"||!i)return r;const t=txt(i);
  if(!RE_AT.test(t))r.guia=(r.guia||[]).filter(sinAT);
  if(!esLimER(t))r.guia=(r.guia||[]).filter(g=>g.si!=SI||/extensi|retracc|et-b[67]/.test(t));
  if(esLimER(t)){r._ler=1;r.guia=[{si:SI,t:T,sc:99}].concat((r.guia||[]).filter(g=>g.si!=SI&&!/^Rotonda/i.test(g.t))).slice(0,4);
   r.elem=(r.elem||[]).filter(e=>!/^(IT-S3|MT-S3|CO-B[12])$/.test(e));["ET-B6","ET-B7"].forEach(e=>{if(!r.elem.includes(e))r.elem.unshift(e)});
   if(r.mods&&!r.mods.includes("E-A2"))r.mods.unshift("E-A2")}}catch(e){}return r}}
})();
