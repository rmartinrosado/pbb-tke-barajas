/* ===== v737: GUÍA DE CAMPO · «ATRAQUE INCORRECTO» · falso contacto con avión (22/11/2026) =====
   Caso: PBB separada del avión (≈5 m) y la Magelis da 243 «Pasarela en contacto con avión» (intermitente) / 115 «Atraque
   incorrecto», con «Para desatracar, mover el Joystick hacia atrás»: el contacto DERECHO C-B51 da señal sin avión.
   Apartado nuevo en la guía de campo (familia «Cabina, capota y portón») con la actuación, observaciones y:
   · simulación animada por pasos (1 fallo · 2 desconectar · 3 desatracar · 4 reparar), que avanza sola y con los botones;
   · croquis del puente provisional en P-A5 1.1 (soltar y aislar el hilo 320) con el rótulo DESCONECTAR parpadeando.
   Datos de planos (ESQUEMA GENERAL rev. J folio 85): C-B51 → P-W17 → P-X92:12 → hilo 320 → P-A5 1.1 (DIN01) · +24 V por
   P-X92:8 · C-B52 → P-W18 → P-X92:7 → hilo 740 → P-A5 4.4 (DIN08) · brazo C-B7 → P-A5 5.1 (DIN09). ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const L=GUIA.tipos.PAS.s;if(L.some(s=>/^Atraque incorrecto/.test(s.t)))return;

/* ---------- simulación animada (vista en planta) ---------- */
function sim(){return `<div class="atqw" data-s="1">
<div class="atqb">${["Fallo","Desconectar","Desatracar","Reparar"].map((t,k)=>`<button type="button" class="atqbt${k?"":" on"}" data-n="${k+1}" onclick="atqPaso(this)"><b>${k+1}</b>${t}</button>`).join("")}</div>
<svg class="atqv" viewBox="0 0 340 330" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Simulación del falso contacto derecho C-B51 y pasos para desatracar">
 <defs><marker id="atqar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#e53935"/></marker>
  <marker id="atqag" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#1fa64a"/></marker></defs>
 <rect x="6" y="10" width="240" height="42" rx="21" class="aqav"/><rect x="104" y="22" width="24" height="30" rx="3" class="aqpu"/>
 <text x="18" y="36" class="aqt">AVIÓN</text><text x="134" y="36" class="aqm">puerta</text>
 <g class="v1 v2"><path d="M116 58 V110" class="aqdim" marker-start="url(#atqag)" marker-end="url(#atqag)"/><text x="122" y="88" class="aqt aqok">≈ 5 m · SIN CONTACTO</text></g>
 <g class="v3"><text x="10" y="74" class="aqt aqok">JOYSTICK ATRÁS · MANUAL</text><text x="10" y="86" class="aqm">despacio · compañero vigilando el lado derecho</text></g>
 <g class="v4"><text x="10" y="74" class="aqt aqok">C-B51 NUEVO O AJUSTADO</text><text x="10" y="86" class="aqm">reconectar · OFF → ON · probar contra el avión</text></g>
 <g class="aqpbb">
  <rect x="60" y="118" width="112" height="44" rx="6" class="aqcab"/><text x="116" y="144" text-anchor="middle" class="aqt">CABINA</text>
  <rect x="88" y="162" width="56" height="40" class="aqtun"/><text x="116" y="186" text-anchor="middle" class="aqm">túnel</text>
  <rect x="60" y="114" width="112" height="6" rx="3" class="aqbum"/>
  <circle cx="72" cy="117" r="7" class="aqok2"/><text x="36" y="110" class="aqm">C-B52</text>
  <g class="v1"><circle cx="160" cy="117" r="9" class="aqko aqbl"/><text x="166" y="106" class="aqt aqko2">C-B51</text><g class="aqbl"><text x="176" y="122" class="aqt aqko2">FALSO</text><text x="176" y="133" class="aqt aqko2">CONTACTO</text></g></g>
  <g class="v2 v3"><circle cx="160" cy="117" r="7" class="aqoff"/><text x="166" y="106" class="aqm">C-B51</text></g>
  <g class="v4"><circle cx="160" cy="117" r="8" class="aqnew"/><text x="166" y="106" class="aqm aqok">C-B51 ✓</text></g>
 </g>
 <g class="v2"><g class="aqbl"><path d="M164 128 L192 158" class="aqarr" marker-end="url(#atqar)"/><rect x="172" y="162" width="86" height="15" rx="3" class="aqlb"/><text x="215" y="173" text-anchor="middle" class="aqlt">⬅ DESCONECTAR</text></g>
  <text x="174" y="190" class="aqm">conector M12 fuera</text></g>
 <g class="v3"><path d="M40 124 V196" class="aqarr2" marker-end="url(#atqag)"/></g>
 <g transform="translate(262,64)"><rect x="0" y="0" width="74" height="98" rx="6" class="aqmod"/><text x="37" y="14" text-anchor="middle" class="aqt">P-A5</text><text x="37" y="25" text-anchor="middle" class="aqm">pupitre</text>
  <circle cx="13" cy="44" r="7" class="aqled v1"/><circle cx="13" cy="44" r="7" class="aqledo v2 v3"/><circle cx="13" cy="44" r="7" class="aqledo v4"/><text x="24" y="47" class="aqm">1.1 dcho</text>
  <circle cx="13" cy="66" r="7" class="aqledo"/><text x="24" y="69" class="aqm">4.4 izdo</text>
  <text x="6" y="90" class="aqm v1">1.1 ENCENDIDO</text><text x="6" y="90" class="aqm v2 v3 v4">1.1 apagado</text></g>
 <g transform="translate(184,238)"><rect x="0" y="0" width="150" height="58" rx="6" class="aqmag"/><text x="8" y="14" class="aqm aqmw">MAGELIS</text>
  <g class="v1 aqbl"><text x="8" y="30" class="aqt aqwn">243 contacto con avión</text><text x="8" y="44" class="aqt aqwn">115 atraque incorrecto</text></g>
  <text x="8" y="36" class="aqt aqokw v2 v3">243 borrada · PBB libre</text><text x="8" y="36" class="aqt aqokw v4">243 solo al tocar</text></g>
 <g><text x="8" y="252" class="aqt v1">1 · Se cree atracada</text><text x="8" y="266" class="aqm v1">corta la aproximación</text><text x="8" y="278" class="aqm v1">solo deja desatracar</text>
  <text x="8" y="252" class="aqt v2">2 · Quitar la señal</text><text x="8" y="266" class="aqm v2">conector M12 de C-B51 fuera</text><text x="8" y="278" class="aqm v2">o hilo 320 de P-A5 1.1</text>
  <text x="8" y="252" class="aqt v3">3 · Desatracar y aparcar</text><text x="8" y="266" class="aqm v3">solo MANUAL, con vigilante</text><text x="8" y="278" class="aqm v3">avisar a CGA · hora en OT</text>
  <text x="8" y="252" class="aqt v4">4 · Reparar y probar</text><text x="8" y="266" class="aqm v4">sensor, conector, P-W17</text><text x="8" y="278" class="aqm v4">243 solo con contacto</text></g>
 <text x="8" y="318" class="aqm">Planta · folio 85 · C-B51 → P-X92:12 → hilo 320 → P-A5 1.1</text>
</svg></div>`}
/* ---------- croquis del puente provisional (P-A5 1.1 · soltar y aislar el hilo 320) ---------- */
function croq(){if(typeof croquisPuente!="function")return"";let s="";
 try{s=croquisPuente({mod:"P-A5",b1:"1.1",b2:"1.1",k1:"IN01 · hilo 320 · C-B51",k2:"",d:"CONTACTO AVIÓN DERECHA C-B51 · solo si con el conector M12 fuera el LED sigue encendido",suelta:true},5)}catch(e){return""}
 return `<div class="gobsh2">Opción 2 · en el armario del pupitre: soltar y aislar el hilo 320 de P-A5 1.1</div><div class="atqcr">${s}</div>`}
