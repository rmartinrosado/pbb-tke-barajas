/* ===== v525: INSPECCIÓN CABLE A CABLE COMPLETA · ORIGEN → DESTINO (16/11/2026) =====
   La inspección cable a cable ya no se queda solo en la «Actuación más eficaz».
   · Cuando la actuación más eficaz se DA POR CONSULTADA (todas sus casillas marcadas, en la caja ⭐ de la guía o en la
     lista de la IA del cotejo, o con el botón «✅ Actuación más eficaz consultada»), la OT pasa a modo «inspección completa»:
       1) se recalcula todo: se borra la caché del análisis, el cotejo entre planos se relanza (Gemini gratis; Claude solo
          aceptando el coste) pidiendo la inspección completa, y la inspección del PLC deja de filtrar por la IA;
       2) sale la caja «🔌 Inspección cable a cable completa · origen → destino» con cada señal implicada recorrida
          borna a borna desde el ORIGEN (fuente de 24 V / equipo / contacto de campo) hasta el DESTINO (entrada del PLC),
          cada punto con «Llega desde», «Sale a», folio y dónde poner las puntas del polímetro y qué debe marcar.
   · Si la OT habla de BLOQUEOS se despliega todo el interbloqueo desde el CBTH hasta los equipos de la PBB y las máquinas
     de servicios auxiliares: AAA (máquina A/A, carro A/A), HZ (convertidor en servicio, conector al 90 %, manguera
     extendida) y AO (seta, desbloqueo). Lo que nombra la OT va primero y abierto; el resto, plegado debajo.
   · Debajo, los tramos del lado de los equipos (dentro del CBTH, máquina AAA, convertidor) que devuelve la IA con los
     planos elegidos (AAA, CBTH, HZ…).
   · Se ve en la guía de campo de la OT (todos los tipos: PAS, AAA, HZ…) y en la inspección cable a cable de la tarjeta.
   · «↩ Solo la actuación más eficaz» vuelve al modo anterior. ===== */
(function(){
"use strict";
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const ls={g:k=>{try{return localStorage.getItem(k)}catch(e){return null}},s:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}},d:k=>{try{localStorage.removeItem(k)}catch(e){}}};
const otDe=id=>{try{return (typeof inc!="undefined"?inc:[]).find(x=>x.id==id)||null}catch(e){return null}};
const otAct=()=>{try{return typeof gOT!="undefined"&&gOT?otDe(gOT):null}catch(e){return null}};

/* ---------- estado «actuación más eficaz consultada» por OT ---------- */
window.insCons=id=>!!(id&&ls.g("insc_"+id));
function marca(id,on,auto){if(!id)return;const ya=window.insCons(id);if(!!on===ya)return;
 if(on)ls.s("insc_"+id,String(Date.now()));else ls.d("insc_"+id);
 try{ANA_C={k:"",r:null}}catch(e){}
 if(on){try{msg(auto?"Actuación más eficaz marcada entera: se recalcula todo y sale la inspección completa cable a cable":"Se recalcula todo y sale la inspección completa cable a cable")}catch(e){}
  setTimeout(()=>{try{if(typeof window.pcCompleta=="function")window.pcCompleta()}catch(e){console.warn("ins-completa IA",e)}},80)}
 else{try{if(typeof window.pcCompleta=="function")window.pcCompleta(true)}catch(e){}}
 repinta(on)}
window.insConsMarca=function(on){const i=otAct();if(i)marca(i.id,on,false)};

/* casillas: todas marcadas en la caja ⭐ de la guía o en la lista de pasos de la IA → consultada */
document.addEventListener("change",ev=>{const t=ev.target;if(!t||t.type!="checkbox")return;
 const box=t.closest("#app details.gd.gef, #gpcot .gst, .aibox .gst");if(!box)return;
 setTimeout(()=>{const cs=[...box.querySelectorAll('input[type="checkbox"]')];if(cs.length&&cs.every(c=>c.checked)){const i=otAct();if(i)marca(i.id,true,true)}},0)},true);

/* ---------- texto de la OT ---------- */
function iaDe(id){try{if(typeof window.pcIAOT=="function"){const o=window.pcIAOT(id);if(o)return o}}catch(e){}return null}
function textoOT(i){const o=iaDe(i.id);return nrm([i.desc,i.def,i.obs,i.com,i.act,(i.alarmas||[]).join(" "),o&&o.resumen].filter(Boolean).join(" "))}
const esBloqueo=i=>/bloque|enclavam|interbloq|no traslad|no se mueve|no bloquea/.test(textoOT(i));
window.insEsBloqueo=i=>{try{return esBloqueo(i)}catch(e){return false}};

