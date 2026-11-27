/* v306-v307: Simulador de tensiones (prueba). Fase 1: 24 Vdc de E/S del PLC (cableado.js). Fase 2 (v307): potencia desde el CBTH, red 400 V y SAI 230 V, según rev. J.
 Botón «Check» (v317; antes «Análisis», v311 «Tensiones») en el menú de la pestaña izquierda, junto a «Guía» (modos Técnico y Admin).
 v313: el Análisis se abre en una capa a pantalla completa DENTRO de la PWA (iframe con simulador.html), sin salir de la página.
 Antes se navegaba a simulador.html y al volver la PWA se recargaba entera: el Panel de control se redibujaba varias veces
 (restauración de sesión, carga de datos, fuentes, pilotos) y los textos temblaban. Ahora al volver solo se oculta la capa:
 la PWA no se recarga y el Análisis conserva su estado (pestaña, regletero, contactos abiertos) hasta cerrar la PWA. 
 v330: Potencia rehecha: sin escalera de sangría («↳ desde» cuando cambia de rama), resumen sin repetidos y agrupado por causa, escenarios combinables Maniobra + Avería marcados, bobinas (24 V del PLC, seguridades, contacto en serie) y nuevos circuitos: servicios 230 V, capota, portón, suelo, cabina, brazo, lunetas, válvulas subir/bajar y retorno autónomo. */
(function(){
 let capa=null;
 function abre(){
  /* v538: la flecha «Atrás» flotante no encontraba botón de cerrar en la capa y la quitaba de la página; al volver a pulsar
     Check se mostraba una capa ya quitada y se quedaba en el Panel de control. Ahora la capa lleva su botón «Cerrar» (oculto,
     lo usa la flecha) y, si aun así la capa no está en la página, se vuelve a poner. */
  if(capa&&!capa.isConnected)document.body.appendChild(capa);
  /* v542: cada vez que se abre el Check empieza sin análisis ni punto seleccionado */
  if(capa){const f=capa.querySelector("iframe");try{f&&f.contentWindow.postMessage("resetAnalisis",location.origin)}catch(e){}}
  if(!capa){capa=document.createElement("div");capa.id="simCapa";
   capa.style.cssText="position:fixed;inset:0;z-index:60;background:var(--bg,#11161b);display:none";
   const f=document.createElement("iframe");f.src="simulador.html?v=971&en=pwa"+(typeof window.es507Act=="function"&&window.es507Act()?"&pbb=507":"");f.title="Análisis";
   f.style.cssText="border:0;width:100%;height:100%;display:block;background:transparent";capa.appendChild(f);
   const x=document.createElement("button");x.type="button";x.setAttribute("aria-label","Cerrar Check");x.style.display="none";x.onclick=()=>cierra(false);capa.appendChild(x);
   document.body.appendChild(capa)}
  capa.style.display="block";document.documentElement.style.overflow="hidden";
  try{history.pushState({sim:1},"")}catch(e){}
 }
 function cierra(desdeHist){if(!capa||capa.style.display==="none")return;capa.style.display="none";document.documentElement.style.overflow="";
  if(!desdeHist){try{if(history.state&&history.state.sim)history.back()}catch(e){}}}
 window.abreAnalisis=abre;window.cierraAnalisis=()=>cierra(false);
 window.addEventListener("message",ev=>{if(ev.origin===location.origin&&ev.data==="cierraAnalisis")cierra(false)});
 window.addEventListener("popstate",()=>{try{if(history.state&&history.state.sim)return}catch(e){}cierra(true)});
 const o=render;render=function(){const r=o.apply(this,arguments);
  const nav=document.getElementById("nav");
  if(nav&&!nav.querySelector("[data-simv]")){const g=[...nav.children].find(x=>/Guía/.test(x.textContent));
   if(g){const b=document.createElement("button");b.dataset.simv="1";
    b.innerHTML='<span><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8 6h8v5H8z"/><path d="M12 11l2-3"/><circle cx="9" cy="17" r="1.3"/><circle cx="15" cy="17" r="1.3"/></svg></span>Check';
    b.onclick=abre;nav.insertBefore(b,g.nextSibling)}}
  return r}
})();
