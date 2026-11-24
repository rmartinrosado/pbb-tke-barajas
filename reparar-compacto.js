/* v886: pantalla SOS (1 · SACAR EN SERVICIO YA, 2 · REPARAR, 3 · ANÁLISIS) con tipografía más pequeña para hacer menos scroll.
   Se reduce todo el contenido de las cajas en la misma proporción (textos, títulos, tabla de LED, ruta ORIGEN → DESTINO y croquis),
   así se mantiene la jerarquía de tamaños. Las franjas naranjas de título y el botón «Manos libres» no cambian. */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
#sr_res .ubb{zoom:.8}
#sr_res .ubb .lpap{margin:4px 0;line-height:1.3}
#sr_res .ubb .lpaef h3{margin:2px 0 6px}
#sr_res .ubb .lpaef{margin-top:8px;padding:8px 10px}`;
document.head.appendChild(st);
})();
