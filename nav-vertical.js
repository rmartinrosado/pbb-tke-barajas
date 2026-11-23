/* ===== v787: botones más pequeños y cuadrados (aspect-ratio 1), ajustados al texto.
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
html body #nav#nav button span{font-size:24px!important}
html body #nav#nav button span svg{width:26px!important;height:26px!important}
html body #nav#nav button.ninicio span svg{width:28px!important;height:28px!important}
html body #nav#nav button.on::after{left:auto!important;right:-1px!important;top:25%!important;bottom:25%!important;width:3px!important;height:auto!important}`;
document.head.appendChild(st);
})();
