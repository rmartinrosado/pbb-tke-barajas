/* ===== v746: primera actuación (puente provisional de los contactos con avión) en OT de contacto con avión / atraque.
   ===== v744: barra de control de la animación (play / pausa / parar y velocidad).
   ===== v742: fallo con cualquiera de los dos contactos (elegir derecho / izquierdo), inductivos sin parpadeo, barra de
   velocidad y P-A5 más grande.
   ===== v741: simulación redibujada como el icono de atraque de la Magelis (avión de morro y PBB con fuelle, cabina, rotonda
   y túnel en línea ámbar), legible en modo claro y oscuro.
   ===== v740: GUÍA DE CAMPO · «ATRAQUE INCORRECTO» ajustado al MANUAL RCS (F8-690.0312-51, pág. 82-85) (22/11/2026) =====
   v737-v738: apartado nuevo (falso contacto con avión C-B51 / C-B52, simulación y croquis del puente en P-A5 1.1).
   v740: rehecho con el manual de operación RCS:
   · pág. 82 · Atraque correcto: el contacto con el avión SOLO con la unidad de traslación hacia delante (o hacia atrás).
   · pág. 83 · Ayuda al desatraque: la pantalla indica hacia dónde mover el joystick («Para desatracar: mover el joystick
     hacia atrás» si se atracó hacia delante; «hacia delante» si se atracó hacia atrás; flecha en Point & Go).
   · pág. 84 · Atraque incorrecto (alarma 115): contacto con cualquier otro movimiento (suelo basculante, altura, giro de la
     traslación o giro de cabina) o contacto durante el servicio tras activar la autonivelación sin contacto. Con la alarma
     TODOS los movimientos quedan bloqueados.
   · pág. 85 · Bypass de atraque incorrecto: botón NARANJA a la izquierda de la pantalla, mantenerlo pulsado y joystick hacia
     ATRÁS → la PBB se mueve a velocidad lenta ignorando cualquier alarma (solo operadores con experiencia). Autonivelación con
     la alarma: si ya estaba bien atracada puede autonivelar y dar servicio, pero la alarma vuelve al pasar a ON para desatracar.
   Cotejo con los inductivos de contacto (ESQUEMA rev. J folio 85/86): C-B51 derecho → P-A5 1.1 · C-B52 izquierdo → P-A5 4.4 ·
   brazo autonivelador C-B7 → P-A5 5.1. Dibujos rehechos con los del manual: tipos de atraque (✓ traslación · ✗ altura, giro de
   cabina, giro de traslación, suelo basculante), mensaje de ayuda al desatraque con el joystick, botón de bypass naranja y
   velocidad lenta (tortuga). ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const L=GUIA.tipos.PAS.s;if(L.some(s=>/^Atraque incorrecto/.test(s.t)))return;

/* iconos del manual */
const JOY=(x,y,dir)=>`<g transform="translate(${x},${y})"><circle r="13" class="aqjo"/><circle r="8" class="aqji"/><path d="M0 ${dir>0?-5:5} V${dir>0?5:-5}" class="aqja"/><path d="M-4 ${dir>0?1:-1} L0 ${dir>0?6:-6} L4 ${dir>0?1:-1}" class="aqja"/>
 <path d="M0 -11 l-2 3 h4z M0 11 l-2 -3 h4z M-11 0 l3 -2 v4z M11 0 l-3 -2 v4z" class="aqjt"/></g>`;
const BYP=(x,y)=>`<g transform="translate(${x},${y})"><rect x="0" y="0" width="58" height="26" rx="4" class="aqbyp"/><path d="M19 20 L29 5 L39 20 Z" class="aqbyt"/><text x="29" y="18" text-anchor="middle" class="aqbyx">!</text>
 <path d="M10 20 Q12 8 21 7 M37 7 Q46 8 48 20" class="aqbyc"/><path d="M46 16 L48 21 L51 16" class="aqbyc"/></g>`;
const TORT=(x,y)=>`<g transform="translate(${x},${y})"><ellipse cx="0" cy="0" rx="9" ry="5.5" class="aqtor"/><circle cx="10" cy="-1" r="3" class="aqtor"/><path d="M-6 4 v3 M6 4 v3" class="aqtorl"/></g>`;

