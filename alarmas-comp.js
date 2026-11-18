/* ===== v592: ALARMAS / EVENTOS RCS ↔ COMPONENTES DE CAMPO · TABLA REVISADA (18/11/2026) =====
   Revisión una a una de las 211 alarmas, advertencias y eventos del manual RCS frente a todos los componentes de campo.
   Antes la relación salía de un cotejo por palabras (y del texto de la alarma), y metía componentes ajenos: el relé de
   iluminación E-K10 en «058 Fallo medida analógica: Cabina», el zumbador P-H9 en «137 Fallo sirena», la Magelis en «089
   Fallo PLC», relés de focos / lunetas / CBTH en «120 Fallo alimentación 24V», el variador derecho en el freno IZQUIERDO…
   Ahora manda esta tabla: cada componente revisado lleva SOLO las alarmas en que interviene (en su cadena de mando, señal o
   protección, por orden de prioridad). Un componente revisado sin alarmas = ninguna alarma lo trae.
   · Primera actuación / SOS: una alarma trae solo los componentes de la tabla.
   · Ficha del componente: la fila «Alarmas / eventos PLC» se muestra con lo de la tabla.
   · Componentes que se incorporen más tarde (no revisados): siguen con el cotejo automático hasta revisarlos aquí. ===== */
(function(){
"use strict";
const N=s=>String(s||"").toUpperCase().replace(/\s+/g,"");
const T={
 /* --- cadena de medida analógica (E-A4) --- */
 "ET-B9":["057","114","250","251","339","340"],
 "C-R10":["058","246","247"],"ACOPL.C-R10":["058","246","247"],"E-R10":["058","246","247"],
 "E-X62":["057","056"],
 /* --- seguridades --- */
 "R-B1/R-B3":["294","022","139"],
 "E-U5/E1-U8":["010"],
 "P-U5":["072","073","075","096","097","098","099","011","065"],"P-K85":["072","073","075","096","097","098","099"],
 "E-K0":["006","007","008","012","014","028","011","013","065"],"E-K0.1":["006","007","008","012","014","028","011","013","065"],
 "E-K90":["136"],"CONECTOR-3":["011","013","065"],
 /* --- 24 VDC y PLC --- */
 "E1-U3":["120"],"E-Q22":["120"],"E-Q30":["120"],"E-S0/E-S0.1":["120"],
 "E-Q30.0":["127","120"],"E-Q30.1":["127","089","120"],"E-Q30.2":["127","117","120"],"E-Q30.3":["127","120"],
 "E-Q30.4":["127","011","013","065","023","119","120"],
 "P-Q30.0/P-Q30.1/P-Q30.2/P-Q30.3":["126","118","120"],
 "E-Q15":["120","126"],"P-T1":["120","126"],"P-X52":["120","126"],
 "E-F19":["076"],"E-F20":["076"],"E-F21":["076"],
 /* --- traslación: variadores y frenos --- */
 "E-U1":["083","055","079"],"E-U2":["084","055","079"],"E-K1":["129","130","055"],"E-Q1":["055","083","084"],
 "E-K24":["105","106","079","087","088"],"E-Q24":["087","088","079","105","106"],
 "E-K26":["349","343","351"],"E-Q26":["349","343","351"],
 /* --- motores --- */
 "E-K3":["054","066","103","104"],"E-Q3":["054","066"],
 "E-Q8":["049"],"E-K81/E-K82":["049"],
 "E-Q4":["053","260"],"E-Q4.1":["053","260"],"E-K41/E-K42":["053","260"],
 "E-Q40":["050","051","052"],"P-K71/P-K72":["050"],
 "P-Q6":["051","135"],"P-K61/P-K62":["135","051"],
 "P-Q5":["052","067","077","063","064"],"P-K51/P-K52":["052","077","063","064","067"],
 /* --- pupitre: joystick y presencia --- */
 "CP-S0":["100","101","256"],"P-K80":["256","102"],"P-K81":["102","256"],"P-K82":["102","256"],
 /* --- señalización --- */
 "E-K60.1":["143"],"P-K69":["143"],"P-H9":["346"],"E-K14":["131","132"],
 "E-X55":["283","285","275","276","277","278","279","280"],
 /* --- revisados SIN alarma propia (ninguna alarma los trae) --- */
 "E-K10":[],"E-K15":[],"E-K17":[],"E-K85":[],"E-K86":[],"E-K87":[],"E-K88":[],"E-K60":[],"E-K61":[],"E-K62":[],
 "MAGELIS-DISPLAY":[],"SINCÓDIGO":[],"E-Q10":[],"E-Q10.1":[],"E-Q12":[],"E-Q13":[],"E-Q14":[],"E-Q15.1":[],"E-Q17.1":[],"E-Q18":[],"E-Q25":[],
 "E-B2":[],"E-B3":[],"E-B4":[],"E-X1":[],"E-X2":[],"E-X51":[],"E-X54":[],"E-X56":[],"E-X57":[],"E-X59":[],"E-X60":[],"E-X61":[],"E-X63":[],
 "E-X66":[],"E-X68":[],"E-X68.1":[],"E-X70":[],"E-X72":[],"P-B20":[],"P-K20":[],"P-K21":[],"P-K22":[],"P-K23":[],"P-K68":[],"P-K83":[],"P-K84":[],
 "P-Q11":[],"P-U3":[],"P-X92":[],"CONECTOR-1":[],"CONECTOR-2":[]};
window.ALARMA_COMP=T;
const kc=c=>N(c&&(c.baseId||c.id));
const rev=c=>Object.prototype.hasOwnProperty.call(T,kc(c));
const AL=()=>window.RCS_AL||[];
const txt=cod=>{const a=AL().find(x=>x.c==cod);return a?a.c+" "+a.t:cod};
const COMPS=()=>window.COMP_CAMPO||[];
const esFila=r=>/^alarmas?\s*\/?\s*eventos/i.test((r&&r[0])||"");
/* fila «Alarmas / eventos PLC» de cada componente revisado = la tabla (en memoria; la ficha guardada no se toca) */
function aplica(){COMPS().forEach(c=>{if(!rev(c)||!Array.isArray(c.esp))return;const L=T[kc(c)];
 const sin=c.esp.filter(r=>!esFila(r));c.esp=L.length?[["Alarmas / eventos PLC",L.map(txt).join(" · ")]].concat(sin):sin;c._alRev=1})}
/* alarma → componentes */
const viejo=window.compDeAlarma;
window.compDeAlarma=function(x){if(!x)return[];const cod=x.c;const out=[];
 COMPS().forEach(c=>{if(rev(c)){if(T[kc(c)].includes(cod))out.push(c);return}
  /* no revisados: solo si su ficha cita la alarma */
  const f=(c.esp||[]).find(esFila);if(f&&new RegExp("(^|[^0-9R])"+cod+"([^0-9]|$)").test(String(f[1]).toUpperCase()))out.push(c)});
 /* por orden de la tabla: el primero de la lista de cada componente pesa más */
 out.sort((a,b)=>{const ia=rev(a)?T[kc(a)].indexOf(cod):9,ib=rev(b)?T[kc(b)].indexOf(cod):9;return ia-ib});
 const vis=new Set();return out.filter(c=>{const k=kc(c)+"|"+(c.t||"");if(vis.has(k))return false;vis.add(k);return true})};
/* componente → alarmas (ficha, incorporar, editar): revisados = tabla; el resto, cotejo de antes */
const oDe=window.compAlarmasDe;
window.compAlarmasDe=function(info){const k=N(info&&info.codigo);if(Object.prototype.hasOwnProperty.call(T,k))return T[k].map(c=>{const a=AL().find(x=>x.c==c);return a?{c:a.c,t:a.t,por:"tabla revisada"}:null}).filter(Boolean);
 return typeof oDe=="function"?oDe(info):[]};
aplica();
if(typeof window.compRecarga=="function"){const o=window.compRecarga;window.compRecarga=async function(){const r=await o.apply(this,arguments);aplica();return r}}
/* las fichas de Supabase llegan con retraso (y cada 10 min): se reaplica cuando cambia la lista */
let n0=-1;setInterval(()=>{const L=COMPS();const n=L.length+L.filter(c=>!c._alRev).length;if(n!==n0){n0=n;aplica()}},2000);
})();
