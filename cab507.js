/* v325: inspección cable a cable de la PBB 507 con su propio cableado (cableado507.js, trazado borna a borna del esquema
 T87911031230ES). En una OT de la 507 las rutas de cada canal del PLC se construyen con ese cableado en lugar de adaptar
 las de la rev. J. Los folios se guardan en negativo (= folio propio del plano 507, sin la equivalencia de la rev. J) y se
 muestran en positivo. Los canales que en la 507 solo llegan a una borna de continuación (otro folio aún sin trazar)
 siguen con la ruta adaptada desde la rev. J. */
(function(){
"use strict";
if(!window.CABLEADO507||typeof ppTransforma!="function"||typeof cabSeq!="function")return;
const neg=o=>{if(Array.isArray(o))return o.map(neg);if(o&&typeof o=="object"){const r={};for(const k in o)r[k]=k==="f"&&typeof o[k]=="number"?-Math.abs(o[k]):neg(o[k]);return r}return o};
const C507=neg(window.CABLEADO507),NOT507={};
/* las notas («?») van aparte: dentro del recorrido desplazarían los hilos un nodo al invertirlo */
Object.keys(C507).forEach(k=>{const e=C507[k];NOT507[k]=(e.n||[]).filter(x=>x.k=="?").map(x=>x.x);e.n=(e.n||[]).filter(x=>x.k!="?")});
const cap=s=>{s=String(s||"").split(" ").map(w=>/\d|^[A-ZÑ]{1,3}$|^[A-Z]-|\.[A-Z]/.test(w)?w:w.toLowerCase()).join(" ");return s.charAt(0).toUpperCase()+s.slice(1)};
window.C507N=C507;
function rutas507(base){const CJ=window.CABLEADO;window.CABLEADO=C507;CABIDX=null;let n=0;const hechos=new Set();
 try{Object.keys(base).forEach(id=>{const M=PLC.find(x=>x.id==id);if(!M)return;
  base[id].s.forEach(S=>{const sub=M.m[S.k-1];if(!sub)return;const L=sub[S.l-1];if(!L)return;
   let C=null;try{C=cabSeq(id,M,S.k,S.l)}catch(e){}
   if(!C){let b=typeof pBorna=="function"?pBorna(M,S.k,S.l):null;let k=b&&Object.keys(window.CABLEADO507).find(x=>x.startsWith(id+"|"+b.in+"|"));
    if(!b&&(M.t=="DO"||M.t=="SDO")){const code=(M.t=="SDO"?"DOS":"DON")+String((S.k-1)*M.m[0].length+S.l).padStart(2,"0");k=Object.keys(window.CABLEADO507).find(x=>x.startsWith(id+"|")&&window.CABLEADO507[x].c==code);if(k)b={in:window.CABLEADO507[k].b}}
    const r=k&&window.CABLEADO507[k];
    if(r&&!(r.n||[]).some(x=>x.k!="?")){S.p=[{p:`${id} borna ${b.in} (${r.c||"canal"})`,e:"Sin señal (sin cablear en la PBB 507)",x:"En el esquema 507 esta borna no está cableada ("+r.d.toLowerCase()+"): no debe tener tensión ni el LED encendido. Si lo está, hay un cable que no figura en el plano.",f:-r.f,s507:1}];
     S.t=cap(r.d)+" (PBB 507)";S.det=true;S.traz=true;S.fol=String(r.f);S.t507=1;S.r=`En el esquema propio de la PBB 507 (folio ${r.f}) este canal no está cableado (${r.d.toLowerCase()}).`;hechos.add(id+"|"+S.id);n++}
    return}
   let pts=null;try{pts=cabPuntos(id,M,C,L[1])}catch(e){}if(!pts||pts.length<2)return;
   pts.forEach(q=>{q.s507=1});
   const e=C.e||{};const nt=NOT507[e.m+"|"+e.b+"|"+Math.abs(e.f)]||[];
   if(nt.length)pts[pts.length-1].x=String(pts[pts.length-1].x||"")+" Nota del plano 507: "+nt.join(" ");
   const fol=[...new Set(pts.map(q=>Math.abs(q.f)))].join(", ");
   S.p=pts;S.det=true;S.traz=true;S.fol=fol;S.t507=1;if(e.d)S.t=cap(e.d)+" (PBB 507)";
   S.r=`${String(S.r||"").split(". Ruta")[0].split(". Los")[0].replace(/^⚠[^.]*\.\s*/,"")}. Ruta trazada borna a borna en el esquema propio de la PBB 507 T87911031230ES (folios ${fol}): bornas, nº de hilo, sección, color y mangueras del plano 507.`;
   hechos.add(id+"|"+S.id);n++})})}
 finally{window.CABLEADO=CJ;CABIDX=null}
 return {n,hechos}}
const o=ppTransforma;
ppTransforma=function(pos,F){const T=o.apply(this,arguments);if(String(pos)!=="507")return T;
 try{const base=JSON.parse(ppBase().r),R=JSON.parse(T.rutas);const r=rutas507(base);
  Object.keys(R).forEach(id=>(R[id].s||[]).forEach((S,j)=>{if(r.hechos.has(id+"|"+S.id)){const B=base[id].s.find(x=>x.id==S.id);if(B)R[id].s[j]=B}}));
  T.rutas=JSON.stringify(R);T.st=Object.assign({},T.st,{c507:r.n})}catch(e){console.warn("cab507",e)}
 return T};
/* sin plano 507 legible (sin conexión o sin subir): las rutas trazadas de la 507 se aplican igualmente */
if(typeof ppAplica=="function"){const oa=ppAplica;ppAplica=function(pos){oa.apply(this,arguments);try{if(String(pos)!=="507")return;const C=PPCACHE[pos];if(C&&C.ok)return;
  const base=JSON.parse(ppBase().r);const r=rutas507(base);Object.keys(RUTAS).forEach(id=>(RUTAS[id].s||[]).forEach((S,j)=>{if(r.hechos.has(id+"|"+S.id)){const B=base[id].s.find(x=>x.id==S.id);if(B)RUTAS[id].s[j]=B}}))}catch(e){console.warn("cab507",e)}}}
/* aviso en el banner del plano propio */
if(typeof ppBanner=="function"){const ob=ppBanner;ppBanner=function(pos){ob.apply(this,arguments);try{const C=PPCACHE[pos];if(String(pos)!=="507"||!C||!C.ok||!C.st||!C.st.c507)return;
  const b=document.querySelector("#ppban .ppk");if(b&&!b.querySelector(".c507"))b.insertAdjacentHTML("beforeend",`<br><small class="c507">${C.st.c507} canales del PLC con la ruta trazada borna a borna del esquema 507 (hilos y bornas propios de la 507).</small>`)}catch(e){}}}
})();