const SEC={t:"Atraque incorrecto · falso contacto con avión (C-B51 derecho / C-B52 izquierdo)",
 a:"Con el contacto anulado la PBB NO detecta el avión por ese lado: solo MANUAL, despacio y con un compañero vigilando. Prohibida la aproximación automática y el retorno autónomo hasta reparar.",
 g:[85,85,85,85,85,85,85,85],
 p:["QUÉ HAY (ESQUEMA GENERAL rev. J folio 85, P-A5 en el armario del pupitre): contacto avión DERECHA C-B51 → cable P-W17 (SAC-5P M12) → P-X92:12 → hilo 320 → P-A5 borna 1.1 (DIN01); +24 V del sensor por P-X92:8 (BN). Contacto avión IZQUIERDA C-B52 → P-W18 → P-X92:7 → hilo 740 → P-A5 borna 4.4 (DIN08). Brazo autonivelador contacto C-B7 → C-CON10 → P-A5 5.1 (DIN09).",
  "SÍNTOMA: sin avión (p. ej. a 5 m) la Magelis da 243 «Pasarela en contacto con avión», que entra y sale, y/o 115 «Atraque incorrecto»; mensaje «Para desatracar, mover el Joystick hacia atrás»; arranca el autonivelador y la maniobra se corta (256 «Hombre muerto no pulsado» en el mismo segundo).",
  "PRIORIDAD 1 · Selector en MANUAL. En el armario del pupitre mirar P-A5: LED 1.1 (contacto derecho C-B51) y LED 4.4 (contacto izquierdo C-B52). Sin avión ninguno debe estar encendido: el que está encendido es el contacto que falla (aquí el DERECHO, 1.1).",
  "PUENTE PROVISIONAL · opción 1 (en cabina): desenchufar el conector M12 del sensor que falla (C-B51) y taparlo. Si el LED de P-A5 1.1 se apaga y el 243 se borra → la señal la da el SENSOR (averiado o desajustado).",
  "Opción 2 (si con el conector fuera el LED 1.1 sigue encendido → el cable P-W17 lleva +24 V a la señal): en P-A5 soltar el hilo 320 de la borna 1.1 y aislarlo, con etiqueta «PUENTE PROVISIONAL · OT». Ver croquis.",
  "DESATRACAR: en MANUAL, joystick hacia atrás, despacio, con un compañero vigilando el lado derecho de la cabina; separar la PBB del avión y llevarla a aparcamiento. Avisar a CGA y anotar en la OT la hora del puente.",
  "REPARAR: revisar C-B51 (fijación, distancia a su placa o leva, golpe, suciedad, agua o hielo), su conector M12 y el cable P-W17 hasta P-X92:12 / :8. Con el LED 1.1 a la vista, mover el cable y el conector: si parpadea, ahí está el intermitente. Sustituir el sensor si da señal sin contacto.",
  "CIERRE: reconectar el sensor (o el hilo 320 en P-A5 1.1), quitar la etiqueta, OFF → ON. Prueba en MANUAL: aproximar al avión; el LED 1.1 y el 243 solo entran al tocar y salen al separar, igual que el izquierdo (4.4). No se cierra la OT con el contacto anulado."],
 obs:["POR QUÉ NO DESATRACA: con el contacto derecho dando señal, el PLC cree la PBB atracada: corta la aproximación, arranca el autonivelador y solo deja el movimiento de desatracar. Quitando la señal del contacto que falla, el PLC deja de verla atracada y la PBB se maneja en MANUAL.",
  "El 243 que entra y sale en pocos segundos sin avión es un fallo INTERMITENTE: sensor, conector M12 o cable P-W17 (roce, golpe, humedad).",
  "El puente provisional es QUITAR la señal del contacto que falla (conector fuera o hilo 320 suelto y aislado). Nunca llevar la entrada a +24 V ni unir los dos contactos: simularía un contacto permanente.",
  "Con el contacto derecho anulado sigue protegiendo el izquierdo C-B52, pero el lado derecho queda sin detección: solo MANUAL y a la vista hasta reparar.",
  "Reloj de la Magelis: comprobar que coincide con la hora real antes de pasar las horas de los eventos a la OT (puede estar una hora adelantado)."],
 r:"ESQUEMA GENERAL rev. J folio 85 (P-A5 DIN01 / DIN08, P-X92) · folio 86 (C-B7) · manual RCS: 243 / 115"};
