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
 try{const t=nrm([i.desc||i.def,i.com,i.obs].filter(Boolean).join(" "));if(!RE_AN.test(t))return r;/* la descripción actual manda sobre la definición original */
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
 if(R&&Array.isArray(R.rel)&&R.rel.length&&typeof gIMod!="undefined"){let sel=dentro?R.rel.find(x=>x.mod==gIMod&&x.S&&x.S.id==gISig):null;const porDef=!sel;if(!sel)sel=R.rel[0];/* v418: por defecto, la señal más relacionada con la avería */
  if(sel){const el=elemSig(sel);if(el.length){const R2=Object.assign({},R,{elem:el});let h=o(i,R2,dentro);
   const nm=`${sel.mod} ${sel.S.led?"IN "+sel.S.led:""} · ${sel.S.t}`;
   h=h.replace(/(<div class="anal">)(③ )?Elementos de campo a revisar(<\/div>)(<div class="anah">)[^<]*(<\/div>)/,(m,a,n,c,d,e)=>`${a}${n||""}Elementos de campo de la señal elegida${c}${d}Señal elegida: <b>${esc(nm)}</b>. Al cambiar de señal cambian los elementos y sus recorridos.${e}`);
   if(porDef){const v=sel.mod+"¦"+sel.S.id;h=h.replace(`<option value="${esc(v)}">`,`<option value="${esc(v)}" selected>`);
    if(!dentro)h=h.replace(/(<select class="anasel"[\s\S]*?<\/select>)/,`$1<button class="sec anaver" onclick="anaSelSig(this.previousElementSibling.value)">📏 Ver la ruta cable a cable de esta señal</button>`)}
   return h}}}
 return o(i,R,dentro)}})();
/* 3. v418: en la guía de una OT de medida analógica solo se ven los pasos y filas de SU canal */
function chans(t){t=nrm(t);const c=new Set();
 if(/altura|ultrason|c-b14|ain0?1\b|p-w20|ep-w8|e-x62:3/.test(t))c.add(1);
 if(/extensi|longitud|\blaser|et-b9|e-w13|ain0?2\b|e-x62:4/.test(t))c.add(2);
 if(/cabina|c-r10|e-r10|e-x65|e-w9\b|ain0?3\b/.test(t))c.add(3);
 if(/rotonda|r-r1\b|it-x62|eit-w4|it-w16|ain0?4\b|e-x62:[58]|encoder|r-r10/.test(t))c.add(4);
 if(/e-x62(?!\d|:\d)/.test(t)){c.add(1);c.add(2);c.add(4)}return c}
const cruza=(c,nom)=>[...c].some(x=>nom.includes(x));
function nomOT(){try{if(typeof gOT=="undefined"||!gOT||typeof inc=="undefined")return null;const i=inc.find(x=>x.id==gOT);if(!i||(i.tipo&&i.tipo!="PAS"))return null;
 const t=nrm([i.desc||i.def,i.com,i.obs].filter(Boolean).join(" "));if(!RE_AN.test(t))return null;const n=canales(t);return n.length?{n,i}:null}catch(e){return null}}
let verTodo=false;window.anaCanTodo=v=>{verTodo=v;filtra(true)};
const asunto=t=>{const k=t.search(/:\s/);return k>0&&k<110?t.slice(0,k):t.slice(0,90)};
function filtra(forzar){const N=nomOT();
 document.querySelectorAll("#app details.gd").forEach(d=>{const sm=d.querySelector(":scope>summary");if(!sm||!/Medidas anal/i.test(sm.textContent))return;
  const key=N?N.i.id+"|"+N.n.join(",")+"|"+verTodo:"";if(!forzar&&d.dataset.canf===key&&d.querySelector(".acnav"))return;d.dataset.canf=key;
  const labs=[...d.querySelectorAll(".gst>label.gpaso")];
  labs.forEach(l=>{l.style.display="";l.querySelectorAll(".bcol>[data-canh]").forEach(e=>{e.style.display="";delete e.dataset.canh})});
  let av=d.querySelector(".acnav");if(!N){if(av)av.remove();renum(labs);return}
  if(!av){av=document.createElement("div");av.className="acnav";const g=d.querySelector(".gst");if(g)g.before(av)}
  const nm=N.n.map(c=>NOMC[c]).join(" y ");
  av.innerHTML=verTodo?`Se ven todos los canales. <button class="sec" onclick="event.preventDefault();event.stopPropagation();anaCanTodo(false)">Ver solo ${esc(nm)}</button>`:
   `Solo lo de esta OT: <b>${esc(nm)}</b> (canal${N.n.length>1?"es":""} ${N.n.map(c=>"AIN0"+c).join(", ")}). <button class="sec" onclick="event.preventDefault();event.stopPropagation();anaCanTodo(true)">Ver todos</button>`;
  if(verTodo){renum(labs);return}
  labs.forEach(l=>{const sp=l.querySelector(":scope>span");if(!sp)return;const ld=sp.querySelector(":scope>.bcl");const t=ld?ld.textContent:sp.textContent;const ca=chans(ld?t:asunto(t));
   if(ca.size==1&&!cruza(ca,N.n)||ca.size>1&&ca.size<4&&!cruza(ca,N.n)){l.style.display="none";return}
   sp.querySelectorAll(".bcol").forEach(g=>{const cs=[...g.children];for(let k=0;k<cs.length;){const a=cs[k];
     if(a.classList.contains("bck")&&cs[k+1]){const b=cs[k+1];const c=chans(a.textContent+" "+b.textContent);if(c.size&&!cruza(c,N.n)){[a,b].forEach(e=>{e.style.display="none";e.dataset.canh=1})}k+=2}
     else{const c=chans(a.textContent);if(c.size&&!cruza(c,N.n)){a.style.display="none";a.dataset.canh=1}k++}}})});
  renum(labs)})}
function renum(labs){let n=0;labs.forEach(l=>{if(l.style.display=="none")return;const b=[...l.querySelectorAll(":scope>span b")].find(x=>/^\d+\.$/.test(x.textContent.trim()));if(b)b.textContent=(++n)+"."})}
(function(){const st=document.createElement("style");st.textContent=`.acnav{margin:6px 0 8px;padding:7px 10px;border-radius:8px;font-size:13px;background:color-mix(in srgb,#ef6c00 10%,transparent);border:1px solid color-mix(in srgb,#ef6c00 45%,transparent)}.acnav button{width:auto;margin:0 0 0 6px;padding:4px 10px;font-size:12px}.anaver{width:100%;margin-top:6px}`;document.head.appendChild(st)})();
window.anaCanFiltra=filtra;let tf=0;const app=document.getElementById("app");
if(app)new MutationObserver(()=>{if(tf)return;tf=setTimeout(()=>{tf=0;try{filtra(false)}catch(e){}},150)}).observe(app,{childList:true,subtree:true});
try{ANA_C={k:"",r:null}}catch(e){}
})();
