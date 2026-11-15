/* ===== v492 (v493: simulación del recogedor; caja del croquis ajustada al dibujo): PBB BLOQUEADA POR MANGUERA 400 Hz EXTENDIDA · PRIMERA ACTUACIÓN RÁPIDA EN CAMPO CON CROQUIS (15/11/2026) =====
   OT de cualquier tipo (HZ o PAS) cuyo aviso diga manguera 400 Hz extendida / PAS bloqueada por manguera / recogedor.
   Cotejo de planos (ESQUEMA GENERAL folios 63-65 y 85):
    · Señal: contacto «-400HZ» 13-14 del recogedor · P-X92:8 (hilo 336, +24 V) → 14-13 → P-X92:18 (hilo 3383) → P-A5 IN 2.1
      (DIN02 «400Hz CABLE EXTENSION», módulo 1 LED 2). Manguera recogida → LED apagado. Manguera fuera → LED encendido → bloqueo.
    · E-A5 = cabecera del módulo de seguridades (US 1.1 · UM 1.2 · US 2.1, folio 63): alimentación, no lleva la señal de la manguera.
    · E-A6 = salidas de seguridad (folio 64): mód. 1 LED 1 bobina E-K1 variadores (borna 1.1) · LED 2 bobina E-K24 frenos traslación (2.1).
      Con el bloqueo, el PLC no da la orden de traslación (deducción: no hay programa del PLC). Esas salidas NO se puentean nunca.
    · Desbloqueo en el PLC: la entrada se ACTIVA con la manguera fuera; un puente a +24 V la mantendría activa. Lo que libera es
      SOLTAR Y AISLAR el hilo 3383 de P-A5 2.1 (o de P-X92:18), con la manguera COMPROBADA recogida. PBB 507: no aplica (otra señal).
   Se muestra en la guía de campo de la OT (caja roja, tras «Seguridad antes de intervenir») y marca la tarjeta de la OT. ===== */
