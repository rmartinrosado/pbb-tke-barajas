/* ===== v528: BAJAR PORTÓN para sacar la PBB con AAA y HZ conectados (16/11/2026) =====
   En la PRIMERA ACTUACIÓN EN CAMPO (caja roja), justo después del punto 1, cuando haya que trasladar o sacar la pasarela
   rápidamente, sale un recuadro amarillo parpadeando y, la primera vez en cada OT, un aviso emergente:
     «BAJAR PORTÓN o anular el inductivo de cierre de portón»
   Con el portón abajo se permite la traslación HACIA ATRÁS de la PBB con los servicios auxiliares AAA (PCAir) y HZ (400 Hz)
   conectados al avión.
   Datos del esquema rev. J (folios 52, 57, 68, 84):
   · Pulsador BAJAR PORTÓN CP-S30 → P-A4 IN 8.4 · salida E-A1 OUT32 (8.4) → relé E-K81/2.
   · Sensor portón enrollable C-S9 (inductivo M12, cable P-W21) → E-A8 IN 1.1 (DIS01, LED 1 encendido con el portón abajo):
     BN +24 V = P-X92.1:1 (EP-W4 c1 → E-X68.1:1 → E-X68:6 hilo 613) · BK señal = P-X92.1:2 (EP-W4 c2 → E-X68.1:2 hilo 377 → E-A8 1.1)
     · BU 0 V = P-X92.2:3 (EP-W4 c3 → E-X68.1:3 hilo 620 → E-A8 1.3).
   · Magelis / RCS: 242 «Portón abierto» (advertencia), 049 «Fallo en el motor del portón», 108 «Retén del portón activado». ===== */
