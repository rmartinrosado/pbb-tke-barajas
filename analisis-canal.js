/* ===== v417: Análisis de la OT · elementos de la señal elegida =====
 1. OT de medida analógica (E-A4): cada canal lleva SUS elementos de campo
    AIN01 altura → C-B14, P-W20, EP-W8, E-X62 · AIN02 extensión → ET-B9, E-W13, E-X62
    AIN03 cabina → C-R10, E-W9, E-X65, E-R10 · AIN04 rotonda → R-R1, IT-W16, IT-X62, EIT-W4, E-X62
    «giro de cabina» es el potenciómetro de cabina C-R10 (AIN03): fuera las señales de la rotonda si la OT no dice rotonda.
 2. Al elegir una señal en «Señales implicadas», «Elementos de campo a revisar» y sus recorridos pasan a ser los de ESA señal. */
(function(){
"use strict";
if(typeof anaOT!="function"||typeof anaHTML!="function")return;
const CH={1:["C-B14","P-W20","EP-W8","E-X62"],2:["ET-B9","E-W13","E-X62"],3:["C-R10","E-W9","E-X65","E-R10"],4:["R-R1","IT-W16","IT-X62","EIT-W4","E-X62"]};
const NOMC={1:"altura",2:"extensión",3:"giro de cabina",4:"giro de rotonda"};
try{if(typeof AN_CH!="undefined"){AN_CH[2]=/extensi|retracc|laser|longitud|telescop|elongac/}}catch(e){}
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const RE_AN=/analog|medid|medidor|lectura|potenciom|4-20|ultrason|laser|encoder|convertidor/;
function canales(t){const n=[];if(/altura|ultrason/.test(t))n.push(1);if(/extensi|retracc|laser|longitud|telescop|elongac/.test(t))n.push(2);
 if(/cabina/.test(t))n.push(3);if(/rotonda/.test(t))n.push(4);return n}
const chOf=x=>x&&x.mod=="E-A4"?+String(x.S&&x.S.l):0;
const TAG=/\+?([A-Z]{1,5}\d?-[A-Z]{1,3}\d+(?:\.\d+)?)/g;
function elemSig(x){if(!x||!x.S)return [];const c=chOf(x);if(c&&CH[c])return CH[c].slice();
 const set=new Set();const add=t=>{t=t.replace(/^\+/,"");if(/^[EP]-A\d+$|^E-Q30/.test(t))return;set.add(t)};
 (x.S.p||[]).forEach(q=>{let m;TAG.lastIndex=0;const s=String(q.p||"");while((m=TAG.exec(s)))add(m[1])});
 (x.tg||[]).forEach(t=>add(String(t)));return [...set].slice(0,8)}
window.anaElemSig=elemSig;
/* 1. análisis: canal analógico nombrado */
(function(){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||!i||r._can)return r;r._can=1;if(r.tipo&&r.tipo!="PAS")return r;
 try{const t=nrm([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));if(!RE_AN.test(t))return r;
  const nom=canales(t).filter(c=>!(c==4&&["504","508"].includes(String(i.pos))));if(!nom.length)return r;
  let rel=(r.rel||[]).filter(x=>!chOf(x)||nom.includes(chOf(x)));
  if(!nom.includes(4))rel=rel.filter(x=>chOf(x)||!/rotonda/i.test(x.S&&x.S.t||""));
  nom.forEach(c=>{if(!rel.some(x=>chOf(x)==c)&&typeof RUTAS!="undefined"&&RUTAS["E-A4"]){const S=(RUTAS["E-A4"].s||[]).find(s=>+s.l==c);if(S)rel.unshift({mod:"E-A4",S,sc:9,tg:new Set()})}});
  rel.sort((a,b)=>(nom.includes(chOf(b))?1:0)-(nom.includes(chOf(a))?1:0));
  r.rel=rel.slice(0,10);r.mods=[...new Set(r.rel.map(x=>x.mod))];
  const el=[];nom.forEach(c=>CH[c].forEach(t=>{if(!el.includes(t))el.push(t)}));r.elem=el;r.anaCan=nom}catch(e){console.warn("analisis-canal",e)}
 return r}})();
/* 2. panel: elementos de la señal elegida */
(function(){const o=anaHTML;anaHTML=function(i,R,dentro){
 if(R&&dentro&&Array.isArray(R.rel)&&typeof gIMod!="undefined"){const sel=R.rel.find(x=>x.mod==gIMod&&x.S&&x.S.id==gISig);
  if(sel){const el=elemSig(sel);if(el.length){const R2=Object.assign({},R,{elem:el});let h=o(i,R2,dentro);
   const nm=`${sel.mod} ${sel.S.led?"IN "+sel.S.led:""} · ${sel.S.t}`;
   h=h.replace(/(<div class="anal">)(③ )?Elementos de campo a revisar(<\/div>)(<div class="anah">)[^<]*(<\/div>)/,(m,a,n,c,d,e)=>`${a}${n||""}Elementos de campo de la señal elegida${c}${d}Señal elegida: <b>${esc(nm)}</b>. Al cambiar de señal cambian los elementos y sus recorridos.${e}`);
   return h}}}
 return o(i,R,dentro)}})();
try{ANA_C={k:"",r:null}}catch(e){}
})();