/* ---------- cableado (rev. J; 507 con el suyo) ---------- */
const CAB=i=>(String(i&&i.pos)=="507"&&window.CABLEADO507)||window.CABLEADO||{};
function busca(C,mod,b){const p=mod+"|"+b+"|";const k=Object.keys(C).find(x=>x.indexOf(p)===0);return k?{k,e:C[k]}:null}

/* interbloqueos PBB ↔ equipos de servicio (por el CBTH) */
const BLQ=[
 {g:"AAA",al:["265","274","282","109","060"],m:"E-A2",b:"4.4",re:{test:t=>/maquina|adx|climatiz/.test(t)||(/\bpca\b|a\/a|aire|\baaa\b/.test(t)&&!/carr(o|ito)|puerta|tapa/.test(t))},eq:"Máquina A/A (ADX · AAA)",
  o:"Contacto «bloqueo pasarela» de la máquina: clemas 136/137 (plano AAA pág. 7 y 16) → contacto libre de potencial en el CBTH (CBTH:BLOQUEO-A/A, CBTH-X61:10-11).",
  on:"Máquina A/A conectada / en marcha → 24 V y LED encendido (bloqueo). Parada y manguera recogida → 0 V, LED apagado."},
 {g:"AAA",al:["274","282"],m:"E-A2",b:"5.1",re:/carr(o|ito)|puerta|tapa|pc ?air|e-?s100/,eq:"Carro A/A (PCAir)",
  o:"Final de carrera de la puerta del carro E-S100 (contacto NC 11-12, manguera E-WCARRO 5×1,5) alimentado con la tensión de test UT2 de E-A8.",
  on:"Carro abierto o FC sin pisar → ≈ 24 V pulsada y LED encendido (bloqueo). Carro cerrado y FC pisado → 0 V, LED apagado."},
 {g:"AAA",m:"AUX",b:"CBTH-X61:18",re:/carr(o|ito)|puerta|tapa|pc ?air|e-?s100/,eq:"Carro A/A → sistema A/A (por el CBTH)",
  o:"Contacto 13-14 del mismo FC E-S100: devuelve al sistema A/A su 24 V común (CBTH-X61:17 → CBTH-X61:18).",
  on:"Carro cerrado y FC pisado → 24 V del sistema A/A en CBTH-X61:18. Carro abierto → 0 V.",ref0:"0 V del sistema A/A (ver plano del CBTH / AAA)"},
 {g:"HZ",al:["266","267","107"],m:"E-A2",b:"6.1",re:/convertidor|\b400\b|\bhz\b|en servicio|\bgpu\b/,eq:"Convertidor 400 Hz en servicio",
  o:"Contacto «en servicio» del convertidor → contacto libre de potencial en el CBTH (CBTH:BLOQUEO-CONVERTIDOR, CBTH-X61:10-14).",
  on:"Convertidor en ON → 24 V y LED encendido (bloqueo). En OFF → 0 V, LED apagado."},
 {g:"HZ",al:["263","283"],m:"E-A2",b:"5.4",re:/90 ?%|conector|pds/,eq:"Conector PDS 400 al 90 %",
  o:"Contacto del 90 % del conector (sistema 400 Hz) → contacto libre de potencial en el CBTH (CBTH:BLOQUEO-90%, CBTH-X61:10-15).",
  on:"Conector al 90 % (LED amarillo encendido) → 24 V y LED encendido (bloqueo). Conector recogido → 0 V."},
 {g:"HZ",al:["272","281"],m:"P-A5",b:"2.1",re:/manguera|recog|enroll|enrrol|extendid|cable (de )?400/,eq:"Manguera 400 Hz extendida (recogedor)",
  o:"Contacto «-400HZ» 13-14 de la leva del recogedor → P-X92:18 (hilo 3383) en el armario del pupitre.",
  on:"Manguera fuera del recogedor → 24 V y LED encendido (bloqueo, no traslada). Recogida → 0 V, LED apagado.",el:"Contacto «-400HZ» del recogedor"},
 {g:"POR",al:["242","108","049"],m:"E-A8",b:"1.1",re:/porton|cierre|trasla|atras|sacar|retir|desatrac/,eq:"Portón abajo · Sensor portón enrollable C-S9",
  o:"Inductivo de cierre del portón C-S9 (cable P-W21, bornero P-X92.1:1-2-3). BAJAR PORTÓN (o anular este inductivo con puente P-X92.1:1 ↔ :2) permite la traslación hacia atrás con AAA y HZ conectados al avión.",
  on:"Portón abajo → 24 V y LED 1 de E-A8 encendido (permite la traslación hacia atrás). Portón arriba → 0 V y advertencia 242 «Portón abierto»."},
 {g:"AO",al:["014"],m:"E-A3",b:"1.1",re:/seta|emergencia|\bao\b|armario exterior/,eq:"Seta del armario AO",
  o:"Contacto de la seta del AO → contacto en el CBTH (CBTH:SETA-AO, CBTH-X61:10-16).",
  on:"Seta pulsada → 24 V y LED encendido (bloqueo). Seta rearmada → 0 V."},
 {g:"AO",m:"E-A3",b:"2.1",re:/bypass|desbloque|selector|\bao\b|no bloquea/,eq:"Desbloqueo de PAS en el AO (bypass)",
  o:"Selector de desbloqueo del AO → contacto en el CBTH (CBTH:DESBLOQUEO-AO, CBTH-X61:10-13). Activo = la PBB NO se bloquea.",
  on:"Selector del AO en desbloqueo → 24 V y LED encendido (la PBB no se bloquea). Selector en normal → 0 V."}];
