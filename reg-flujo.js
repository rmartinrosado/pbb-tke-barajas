/* ===== v934: REGISTRAR OT en cadena, sin tocar casillas (26/11/2026) =====
   1. Al pulsar «Registrar» → teclado numérico ya en «Teclear nº» de la Posición PBB.
   2. Al elegir el tipo (dibujo o casilla) → cursor en «Descripción de la incidencia» (v925 iba al nº de orden).
   3. En la descripción, la tecla «Siguiente»/Intro → cursor en el nº de orden (CGA).
   4. Con los 3 dígitos del nº de orden → se GUARDA SOLA la incidencia (1 s para corregir; al cerrar el teclado con los 3 dígitos,
      al momento) y se vuelve al Panel de control con la OT abierta. ===== */
(function(){
"use strict";
const $i=id=>document.getElementById(id);
const foco=el=>{if(!el)return;try{el.focus({preventScroll:true})}catch(_){el.focus()}try{el.scrollIntoView({block:"center",behavior:"smooth"})}catch(_){}};
const prepara=()=>{const d=$i("f_desc"),o=$i("f_ord");if(d)d.setAttribute("enterkeyhint","next");if(o){o.setAttribute("enterkeyhint","done");o.setAttribute("pattern","[0-9]*")}};
/* 1 · Registrar → posición (en el mismo toque, para que iOS saque el teclado) */
const og=go;go=function(v){const r=og.apply(this,arguments);if(v=="new"){prepara();foco($i("f_posn")||$i("f_pos"))}return r};window.go=go;
/* 2 · tipo elegido → descripción (si está vacía; si no, al nº de orden) */
window.vaAOrden=function(on){if(!on)return;prepara();const d=$i("f_desc"),o=$i("f_ord");
 if(d&&!d.value.trim()&&d.offsetParent){foco(d);return}if(o&&!o.value&&o.offsetParent)foco(o)};
/* 3 · descripción: Intro → nº de orden (Mayúsculas+Intro sigue haciendo salto de línea) */
document.addEventListener("keydown",e=>{const d=e.target;if(!d||d.id!=="f_desc"||e.key!=="Enter"||e.shiftKey)return;
 if(!d.value.trim())return;e.preventDefault();const o=$i("f_ord");if(o)foco(o)},true);
/* 4 · nº de orden completo → guardar solo */
let tm=0,hecho="";
const guarda=()=>{clearTimeout(tm);tm=0;const o=$i("f_ord");if(!o||!/^[0-9]{3}$/.test(o.value)||hecho===o.value)return;
 if(typeof view!="undefined"&&view!="new")return;hecho=o.value;try{o.blur()}catch(_){}if(typeof guardar=="function")guardar();
 setTimeout(()=>{if(typeof view!="undefined"&&view=="new")hecho=""},300)};/* si guardar no pudo (falta algo), se puede volver a intentar */
document.addEventListener("input",e=>{const o=e.target;if(!o||o.id!=="f_ord")return;clearTimeout(tm);
 if(/^[0-9]{3}$/.test(o.value)){if(typeof msg=="function")msg("Guardando la incidencia…");tm=setTimeout(guarda,1000)}else hecho=""},true);
document.addEventListener("blur",e=>{const o=e.target;if(o&&o.id==="f_ord"&&/^[0-9]{3}$/.test(o.value)&&tm)guarda()},true);
})();
