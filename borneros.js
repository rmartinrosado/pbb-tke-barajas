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
const cond=v=>v?(v.h?("hilo "+v.h+(v.c?" "+v.c:"")):v.m?(v.m+(v.t?" ("+v.t+")":"")+(v.d?" cond. "+v.d:"")):""):"";
const lab=n=>!n?"":n.k==="B"?(n.t+":"+n.p):n.k==="E"?(n.t+" "+(n.ps||[]).join("-")):n.k==="C"?("común "+n.w):n.k==="M"?("módulo "+(n.t||"")+" "+(n.l||"")):n.k==="P"?n.t:n.k==="F"?(n.t+":"+n.p):n.k==="J"?"ramas en paralelo":"";

/* regleteros de alimentación y fuerza (no salen en las cadenas de E/S) */
const ST=[
 ["+CBTH-X11","1","hilo 2 BN 16 mm²","ECBTH-W1 H07RN-F 4x16 · BN","L1 acometida PBB → +E-S0:1","400 V entre fases",9],
 ["+CBTH-X11","2","hilo 4 BK 16 mm²","ECBTH-W1 · BK","L2 acometida PBB → +E-S0:3","400 V entre fases",9],
 ["+CBTH-X11","3","hilo 6 GY 16 mm²","ECBTH-W1 · GY","L3 acometida PBB → +E-S0:5","400 V entre fases",9],
 ["+CBTH-X11","4","PE GNYE 16 mm²","ECBTH-W1 · GNYE","PE → +E-X11:1 → barra de tierras E-X90","0 V",9],
 ["+CBTH-X12","1","hilo 9 BN 2,5 mm²","ECBTH-W3 3x2,5 · BK","L SAI 220 V → +E-S0.1:1","230 V F-N",29],
 ["+CBTH-X12","2","hilo 10 BU 2,5 mm²","ECBTH-W3 · BN","N SAI → +E-S0.1:3","0 V (neutro)",29],
 ["+CBTH-X12","3","PE","ECBTH-W3 · GY","PE SAI → +E-X66:3","0 V",29],
 ["+E-X66","1","hilo 1 BN 2,5","—","L SAI tras E-S0.1 → E-Q22, E-Q24, E-Q25","230 V F-N",29],
 ["+E-X66","2","hilo 10 BU 2,5","—","N SAI tras E-S0.1","0 V (neutro)",29],
 ["+E-X60","1","hilo 137 GY 2,5","EP-W2 H07RN-F 12x2,5 · 1","L1 motores cabina (E-Q40) → +P-X52:1 → P-Q6","400 V entre fases",34],
 ["+E-X60","2","hilo 138 BK 2,5","EP-W2 · 2","L2 motores cabina → +P-X52:2","400 V entre fases",34],
 ["+E-X60","3","hilo 139 BN 2,5","EP-W2 · 3","L3 motores cabina → +P-X52:3","400 V entre fases",34],
 ["+E-X60","4","hilo 35 GY 2,5","EP-W2 · 4","L1 primario trafo (E-Q15) → +P-X52:4 → P-T1","400 V entre fases",17],
 ["+E-X60","5","hilo 37 BK 2,5","EP-W2 · 5","L2 primario trafo → +P-X52:5","400 V entre fases",17],
 ["+E-X60","6","hilo 38 BN 2,5","EP-W2 · 6","L3 primario trafo → +P-X52:6","400 V entre fases",17],
 ["+E-X60","7","hilo 34 BN 2,5","EP-W2 · 7","Secundario 220 V del trafo (desde P-X52:7) → E-Q150:1","230 V",17],
 ["+E-X60","8","hilo 7 BU 2,5","EP-W2 · 8","Secundario 220 V (desde P-X52:8) → E-Q150:3","230 V",17],
 ["+E-X60","9","hilo 184 BN 1,5","EP-W2 · 9","Secundario 24 V (desde P-X52:9) → lunetas E-Q17.1","24 Vac",17],
 ["+E-X60","10","hilo 183 BU 1,5","EP-W2 · 10","Secundario 24 V (desde P-X52:10) → lunetas E-Q17.1","24 Vac",17],
 ["+E-X60","12","PE","EP-W2 · GNYE","PE motores cabina → +P-X52:12","0 V",34],
 ["+P-X52","1","hilo 137 GY","EP-W2 · 1","L1 desde E-X60:1 → P-Q6:1/L1","400 V entre fases",34],
 ["+P-X52","2","hilo 138 BK","EP-W2 · 2","L2 desde E-X60:2 → P-Q6:3/L2","400 V entre fases",34],
 ["+P-X52","3","hilo 139 BN","EP-W2 · 3","L3 desde E-X60:3 → P-Q6:5/L3","400 V entre fases",34],
 ["+P-X52","4","hilo 35 GY","EP-W2 · 4","Primario P-T1 (borna 1)","400 V entre fases",17],
 ["+P-X52","5","hilo 37 BK","EP-W2 · 5","Primario P-T1 (borna 3)","400 V entre fases",17],
 ["+P-X52","6","hilo 38 BN","EP-W2 · 6","Primario P-T1 (borna 5)","400 V entre fases",17],
 ["+P-X52","7","hilo 34 BN","EP-W2 · 7","Secundario 220 V P-T1 (6) → E-X60:7","230 V",17],
 ["+P-X52","8","hilo 7 BU","EP-W2 · 8","Secundario 220 V P-T1 → E-X60:8","230 V",17],
 ["+P-X52","9","hilo 184 BN","EP-W2 · 9","Secundario 24 V P-T1 → E-X60:9","24 Vac",17],
 ["+P-X52","10","hilo 183 BU","EP-W2 · 10","Secundario 24 V P-T1 → E-X60:10","24 Vac",17],
 ["+E-X59","1","hilo 204 RD 1","EP-W1 H07RN-F 24x1,5 · 1","+24 V de la fuente E-V3 (E-Q30) al pupitre → +P-X51:1 → P-Q30.0","24 V",29],
 ["+E-X59","2","hilo 205 WH 1","EP-W1 · 2","0 V al pupitre → +P-X51:2","0 V",29],
 ["+P-X51","1","hilo 204 RD","EP-W1 · 1","Entrada +24 V de la cabecera P-Q30.0 (PS) del pupitre","24 V",38],
 ["+P-X51","2","hilo 205 WH","EP-W1 · 2","0 V de la cabecera P-Q30.0","0 V",38],
 ["+E-X68","1","hilo 189 RD","—","+24 V E/S armario E (E-Q30.3, 10 A): común de entradas y regleteros de campo","24 V",40],
 ["+E-X68","2","hilo 205 WH","—","0 V armario E (cargas de salidas, sensores)","0 V",40],
 ["+E-X68","4","hilo 215 RD","—","+24 V módulos de E/S (E-Q30.2, 10 A)","24 V",36],
 ["+E-X68","6","hilo 613 RD","—","+24 V módulo de seguridades y sensores de seguridad (E-Q30.4, 8 A)","24 V",37],
 ["+P-X92","1","hilo 332 RD","—","+24 V E/S del pupitre (P-Q30.2, 10 A)","24 V",40],
 ["+P-X92","2","hilo 205 WH","—","0 V del pupitre","0 V",40],
 ["+P-X92","3","hilo 330 RD","—","+24 V display CP-A1 y relé de zapata P-U5 (P-Q30.3, 8 A)","24 V",39],
 ["+E-X51","1","hilo 189 RD","EIT-W1 H07RN-F 24x1,5 · 1","+24 V al túnel A (IT-X51:1) y al pulsador SS-S1","24 V",48],
 ["+E-X51","2","hilo 205 WH","EIT-W1 · 2","0 V al túnel A (IT-X51:2)","0 V",48],
 ["+E-X54","1","hilo 189 RD","EET-W1 H07RN-F 12x1,5 · 1","+24 V al túnel C (ET-X51:1)","24 V",48],
 ["+E-X54","2","hilo 205 WH","EET-W1 · 2","0 V al túnel C (ET-X51:2)","0 V",48],
 ["+E-X57","1","hilo 189 RD","EC-W1 H07RN-F 24x1,5 · 1","+24 V a la cabina (C-X51:1)","24 V",48],
 ["+E-X57","2","hilo 205 WH","EC-W1 · 2","0 V a la cabina (C-X51:2)","0 V",48],
 ["+E-X55","1","hilo 189 RD","EH-W1 H07RN-F 24x1,5 · 1","+24 V a la elevación (H-X51:1) y común PBB al CBTH (E-X61:10)","24 V",48],
 ["+E-X55","2","hilo 205 WH","EH-W1 · 2","0 V a la elevación (H-X51:2 → H-X51:30) y al CBTH (E-X61:21)","0 V",48],
 ["+E-X61","1","hilo 182 RD","ECBTH-W 25x · 1","24 V común del CBTH (señales de estado al CBTH y P-K80..K84)","24 V (del CBTH)",11],
 ["+E-X61","10","hilo 189 RD","ECBTH-W · 10","24 V común PBB hacia el CBTH (contactos de bloqueo externos)","24 V",11],
 ["+E-X61","19","hilo 15","ECBTH-W · 19","Caja sonda Tra PCAIR → C1'-X100:1 (E-W12 BK)","—",11],
 ["+E-X61","20","hilo 14","ECBTH-W · 20","Caja sonda Tra PCAIR → C1'-X100:2 (E-W12 BN)","—",11],
 ["+E-X61","21","hilo 205 WH","ECBTH-W · 21","0 V hacia el CBTH (desde E-X55:2)","0 V",11],
 ["+E-X61","22","hilo 13 RD","ECBTH-W · 22","Foco azafata verde (P-K22 21-22) → E-X59:11","24 V con foco verde",11]
];

