/* v682: reorganización
   · Barra lateral: fuera «Nueva» (ya está en «Registrar OT» y en el «+» flotante); entra «Seguimiento» justo tras «Inicio».
   · Cabecera (Admin): «Gestión» agrupa ＋ Posición PBB, Técnicos, Exportar, Avisos sin reconocer y Tiempos por avería.
   · Con la barra abierta, los botones flotantes se apartan para no tapar la última opción. */
(function(){"use strict";
const st=document.createElement("style");st.textContent=`
.hki .hkbd{position:absolute;top:4px;right:6px;min-width:17px;height:17px;padding:0 4px;border-radius:9px;background:#e53935;color:#fff;font:800 10.5px/17px system-ui,sans-serif;font-style:normal;text-align:center;box-shadow:0 0 0 2px #0b0c11}
.hki{position:relative}
#gesm{display:grid;gap:10px;margin-top:12px}
#gesm button{display:flex;align-items:center;gap:12px;width:100%;margin:0!important;padding:14px 14px!important;border-radius:14px!important;text-align:left;font-weight:800;font-size:15px;
 border:1.5px solid transparent!important;background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,var(--tkor,#ff7a1a),var(--tkpu,#9b3dff) 60%,#1e88e5) border-box!important;color:var(--tx)!important}
#gesm button i{font-style:normal;font-size:22px;width:30px;text-align:center}#gesm button small{display:block;font-weight:500;font-size:12px;color:var(--mu);margin-top:2px}
#gesm button b.n{margin-left:auto;min-width:24px;padding:2px 7px;border-radius:12px;background:#e53935;color:#fff;font-size:13px;text-align:center}
#gesm h4{margin:8px 0 0;font:800 11px/1 var(--tkmo,ui-monospace,monospace);letter-spacing:1.6px;color:var(--mu);text-transform:uppercase}
body.navab #fabb,body.navab #fabp,body.navab .fabp,body.navab #fab{transform:translateX(130%)!important;opacity:0!important;pointer-events:none!important}
#fabb,#fabp,.fabp,#fab{transition:transform .25s ease,opacity .2s}`;document.head.appendChild(st);
const mad=i=>{const e=document.querySelectorAll("#mbar .madm button")[i];if(e)e.click()};
window.gestionMenu=function(){const n=+(window.avPendientes?window.avPendientes():window.__avN||0);
 const it=(ic,t,sub,fn,extra)=>`<button type="button" onclick="closeSheet();setTimeout(()=>{${fn}},60)"><i>${ic}</i><span>${t}<small>${sub}</small></span>${extra||""}</button>`;
 document.getElementById("sheetc").innerHTML=`<div class="row" style="flex-wrap:nowrap;align-items:center"><h3 style="margin:0">⚙️ Gestión</h3><button class="sec" onclick="closeSheet()" style="width:auto;padding:4px 12px;margin:0 0 0 auto">✕</button></div>
 <div id="gesm"><h4>Instalación y equipo</h4>${it("➕","Añadir posición PBB","Dar de alta una pasarela","gesMad(0)")}${it("👥","Técnicos","Altas, bajas y turnos","gesMad(1)")}${it("⬇️","Exportar","Descargar las OT (CSV)","gesMad(2)")}
 <h4>Seguimiento OT</h4>${it("🔳","Imprimir QR de las PBB","Etiquetas QR de cada pasarela","typeof qrPBB=='function'&&qrPBB()")}${it("🗑️","Eliminar lista","Borra las OT que muestra Seguimiento con sus filtros","gesBorraL()")}
 ${(()=>{let e="";try{e=pushEst}catch(x){}return e=="ok"?it("🔔","Avisos de llegada activos","Toca para enviar un aviso de prueba","typeof pushPrueba=='function'&&pushPrueba()"):e=="nosoporta"?"":it("🔕","Activar avisos de llegada",e=="denegado"?"Bloqueados: actívalos en Ajustes → Notificaciones → PBB TKE":e=="instalar"?"Añade la app a la pantalla de inicio y ábrela desde el icono":"Recibir aviso cuando llega una OT","typeof pushAlta=='function'&&pushAlta(true)")})()}
 <h4>Análisis</h4>${it("🧠","Avisos sin reconocer","Avisos del RCS sin alarma conocida","avPanel()",n?`<b class="n">${n}</b>`:"")}${it("⏱","Tiempos por avería","Duración media por tipo de avería","tmPanel()")}</div>`;
 document.getElementById("sheet").style.display="flex"};
window.gesMad=mad;
window.gesBorraL=function(){const f=()=>typeof otBorraLista=="function"&&otBorraLista();if(typeof view!="undefined"&&view!="track"){go("track");setTimeout(f,400)}else f()};
const STAR=`<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M9.5 3l1.9 5.4L17 10.3l-5.6 1.9L9.5 17.6l-1.9-5.4L2 10.3l5.6-1.9z"/><path d="M18 13.5l1.1 3 3 1.1-3 1.1-1.1 3-1.1-3-3-1.1 3-1.1z"/></svg>`;
function barra(){const nav=document.getElementById("nav");if(!nav)return;
 [...nav.querySelectorAll(":scope>button")].forEach(b=>{if(/go\('new'\)/.test(b.getAttribute("onclick")||""))b.remove()});
 let sg=[...nav.querySelectorAll(":scope>button")].find(b=>/go\('track'\)/.test(b.getAttribute("onclick")||""));
 if(!sg){sg=document.createElement("button");sg.setAttribute("onclick","go('track')");sg.innerHTML=`<span>${STAR}</span>Seg. OT`;}
 {const sp=sg.lastChild;if(sp&&sp.nodeType==3&&sp.nodeValue.trim()!=="Seg. OT")sp.nodeValue="Seg. OT"}
 sg.classList.toggle("on",typeof view!="undefined"&&view=="track");
 const ini=[...nav.querySelectorAll(":scope>button")].find(b=>/go\('dash'\)/.test(b.getAttribute("onclick")||""));
 if(ini){if(ini.nextElementSibling!==sg)ini.after(sg)}else if(sg.parentNode!==nav)nav.prepend(sg)}
const o=window.render;if(typeof o=="function"){window.render=render=function(){const r=o.apply(this,arguments);try{barra()}catch(e){}return r}}
const ini=()=>{const nav=document.getElementById("nav");if(!nav)return setTimeout(ini,300);
 new MutationObserver(()=>{try{barra()}catch(e){}}).observe(nav,{childList:true});
 new MutationObserver(()=>document.body.classList.toggle("navab",nav.classList.contains("abre"))).observe(nav,{attributes:true,attributeFilter:["class"]});barra()};ini();
})();