const GRP={POR:"Portón · para sacar la PBB con AAA y HZ conectados",AAA:"AAA · aire acondicionado (máquina y carro)",HZ:"HZ · convertidor 400 Hz",AO:"AO · armario exterior en el CBTH",EST:"Señales de la PBB al CBTH (estado)"};
const EST=["2","3","4","5"].map(n=>({g:"EST",m:"AUX",b:"CBTH-X61:"+n,re:/$^/,eq:"",o:"",on:"Contacto 11-14 del relé cerrado → 24 V del CBTH en la borna. Abierto → 0 V."}));

/* ---------- señales implicadas ---------- */
function senales(i){const C=CAB(i),t=textoOT(i),out=[],vis=new Set();
 const add=(d,f,rel)=>{if(!f||vis.has(f.k))return;vis.add(f.k);out.push(Object.assign({},d,{k:f.k,e:f.e,rel}))};
 if(esBloqueo(i)){
  const nom=BLQ.filter(d=>d.re.test(t));
  nom.forEach(d=>add(d,busca(C,d.m,d.b),true));
  BLQ.forEach(d=>add(d,busca(C,d.m,d.b),false));
  EST.forEach(d=>add(d,busca(C,d.m,d.b),false))}
 /* resto de OT (y además en bloqueos): todas las señales relacionadas con la OT y las que cita la IA */
 try{if(typeof otRelSig=="function"){const A=otRelSig(i);(A&&A.rel||[]).forEach(x=>{const b=x.S&&(x.S.led||x.S.b);if(b)add({g:"OT",eq:x.S.t||""},busca(C,x.mod,b),true)})}}catch(e){}
 const o=iaDe(i.id);if(o){const T=JSON.stringify([o.resumen,o.eficaz,o.medir,o.tramos]).toUpperCase();
  const cod=[...new Set((T.match(/\b[A-Z]{1,4}\d?-[A-Z]{1,3}\d+(?:\.\d+)?\b/g)||[]).filter(c=>!/^[EP]-A\d+$/.test(c)&&!/-X\d/.test(c)&&!/-W\d/.test(c)))];
  cod.forEach(c=>{const k=Object.keys(C).find(x=>JSON.stringify(C[x].n).indexOf('"+'+c+'"')>=0);if(k)add({g:"OT",eq:""},{k,e:C[k]},true)})}
 return out.slice(0,16)}

