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