/* ---------- 1) tipos de atraque (manual pág. 82 y 84) ---------- */
function tipos(){const X=(x,y)=>`<path d="M${x-9} ${y-9} L${x+9} ${y+9} M${x+9} ${y-9} L${x-9} ${y+9}" class="aqx"/>`;
 return `<svg class="atqv" viewBox="0 0 340 196" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tipos de atraque según el manual RCS">
 <text x="8" y="16" class="aqt aqok">✓ CORRECTO · pág. 82</text>
 <g transform="translate(70,98)"><rect x="-44" y="-6" width="88" height="12" rx="3" class="aqeje"/><circle r="9" class="aqrot"/><rect x="-52" y="-16" width="14" height="32" rx="3" class="aqrue"/><rect x="38" y="-16" width="14" height="32" rx="3" class="aqrue"/>
  <path d="M-62 -58 V58 M62 -58 V58" class="aqfl"/><path d="M-67 -50 L-62 -60 L-57 -50 M-67 50 L-62 60 L-57 50 M57 -50 L62 -60 L67 -50 M57 50 L62 60 L67 50" class="aqfl"/></g>
 <text x="8" y="174" class="aqm">Contacto SOLO con la</text><text x="8" y="186" class="aqm">traslación adelante/atrás</text>
 <line x1="150" y1="8" x2="150" y2="188" class="aqsep"/>
 <text x="158" y="16" class="aqt aqko2">✗ INCORRECTO · 115 · pág. 84</text>
 <g transform="translate(196,62)"><rect x="-24" y="-8" width="48" height="16" rx="3" class="aqtun2" transform="rotate(-12)"/><path d="M30 -24 V24 M26 -16 L30 -24 L34 -16 M26 16 L30 24 L34 16" class="aqfr"/>${X(-2,4)}<text x="0" y="40" text-anchor="middle" class="aqm">altura</text></g>
 <g transform="translate(290,62)"><circle r="12" class="aqcab2"/><rect x="-8" y="-24" width="16" height="12" class="aqcab2"/><path d="M-22 -8 A24 24 0 0 1 22 -8" class="aqfr"/><path d="M18 -14 L22 -8 L15 -6" class="aqfr"/>${X(0,0)}<text x="0" y="40" text-anchor="middle" class="aqm">giro de cabina</text></g>
 <g transform="translate(196,140)"><rect x="-20" y="-3" width="40" height="6" class="aqeje"/><rect x="-26" y="-9" width="8" height="18" rx="2" class="aqrue"/><rect x="18" y="-9" width="8" height="18" rx="2" class="aqrue"/><path d="M-26 -16 A28 28 0 0 1 26 -16" class="aqfr"/><path d="M21 -22 L26 -16 L19 -13" class="aqfr"/>${X(0,0)}<text x="0" y="28" text-anchor="middle" class="aqm">giro traslación</text></g>
 <g transform="translate(290,140)"><rect x="-28" y="-16" width="56" height="30" rx="3" class="aqcab2"/><path d="M-24 10 L24 2" class="aqsue"/><path d="M-30 4 Q-34 14 -26 18 M30 0 Q34 10 26 16" class="aqfr"/>${X(0,6)}<text x="0" y="28" text-anchor="middle" class="aqm">suelo basculante</text></g>
 <text x="158" y="186" class="aqm aqal2">Con la 115: TODO BLOQUEADO</text>
</svg>`}

/* ---------- 2) simulación del fallo y la actuación (falso contacto C-B51) ---------- */
const PASOS=["Fallo","Bypass","Desconectar","Aparcar","Reparar"];
/* v742: el fallo se simula con CUALQUIERA de los dos contactos (elegir C-B51 derecho / C-B52 izquierdo), los inductivos SIN
   parpadeo (rojo fijo = señal falsa), barra de VELOCIDAD de la PBB en cada paso y módulo P-A5 más grande. */
