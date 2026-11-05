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
}
/* dónde poner las puntas del polímetro y qué debe marcar */
const REF0={E:"+E-X68:2 (0 V, hilo 205)",P:"+P-X92:2 (0 V, hilo 205)",CP:"+P-X92:2 (0 V, hilo 205)",IT:"+IT-X51:2 (0 V, hilo 205)",ET:"+ET-X51:2 (0 V, hilo 205)",C:"+C-X51:2 (0 V, hilo 205)",
 C4:"+C4-X64:2 (0 V, hilo 205)",H:"+H-X51:30 (0 V, hilo 205)",CO:"+IT-X51:2 (0 V, hilo 205)",CO3:"+IT-X51:2 (0 V, hilo 205)",R:"+IT-X50:2 (0 V, hilo 205)",CBTH:"+E-X61:21 (0 V PBB, hilo 205)",SS:"+E-X68:2 (0 V, hilo 205)",T:"+E-X68:2 (0 V, hilo 205)",F:"+E-X68:2 (0 V, hilo 205)"};
const REF24={E:"+E-X68:1 (+24 V, hilo 189)",P:"+P-X92:1 (+24 V, hilo 332)",CP:"+P-X92:1 (+24 V, hilo 332)",IT:"+IT-X51:1 (+24 V, hilo 189)",ET:"+ET-X51:1 (+24 V, hilo 189)",C:"+C-X51:1 (+24 V, hilo 189)",
 C4:"+C4-X64:1 (+24 V, hilo 336)",H:"+H-X51:1 (+24 V, hilo 189)",CO:"+CO3-X51:1 (+24 V, hilo 189)",CO3:"+CO3-X51:1 (+24 V, hilo 189)",R:"+IT-X50:1 (+24 V, hilo 613)",CBTH:"+E-X61:10 (+24 V, hilo 189)",SS:"+E-X68:1 (+24 V, hilo 189)",T:"+E-X68:1 (+24 V, hilo 189)",F:"+E-X68:1 (+24 V, hilo 189)"};
if(window.ES507){const J5=s=>s.replace(/hilo 205/,"hilo 129").replace(/hilo 189/,"hilo 218").replace(/hilo 332/,"hilo 184").replace(/hilo 613/,"hilo 568").replace("+H-X51:30","+H-X51:2");[REF0,REF24].forEach(o=>Object.keys(o).forEach(z=>{o[z]=J5(o[z])}))}
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
   h+='<div class="tbl"><h3>'+esc(bsel)+' <small>'+esc(ZONA[zonaDe(bsel)][1])+'</small></h3>'+Object.keys(S).sort(nat).map(p=>
    '<div class="bn"><div class="bnp">'+esc(p)+'</div><div class="bnr">'+grp(S[p]).map(G=>{const r=G[0];
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
 /* v316: mientras se teclea no se redibuja nada (la pantalla no se mueve); la búsqueda se aplica al validar
    (Intro / «Buscar» del teclado) o al borrar con la ✕ del campo, y entonces se cierra el teclado y se va a los resultados */
 const i=document.getElementById("bq");if(i){
  const valida=()=>{if(i.value===bq)return;bq=i.value;i.blur();render();const r=document.getElementById("bq");if(r)r.scrollIntoView({block:"start",behavior:"smooth"})};
  i.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();valida()}});
  i.addEventListener("search",valida);i.addEventListener("change",valida);
  i.setAttribute("enterkeyhint","search")}
}
window.borRender=render;
document.addEventListener("click",ev=>{const b=ev.target.closest("button");if(!b)return;
 if(b.dataset.bm){bmode=b.dataset.bm;render()}
 else if(b.dataset.bs){bsel=bsel===b.dataset.bs?"":b.dataset.bs;render();const t=document.querySelector("#bor .tbl");if(t)t.scrollIntoView({block:"start",behavior:"smooth"})}
 else if(b.dataset.go){sel=b.dataset.go;st={};marks={};fault=false;outOn=true;pview="es";mod="";$("#q").value="";pshow();mods();list();window.scrollTo({top:0})}});
})();
