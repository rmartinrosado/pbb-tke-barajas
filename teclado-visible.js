/* ===== v961: el TECLADO del iPhone no tapa la caja en la que se escribe (26/11/2026) =====
   En las hojas (SOS, Resolución IA…) la caja de abajo del todo («Pregunta a Claude sobre esta avería») quedaba debajo del
   teclado: la hoja no se desplazaba y, al estar al final, tampoco tenía sitio para subir. Ahora, al tocar una caja de texto:
   · se mide el borde real de lo visible (visualViewport) mientras el teclado se abre;
   · si hace falta, se deja debajo de la hoja un hueco del alto del teclado y se desplaza la hoja hasta que la caja (y su botón
     ENVIAR) quede justo por encima del teclado;
   · al salir de la caja, el hueco se quita. ===== */
(function(){"use strict";
const ES=el=>el&&/^(INPUT|TEXTAREA)$/.test(el.tagName)&&!/^(checkbox|radio|button|submit|file|range|color|date|time)$/i.test(el.type||"");
const scrollPadre=el=>{let p=el.parentElement;while(p&&p!==document.body){const s=getComputedStyle(p);if(/(auto|scroll)/.test(s.overflowY)&&p.scrollHeight>p.clientHeight+2)return p;p=p.parentElement}return null};
let hueco=null,cont=null,timer=0;
function quitaHueco(){if(hueco){hueco.remove();hueco=null}cont=null}
function coloca(el){if(!el||document.activeElement!==el)return;const vv=window.visualViewport;if(!vv)return;
 const tecl=Math.max(0,innerHeight-vv.height-vv.offsetTop);if(tecl<80)return; /* teclado aún cerrado */
 const p=scrollPadre(el)||(el.closest("#sheet")&&el.closest("#sheet").querySelector(":scope>div"));if(!p)return;
 /* hueco al final del contenido para poder subir la caja por encima del teclado */
 if(cont!==p){quitaHueco();cont=p}
 if(!hueco){hueco=document.createElement("div");hueco.className="tkhueco";hueco.setAttribute("aria-hidden","true");p.appendChild(hueco)}
 hueco.style.height=Math.round(tecl+20)+"px";
 /* la caja con su fila (botón ENVIAR al lado) */
 const fila=el.closest(".siachf,.srobrow,.ubb,.card")||el;const r=(fila.contains(el)&&fila.getBoundingClientRect().height<vv.height*.6?fila:el).getBoundingClientRect();
 const abajo=vv.offsetTop+vv.height-10,arriba=vv.offsetTop+(parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--hkh"))||0)+8;
 let d=0;if(r.bottom>abajo)d=r.bottom-abajo;else if(r.top<arriba)d=r.top-arriba;
 if(Math.abs(d)>2){p.scrollTop+=d}}
function vigila(el){clearInterval(timer);let n=0;timer=setInterval(()=>{coloca(el);if(++n>12||document.activeElement!==el)clearInterval(timer)},120)}
document.addEventListener("focusin",e=>{const el=e.target;if(!ES(el)||!el.closest("#sheet"))return;vigila(el)},true);
document.addEventListener("focusout",e=>{if(!ES(e.target))return;setTimeout(()=>{if(!ES(document.activeElement))quitaHueco()},250)},true);
try{if(window.visualViewport){const f=()=>{const a=document.activeElement;if(ES(a)&&a.closest("#sheet"))coloca(a)};visualViewport.addEventListener("resize",f);visualViewport.addEventListener("scroll",f)}}catch(_){}
const st=document.createElement("style");st.textContent=".tkhueco{flex:none;pointer-events:none}";document.head.appendChild(st);
})();