const LADO={R:{s:"C-B51",lado:"derecho",b:"1.1",din:"DIN01",x:"P-X92:12",h:"320",w:"P-W17",cx:142},L:{s:"C-B52",lado:"izquierdo",b:"4.4",din:"DIN08",x:"P-X92:7",h:"740",w:"P-W18",cx:94}};
const T2=(f)=>["L","R"].map(k=>f(LADO[k],k)).join("");
function sim(){return `<div class="atqw" data-s="1" data-l="R">
<div class="atql"><span>Sensor que falla:</span>${T2((o,k)=>`<button type="button" class="atqlb${k=="R"?" on":""}" data-l="${k}" onclick="atqLado(this)"><b>${o.s}</b>${o.lado}</button>`)}</div>
<div class="atqc"><button type="button" class="atqpl" onclick="atqPlay(this)" aria-label="Pausa">⏸</button><button type="button" class="atqst" onclick="atqStop(this)" aria-label="Parar">⏹</button>
 <span class="atqcl">Velocidad</span><input type="range" class="atqrg" min="1" max="5" step="1" value="3" oninput="atqVel(this)" aria-label="Velocidad de la animación"><b class="atqvt">normal</b></div>
<div class="atqb">${PASOS.map((t,k)=>`<button type="button" class="atqbt${k?"":" on"}" data-n="${k+1}" onclick="atqPaso(this)"><b>${k+1}</b>${t}</button>`).join("")}</div>
<svg class="atqv" viewBox="0 0 340 344" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simulación del falso contacto con avión y pasos para desatracar">
 <defs><marker id="atqar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e53935"/></marker>
  <marker id="atqag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1fa64a"/></marker></defs>
 <path d="M250 12 H60 C30 12 10 24 10 37 C10 50 30 62 60 62 H250" class="aqln"/>
 <path d="M22 32 q6 -6 13 -6 q-2 6 -9 9z M22 42 q6 6 13 6 q-2 -6 -9 -9z" class="aqln2"/>
 <path d="M104 62 V54 H132 V62" class="aqln"/><text x="60" y="41" class="aqt">AVIÓN</text><text x="136" y="58" class="aqm">puerta</text>
 <g class="v1 v3"><path d="M118 66 V104" class="aqdim" marker-start="url(#atqag)" marker-end="url(#atqag)"/><text x="124" y="88" class="aqt aqok">≈ 5 m · SIN CONTACTO</text></g>
 <g class="v2"><text x="10" y="74" class="aqt aqbyo">BYPASS + JOYSTICK ATRÁS</text><text x="10" y="86" class="aqm">velocidad lenta · ignora las alarmas</text></g>
 <g class="v4"><text x="10" y="74" class="aqt aqok">MANUAL · JOYSTICK ATRÁS</text><text x="10" y="86" class="aqm">giros y altura libres · vigilante</text></g>
 <g class="v5"><text x="10" y="74" class="aqt aqok">ATRACAR SOLO CON TRASLACIÓN</text><text x="10" y="86" class="aqm">al tocar: 243 y «joystick atrás»</text></g>
 <g class="aqpbb">
  <path d="M92 110 H144" class="aqbmp"/><path d="M96 114 H140 M96 118 H140 M96 122 H140" class="aqln"/>
  <rect x="90" y="126" width="56" height="32" rx="4" class="aqln"/><text x="118" y="146" text-anchor="middle" class="aqt">CABINA</text>
  <path d="M112 158 V162 M124 158 V162" class="aqln"/><circle cx="118" cy="171" r="9" class="aqln"/><circle cx="118" cy="171" r="2.5" class="aqln2"/>
  <g transform="rotate(38 118 171)"><rect x="109" y="181" width="18" height="38" rx="2" class="aqln"/><path d="M109 191 H127 M109 200 H127 M109 209 H127" class="aqln3"/></g>
  <text x="62" y="104" class="aqm">C-B52</text><text x="150" y="104" class="aqm">C-B51</text>
  ${T2((o,k)=>{const ot=k=="R"?LADO.L:LADO.R;return `<g class="l${k}">
   <circle cx="${ot.cx}" cy="110" r="6.5" class="aqok2"/>
   <g class="v1 v2"><circle cx="${o.cx}" cy="110" r="8" class="aqko"/>${k=="R"?`<text x="152" y="122" class="aqt aqko2">FALSO</text><text x="152" y="133" class="aqt aqko2">CONTACTO</text>`:`<text x="86" y="122" text-anchor="end" class="aqt aqko2">FALSO</text><text x="86" y="133" text-anchor="end" class="aqt aqko2">CONTACTO</text>`}</g>
   <g class="v3 v4"><circle cx="${o.cx}" cy="110" r="6.5" class="aqoff"/></g>
   <g class="v5"><circle cx="${o.cx}" cy="110" r="7" class="aqnew"/></g></g>`})}
 </g>
 <g class="v2">${TORT(40,206)}<path d="M44 118 V188" class="aqarr3" marker-end="url(#atqar)"/></g>
 <g class="v4"><path d="M44 118 V188" class="aqarr2" marker-end="url(#atqag)"/></g>
 <g class="v3"><g class="lR"><path d="M148 118 L174 148" class="aqarr" marker-end="url(#atqar)"/><g class="aqbl"><rect x="150" y="152" width="88" height="15" rx="3" class="aqlb"/><text x="194" y="163" text-anchor="middle" class="aqlt">⬅ DESCONECTAR</text></g><text x="152" y="180" class="aqm">M12 de C-B51 fuera</text></g>
  <g class="lL"><path d="M88 118 L62 148" class="aqarr" marker-end="url(#atqar)"/><g class="aqbl"><rect x="6" y="152" width="88" height="15" rx="3" class="aqlb"/><text x="50" y="163" text-anchor="middle" class="aqlt">⬅ DESCONECTAR</text></g><text x="8" y="180" class="aqm">M12 de C-B52 fuera</text></g></g>
 <!-- P-A5 más grande -->
 <g transform="translate(246,58)"><rect x="0" y="0" width="90" height="122" rx="7" class="aqmod"/><text x="45" y="17" text-anchor="middle" class="aqt aqbig">P-A5</text><text x="45" y="29" text-anchor="middle" class="aqm">armario pupitre</text>
  ${T2((o,k)=>`<g class="l${k}">
   <circle cx="16" cy="50" r="9" class="${k=="R"?"aqled v1 v2":"aqledo"}"/>${k=="R"?`<circle cx="16" cy="50" r="9" class="aqledo v3 v4 v5"/>`:""}
   <circle cx="16" cy="78" r="9" class="${k=="L"?"aqled v1 v2":"aqledo"}"/>${k=="L"?`<circle cx="16" cy="78" r="9" class="aqledo v3 v4 v5"/>`:""}
   <text x="6" y="106" class="aqt2 v1 v2">${o.b} ENCENDIDO</text><text x="6" y="106" class="aqt2 v3 v4 v5">${o.b} apagado</text>
   <text x="6" y="117" class="aqm">${o.s} · hilo ${o.h}</text></g>`)}
  <text x="30" y="53" class="aqt2">1.1 C-B51</text><text x="30" y="81" class="aqt2">4.4 C-B52</text></g>
 <!-- barra de velocidad -->
 <g transform="translate(246,186)"><text x="0" y="8" class="aqm">VEL.</text><text x="90" y="8" text-anchor="end" class="aqt2 aqal v1">0 · BLOQ.</text><text x="90" y="8" text-anchor="end" class="aqt2 aqbyo v2">LENTA</text><text x="90" y="8" text-anchor="end" class="aqt2 v3">0</text><text x="90" y="8" text-anchor="end" class="aqt2 aqok v4 v5">NORMAL</text>
  <rect x="0" y="12" width="90" height="10" rx="5" class="aqspb"/><rect x="0" y="12" width="90" height="10" rx="5" class="aqspf"/></g>
 <g transform="translate(172,214)"><rect x="0" y="0" width="164" height="96" rx="6" class="aqmag"/><text x="8" y="14" class="aqm aqmw">MAGELIS · DISPLAY</text>
  <g class="v1"><g class="aqbl"><text x="8" y="30" class="aqt aqal">115 ATRAQUE INCORRECTO</text><text x="8" y="43" class="aqt aqwn">243 contacto con avión</text></g>
   ${JOY(22,68,1)}<text x="42" y="64" class="aqm aqmw">Para desatracar: mover</text><text x="42" y="75" class="aqm aqmw">el joystick hacia atrás</text><text x="42" y="88" class="aqm aqal">todo bloqueado</text></g>
  <g class="v2">${BYP(8,22)}<text x="72" y="32" class="aqm aqmw">mantener</text><text x="72" y="43" class="aqm aqmw">pulsado (izq.)</text>${JOY(22,70,1)}<text x="42" y="66" class="aqm aqmw">+ joystick ATRÁS</text>${TORT(54,84)}<text x="68" y="88" class="aqm aqmw">lento · sin alarmas</text></g>
  <text x="8" y="36" class="aqt aqokw v3 v4">243 / 115 borradas</text><text x="8" y="52" class="aqm aqmw v3 v4">movimientos libres en MANUAL</text>
  <g class="v5"><text x="8" y="32" class="aqt aqokw">243 solo al tocar</text>${JOY(22,64,1)}<text x="42" y="62" class="aqm aqmw">«desatracar: joystick</text><text x="42" y="73" class="aqm aqmw">hacia atrás» al atracar</text><text x="8" y="90" class="aqm aqmw">115 solo si toca sin traslación</text></g></g>
 ${T2((o,k)=>`<g class="l${k}"><text x="8" y="252" class="aqt v1">1 · Se cree atracada</text><text x="8" y="266" class="aqm v1">${o.s} da contacto sin avión</text><text x="8" y="278" class="aqm v1">115 · todo bloqueado</text>
  <text x="8" y="252" class="aqt v2">2 · Bypass (manual pág. 85)</text><text x="8" y="266" class="aqm v2">solo hacia atrás y lento</text><text x="8" y="278" class="aqm v2">operador con experiencia</text>
  <text x="8" y="252" class="aqt v3">3 · Quitar la señal</text><text x="8" y="266" class="aqm v3">conector M12 de ${o.s} fuera</text><text x="8" y="278" class="aqm v3">o hilo ${o.h} de P-A5 ${o.b}</text>
  <text x="8" y="252" class="aqt v4">4 · Aparcar en MANUAL</text><text x="8" y="266" class="aqm v4">compañero vigilando el</text><text x="8" y="278" class="aqm v4">lado ${o.lado} · avisar CGA</text>
  <text x="8" y="252" class="aqt v5">5 · Reparar y probar</text><text x="8" y="266" class="aqm v5">sensor, conector, ${o.w}</text><text x="8" y="278" class="aqm v5">atraque correcto sin 115</text>
  <text x="8" y="334" class="aqm">Planta · folio 85 · ${o.s} → ${o.x} → hilo ${o.h} → P-A5 ${o.b}</text></g>`)}
</svg>${croq()}</div>`}
/* ---------- 3) croquis del puente provisional en P-A5 (soltar y aislar el hilo del contacto que falla) ---------- */
function croq(){if(typeof croquisPuente!="function")return"";
 return T2((o,k)=>{let s="";try{s=croquisPuente({mod:"P-A5",b1:o.b,b2:o.b,k1:`${o.din} · hilo ${o.h} · ${o.s}`,k2:"",d:`CONTACTO AVIÓN ${o.lado.toUpperCase()} ${o.s} · solo si con el conector M12 fuera el LED sigue encendido`,suelta:true},5)}catch(e){}
  return s?`<div class="atqcrw l${k}"><div class="gobsh2">Opción 2 · armario del pupitre: soltar y aislar el hilo ${o.h} de P-A5 ${o.b}</div><div class="atqcr">${s}</div></div>`:""})}
