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