/* ---------- recorrido origen → destino ---------- */
const nom=t=>{try{return (window.nombreElemento&&window.nombreElemento(String(t).replace(/^\+/,"")))||""}catch(e){return ""}};
const zonaDe=t=>{const pre=String(t||"").replace(/^\+/,"").split(/[-:]/)[0];try{return (typeof elZona=="function"&&elZona(t))||null}catch(e){return null}};
const Z0={E:"+E-X68:2 (0 V, hilo 205)",P:"+P-X92:2 (0 V, hilo 205)",C:"+C-X51:2 (0 V, hilo 205)",C4:"+C-X51:2 (0 V, hilo 205)",IT:"+IT-X51:2 (0 V, hilo 205)",ET:"+ET-X51:2 (0 V, hilo 205)",
 CO:"+IT-X51:2 (0 V, hilo 205)",H:"+H-X51:30 (0 V, hilo 205)",T:"+H-X51:30 (0 V, hilo 205)",R:"+IT-X50:2 (0 V, hilo 205)",CBTH:"+E-X61:21 (0 V PBB, hilo 205)",SS:"+E-X68:2 (0 V, hilo 205)",MT:"+E-X68:2 (0 V, hilo 205)"};
const pre=t=>String(t||"").replace(/^\+/,"").split(/[-:]/)[0];
function via(n){return (n.v||[]).map(v=>v.m?`manguera ${v.m}${v.t?" ("+v.t+")":""}${v.d?" cond. "+v.d:""}`:v.h?`hilo ${v.h}${v.c?" "+v.c:""}`:"").filter(Boolean).join(" · ")}
function etiqueta(n,d){const t=String(n.t||"").replace(/^\+/,"");
 if(n.k=="B")return {p:`${t}:${n.p}`,z:pre(t),n:"Borna "+(nom(t)||"del regletero")};
 if(n.k=="E"){const nm=t?(nom(t)||(/^CBTH:/.test(t)?"Contacto del equipo en el CBTH":"")):(d.el||"Contacto de campo");return {p:(t||d.el||"Contacto")+(n.ps&&n.ps.length?" ("+n.ps.join("-")+")":""),z:t?pre(t):(d.m||"E").charAt(0),n:nm,c:1}}
 if(n.k=="F")return {p:`${t}${n.p?":"+n.p:""}`,z:pre(t),n:nom(t)||"Elemento de campo",c:1};
 if(n.k=="M")return {p:`${n.l||"UT"} de ${(d.m||"E").charAt(0)=="P"?"P-A":"E-A8"}`,z:(d.m||"E").charAt(0)=="P"?"P":"E",n:"Salida de test del módulo de seguridad (tensión pulsada)",src:1,ut:1};
 if(n.k=="C")return {p:`+24 V${n.w?" · hilo "+n.w:""}`,z:(d.m||"E").charAt(0)=="P"?"P":"E",n:"+24 V común de mando",src:1};
 if(n.k=="P")return {p:t,z:"CBTH",n:/A\/A/.test(t)?"24 V común del sistema A/A":"24 V común del CBTH",src:1,ext:1};
 return null}
/* cable entre dos puntos seguidos del recorrido: el cableado guarda en cada nodo el hilo o la manguera de uno de sus lados
   (no siempre el mismo), así que se elige: entre armarios o hacia un elemento de campo → la manguera; dentro del armario → el hilo */
function enlace(a,b){if(!a)return "";const A=a.n||{},B=b&&b.n||{};const va=A.v||[],vb=B.v||[];const el=x=>x&&(x.k=="E"||x.k=="F")&&!/^\+?CBTH:/.test(x.t||"");
 if(!b)return via({v:va.filter(v=>v.h).concat(va.filter(v=>v.m)).slice(0,1)});
 const cruza=el(A)||el(B)||(a.z!==b.z);
 const pref=v=>cruza?!!v.m:!!v.h;
 let c=va.filter(pref);if(!c.length)c=vb.filter(pref);
 if(!c.length){if(!cruza&&a.z=="CBTH"&&b.z=="CBTH")return "cableado interno del CBTH (ver plano del CBTH)";if(el(A))return "";c=va.length?va:vb}
 return via({v:c.slice(0,1)})}
