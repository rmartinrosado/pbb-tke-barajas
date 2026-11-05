/* ===== v342: CROQUIS ENTRE BORNEROS (origen → destino, conexión a conexión) =====
 En cada paso de la guía de campo (todos los sistemas) y en la lupa, cuando el texto cita borneros, mangueras o elementos
 interconectados (p. ej. «E-X55:3 → EH-W1 → H-X51:3», «C-X51 → EC-W1 → E-X53»):
  1) Recorrido: los borneros / cables en el orden del texto, con las bornas que cita.
  2) Conexiones borna a borna: cada conductor que une los borneros citados (columnas = borneros; filas = un circuito;
     líneas = el hilo o el conductor de la manguera, con su color), sacado del cableado del esquema (rev. J, o el plano propio
     de la 507) y de los regleteros de alimentación.
  3) Medición y lectura de cada fila: tensión esperada en cada borna (con la punta negra en el 0 V de la zona) y continuidad
     sin tensión entre las dos bornas de cada conductor.
 Si los datos cargados no tienen el detalle borna a borna de un tramo, se dice («ver folio») y no se inventa. ===== */
(function(){
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const TAGRX=/\+?\b([A-Z]{1,5}\d*-[A-Z]{1,3}\d+(?:\.\d+)?[A-Z]?)(?:\(([A-Z]+)\))?/g;
const nt=t=>String(t||"").replace(/^[+-]/,"").replace(/\([^)]*\)/,"").trim();
const esX=t=>/-X\d/.test(t),esW=t=>/-W\d/.test(t);
const COL={RD:"#d32f2f",BU:"#1e5bd8",BK:"#333",BN:"#8d5524",GY:"#8a8a8a",WH:"#bdbdbd",OG:"#ef6c00",VT:"#7b1fa2",YE:"#e0b400",GN:"#2e9e44",GNYE:"#2e9e44",PK:"#e91e63"};
const ZN={E:"Armario E",P:"Pupitre",CP:"Panel pupitre",C:"Cabina",C4:"Suelo cabina",IT:"Túnel A",MT:"Túnel B",ET:"Túnel C",H:"Elevación",CO:"Columna",CO3:"Columna",R:"Rotonda",T:"Bogie",CBTH:"CBTH",SS:"Escalera"};
const zona=t=>{const p=nt(t).split("-")[0];return ZN[p]||ZN[p.replace(/\d+$/,"")]||""};
/* ---------- grafo de conexiones ---------- */
let G=null,GK=null;
function cabTxt(v){if(!v)return {t:"",c:"",m:""};if(v.h!==undefined)return {t:"hilo "+(v.h||"s/n")+(v.c?" "+v.c:""),c:v.c||"",m:""};
 return {t:(v.m||"")+(v.d?" · "+v.d:""),c:/^[A-Z]{2,4}$/.test(v.d||"")?v.d:"",m:v.m||""}}
function build(){const C=window.CABLEADO||{};if(G&&GK===C)return G;GK=C;
 const L=[],seen=new Set(),VAL=new Map();
 const add=(a,b,v,f,sig)=>{if(!a||!b||!a.t||!b.t||a.p==null||b.p==null)return;if(nt(a.t)==nt(b.t)&&a.p==b.p)return;
  const cb=cabTxt(v);const k=[nt(a.t)+":"+a.p,nt(b.t)+":"+b.p].sort().join("|")+"|"+cb.t;if(seen.has(k))return;seen.add(k);
  L.push({a:{t:a.t,p:String(a.p)},b:{t:b.t,p:String(b.p)},cab:cb.t,col:cb.c,man:cb.m,f:f||"",sig:sig||""})};
 const pin=(n,lado)=>{if(!n)return null;if(n.k=="B"||n.k=="F"||n.k=="M")return n.p?{t:n.t||"",p:n.p}:null;
  if(n.k=="E"){const ps=n.ps||[];const p=lado=="in"?ps[0]:ps[ps.length>1?1:0];return p?{t:n.t,p}:null}return null};
 Object.keys(C).forEach(key=>{const e=C[key];const n=(e.n||[]).filter(x=>x.k!="-"&&x.k!="?");if(!n.length)return;
  const sig=(e.m||"")+(e.c?" "+e.c:"")+(e.d?" · "+e.d:"");
  n.forEach((x,i)=>{const v=(x.v||[])[0];if(!v)return;const a=i==0?(e.m&&e.m!="AUX"?{t:e.m,p:e.b}:null):pin(n[i-1],"out");add(a,pin(x,"in"),v,x.f||e.f,sig)})});
 (window.BOR_ST||[]).forEach(s=>{const m=/→\s*\+?([A-Z]{1,5}\d*-[A-Z]{1,3}\d+(?:\.\d+)?):(\d+)/.exec(s[4]||"");if(!m)return;
  const mv=/^([A-Z]+-W\d+(?:\.\d+)?)[^·]*·\s*(\S+)/.exec(s[3]||"");const v=mv?{m:mv[1],d:mv[2]}:{h:((s[2]||"").match(/hilo (\S+)/)||[])[1]||"",c:((s[2]||"").match(/hilo \S+ ([A-Z]{2,4})/)||[])[1]||""};
  add({t:s[0],p:s[1]},{t:"+"+m[1],p:m[2]},v,s[6],s[4]);if(s[5])VAL.set(nt(s[0])+":"+s[1],s[5])});
 /* tensiones esperadas: de las rutas de cada señal del análisis (RUTAS) */
 try{Object.keys(RUTAS).forEach(mod=>(RUTAS[mod].s||[]).forEach(S=>(S.p||[]).forEach(q=>{const t=String(q.nodo||q.p||"");let m;const rx=/\+?([A-Z]{1,5}\d*-[A-Z]{1,3}\d+(?:\.\d+)?)(?:\([A-Z]+\))?(?::(\d+)| borna (\S+))/g;
  while((m=rx.exec(t))){const k=nt(m[1])+":"+(m[2]||m[3]);if(!VAL.has(k)&&q.e)VAL.set(k,q.e)}})))}catch(e){}
 const ADJ=new Map();L.forEach((l,i)=>{[nt(l.a.t),nt(l.b.t)].forEach(t=>{if(!ADJ.has(t))ADJ.set(t,[]);ADJ.get(t).push(i)})});
 G={L,VAL,ADJ};return G}
/* ---------- lectura del texto del paso ---------- */
function refs(txt){txt=String(txt||"");const o=[],pins=new Map();let m;TAGRX.lastIndex=0;
 while((m=TAGRX.exec(txt))){const t=m[1];if(/^[EP]-Q30/.test(t)&&!esX(t))continue;if(!o.includes(t))o.push(t);
  const rest=txt.slice(TAGRX.lastIndex,TAGRX.lastIndex+40);let pm=/^\s*:\s*(\d+(?:\.\d+)?(?:\s*[-\/]\s*\d+(?:\.\d+)?)*)/.exec(rest)||/^\s*\((?:bornas?|cond\.?)\s+([\d ,y.\-\/]+)\)/.exec(rest)||/^\s*borna\s+(\d+(?:\.\d+)?)/.exec(rest);
  if(pm){const s=pins.get(t)||new Set();pm[1].split(/\s*(?:[-\/,]|\by\b)\s*/).filter(Boolean).forEach(x=>s.add(x.trim()));pins.set(t,s)}}
 const h=/\bhilos? (\d{2,4})\b/.exec(txt);return {o,pins,hilo:h?"hilo "+h[1]:""}}
/* ---------- conexiones entre los borneros citados ---------- */
function filas(R){const g=build();const set=new Set(R.o);const uso=[];
 const term=R.o.filter(t=>!esW(t));const W=new Set(R.o.filter(esW));
 g.L.forEach((l,i)=>{const A=nt(l.a.t),B=nt(l.b.t);if(!set.has(A)||!set.has(B))return;
  if(W.size&&l.man&&!W.has(l.man)&&R.o.some(t=>esW(t)))return; /* si el paso nombra mangueras, solo esas (los hilos de armario siempre) */
  const pa=R.pins.get(A),pb=R.pins.get(B);if((pa&&!pa.has(l.a.p))||(pb&&!pb.has(l.b.p)))return;uso.push(l)});
 /* v342: conexiones que da el propio texto de la guía (sacado de los planos): «E-X55:3 y :23 … EH-W1 … H-X51 (bornas 3 y 23)»
    → bornas emparejadas en orden entre dos borneros seguidos del recorrido con el mismo nº de bornas citadas */
 const seq=R.o.filter(t=>esX(t)||esW(t));
 for(let i=0;i<seq.length;i++){if(!esX(seq[i]))continue;let j=i+1,w="";while(j<seq.length&&esW(seq[j])){w=w||seq[j];j++}if(j>=seq.length||!esX(seq[j]))continue;
  const A=seq[i],B=seq[j],pa=[...(R.pins.get(A)||[])],pb=[...(R.pins.get(B)||[])];if(!pa.length||pa.length!=pb.length)continue;
  pa.forEach((x,k)=>{const y=pb[k];if(uso.some(l=>(nt(l.a.t)==A&&l.a.p==x&&nt(l.b.t)==B&&l.b.p==y)||(nt(l.a.t)==B&&l.a.p==y&&nt(l.b.t)==A&&l.b.p==x)))return;
   uso.push({a:{t:A,p:x},b:{t:B,p:y},cab:w?w+(R.hilo?" · "+R.hilo:""):(R.hilo||"conexión"),col:"",man:w,f:"",sig:"",txt:1})})}
 /* filas = circuitos (componentes conexos de bornas) */
 const par=new Map();const f=x=>{while(par.get(x)!==x){par.set(x,par.get(par.get(x)));x=par.get(x)}return x};
 const nodo=(t,p)=>nt(t)+":"+p;uso.forEach(l=>{[nodo(l.a.t,l.a.p),nodo(l.b.t,l.b.p)].forEach(k=>{if(!par.has(k))par.set(k,k)});par.set(f(nodo(l.a.t,l.a.p)),f(nodo(l.b.t,l.b.p)))});
 const comp=new Map();uso.forEach(l=>{const r=f(nodo(l.a.t,l.a.p));if(!comp.has(r))comp.set(r,[]);comp.get(r).push(l)});
 const cols=term.filter(t=>uso.some(l=>nt(l.a.t)==t||nt(l.b.t)==t));
 const rows=[...comp.values()].map(ls=>{const P=new Map();ls.forEach(l=>[l.a,l.b].forEach(z=>{const t=nt(z.t);if(!P.has(t))P.set(t,new Set());P.get(t).add(z.p)}));
  return {ls,P,sig:(ls.find(l=>l.sig)||{}).sig||""}});
 const nat=(a,b)=>String(a).localeCompare(String(b),"es",{numeric:true});
 rows.sort((a,b)=>{for(const c of cols){const x=[...(a.P.get(c)||[])][0],y=[...(b.P.get(c)||[])][0];if(x!=null&&y!=null)return nat(x,y);if(x!=null)return -1;if(y!=null)return 1}return 0});
 return {cols,rows:rows.slice(0,30),mas:Math.max(0,rows.length-30)}}
/* ---------- dibujo ---------- */
function svg(F){const n=F.cols.length;if(n<2||!F.rows.length)return "";
 const W=340,m=34,bw=30,bh=17,top=30;const X=i=>n==1?W/2:m+i*(W-2*m)/(n-1);
 let y=top,h="";const heads=F.cols.map((c,i)=>`<text x="${X(i)}" y="12" text-anchor="middle" class="cxh">${E(c)}</text><text x="${X(i)}" y="23" text-anchor="middle" class="cxz">${E(zona(c))}</text>`).join("");
 const rowsH=F.rows.map(r=>{const k=Math.max(1,...F.cols.map(c=>(r.P.get(c)||new Set()).size));const pos=new Map();
  F.cols.forEach((c,i)=>[...(r.P.get(c)||[])].forEach((p,j)=>pos.set(c+":"+p,{x:X(i),y:y+j*(bh+4)})));
  let s="";r.ls.forEach(l=>{const A=pos.get(nt(l.a.t)+":"+l.a.p),B=pos.get(nt(l.b.t)+":"+l.b.p);if(!A||!B)return;const L0=A.x<B.x?A:B,R0=A.x<B.x?B:A;
   const x1=L0.x+bw/2,x2=R0.x-bw/2,y1=L0.y+bh/2,y2=R0.y+bh/2;const c=COL[l.col]||"#9aa0a6";
   s+=`<path d="M${x1} ${y1} C${(x1+x2)/2} ${y1} ${(x1+x2)/2} ${y2} ${x2} ${y2}" stroke="${c}" stroke-width="2.4" fill="none"/>`;
   const lab=l.cab.replace(/^hilo /,"h.").replace(/ · /,"·");s+=`<text x="${(x1+x2)/2}" y="${Math.min(y1,y2)-2}" text-anchor="middle" class="cxl">${E(lab.length>16?lab.slice(0,15)+"…":lab)}</text>`});
  pos.forEach((q,k)=>{const p=k.split(":").pop();s+=`<rect x="${q.x-bw/2}" y="${q.y}" width="${bw}" height="${bh}" rx="3" class="cxb"/><text x="${q.x}" y="${q.y+12.5}" text-anchor="middle" class="cxp">${E(p)}</text>`});
  y+=k*(bh+4)+14;return s}).join("");
 const lines=F.cols.map((c,i)=>`<line x1="${X(i)}" y1="${top-3}" x2="${X(i)}" y2="${y-8}" class="cxr"/>`).join("");
 return `<svg class="cxsvg" viewBox="0 0 ${W} ${y}" role="img" aria-label="Croquis de conexiones entre ${E(F.cols.join(", "))}">${heads}${lines}${rowsH}</svg>`}
function medir(F){const g=build();const NEG={E:"+E-X68:2",P:"+P-X92:2",CP:"+P-X92:2",IT:"+IT-X51:2",ET:"+ET-X51:2",C:"+C-X51:2",H:"+H-X51:30",MT:"+MT-X51:2"};
 return F.rows.map((r,ix)=>{const it=[];const vista=new Set();
  r.ls.forEach(l=>[l.a,l.b].forEach(z=>{const k=nt(z.t)+":"+z.p;if(vista.has(k))return;vista.add(k);const v=l.txt?"":g.VAL.get(k); /* las del texto: la tensión la da el propio paso */
   if(v){const pre=nt(z.t).split("-")[0];const neg=NEG[pre]||NEG[pre.replace(/\d+$/,"")]||"el 0 V de la zona";
    it.push(/^0 ?V\s*(\(|$)/.test(v)?`Tensión en <b>${E(k)}</b>: roja en el +24 V de la zona y negra en <b>${E(k)}</b> → debe marcar <b>≈24 V</b> (retorno 0 V bien).`:`Tensión en <b>${E(k)}</b>: polímetro en V, roja en <b>${E(k)}</b>, negra en <b>${E(neg)}</b> → debe marcar <b>${E(v)}</b>.`)}}));
  r.ls.forEach(l=>it.push(`Continuidad SIN TENSIÓN (Ω): <b>${E(nt(l.a.t)+":"+l.a.p)}</b> ↔ <b>${E(nt(l.b.t)+":"+l.b.p)}</b> por ${E(l.cab||"conexión directa")} → debe marcar <b>≈0 Ω</b>. Abierto (OL) = conductor cortado o borna floja.`));
  const fol=[...new Set(r.ls.map(l=>l.f).filter(Boolean))].join(", ");
  return `<details class="lbm cxm"${ix<3?" open":""}><summary><span class="imt">Medir</span> <b>Circuito ${ix+1}</b>${r.ls.some(l=>l.txt)?" · según el texto de la guía":""}${r.sig?` · ${E(r.sig.length>60?r.sig.slice(0,59)+"…":r.sig)}`:""}</summary><ol>${it.map(x=>"<li>"+x+"</li>").join("")}</ol>${fol?`<div class="lbsg">Folio ${E(fol)}</div>`:""}</details>`}).join("")}
/* recorrido en el orden del texto (siempre, aunque falten datos borna a borna) */
function recorrido(R){const L=R.o.filter(t=>esX(t)||esW(t)||/-[A-Z]{1,2}\d/.test(t));if(L.length<2)return "";
 return `<div class="cxrec">${L.map(t=>{const p=R.pins.get(t);return esW(t)?`<span class="cxw">〰 ${E(t)}</span>`:`<span class="cxt"><b>${E(t)}</b>${p?`<i>:${E([...p].join("·"))}</i>`:""}${zona(t)?`<small>${E(zona(t))}</small>`:""}</span>`}).join('<span class="cxa">→</span>')}</div>`}
window.croquisPaso=function(txt,fol){const R=refs(txt);const nX=R.o.filter(esX).length,nW=R.o.filter(esW).length;if(nX+nW<2&&!(nX>=1&&R.o.length>=2))return null;
 let F={cols:[],rows:[]};try{F=filas(R)}catch(e){}
 const faltan=R.o.filter(esX).filter(t=>!F.cols.includes(t));
 const body=`${recorrido(R)}${F.rows.length?svg(F)+(F.mas?`<div class="lbsg">+${F.mas} circuito(s) más</div>`:"")+`<div class="cxmed">${medir(F)}</div>`:""}
  ${faltan.length?`<div class="cxno">${F.rows.length?"Sin":"Los datos cargados no tienen"} el detalle borna a borna de <b>${E(faltan.join(", "))}</b>${fol?` · ver folio ${E(fol)}`:" · ver plano"}. No se dibujan conexiones que no estén en el esquema.</div>`:""}`;
 return {n:F.rows.length,html:body,cols:F.cols}};
/* ---------- guía de campo: todos los sistemas ---------- */
function pasos(){document.querySelectorAll("#app details.gd .gst > label.gpaso > span:not([data-cx])").forEach(sp=>{sp.dataset.cx="1";
 const txt=(sp.firstChild&&sp.firstChild.nodeType==3?sp.firstChild.textContent:"")||[...sp.childNodes].filter(n=>!(n.nodeType==1&&n.tagName=="DETAILS")).map(n=>n.textContent).join(" ");
 const gd=sp.closest("details.gd");const fol=gd?((gd.textContent.match(/folios? (\d+(?:\s*[-–]\s*\d+)?)/i)||[])[1]||""):"";
 const C=croquisPaso(txt,fol);if(!C)return;const d=document.createElement("details");d.className="elusd cxd";
 d.innerHTML=`<summary onclick="event.preventDefault();event.stopPropagation();this.parentNode.open=!this.parentNode.open">🔌 Croquis entre borneros${C.n?` · ${C.n} conexión${C.n>1?"es":""} borna a borna`:" · recorrido"}</summary><div class="cxin">${C.html}</div>`;
 d.addEventListener("click",e=>{if(e.target.closest("summary"))return;e.stopPropagation();e.preventDefault()});sp.appendChild(d)})}
new MutationObserver(()=>{try{pasos()}catch(e){}}).observe(document.body,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
.cxin{margin-top:6px;padding:8px;border:1px solid var(--bd,#d9d2e3);border-radius:10px;background:var(--card)}
.cxsvg{width:100%;height:auto;display:block;margin:6px 0}
.cxsvg .cxh{font:700 10px ui-monospace,Menlo,monospace;fill:currentColor}.cxsvg .cxz{font:9px system-ui;fill:currentColor;opacity:.6}
.cxsvg .cxp{font:700 10px ui-monospace,Menlo,monospace;fill:#111}.cxsvg .cxl{font:8px system-ui;fill:currentColor;opacity:.85}
.cxsvg .cxb{fill:#fff;stroke:#6d7680;stroke-width:1}.cxsvg .cxr{stroke:#9aa3ad;stroke-width:9;stroke-linecap:round;opacity:.35}
.cxrec{display:flex;flex-wrap:wrap;align-items:center;gap:4px;font-size:11.5px}
.cxt{display:inline-flex;flex-direction:column;align-items:center;border:1px solid #6d7680;border-radius:5px;padding:2px 5px;background:color-mix(in srgb,#9aa3ad 14%,transparent);line-height:1.15}
.cxt i{font-style:normal;font-family:ui-monospace,Menlo,monospace;font-size:10.5px}.cxt small{font-size:9px;opacity:.65}
.cxw{font-size:11px;color:#ef6c00;font-weight:600}.cxa{opacity:.6}
.cxno{font-size:11.5px;margin-top:6px;padding:5px 7px;border-left:3px solid #9aa3ad;opacity:.9}
.cxmed{display:flex;flex-direction:column;gap:6px;margin-top:4px}
.cxm{padding:5px 7px;border-left:3px solid #f0a020;border-radius:0 6px 6px 0;background:color-mix(in srgb,#f0a020 12%,transparent);font-size:12.5px;line-height:1.35}
.cxm summary{cursor:pointer}.cxm .imt{font-weight:800;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:#f0a020}
.cxm ol{margin:4px 0 0;padding-left:16px}.cxm li::marker{color:#f0a020;font-weight:700}`;document.head.appendChild(st);
})();
