/* ===== v890: croquis de los PUENTES PROVISIONALES a la mitad de tamaño en toda la PWA (SOS, guía de campo, lupa, OT, lista
   «Puentes», bumpers…). Un toque sobre el croquis lo amplía a tamaño completo y otro lo vuelve a reducir. El PDF de puentes no cambia. ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
svg.pzk,.pucroq svg{width:50%!important;max-width:210px!important;height:auto!important;display:block!important;margin:0 auto!important;cursor:zoom-in;transition:width .2s}
svg.pzk.pzkg,.pucroq svg.pzkg{width:100%!important;max-width:420px!important;cursor:zoom-out}
.gcri{text-align:center}`;
document.head.appendChild(st);
document.addEventListener("click",e=>{const s=e.target.closest&&e.target.closest("svg.pzk,.pucroq svg");if(!s)return;
 e.stopPropagation();s.classList.toggle("pzkg")},true);
})();
/* ===== v899: con los croquis a la mitad caben DOS por fila: el carrusel («desliza») pasa a rejilla y se ven TODOS los puentes a la
   vez (con 2 o más se veía solo el primero y había que deslizar sin saberlo). Un toque amplía ese croquis a todo el ancho.
   El rótulo «(desliza)» se cambia por «(todos a la vista)». ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
.gcrs,.gobss{flex-wrap:wrap!important;overflow-x:visible!important;scroll-snap-type:none!important;justify-content:center!important;gap:8px!important}
.gcrs>.gcri,.gobss>*{flex:1 1 46%!important;max-width:calc(50% - 4px)!important;min-width:0!important;scroll-snap-align:none!important}
.gcrs>.gcri:has(svg.pzkg),.gobss>*:has(svg.pzkg){flex-basis:100%!important;max-width:100%!important}
.gcrs svg.pzk,.gobss svg.pzk{width:100%!important;max-width:none!important}
.gcrs svg.pzk.pzkg,.gobss svg.pzk.pzkg{width:100%!important}`;
document.head.appendChild(st);
let pend=0;const fija=()=>{pend=0;document.querySelectorAll(".gcrh,.gobsh2").forEach(h=>{for(const n of h.childNodes)if(n.nodeType==3&&/\(desliza\)/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/\(desliza\)/g,"(todos a la vista)")})};
new MutationObserver(()=>{if(!pend){pend=1;requestAnimationFrame(fija)}}).observe(document.documentElement,{childList:true,subtree:true});
})();
