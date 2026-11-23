/* ===== v779: barra lateral en VERTICAL (23/11/2026) =====
   La tira de botones sale en columna desde la pestaña ☰ hacia arriba: los textos ya no se cortan (dos líneas si hace falta)
   y los iconos son más grandes. Se mantiene la posición de la pestaña (nav-fija.js) y el tema consola (nav-pro.js). ===== */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
html body #nav#nav{width:132px!important;max-width:132px!important;height:auto!important;
 max-height:calc(var(--nvb,100vh) - 150px)!important;flex-direction:column!important;flex-wrap:nowrap!important;align-items:stretch!important;
 overflow-x:hidden!important;overflow-y:auto!important;padding:8px 6px 8px 36px!important;border-radius:0 18px 18px 0!important;
 transform:translate(-102%,calc(-100% + 72px))!important}
html body #nav#nav.abre{transform:translate(0,calc(-100% + 72px))!important}
html body #nav#nav button{flex:0 0 auto!important;width:100%!important;max-width:none!important;min-width:0!important;min-height:66px;
 margin:4px 0!important;padding:16px 4px 8px!important;gap:5px!important;white-space:normal!important;overflow:visible!important;
 font-size:11.5px!important;line-height:1.15!important;text-align:center!important;word-break:normal;overflow-wrap:anywhere}
html body #nav#nav button span{font-size:30px!important}
html body #nav#nav button span svg{width:32px!important;height:32px!important}
html body #nav#nav button.ninicio span svg{width:36px!important;height:36px!important}
html body #nav#nav button.on::after{left:auto!important;right:-1px!important;top:25%!important;bottom:25%!important;width:3px!important;height:auto!important}`;
document.head.appendChild(st);
})();