(function(){
"use strict";
const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const RE=/trasla|bloque|no traslad|no se mueve|recuperar la pasarela|mover la pasarela|sacar|retir|desatrac|retorno|servicios? auxiliar|\b400\b|\bhz\b|pc ?air|\ba\/a\b|carr(o|ito)|manguera|conector|\baaa\b|seguridad|bumper|borde|zapata|antiatrap|limite|final de carrera/;
const otAct=()=>{try{return typeof gOT!="undefined"&&gOT&&typeof inc!="undefined"?inc.find(x=>x.id==gOT):null}catch(e){return null}};
const otTxt=i=>i?nrm([i.desc,i.def,i.obs,i.com].filter(Boolean).join(" ")):"";
const remota=i=>i&&/^(538|539|580|581|582)$/.test(String(i.pos));
const CUERPO=`<div class="ptn-t">⚠️ BAJAR PORTÓN o anular el inductivo de cierre de portón</div>
<div class="ptn-s">Permite la <b>traslación HACIA ATRÁS</b> de la PBB con los servicios auxiliares <b>AAA</b> (PCAir) y <b>HZ</b> (400 Hz) conectados al avión.</div>`;
function recuadro(){return `<div class="ptn ptnb">${CUERPO}
 <details class="ptn-d"><summary>Cómo hacerlo en campo</summary>
 <div class="puac"><b>A ·</b> <b>Bajar el portón</b> con el pulsador <b>BAJAR PORTÓN CP-S30</b> del pupitre (entra por P-A4 IN 8.4; el PLC da la salida E-A1 OUT32 al relé E-K81/2). Con el portón abajo, el <b>Sensor portón enrollable C-S9</b> da señal a <b>E-A8 IN 1.1</b> (LED 1 encendido) y se borra la advertencia <b>242 «Portón abierto»</b>.</div>
 <div class="puac"><b>B ·</b> Si el portón no baja (sigue la 242, o salen la <b>049 «Fallo en el motor del portón»</b> o la <b>108 «Retén del portón activado»</b>): <b>anular el inductivo de cierre C-S9</b> con un <b>puente con hilo</b> en el bornero del pupitre <b>+P-X92.1:1</b> (+24 V, cable P-W21 BN) ↔ <b>+P-X92.1:2</b> (señal, cable P-W21 BK). El LED 1 de E-A8 (IN 1.1) debe encenderse.</div>
 <div class="puac">Medir antes de puentear: polímetro V⎓, roja en <b>+P-X92.1:2</b>, negra en <b>+P-X92.2:3</b> (0 V, cable P-W21 BU): portón abajo = 24 V · portón arriba = 0 V. Si no hay 24 V en <b>+P-X92.1:1</b>, la alimentación no llega (E-X68:6, hilo 613; manguera EP-W4).</div>
 ${croquis()}
 <div class="puac"><b>C ·</b> Traslación <b>solo hacia atrás</b>, despacio y con un compañero vigilando el avión y que las mangueras de AAA y HZ tengan holgura. Al terminar, <b>quitar el puente</b> y comprobar que con el portón arriba vuelve a salir la 242.</div>
 </details></div>`}
/* croquis del puente en el bornero del pupitre y su llegada al PLC (E-A8 IN 1.1) */
function croquis(){return `<svg class="ptn-svg" viewBox="0 0 360 178" role="img" aria-label="Croquis del puente del inductivo de portón C-S9">
 <text x="8" y="14" class="ptn-z">ARMARIO E · E-A8</text><text x="132" y="14" class="ptn-z">PUPITRE · P-X92.1 / .2</text><text x="276" y="14" class="ptn-z">CAMPO</text>
 <line x1="120" y1="20" x2="120" y2="172" class="ptn-zl"/><line x1="262" y1="20" x2="262" y2="172" class="ptn-zl"/>
 <rect x="10" y="30" width="62" height="120" rx="5" class="ptn-plc"/><text x="41" y="48" text-anchor="middle" class="ptn-b">E-A8</text>
 <text x="41" y="74" text-anchor="middle" class="ptn-b">IN 1.1</text><text x="41" y="138" text-anchor="middle" class="ptn-b">GND 1.3</text>
 <text x="76" y="111" class="ptn-s2">+24 V</text><text x="76" y="122" class="ptn-s2">E-X68:6</text>
 <line x1="72" y1="70" x2="168" y2="70" class="ptn-w"/><text x="76" y="64" class="ptn-s2">377 · EP-W4 c2</text>
 <line x1="96" y1="104" x2="168" y2="104" class="ptn-w"/><text x="124" y="116" class="ptn-s2">613 · c1</text>
 <line x1="72" y1="134" x2="168" y2="134" class="ptn-w"/><text x="76" y="128" class="ptn-s2">620 · c3</text>
 <rect x="160" y="54" width="22" height="96" rx="4" class="ptn-reg"/>
 <circle cx="171" cy="70" r="8" class="ptn-bn"/><text x="171" y="73" text-anchor="middle" class="ptn-bt">2</text>
 <circle cx="171" cy="104" r="8" class="ptn-bn"/><text x="171" y="107" text-anchor="middle" class="ptn-bt">1</text>
 <circle cx="171" cy="134" r="8" class="ptn-bn"/><text x="171" y="137" text-anchor="middle" class="ptn-bt">3</text>
 <path d="M163 70 C140 76 140 98 163 104" class="ptn-pte"/><circle cx="163" cy="70" r="3" class="ptn-pc"/><circle cx="163" cy="104" r="3" class="ptn-pc"/>
 <text x="132" y="90" class="ptn-pt">PUENTE</text>
 <line x1="179" y1="70" x2="290" y2="70" class="ptn-w"/><text x="190" y="64" class="ptn-s2">P-W21 BK (4)</text>
 <line x1="179" y1="104" x2="290" y2="104" class="ptn-w"/><text x="190" y="98" class="ptn-s2">P-W21 BN (1)</text>
 <line x1="179" y1="134" x2="290" y2="134" class="ptn-w"/><text x="190" y="128" class="ptn-s2">P-W21 BU (3)</text>
 <rect x="290" y="58" width="60" height="88" rx="6" class="ptn-sen"/><text x="320" y="92" text-anchor="middle" class="ptn-bt">C-S9</text>
 <text x="320" y="106" text-anchor="middle" class="ptn-s2">inductivo</text><text x="320" y="117" text-anchor="middle" class="ptn-s2">portón</text>
 <text x="180" y="166" text-anchor="middle" class="ptn-s2">Con el puente, el LED 1 de E-A8 (IN 1.1) se enciende = portón «abajo»</text></svg>`}
/* recuadro tras el punto 1 de cada caja roja de primera actuación */
function aplica(box,i){if(remota(i))return false;const t=nrm(box.textContent)+" "+otTxt(i);return RE.test(t)}
function inserta(){const cabs=document.querySelectorAll(".pucab");let nuevo=null;
 cabs.forEach(cab=>{if(!/PRIMERA ACTUACI|1ª ACTUACI/i.test(cab.textContent))return;const box=cab.parentElement;if(!box||box.querySelector(":scope .ptnb"))return;
  const i=otAct();if(!aplica(box,i))return;
  const p1=[...box.querySelectorAll(".puac")].find(x=>/^\s*1[.)]\s/.test(x.textContent)&&/recuperar la pasarela|maniobra|trasla|bypass|cerrar|carro|manual|mover|selector|enrollar/i.test(x.textContent))
   ||[...box.querySelectorAll(".puac")].find(x=>/^\s*1[.)]\s/.test(x.textContent));
  const ref=p1||cab;ref.insertAdjacentHTML("afterend",recuadro());nuevo=nuevo||i||{id:"sos"}});
 if(nuevo)emergente(nuevo)}
