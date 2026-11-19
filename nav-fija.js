/* v532: la barra desplegable de abajo (pestaña ☰ + tira de botones) queda SIEMPRE bloqueada abajo de la pantalla visible.
   En iPhone, al hacer scroll (rebote), al cerrar el teclado o al volver de otra app, la «pantalla de diseño» del navegador
   se descoloca respecto a la pantalla real y los elementos fijos se quedaban a media altura. Aquí se mide cada vez dónde
   está el borde inferior real (visualViewport) y se recoloca la barra, el fondo oscuro y la pestaña.
   Con el teclado abierto en una caja de texto, la barra se oculta para no tapar lo que se escribe. */
(function(){
 const st=document.createElement("style");st.textContent=`
html,body{overscroll-behavior-y:none}
#nav,#navtab{bottom:calc(24px + env(safe-area-inset-bottom,0px) + var(--nvdy,0px))!important}
#navbg{inset:auto!important;left:0!important;right:0!important;top:var(--nvt,0px)!important;height:var(--nvh,100%)!important}
html.nvkb #nav,html.nvkb #navtab,html.nvkb #navbg{visibility:hidden!important;pointer-events:none!important}`;
 document.head.appendChild(st);
 const R=document.documentElement;
 const pr=document.createElement("div");pr.id="nvProbe";pr.setAttribute("aria-hidden","true");
 pr.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:0;pointer-events:none;visibility:hidden";
 (document.body||R).appendChild(pr);
 const esTexto=el=>!!el&&(el.isContentEditable||/^(TEXTAREA|SELECT)$/.test(el.tagName)||(el.tagName=="INPUT"&&!/^(button|submit|checkbox|radio|range|file|color|reset|image)$/i.test(el.type||"")));
 let uDy=null,uT=null,uH=null,uK=null;
 function ajusta(){try{
  const vv=window.visualViewport;
  const H=pr.getBoundingClientRect().top||R.clientHeight||innerHeight;
  let t=0,h=H,dy=0;
  if(vv){t=Math.round(vv.offsetTop);h=Math.round(vv.height);dy=Math.round(H-(vv.offsetTop+vv.height))}
  const kb=!!vv&&esTexto(document.activeElement)&&(H-vv.height)>120;
  if(kb!==uK){R.classList.toggle("nvkb",kb);uK=kb}
  if(Math.abs(dy)<2)dy=0;
  if(dy!==uDy){R.style.setProperty("--nvdy",dy+"px");uDy=dy}
  if(t!==uT){R.style.setProperty("--nvt",t+"px");uT=t}
  if(h!==uH){R.style.setProperty("--nvh",h+"px");uH=h}
 }catch(e){}}
 let pend=false;const pide=()=>{if(pend)return;pend=true;requestAnimationFrame(()=>{pend=false;ajusta()})};
 try{if(window.visualViewport){visualViewport.addEventListener("resize",pide);visualViewport.addEventListener("scroll",pide)}}catch(e){}
 ["scroll","resize","orientationchange","pageshow","focusin","touchend"].forEach(ev=>addEventListener(ev,pide,{passive:true,capture:true}));
 addEventListener("focusout",()=>{pide();setTimeout(pide,120);setTimeout(pide,450)},true);
 document.addEventListener("visibilitychange",()=>{if(!document.hidden){pide();setTimeout(pide,300)}});
 window.nvAjusta=ajusta;/* v623: flot-fija.js la llama en cada fotograma mientras se desplaza */
 setInterval(ajusta,700);ajusta();
})();