/* ---------- 4) cotejo con los inductivos de contacto ---------- */
function cotejo(){const F=[["C-B51","Contacto avión DERECHA","P-A5 1.1 · DIN01","P-X92:12 · hilo 320 · P-W17","Da el 243; si entra con un movimiento que no es traslación → 115"],
 ["C-B52","Contacto avión IZQUIERDA","P-A5 4.4 · DIN08","P-X92:7 · hilo 740 · P-W18","Igual que C-B51 por su lado"],
 ["C-B7","Brazo autonivelador · contacto","P-A5 5.1 · DIN09","C-CON10 · P-W10","Autonivelación: si se activa sin contacto y el contacto llega en servicio → 115"]];
 return `<div class="gobsh2">Cotejo · manual RCS ↔ inductivos de contacto (planos rev. J folio 85/86)</div><div class="atqco">${F.map(f=>`<div class="atqcf"><b>${f[0]}</b><span>${f[1]}</span><small>${f[2]} · ${f[3]}</small><em>${f[4]}</em></div>`).join("")}</div>`}

const SEC={t:"Atraque incorrecto · alarma 115 y falso contacto con avión (C-B51 derecho / C-B52 izquierdo)",
 a:"El bypass de atraque incorrecto puede dañar gravemente la pasarela y el avión: SOLO operadores con experiencia (manual RCS pág. 85). Con un contacto anulado la PBB NO detecta el avión por ese lado: solo MANUAL, despacio y con compañero vigilando hasta reparar.",
 g:[85,85,85,85,85,85,85,85,85],
 p:["CÓMO FUNCIONA (manual RCS pág. 82-85): atraque CORRECTO = contacto con el avión SOLO moviendo la unidad de traslación hacia delante (o excepcionalmente hacia atrás); la pantalla indica entonces hacia dónde desatracar («Para desatracar: mover el joystick hacia atrás» si se atracó hacia delante; «hacia delante» si se atracó hacia atrás). Atraque INCORRECTO (alarma 115) = contacto con cualquier otro movimiento (suelo basculante, altura, giro de la traslación o giro de cabina), o contacto durante el servicio tras activar la autonivelación sin contacto previo. Con la 115 TODOS los movimientos quedan bloqueados.",
  "QUÉ HAY (ESQUEMA GENERAL rev. J folio 85, P-A5 en el armario del pupitre): contacto avión DERECHA C-B51 → P-W17 (M12) → P-X92:12 → hilo 320 → P-A5 1.1 (DIN01), +24 V por P-X92:8. Contacto avión IZQUIERDA C-B52 → P-W18 → P-X92:7 → hilo 740 → P-A5 4.4 (DIN08). Brazo autonivelador C-B7 → C-CON10 → P-A5 5.1 (DIN09, folio 86).",
  "SÍNTOMA de falso contacto: sin avión (p. ej. a 5 m) la pantalla da 243 «Pasarela en contacto con avión», que entra y sale, y/o 115 «Atraque incorrecto», con «Para desatracar: mover el joystick hacia atrás»; la PBB se cree atracada y bloquea los movimientos.",
  "PRIORIDAD 1 · BYPASS de atraque incorrecto (manual pág. 85): mantener pulsado el botón NARANJA de bypass (parte izquierda de la pantalla) y a la vez mover el joystick hacia ATRÁS: la PBB se mueve a velocidad lenta ignorando cualquier alarma. Solo hacia atrás, operador con experiencia y compañero vigilando.",
  "Si la alarma vuelve o hay que girar o cambiar altura para aparcar: en el armario del pupitre mirar P-A5 sin avión: LED 1.1 (C-B51 derecho) y 4.4 (C-B52 izquierdo). Ninguno debe estar encendido: el encendido es el contacto que falla.",
  "PUENTE PROVISIONAL · opción 1 (en cabina): desenchufar el conector M12 del sensor que falla (C-B51) y taparlo. Si el LED de P-A5 1.1 se apaga y se borran 243 / 115 → la señal la da el SENSOR.",
  "Opción 2 (si con el conector fuera el LED 1.1 sigue encendido → el cable P-W17 lleva +24 V a la señal): en P-A5 soltar el hilo 320 de la borna 1.1 y aislarlo, con etiqueta «PUENTE PROVISIONAL · OT». Ver croquis.",
  "APARCAR en MANUAL (sin la señal falsa vuelven los giros y la altura): despacio, con compañero vigilando el lado derecho. Avisar a CGA y anotar en la OT la hora del bypass o del puente.",
  "REPARAR y CIERRE: revisar C-B51 (fijación, distancia, golpe, suciedad, agua o hielo), su conector M12 y el cable P-W17 hasta P-X92:12 / :8 moviéndolos con el LED 1.1 a la vista; sustituir si da señal sin contacto. Reconectar, OFF → ON y probar un atraque CORRECTO solo con traslación hacia delante: al tocar entran LED 1.1 / 4.4 y 243 y la pantalla pide «desatracar: joystick hacia atrás»; al separar se borra. No se cierra la OT con el contacto anulado."],
 obs:["Atraque correcto vs incorrecto (manual pág. 82 y 84): el PLC solo acepta el contacto si llega moviendo la TRASLACIÓN. Si el contacto aparece moviendo altura, giro de cabina, giro de traslación o suelo basculante → 115 y bloqueo total. Se recomienda atracar SIEMPRE con la traslación hacia DELANTE (pág. 83).",
  "Ayuda al desatraque (pág. 83): el mensaje indica el sentido contrario al de atraque. «Mover el joystick hacia atrás» SIN avión delante quiere decir que el PLC ve contacto: señal falsa de C-B51 / C-B52.",
  "Cotejo con los inductivos: un contacto (C-B51 / C-B52) que se activa solo y de forma intermitente hace saltar la 115 en cualquier maniobra que no sea traslación (giro de rotonda o cabina, altura). Por eso aparecen 243 y 115 sin avión. El LED de P-A5 (1.1 / 4.4) dice cuál es.",
  "Autonivelación con 115 (pág. 85): si la PBB ya estaba bien atracada, puede autonivelar y dar servicio, pero la 115 vuelve al pasar a ON para desatracar → desatracar con el bypass.",
  "El bypass solo permite joystick hacia ATRÁS y a velocidad lenta: sirve para separarse del avión, no para aparcar. Si la señal falsa sigue, quitarla (conector o hilo 320) para recuperar todos los movimientos.",
  "El puente provisional es QUITAR la señal del contacto que falla. Nunca llevar la entrada a +24 V ni unir los dos contactos: simularía un contacto permanente.",
  "La fiabilidad de la ayuda al desatraque depende de la calibración y del mantenimiento de la pasarela (pág. 83). Comprobar también el reloj de la Magelis antes de pasar horas a la OT."],
 r:"Manual RCS F8-690.0312-51 pág. 82-85 · ESQUEMA GENERAL rev. J folio 85 (P-A5 DIN01 / DIN08, P-X92) y folio 86 (C-B7) · alarmas 115 / 243"};
