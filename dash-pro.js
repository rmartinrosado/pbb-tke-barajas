/* v679: PANEL DE CONTROL con el mismo diseño de consola técnica que «Registrar OT»: marco degradado naranja · morado · azul,
   cuadrícula de plano, cabecera centrada con estado en vivo y franja de escaneo, mosaicos con borde luminoso y números de panel.
   Solo aspecto: no se cambian posiciones, alineaciones ni textos de los botones. */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)",MO="var(--tkmo,ui-monospace,monospace)";
const st=document.createElement("style");st.textContent=`
#pfix.dpro{border-radius:18px;padding:12px 5px 6px!important;
 background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box;border:1.5px solid transparent;
 box-shadow:0 10px 40px -14px color-mix(in srgb,${PU} 45%,transparent)}
#pfix.dpro::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.06;
 background-image:linear-gradient(var(--tx) 1px,transparent 1px),linear-gradient(90deg,var(--tx) 1px,transparent 1px);background-size:22px 22px;
 -webkit-mask-image:linear-gradient(180deg,#000,transparent 70%);mask-image:linear-gradient(180deg,#000,transparent 70%)}
#pfix.dpro>#pctl{position:relative;margin:2px 0 4px!important;text-align:center!important;font:900 17px/1.2 ${MO}!important;letter-spacing:4px!important;
 background:linear-gradient(90deg,${OR},#ffb020 40%,${PU});-webkit-background-clip:text;background-clip:text;color:transparent!important}
#pfix.dpro .dpsub{position:relative;display:flex;justify-content:center;align-items:center;gap:7px;flex-wrap:wrap;margin:6px 0 6px;font:600 11.5px/1.2 ${MO};color:var(--mu);-webkit-text-fill-color:var(--mu);letter-spacing:.6px;text-align:center}
#pfix.dpro .dpsub b{color:var(--tx);-webkit-text-fill-color:var(--tx)}#pfix.dpro .dpdot{width:8px;height:8px;border-radius:50%;background:#22c55e;animation:dpPul 1.8s infinite}
#pfix.dpro .dpscan{position:relative;height:2px;margin:0 10px 4px;border-radius:2px;background:color-mix(in srgb,var(--tx) 10%,transparent);overflow:hidden}
#pfix.dpro .dpscan::after{content:"";position:absolute;top:0;bottom:0;width:35%;left:-35%;background:linear-gradient(90deg,transparent,${OR},${PU},transparent);animation:dpScan 2.6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes dpScan{to{left:100%}}@keyframes dpPul{0%{box-shadow:0 0 0 0 #22c55e88}70%{box-shadow:0 0 0 7px #22c55e00}100%{box-shadow:0 0 0 0 #22c55e00}}
/* mosaicos */
#pfix.dpro .p230i{position:relative;border-radius:14px!important;transition:transform .14s,box-shadow .25s,border-color .25s;
 box-shadow:0 6px 18px -10px #000a,0 1px 0 0 #fff1 inset!important}
#pfix.dpro .p230i:not(.sosk){background:linear-gradient(180deg,color-mix(in srgb,var(--card) 92%,#fff),var(--card))!important}
#pfix.dpro .p230i:active{transform:scale(.97)}
#pfix.dpro .p230i::after{content:"";position:absolute;left:12%;right:12%;top:0;height:1.5px;border-radius:2px;opacity:.75;pointer-events:none;
 background:linear-gradient(90deg,transparent,${OR},${PU},transparent)}
#pfix.dpro .sosk::after{display:none}
/* números de panel */
#pfix.dpro .kpi>b{font-family:${MO}!important;font-weight:900!important;letter-spacing:1px;
 background:linear-gradient(180deg,var(--tx),color-mix(in srgb,var(--tx) 55%,${OR}));-webkit-background-clip:text;background-clip:text;color:transparent!important}
/* botones de administración (Avisos sin reconocer · Tiempos por avería) */
#pfix.dpro .adtools>button{border-radius:14px!important;border:1.5px solid color-mix(in srgb,var(--tx) 14%,transparent)!important;
 background:linear-gradient(180deg,color-mix(in srgb,var(--card) 92%,#fff),var(--card))!important;box-shadow:0 6px 18px -10px #000a;transition:transform .14s,border-color .25s}
#pfix.dpro .adtools>button:active{transform:scale(.97);border-color:${OR}!important}
/* título de la lista de OT */
#pfix.dpro>h3.p230t{display:flex;align-items:center;gap:10px;font-family:${MO}!important;letter-spacing:2.5px!important}
#pfix.dpro>h3.p230t::before,#pfix.dpro>h3.p230t::after{content:"";flex:1;height:1.5px;border-radius:2px;background:linear-gradient(90deg,transparent,color-mix(in srgb,${OR} 70%,transparent))}
#pfix.dpro>h3.p230t::after{background:linear-gradient(90deg,color-mix(in srgb,${PU} 70%,transparent),transparent)}
/* entrada escalonada */
#pfix.dpro.dpin .p230i,#pfix.dpro.dpin .adtools>button{animation:dpIn .45s cubic-bezier(.2,.8,.2,1) both}
${Array.from({length:12},(_,k)=>`#pfix.dpro.dpin .p230-${k}{animation-delay:${k*40}ms}`).join("")}
@keyframes dpIn{from{opacity:0;transform:translateY(8px) scale(.98)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){#pfix.dpro *,#pfix.dpro::after{animation:none!important}}`;document.head.appendChild(st);
const DIAS=["dom","lun","mar","mié","jue","vie","sáb"];
const z=n=>String(n).padStart(2,"0");
let reloj=0;
function mira(){const p=document.getElementById("pfix"),c=document.getElementById("pctl");
 if(!p||!c){clearInterval(reloj);reloj=0;return}
 if(!p.classList.contains("dpro"))p.classList.add("dpro");/* v688: sin animación de entrada (se repetía en cada repintado → parpadeo) */
 if(!p.querySelector(".dpsub")){const s=document.createElement("div");s.className="dpsub";s.innerHTML=`<span class="dpdot"></span><span>EN LÍNEA</span><span>·</span><b class="dpf"></b><b class="dph"></b>`;
  const sc=document.createElement("div");sc.className="dpscan";c.append(s,sc)}
 const pinta=()=>{const s=document.querySelector("#pfix .dpsub");if(!s){clearInterval(reloj);reloj=0;return}const d=new Date();
  s.querySelector(".dpf").textContent=`${DIAS[d.getDay()]} ${z(d.getDate())}/${z(d.getMonth()+1)}`;s.querySelector(".dph").textContent=`${z(d.getHours())}:${z(d.getMinutes())}:${z(d.getSeconds())}`};
 pinta();if(!reloj)reloj=setInterval(pinta,1000)}
const ini=()=>{const a=document.getElementById("app");if(!a)return setTimeout(ini,300);new MutationObserver(()=>mira()).observe(a,{childList:true,subtree:false});mira()};ini();
})();
/* ===== v942: PANEL DE CONTROL con el tema de la BARRA DERECHA (26/11/2026): fondo de consola oscuro con cuadrícula blanca,
   marco degradado naranja · morado · azul, mosaicos grafito con borde fino, iconos naranja y texto claro. Igual en modo claro y oscuro.
   Solo aspecto: se redefinen los colores (variables) dentro del panel; no cambian posiciones ni textos. ===== */
