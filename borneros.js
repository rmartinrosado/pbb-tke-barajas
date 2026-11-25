/* v310: pestaña «Borneros y mangueras» del simulador de tensiones.
 Índice, construido a partir de window.CABLEADO (+ cableado-revj.js) y de los regleteros de alimentación de los folios
 9, 13, 17, 18, 29, 34, 36-40 y 48, de cada borna de cada regletero (qué hilo llega, qué manguera y conductor sale, hacia
 dónde, de qué circuito forma parte y qué tensión debe dar) y de cada manguera (conductor a conductor, de borna a borna). */
(function(){
"use strict";
const C=window.CABLEADO||{};
const ZONA={CBTH:["CBTH","Armario CBTH de la posición (alimentación BT / SAI)"],E:["AE","Armario eléctrico E de la PBB"],P:["Pupitre","Armario del pupitre de mando (cabina)"],
 CP:["Pupitre","Panel del pupitre (pulsadores, setas, pilotos)"],C:["Cabina","Cabina de la PBB"],IT:["Túnel A","Túnel interior A"],MT:["Túnel B","Túnel medio B"],ET:["Túnel C","Túnel exterior C"],
 CO:["Columna","Columna / rotonda"],CO3:["Columna","Columna / rotonda"],H:["Elevación","Columna / grupo de elevación"],T:["Bogie","Tren de rodaje"],R:["Rotonda","Rotonda (unión con el edificio)"],
 SS:["Escalera","Escalera de servicio"],C4:["Cabina","Suelo de cabina"],F:["Campo","Elemento de campo"]};
const zonaDe=t=>{const m=String(t||"").match(/^[+-]?([A-Z]+\d*)-/);if(!m)return "F";const z=m[1];return ZONA[z]?z:ZONA[z.replace(/\d+$/,"")]?z.replace(/\d+$/,""):"F"};
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const cond=v=>v?(v.h?("hilo "+v.h+(v.c?" "+v.c:"")):v.m?(v.m+(v.d?" cond. "+v.d:"")):""):"";
const lab=n=>!n?"":n.k==="B"?(n.t+":"+n.p):n.k==="E"?(n.t+" "+(n.ps||[]).join("-")):n.k==="C"?("común "+n.w):n.k==="M"?("módulo "+(n.t||"")+" "+(n.l||"")):n.k==="P"?n.t:n.k==="F"?(n.t+":"+n.p):n.k==="J"?"ramas en paralelo":"";

/* regleteros de alimentación y fuerza (no salen en las cadenas de E/S) */
const ST=(window.BOR_ST||[]).slice(); /* v342: datos en borneros-st.js */
/* v325: en la PBB 507 (Check con ?pbb=507) los regleteros de alimentación son los del esquema 507 */
if(window.ES507){ST.length=0;ST.push(
 ["+E-X68","1","hilo 218 RD","—","+24 V E/S armario E: común de entradas y regleteros de campo (E-X51:1, E-X54:1, E-X55, H-X51:1, IT-X51:1, ET-X51:1)","24 V",58],
 ["+E-X68","2","hilo 129 WH","—","0 V armario E (retorno de bobinas, sensores, GND de módulos)","0 V",58],
 ["+E-X68","4","hilo 568 RD","—","+24 V de seguridades: módulo E-A5 (UM 1.2 / US 2.1), sensores C-S9 y SS-B15","24 V",56],
 ["+E-X68","6","hilo 626 RD","ESS-W20 · BK","Inductivo puerta de servicio SS-B15 → E-A10 4.1","24 V",93],
 ["+E-X68","7","hilo 625 WH","ESS-W20 · BU","−UB del SS-B15 → GND 4.3 de E-A10","0 V",93],
 ["+P-X92","1","hilo 184 RD","—","+24 V del pupitre: P-A0, pulsadores (P-X53/P-X56/P-X57/P-X59), sensores de cabina","24 V",58],
 ["+P-X92","2","hilo 129 WH","—","0 V del pupitre","0 V",58],
 ["+H-X51","1","hilo 218 RD","EH-W1 · 1","+24 V a la elevación (sensores H-B1…H-B6, setas, frenos)","24 V",84],
 ["+H-X51","2","hilo 129 WH","EH-W1 · 2","0 V a la elevación","0 V",84],
 ["+IT-X51","1","hilo 218 RD","EIT-W1 · 1","+24 V al túnel / rotonda (CO-B1, CO-B2, IT-B10, TF-S1/S2)","24 V",81],
 ["+IT-X51","2","hilo 129 WH","EIT-W1 · 2","0 V al túnel / rotonda","0 V",81],
 ["+ET-X51","1","hilo 218 RD","EET-W1 · 1","+24 V al túnel exterior (ET-B6, ET-B7)","24 V",81],
 ["+ET-X51","2","hilo 129 WH","EET-W1 · 2","0 V al túnel exterior","0 V",81])}

let IDX=null,MAN=null;
/* folio compacto en la columna de la etiqueta (no ocupa línea en el texto) */
const FOLc=f=>'<button class="fl flc" data-fol="'+f+'" title="Ver folio '+f+' en el plano">f.'+f+' '+ICL+'</button>';
/* entradas de retorno (UT / GND) sin descripción propia: se nombran por el canal principal del mismo grupo */
function dsc(e){if(e.d&&!/^n\. ?c\.?$/i.test(e.d.trim())&&e.c)return e.d;const g=e.b.split(".")[0];const p=C[e.m+"|"+g+".1|"+e.f];
 const tipo=/GND|^0/.test(e.k||"")?"retorno 0 V (GND)":/^UT/.test(e.k||"")?"salida de test "+e.k:(e.k||"retorno");
 return p&&p!==e?tipo+" de "+(p.c||"")+" "+p.d:(e.d||tipo)}
function build(){
 IDX={};MAN={};
 const vOf=(key)=>{try{const r=simulate(C[key]);const m={};r.rows.forEach(x=>{m[x.t]=x.txt||(x.v>0?"24 V":"0 V")});return m}catch(e){return {}}};
 Object.keys(C).forEach(key=>{const e=C[key];const n=(e.n||[]).filter(x=>x.k!=="?");if(!n.length)return;
  const vm=(!e.c||/^(UT|GND|0)/.test(e.k||""))?{}:vOf(key);
  n.forEach((x,i)=>{
   (x.v||[]).forEach(v=>{if(!v.m)return;const a=i===0?{t:e.m,p:e.b}:n[i-1];if(i===0&&e.m==="AUX")return;const M=(MAN[v.m]=MAN[v.m]||{t:v.t||"",c:{}});if(v.t&&!M.t)M.t=v.t;
     const cc=(M.c[v.d||"?"]=M.c[v.d||"?"]||[]);const row={a:i===0?("PLC "+e.m+" "+e.b):lab(a),b:lab(x),key,d:e.d};if(!cc.some(z=>(z.a===row.a&&z.b===row.b)||(z.a===row.b&&z.b===row.a)))cc.push(row)});
   if(x.k!=="B")return;
   const S=(IDX[x.t]=IDX[x.t]||{}),R=(S[x.p]=S[x.p]||[]);
   const prev=i===0?(e.m==="AUX"?"":("PLC "+e.m+" "+e.b)):lab(n[i-1]),next=n[i+1]?lab(n[i+1]):"";
   R.push({key,m:e.m,b:e.b,d:dsc(e),f:x.f||e.f,pf:i===0?e.f:(n[i-1].f||e.f),nf:n[i+1]?(n[i+1].f||e.f):0,t:x.t,p:x.p,inV:(x.v||[]).map(cond).join(" + "),outV:n[i+1]?(n[i+1].v||[]).map(cond).join(" + "):"",prev,next,vt:vm[x.t+":"+x.p]||""});
   {const q=R[R.length-1];if((window.ES507?/(^|\D)129(\D|$)/:/(^|\D)205(\D|$)/).test(q.inV+' '+q.outV)&&q.vt&&!/^0/.test(q.vt))q.vt='0 V';}
  })});
 ST.forEach(s=>{const S=(IDX[s[0]]=IDX[s[0]]||{}),R=(S[s[1]]=S[s[1]]||[]);R.unshift({key:"",d:s[4],f:s[6],pf:s[6],nf:s[6],t:s[0],p:s[1],inV:s[2],outV:s[3],prev:"",next:"",vt:s[5],st:1})});
 notasBornas();
}
/* v552: REVISIÓN DE TODOS LOS BORNEROS. Las bornas que el esquema solo cita en las notas de un circuito
   (p. ej. «el sensor se alimenta por E-X62:1 (+24 V, 189) y E-X62:2 (0 V, 205)») o en la descripción de otra borna
   (p. ej. «PE → +E-X11:1») no tenían recorrido propio y salían como «sin datos». Ahora se añaden a su bornero
   con lo que dice el esquema, el folio, el hilo y la tensión que debe dar. */
function notasBornas(){
 const RX=/(?<![A-Za-z0-9])\+?([A-Z][A-Z0-9]{0,5}-X\d+(?:\.\d+)?):(\d+)/g, fuentes=[];
 Object.keys(C).forEach(k=>{const e=C[k];(e.n||[]).forEach(x=>{if(x.k==="?"&&x.x)fuentes.push({t:x.x,f:e.f,o:e.m+" "+e.b+" · "+(e.d||"")})})});
 ST.forEach(r=>fuentes.push({t:r[2]+" | "+r[3]+" | "+r[4],f:r[6],o:r[0]+":"+r[1]+" · "+r[4],st:r}));
 const ten=(w)=>/4-20 ?mA/.test(w)?"4-20 mA":/\bFE\b/.test(w)?"0 V (FE)":/(−UB|\b0 V\b|\bGND\b|L−|\bPE\b|GNYE)|(^|\D)(205|129)(\D|$)/.test(w)?"0 V":/(\+UB|\+24 ?V|L\+)|(^|\D)(613|189|184|218|215|182|568)(\D|$)/.test(w)?"24 V":/230 ?V|SAI/.test(w)?"230 V":/400 ?V/.test(w)?"400 V":"";
 /* la indicación de tensión más cercana (la última antes de la borna) */
 const tenUlt=(w)=>{const K=[[/4-20 ?mA/g,"4-20 mA"],[/\bFE\b/g,"0 V (FE)"],[/−UB|\b0 V\b|\bGND\b|L−|\bPE\b|GNYE|pantalla|(?<!\d)(?:205|129)(?!\d)/gi,"0 V"],[/\+UB|\+24 ?V|L\+|(?<!\d)(?:613|189|184|218|215|182|568)(?!\d)/g,"24 V"],[/230 ?V|SAI/g,"230 V"],[/400 ?V/g,"400 V"]];
  if(/\bPE\b|GNYE/.test(w))return "0 V (PE)";let best=-1,v="";K.forEach(([r,t])=>{let m;r.lastIndex=0;while((m=r.exec(w)))if(m.index>=best){best=m.index;v=t}});return v};
 const ultHilo=(w)=>{const r=/hilo\s+(\d{2,4})/gi;let m,u="";while((m=r.exec(w)))u="hilo "+m[1];if(!u){const q=/(?:^|[\s(])(\d{3})\s*\($/.exec(w);if(q)u="hilo "+q[1]}return u};
 /* tramo de la frase que va con la borna: desde el último «,» «;» o « y » (fuera de paréntesis cerrados) hasta la borna */
 const tramo=(t,i)=>{let d=0,j=i-1;for(;j>=0&&i-j<120;j--){const c=t[j];if(c===")")d++;else if(c==="("){if(d)d--;}else if(!d&&(c===","||c===";"||c==="."||(t.slice(j-2,j+1)===" y ")))break}return t.slice(j+1,i)};
 const frase=(t,i)=>{const a=t.lastIndexOf(". ",i),b=t.indexOf(". ",i);let f=t.slice(a<0?0:a+2,b<0?t.length:b+1).trim();if(f.length>220){const c=Math.max(0,i-(a<0?0:a+2)-90);f=(c?"…":"")+f.slice(c,c+200).trim()+"…"}return f};
 const vistos={};
 fuentes.forEach(F=>{let m;RX.lastIndex=0;while((m=RX.exec(F.t))){const t="+"+m[1],p=m[2],S=IDX[t];if(S&&S[p]&&S[p].length)continue;
  const k=t+":"+p;const w=F.t.slice(Math.max(0,m.index-28),m.index+m[0].length+28);const antes=tramo(F.t,m.index);let desp=F.t.slice(m.index+m[0].length,m.index+m[0].length+26);desp=desp.split(/[,;)→]| y /)[0];const prev=F.t.slice(Math.max(0,m.index-90),m.index);
  if(vistos[k]){vistos[k].de.add(F.o);continue}
  const q={key:"",d:frase(F.t,m.index),f:F.f,pf:F.f,nf:F.f,t,p,inV:ultHilo(antes)||ultHilo(desp),outV:"",prev:"",next:"",vt:tenUlt(antes)||ten(desp)||tenUlt(prev),st:1,nota:1,de:new Set([F.o])};
  if(/FE|PE/.test(q.vt))q.inV="";vistos[k]=q;const SS=(IDX[t]=IDX[t]||{});(SS[p]=SS[p]||[]).push(q)}});
 Object.values(vistos).forEach(q=>{q.d="Según el esquema: "+q.d+"  (citada en "+[...q.de].slice(0,3).join(" · ")+(q.de.size>3?" …":"")+")";delete q.de});
 window.BOR_NOTAS=Object.entries(vistos).map(([k,q])=>({k,vt:q.vt,h:q.inV,d:q.d}));
}
/* dónde poner las puntas del polímetro y qué debe marcar */
const REF0={E:"+E-X68:2 (0 V, hilo 205)",P:"+P-X92:2 (0 V, hilo 205)",CP:"+P-X92:2 (0 V, hilo 205)",IT:"+IT-X51:2 (0 V, hilo 205 · campo 263)",ET:"+ET-X51:2 (0 V, hilo 205)",C:"+C-X51:2 (0 V, hilo 205)",
 C4:"+C4-X64:2 (0 V, hilo 205)",H:"+H-X51:30 (0 V, hilo 205)",CO:"+IT-X51:2 (0 V, hilo 205 · campo 263)",CO3:"+IT-X51:2 (0 V, hilo 205 · campo 263)",R:"+IT-X50:2 (0 V, hilo 205)",CBTH:"+E-X61:21 (0 V PBB, hilo 205)",SS:"+E-X68:2 (0 V, hilo 205)",T:"+E-X68:2 (0 V, hilo 205)",F:"+E-X68:2 (0 V, hilo 205)"};
const REF24={E:"+E-X68:1 (+24 V, hilo 189)",P:"+P-X92:1 (+24 V, hilo 332)",CP:"+P-X92:1 (+24 V, hilo 332)",IT:"+IT-X51:1 (+24 V, hilo 189 · campo 261)",ET:"+ET-X51:1 (+24 V, hilo 189)",C:"+C-X51:1 (+24 V, hilo 189)",
 C4:"+C4-X64:1 (+24 V, hilo 336)",H:"+H-X51:1 (+24 V, hilo 189)",CO:"+CO3-X51:1 (+24 V, hilo 189)",CO3:"+CO3-X51:1 (+24 V, hilo 189)",R:"+IT-X50:1 (+24 V, hilo 613)",CBTH:"+E-X61:10 (+24 V, hilo 189)",SS:"+E-X68:1 (+24 V, hilo 189)",T:"+E-X68:1 (+24 V, hilo 189)",F:"+E-X68:1 (+24 V, hilo 189)"};
if(window.ES507){const J5=s=>s.replace(/ · campo \d+/g,"").replace(/hilo 205/,"hilo 129").replace(/hilo 189/,"hilo 218").replace(/hilo 332/,"hilo 184").replace(/hilo 613/,"hilo 568").replace("+H-X51:30","+H-X51:2");[REF0,REF24].forEach(o=>Object.keys(o).forEach(z=>{o[z]=J5(o[z])}))}
const PAR={"+CBTH-X11":"1-2-3","+E-X60":"1-2-3 / 4-5-6","+P-X52":"1-2-3 / 4-5-6"};
const NEU={"+CBTH-X12:1":"+CBTH-X12:2","+E-X66:1":"+E-X66:2","+E-X60:7":"+E-X60:8","+P-X52:7":"+P-X52:8","+E-X60:9":"+E-X60:10","+P-X52:9":"+P-X52:10"};
function mide(r){const B="<b>"+esc(r.t+":"+r.p)+"</b>",z=zonaDe(r.t),vt=r.vt||"",txt=(r.inV+" "+r.outV+" "+r.d).toLowerCase();
 const R0="<b>"+esc(REF0[z]||REF0.E)+"</b>",R24="<b>"+esc(REF24[z]||REF24.E)+"</b>";
 if(/^AUX\|(Bordes|Zapata)/.test(r.key||""))return ["Corta la tensión: deja el relé de seguridad sin alimentación.","Polímetro en <b>Ω o continuidad</b>.","Una punta en <b>Z1</b> y otra en <b>Z2</b> del relé; el bucle pasa por "+B+".","Debe dar continuidad (bucle cerrado). Abierto = borde o zapata actuado o cable cortado.","No es una medida de tensión."];
 if(/400/.test(vt))return ["Polímetro en <b>V~</b>.","Roja en "+B+".","Negra en otra fase del mismo regletero ("+esc(PAR[r.t]||"L1-L2-L3")+").","Debe marcar <b>400 V~</b>.","Fase–PE: ≈ 230 V~."];
 if(/230/.test(vt)){const nn=NEU[r.t+":"+r.p];return nn?["Polímetro en <b>V~</b>.","Roja en "+B+" (fase).","Negra en <b>"+esc(nn)+"</b> (neutro).","Debe marcar <b>230 V~</b>."]:["Polímetro en <b>V~</b>.","Roja en la fase (borna anterior).","Negra en "+B+".","Debe marcar <b>230 V~</b>. Respecto a PE: ≈ 0 V~."]}
 if(/24 vac/i.test(vt)){const nn=NEU[r.t+":"+r.p]||Object.keys(NEU).find(k=>NEU[k]===r.t+":"+r.p);return ["Polímetro en <b>V~</b>.","Roja en "+B+".","Negra en <b>"+esc(nn||"su pareja del secundario")+"</b>.","Debe marcar <b>24 V~</b>."]}
 if(/neutro/i.test(vt))return ["Polímetro en <b>V~</b>.","Roja en la fase (borna anterior).","Negra en "+B+" (neutro).","Debe marcar <b>230 V~</b>."];
 if(/señal/.test(vt))return ["Polímetro en <b>V⎓ o mA</b> (entrada analógica).","Roja en "+B+".","Negra en "+R0+".","Valor <b>variable</b> según la posición del sensor: no es fijo."];
 if(/182/.test(txt)&&/CBTH/.test(r.t+r.d))return ["Polímetro en <b>V⎓</b>.","Roja en "+B+".","Negra en el <b>0 V del CBTH</b> (no figura en los planos de la PBB).","Debe marcar <b>≈ 24 V⎓</b> con el contacto cerrado (24 V propio del CBTH, hilo 182)."];
 if(/^0/.test(vt)||/hilo 205\b/.test(r.inV)&&!r.key)return ["Polímetro en <b>V⎓</b>. Se comprueba el 0 V.","Roja en "+R24+".","Negra en "+B+".","Debe marcar <b>≈ 24 V⎓</b>.","Si marca 0 V: el 0 V está cortado entre esta borna y la fuente."];
 const kk=(C[r.key]||{}).k||"";const ut=/^IN\d+S$|^UT\d?$/.test(kk)||/módulo\s+\S*\s*UT\d?\b/.test(r.next+" "+r.prev);
 const s=["Polímetro en <b>V⎓</b>.","Roja en "+B+".","Negra en "+R0+".","Debe marcar <b>"+esc(vt||"≈ 24 V")+(/24/.test(vt)?"⎓":"")+"</b> en servicio."];
 if(ut)s.push("Pulso de test: puede oscilar o marcar algo menos.");
 s.push("Si marca 0 V: mide la borna de «Llega».");return s;
}
/* agrupa los circuitos que pasan por la misma borna con la misma conexión (p. ej. un común 189) */
function grp(R){const o=[],m={};R.forEach(r=>{if(!r.key){o.push([r]);return}const s=[r.inV,r.prev,r.outV,r.next,r.vt].join("|");if(!m[s]){m[s]=[];o.push(m[s])}m[s].push(r)});return o}
const nat=(a,b)=>String(a).localeCompare(String(b),"es",{numeric:true});
let bq="",bsel="",bmode="reg";
function render(){if(!IDX)build();const box=document.getElementById("bor");if(!box)return;
 const q=bq.trim().toLowerCase();
 const strips=Object.keys(IDX).sort(nat).filter(s=>!q||s.toLowerCase().includes(q)||Object.entries(IDX[s]).some(([p,R])=>R.some(r=>(r.inV+" "+r.outV+" "+r.d+" "+r.next+" "+r.prev).toLowerCase().includes(q))));
 const mans=Object.keys(MAN).sort(nat).filter(m=>!q||m.toLowerCase().includes(q)||JSON.stringify(MAN[m]).toLowerCase().includes(q));
 const groups={};strips.forEach(s=>{const z=zonaDe(s);(groups[z]=groups[z]||[]).push(s)});
 let h='<div class="head"><div><h2>Borneros y mangueras</h2><div class="meta">'+Object.keys(IDX).length+' regleteros · '+Object.keys(MAN).length+' mangueras · '+(window.ES507?'esquema PBB 507, folios 75-116':'folios 9-97')+'</div></div></div>'+
  '<p class="ref">Cada borna con el hilo que llega, la manguera y el conductor que sale, hacia dónde va, el circuito al que pertenece y la tensión que debe dar con el circuito cerrado y todo en servicio.</p>'+
  '<div class="presets"><button class="btn'+(bmode==="reg"?" pri":"")+'" data-bm="reg">Regleteros</button><button class="btn'+(bmode==="man"?" pri":"")+'" data-bm="man">Mangueras</button></div>'+
  '<input id="bq" type="search" placeholder="Buscar y pulsar Intro: E-X55, EH-W1, hilo 189, H-S3…" value="'+esc(bq)+'" autocomplete="off" style="margin-top:10px">';
 if(bmode==="reg"){
  h+=Object.keys(groups).sort((a,b)=>Object.keys(ZONA).indexOf(a)-Object.keys(ZONA).indexOf(b)).map(z=>'<div class="grp">'+esc(ZONA[z][0])+' · '+esc(ZONA[z][1])+'</div><div class="chips">'+groups[z].map(s=>'<button class="chip'+(s===bsel?" sel":"")+'" data-bs="'+esc(s)+'">'+esc(s)+' <i>'+Object.keys(IDX[s]).length+'</i></button>').join("")+'</div>').join("")||'<p class="foot">Sin resultados.</p>';
  if(bsel&&IDX[bsel]){const S=IDX[bsel];
   /* v343: TODAS las bornas del regletero, de la primera a la última (también las que no tienen datos en el esquema cargado).
      Última = la mayor de las conocidas o el nº de conductores de la manguera multipolar que llega (p. ej. EC-W1 24x1,5 → 24).
      Las bornas del sistema buscado (texto de la búsqueda) van en otro color, en el mapa y en la lista. */
   const ks=Object.keys(S),num=ks.filter(k=>/^\d+$/.test(k)).map(Number);let mx=num.length?Math.max(...num):0;
   ks.forEach(k=>S[k].forEach(r=>(r.inV+" "+r.outV).replace(/(\d+)\s*[xX×]\s*\d/g,(m,n)=>{n=+n;if(n>mx&&n<=60&&n>=num.length)mx=n})));
   Object.values(MAN).forEach(M=>{const tt=String(M.t||"");const m=/(\d+)\s*[xX×]\s*\d/.exec(tt);if(!m)return;const toca=Object.values(M.c).some(cc=>cc.some(z=>String(z.a).startsWith(bsel+":")||String(z.b).startsWith(bsel+":")));if(toca&&+m[1]>mx&&+m[1]<=60)mx=+m[1]});
   const todas=[...new Set([...Array.from({length:mx},(_,i)=>String(i+1)),...ks])].sort(nat);
   const hit=p=>!!q&&!!S[p]&&S[p].some(r=>(r.inV+" "+r.outV+" "+r.d+" "+r.next+" "+r.prev+" "+r.m+" "+r.b).toLowerCase().includes(q));
   const nh=todas.filter(hit).length;
   h+='<div class="tbl"><div class="bcab" id="bcab"><h3>'+esc(bsel)+' <small>'+esc(ZONA[zonaDe(bsel)][1])+'</small></h3>'+fotoBor(bsel)+
    '<div class="bmap" aria-label="Mapa de bornas">'+todas.map(p=>'<a href="#bn-'+esc(p)+'" class="bmc'+(hit(p)?" hit":S[p]?" dat":" nod")+'">'+esc(p)+'</a>').join("")+'</div></div>'+
    '<div class="bley"><span class="bmc hit">n</span> del sistema buscado'+(q?' «'+esc(bq.trim())+'» ('+nh+')':' (escribe en la búsqueda)')+' · <span class="bmc dat">n</span> con datos · <span class="bmc nod">n</span> sin datos en el esquema cargado</div>'+
    todas.map((p,ix)=>!S[p]?(ix>0&&!S[todas[ix-1]]?'<i id="bn-'+esc(p)+'"></i>':(()=>{let j=ix;while(j+1<todas.length&&!S[todas[j+1]])j++;const r=j>ix?p+'–'+todas[j]:p;
     return '<div class="bn bnno" id="bn-'+esc(p)+'"><div class="bnp">'+esc(r)+'</div><div class="bnr"><div class="bnl"><span class="mu">'+(j>ix?'Bornas '+esc(r)+' ('+(j-ix+1)+')':'Borna '+esc(p))+': sin conexión en los datos cargados (reserva o circuito no pasado a datos: potencia, alumbrado…). Ver folio del plano.</span></div></div></div>'})()):
    '<div class="bn'+(hit(p)?" bnhit":"")+'" id="bn-'+esc(p)+'"><div class="bnp">'+esc(p)+'</div><div class="bnr">'+grp(S[p]).map(G=>{const r=G[0];
     return '<div class="bnl">'+(r.vt?'<span class="vt '+(/^0/.test(r.vt)?"dead":"live")+'">'+esc(r.vt)+'</span>':'')+
     (G.length>1?'<b>Común a '+G.length+' circuitos</b><div class="w">'+G.map(x=>'<button class="lnk" data-go="'+esc(x.key)+'">'+esc(x.m+" "+x.b+" "+x.d)+'</button>').join(" · ")+'</div>':
      r.key?'<button class="lnk" data-go="'+esc(r.key)+'">'+esc(r.m+" "+r.b)+' · '+esc(r.d)+'</button>':'<b>'+esc(r.d)+'</b>')+
     (r.inV||r.prev?'<div class="ln"><span class="lt">Llega'+(r.pf?FOLc(r.pf):"")+'</span><span class="lc">'+esc(r.inV||"puente/directo")+(r.prev?" desde <b>"+esc(r.prev)+"</b>":"")+'</span></div>':'')+
     ((r.outV&&r.outV!=="—")||r.next?'<div class="ln"><span class="lt">Sale'+(r.nf?FOLc(r.nf):"")+'</span><span class="lc">'+esc(r.outV||"puente/directo")+(r.next?" a <b>"+esc(r.next)+"</b>":"")+'</span></div>':'')+
     '<div class="ln mide"><span class="lt">Medir</span><ol class="lc pasos">'+mide(r).map(x=>'<li>'+x+'</li>').join("")+'</ol></div></div>'}).join("")+'</div></div>').join("")+'</div>'}
 }else{
  h+=mans.map(m=>{const M=MAN[m];return '<div class="tbl"><h3>'+esc(m)+' <small>'+esc(M.t)+'</small></h3>'+Object.keys(M.c).sort(nat).map(d=>
   '<div class="bn"><div class="bnp">'+esc(d)+'</div><div class="bnr">'+M.c[d].map(r=>'<div class="bnl"><b>'+esc(r.a)+' ⟷ '+esc(r.b)+'</b><div class="w"><button class="lnk" data-go="'+esc(r.key)+'">'+esc(r.d)+'</button></div></div>').join("")+'</div></div>').join("")+'</div>'}).join("")||'<p class="foot">Sin resultados.</p>';
 }
 box.innerHTML=h;
 zoomIni();cabAlto();
 /* v316: mientras se teclea no se redibuja nada (la pantalla no se mueve); la búsqueda se aplica al validar
    (Intro / «Buscar» del teclado) o al borrar con la ✕ del campo, y entonces se cierra el teclado y se va a los resultados */
 const i=document.getElementById("bq");if(i){
  const valida=()=>{if(i.value===bq)return;bq=i.value;i.blur();render();const r=document.getElementById("bq");if(r)r.scrollIntoView({block:"start",behavior:"smooth"})};
  i.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();valida()}});
  i.addEventListener("search",valida);i.addEventListener("change",valida);
  i.setAttribute("enterkeyhint","search")}
}
window.borRender=render;
window.borEstado=()=>({bq,bsel,bmode});window.borPon=o=>{bq=o.bq||"";bsel=o.bsel||"";bmode=o.bmode||"reg";const i=document.getElementById("bq");if(i)i.value=bq;render()};
/* ===== v544: foto del bornero / regletero desde el catálogo de Componentes de campo, con zoom de dos dedos y arrastre.
   Va entre el título del bornero y la numeración, y todo ese bloque queda fijo (no hace scroll) bajo la cabecera del CHECK. ===== */