Object.defineProperty(SEC,"obsCro",{get(){return `<div class="gobsh2">Tipos de atraque · manual RCS</div>${tipos()}<div class="gobsh2">Simulación · toca un paso o déjala avanzar</div>${sim()}${cotejo()}`},enumerable:true});
/* v743: croquis del puente provisional de los contactos con avión, como OPCIÓN para «1 · Sacar en servicio ya» del SOS (115 / 243) */
window.atqCroqOpcion=function(){if(typeof croquisPuente!="function")return"";
 return ["L","R"].map(k=>{const o=LADO[k];let s="";try{s=croquisPuente({mod:"P-A5",b1:o.b,b2:o.b,k1:`${o.din} · hilo ${o.h} · ${o.s}`,k2:"",d:`CONTACTO AVIÓN ${o.lado.toUpperCase()} ${o.s} · si da señal sin avión`,suelta:true},5)}catch(e){}return s}).filter(Boolean).join("")};
/* v746: PRIMERA ACTUACIÓN de una OT de contacto con avión / atraque incorrecto («Fallo contacto avión», 243, 115…): el puente
   provisional (soltar y aislar el hilo del contacto que da señal sin avión) en P-A5 1.1 (C-B51 derecho, hilo 320) o
   4.4 (C-B52 izquierdo, hilo 740), precedido del bypass del manual. Antes no salía porque esas entradas no tenían
   texto de puente (PUENTE) y la OT se quedaba sin primera actuación. */
