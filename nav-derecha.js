/* ===== v798: «ACTUALIZAR» cabe en su botón (letra algo más pequeña y sin espaciado).
   v797: botones más pequeños y con el tema de la barra izquierda (cuadrícula, números 01-0n, LED del modo activo).
   v796: la barra derecha salía aplastada (heredaba «bottom:0» de las reglas generales de <nav>): ahora es un bloque propio con su altura.
   v795: barra lateral DERECHA (23/11/2026) =====
   Los botones de la parte superior (Técnico · Operador · Admin · Gestión · Actualizar, o Turno) salen ahora de una pestaña
   fija en el borde derecho, abajo, igual que la barra de la izquierda pero en espejo. Hacen exactamente lo mismo que antes
   (son los mismos botones de la cabecera, copiados). En la cabecera se quedan el modo exterior (☀) y el apagado.
   Sin la fila de iconos, la cabecera es más baja y el Panel de control sube: más pantalla para las OT.
   Se abre con la pestaña o deslizando desde el borde derecho; se cierra al elegir, tocando fuera, deslizando a la derecha o con Esc.
   Además: deslizar desde el borde derecho ya no «avanza» el historial del navegador (salía la misma pantalla principal). ===== */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)";
const st=document.createElement("style");st.textContent=`
#hk .hk2{display:none!important}
#navd{position:fixed;right:0;left:auto;bottom:auto!important;height:auto!important;min-height:0;border-top:0;z-index:41;width:100px;box-sizing:border-box;max-height:calc(var(--nvb,100vh) - 150px);overflow-x:hidden;overflow-y:auto;
 top:calc(var(--nvb,100vh) - 24px - env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;align-items:stretch;
 padding:8px 32px 8px 6px;border:1.5px solid transparent;border-right:0;border-radius:18px 0 0 18px;
 background:linear-gradient(225deg,#12141bf2,#0b0c11f2) padding-box,linear-gradient(225deg,${OR},${PU} 55%,#1e88e5) border-box;
 -webkit-backdrop-filter:blur(14px) saturate(1.3);backdrop-filter:blur(14px) saturate(1.3);box-shadow:-6px 8px 30px -8px #000c,0 0 24px -10px ${PU};
 transform:translate(102%,-100%);transition:transform .25s ease;visibility:hidden;scrollbar-width:none;-webkit-overflow-scrolling:touch}
#navd::-webkit-scrollbar{display:none}
#navd.abre{transform:translate(0,-100%);visibility:visible}
#navd::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.07;
 background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:18px 18px}
#navd .hki{position:relative;flex:0 0 auto;width:100%;aspect-ratio:1/1;height:auto;margin:3px 0;padding:13px 2px 5px;border-radius:10px;
 border:1px solid #ffffff1f;background:linear-gradient(180deg,#2a2e3a,#1b1e27);color:#e9ecf1;display:flex;flex-direction:column;align-items:center;
 justify-content:center;gap:4px;font:700 8.5px/1.1 var(--tkmo,ui-monospace,monospace);letter-spacing:.4px;text-transform:uppercase;text-align:center;
 cursor:pointer;-webkit-tap-highlight-color:transparent;box-shadow:0 4px 12px -6px #000,0 1px 0 #ffffff12 inset;transition:transform .14s}
#navd .hki:active{transform:scale(.94)}
#navd .hki span{white-space:nowrap;overflow:visible;max-width:none;letter-spacing:-.3px;font-size:7.8px;color:#fff}
#navd .hki svg{width:28px;height:28px;stroke:${OR};stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round;flex:none}
#navd .hki i.tkn{position:absolute;top:3px;left:5px;font:600 8px var(--tkmo,ui-monospace,monospace);color:#8b93a7;font-style:normal;letter-spacing:0}
#navd .hki.on{border:1.5px solid transparent;background:linear-gradient(180deg,#2a1d12,#16131a) padding-box,linear-gradient(135deg,${OR},${PU}) border-box;
 box-shadow:0 8px 20px -8px ${OR},inset 0 0 18px -8px ${OR}}
#navd .hki.on span{color:${OR}}
#navd .hki.on svg{filter:drop-shadow(0 0 6px color-mix(in srgb,${OR} 70%,transparent))}
#navd .hki.on::after{content:"";position:absolute;left:-1px;top:25%;bottom:25%;width:3px;border-radius:3px;background:linear-gradient(180deg,${OR},${PU});box-shadow:0 0 8px ${OR}}
#navd .hki.ok svg{stroke:#2fd36b}#navd .hki.ok span{color:#2fd36b}
#navdtab{position:fixed;right:0;left:auto;z-index:42;width:30px;height:72px;padding:0;border:0;border-radius:16px 0 0 16px;
 top:calc(var(--nvb,100vh) - 72px - 24px - env(safe-area-inset-bottom,0px));
 background:linear-gradient(200deg,${OR},${PU});color:#fff;box-shadow:-4px 4px 18px -4px ${PU},0 0 0 1px #fff3 inset;
 display:none;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;overflow:hidden}
#navdtab.ver{display:flex}#navdtab.abierta{border-radius:0}
#navdtab .chev{transition:transform .25s ease}#navdtab.abierta .chev{transform:rotate(180deg)}
#navdtab::after{content:"";position:absolute;left:0;right:0;height:40%;top:-50%;background:linear-gradient(180deg,transparent,#fff5,transparent);animation:nvShine 3.4s ease-in-out infinite;pointer-events:none}
#navdbg{position:fixed;left:0;right:0;top:var(--nvt,0px);height:var(--nvh,100%);background:#00000026;z-index:40;opacity:0;pointer-events:none;transition:opacity .22s}
#navdbg.abre{opacity:1;pointer-events:auto}
html.nvkb #navd,html.nvkb #navdtab,html.nvkb #navdbg{visibility:hidden!important;pointer-events:none!important}
@media (prefers-reduced-motion:reduce){#navdtab::after{animation:none}}`;
document.head.appendChild(st);

