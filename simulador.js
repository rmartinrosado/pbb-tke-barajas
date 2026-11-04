/* v306-v307: Simulador de tensiones (prueba). Fase 1: 24 Vdc de E/S del PLC (cableado.js). Fase 2 (v307): potencia desde el CBTH, red 400 V y SAI 230 V, según rev. J.
 Botón «Análisis» (v311; antes «Tensiones») en el menú de la pestaña izquierda, junto a «Guía» (modos Técnico y Admin). Abre simulador.html. */
(function(){const o=render;render=function(){const r=o.apply(this,arguments);
 const nav=document.getElementById("nav");
 if(nav&&!nav.querySelector("[data-simv]")){const g=[...nav.children].find(x=>/Guía/.test(x.textContent));
  if(g){const b=document.createElement("button");b.dataset.simv="1";
   b.innerHTML='<span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8 6h8v5H8z"/><path d="M12 11l2-3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/></svg></span>Análisis';
   b.onclick=()=>{location.href="simulador.html"};nav.insertBefore(b,g.nextSibling)}}
 return r}})();
