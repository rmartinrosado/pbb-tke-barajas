/* ===== v952: GIRAR EL MÓVIL sin descolocar la app (26/11/2026) =====
   Al pasar a horizontal y volver a vertical:
   · la cabecera quedaba medio escondida arriba (el iPhone deja la pantalla desplazada tras el giro) → se recoloca la vista y se
     vuelve a medir la altura de la cabecera (--hkh), de la que dependen el Panel fijo y las hojas;
   · los botones flotantes («+» y flecha atrás) se quedaban pegados a un lado → se recolocan en proporción al nuevo ancho y alto,
     dentro de la pantalla. ===== */
(function(){"use strict";
let W=innerWidth,H=innerHeight;const FL=["fab","fabb"];
const cab=()=>{const h=document.querySelector("header");if(h)document.documentElement.style.setProperty("--hkh",Math.round(h.getBoundingClientRect().height)+"px")};
const vista=()=>{try{const ae=document.activeElement;if(ae&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName))return; /* v961: con el teclado abierto no se recoloca la vista */
 const vv=window.visualViewport,h=document.querySelector("header");const r=h&&h.getBoundingClientRect();
 if((vv&&Math.abs(vv.offsetTop)>1)||(r&&r.top<-1&&getComputedStyle(h).position!="static")){window.scrollTo(0,window.scrollY);if(vv&&Math.abs(vv.offsetTop)>1)window.scrollTo(0,0)}}catch(_){}};
const flot=(w0,h0)=>{const w=innerWidth,h=innerHeight,S=58,MG=10;FL.forEach(id=>{const el=document.getElementById(id);if(!el)return;
 const x=parseFloat(el.style.left),y=parseFloat(el.style.top);if(!isFinite(x)||!isFinite(y))return;
 const nx=Math.max(MG,Math.min(w-S-MG,Math.round(x*w/w0))),ny=Math.max(MG+40,Math.min(h-S-MG-70,Math.round(y*h/h0)));el.style.left=nx+"px";el.style.top=ny+"px"})};
const gira=()=>{{const ae=document.activeElement;if(ae&&/^(INPUT|TEXTAREA)$/.test(ae.tagName)&&Math.abs(innerWidth-W)<60)return}const w0=W,h0=H;const w=innerWidth,h=innerHeight;if(Math.abs(w-w0)<60&&Math.abs(h-h0)<120)return;W=w;H=h;
 setTimeout(()=>{flot(w0,h0)},60);[120,400,900].forEach(t=>setTimeout(()=>{cab();vista();try{dispatchEvent(new Event("scroll"))}catch(_){}},t))};
/* v973: al volver a vertical el iPhone podía quedarse con zoom o desplazado a un lado (la PWA descentrada y la letra más grande):
   se fuerza a releer el viewport (escala 1) y se quita cualquier desplazamiento horizontal */
const recentra=()=>{try{const ae=document.activeElement;if(ae&&/^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName))return;
 if(Math.abs(innerWidth-(recentra.w||0))<60){recentra.w=innerWidth;return}recentra.w=innerWidth;const m=document.querySelector('meta[name="viewport"]');if(m){const c=m.content;m.content=c.replace(/initial-scale=[\d.]+/,"initial-scale=1.0001");setTimeout(()=>{m.content=c},60)}
 if(window.scrollX)window.scrollTo(0,window.scrollY);document.documentElement.scrollLeft=0;document.body.scrollLeft=0;
 document.querySelectorAll("#app,#scr,.wrap").forEach(e=>{if(e.scrollLeft)e.scrollLeft=0})}catch(_){}};
recentra.w=innerWidth;addEventListener("resize",()=>{gira();clearTimeout(recentra.t);recentra.t=setTimeout(recentra,350)});addEventListener("orientationchange",()=>setTimeout(recentra,450));addEventListener("orientationchange",()=>setTimeout(gira,250));
})();