(function(){
"use strict";
const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const MANG=/(manguera|cable)( de)?( (del? )?(400 ?hz|400|hz))?[^.]{0,25}(extendid|fuera|sin recoger|no recog|desenrollad)|recogedor|enroll|enrrol|bloque\w*[^.]{0,30}(manguera|cable (de )?400)|(manguera|cable (de )?400)[^.]{0,30}bloque/;
const txt=i=>nrm([i&&i.desc,i&&i.def,i&&i.com,i&&i.obs].filter(Boolean).join(" "));
const aplica=i=>{try{return !!i&&i.estado!="cerrada"&&String(i.pos)!="507"&&!(typeof REMOTAS!="undefined"&&REMOTAS.has(String(i.pos)))&&MANG.test(txt(i))}catch(e){return false}};
window.manguera400OT=aplica;

/* ---------- croquis: recogedor (campo) → bornero P-X92 → P-A5 (pupitre) · E-A5 / E-A6 (armario eléctrico) ---------- */
function croquis(){return `<svg class="m4k" viewBox="0 0 400 468" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Croquis del bloqueo por manguera 400 Hz">
<rect x="0" y="0" width="400" height="468" rx="10" class="bg"/>
<!-- zonas -->
<line x1="10" y1="132" x2="390" y2="132" class="zona"/><line x1="10" y1="322" x2="390" y2="322" class="zona"/>
<text x="16" y="22" class="zt">CAMPO · RECOGEDOR MANGUERA 400 Hz</text>
<text x="16" y="150" class="zt">ARMARIO DEL PUPITRE · folio 85</text>
<text x="16" y="340" class="zt">ARMARIO ELÉCTRICO · folios 63-65</text>
<!-- tambor del recogedor -->
<circle cx="70" cy="78" r="38" class="tam"/><circle cx="70" cy="78" r="26" class="tam2"/><circle cx="70" cy="78" r="6" class="eje"/>
<path d="M100 100 q14 8 16 18" class="mang"/>
<text x="14" y="128" class="mu">enrollar a tope desde AO (IN)</text>
<!-- leva y contacto -400HZ -->
<path d="M108 60 l18 -6 l4 10 z" class="leva"/>
<rect x="150" y="40" width="96" height="62" rx="6" class="caja"/>
<text x="198" y="56" class="b c">-400HZ</text>
<circle cx="170" cy="82" r="4" class="pto"/><circle cx="226" cy="82" r="4" class="pto"/>
<line x1="170" y1="82" x2="222" y2="70" class="sw"/>
<text x="164" y="98" class="mu e">14</text><text x="232" y="98" class="mu">13</text>
<text x="262" y="60" class="s">Manguera fuera →</text><text x="262" y="74" class="s">contacto CERRADO</text>
<text x="262" y="92" class="s ok">Recogida a tope →</text><text x="262" y="106" class="s ok">contacto ABIERTO</text>
<!-- hilos campo → pupitre -->
<path d="M170 86 V196" class="h24"/><path d="M226 86 V252" class="hs"/>
<text x="160" y="176" class="mu e">336</text><text x="232" y="176" class="mu">3383</text>
<!-- bornero P-X92 -->
<rect x="140" y="182" width="120" height="84" rx="5" class="bor"/>
<text x="200" y="176" class="b c">P-X92</text>
<rect x="158" y="190" width="24" height="24" rx="3" class="bn"/><text x="170" y="207" class="b c">8</text>
<rect x="214" y="240" width="24" height="24" rx="3" class="bn"/><text x="226" y="257" class="b c">18</text>
<text x="128" y="206" class="s e">+24 V</text>
<!-- P-X92:18 → P-A5 IN 2.1 -->
<path d="M238 252 H274" class="hs"/>
<!-- módulo P-A5 -->
<rect x="276" y="160" width="114" height="150" rx="6" class="mod"/>
<rect x="284" y="168" width="98" height="66" rx="4" class="led"/>
<text x="333" y="183" class="b dk c">P-A5 · mód. 1</text>
<circle cx="302" cy="198" r="5" class="lo"/><text x="312" y="202" class="s dk">1</text>
<circle cx="346" cy="198" r="6" class="lon"/><text x="356" y="202" class="b dk">2</text>
<circle cx="302" cy="220" r="5" class="lo"/><text x="312" y="224" class="s dk">3</text>
<circle cx="346" cy="220" r="5" class="lo"/><text x="356" y="224" class="s dk">4</text>
<rect x="284" y="240" width="40" height="24" rx="3" class="bn on"/><text x="304" y="257" class="b c">2.1</text>
<text x="332" y="250" class="s">IN02</text><text x="332" y="262" class="s">DIN02</text>
<text x="333" y="284" class="s c">LED 2 encendido</text><text x="333" y="298" class="s c">= manguera fuera</text>
<!-- hilo soltado -->
<g class="corte"><line x1="248" y1="242" x2="266" y2="262"/><line x1="266" y1="242" x2="248" y2="262"/></g>
<text x="16" y="292" class="w">SOLTAR Y AISLAR hilo 3383</text><text x="16" y="306" class="w">de P-A5 2.1 (no puentear)</text>
<!-- armario eléctrico -->
<path d="M333 310 V352" class="prog"/><text x="340" y="342" class="s">programa</text><text x="340" y="353" class="s">PLC (ded.)</text>
<rect x="12" y="356" width="112" height="100" rx="6" class="saf"/>
<text x="68" y="374" class="b c">E-A5</text><text x="68" y="390" class="s c">cabecera seguridad</text>
<text x="68" y="408" class="s c">US 1.1 · UM 1.2</text><text x="68" y="422" class="s c">solo alimentación</text>
<text x="68" y="440" class="s c ok">US / UM</text><text x="68" y="452" class="s c ok">encendidos</text>
<rect x="132" y="356" width="258" height="100" rx="6" class="saf"/>
<text x="142" y="374" class="b">E-A6 · mód. 1 · salidas seguridad</text>
<circle cx="150" cy="394" r="5" class="lo2"/><text x="162" y="398" class="s">LED 1 · 1.1 · E-K1 variadores</text>
<circle cx="150" cy="414" r="5" class="lo"/><text x="162" y="418" class="s">LED 2 · 2.1 · E-K24 frenos trasl.</text>
<text x="142" y="436" class="w">NO PUENTEAR estas salidas:</text><text x="142" y="450" class="w">soltaría frenos sin control</text>
</svg>`}

function cardM(i){return `<div class="pucab">🔌 PRIMERA ACTUACIÓN EN CAMPO · PBB bloqueada por manguera 400 Hz extendida · no traslada</div>
<div class="puac qkp"><b>1º · EN EL EQUIPO (lo más rápido):</b> terminar de enrollar la manguera desde el <b>armario exterior AO</b> (botón IN, mantenido) hasta el final del recorrido, sin conector en el avión.</div>
<div class="puac qkp"><b>2º · EN EL RECOGEDOR:</b> que la última vuelta quede bien asentada y la leva accione el contacto <b>-400HZ</b> (13-14). Revisar palanca o rodillo, tope, soporte flojo y suciedad. El LED 2 del módulo 1 de <b>P-A5</b> (pupitre) debe <b>apagarse</b> y la PBB vuelve a trasladar.</div>
<div class="puac qkp"><b>3º · SI NO, SEÑAL EN EL PUPITRE (P-A5, folio 85):</b> con la manguera <b>recogida</b>, medir entre <b>P-A5 2.1</b> (hilo 3383) y 0 V → debe dar <b>0 V</b>. Si da <b>24 V</b>: contacto -400HZ pegado o hilo 3383 en contacto con +24 V (P-X92:8, hilo 336).</div>
<div class="puac qkp"><b>4º · DESBLOQUEO PROVISIONAL EN EL PLC:</b> con la manguera <b>COMPROBADA recogida</b> y el LED aún encendido, <b>soltar y aislar el hilo 3383 de la borna IN 2.1 de P-A5</b> (o en P-X92:18). El LED se apaga y la PBB traslada. <b>No puentear</b>: esta entrada se activa con la manguera fuera; un puente a +24 V la dejaría bloqueada.</div>
<div class="puac qkp"><b>Cotejo E-A5 / E-A6 (armario eléctrico):</b> E-A5 es la cabecera del módulo de seguridades (alimentación US/UM, folio 63): sus LED de alimentación deben estar encendidos; no lleva esta señal. En E-A6 (folio 64), al pedir traslación ya desbloqueada debe encenderse el <b>LED 2 del mód. 1 (E-K24 frenos de traslación)</b>, con el LED 1 (E-K1 variadores) encendido. Si con P-A5 2.1 apagado E-K24 no entra, la causa es otra: guía «No traslada». <b>Las salidas de E-A6 no se puentean nunca.</b></div>
<div class="card gcroq m4box" style="margin-top:8px"><div class="gcrh">🔌 Croquis · recogedor → P-X92 → P-A5 · E-A5 / E-A6</div>${croquis()}</div>
<div class="gsim m4sim" data-sim="m400"></div>
<div class="pucond"><b>Condiciones:</b><ol><li>Manguera comprobada recogida y conector fuera del avión antes de soltar el hilo.</li><li>Coordinar con CGA / Responsable de Turno y anotar en la OT la hora y el hilo soltado.</li><li>Trasladar en MANUAL, despacio y con un compañero vigilando la manguera y el recogedor.</li><li>Reponer el hilo 3383 al reparar el contacto -400HZ. Prueba final: sacar unos metros (OUT) → LED encendido y la PBB no traslada; recoger desde el AO → LED apagado y traslada. No cerrar la OT con el hilo suelto.</li></ol></div>`}


/* ---------- v493: simulación en movimiento del recogedor y del contacto -400HZ ----------
   El palpador (rodillo) apoya sobre la última capa de manguera enrollada. Al quedar enrollada a tope, el radio de la bobina
   sube el rodillo, el balancín baja y PISA el pulsador del contacto -400HZ → 13-14 ABIERTO → P-A5 2.1 a 0 V → LED 2 apagado
   → traslación permitida. Con la manguera fuera el contacto queda libre (13-14 CERRADO) → 24 V en P-A5 2.1 → PBB bloqueada.
   (Representación del principio: palpador o leva según el montaje de cada recogedor.) */
function sim(el){
 if(el.dataset.ok)return;el.dataset.ok=1;
 el.innerHTML=`<div class="gsim-h"><b>▶ Simulación del recogedor y del contacto -400HZ</b><span class="gsim-row m4row"></span></div>
 <svg viewBox="0 0 340 214" role="img" aria-label="Simulación del recogedor de la manguera 400 Hz y del contacto -400HZ"></svg>
 <div class="gsim-st"></div>
 <div class="gsim-bt"><button data-a="p">⏸ Pausa</button><button data-a="in">⟲ Recoger (IN · AO)</button><button data-a="out">⟳ Sacar (OUT)</button><button data-a="c">↻ Ciclo</button></div>
 <div class="mu" style="font-size:11px;margin-top:4px">El rodillo palpador apoya en la última capa de manguera. Solo con la manguera <b>enrollada a tope</b> el balancín pisa el pulsador del contacto <b>-400HZ</b>: 13-14 se abre, P-A5 2.1 queda a 0 V (LED 2 apagado) y la PBB puede trasladar. Si queda la última vuelta montada o el palpador desajustado, no llega a pisar y la PBB sigue bloqueada: actuar en el recogedor.</div>`;
 const NS="http://www.w3.org/2000/svg",svg=el.querySelector("svg"),row=el.querySelector(".m4row"),st=el.querySelector(".gsim-st");
 const H=(t,a,tx)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);if(tx!=null)e.textContent=tx;svg.appendChild(e);return e};
 const CX=78,CY=100,R0=20,RMAX=46,RF=52,GY=200;
 H("rect",{x:0,y:0,width:340,height:214,rx:10,class:"s-bg"});
 H("line",{x1:6,y1:GY,x2:334,y2:GY,class:"s-suelo"});
 H("text",{x:10,y:16,class:"s-t"},"RECOGEDOR (lado)");
 /* bastidor y tambor */
 H("path",{d:`M${CX-30} ${GY} L${CX} ${CY} L${CX+30} ${GY}`,class:"s-bast"});
 const bob=H("circle",{cx:CX,cy:CY,r:(R0+RMAX)/2,class:"s-bob"});
 const cap=H("circle",{cx:CX,cy:CY,r:RMAX,class:"s-cap"});
 H("circle",{cx:CX,cy:CY,r:RF,class:"s-brida"});
 const rad=H("g",{});[0,60,120].forEach(a=>{const l=document.createElementNS(NS,"line");l.setAttribute("x1",CX-R0*Math.cos(a*Math.PI/180));l.setAttribute("y1",CY-R0*Math.sin(a*Math.PI/180));l.setAttribute("x2",CX+R0*Math.cos(a*Math.PI/180));l.setAttribute("y2",CY+R0*Math.sin(a*Math.PI/180));l.setAttribute("class","s-rad");rad.appendChild(l)});
 H("circle",{cx:CX,cy:CY,r:R0,class:"s-nuc"});H("circle",{cx:CX,cy:CY,r:4,class:"s-eje"});
 /* manguera libre y conector */
 const hose=H("path",{class:"s-hose"});const con=H("rect",{width:22,height:12,rx:3,class:"s-con"});
 H("text",{x:330,y:GY+11,class:"s-m e"},"hacia el avión →");
 /* palpador y balancín */
 const PX=150,PY=52;
 const arm=H("path",{class:"s-arm"});const rod=H("circle",{r:7,class:"s-rod"});H("circle",{cx:PX,cy:PY,r:4,class:"s-piv"});
 H("text",{x:PX,y:PY-10,class:"s-m c"},"pivote");
 /* contacto -400HZ */
 const TL=40,tyAt=e=>{const r=R0+(RMAX-R0)*(1-e),ry=CY-r-7,rx=CX+8;return PY+(PY-ry)*TL/(PX-rx)};
 const TOP=tyAt(.03);/* el balancín pisa el pulsador con la manguera enrollada a tope (últimos ~3 %) */
 const SX=PX+TL-17,SY=Math.round(TOP)+9;
 const pls=H("rect",{x:SX+12,width:10,class:"s-pls"});
 H("rect",{x:SX,y:SY,width:52,height:44,rx:5,class:"s-sw"});
 H("text",{x:SX+26,y:SY+13,class:"s-b c"},"-400HZ");
 H("circle",{cx:SX+12,cy:SY+32,r:3,class:"s-pto"});H("circle",{cx:SX+40,cy:SY+32,r:3,class:"s-pto"});
 const cnt=H("line",{x1:SX+12,y1:SY+32,class:"s-cnt"});
 H("text",{x:SX+6,y:SY+42,class:"s-m"},"14");H("text",{x:SX+36,y:SY+42,class:"s-m"},"13");
 /* hilos al pupitre */
 H("path",{d:`M${SX+12} ${SY+44} V${SY+60} H242`,class:"s-h24"});
 const h3383=H("path",{d:`M${SX+40} ${SY+44} V${SY+52} H242`,class:"s-hs"});
 H("text",{x:SX+2,y:SY+72,class:"s-m"},"336 · +24 V");H("text",{x:SX+37,y:SY+56,class:"s-m e"},"3383");
 /* P-A5 y estado de la PBB */
 H("rect",{x:244,y:40,width:90,height:86,rx:6,class:"s-mod"});H("rect",{x:249,y:46,width:80,height:42,rx:4,class:"s-led"});
 H("text",{x:289,y:59,class:"s-b c s-dk"},"P-A5 · mód. 1");
 H("circle",{cx:263,cy:75,r:4,class:"s-lo"});const led=H("circle",{cx:289,cy:75,r:6,class:"s-lo"});H("circle",{cx:315,cy:75,r:4,class:"s-lo"});
 H("text",{x:289,y:86,class:"s-m c s-dk"},"LED 2");
 const v=H("text",{x:289,y:104,class:"s-b c"},"");H("text",{x:289,y:118,class:"s-m c"},"en borna IN 2.1");
 const pbbR=H("rect",{x:244,y:134,width:90,height:40,rx:6});const pbb1=H("text",{x:289,y:151,class:"s-b c"},"");const pbb2=H("text",{x:289,y:165,class:"s-b c"},"");
 const pct=H("text",{x:10,y:GY+11,class:"s-m"},"");
 let ext=1,ang=0,modo="c",dir=-1,pausa=false,espera=0,last=performance.now(),prev=null;
 function pinta(){
  const r=R0+(RMAX-R0)*(1-ext);
  bob.setAttribute("r",(R0+r)/2);bob.setAttribute("stroke-width",Math.max(.1,r-R0));cap.setAttribute("r",r);
  rad.setAttribute("transform",`rotate(${ang} ${CX} ${CY})`);cap.style.strokeDashoffset=String(-ang*.6);
  /* manguera libre: sale por abajo del tambor y va por el suelo */
  const xe=118+196*ext;const ys=CY+r;
  hose.setAttribute("d",`M${CX} ${ys} C${CX+34} ${ys},${CX+30} ${GY-6},${CX+60} ${GY-6} L${Math.max(CX+60,xe)} ${GY-6}`);
  con.setAttribute("x",Math.max(CX+60,xe)-2);con.setAttribute("y",GY-12);
  /* rodillo sobre la última capa (arriba) y balancín */
  const ry=CY-r-7,rx=CX+8;rod.setAttribute("cx",rx);rod.setAttribute("cy",ry);
  const f=TL/(PX-rx),ty=PY+(PY-ry)*f,tx=PX+TL;
  arm.setAttribute("d",`M${rx} ${ry} L${PX} ${PY} L${tx} ${ty}`);
  const pis=ty>=TOP;/* el balancín baja y pisa el pulsador */
  const ptop=Math.max(TOP,Math.min(SY-2,ty));pls.setAttribute("y",ptop);pls.setAttribute("height",SY-ptop+2);
  cnt.setAttribute("x2",pis?SX+38:SX+40);cnt.setAttribute("y2",pis?SY+20:SY+32);cnt.classList.toggle("abierto",pis);
  pct.textContent=`recogida ${Math.round((1-ext)*100)} %`;
  const on=!pis;
  if(on!==prev){prev=on;led.setAttribute("class",on?"s-lon":"s-lo");h3383.classList.toggle("vivo",on);
   v.textContent=on?"24 V":"0 V";v.setAttribute("class","s-b c "+(on?"s-rojo":"s-verde"));
   pbbR.setAttribute("class",on?"s-blq":"s-okb");pbb1.textContent=on?"TRASLACIÓN":"TRASLACIÓN";pbb2.textContent=on?"BLOQUEADA":"PERMITIDA";
   row.textContent=on?"Contacto 13-14 CERRADO":"Contacto PISADO · 13-14 ABIERTO";
   st.innerHTML=on?`<b>Manguera fuera</b> · contacto -400HZ libre → 24 V por el hilo 3383 → P-A5 LED 2 encendido → <b style="color:#e53935">PBB bloqueada, no traslada</b>.`:`<b>Manguera enrollada a tope</b> · el palpador pisa el contacto -400HZ → P-A5 2.1 a 0 V, LED 2 apagado → <b style="color:#2e9e44">la PBB puede trasladar</b>.`}
 }
 function paso(t){if(!el.isConnected)return;
  if(el.__oc===undefined){el.__oc=1;try{new IntersectionObserver(e=>{el.__vis=e[e.length-1].isIntersecting}).observe(el)}catch(x){}}
  const dt=Math.min(.05,(t-last)/1000);last=t;if(el.__vis===false){requestAnimationFrame(paso);return}
  if(!pausa){const vel=.16*dt;
   if(modo=="in")dir=-1;else if(modo=="out")dir=1;
   const n=Math.max(0,Math.min(1,ext+dir*vel));
   if(n!==ext){ang+=-dir*vel*2400;ext=n;espera=0}
   else if(modo=="c"){espera+=dt;if(espera>1.6){espera=0;dir=-dir}}}
  pinta();requestAnimationFrame(paso)}
 el.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;e.preventDefault();e.stopPropagation();const a=b.dataset.a,pb=el.querySelector('[data-a="p"]');
  if(a=="p"){pausa=!pausa;pb.textContent=pausa?"▶ Reanudar":"⏸ Pausa";return}
  pausa=false;pb.textContent="⏸ Pausa";modo=a;espera=0;el.querySelectorAll(".gsim-bt button").forEach(x=>x.classList.toggle("on",x===b&&a!="c"))});
 pinta();requestAnimationFrame(paso)}