function cadena(d){const e=d.e;const ns=(e.n||[]).filter(n=>n.k!="?"&&n.k!="C");/* el común (hilo 189…) ya sale en su primera borna */const notas=(e.n||[]).filter(n=>n.k=="?").map(n=>n.x).filter(Boolean);
 const rev=ns.slice().reverse();const pasos=[];
 rev.forEach(n=>{const L=etiqueta(n,d);if(!L)return;pasos.push(Object.assign(L,{f:n.f||e.f,n0:n}))});
 /* destino: la entrada del PLC (o la borna del CBTH en las señales que van al CBTH) */
 if(e.m!="AUX"){let led="";try{const R=RUTAS[e.m];const S=R&&R.s.find(x=>x.led==e.b);if(S)led=`mód. ${S.k} · LED ${S.l}`}catch(x){}
  pasos.push({p:`${e.m} borna IN ${e.b}`,z:e.m.charAt(0),n:`Entrada del PLC ${e.c||""} «${e.d}»${led?" · "+led:""}`,f:e.f,dst:1})}
 pasos.forEach((p,j)=>{const q=pasos[j+1];p.sale=q?(q.dst?enlace({n:p.n0,z:p.z},null):enlace({n:p.n0,z:p.z},{n:q.n0,z:q.z})):""});
 /* fase: hasta el contacto = tensión de origen; después del contacto = señal */
 let pas=false;pasos.forEach(p=>{p.lado=pas?"sig":"src";if(p.c)pas=true});
 if(!pasos.some(p=>p.c))pasos.forEach(p=>p.lado=p.src?"src":"sig");
 return {pasos,notas}}
function medir(p,d){const z0=d.ref0&&(p.z=="CBTH")?d.ref0:(Z0[p.z]||Z0.E);
 if(p.c)return `Contacto · en tensión: roja en cada borna del contacto, negra en <b>${esc(z0)}</b>: 24 V en las dos = cerrado · 24 V solo en la de llegada = abierto. Sin tensión: <b>Ω</b> entre sus bornas, cerrado ≈ 0 Ω · abierto = OL.`;
 const v=p.lado=="src"?(p.ut?"≈ 24 V⎓ pulsada (tensión de test; el polímetro puede oscilar)":"24 V⎓ siempre (origen de la señal)"):(d.on||"24 V⎓ con el contacto cerrado · 0 V abierto");
 return `Polímetro <b>V⎓</b> · roja en <b>${esc(p.p)}</b> · negra en <b>${esc(z0)}</b> · debe marcar <b>${esc(v)}</b>`}

/* ---------- HTML ---------- */
function filaZ(z){const U=zonaDe(z+"-X1")||{c:z,k:"#757575"};return `<span class="icz" style="background:${U.k||"#757575"}">${esc(U.c||z)}</span>`}
function senalHTML(d,ix,i){const e=d.e,{pasos,notas}=cadena(d);let ult="";
 const tit=d.eq||e.d;const sub=e.m=="AUX"?`${d.eq?e.d+" · ":""}folio ${e.f}`:`${e.m} · ${e.c||""} IN ${e.b} · «${e.d}» · folio ${e.f}`;
 const pl=f=>f?`<button class="gpl icpl" aria-label="Ver plano folio ${f}" onclick="event.preventDefault();event.stopPropagation();gPlano('PAS',${f})">${typeof IC=="function"?IC('plans'):"📄"}<small>${f}</small></button>`:"";
 const filas=pasos.map((p,j)=>{const sep=p.z!==ult&&j>0;ult=p.z;const prev=pasos[j-1],next=pasos[j+1];
  return `${sep?`<div class="icsep"></div>`:""}<div class="icp${p.c?" icc":""}${p.dst?" icd":""}"><div class="icpt">${filaZ(p.z)}<b class="icar">→</b> ${esc(p.n)} <span class="icb">${esc(p.p)}</span>${pl(p.f)}</div>
   <div class="icl"><span class="ick">Llega desde</span><span>${prev?esc(prev.p)+(prev.sale?" · "+esc(prev.sale):""):(p.src?"origen de tensión":"origen")}</span></div>
   <div class="icl"><span class="ick">Sale a</span><span>${next?esc(next.p)+(p.sale?" · por "+esc(p.sale):""):"destino (fin del recorrido)"}</span></div>
   <div class="icl icm"><span class="ick">Medir</span><span>${medir(p,d)}</span></div></div>`}).join("");
 return `<details class="ics${d.rel?" icrel":""}"${d.rel&&ix<3?" open":""}><summary><b>${d.rel?"🎯 ":""}${esc(tit)}</b><br><small class="mu">${esc(sub)}</small></summary>
  ${d.o?`<div class="icor"><b>Origen en el equipo:</b> ${esc(d.o)}</div>`:""}
  ${alTxt(d)}
  ${filas}
  ${notas.length?`<div class="mu icn">${notas.map(esc).join("<br>")}</div>`:""}
  ${d.on&&e.m!="AUX"?`<div class="icor"><b>Lectura en el PLC:</b> ${esc(d.on)}</div>`:""}</details>`}