function emergente(i){const k="ptn_pop_"+(i.id||"x");try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1")}catch(e){}
 if(document.getElementById("ptnpop"))return;const d=document.createElement("div");d.id="ptnpop";d.className="ptnpop";d.setAttribute("role","alertdialog");
 d.innerHTML=`<div class="ptn">${CUERPO}<div class="ptn-s" style="margin-top:6px">Si no baja: anular el inductivo de cierre de portón <b>C-S9</b> (puente <b>+P-X92.1:1 ↔ :2</b>, ver la primera actuación).</div>
  <div class="ptn-bs"><button class="sec" onclick="document.getElementById('ptnpop').remove();const x=document.querySelector('.ptnb');if(x){x.querySelector('details').open=true;x.scrollIntoView({block:'center',behavior:'smooth'})}">Ver cómo</button><button class="pri" onclick="document.getElementById('ptnpop').remove()">Entendido</button></div></div>`;
 document.body.appendChild(d);try{navigator.vibrate&&navigator.vibrate([200,120,200])}catch(e){}}
let t=0;new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;try{inserta()}catch(e){console.warn("porton",e)}},200)}).observe(document.body,{childList:true,subtree:true});
setTimeout(()=>{try{inserta()}catch(e){}},600);
window.portonHTML=recuadro;
const st=document.createElement("style");st.textContent=`
.ptn{margin:8px 0;padding:9px 11px;border:2.5px solid #f2c200;border-radius:10px;background:#fff6c2;color:#3a2e00;animation:ptnP 1s steps(1,end) infinite}
.ptn .puac,.ptn summary{color:#3a2e00}
@keyframes ptnP{50%{background:#ffe24d;border-color:#c99a00}}
@media (prefers-reduced-motion:reduce){.ptn{animation:none}}
.ptn-t{font-weight:900;font-size:15px;line-height:1.25;letter-spacing:.01em}
.ptn-s{font-size:13px;line-height:1.35;margin-top:3px}
.ptn-d{margin-top:6px}.ptn-d>summary{cursor:pointer;font-weight:800;font-size:13px}
.ptn-svg{display:block;width:100%;max-width:380px;margin:6px auto;background:#fffbe6;border-radius:8px}
.ptn-z{font:800 8px sans-serif;fill:#6b5a00;letter-spacing:.04em}.ptn-zl{stroke:#b9a24a;stroke-width:1.2;stroke-dasharray:5 4}
.ptn-plc{fill:#f2c200;stroke:#a68400}.ptn-b{font:800 9px sans-serif;fill:#111}.ptn-s2{font:600 7.5px sans-serif;fill:#4a3d00}
.ptn-w{stroke:#222;stroke-width:1.3}.ptn-reg{fill:#1565c033;stroke:#1565c0}.ptn-bn{fill:#fff;stroke:#1565c0;stroke-width:1.5}.ptn-bt{font:800 9px sans-serif;fill:#111}
.ptn-sen{fill:#e3e7ee;stroke:#555}.ptn-pte{fill:none;stroke:#e53935;stroke-width:3;stroke-dasharray:5 3;animation:ptnD 1s linear infinite}.ptn-pc{fill:#e53935}.ptn-pt{font:900 8.5px sans-serif;fill:#e53935}
@keyframes ptnD{to{stroke-dashoffset:-16}}
.ptnpop{position:fixed;left:10px;right:10px;top:calc(env(safe-area-inset-top,0px) + 70px);z-index:100000;max-width:520px;margin:0 auto;box-shadow:0 10px 30px #0008;border-radius:12px}
.ptnpop .ptn{margin:0}.ptn-bs{display:flex;gap:8px;margin-top:10px}.ptn-bs button{flex:1}`;document.head.appendChild(st);
})();