const nav=document.createElement("div");nav.setAttribute("role","navigation");nav.id="navd";nav.setAttribute("aria-label","Modos y opciones");
const bg=document.createElement("div");bg.id="navdbg";
const tab=document.createElement("button");tab.type="button";tab.id="navdtab";tab.title="Modos";tab.setAttribute("aria-label","Abrir modos y opciones");tab.setAttribute("aria-expanded","false");
tab.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg><svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>';
document.body.append(bg,nav,tab);

const ab=()=>nav.classList.contains("abre");
function abre(){try{window.menuCierra&&menuCierra()}catch(e){}nav.classList.add("abre");bg.classList.add("abre");tab.classList.add("abierta");tab.setAttribute("aria-expanded","true")}
function cierra(){nav.classList.remove("abre");bg.classList.remove("abre");tab.classList.remove("abierta");tab.setAttribute("aria-expanded","false")}
window.modosAbre=abre;window.modosCierra=cierra;
tab.onclick=()=>ab()?cierra():abre();bg.onclick=cierra;
addEventListener("keydown",e=>{if(e.key=="Escape")cierra()});
/* al abrir la barra izquierda se cierra esta */
document.addEventListener("click",e=>{if(e.target.closest&&e.target.closest("#navtab"))cierra()},true);
nav.addEventListener("click",e=>{const b=e.target.closest("button");if(b)setTimeout(cierra,80)});

/* copia de los botones de la cabecera: mismos onclick, misma lógica */
let ult=null;
function copia(){try{
 const f=document.querySelector("#hk .hk2");const h=f?f.innerHTML:"";
 if(h!==ult){ult=h;nav.innerHTML=h;[...nav.querySelectorAll(".hki")].forEach((b,k)=>{const n=document.createElement("i");n.className="tkn";n.textContent=String(k+1).padStart(2,"0");b.prepend(n)})}
 tab.classList.toggle("ver",!!h);if(!h)cierra();
 const hd=document.querySelector("header");if(hd)document.documentElement.style.setProperty("--hkh",Math.round(hd.getBoundingClientRect().height)+"px");
}catch(e){}}
const hk=()=>document.getElementById("hk");
let ob=null;const vigila=()=>{const k=hk();if(k&&!ob){ob=new MutationObserver(copia);ob.observe(k,{childList:true,subtree:true,attributes:true,characterData:true})}copia()};
setInterval(vigila,1000);addEventListener("load",vigila);vigila();