let IDX=null,MAN=null;
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
   R.push({key,m:e.m,b:e.b,d:e.d,f:x.f||e.f,pf:i===0?e.f:(n[i-1].f||e.f),nf:n[i+1]?(n[i+1].f||e.f):0,t:x.t,p:x.p,inV:(x.v||[]).map(cond).join(" + "),outV:n[i+1]?(n[i+1].v||[]).map(cond).join(" + "):"",prev,next,vt:vm[x.t+":"+x.p]||""});
  })});
 ST.forEach(s=>{const S=(IDX[s[0]]=IDX[s[0]]||{}),R=(S[s[1]]=S[s[1]]||[]);R.unshift({key:"",d:s[4],f:s[6],pf:s[6],nf:s[6],t:s[0],p:s[1],inV:s[2],outV:s[3],prev:"",next:"",vt:s[5],st:1})});
}
/* dónde poner las puntas del polímetro y qué debe marcar */
const REF0={E:"+E-X68:2 (0 V, hilo 205)",P:"+P-X92:2 (0 V, hilo 205)",CP:"+P-X92:2 (0 V, hilo 205)",IT:"+IT-X51:2 (0 V, hilo 205)",ET:"+ET-X51:2 (0 V, hilo 205)",C:"+C-X51:2 (0 V, hilo 205)",
 C4:"+C4-X64:2 (0 V, hilo 205)",H:"+H-X51:30 (0 V, hilo 205)",CO:"+IT-X51:2 (0 V, hilo 205)",CO3:"+IT-X51:2 (0 V, hilo 205)",R:"+IT-X50:2 (0 V, hilo 205)",CBTH:"+E-X61:21 (0 V PBB, hilo 205)",SS:"+E-X68:2 (0 V, hilo 205)",T:"+E-X68:2 (0 V, hilo 205)",F:"+E-X68:2 (0 V, hilo 205)"};
