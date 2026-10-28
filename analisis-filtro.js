/* ===== v138: Análisis de la OT · solo las señales y los elementos relacionados con la avería =====
 Para las OT no hidráulicas (la hidráulica ya filtra en hidraulica.js). Toma la avería de la guía que encabeza el análisis
 («actuación más eficaz») y deja solo:
   · señales PLC cuyo elemento aparece en esa avería, cuyo módulo + LED cita la avería, o cuyo texto coincide con ella;
   · elementos de campo que la avería nombra (o, si no nombra ninguno, los de las señales que quedan).
 Si el filtro no deja ninguna señal, se quedan las dos mejor puntuadas para no dejar el análisis vacío. ===== */
(function(){
"use strict";
if(typeof anaOT!="function"||typeof GUIA=="undefined")return;
const nrm=t=>typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const TAG=/\b([A-Z]{1,4}\d*-[A-Z]{1,3}\d+(?:\.\d+)?[A-Z]?'{0,2})/g;
const VACIA=new Set("de del la las el los en con sin por para que una uno unos unas desde hasta entre sobre bajo cada este esta esto ese esa como cuando donde segun tiene debe deben esta estan modulo borna bornas senal señal estado entrada salida reposo encendido apagado".split(" "));
const palabras=t=>nrm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=4&&!VACIA.has(w)&&!/^\d+$/.test(w));
const util=t=>!/^[EP]-A\d+$/.test(t)&&!/^[EP]-X\d/.test(t)&&!/^[EP]-Q30/.test(t);
/* referencias «E-A3 módulo 4 LED 1», «E-A3 mód. 4 LED 1 y LED 2», «E-A2 DIN04», «E-A1 OUT31» */
function refsLed(txt){const r=new Set();let m;
 const re=/\b([EP]-A\d+)\s*(?:m[oó]d(?:ulo|\.)?\s*(\d))[^.;·]{0,30}?LED\s*(\d)(?:\s*(?:y|e|,)\s*(?:LED\s*)?(\d))?/gi;
 while((m=re.exec(txt))){r.add(`${m[1].toUpperCase()}|${m[2]}|${m[3]}`);if(m[4])r.add(`${m[1].toUpperCase()}|${m[2]}|${m[4]}`)}
 const rd=/\b([EP]-A\d+)\s*(?:DIN|DI|IN|OUT|DOS|DO)\s*0?(\d{1,2})/gi;
 while((m=rd.exec(txt))){const n=+m[2];r.add(`${m[1].toUpperCase()}|n${n}`)}
 return r}
function relac(x,P){const S=x.S||{};
 for(const t of (x.tg||[]))if(util(t)&&P.tags.has(t))return true;
 if(P.leds.has(`${x.mod}|${S.k}|${S.l}`))return true;
 const n=S.k&&S.l?((+S.k-1)*4+(+S.l)):0;if(n&&P.leds.has(`${x.mod}|n${n}`))return true;
 const w=palabras(S.t);if(!w.length)return false;const hit=w.filter(q=>P.words.has(q)).length;
 return hit>=2||(w.length<=2&&hit==w.length&&P.mods.has(x.mod))}
(function(){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||r._flt||r.hid)return r;r._flt=1;
 try{const G=GUIA.tipos[r.tipo];const g=r.guia&&r.guia[0];const s=G&&g&&G.s[g.si];if(!s||!r.rel)return r;
  const tx=[s.t,...(s.p||[]),s.a||""].join(" ");const up=tx.toUpperCase();
  const P={tags:new Set((up.match(TAG)||[]).map(t=>t.replace(/'+$/,""))),leds:refsLed(tx),words:new Set(palabras(tx)),mods:new Set(up.match(/\b[EP]-A\d+\b/g)||[])};
  const rel0=r.rel;let rel=rel0.filter(x=>relac(x,P));if(!rel.length)rel=rel0.slice(0,2);
  r.rel=rel;r.mods=[...new Set(rel.map(x=>x.mod))];
  const el0=r.elem||[];let el=el0.filter(t=>P.tags.has(t));
  if(!el.length){const vis=new Set();rel.forEach(x=>(x.tg||[]).forEach(t=>{if(util(t))vis.add(t)}));el=el0.filter(t=>vis.has(t)).slice(0,6)}
  r.elem=el}catch(e){console.warn("analisis-filtro",e)}
 return r}})();
try{ANA_C={k:"",r:null}}catch(e){}
})();