function alTxt(d){if(!d.al||!d.al.length)return "";const C=window.RCS_AL||[];
 const L=d.al.map(c=>{const x=C.find(y=>y.c==c);return x?`<b>${esc(c)}</b> ${esc(x.t)}`:""}).filter(Boolean);
 return L.length?`<div class="icor"><b>Magelis / RCS:</b> ${L.join(" · ")}</div>`:""}
function tramosIA(o){const T=(o&&o.tramos)||[];if(!T.length)return "";
 return `<div class="anal">🤖 Tramos del lado de los equipos según los planos (${esc(o.lector||"IA")})</div>${T.map((t,n)=>`<div class="icp icia"><div class="icpt"><b class="icar">→</b> ${esc(t.senal||t.equipo||"Tramo")}${t.equipo&&t.senal?` <span class="mu">· ${esc(t.equipo)}</span>`:""}</div>
  ${t.recorrido?`<div class="icl"><span class="ick">Recorrido</span><span>${esc(t.recorrido).replace(/→/g,"<b>→</b>")}</span></div>`:""}
  ${t.origen||t.destino?`<div class="icl"><span class="ick">Origen → destino</span><span>${esc(t.origen||"?")} <b>→</b> ${esc(t.destino||"?")}</span></div>`:""}
  ${t.roja||t.esperado?`<div class="icl icm"><span class="ick">Medir</span><span>Roja en <b>${esc(t.roja||"-")}</b> · negra en <b>${esc(t.negra||"-")}</b> · debe marcar <b>${esc(t.esperado||"-")}</b>${t.si_no?"<br>Si no: "+esc(t.si_no):""}</span></div>`:""}
  ${t.plano?`<div class="mu" style="font-size:11px">${esc(t.plano)}</div>`:""}</div>`).join("")}`}
function cajaHTML(i){const cons=window.insCons(i.id);
 if(!cons)return "";
 const S=senales(i),blq=esBloqueo(i),o=iaDe(i.id),est=typeof window.pcEstado=="function"?window.pcEstado():"";
 let h=`<summary><b>🔌 Inspección cable a cable completa · origen → destino</b> <span class="mu" style="font-weight:400">(${S.length} señal${S.length==1?"":"es"})</span></summary>
 <div class="icav">La actuación más eficaz está dada por consultada: se ha recalculado todo. ${blq?"Es un <b>bloqueo</b>: se despliega el interbloqueo completo desde el <b>CBTH</b> hasta los equipos de la <b>PBB</b> y las máquinas de servicios auxiliares <b>AAA</b> y <b>HZ</b>. ":""}Revisa en campo cada punto, del origen al destino; lo que nombra la OT va primero (🎯).</div>
 ${est?`<div class="icav icst">${esc(est)}</div>`:""}`;
 if(!S.length)h+=`<div class="gav">No hay recorridos de cableado en la app para lo que describe la OT. Usa los tramos de la IA de abajo y los planos elegidos.</div>`;
 const grupos=[];S.forEach(d=>{const g=d.g||"OT";let G=grupos.find(x=>x.g==g);if(!G){G={g,a:[]};grupos.push(G)}G.a.push(d)});
 let ix=0;grupos.forEach(G=>{const rel=G.a.some(d=>d.rel);
  h+=`<details class="icg"${rel||grupos.length==1?" open":""}><summary><b>${esc(GRP[G.g]||"Señales relacionadas con la OT")}</b> <span class="mu" style="font-weight:400">(${G.a.length})</span></summary>${G.a.map(d=>senalHTML(d,ix++,i)).join("")}</details>`});
 h+=tramosIA(o);
 if(!(o&&o.tramos&&o.tramos.length))h+=`<div class="mu" style="font-size:12px;margin:8px 0">${o&&o.modo=="completa"?"La IA no ha devuelto tramos del lado de los equipos.":"Los tramos del lado de los equipos (dentro del CBTH, AAA y HZ) los da la IA con los planos elegidos en «📐 Cotejo entre planos»."}</div>`;
 h+=`<div class="row" style="gap:8px;margin-top:10px;flex-wrap:nowrap"><button class="sec" style="flex:1" onclick="event.stopPropagation();insConsMarca(false)">↩ Solo la actuación más eficaz</button>
  <button class="sec" style="flex:1" onclick="event.stopPropagation();insCopia()">Pasar a la OT</button></div>
  <button class="pri" style="width:100%;margin-top:8px" onclick="event.stopPropagation();pcCompleta&&pcCompleta()">🔄 RECALCULAR IA completa <small>(Gemini · gratis)</small></button>`;
 return h}
