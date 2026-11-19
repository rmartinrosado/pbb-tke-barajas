/* v623: los botones flotantes («+» y flecha atrás) y la barra de abajo (pestaña ☰ + tira) se ven SIEMPRE, durante todo el
   desplazamiento de cualquier pantalla.
   En el iPhone (PWA instalada), tras cerrar el teclado, volver de otra app o con el rebote del scroll, la pantalla visible
   (visualViewport) queda desplazada respecto a la «pantalla de diseño» donde se colocan los elementos fijos: los botones
   flotantes se iban hacia arriba hasta salirse y la pestaña ☰ quedaba a media altura.
   Aquí se mide en cada fotograma, mientras se toca o se desplaza (y medio segundo después), dónde está la pantalla real
   y se corrigen con «translate» (no toca top/left, que siguen siendo los que guarda el arrastre).
   Además, si la pantalla real es más baja que la de diseño, los flotantes se suben para que no queden por debajo. */
(function(){
 const R=document.documentElement;
 const st=document.createElement("style");st.textContent=`
#fab,#fabb,#fabm{translate:0 var(--fvy,0px)}
#fab:not(.oc),#fabb:not(.oc){visibility:visible!important}`;
 document.head.appendChild(st);
 const S=58,MG=8;
 const fija=el=>{if(!el)return;const vv=window.visualViewport;const t0=parseFloat(el.style.top);if(!isFinite(t0))return;
  let dy=vv?vv.offsetTop:0;const Hv=vv?vv.height:innerHeight;
  const tope=Hv-S-MG-(el.id=="fab"?80:0);      /* el «+» deja sitio a la flecha que va debajo */
  if(t0>tope)dy-=t0-tope;if(t0<MG)dy+=MG-t0;
  dy=Math.round(dy);const v=dy+"px";if(el.style.getPropertyValue("--fvy")!==v)el.style.setProperty("--fvy",v)};
 function ajusta(){try{
  fija(document.getElementById("fab"));fija(document.getElementById("fabb"));
  const m=document.getElementById("fabm");const vv=window.visualViewport;
  if(m){const v=Math.round(vv?vv.offsetTop:0)+"px";if(m.style.getPropertyValue("--fvy")!==v)m.style.setProperty("--fvy",v)}
 }catch(e){}}
 /* bucle por fotograma solo mientras hay movimiento (no gasta batería en reposo) */
 let hasta=0,corre=false;
 const bucle=()=>{ajusta();try{if(typeof window.nvAjusta=="function")window.nvAjusta()}catch(e){}
  if(performance.now()<hasta)requestAnimationFrame(bucle);else{corre=false;ajusta()}};
 const activa=ms=>{hasta=Math.max(hasta,performance.now()+(ms||600));if(!corre){corre=true;requestAnimationFrame(bucle)}};
 ["scroll","touchstart","touchmove","touchend","wheel"].forEach(ev=>addEventListener(ev,()=>activa(ev=="touchend"?1500:600),{passive:true,capture:true}));
 try{if(window.visualViewport){visualViewport.addEventListener("resize",()=>activa(800));visualViewport.addEventListener("scroll",()=>activa(800))}}catch(e){}
 addEventListener("focusout",()=>activa(1200),true);
 addEventListener("orientationchange",()=>activa(1200));
 document.addEventListener("visibilitychange",()=>{if(!document.hidden)activa(1200)});
 setInterval(ajusta,500);ajusta();
})();