const nrmB=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[\s+]/g,"");
function catalogo(){let L=[];try{if(window.parent!==window&&window.parent.COMP_CAMPO)L=window.parent.COMP_CAMPO}catch(e){}return L.length?L:(window.COMP_CAMPO||[])}
function fotosDe(b){const k=nrmB(b);if(!k)return[];const out=[];
 catalogo().forEach(c=>{const ids=String(c.id||"").split(/[\/,;·]| y /).map(nrmB).filter(Boolean),cl=nrmB(c.claves||"");
  const tok=String(c.claves||"").split(/[,;\n]/).map(nrmB);
  if(ids.includes(k)||tok.includes(k)||ids.some(x=>x.startsWith(k+":")))(c.fotos||[]).forEach(f=>out.push({src:f[0],v:f[1]||"Vista",c:c.id}))});
 return out}
let fIdx=0,fBor="";
function fotoBor(b){const F=fotosDe(b);if(fBor!==b){fBor=b;fIdx=0}if(fIdx>=F.length)fIdx=0;
 if(!F.length)return '<div class="bfoto nof">Sin foto de <b>'+esc(b)+'</b> en Componentes de campo · incorpórala desde «Comp.» con el código '+esc(b.replace(/^\+/,""))+'</div>';
 const f=F[fIdx];
 return '<div class="bfoto" id="bfoto"><div class="bz" id="bz"><img src="'+esc(f.src)+'" alt="'+esc(b)+'" draggable="false"></div>'+
  '<span class="bfv">'+esc(f.v)+'</span>'+(F.length>1?'<span class="bfn">'+F.map((x,i)=>'<button type="button" data-bf="'+i+'" class="'+(i===fIdx?"sel":"")+'">'+(i+1)+'</button>').join("")+'</span>':'')+
  '<button type="button" class="bfr" id="bfr" title="Pantalla completa">⤢</button></div>'}
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[data-bf]");if(!b)return;fIdx=+b.dataset.bf;const x=document.getElementById("bfoto");
 if(x){x.outerHTML=fotoBor(fBor);zoomIni();cabAlto()}});
