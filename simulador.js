/* v306-v307: Simulador de tensiones (prueba). Fase 1: 24 Vdc de E/S del PLC (cableado.js). Fase 2 (v307): potencia desde el CBTH, red 400 V y SAI 230 V, según rev. J.
 Botón «Análisis» (v311; antes «Tensiones») en el menú de la pestaña izquierda, junto a «Guía» (modos Técnico y Admin).
 v313: el Análisis se abre en una capa a pantalla completa DENTRO de la PWA (iframe con simulador.html), sin salir de la página.
 Antes se navegaba a simulador.html y al volver la PWA se recargaba entera: el Panel de control se redibujaba varias veces
 (restauración de sesión, carga de datos, fuentes, pilotos) y los textos temblaban. Ahora al volver solo se oculta la capa:
 la PWA no se recarga y el Análisis conserva su estado (pestaña, regletero, contactos abiertos) hasta cerrar la PWA. */
(function(){
 let capa=null;
 function abre(){
  if(!capa){capa=document.createElement("div");capa.id="simCapa";
   capa.style.cssText="position:fixed;inset:0;z-index:60;background:var(--bg,#11161b);display:none";
   const f=document.createElement("iframe");f.src="simulador.html?v=313&en=pwa";f.title="Análisis";
   f.style.cssText="border:0;width:100%;height:100%;display:block;background:transparent";capa.appendChild(f);document.body.appendChild(capa)}
  capa.style.display="block";document.documentElement.style.overflow="hidden";
  try{history.pushState({sim:1},"")}catch(e){}
 }
 function cierra(desdeHist){if(!capa||capa.style.display==="none")return;capa.style.display="none";document.documentElement.style.overflow="";
  if(!desdeHist){try{if(history.state&&history.state.sim)history.back()}catch(e){}}}
 window.abreAnalisis=abre;window.cierraAnalisis=()=>cierra(false);
 window.addEventListener("message",ev=>{if(ev.origin===location.origin&&ev.data==="cierraAnalisis")cierra(false)});
 window.addEventListener("popstate",()=>cierra(true));
 const o=render;render=function(){const r=o.apply(this,arguments);
  const nav=document.getElementById("nav");
  if(nav&&!nav.querySelector("[data-simv]")){const g=[...nav.children].find(x=>/Guía/.test(x.textContent));
   if(g){const b=document.createElement("button");b.dataset.simv="1";
    b.innerHTML='<span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8 6h8v5H8z"/><path d="M12 11l2-3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/></svg></span>Análisis';
    b.onclick=abre;nav.insertBefore(b,g.nextSibling)}}
  return r}
})();
