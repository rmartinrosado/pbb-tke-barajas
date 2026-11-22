/* v683: Seguimiento OT con el tema «consola técnica» y mejor organizado:
   cabecera centrada con contadores (total · abiertas · cerradas · espera), sección «FILTROS» (buscar y fecha · estado y posición)
   y una franja inferior «HERRAMIENTAS» con QR y Eliminar lista lado a lado y el aviso de llegada compacto. Mismas funciones. */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)",MO="var(--tkmo,ui-monospace,monospace)";
const st=document.createElement("style");st.textContent=`
#app .card.segpro>h3{text-align:center;justify-content:center;display:block!important;font:900 17px/1.2 ${MO}!important;letter-spacing:4px!important;text-transform:uppercase;margin:0 0 4px!important;
 background:linear-gradient(90deg,${OR},#ffb020 40%,${PU});-webkit-background-clip:text;background-clip:text;color:transparent!important}
#app .card.segpro>h3::before{display:none!important}
#app .segpro .spk{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin:8px 0 4px}
#app .segpro .spk>div{border-radius:12px;padding:7px 4px;text-align:center;background:color-mix(in srgb,var(--bg) 60%,var(--card));border:1px solid color-mix(in srgb,var(--tx) 12%,transparent)}
#app .segpro .spk b{display:block;font:900 22px/1 ${MO};letter-spacing:1px}
#app .segpro .spk small{display:block;margin-top:3px;font:700 9.5px/1 ${MO};letter-spacing:1px;color:var(--mu);text-transform:uppercase}
#app .segpro .spk .a b{color:${OR}}#app .segpro .spk .c b{color:#22c55e}#app .segpro .spk .e b{color:#e0a800}
#app .segpro .spsc{position:relative;height:2px;margin:6px 6px 4px;border-radius:2px;background:color-mix(in srgb,var(--tx) 10%,transparent);overflow:hidden}
#app .segpro .spsc::after{content:"";position:absolute;top:0;bottom:0;width:35%;left:-35%;background:linear-gradient(90deg,transparent,${OR},${PU},transparent);animation:spScan 2.6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes spScan{to{left:100%}}
#app .segpro .spt{display:flex;align-items:center;gap:9px;margin:12px 0 8px;font:800 11px/1 ${MO};letter-spacing:1.6px;color:var(--mu);text-transform:uppercase}
#app .segpro .spt::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,color-mix(in srgb,var(--tx) 18%,transparent),transparent)}
#app .segpro .spt i{font-style:normal;display:grid;place-items:center;width:20px;height:20px;border-radius:6px;color:#fff;font-size:11px;background:linear-gradient(135deg,${OR},${PU})}
#app .segpro .grid label{font:800 10.5px/1 ${MO}!important;letter-spacing:1.4px!important;text-transform:uppercase}
#app .segpro .sptools{display:grid;grid-template-columns:1fr 1fr;gap:8px}
#app .segpro .sptools>button{margin:0!important;min-height:48px;border-radius:12px!important;font-size:14px!important;display:flex;align-items:center;justify-content:center;gap:8px}
#app .segpro #pushb{margin-top:8px;padding:8px 10px;border-radius:12px;background:color-mix(in srgb,var(--bg) 60%,var(--card));border:1px dashed color-mix(in srgb,var(--tx) 18%,transparent);font-size:13px}
#app .segpro #pushb .tj{font-size:13px!important}
/* v695: «Herramientas» (QR, Eliminar lista, avisos de llegada) pasa al menú Gestión */
#app .segpro .spt.h,#app .segpro .sptools,#app .segpro #qrBtn,#app .segpro #otBorraL{display:none!important}
body.esadm #app .segpro #pushb{display:none!important}
@media (prefers-reduced-motion:reduce){#app .segpro .spsc::after{animation:none}}`;document.head.appendChild(st);
const n2=n=>String(n).padStart(2,"0");
function arma(){if(typeof view=="undefined"||view!="track")return;const c=document.querySelector("#app>.card");if(!c||!c.querySelector("#bq"))return;
 c.classList.add("segpro");try{document.body.classList.toggle("esadm",!!admin)}catch(e){}
 let L=[];try{L=inc||[]}catch(e){}
 const ab=L.filter(x=>x.estado=="abierta").length,ce=L.filter(x=>x.estado=="cerrada").length,es=L.filter(x=>x.espera||x.estado=="espera"||x.sincond).length;
 let k=c.querySelector(".spk");const h3=c.querySelector(":scope>h3");
 const html=`<div><b>${n2(L.length)}</b><small>Total</small></div><div class="a"><b>${n2(ab)}</b><small>Abiertas</small></div><div class="c"><b>${n2(ce)}</b><small>Cerradas</small></div><div class="e"><b>${n2(es)}</b><small>Espera</small></div>`;
 if(!k&&h3){k=document.createElement("div");k.className="spk";const sc=document.createElement("div");sc.className="spsc";h3.after(k,sc)}
 if(k&&k.innerHTML!==html)k.innerHTML=html;
 const bqw=c.querySelector(".bqw");if(bqw&&!c.querySelector(".spt.f")){const t=document.createElement("div");t.className="spt f";t.innerHTML="<i>⌕</i>Filtros";bqw.before(t)}
 const del=c.querySelector("#otBorraL"),qr=c.querySelector("#qrBtn"),pu=c.querySelector("#pushb");
 let w=c.querySelector(".sptools");
 if((del||qr)&&!w){const t=document.createElement("div");t.className="spt h";t.innerHTML="<i>⚙</i>Herramientas";
  w=document.createElement("div");w.className="sptools";(del||qr).before(t,w)}
 if(w){if(qr&&qr.parentNode!==w)w.prepend(qr);if(del&&del.parentNode!==w)w.append(del);if(pu&&w.nextElementSibling!==pu)w.after(pu)}}
const o=window.render;if(typeof o=="function")window.render=render=function(){const r=o.apply(this,arguments);try{arma()}catch(e){}return r};
let tm=0;const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);let en=0;new MutationObserver(()=>{if(en)return;en=1;try{arma()}catch(e){}en=0}).observe(a,{childList:true,subtree:true});arma()};ini();
})();