function botonHTML(i){return window.insCons(i.id)?"":`<button class="sec icbtn" onclick="event.preventDefault();event.stopPropagation();insConsMarca(true)">✅ Actuación más eficaz consultada · sacar la inspección completa cable a cable (origen → destino)</button>`}

window.insCopia=function(){const i=otAct();if(!i)return;const S=senales(i);
 const t=`[Inspección cable a cable completa · origen → destino]\n`+S.filter(d=>d.rel).concat(S.filter(d=>!d.rel)).slice(0,8).map(d=>{const {pasos}=cadena(d);
  return `■ ${d.eq||d.e.d} (${d.e.m=="AUX"?d.e.b:d.e.m+" IN "+d.e.b}, folio ${d.e.f})\n`+pasos.map((p,j)=>`  ☐ → ${p.n} · ${p.p}${p.sale?" · por "+p.sale:""}`).join("\n")}).join("\n");
 i.guiada=(i.guiada?i.guiada+"\n\n":"")+t;try{sv("pbb_inc",inc);msg(`Inspección completa añadida a la OT ${i.orden}`)}catch(e){}};

/* ---------- pintado en la guía de campo de la OT ---------- */
function pintaGuia(){if(typeof view=="undefined"||view!="tec")return;const app=document.getElementById("app");if(!app)return;const i=otAct();
 let c=document.getElementById("ginsc");const ef=app.querySelector("details.gd.gef");
 /* botón en la caja ⭐ */
 if(ef&&i){let b=ef.querySelector(".icbtn");const bh=botonHTML(i);if(bh&&!b)ef.insertAdjacentHTML("beforeend",`<div class="icbw">${bh}</div>`);else if(!bh&&b)b.parentNode.remove()}
 if(!i||!window.insCons(i.id)){if(c)c.remove();return}
 if(!c){c=document.createElement("details");c.id="ginsc";c.className="card pucard icbox";c.open=true}
 const ref=ef||document.getElementById("anag")||document.getElementById("gpcot");
 if(ref){if(ref.nextElementSibling!==c)ref.insertAdjacentElement("afterend",c)}else if(c.parentNode!==app)app.appendChild(c);
 const k=i.id+"|"+JSON.stringify(iaDe(i.id)||{}).length+"|"+(typeof window.pcEstado=="function"?window.pcEstado():"");
 if(c.dataset.k!==k){const op=c.open;const ab=[...c.querySelectorAll("details")].map(x=>x.open);c.innerHTML=cajaHTML(i);c.open=op;c.dataset.k=k;
  const ds=[...c.querySelectorAll("details")];if(ab.length==ds.length)ds.forEach((x,n)=>x.open=ab[n])}}
function repinta(scroll){const c=document.getElementById("ginsc");if(c)c.dataset.k="";
 try{pintaGuia()}catch(e){console.warn("ins-completa",e)}
 try{if(typeof gPintaIns=="function"&&document.getElementById("g_ins"))gPintaIns()}catch(e){}
 try{pintaOv()}catch(e){}
 if(scroll)setTimeout(()=>{const x=document.getElementById("ginsc")||document.getElementById("insc-ov");if(x)x.scrollIntoView({block:"start",behavior:"smooth"})},150)}
window.insCompletaRepinta=()=>repinta(false);
let tg=0;const app0=document.getElementById("app");
if(app0)new MutationObserver(()=>{if(tg)return;tg=setTimeout(()=>{tg=0;try{pintaGuia()}catch(e){console.warn("ins-completa",e)}},140)}).observe(app0,{childList:true});
if(typeof vTec=="function"){const ov=vTec;window.vTec=vTec=function(){const r=ov.apply(this,arguments);try{pintaGuia()}catch(e){}return r}}
window.addEventListener("pc-ia",()=>setTimeout(()=>repinta(false),80));
setInterval(()=>{try{const c=document.getElementById("ginsc");if(c&&typeof window.pcEstado=="function"&&window.pcEstado())pintaGuia()}catch(e){}},1500);