/* ---------- guía de campo de la OT ---------- */
function pinta(){try{if(typeof view=="undefined"||view!="tec")return;const i=(typeof inc!="undefined"?inc:[]).find(x=>x.id==gOT);const old=document.getElementById("gm400");
 if(!aplica(i)){if(old)old.remove();return}if(old&&old.dataset.ot==String(i.id))return;if(old)old.remove();
 const d=document.createElement("div");d.id="gm400";d.dataset.ot=String(i.id);d.className="card pucard";d.innerHTML=cardM(i);
 const seg=document.querySelector('#app details.gd[data-k="SEG"]');if(seg)seg.insertAdjacentElement("afterend",d);else{const a=document.querySelector("#app details.gd");if(a)a.insertAdjacentElement("beforebegin",d);else return}
 d.querySelectorAll(".m4sim").forEach(sim)}catch(e){}}
if(typeof vTec=="function"){const o=vTec;window.vTec=vTec=function(){const r=o.apply(this,arguments);pinta();return r}}
setInterval(pinta,1500);

/* ---------- tarjeta de la OT (Inicio / Seguimiento): franja roja de primera actuación ---------- */
window.m400Va=function(id){const i=inc.find(x=>x.id==id);if(!i)return;gOT=id;if(typeof gSyncOT!="undefined")gSyncOT=id;if(typeof gTipoOT=="function")gTipo=gTipoOT(i);
 if(view!="tec")go("tec");else vTec();setTimeout(()=>{pinta();const d=document.getElementById("gm400");if(d)d.scrollIntoView({block:"start",behavior:"smooth"})},200)};