const RX_ATQ=/contacto[^.]{0,25}avion|avion[^.]{0,25}contacto|atraque|desatrac|\b(115|243)\b|c-?b5[12]\b/;
const TXP={"P-A5|1|1":"Contacto avión DERECHO C-B51 que da señal SIN avión (243 / 115, «desatracar: joystick hacia atrás»): 1º separar la PBB con el bypass naranja + joystick ATRÁS, lento (manual RCS pág. 85). Si la alarma vuelve: con el LED 1 del módulo 1 de P-A5 encendido sin avión, desenchufar el conector M12 de C-B51; si el LED sigue encendido, soltar y aislar el hilo 320 de la borna IN 1.1 de P-A5 (no puentear). Solo MANUAL y con un compañero vigilando el lado derecho.",
 "P-A5|2|4":"Contacto avión IZQUIERDO C-B52 que da señal SIN avión (243 / 115, «desatracar: joystick hacia atrás»): 1º separar la PBB con el bypass naranja + joystick ATRÁS, lento (manual RCS pág. 85). Si la alarma vuelve: con el LED 4 del módulo 2 de P-A5 encendido sin avión, desenchufar el conector M12 de C-B52; si el LED sigue encendido, soltar y aislar el hilo 740 de la borna IN 4.4 de P-A5 (no puentear). Solo MANUAL y con un compañero vigilando el lado izquierdo."};
try{if(typeof PUENTE=="object"){Object.assign(PUENTE,TXP)}if(typeof PU_REQ=="object"){PU_REQ["P-A5|1|1"]=RX_ATQ;PU_REQ["P-A5|2|4"]=RX_ATQ}}catch(e){}
if(typeof puentesOT=="function"){const oP=puentesOT;puentesOT=function(i){const P=oP(i)||[];try{
  if(!i||i.estado!="abierta"||(typeof otEsPAS=="function"&&!otEsPAS(i)))return P;
  const txt=(typeof segNorm=="function"?segNorm:(x=>String(x).toLowerCase()))([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));if(!RX_ATQ.test(txt))return P;
  const M=typeof PLC!="undefined"?PLC.find(m=>m.id=="P-A5"):null;
  /* si la descripción dice el lado, solo ese; si no, los dos (el LED encendido dice cuál) */
  const lados=/derech|c-?b51/.test(txt)&&!/izquier|c-?b52/.test(txt)?["P-A5|1|1"]:/izquier|c-?b52/.test(txt)&&!/derech|c-?b51/.test(txt)?["P-A5|2|4"]:["P-A5|2|4","P-A5|1|1"];/* v773: izquierdo a la izquierda */
  const nuevos=lados.filter(key=>!P.some(p=>p.key==key)).map(key=>{const[id,k,l]=key.split("|");const Lm=M&&M.m[k-1]&&M.m[k-1][l-1];
   return{key,id,k,l,t:TXP[key],nom:Lm?Lm[0]:(key.endsWith("1|1")?"Inductivo contacto avión derecha":"Inductivo contacto avión izquierda"),b:M&&typeof pBorna=="function"?pBorna(M,+k,+l):null,f:M?M.f[k-1]:85,suelta:true,croq:(()=>{const o=LADO[key.endsWith("1|1")?"R":"L"];return{mod:"P-A5",b1:o.b,b2:o.b,k1:`${o.din} · hilo ${o.h} · ${o.s}`,k2:"",d:`CONTACTO AVIÓN ${o.lado.toUpperCase()} ${o.s} · si da señal sin avión`,suelta:true}})()}});/* v765: croq → croquis en la guía (lista de index.html) */
  return nuevos.concat(P)}catch(e){console.warn("atraque puentesOT",e)}return P}}
L.push(SEC); /* al final: otras partes guardan las cajas por su número de orden (v738) */