function zoomIni(){const box=document.getElementById("bz");if(!box)return;const img=box.querySelector("img");let s=1,tx=0,ty=0;const P=new Map();let g0=null;
 const lim=()=>{const W=box.clientWidth,H=box.clientHeight,mx=W*(s-1)/2,my=H*(s-1)/2;tx=Math.max(-mx,Math.min(mx,tx));ty=Math.max(-my,Math.min(my,ty))};
 const pon=()=>{lim();img.style.transform="translate("+tx+"px,"+ty+"px) scale("+s+")"};
 const est=()=>{const v=[...P.values()];if(v.length>=2){const a=v[0],b=v[1];g0={d:Math.hypot(a.x-b.x,a.y-b.y)||1,cx:(a.x+b.x)/2,cy:(a.y+b.y)/2,s,tx,ty}}else if(v.length===1){g0={x:v[0].x,y:v[0].y,tx,ty,s}}else g0=null};
 box.addEventListener("pointerdown",e=>{e.preventDefault();try{box.setPointerCapture(e.pointerId)}catch(_){}P.set(e.pointerId,{x:e.clientX,y:e.clientY});est()});
 box.addEventListener("pointermove",e=>{if(!P.has(e.pointerId)||!g0)return;e.preventDefault();P.set(e.pointerId,{x:e.clientX,y:e.clientY});const v=[...P.values()];
  if(v.length>=2){const a=v[0],b=v[1],d=Math.hypot(a.x-b.x,a.y-b.y),r=box.getBoundingClientRect();const ns=Math.max(1,Math.min(6,g0.s*d/g0.d));
   const ox=g0.cx-r.left-r.width/2,oy=g0.cy-r.top-r.height/2,cx=(a.x+b.x)/2,cy=(a.y+b.y)/2;
   tx=ox-(ox-g0.tx)*ns/g0.s+(cx-g0.cx);ty=oy-(oy-g0.ty)*ns/g0.s+(cy-g0.cy);s=ns}
  else if(s>1){tx=g0.tx+(v[0].x-g0.x);ty=g0.ty+(v[0].y-g0.y)}pon()});
 const fin=e=>{P.delete(e.pointerId);est()};box.addEventListener("pointerup",fin);box.addEventListener("pointercancel",fin);
 /* v545: un toque → pantalla completa con zoom; doble toque → amplía aquí / restablece */
 let t0=0,tt=null,mv=false,d0=null;box.addEventListener("pointerdown",e=>{if(P.size<=1){mv=false;d0={x:e.clientX,y:e.clientY}}});
 box.addEventListener("pointermove",e=>{if(d0&&Math.abs(e.clientX-d0.x)+Math.abs(e.clientY-d0.y)>8)mv=true});
 box.addEventListener("pointerup",e=>{if(P.size||mv)return;const t=Date.now();
  if(t-t0<300){clearTimeout(tt);if(s>1){s=1;tx=ty=0}else{const r=box.getBoundingClientRect();s=2.5;tx=-(e.clientX-r.left-r.width/2)*1.5;ty=-(e.clientY-r.top-r.height/2)*1.5}pon();t0=0;return}
  t0=t;tt=setTimeout(verGrande,320)});
 box.addEventListener("wheel",e=>{e.preventDefault();s=Math.max(1,Math.min(6,s*(e.deltaY<0?1.15:1/1.15)));pon()},{passive:false});
 const rs=document.getElementById("bfr");if(rs)rs.onclick=verGrande}
