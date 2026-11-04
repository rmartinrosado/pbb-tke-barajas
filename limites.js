/* v326: en una OT de «límite» se distingue el tipo de aviso:
 · FINAL DE CARRERA DE SEGURIDAD (pisado por sobrecarrera / medida extrema): mecánico, en un módulo safety AMARILLO
   (IB IL 24 PSDI, p. ej. E-A8). Abre la cadena de seguridades → caen los contactores E-K0 / E-K0.1 → para todo.
 · LÍMITE DE TRABAJO (tope programado o de ajuste): sensor / inductivo en un módulo de entradas digitales VERDE
   (IB IL 24 DI, p. ej. E-A2, E-A3, P-A6). El PLC solo corta ese sentido de marcha; los contactores no caen.
 El texto de la OT decide qué grupo se muestra; si no lo deja claro, salen los dos con cómo distinguirlos en campo. */
(function(){
"use strict";
if(typeof segOT!="function"||typeof segHTML!="function")return;
const RSEG=/fin(al)?(es)? de carrera|\bf\.? ?c\.?\b|\bfc\b|pisad|pisar|pisa\b|sobrecarrera|sobre ?recorrido|extrem|safety|seguridad|contactor|mecanic|rearm|para (todo|la pasarela)|se para todo|corta todo/;
const RNOR=/tope|programad|ajust|sensor|inductiv|detector|cota|software|limite (de )?trabajo|limite normal|encoder|potenciometro|no (llega|sube|baja|gira|extiende|recoge) (mas|del todo|hasta)|para antes|se queda corto|antes de tiempo/;
const esSeg=it=>{const M=PLC.find(m=>m.id==it[0]);return !!M&&(M.t=="SDI"||M.t=="SDO")};
const o=segOT;
window.segOT=segOT=function(i){const S=o.apply(this,arguments);if(!S||!S.lim)return S;
 const t=segNorm([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));
 const s=RSEG.test(t),n=RNOR.test(t);S.limT=s&&!n?"seg":"nor";S.limDef=!s&&!n;S.limMix=s&&n;
 S.itSeg=[];S.itNor=[];S.zs.forEach(z=>z.it.forEach(it=>(esSeg(it)?S.itSeg:S.itNor).push(it)));
 if(!S.itSeg.length&&S.itNor.length)S.limT="nor";else if(!S.itNor.length&&S.itSeg.length)S.limT="seg";
 return S};
const GRP={
 seg:{c:"lmseg",t:"Final de carrera de SEGURIDAD · módulo safety (amarillo)",
  d:"Se ha pisado el final de carrera mecánico por sobrecarrera o medida extrema. Va a un módulo de seguridad (IB IL 24 PSDI, amarillo): abre la cadena de seguridades, caen los contactores E-K0 / E-K0.1 y la pasarela se para en todos los movimientos hasta rearmar.",
  a:"Para recuperarla: bypass CP-S33 en MANUAL y mover en sentido contrario al final de carrera. Comprueba después por qué pasó del límite de trabajo (sensor del límite normal, ajuste o freno) antes de dejarla en servicio."},
 nor:{c:"lmnor",t:"Límite de TRABAJO · módulo de entradas digitales (verde)",
  d:"El sensor del límite marca el tope programado o de ajuste. Va a un módulo de entradas normal (IB IL 24 DI, verde): el PLC solo corta el movimiento en ese sentido; el sentido contrario funciona y los contactores de seguridad no caen.",
  a:"Para liberarlo: mover en sentido contrario en MANUAL (el bypass CP-S33 no actúa sobre estos límites). Si corta antes de tiempo o no corta: LED de la entrada, distancia del inductivo (1-4 mm) y su leva o pestaña."}};
function grupo(k,its){if(!its.length)return "";const G=GRP[k];
 return `<div class="lmg ${G.c}"><div class="anal">${G.t}</div><div class="mu lmd">${G.d}</div><div class="puac">${G.a}</div>
 <div class="anal lms">Puentes provisionales</div>${its.map(segPuente).join("")}<div class="anal lms">Entradas del PLC (medida)</div>${its.map(segIO).join("")}</div>`}
const DIST=`<div class="lmq"><b>¿Cuál de los dos es?</b> Mira el pupitre y el cotejo del PLC:<br>
 · Se para todo, caen los contactores de seguridad, pide rearme o el LED del canal del <b>módulo amarillo</b> (E-A8) está apagado → <b>final de carrera de seguridad</b> pisado.<br>
 · Solo deja de moverse en ese sentido, el contrario va bien y cambia el LED de un <b>módulo verde</b> (E-A2 / E-A3 / P-A6) → <b>límite de trabajo</b>.</div>`;
const oh=segHTML;
window.segHTML=segHTML=function(i,S){let h=oh.apply(this,arguments);if(!S||!S.lim||!S.limT)return h;
 try{const ini=h.indexOf('<div class="anal">Límites · puentes provisionales en el PLC</div>');if(ini<0)return h;
  let fin=h.indexOf('<div class="anal">Contactor de seguridades bloqueado',ini);if(fin<0)fin=h.indexOf('<div class="gnp"',ini);if(fin<0)fin=h.length;
  const otro=k=>{const its=k=="seg"?S.itSeg:S.itNor;if(!its.length)return "";
   let cq="";try{if(typeof croquisPuente=="function"&&window._croqLista){const ids=new Set(its.map(x=>x[0]+x[1]));cq=window._croqLista(i).filter(o=>ids.has(o.mod+o.b1)).map(o=>`<div class="lmcq">${croquisPuente(o,5)}</div>`).join("")}}catch(e){}
   return `<details class="lmotro"><summary>2ª opción · ${k=="seg"?"Si se para todo y caen los contactores de seguridad: <b>final de carrera de seguridad</b> (módulo amarillo E-A8)":"Si solo falla un sentido: <b>límite de trabajo</b> (módulo verde)"}</summary>${cq}${grupo(k,its)}</details>`};
  const cuerpo=S.limMix?DIST+grupo("seg",S.itSeg)+grupo("nor",S.itNor):S.limT=="seg"?grupo("seg",S.itSeg)+otro("nor"):grupo("nor",S.itNor)+otro("seg");
  h=h.slice(0,ini)+cuerpo+h.slice(fin);
  const tit=S.limMix?"límite activado (seguridad o trabajo)":S.limT=="seg"?"final de carrera de seguridad pisado":"límite de trabajo activado";
  h=h.replace(/(PRIMERA ACTUACIÓN EN CAMPO · )límite activado/,"$1"+tit);
  if(S.limT=="nor"&&!S.limMix&&!S.cont)h=h.replace(/<div class="puac">1\. Recuperar la pasarela[\s\S]*?<\/div>/,`<div class="puac">1. Es un límite de trabajo (no de seguridad): en <b>MANUAL</b>, mover en sentido contrario para liberarlo. El bypass CP-S33 no hace falta: los contactores de seguridad siguen entrados.</div>`)
   .replace(/<div class="puac">2\. Si con el bypass no deja maniobrar:[\s\S]*?<\/div>/,`<div class="puac">2. Si no se libera en sentido contrario o corta fuera de su sitio: comprueba el sensor del límite (abajo). Puente provisional solo con el elemento comprobado a la vista y un compañero vigilando.</div>`);
 }catch(e){console.warn("limites",e)}return h};
if(typeof anaHTML=="function"){const oa=anaHTML;window.anaHTML=anaHTML=function(i){let h=oa.apply(this,arguments);try{const S=segOT(i);if(S&&S.lim&&S.limT){
  const t=S.limMix?"Límite: seguridad o trabajo":S.limT=="seg"?"Final de carrera de seguridad (módulo amarillo)":"Límite de trabajo (módulo verde)";
  h=h.replace(/(🔌 1º · )Límite activado/,"$1"+t)}}catch(e){}return h}}
const st=document.createElement("style");st.textContent=`
.lmg{margin:8px 0;padding:6px 0 6px 10px;border-left:5px solid;border-radius:0 8px 8px 0}
.lmseg{border-color:#f2c200;background:color-mix(in srgb,#f2c200 9%,transparent)}
.lmnor{border-color:#2e9e4f;background:color-mix(in srgb,#2e9e4f 9%,transparent)}
.lmseg>.anal:first-child{color:#b08900}.lmnor>.anal:first-child{color:#2e9e4f}
.lmg .lms{font-size:10.5px;opacity:.85}.lmd{margin:2px 0 4px}
.lmotro{margin:8px 0}.lmcq{max-width:420px;margin:6px auto}.lmotro>summary{cursor:pointer;font-size:13px;line-height:1.35;padding:6px 0}
.lmq{margin:8px 0;padding:8px 10px;border-radius:8px;background:color-mix(in srgb,var(--pr,#7b3fe4) 10%,transparent);font-size:13px;line-height:1.4}`;
document.head.appendChild(st);
})();