/* ---------- inspección cable a cable de la tarjeta (botón PLC / llave) ---------- */
function pintaOv(){const ov=document.querySelector(".insov");if(!ov)return;const g=ov.querySelector("#g_ins");if(!g)return;const i=otAct();if(!i)return;
 let c=ov.querySelector("#insc-ov");const card=g.closest(".card")||g;
 if(!c){c=document.createElement("details");c.id="insc-ov";c.className="card icbox";c.open=true;card.insertAdjacentElement("beforebegin",c)}
 if(!window.insCons(i.id)){c.innerHTML=`<summary><b>🔌 Inspección completa · origen → destino</b></summary><div class="icav">Ahora se ve la inspección ligada a la actuación más eficaz. Si ya la has consultado, pulsa para recalcular todo y recorrer cada señal de la avería desde el origen hasta el destino${esBloqueo(i)?" (bloqueo: del CBTH a la PBB, AAA y HZ)":""}.</div>${botonHTML(i)}`;return}
 c.innerHTML=cajaHTML(i)}
if(typeof insOT=="function"){const oo=insOT;window.insOT=insOT=function(){const r=oo.apply(this,arguments);try{pintaOv()}catch(e){}return r}}

/* ---------- texto de los recorridos para la consulta de la IA ---------- */
window.insCadenaTexto=function(i){try{return senales(i).slice(0,10).map(d=>{const {pasos}=cadena(d);return `- ${d.eq||d.e.d}: `+pasos.map(p=>p.p+(p.sale?" ["+p.sale+"]":"")).join(" → ")+` (folio ${d.e.f})`}).join("\n")}catch(e){return ""}};

const st=document.createElement("style");st.textContent=`
.icbox{border:2px solid #2e7d32!important}.icbox>summary{cursor:pointer}
.icav{margin:8px 0;padding:7px 10px;border-left:4px solid #2e7d32;border-radius:6px;background:color-mix(in srgb,#2e7d32 8%,transparent);font-size:12.5px;line-height:1.4}
.icst{border-left-color:#1565c0;background:color-mix(in srgb,#1565c0 8%,transparent)}
.icg{margin:8px 0;padding:6px 8px;border:1px solid var(--bd);border-radius:10px}.icg>summary{cursor:pointer;font-size:13.5px}
.ics{margin:6px 0 6px 8px;padding:6px 8px;border-left:3px solid var(--bd);border-radius:6px}.ics.icrel{border-left-color:#ef6c00}.ics>summary{cursor:pointer;font-size:13px;line-height:1.3}
.icor{margin:6px 0;font-size:12.5px;line-height:1.4;padding-left:6px}
.icp{margin:5px 0 5px 10px;padding:6px 8px;border-radius:6px;background:color-mix(in srgb,var(--bd) 35%,transparent);font-size:12.5px}
.icp.icc{background:color-mix(in srgb,#ef6c00 12%,transparent)}.icp.icd{background:color-mix(in srgb,#1565c0 12%,transparent)}.icp.icia{background:color-mix(in srgb,#1565c0 7%,transparent)}
.icpt{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;font-weight:600;line-height:1.3}
.icb{font-family:ui-monospace,Menlo,monospace;font-size:12px;white-space:nowrap;padding:1px 5px;border-radius:4px;background:var(--card)}
.icz{color:#fff;font-size:10.5px;font-weight:800;border-radius:999px;padding:1px 7px;white-space:nowrap}
.icpl{margin-left:auto}
.icl{display:grid;grid-template-columns:7.2em 1fr;gap:6px;margin-top:3px;padding-left:12px;line-height:1.35}.ick{opacity:.7;font-size:11.5px;white-space:nowrap}
.icm span:last-child{overflow-wrap:anywhere}
.icar{color:var(--ac,#ff6a13);font-weight:900}
.icsep{border-top:2px dashed var(--bd);margin:8px 0 4px 10px}
.icn{font-size:11.5px;margin:6px 0 0 10px}
.icbw{margin-top:8px}.icbtn{width:100%;white-space:normal;line-height:1.3;border:1.5px solid #2e7d32!important}`;document.head.appendChild(st);
setTimeout(()=>{try{pintaGuia()}catch(e){}},300);
})();