function verGrande(){const F=fotosDe(fBor);if(F.length&&typeof window.compVer=="function")window.compVer(F[fIdx].src,F.map(f=>f.src),fIdx)}
/* alto de las cabeceras fijas → para que las bornas enlazadas no queden tapadas */
function cabAlto(){const c=document.getElementById("cab"),b=document.getElementById("bcab");const R=document.documentElement.style;
 R.setProperty("--cabH","0px"); /* v553: cabecera fuera de la zona con scroll */R.setProperty("--bcabH",(b?b.offsetHeight:0)+"px")}
window.addEventListener("resize",cabAlto);
(function(){const st=document.createElement("style");st.textContent=`
.bmap{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0 4px}
.bcab{position:sticky;top:var(--cabH,0px);z-index:5;background:var(--panel);padding:4px 0 6px;margin:0 -8px;padding-left:8px;padding-right:8px;border-bottom:1px solid var(--line)}
.bfoto{position:relative;height:150px;border-radius:8px;border:1px solid var(--line);background:#fff;overflow:hidden;margin:4px 0 6px}
.bfoto.nof{height:auto;background:var(--bg);color:var(--muted);font:500 12.5px var(--f-body);padding:8px 10px}
.bz{position:absolute;inset:0;touch-action:none;cursor:grab;overflow:hidden}
.bz img{width:100%;height:100%;object-fit:contain;transform-origin:50% 50%;user-select:none;-webkit-user-select:none;-webkit-user-drag:none;pointer-events:none}
.bfv{position:absolute;left:6px;bottom:6px;font:600 11px var(--f-body);color:#fff;background:rgba(0,0,0,.6);padding:2px 6px;border-radius:4px;pointer-events:none}
.bfn{position:absolute;right:6px;bottom:6px;display:flex;gap:4px}.bfn button{font:700 11px ui-monospace,monospace;width:24px;height:24px;border-radius:4px;border:0;background:rgba(0,0,0,.55);color:#fff}.bfn button.sel{background:var(--accent)}
.bfr{position:absolute;right:6px;top:6px;width:30px;height:30px;border-radius:6px;border:0;background:rgba(0,0,0,.55);color:#fff;font-size:16px}
.bn,.tbl i[id^="bn-"]{scroll-margin-top:calc(var(--cabH,0px) + var(--bcabH,0px) + 8px)}
.bmc{display:inline-grid;place-items:center;min-width:26px;height:24px;padding:0 3px;border-radius:4px;font:700 11px ui-monospace,Menlo,monospace;text-decoration:none;color:var(--fg);border:1px solid var(--line);background:var(--panel)}
.bmc.dat{background:color-mix(in srgb,var(--accent) 12%,var(--panel))}
.bmc.nod{border-style:dashed;color:var(--muted);background:transparent}
.bmc.hit{background:#ef6c00;border-color:#ef6c00;color:#fff}
.bley{font-size:11px;color:var(--muted);margin-bottom:8px;line-height:1.9}.bley .bmc{min-width:18px;height:16px;font-size:9px;vertical-align:middle}
.bn.bnhit{border-left:4px solid #ef6c00;background:color-mix(in srgb,#ef6c00 10%,transparent)}.bn.bnhit .bnp{background:#ef6c00;color:#fff}
.bn.bnno{opacity:.6}.bn.bnno .bnp{border-style:dashed}`;document.head.appendChild(st)})();
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
 if(b.dataset.bm){bmode=b.dataset.bm;render()}
 else if(b.dataset.bs){bsel=bsel===b.dataset.bs?"":b.dataset.bs;render();const t=document.querySelector("#bor .tbl");if(t)t.scrollIntoView({block:"start",behavior:"smooth"})}
 else if(b.dataset.go){sel=b.dataset.go;st={};marks={};fault=false;outOn=true;pview="es";mod="";$("#q").value="";pshow();mods();list();const sc=document.getElementById("scr");if(sc)sc.scrollTop=0}});
})();