(function(){const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)";const st=document.createElement("style");st.textContent=`
html #pfix.dpro{--tx:#e9ecf1;--mu:#8b93a7;--card:#1b1e27;--bd:#ffffff1f;color:#e9ecf1;
 background:linear-gradient(225deg,#12141b,#0b0c11) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box!important;
 box-shadow:0 10px 34px -12px #000c,0 0 24px -10px ${PU}!important}
html #pfix.dpro::before{opacity:.07!important;background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)!important;background-size:18px 18px!important;-webkit-mask-image:none!important;mask-image:none!important}
html #pfix.dpro .p230i:not(.sosk){background:linear-gradient(180deg,#2a2e3a,#1b1e27)!important;border:1px solid #ffffff1f!important;color:#e9ecf1!important;
 box-shadow:0 4px 12px -6px #000,0 1px 0 #ffffff12 inset!important}
html #pfix.dpro .p230i:not(.sosk) svg:not(.gmS){stroke:${OR}}
html #pfix.dpro .p230i:not(.sosk):active{background:linear-gradient(180deg,#2a1d12,#16131a)!important;box-shadow:0 8px 20px -8px ${OR},inset 0 0 18px -8px ${OR}!important}
html #pfix.dpro .dpsub,html #pfix.dpro .dpsub *{-webkit-text-fill-color:currentColor}html #pfix.dpro .dpsub{color:#8b93a7!important}html #pfix.dpro .dpsub b{color:#fff!important}
html #pfix.dpro .dpscan{background:#ffffff1a!important}
html.lt #pfix.dpro img[src*="claude-logo"]{filter:none!important}
html #pfix.dpro .cl232 .cl232t{color:#fff!important}
/* v944: subtítulos de los botones en blanco */
html #pfix.dpro .p230i small,html #pfix.dpro .p230i .s286,html #pfix.dpro .p230i .tbt small{color:#fff!important;-webkit-text-fill-color:#fff!important;opacity:1!important}`;document.head.appendChild(st)})();
