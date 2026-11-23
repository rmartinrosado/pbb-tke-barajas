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
