/* ===== v566: Componentes de campo · en modo Técnico (y Operador) solo consulta (17/11/2026) =====
   Incorporar, editar ficha, foto nueva, guardar, eliminar o restaurar quedan desactivados: solo el modo Administrador
   puede añadir o modificar componentes. Los botones se ven en gris y no responden. ===== */
(function(){
"use strict";
const esAdm=()=>{try{return typeof admin!="undefined"&&!!admin}catch(e){return false}};
const aviso=()=>{if(typeof msg=="function")msg("🔒 Solo el modo Administrador puede añadir o modificar componentes")};
/* 1) las funciones de alta y edición no hacen nada fuera de Admin */
["compIncorpora","compEdita","compFotoNueva","compGuarda","compEdGuarda","compEdBorra","compQuita","compFichaX","compFichaXGuarda"].forEach(n=>{
 const o=window[n];if(typeof o!="function")return;
 window[n]=function(){if(!esAdm()){aviso();const i=arguments[1];if(i&&i.tagName=="INPUT")i.value="";return}return o.apply(this,arguments)}});
/* 2) los botones se ven desactivados */
const SEL=".cedb button,.cedb label,#cn_inc,.cninc,#compCapa .cnsx,button[onclick^='compIncorpora']";
const marca=()=>{const ro=!esAdm();document.documentElement.classList.toggle("compRO",ro);
 document.querySelectorAll(SEL).forEach(b=>{if(b.tagName=="BUTTON"&&b.disabled!==ro)b.disabled=ro;{const v=ro?"true":"false";if(b.getAttribute("aria-disabled")!==v)b.setAttribute("aria-disabled",v)}})};
/* 3) por si algún botón no se ha marcado aún: se corta el toque antes de que llegue a su acción */
["click","touchstart"].forEach(t=>document.addEventListener(t,e=>{if(esAdm())return;const b=e.target.closest&&e.target.closest(SEL);if(!b)return;
 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();if(t=="click")aviso()},{capture:true,passive:false}));
new MutationObserver(()=>{clearTimeout(marca.t);marca.t=setTimeout(marca,60)}).observe(document.body,{childList:true,subtree:true});
setInterval(marca,1500);marca();
const st=document.createElement("style");st.textContent=`
html.compRO .cedb button,html.compRO .cedb label,html.compRO #cn_inc,html.compRO .cninc,html.compRO button[onclick^='compIncorpora']{opacity:.38!important;filter:grayscale(1);cursor:not-allowed}
html.compRO #compCapa .cnsx{display:none!important}`;document.head.appendChild(st);
})();