const REF24={E:"+E-X68:1 (+24 V, hilo 189)",P:"+P-X92:1 (+24 V, hilo 332)",CP:"+P-X92:1 (+24 V, hilo 332)",IT:"+IT-X51:1 (+24 V, hilo 189)",ET:"+ET-X51:1 (+24 V, hilo 189)",C:"+C-X51:1 (+24 V, hilo 189)",
 C4:"+C4-X64:1 (+24 V, hilo 336)",H:"+H-X51:1 (+24 V, hilo 189)",CO:"+CO3-X51:1 (+24 V, hilo 189)",CO3:"+CO3-X51:1 (+24 V, hilo 189)",R:"+IT-X50:1 (+24 V, hilo 613)",CBTH:"+E-X61:10 (+24 V, hilo 189)",SS:"+E-X68:1 (+24 V, hilo 189)",T:"+E-X68:1 (+24 V, hilo 189)",F:"+E-X68:1 (+24 V, hilo 189)"};
const PAR={"+CBTH-X11":"1-2-3","+E-X60":"1-2-3 / 4-5-6","+P-X52":"1-2-3 / 4-5-6"};
const NEU={"+CBTH-X12:1":"+CBTH-X12:2","+E-X66:1":"+E-X66:2","+E-X60:7":"+E-X60:8","+P-X52:7":"+P-X52:8","+E-X60:9":"+E-X60:10","+P-X52:9":"+P-X52:10"};
function mide(r){const B="<b>"+esc(r.t+":"+r.p)+"</b>",z=zonaDe(r.t),vt=r.vt||"",txt=(r.inV+" "+r.outV+" "+r.d).toLowerCase();
 if(/^AUX\|(Bordes|Zapata)/.test(r.key||""))return "Bucle vigilado por el relé de seguridad: <b>sin tensión</b> (relé desconectado), polímetro en Ω o continuidad entre Z1 y Z2 del relé pasando por "+B+". No es una medida de tensión.";
 if(/400/.test(vt))return "Polímetro en <b>V~</b>. Roja en "+B+" y negra en otra fase del mismo regletero ("+esc(PAR[r.t]||"L1-L2-L3")+") → <b>400 V~</b>. Fase–PE ≈ 230 V~.";
 if(/230/.test(vt)){const nn=NEU[r.t+":"+r.p];return nn?"Polímetro en <b>V~</b>. Roja en "+B+" y negra en <b>"+esc(nn)+"</b> (neutro) → <b>230 V~</b>.":"Polímetro en <b>V~</b>. Neutro: roja en la fase (borna anterior) y negra en "+B+" → <b>230 V~</b>; respecto a PE debe dar ≈ 0 V~."}
 if(/24 vac/i.test(vt)){const nn=NEU[r.t+":"+r.p]||Object.keys(NEU).find(k=>NEU[k]===r.t+":"+r.p);return "Polímetro en <b>V~</b>. Entre "+B+" y <b>"+esc(nn||"su pareja del secundario")+"</b> → <b>24 V~</b>."}
 if(/neutro/i.test(vt))return "Polímetro en <b>V~</b>. Roja en la fase (borna anterior) y negra en "+B+" → <b>230 V~</b>.";
 if(/señal/.test(vt))return "Entrada analógica: polímetro en <b>V⎓ o mA</b> entre "+B+" y "+esc(REF0[z]||REF0.E)+". Valor <b>variable</b> según la posición del sensor (no es fijo).";
 if(/182/.test(txt)&&/CBTH/.test(r.t+r.d))return "Polímetro en <b>V⎓</b>. Señal con el 24 V propio del CBTH (hilo 182): roja en "+B+" y negra en el 0 V del CBTH (no figura en los planos de la PBB) → <b>≈24 V⎓</b> con el contacto cerrado.";
 if(/^0/.test(vt)||/hilo 205\b/.test(r.inV)&&!r.key)return "Polímetro en <b>V⎓</b>. Comprobar el 0 V: roja en "+esc(REF24[z]||REF24.E)+" y negra en "+B+" → <b>≈24 V⎓</b>. Si marca 0 V, el 0 V está cortado entre esta borna y la fuente.";
 const ut=/IN\d+S|UT/.test((C[r.key]||{}).k||"")||/\bUT\d?\b/.test(r.next+" "+r.prev);
 return "Polímetro en <b>V⎓</b>. Roja en "+B+" y negra en <b>"+esc(REF0[z]||REF0.E)+"</b> → <b>"+esc(vt||"≈24 V")+(/24/.test(vt)?"⎓":"")+"</b> con el circuito cerrado y en servicio"+(ut?" (pulsos de test de seguridad: puede marcar algo menos u oscilar)":"")+". Si marca 0 V, el corte está aguas arriba: mide la borna de «Llega».";
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
 let h='<div class="head"><div><h2>Borneros y mangueras</h2><div class="meta">'+Object.keys(IDX).length+' regleteros · '+Object.keys(MAN).length+' mangueras · folios 9-97</div></div></div>'+
  '<p class="ref">Cada borna con el hilo que llega, la manguera y el conductor que sale, hacia dónde va, el circuito al que pertenece y la tensión que debe dar con el circuito cerrado y todo en servicio.</p>'+
  '<div class="presets"><button class="btn'+(bmode==="reg"?" pri":"")+'" data-bm="reg">Regleteros</button><button class="btn'+(bmode==="man"?" pri":"")+'" data-bm="man">Mangueras</button></div>'+
  '<input id="bq" type="search" placeholder="Buscar: E-X55, EH-W1, hilo 189, H-S3, 613…" value="'+esc(bq)+'" autocomplete="off" style="margin-top:10px">';
 if(bmode==="reg"){
  h+=Object.keys(groups).sort((a,b)=>Object.keys(ZONA).indexOf(a)-Object.keys(ZONA).indexOf(b)).map(z=>'<div class="grp">'+esc(ZONA[z][0])+' · '+esc(ZONA[z][1])+'</div><div class="chips">'+groups[z].map(s=>'<button class="chip'+(s===bsel?" sel":"")+'" data-bs="'+esc(s)+'">'+esc(s)+' <i>'+Object.keys(IDX[s]).length+'</i></button>').join("")+'</div>').join("")||'<p class="foot">Sin resultados.</p>';
  if(bsel&&IDX[bsel]){const S=IDX[bsel];
   h+='<div class="tbl"><h3>'+esc(bsel)+' <small>'+esc(ZONA[zonaDe(bsel)][1])+'</small></h3>'+Object.keys(S).sort(nat).map(p=>
    '<div class="bn"><div class="bnp">'+esc(p)+'</div><div class="bnr">'+grp(S[p]).map(G=>{const r=G[0];
     return '<div class="bnl">'+(r.vt?'<span class="vt '+(/^0/.test(r.vt)?"dead":"live")+'">'+esc(r.vt)+'</span>':'')+
     (G.length>1?'<b>Común a '+G.length+' circuitos</b><div class="w">'+G.map(x=>'<button class="lnk" data-go="'+esc(x.key)+'">'+esc(x.m+" "+x.b+" "+x.d)+'</button>').join(" · ")+'</div>':
      r.key?'<button class="lnk" data-go="'+esc(r.key)+'">'+esc(r.m+" "+r.b)+' · '+esc(r.d)+'</button>':'<b>'+esc(r.d)+'</b>')+
     (r.inV||r.prev?'<div class="ln"><span class="lt">Llega</span>'+esc(r.inV||"puente/directo")+(r.prev?" desde <b>"+esc(r.prev)+"</b>":"")+(r.pf?" · "+FOL(r.pf):"")+'</div>':'')+
     ((r.outV&&r.outV!=="—")||r.next?'<div class="ln"><span class="lt">Sale</span>'+esc(r.outV||"puente/directo")+(r.next?" a <b>"+esc(r.next)+"</b>":"")+(r.nf?" · "+FOL(r.nf):"")+'</div>':'')+
     '<div class="ln mide"><span class="lt">Medir</span>'+mide(r)+'</div></div>'}).join("")+'</div></div>').join("")+'</div>'}
 }else{
  h+=mans.map(m=>{const M=MAN[m];return '<div class="tbl"><h3>'+esc(m)+' <small>'+esc(M.t)+'</small></h3>'+Object.keys(M.c).sort(nat).map(d=>
   '<div class="bn"><div class="bnp">'+esc(d)+'</div><div class="bnr">'+M.c[d].map(r=>'<div class="bnl"><b>'+esc(r.a)+' ⟷ '+esc(r.b)+'</b><div class="w"><button class="lnk" data-go="'+esc(r.key)+'">'+esc(r.d)+'</button></div></div>').join("")+'</div></div>').join("")+'</div>'}).join("")||'<p class="foot">Sin resultados.</p>';
 }
 box.innerHTML=h;
 const i=document.getElementById("bq");if(i){i.oninput=()=>{bq=i.value;const pos=i.selectionStart;render();const j=document.getElementById("bq");j.focus();try{j.setSelectionRange(pos,pos)}catch(e){}}}
}
window.borRender=render;
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
 if(b.dataset.bm){bmode=b.dataset.bm;render()}
 else if(b.dataset.bs){bsel=bsel===b.dataset.bs?"":b.dataset.bs;render();const t=document.querySelector("#bor .tbl");if(t)t.scrollIntoView({block:"start",behavior:"smooth"})}
 else if(b.dataset.go){sel=b.dataset.go;st={};marks={};fault=false;outOn=true;pview="es";mod="";$("#q").value="";pshow();mods();list();window.scrollTo({top:0})}});
})();