/* deslizar desde el borde derecho abre; deslizar a la derecha con la barra abierta cierra */
let x0=null,y0=0,modo="";
const BORDE=22;
addEventListener("touchstart",e=>{const t=e.touches[0];if(!t)return;
 if(!ab()&&t.clientX>=innerWidth-BORDE&&tab.classList.contains("ver")){x0=t.clientX;y0=t.clientY;modo="abrir"}
 else if(ab()&&!nav.contains(e.target)){x0=t.clientX;y0=t.clientY;modo="cerrar"}else x0=null},{passive:true});
addEventListener("touchend",e=>{if(x0==null)return;const t=e.changedTouches[0];const dx=t.clientX-x0,dy=Math.abs(t.clientY-y0);
 if(dy<70){if(modo=="abrir"&&dx<-45)abre();else if(modo=="cerrar"&&dx>45)cierra()}x0=null},{passive:true});
/* en el borde derecho, el gesto del iPhone no debe «avanzar» la página (salvo si se toca un botón o un campo) */
addEventListener("touchstart",e=>{const t=e.touches[0];if(!t||t.clientX<innerWidth-16)return;
 if(e.target.closest&&e.target.closest("button,a,input,select,textarea,label,summary,[onclick],[contenteditable]"))return;
 try{e.preventDefault()}catch(x){}},{passive:false});

/* Avanzar en el historial (gesto desde el borde derecho) volvía a estados de ventanas ya cerradas
   (componentes, simulador…) y se veía «la misma pantalla». Cada estado lleva un número; si se avanza, se deshace. */
let n=0,cur=0;
try{const s0=history.state;if(!(s0&&typeof s0.__i=="number"))history.replaceState(Object.assign({},s0||{},{__i:0}),"")}catch(e){}
const oPush=history.pushState.bind(history);
history.pushState=function(s,t,u){n=Math.max(n,cur)+1;cur=n;let s2=s;try{s2=(s&&typeof s=="object")?Object.assign({},s,{__i:cur}):{__v:s,__i:cur}}catch(e){}return oPush(s2,t,u)};
addEventListener("popstate",()=>{let i=0;try{const s=history.state;i=s&&typeof s.__i=="number"?s.__i:0}catch(e){}
 if(i>cur){try{history.back()}catch(e){}return}cur=i},true);
})();

/* ===== v801: cierre en CASCADA también en la barra derecha (espejo de la izquierda, 20 ms entre botones) ===== */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
html body #navd#navd{transition:transform .34s cubic-bezier(.55,0,.75,.2) .30s,visibility 0s linear .66s!important}
html body #navd#navd.abre{transition:transform .32s cubic-bezier(.16,1,.3,1),visibility 0s!important}
html body #navd#navd>.hki{will-change:transform,opacity;
 transition:opacity .26s ease calc(var(--nvi,0)*20ms),transform .34s cubic-bezier(.55,0,.75,.2) calc(var(--nvi,0)*20ms),filter .26s ease calc(var(--nvi,0)*20ms)!important}
html body #navd#navd:not(.abre)>.hki{opacity:0!important;transform:translate(26px,22px) scale(.86) rotate(3deg)!important;filter:blur(2px)}
html body #navd#navd.abre>.hki{opacity:1;transform:none;filter:none;
 transition:opacity .3s ease calc(var(--nvi,0)*20ms + 90ms),transform .42s cubic-bezier(.16,1,.3,1) calc(var(--nvi,0)*20ms + 90ms),filter .3s ease calc(var(--nvi,0)*20ms + 90ms)!important}
html body #navd#navd.abre>.hki:active{transform:scale(.94)!important;transition-delay:0s!important}
html body #navd#navd::after{content:"";position:absolute;left:0;right:0;top:0;height:0;pointer-events:none;border-radius:inherit;
 background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--tkor,#ff7a1a) 22%,transparent) 70%,transparent);opacity:0}
html body #navd#navd:not(.abre)::after{animation:nvdCasc .42s ease-in forwards}
@keyframes nvdCasc{0%{top:0;height:30%;opacity:.9}100%{top:100%;height:30%;opacity:0}}
@media (prefers-reduced-motion:reduce){html body #navd#navd,html body #navd#navd>.hki{transition-duration:.01s!important;transition-delay:0s!important}
 html body #navd#navd:not(.abre)::after{animation:none}}`;
document.head.appendChild(st);
const num=()=>{const n=document.getElementById("navd");if(!n)return;[...n.children].forEach((b,k)=>{if(b.style.getPropertyValue("--nvi")!==String(k))b.style.setProperty("--nvi",k)})};
num();setInterval(num,500);
})();
