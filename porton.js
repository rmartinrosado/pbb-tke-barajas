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
const LIMP=t=>typeof window.segLimpia=="function"?window.segLimpia(t):t;
const otTxt=i=>i?nrm([i.desc,i.def,LIMP(i.obs),LIMP(i.com)].filter(Boolean).join(" ")):""; /* v610: sin las frases que descartan */
const remota=i=>i&&/^(538|539|580|581|582)$/.test(String(i.pos));
const CUERPO=`<div class="ptn-t">⚠️ BAJAR PORTÓN de CABINA</div>
<div class="ptn-s">Permite la <b>traslación HACIA ATRÁS</b> de la PBB con los servicios auxiliares <b>AAA</b> y <b>HZ</b> conectados al avión.</div>`;
/* v530: de momento solo «BAJAR PORTÓN de CABINA» (sin la anulación del inductivo C-S9 ni su croquis) */
function recuadro(){return `<div class="ptn ptnb">${CUERPO}</div>`}
/* recuadro tras el punto 1 de cada caja roja de primera actuación */
function aplica(box,i){if(remota(i))return false;if(typeof window.otSoloAlum=="function"&&window.otSoloAlum(i))return false; /* v610: no en OT de alumbrado (gálibo, luces, caldeo) */const t=nrm(box.textContent)+" "+otTxt(i);return RE.test(t)}
function inserta(){const cabs=document.querySelectorAll(".pucab");let nuevo=null;
 cabs.forEach(cab=>{if(!/PRIMERA ACTUACI|1ª ACTUACI/i.test(cab.textContent))return;const box=cab.parentElement;if(!box||box.querySelector(":scope .ptnb"))return;
  const i=otAct();if(!aplica(box,i))return;
  const p1=[...box.querySelectorAll(".puac")].find(x=>/^\s*1[.)]\s/.test(x.textContent)&&/recuperar la pasarela|maniobra|trasla|bypass|cerrar|carro|manual|mover|selector|enrollar/i.test(x.textContent))
   ||[...box.querySelectorAll(".puac")].find(x=>/^\s*1[.)]\s/.test(x.textContent));
  /* v631: si hay puente provisional va SIEMPRE primero: sin punto 1 reconocible, el recuadro va al final de la caja (tras el puente), nunca delante */
  if(p1)p1.insertAdjacentHTML("afterend",recuadro());else box.insertAdjacentHTML("beforeend",recuadro());nuevo=nuevo||i||{id:"sos"}});
 if(nuevo)emergente(nuevo)}
function emergente(i){const k="ptn_pop_"+(i.id||"x");try{if(sessionStorage.getItem(k))return;sessionStorage.setItem(k,"1")}catch(e){}
 if(document.getElementById("ptnpop"))return;const d=document.createElement("div");d.id="ptnpop";d.className="ptnpop";d.setAttribute("role","alertdialog");
 d.innerHTML=`<div class="ptn">${CUERPO}<div class="ptn-bs"><button class="pri" onclick="document.getElementById('ptnpop').remove()">Entendido</button></div></div>`;
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