/* ---------- pasos de la simulación ---------- */
const N=PASOS.length;
const pon=(w,n)=>{if(w.dataset.s===String(n))return;w.dataset.s=String(n);w.querySelectorAll(".atqbt").forEach(b=>b.classList.toggle("on",+b.dataset.n===n))};
window.atqLado=function(b){const w=b.closest(".atqw");if(!w)return;w.dataset.l=b.dataset.l;w.querySelectorAll(".atqlb").forEach(x=>x.classList.toggle("on",x===b))};
/* v744: barra de control de la animación · ▶/⏸ play-pausa, ⏹ parar (vuelve al paso 1) y velocidad (lenta … rápida) */
const VEL={1:[6500,"lenta"],2:[4800,"×0,75"],3:[3600,"normal"],4:[2400,"×1,5"],5:[1400,"rápida"]};
const TT=new WeakMap();
const playOn=(w,on)=>{w.dataset.man=on?"":"1";if(on)delete w.dataset.man;TT.set(w,0);const b=w.querySelector(".atqpl");if(b){b.textContent=on?"⏸":"▶";b.setAttribute("aria-label",on?"Pausa":"Reproducir");b.classList.toggle("on",!on)}};
window.atqPaso=function(b){const w=b.closest(".atqw");if(!w)return;playOn(w,false);pon(w,+b.dataset.n)};
window.atqPlay=function(b){const w=b.closest(".atqw");if(!w)return;playOn(w,w.dataset.man==="1")};
window.atqStop=function(b){const w=b.closest(".atqw");if(!w)return;playOn(w,false);pon(w,1)};
window.atqVel=function(r){const w=r.closest(".atqw");if(!w)return;const v=VEL[r.value]||VEL[3];w.dataset.vel=v[0];const t=w.querySelector(".atqvt");if(t)t.textContent=v[1]};
setInterval(()=>{document.querySelectorAll(".atqw:not([data-man])").forEach(w=>{if(!w.offsetParent)return;const t=(TT.get(w)||0)+250;
 if(t>=(+w.dataset.vel||3600)){TT.set(w,0);pon(w,(+w.dataset.s%N)+1)}else TT.set(w,t)})},250);
