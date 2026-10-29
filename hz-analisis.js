/* v180: recogida de la manguera con el conector insertado (armario AO: desbloqueo de PAS + IN) o desconectado (IN del conector; a 4 m del final, desde el AO).
 ===== v179: Análisis de la OT de tipo HZ (convertidor 400 Hz · conector PDS 400) =====
 Las OT HZ no tienen relación con la capota ni con las señales del PLC de la pasarela (PAS).
 Antes, «No recoge cable» casaba con «Capota izq/dcha recoger» del E-A1 por la palabra «recoge».
 Ahora, en las OT HZ (sin PAS):
   · se analizan juntas la descripción y las observaciones (también definición y comentario), con el mismo peso;
   · se traducen las palabras de campo al vocabulario del PDS 400 (cable → manguera/enrollador, recoge → IN, suelta → OUT…);
   · no se proponen señales ni módulos del PLC de la PAS, solo las averías de la guía HZ;
   · se quita del análisis todo lo que sea de capota (señales, elementos C-S15/C-S16, E-Q4, C-M4, E-K41…E-K44 y averías). ===== */
(function(){
"use strict";
if(typeof anaOT!="function"||typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.HZ)return;
const nrm=t=>(typeof gNorm=="function"?gNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""));
const esHZsolo=i=>{const t=[i.tipo,...(i.equipos||[])];return t.includes("HZ")&&!t.includes("PAS")};
const CAPOTA=/capota|toldo|fuelle|\bC-S1[56]\b|\bE-Q4(\.1)?\b|\bC-M4(\.1)?\b|\bE-K4[1-4]\b|\bC-W10/i;
/* vocabulario de campo → vocabulario de la guía HZ / OPERATIVA PDS 400 */
const MAP=[
 [/cable|manguera|enrolla|bobina|carrete|tambor/," manguera enrollador"],
 [/recog|no entra|no sube|no enrolla|guarda/," recoge IN"],
 [/insertad|conectad|enchufad|enganchad|metido|armario|\bao\b|desbloque|arrastr|recogedor|4 ?m/," recogida conector insertado armario AO desbloqueo"],
 [/suelta|no sale|no baja|desenrolla|no despliega|no da cable/," suelta OUT"],
 [/potencia|tension|corriente|no da|sin salida|no alimenta|no carga/," potencia"],
 [/^(?!.*(90\s*%|noventa)).*(piloto|\bled\b|\bluz\b|lampara)/," piloto LED"],
 [/90\s*%|noventa/," 90 %"],
 [/pin|clavija|conector|enchufe|punta/," conector pines"],
 [/mando|boton|botonera|pulsad/," mando"],
 [/avion|aeronave/," avion"]];
function textoHZ(i){const base=[i.desc,i.obs,i.def,i.com].filter(Boolean).join(" ");const n=nrm(base);let x=base;
 MAP.forEach(([re,add])=>{if(re.test(n))x+=add});return x}
const o=anaOT;anaOT=function(i){const r=o(i);if(!r||!i||r._hz||!esHZsolo(i))return r;
 const R=Object.assign({},r,{_hz:1,tipo:"HZ"});
 try{
  /* descripción + observaciones con el mismo peso */
  const A=anaTerminos({desc:textoHZ(i)});const G=GUIA.tipos.HZ;
  const gd=(G.s||[]).map((s,si)=>{const pt=(s.p||[]).join(" ");return {si,t:s.t,sc:anaPunt(s.t,A)*2+Math.min(anaPunt(pt,A),6)*.5}})
   .filter(x=>x.sc>=1.5&&!CAPOTA.test(x.t)).sort((a,b)=>b.sc-a.sc);
  const top=gd.length?gd[0].sc:0;
  R.guia=gd.length?gd.filter(x=>x.sc>=top*.4).slice(0,4):(r.guia||[]).filter(g=>!CAPOTA.test(g.t));
  /* sin señales ni módulos del PLC de la PAS: el HZ tiene su propio mando (PDS 400) */
  R.rel=[];R.mods=[];
  const tags=new Set(((i.desc||"")+" "+(i.obs||"")+" "+(i.def||"")+" "+(i.com||"")).toUpperCase().match(/\b([A-Z]{1,4}\d*-[A-Z]{1,3}\d+(?:\.\d+)?)/g)||[]);
  R.elem=(r.elem||[]).filter(t=>tags.has(t)&&!CAPOTA.test(t));
  R.pal=(r.pal||[]).filter(p=>!/capota/i.test(p.w))}
 catch(e){console.warn("hz-analisis",e);R.rel=(r.rel||[]).filter(x=>!CAPOTA.test(x.S.t+" "+[...(x.tg||[])].join(" ")));R.mods=[...new Set(R.rel.map(x=>x.mod))];
  R.elem=(r.elem||[]).filter(t=>!CAPOTA.test(t));R.guia=(r.guia||[]).filter(g=>!CAPOTA.test(g.t))}
 try{ANA_C.r=R}catch(e){}
 return R};
try{ANA_C={k:"",r:null}}catch(e){}
})();
