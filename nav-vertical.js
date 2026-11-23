/* ===== v788: iconos más grandes, oscurecido más suave, letras blancas.
   v787: botones más pequeños y cuadrados (aspect-ratio 1), ajustados al texto.
   v779: barra lateral en VERTICAL (23/11/2026) =====
   La tira de botones sale en columna desde la pestaña ☰ hacia arriba: los textos ya no se cortan (dos líneas si hace falta)
   y los iconos son más grandes. Se mantiene la posición de la pestaña (nav-fija.js) y el tema consola (nav-pro.js). ===== */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
html body #nav#nav{width:122px!important;max-width:122px!important;height:auto!important;
 max-height:calc(var(--nvb,100vh) - 150px)!important;flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important;
 overflow-x:hidden!important;overflow-y:auto!important;padding:8px 6px 8px 36px!important;border-radius:0 18px 18px 0!important;
 transform:translate(-102%,calc(-100% + 72px))!important}
html body #nav#nav.abre{transform:translate(0,calc(-100% + 72px))!important}
html body #nav#nav button{flex:0 0 auto!important;width:100%!important;max-width:none!important;min-width:0!important;min-height:0;aspect-ratio:1/1;
 margin:3px 0!important;padding:12px 3px 5px!important;gap:3px!important;border-radius:10px!important;white-space:normal!important;overflow:visible!important;
 font-size:10.5px!important;line-height:1.1!important;hyphens:auto;text-align:center!important;word-break:normal;overflow-wrap:anywhere}
html body #nav#nav button span{font-size:38px!important}
html body #nav#nav button span svg{width:40px!important;height:40px!important}
html body #nav#nav button.ninicio span svg{width:42px!important;height:42px!important}
/* v788: fondo oscurecido más suave y letras en blanco sobre botones oscuros (también en modo claro) */
html body #navbg.abre{background:#00000026!important}
html body #nav#nav button{color:#fff!important}
html.lt body #nav#nav button:not(.on){background:linear-gradient(180deg,#2a2e3a,#1b1e27)!important;border-color:#ffffff1f!important}
html.lt body #nav#nav{background:linear-gradient(135deg,#1a1d25f2,#111319f2) padding-box,linear-gradient(135deg,#ff7a1a,#8e44ff 55%,#1e88e5) border-box!important}
html body #nav#nav button.on::after{left:auto!important;right:-1px!important;top:25%!important;bottom:25%!important;width:3px!important;height:auto!important}`;
document.head.appendChild(st);
})();

/* ===== v798: barra izquierda con el MISMO tamaño de botones que la derecha (100 px de ancho, iconos de 28 px) ===== */
(function(){"use strict";const st=document.createElement("style");st.textContent=`
html body #nav#nav{width:100px!important;max-width:100px!important;padding:8px 6px 8px 32px!important}
html body #nav#nav button{padding:13px 2px 5px!important;gap:4px!important;font-size:7.8px!important;letter-spacing:-.3px!important;white-space:nowrap!important}
html body #nav#nav button span{font-size:28px!important}
html body #nav#nav button span svg,html body #nav#nav button.ninicio span svg{width:28px!important;height:28px!important}
html body #nav#nav button i.tkn{font-size:8px!important}`;document.head.appendChild(st)})();

/* ===== v800: cierre de la barra izquierda en CASCADA (23/11/2026) =====
   Al cerrar, los botones se van uno tras otro de arriba abajo (se desvanecen, bajan y se desplazan a la izquierda con un ligero
   desenfoque) y después se recoge el panel. Al abrir, entran también escalonados. Respeta «reducir movimiento» del teléfono. ===== */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
html body #nav#nav{transition:transform .34s cubic-bezier(.55,0,.75,.2) .40s,visibility 0s linear .76s,box-shadow .3s ease .4s!important}
html body #nav#nav.abre{transition:transform .32s cubic-bezier(.16,1,.3,1),visibility 0s,box-shadow .3s ease!important}
html body #nav#nav>button{will-change:transform,opacity;
 transition:opacity .26s ease calc(var(--nvi,0)*38ms),transform .34s cubic-bezier(.55,0,.75,.2) calc(var(--nvi,0)*38ms),filter .26s ease calc(var(--nvi,0)*38ms)!important}
html body #nav#nav:not(.abre)>button{opacity:0!important;transform:translate(-26px,22px) scale(.86) rotate(-3deg)!important;filter:blur(2px)}
html body #nav#nav.abre>button{opacity:1;transform:none;filter:none;
 transition:opacity .3s ease calc(var(--nvi,0)*30ms + 90ms),transform .42s cubic-bezier(.16,1,.3,1) calc(var(--nvi,0)*30ms + 90ms),filter .3s ease calc(var(--nvi,0)*30ms + 90ms)!important}
html body #nav#nav.abre>button:active{transform:scale(.94)!important;transition-delay:0s!important}
html body #nav#nav::after{content:"";position:absolute;left:0;right:0;top:0;height:0;pointer-events:none;border-radius:inherit;
 background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--tkor,#ff7a1a) 22%,transparent) 70%,transparent);opacity:0}
html body #nav#nav:not(.abre)::after{animation:nvCasc .42s ease-in forwards}
@keyframes nvCasc{0%{top:0;height:30%;opacity:.9}100%{top:100%;height:30%;opacity:0}}
@media (prefers-reduced-motion:reduce){html body #nav#nav,html body #nav#nav>button{transition-duration:.01s!important;transition-delay:0s!important}
 html body #nav#nav:not(.abre)::after{animation:none}}`;
document.head.appendChild(st);
/* índice de cada botón para el escalonado (la barra se rehace al cambiar de modo) */
const num=()=>{const n=document.getElementById("nav");if(!n)return;[...n.children].forEach((b,k)=>{if(b.style.getPropertyValue("--nvi")!==String(k))b.style.setProperty("--nvi",k)})};
num();setInterval(num,1000);
})();