const st=document.createElement("style");st.textContent=`
.atqw{margin:6px 0 10px}.atqb{display:flex;gap:4px;margin-bottom:6px}
.atqbt{flex:1;min-width:0;min-height:46px;margin:0!important;padding:4px 1px!important;border-radius:10px!important;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;
 background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;color:var(--tx)!important;font:700 10.5px/1.15 system-ui,-apple-system,sans-serif!important;display:flex;flex-direction:column;align-items:center;gap:2px;overflow:hidden}
.atqbt b{display:grid;place-items:center;width:20px;height:20px;border-radius:6px;color:#fff;font:900 11px/1 var(--tkmo,monospace);background:color-mix(in srgb,var(--tx) 35%,transparent)}
.atqbt.on{border-color:var(--tkor,#ff7a1a)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--tkor,#ff7a1a) 22%,transparent)}.atqbt.on b{background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))}
.atqv{display:block;width:100%;max-width:440px;margin:0 auto 8px;background:var(--card,#fff);border:1px solid #8885;border-radius:10px}
.atqv text{font-family:ui-monospace,Menlo,monospace;fill:var(--tx,#111)}.atqv .aqt{font-size:9.5px;font-weight:800}.atqv .aqm{font-size:8px;opacity:.85}
.atqv .aqav{fill:#cfd8dc;stroke:#78909c}.atqv .aqpu{fill:#90a4ae}.atqv .aqcab,.atqv .aqcab2{fill:#cfd8dc;stroke:#607d8b}.atqv .aqtun,.atqv .aqtun2{fill:#e3e7ea;stroke:#90a4ae}.atqv .aqbum{fill:#263238}
.atqv .aqeje{fill:#b0bec5;stroke:#78909c}.atqv .aqrue{fill:#616161}.atqv .aqrot{fill:#e0e0e0;stroke:#90a4ae;stroke-width:2}.atqv .aqsue{stroke:#263238;stroke-width:4}
.atqv .aqfl{stroke:#f36f21;stroke-width:4;fill:none;stroke-linejoin:round}.atqv .aqfr{stroke:#b71c1c;stroke-width:3;fill:none;stroke-linecap:round;stroke-linejoin:round}
.atqv .aqal2{fill:#e53935!important;font-weight:800;opacity:1!important}.atqv .aqln{fill:none;stroke:#f0a020;stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round}.atqv .aqln2{fill:#f0a020}.atqv .aqln3{stroke:#f0a020;stroke-width:1.2;opacity:.8}.atqv .aqbmp{stroke:#f0a020;stroke-width:4.5;stroke-linecap:round}.atqv .aqx{stroke:#e91e63;stroke-width:3;stroke-linecap:round}.atqv .aqsep{stroke:#8886;stroke-dasharray:4 3}
.atqv .aqdim{stroke:#1fa64a;stroke-width:1.6;stroke-dasharray:4 3;fill:none}.atqv .aqok{fill:#1fa64a!important}.atqv .aqok2{fill:#1fa64a;stroke:#0b5d27}
.atqv .aqko{fill:#e53935;stroke:#7f0000;stroke-width:2}.atqv .aqko2{fill:#e53935!important}.atqv .aqoff{fill:#9e9e9e;stroke:#424242}
.atqv .aqarr{stroke:#e53935;stroke-width:3;fill:none;stroke-linecap:round}.atqv .aqarr2{stroke:#1fa64a;stroke-width:4;fill:none;stroke-linecap:round}.atqv .aqarr3{stroke:#f36f21;stroke-width:4;fill:none;stroke-linecap:round}
.atqv .aqlb{fill:#e53935}.atqv .aqlt{fill:#fff!important;font-size:8.5px;font-weight:900}.atqv .aqnew{fill:#1fa64a;stroke:#0b5d27}
.atqv .aqmod{fill:#56b84a;stroke:#2d6b25}.atqv .aqled{fill:#22c55e;stroke:#0b5d27}.atqv .aqledo{fill:#5d5d5d;stroke:#222}
.atqv .aqmag{fill:#1f2630;stroke:#455a64}.atqv .aqmw{fill:#cfd8dc!important;opacity:1!important}.atqv .aqwn{fill:#ffca28!important}.atqv .aqal{fill:#ff5252!important;opacity:1!important}.atqv .aqokw{fill:#69f0ae!important}.atqv .aqbyo{fill:#f39c12!important}
.atqv .aqjo{fill:#eceff1;stroke:#90a4ae}.atqv .aqji{fill:#fff;stroke:#90a4ae}.atqv .aqja{stroke:#37474f;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}.atqv .aqjt{fill:#78909c}
.atqv .aqbyp{fill:#f5a623}.atqv .aqbyt{fill:none;stroke:#263238;stroke-width:2;stroke-linejoin:round}.atqv .aqbyx{fill:#263238!important;font-size:10px;font-weight:900}.atqv .aqbyc{fill:none;stroke:#263238;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.atqv .aqtor{fill:#607d8b}.atqv .aqtorl{stroke:#607d8b;stroke-width:2}
.atqv .aqbl{animation:none}/* v752: sin parpadeos en la simulación */
@keyframes atqBl{50%{opacity:.15}}@keyframes atqLed{50%{fill:#2e7d32}}
.atqv .v1,.atqv .v2,.atqv .v3,.atqv .v4,.atqv .v5{display:none}
.atqw[data-s="1"] .v1,.atqw[data-s="2"] .v2,.atqw[data-s="3"] .v3,.atqw[data-s="4"] .v4,.atqw[data-s="5"] .v5{display:inline}
.atqv .aqpbb{transition:transform 2.4s ease-in-out}.atqw[data-s="2"] .aqpbb{transform:translateY(16px)}.atqw[data-s="4"] .aqpbb,.atqw[data-s="5"] .aqpbb{transform:translateY(24px)}
.atql{display:flex;align-items:center;gap:5px;margin-bottom:6px;font:700 11px/1.1 system-ui,sans-serif;color:var(--mu)}.atql span{flex:none}
.atqlb{flex:1;min-height:40px;margin:0!important;padding:3px 4px!important;border-radius:10px!important;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;color:var(--tx)!important;font:600 11px/1.15 system-ui,sans-serif!important;display:flex;flex-direction:column;align-items:center}
.atqlb b{font:800 12px/1.2 var(--tkmo,monospace)}.atqlb.on{border-color:#e53935!important;box-shadow:0 0 0 3px #e5393533}
.atqw[data-l="R"] .lL,.atqw[data-l="L"] .lR{display:none!important}
.atqv .aqbig{font-size:12px}.atqv .aqt2{font-size:8.5px;font-weight:700}
.atqv .aqspb{fill:color-mix(in srgb,var(--tx) 14%,transparent)}.atqv .aqspf{transform-box:fill-box;transform-origin:left center;transform:scaleX(.02);transition:transform 1.6s ease,fill .4s;fill:#e53935}
.atqw[data-s="2"] .aqspf{transform:scaleX(.22);fill:#f39c12}.atqw[data-s="3"] .aqspf{transform:scaleX(.02);fill:#9e9e9e}.atqw[data-s="4"] .aqspf{transform:scaleX(.6);fill:#1fa64a}.atqw[data-s="5"] .aqspf{transform:scaleX(.6);fill:#1fa64a}
.atqc{display:flex;align-items:center;gap:6px;margin:0 0 6px;padding:6px 8px;border-radius:12px;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent);background:color-mix(in srgb,var(--bg) 70%,var(--card))}
.atqpl,.atqst{flex:none;width:44px;height:40px;margin:0!important;padding:0!important;border-radius:10px!important;border:0!important;font-size:18px!important;color:#fff!important;background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))!important}
.atqst{background:color-mix(in srgb,var(--tx) 30%,transparent)!important}.atqpl.on{background:#1fa64a!important}
.atqcl{flex:none;font:800 10.5px/1 var(--tkmo,monospace);letter-spacing:1px;text-transform:uppercase;color:var(--mu)}
.atqrg{flex:1;min-width:60px;height:40px;margin:0;accent-color:var(--tkor,#ff7a1a);touch-action:pan-x}
.atqvt{flex:none;min-width:50px;text-align:right;font:800 11px/1 var(--tkmo,monospace);color:var(--tx)}
.atqco{display:flex;flex-direction:column;gap:6px;margin:4px 0 10px}
.atqcf{display:grid;grid-template-columns:auto 1fr;column-gap:8px;row-gap:2px;padding:8px 10px;border-radius:10px;border:1.5px solid color-mix(in srgb,var(--tx) 14%,transparent);background:color-mix(in srgb,var(--bg) 70%,var(--card));text-align:left}
.atqcf b{grid-row:span 3;align-self:start;background:#455a64;color:#fff;border-radius:6px;padding:2px 7px;font:800 13px/1.3 var(--tkmo,monospace)}
.atqcf span{font-weight:700;font-size:13.5px}.atqcf small{font:600 11.5px/1.3 var(--tkmo,monospace);color:var(--mu)}.atqcf em{font-style:normal;font-size:12.5px}
.atqcr{max-width:330px;margin:4px auto 0}
@media (prefers-reduced-motion:reduce){.atqv *{animation:none!important;transition:none!important}}`;document.head.appendChild(st);
})();
