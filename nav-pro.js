/* v681: barra de navegación lateral con el tema «consola técnica»: cristal oscuro con marco degradado naranja · morado · azul,
   botones con relieve, icono con degradado y LED inferior en la pantalla activa, pestaña con degradado y brillo.
   Mismas opciones, mismo orden y mismos textos. */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)",MO="var(--tkmo,ui-monospace,monospace)";
const st=document.createElement("style");st.textContent=`
#nav.tkb{border:1.5px solid transparent!important;border-left:0!important;border-radius:0 18px 18px 0!important;
 background:linear-gradient(135deg,#12141bf2,#0b0c11f2) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box!important;
 -webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);
 box-shadow:6px 8px 30px -8px #000c,0 0 24px -10px ${PU}!important}
#nav.tkb::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.07;
 background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:18px 18px}
#nav.tkb button{border-radius:12px!important;margin:6px 2px!important;border:1px solid #ffffff14!important;
 background:linear-gradient(180deg,#1d2029,#14161d)!important;box-shadow:0 4px 12px -6px #000,0 1px 0 #ffffff12 inset!important;
 transition:transform .14s,border-color .25s,box-shadow .25s}
#nav.tkb button:active{transform:scale(.94)}
#nav.tkb button i.tkn{font-family:${MO}!important;color:#8b93a7!important}
#nav.tkb button span svg{transition:filter .25s}
#nav.tkb button.on{border-color:transparent!important;
 background:linear-gradient(180deg,#2a1d12,#16131a) padding-box,linear-gradient(135deg,${OR},${PU}) border-box!important;border:1.5px solid transparent!important;
 box-shadow:0 8px 20px -8px ${OR},inset 0 0 18px -8px ${OR}!important}
#nav.tkb button.on::after{content:"";position:absolute;left:30%;right:30%;top:-1px;height:3px;border-radius:3px;background:linear-gradient(90deg,${OR},${PU});box-shadow:0 0 8px ${OR}}
#nav.tkb button.on span svg{filter:drop-shadow(0 0 6px color-mix(in srgb,${OR} 70%,transparent))}
#navtab{border-radius:0 16px 16px 0!important;background:linear-gradient(160deg,${OR},${PU})!important;
 box-shadow:4px 4px 18px -4px ${PU},0 0 0 1px #fff3 inset!important;overflow:hidden}
#navtab::after{content:"";position:absolute;left:0;right:0;height:40%;top:-50%;background:linear-gradient(180deg,transparent,#fff5,transparent);animation:nvShine 3.4s ease-in-out infinite;pointer-events:none}
@keyframes nvShine{60%,100%{top:120%}}
#navbg.abre{background:#0006!important}
@media (prefers-reduced-motion:reduce){#navtab::after{animation:none}}`;document.head.appendChild(st);
})();