Object.defineProperty(SEC,"obsCro",{get(){return `<div class="gobsh2">Simulación · toca un paso o déjala avanzar</div>${sim()}${croq()}`},enumerable:true});
/* v738: se AÑADE AL FINAL (no en medio): otras partes guardan las cajas por su número de orden (PBB 507, SAI, marcas de
   pasos) y al insertarla en medio se desplazaban y la quitaban. En pantalla va igual en el grupo «Cabina, capota y portón». */
L.push(SEC);

/* ---------- pasos de la simulación: botones y avance solo ---------- */
const pon=(w,n)=>{w.dataset.s=String(n);w.querySelectorAll(".atqbt").forEach(b=>b.classList.toggle("on",+b.dataset.n===n))};
window.atqPaso=function(b){const w=b.closest(".atqw");if(!w)return;w.dataset.man="1";pon(w,+b.dataset.n)};
setInterval(()=>{document.querySelectorAll(".atqw:not([data-man])").forEach(w=>{if(!w.offsetParent)return;pon(w,(+w.dataset.s%4)+1)})},3500);
const st=document.createElement("style");st.textContent=`
.atqw{margin:6px 0 10px}.atqb{display:flex;gap:5px;margin-bottom:6px}
.atqbt{flex:1;min-height:46px;margin:0!important;padding:4px 2px!important;border-radius:10px!important;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;
 background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;color:var(--tx)!important;font:700 11.5px/1.15 system-ui,-apple-system,sans-serif!important;display:flex;flex-direction:column;align-items:center;gap:2px}
.atqbt b{display:grid;place-items:center;width:20px;height:20px;border-radius:6px;color:#fff;font:900 11px/1 var(--tkmo,monospace);background:color-mix(in srgb,var(--tx) 35%,transparent)}
.atqbt.on{border-color:var(--tkor,#ff7a1a)!important;box-shadow:0 0 0 3px color-mix(in srgb,var(--tkor,#ff7a1a) 22%,transparent)}.atqbt.on b{background:linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff))}
.atqv{display:block;width:100%;max-width:440px;margin:0 auto;background:var(--card,#fff);border:1px solid #8885;border-radius:10px}
.atqv text{font-family:ui-monospace,Menlo,monospace;fill:var(--tx,#111)}.atqv .aqt{font-size:9.5px;font-weight:800}.atqv .aqm{font-size:8px;opacity:.8}
.atqv .aqav{fill:#cfd8dc;stroke:#78909c}.atqv .aqpu{fill:#90a4ae}.atqv .aqcab{fill:#b0bec5;stroke:#455a64}.atqv .aqtun{fill:#cfd8dc;stroke:#607d8b}.atqv .aqbum{fill:#263238}
.atqv .aqdim{stroke:#1fa64a;stroke-width:1.6;stroke-dasharray:4 3;fill:none}.atqv .aqok{fill:#1fa64a!important}.atqv .aqok2{fill:#1fa64a;stroke:#0b5d27}
.atqv .aqko{fill:#e53935;stroke:#7f0000;stroke-width:2}.atqv .aqko2{fill:#e53935!important}.atqv .aqoff{fill:#9e9e9e;stroke:#424242}
.atqv .aqarr{stroke:#e53935;stroke-width:3;fill:none;stroke-linecap:round}.atqv .aqarr2{stroke:#1fa64a;stroke-width:4;fill:none;stroke-linecap:round}
.atqv .aqlb{fill:#e53935}.atqv .aqlt{fill:#fff!important;font-size:8.5px;font-weight:900}
.atqv .aqnew{fill:#1fa64a;stroke:#0b5d27}
.atqv .aqmod{fill:#56b84a;stroke:#2d6b25}.atqv .aqled{fill:#22c55e;stroke:#0b5d27;animation:atqLed 1s steps(1,end) infinite}.atqv .aqledo{fill:#5d5d5d;stroke:#222}
.atqv .aqmag{fill:#1f2630;stroke:#455a64}.atqv .aqmw{fill:#cfd8dc!important}.atqv .aqwn{fill:#ffca28!important}.atqv .aqokw{fill:#69f0ae!important}
.atqv .aqbl{animation:atqBl 1s steps(1,end) infinite}
@keyframes atqBl{50%{opacity:.15}}@keyframes atqLed{50%{fill:#2e7d32}}
.atqv .v1,.atqv .v2,.atqv .v3,.atqv .v4{display:none}
.atqw[data-s="1"] .v1,.atqw[data-s="2"] .v2,.atqw[data-s="3"] .v3,.atqw[data-s="4"] .v4{display:inline}
.atqv .aqpbb{transition:transform 1.2s ease-in-out}.atqw[data-s="3"] .aqpbb,.atqw[data-s="4"] .aqpbb{transform:translateY(34px)}
.atqcr{max-width:330px;margin:4px auto 0}
@media (prefers-reduced-motion:reduce){.atqv *{animation:none!important;transition:none!important}}`;document.head.appendChild(st);
})();
