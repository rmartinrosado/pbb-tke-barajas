/* ===== v429: SOS · «Analizar con Claude» (bloque 3 · análisis profundo) sin que la pantalla se mueva =====
   La caja de progreso (#sr_ia) estaba encima de los resultados: al pulsar el botón del bloque 3 crecía por arriba
   y empujaba la pantalla, y cada segundo cambiaba de alto. Ahora:
   · la caja de progreso se coloca justo debajo del botón que se ha pulsado (bloque 3 o «Aceptar» de arriba);
   · antes de volver a pintar los resultados («Ver actuación») vuelve a su sitio bajo «Aceptar», sin perderse;
   · la línea de vista previa tiene alto fijo para que no salte. ===== */
(function(){
const ia=()=>document.getElementById("sr_ia");
const mueve=(ref)=>{const c=ia();if(!c||!ref||!ref.parentNode)return;if(ref.nextElementSibling!==c)ref.parentNode.insertBefore(c,ref.nextSibling)};
const casa=()=>{const row=document.querySelector("#sheetc .srobrow");if(row)mueve(row)};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#sheetc .ub3b, #sheetc .srobrow .srobok");if(!b)return;
 const ref=b.classList.contains("ub3b")?b:b.closest(".srobrow");
 /* conserva la posición del botón en pantalla mientras se coloca la caja */
 const y=b.getBoundingClientRect().top;mueve(ref);
 const sc=(()=>{let p=b.parentElement;while(p&&p!==document.body){const s=getComputedStyle(p);if(/(auto|scroll)/.test(s.overflowY)&&p.scrollHeight>p.clientHeight)return p;p=p.parentElement}return document.scrollingElement})();
 const d=b.getBoundingClientRect().top-y;if(d&&sc)sc.scrollTop+=d},true);
const oa=window.sosAnaliza;if(typeof oa=="function")window.sosAnaliza=function(){casa();return oa.apply(this,arguments)};
const st=document.createElement("style");st.textContent=`#sheetc,#sheetc *{overflow-anchor:none}
#sr_ia .siat{height:3.6em;max-height:3.6em}#sr_ia .siam{min-height:1.3em}`;document.head.appendChild(st);
})();
/* ===== v432: cabecera del SOS · sin campana, título «SOS - ACTUACIÓN RÁPIDA» en una línea (recuadro rojo, letra blanca negrita
   parpadeando), texto justificado, pasos en MAYÚSCULAS y rótulos de las casillas algo más grandes ===== */
(function(){
const o=window.sosRap;if(typeof o!="function")return;
window.sosRap=function(){const r=o.apply(this,arguments);try{
 const h=document.querySelector("#sheetc .sosrh");if(!h)return r;h.classList.add("sosr2");h.dataset.nocol="1";
 h.innerHTML=`<div class="sosr2t">SOS - ACTUACIÓN RÁPIDA</div>
 <p class="sosr2p">Posición y descripción en campo (el aviso de la OT); la alarma de la Magelis o su foto la complementan. Sale:</p>
 <ol class="sosr2l"><li>SACAR EN SERVICIO YA</li><li>REPARAR (ACTUACIÓN MÁS EFICAZ)</li><li>ANÁLISIS CON CLAUDE</li></ol>
 <p class="sosr2p">Cualquier sistema: pasarela, 400 Hz, aire acondicionado.</p>`}catch(e){}return r};
const st=document.createElement("style");st.textContent=`
#sheetc .sosr2{display:block!important;margin:0 0 8px}
.sosr2t{background:#d7191c;color:#fff;font-weight:900;font-size:clamp(15px,5vw,20px);letter-spacing:.04em;text-align:center;white-space:nowrap;
 border:2px solid #ff4d4f;border-radius:10px;padding:8px 6px;margin:0 0 10px;animation:sosr2b 1s steps(1,end) infinite}
@keyframes sosr2b{50%{color:transparent}}
.sosr2p{margin:0 0 6px;font-size:14px;line-height:1.4;text-align:justify;hyphens:none;color:var(--mu,#9aa3b2)}
.sosr2l{margin:0 0 6px;padding:0;list-style:none;counter-reset:s}
.sosr2l li{counter-increment:s;display:flex;align-items:center;gap:10px;font-weight:800;font-size:14px;text-transform:uppercase;padding:6px 0;border-bottom:1px dashed var(--bd,rgba(127,127,127,.35))}
.sosr2l li::before{content:counter(s);flex:none;width:26px;height:26px;border:2px solid var(--ac,#ff6a13);color:var(--ac,#ff6a13);border-radius:7px;display:flex;align-items:center;justify-content:center;font-weight:900}
#sheetc:has(.sosr2)>label,#sheetc:has(.sosr2) label:not(.srfoto){font-size:15px!important}`;
document.head.appendChild(st);
})();