try{if(typeof window.card=="function"){const oc=window.card;window.card=function(i){let h=oc.apply(this,arguments);if(!aplica(i)||i.estado!="abierta"||/class="pact"/.test(h))return h;
 const ban=`<div class="pact" role="button" tabindex="0" onclick="event.stopPropagation();m400Va('${i.id}')"><span class="pacti">🔌</span><span>PRIMERA ACTUACIÓN EN CAMPO<small>manguera 400 Hz extendida · enrollar desde el AO</small></span><span class="pactv">›</span></div>`;
 h=h.replace(/(<b>PBB [^<]*<span class="tag">[^<]*<\/span>)/,`$1<span class="pactt" title="Primera actuación en campo">🔌</span>`);
 const re=/(<div class="mu">Inicio [\s\S]*?<\/div>)/;return re.test(h)?h.replace(re,"$1"+ban):h.replace(/(<p style="margin:6px 0">[\s\S]*?<\/p>)/,"$1"+ban)}}}catch(e){}

const st=document.createElement("style");st.textContent=`
.m4k{display:block;width:100%;height:auto;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
 --k-bg:#14171d;--k-tx:#e9ecf1;--k-mu:#9aa3b2;--k-bd:#59616e;--k-w:#ff3b30;--k-24:#ff9f0a;--k-s:#e6e6e6;--k-ok:#22c55e;--k-mod:#2f8f46;--k-led:#4fb3e0;--k-saf:#c9a400}
html.lt .m4k{--k-bg:#f4f5f7;--k-tx:#0b0d12;--k-mu:#4b5563;--k-bd:#6b7280;--k-w:#d11a10;--k-24:#c25e00;--k-s:#374151;--k-ok:#15803d;--k-mod:#3aa356;--k-led:#7cc7ea;--k-saf:#e0b800}
.m4k .bg{fill:var(--k-bg)}.m4k text{fill:var(--k-tx);font-size:10.5px}.m4k .b{font-weight:800;font-size:11px}.m4k .s{font-size:9.5px}.m4k .mu{fill:var(--k-mu);font-size:9.5px}
.m4k .c{text-anchor:middle}.m4k .e{text-anchor:end}.m4k .ok{fill:var(--k-ok)}.m4k .zt{font-weight:800;font-size:10px;fill:var(--k-mu)}.m4k .w{fill:var(--k-w);font-weight:800;font-size:10.5px}
.m4k .zona{stroke:var(--k-bd);stroke-width:1.5;stroke-dasharray:7 5}
.m4k .tam{fill:none;stroke:var(--k-bd);stroke-width:3}.m4k .tam2{fill:none;stroke:#111;stroke-width:9;opacity:.75}.m4k .eje{fill:var(--k-bd)}
.m4k .mang{fill:none;stroke:#111;stroke-width:7;stroke-linecap:round}html.lt .m4k .mang,html.lt .m4k .tam2{stroke:#222}
.m4k .leva{fill:var(--k-24)}.m4k .caja,.m4k .bor{fill:none;stroke:var(--k-bd);stroke-width:1.5}.m4k .pto{fill:var(--k-tx)}
.m4k .sw{stroke:var(--k-tx);stroke-width:3;stroke-linecap:round}
.m4k .h24{fill:none;stroke:var(--k-24);stroke-width:3}.m4k .hs{fill:none;stroke:var(--k-w);stroke-width:3;animation:m4p 1s steps(1,end) infinite}
.m4k .bn{fill:#0b0d12;stroke:var(--k-bd);stroke-width:1.2}.m4k .bn+text{fill:#fff}.m4k .bn.on{stroke:var(--k-w);stroke-width:2.5}
.m4k .mod{fill:var(--k-mod)}.m4k .led{fill:var(--k-led)}.m4k .dk{fill:#0b0d12}
.m4k .lo{fill:#6b7280}.m4k .lo2{fill:var(--k-ok)}.m4k .lon{fill:#fff7c2;stroke:var(--k-24);stroke-width:2;animation:m4l 1s steps(1,end) infinite}
.m4k .corte line{stroke:var(--k-w);stroke-width:3.5;stroke-linecap:round;animation:m4p 1s steps(1,end) infinite}
.m4k .prog{stroke:var(--k-mu);stroke-width:1.5;stroke-dasharray:3 4}.m4k .saf{fill:none;stroke:var(--k-saf);stroke-width:2.5}
.m4box{padding:10px!important}.m4box .m4k{max-width:420px;margin:0 auto}
.m4sim svg{--s-bg:#14171d;--s-tx:#e9ecf1;--s-mu:#9aa3b2;--s-bd:#59616e;--s-w:#ff3b30;--s-24:#ff9f0a;--s-ok:#22c55e}
html.lt .m4sim svg{--s-bg:#f4f5f7;--s-tx:#0b0d12;--s-mu:#4b5563;--s-bd:#6b7280;--s-w:#d11a10;--s-24:#c25e00;--s-ok:#15803d}
.m4sim svg{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;max-width:520px;margin:0 auto}
.m4sim .s-bg{fill:var(--s-bg)}.m4sim text{fill:var(--s-tx);font-size:9.5px}.m4sim .s-t{font-weight:800;fill:var(--s-mu)}.m4sim .s-b{font-weight:800;font-size:10px}.m4sim .s-m{fill:var(--s-mu);font-size:8.5px}
.m4sim .c{text-anchor:middle}.m4sim .e{text-anchor:end}.m4sim .s-dk{fill:#0b0d12}.m4sim .s-rojo{fill:var(--s-w)}.m4sim .s-verde{fill:var(--s-ok)}
.m4sim .s-suelo{stroke:var(--s-bd);stroke-width:2}.m4sim .s-bast{fill:none;stroke:var(--s-bd);stroke-width:5;stroke-linejoin:round}
.m4sim .s-brida{fill:none;stroke:var(--s-bd);stroke-width:3}.m4sim .s-nuc{fill:var(--s-bg);stroke:var(--s-bd);stroke-width:3}.m4sim .s-eje{fill:var(--s-bd)}.m4sim .s-rad{stroke:var(--s-bd);stroke-width:2.5}
.m4sim .s-bob{fill:none;stroke:#26292e}html.lt .m4sim .s-bob{stroke:#3a3d42}.m4sim .s-cap{fill:none;stroke:#555b63;stroke-width:1.5;stroke-dasharray:5 4}
.m4sim .s-hose{fill:none;stroke:#26292e;stroke-width:7;stroke-linecap:round}html.lt .m4sim .s-hose{stroke:#3a3d42}.m4sim .s-con{fill:var(--s-24)}
.m4sim .s-arm{fill:none;stroke:var(--s-24);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.m4sim .s-rod{fill:var(--s-bg);stroke:var(--s-24);stroke-width:3}.m4sim .s-piv{fill:var(--s-tx)}
.m4sim .s-sw{fill:none;stroke:var(--s-bd);stroke-width:1.5}.m4sim .s-pls{fill:var(--s-mu)}.m4sim .s-pto{fill:var(--s-tx)}
.m4sim .s-cnt{stroke:var(--s-tx);stroke-width:3;stroke-linecap:round}.m4sim .s-cnt.abierto{stroke:var(--s-ok)}
.m4sim .s-h24{fill:none;stroke:var(--s-24);stroke-width:2.5}.m4sim .s-hs{fill:none;stroke:var(--s-bd);stroke-width:2.5}.m4sim .s-hs.vivo{stroke:var(--s-w);animation:m4p 1s steps(1,end) infinite}
.m4sim .s-mod{fill:#2f8f46}.m4sim .s-led{fill:#7cc7ea}.m4sim .s-lo{fill:#6b7280}.m4sim .s-lon{fill:#fff7c2;stroke:var(--s-24);stroke-width:2;filter:drop-shadow(0 0 4px #ffd54f)}
.m4sim .s-blq{fill:color-mix(in srgb,var(--s-w) 22%,transparent);stroke:var(--s-w);stroke-width:2;animation:m4p 1s steps(1,end) infinite}.m4sim .s-okb{fill:color-mix(in srgb,var(--s-ok) 20%,transparent);stroke:var(--s-ok);stroke-width:2}
.m4sim .gsim-bt button.on{border-color:var(--ac);color:var(--ac);font-weight:700}
@keyframes m4p{0%{opacity:1}50%{opacity:.2}}@keyframes m4l{0%{fill:#fff7c2}50%{fill:#6b7280}}
@media (prefers-reduced-motion:reduce){.m4k .hs,.m4k .lon,.m4k .corte line{animation:none}}`;document.head.appendChild(st);
})();
