/* ===== v934: REGISTRAR OT en cadena, sin tocar casillas (26/11/2026) =====
   1. Al pulsar «Registrar» → teclado numérico ya en «Teclear nº» de la Posición PBB.
   1b. (v937) Posición aceptada → descripción → «Siguiente» → nº de orden → con los 3 dígitos se guarda sola.
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
/* v949: ✕ para cerrar «Registrar OT» (arriba a la derecha de la tarjeta, como en «Importar hoja de registro de OT») → vuelve al Panel */
const ponX=()=>{try{if(typeof view!="undefined"&&view!="new")return;const card=document.querySelector("#app>.card");if(!card||card.querySelector(".regx"))return;
 if(getComputedStyle(card).position=="static")card.style.position="relative";
 const b=document.createElement("button");b.type="button";b.className="sec regx";b.setAttribute("aria-label","Cerrar Registrar OT");b.title="Cerrar";b.textContent="✕";
 b.onclick=e=>{e.preventDefault();e.stopPropagation();go("dash")};card.appendChild(b)}catch(_){}};
const st=document.createElement("style");st.textContent=`#app>.card>.regx{position:absolute!important;top:10px;right:10px;z-index:5;width:40px!important;height:36px!important;min-height:0!important;margin:0!important;padding:0!important;
 border-radius:10px!important;display:grid!important;place-items:center;font-size:17px!important;font-weight:800;line-height:1}
/* v950: micrófono del mismo tamaño que la ✕ y en su misma columna (justo debajo); botón SIGMAS centrado entre «Registrar OT» y la ✕ */
#app>.card>.micb{position:absolute!important;top:54px!important;right:10px!important;width:40px!important;height:36px!important;min-height:0!important;margin:0!important;padding:0!important;
 border-radius:10px!important;display:grid!important;place-items:center;z-index:5}
#app>.card>.micb svg{width:20px;height:20px}
#app.regot>.card:first-child>h3{padding-right:52px!important}
#app.regot>.card:first-child>h3>.sigB{margin-left:auto!important;margin-right:auto!important}`;document.head.appendChild(st);
new MutationObserver(ponX).observe(document.getElementById("app")||document.body,{childList:true});
const og=go;go=function(v){const r=og.apply(this,arguments);if(v=="new"){ponX();prepara();foco($i("f_posn")||$i("f_pos"))}return r};window.go=go;
/* v936→v937 · 1b · posición ACEPTADA (lo tecleado ya es una PBB del listado) → cursor en la DESCRIPCIÓN (y después, con «Siguiente», al nº de orden) */
document.addEventListener("input",e=>{const n=e.target;if(!n||n.id!=="f_posn")return;setTimeout(()=>{const s=$i("f_pos"),v=(n.value||"").trim();
 if(!s||v.length<3||document.activeElement!==n)return;if(String(s.value).replace(/\s*·.*$/,"")!==v)return;const d=$i("f_desc"),o=$i("f_ord");if(d&&!d.value.trim())foco(d);else if(o&&!o.value)foco(o)},0)},true);
/* 2 · tipo elegido → descripción (si está vacía; si no, al nº de orden) */
window.vaAOrden=function(on){if(!on)return;prepara();const d=$i("f_desc"),o=$i("f_ord");
 if(d&&!d.value.trim()&&d.offsetParent){foco(d);return}if(o&&!o.value&&o.offsetParent)foco(o)};
/* 3 · descripción: Intro → nº de orden; si el nº ya está completo, se guarda (Mayúsculas+Intro sigue haciendo salto de línea) */
document.addEventListener("keydown",e=>{const d=e.target;if(!d||d.id!=="f_desc"||e.key!=="Enter"||e.shiftKey)return;
 if(!d.value.trim())return;e.preventDefault();const o=$i("f_ord");if(o&&/^[0-9]{3}$/.test(o.value)){hecho="";guarda(true);return}if(o)foco(o)},true);
/* v940 · 3b · descripción escrita y se cierra el teclado (✓ / «OK» de la barra del iPhone) o se toca fuera → cursor al nº de orden
   (si se toca otro campo, se respeta ese campo) */
document.addEventListener("blur",e=>{const d=e.target;if(!d||d.id!=="f_desc"||!d.value.trim())return;
 const rt=e.relatedTarget;if(rt&&/^(INPUT|TEXTAREA|SELECT)$/.test(rt.tagName)&&rt.id!=="f_ord")return;
 const o=$i("f_ord");if(!o||o.value)return;if(typeof view!="undefined"&&view!="new")return;setTimeout(()=>{if(document.activeElement&&/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName))return;foco(o)},0)},true);
/* 4 · nº de orden completo → guardar solo */
let tm=0,hecho="";
const listo=()=>{const d=$i("f_desc");return !!(d&&d.value.trim()&&document.querySelector(".eqc:checked"))};
const guarda=forz=>{clearTimeout(tm);tm=0;const o=$i("f_ord");if(!o||!/^[0-9]{3}$/.test(o.value)||hecho===o.value)return;
 if(typeof view!="undefined"&&view!="new")return;
 /* v936: si aún falta la descripción (la posición lleva directo al nº), no se guarda: el cursor pasa a la descripción */
 if(!listo()){const d=$i("f_desc");if(d&&!d.value.trim()){foco(d);if(typeof msg=="function")msg("Escribe la descripción y pulsa «Siguiente» para guardar")}return}hecho=o.value;try{o.blur()}catch(_){}if(typeof guardar=="function")guardar();
 setTimeout(()=>{if(typeof view!="undefined"&&view=="new")hecho=""},300)};/* si guardar no pudo (falta algo), se puede volver a intentar */
document.addEventListener("input",e=>{const o=e.target;if(!o||o.id!=="f_ord")return;clearTimeout(tm);
 if(/^[0-9]{3}$/.test(o.value)){if(listo()){if(typeof msg=="function")msg("Guardando la incidencia…");tm=setTimeout(guarda,1000)}else guarda()}else hecho=""},true);
document.addEventListener("blur",e=>{const o=e.target;if(o&&o.id==="f_ord"&&/^[0-9]{3}$/.test(o.value)&&tm)guarda()},true);
})();
