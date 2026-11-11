/* ===== v276: Guía de campo · TODAS las cajas de título con la MISMA tipografía y en UNA línea =====
 Antes convivían dos estilos: los grupos por sistema en mayúsculas de máquina con espaciado (y partían en dos líneas)
 y las cajas sueltas en la tipografía normal. Ahora todas (grupos, casos, Análisis de OT, Comprobaciones por sistema,
 Mapa de alimentaciones, Cierre…) usan la tipografía de la app, negrita, mismo tamaño, en una sola línea:
 icono · título (con «…» si no cabe) · contador compacto a la derecha · ▾. El título completo sale al dejar el dedo encima. */
(function(){
"use strict";
const S="#app details:is(.gd,.ggrp,.anap,.otrel)";
const css=document.createElement("style");css.textContent=`
${S}>summary{display:flex!important;align-items:center!important;flex-wrap:nowrap!important;gap:8px!important;list-style:none;cursor:pointer;min-height:38px;padding:2px 0!important;font-family:inherit!important}
${S}>summary::-webkit-details-marker{display:none}
${S}>summary>b{flex:1 1 auto!important;min-width:0!important;display:block!important;font-family:inherit!important;font-size:15px!important;font-weight:700!important;letter-spacing:0!important;text-transform:none!important;line-height:1.3!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;color:var(--tx)}
${S}>summary>b .zic{margin-right:8px!important;vertical-align:middle}
${S}>summary>b .zic img,${S}>summary>b .zic svg{width:28px!important;height:28px!important}
${S}>summary>:is(span,.ggn):not(.gefb){flex:none!important;white-space:nowrap!important;font-family:inherit!important;font-size:12px!important;font-weight:600!important;letter-spacing:0!important;text-transform:none!important;color:var(--mu)!important}
${S}>summary::after{content:"▾";flex:none;color:var(--mu);font-size:13px;transition:transform .2s}
${S}[open]>summary::after{transform:rotate(180deg)}
${S}>summary br{display:none}
${S}>summary.gsumef{display:grid!important;grid-template-columns:minmax(0,1fr) auto auto;row-gap:6px!important}
${S}>summary>.gefb{grid-column:1/-1;justify-self:stretch}
#app details.ggrp>details.gd>summary>b{font-size:15px!important}
${S}>summary.anasum{flex-wrap:wrap!important;row-gap:6px!important}
${S}>summary.anasum{display:flex!important}
${S}>summary.anasum>b{flex:1 1 calc(100% - 40px)!important;white-space:normal!important}
${S}>summary.anasum>span.anacnt{order:3;flex:1 1 100%!important;width:100%;display:flex;flex-wrap:wrap;gap:6px;white-space:normal!important;font-size:13px!important;font-weight:500!important}
.anacnt .anan{display:inline-flex;align-items:baseline;gap:4px;padding:3px 10px;border-radius:999px;border:1px solid color-mix(in srgb,#ef6c00 55%,transparent);background:color-mix(in srgb,#ef6c00 8%,transparent);color:var(--tx)}
.anacnt .anan b{color:#ef6c00;font-weight:800;font-size:14px}`;
document.head.appendChild(css);
/* contador compacto («5 casos · 0/45» → «5 · 0/45», «(PAS · 28 sistemas)» → «28») y título completo como pista */
/* v277: sin selectores :has() (en el Safari del iPhone se recalculaban con cada fotograma de las animaciones y bloqueaban la PWA):
   las clases las pone este código */
function compacta(){const app=document.getElementById("app");if(app){const g=!!app.querySelector("details.gd");if(app.classList.contains("gtit")!=g)app.classList.toggle("gtit",g)}
 document.querySelectorAll(S+">summary").forEach(sm=>{const ef=!!sm.querySelector(":scope>.gefb");if(sm.classList.contains("gsumef")!=ef)sm.classList.toggle("gsumef",ef);if(sm.dataset.tt)return;sm.dataset.tt=1;
 const b=sm.querySelector(":scope>b");if(b)sm.title=b.textContent.replace(/\s+/g," ").trim();
 sm.querySelectorAll(":scope>span.ggn").forEach(x=>{x.textContent=x.textContent.replace(/\s*casos?\b/,"")});
 sm.querySelectorAll(":scope>span.mu").forEach(x=>{const q=/(\d+) señal\(es\) · (\d+) módulo\(s\) · (\d+) elemento\(s\)/.exec(x.textContent);if(q){/* v413: Análisis de la OT · contadores en palabras completas, debajo del título (antes «3 señ. · 1 mód. · 5 elem.» a la derecha, no se leía) */
   const n=(v,a,b)=>`<span class="anan"><b>${v}</b> ${+v==1?a:b}</span>`;x.classList.add("anacnt");x.dataset.nocol="1";
   x.innerHTML=n(q[1],"señal PLC","señales PLC")+n(q[2],"módulo","módulos")+n(q[3],"elemento de campo","elementos de campo");sm.classList.add("anasum");return}const m=/\(([A-Z0-9]+) · (\d+) sistemas?\)/.exec(x.textContent);if(m)x.textContent=m[2]+" sist."})})}
let pend=0;new MutationObserver(ms=>{if(pend||!ms.some(m=>[...m.addedNodes].some(n=>n.nodeType==1&&!(n.closest&&n.closest(".gsim")))))return;pend=1;setTimeout(()=>{pend=0;try{compacta()}catch(e){}},150)}).observe(document.body,{childList:true,subtree:true});
try{compacta()}catch(e){}
})();
/* v276: los títulos de las tarjetas de la guía (Guía de campo, Resolución IA, croquis, primera actuación…) también con la misma tipografía */
(function(){const st=document.createElement("style");st.textContent=`
#app.gtit .card>h3,#app.gtit .card h3{font-family:inherit!important;font-size:15px!important;font-weight:700!important;letter-spacing:0!important;text-transform:none!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#app.gtit .pucab{font-family:inherit!important;font-size:15px!important;letter-spacing:0!important}`;document.head.appendChild(st)})();
/* v283: tipografía como antes (15 px). Si el título de una caja no cabe en una línea, pasa a DOS líneas equilibradas
   (mismo largo aproximado, text-wrap:balance) y solo si no cabe en dos sale «…». Todas las cajas de cada sistema reservan
   la altura de dos líneas, así tienen el mismo tamaño quepa el título en una o en dos. */
(function(){const st=document.createElement("style");st.textContent=`
#app details:is(.gd,.ggrp,.anap,.otrel)>summary{min-height:44px!important}
#app details:is(.gd,.ggrp,.anap,.otrel)>summary>b{white-space:normal!important;display:-webkit-box!important;-webkit-box-orient:vertical;-webkit-line-clamp:2;line-clamp:2;text-wrap:balance;overflow:hidden!important;overflow-wrap:anywhere;line-height:1.3!important;font-size:15px!important}`;document.head.appendChild(st)})();
/* v284: con título en dos líneas, la segunda empieza alineada con la primera (debajo de la primera letra, no del icono):
   el icono queda en su propia columna a la izquierda, centrado en alto, y el texto con sangría fija a su derecha */
(function(){const st=document.createElement("style");st.textContent=`
#app details:is(.gd,.ggrp,.anap,.otrel)>summary>b.gzi{position:relative!important;padding-left:36px!important}
#app details:is(.gd,.ggrp,.anap,.otrel)>summary>b.gzi>.zic{position:absolute!important;left:0;top:50%;transform:translateY(-50%);margin:0!important;line-height:0}`;document.head.appendChild(st)})();
