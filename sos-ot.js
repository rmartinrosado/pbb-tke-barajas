/* ===== v929: ANALIZAR del SOS → la actuación queda ASOCIADA A LA OT (26/11/2026) =====
   · Al pulsar ANALIZAR se busca la OT: la de la tarjeta desde la que se abrió el SOS (botón rojo de alarma, al lado de la llave) o,
     si se abrió el SOS suelto, la OT abierta de la misma posición (la más reciente).
   · Las alarmas de «Alarma registrada» se SUMAN a «Alarmas de la Magelis» de la ficha de la OT (sin repetir; se pueden ir sumando
     más en cada análisis y desde Editar registro) y la OT se guarda en ese momento (local + Supabase).
   · La OT queda marcada con la actuación SOS (sosAct): en su tarjeta la llave de la guía de campo pasa a VERDE parpadeando.
   · Si no hay OT abierta de esa posición, se avisa: el análisis sigue igual. ===== */
(function(){
"use strict";
const LA=t=>{try{return typeof window.rcsListaAl=="function"?window.rcsListaAl(t||""):[]}catch(_){return[]}};
/* el SOS abierto desde la tarjeta guarda la OT; abierto de cualquier otra forma, se olvida */
const oR=window.sosRap;if(typeof oR=="function")window.sosRap=function(){window.__sosOT=null;return oR.apply(this,arguments)};
const oAb=window.abreSosOT;if(typeof oAb=="function")window.abreSosOT=function(id){const r=oAb.apply(this,arguments);window.__sosOT=id;return r};
function otDe(pos){let L=[];try{L=Array.isArray(inc)?inc:[]}catch(_){}const ab=L.filter(o=>o&&o.estado=="abierta");
 const id=window.__sosOT;if(id){const o=ab.find(x=>x.id==id);if(o&&(!pos||String(o.pos).toUpperCase()==pos))return o}
 if(!pos)return null;const P=ab.filter(o=>String(o.pos).toUpperCase()==pos);if(!P.length)return null;
 const t=o=>Date.parse(o.created_at||o.creado||((o.fecha||"")+"T"+(o.hIni||"00:00")))||0;return P.sort((a,b)=>t(b)-t(a))[0]}
function asocia(){const pos=((document.getElementById("sr_p")||{}).value||"").trim().toUpperCase();const o=otDe(pos);
 if(!o){if(pos&&typeof msg=="function")msg(`Sin OT abierta en la ${pos}: la actuación no se asocia a ninguna OT`);return}
 const X=LA((document.getElementById("sr_t")||{}).value),V=LA(o.alMag||(typeof o.alarmas=="string"?o.alarmas:""));
 const M=V.slice();X.forEach(x=>{if(!M.some(z=>z.c==x.c))M.push(x)});const nuevas=M.length-V.length;
 if(M.length){o.alMag=M.map(x=>`${x.c} ${x.t}`).join("\n");if(!o.alCod)o.alCod=M[0].c;if(typeof o.alarmas=="string")delete o.alarmas}
 const ob=((document.getElementById("sr_ob")||{}).value||"").trim();
 o.sosAct={t:new Date().toISOString(),al:X.map(x=>x.c),ob:ob.slice(0,400)};
 try{sv("pbb_inc",inc)}catch(e){console.warn("sos-ot",e)}try{if(typeof render=="function")render()}catch(_){}
 if(typeof msg=="function")msg(`OT ${o.orden||o.pos} guardada${nuevas?` · +${nuevas} alarma${nuevas>1?"s":""} en la ficha`:""} · guía de campo lista`)}
const oA=window.sosAnaliza;if(typeof oA=="function")window.sosAnaliza=function(){try{asocia()}catch(e){console.warn("sos-ot",e)}return oA.apply(this,arguments)};
})();
