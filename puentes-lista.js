/* ===== v778: botón «Puentes» en la barra lateral (al lado de «Guía») =====
   Relación de las 133 entradas digitales de los dos PLC (armario E-A0…E-A10 y pupitre P-A3…P-A6, rev. J):
   ✂️ soltar hilo · 🔌 puente IN ↔ +24 V (módulo verde) · 🔌 puente IN ↔ UT (módulo amarillo) · nunca.
   Las marcadas «REVISAR EN CAMPO» salen de la regla del estado en reposo pero no tienen actuación validada.
   Cada fila se despliega con su croquis (soltar cable o puente). Más adelante: enlazarla con la guía de la OT y el SOS. ===== */
(function(){"use strict";
const E=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* [módulo, LED, borna IN, borna puente (o ""), señal, folio, estado: "pwa" | "rev"] */
const SOL=[
 ["P-A5","1.1","1.1","","Contacto avión derecho C-B51 (hilo 320)",85,"pwa"],
 ["P-A5","2.4","4.4","","Contacto avión izquierdo C-B52 (hilo 740)",85,"pwa"],
 ["P-A5","1.2","2.1","","Cable 400 Hz extendido (hilo 3383)",85,"pwa"],
 ["E-A2","2.4","4.4","","Bloqueo PBB máquina A/A",58,"pwa"],
 ["E-A2","3.1","5.1","","Bloqueo PBB carro A/A",59,"pwa"],
 ["E-A2","3.2","6.1","","Bloqueo PBB convertidor 400 Hz en servicio",59,"pwa"],
 ["E-A2","3.3","5.4","","Bloqueo PBB 90 % conector 400 Hz",59,"pwa"],
 ["E-A2","2.1","3.1","","Límite superior inclinación",58,"pwa"],
 ["P-A5","1.3","1.4","","Suelo sube derecha",85,"rev"],
 ["P-A5","1.4","2.4","","Suelo sube izquierda",85,"rev"],
 ["P-A5","2.1","3.1","","Sensores presencia de avión",85,"rev"],
 ["P-A5","3.1","5.1","","Brazo autonivelador contacto",86,"rev"]];
const V24=[
 ["E-A2","1.4","2.4","2.5","Límite inferior inclinación",58,"pwa"],
 ["E-A3","4.1","7.1","7.2","Límite giro traslación izquierda",61,"pwa"],
 ["E-A3","4.2","8.1","8.2","Límite giro traslación derecha",61,"pwa"],
 ["E-A3","3.2","6.1","6.2","Freno manual motor izquierdo T-S6",61,"pwa"],
 ["E-A3","3.4","6.4","6.5","Freno manual motor derecho T-S8",61,"pwa"],
 ["P-A6","1.1","1.1","1.2","Límite cabina izquierda",87,"pwa"],
 ["P-A6","1.2","2.1","2.2","Límite cabina derecha",87,"pwa"],
 ["P-A6","2.2","4.1","4.2","FC límite suelo derecha C-S1",87,"pwa"],
 ["P-A6","2.3","3.4","3.5","FC límite suelo izquierda C-S2",87,"pwa"],
 ["P-A5","3.2","6.1","6.2","Brazo autonivelador arriba 2",86,"rev"],
 ["P-A5","3.3","5.4","5.5","Brazo autonivelador arriba 1",86,"rev"]];
const UT=[
 ["E-A8","1.1","1.1","1.2","Sensor portón C-S9 (solo con el portón abajo y cerrado)",68,"pwa"],
 ["E-A8","1.2","2.1","2.2","Bandas carro ruedas T-B5 / T-B6",68,"pwa"],
 ["E-A8","3.1","5.1","5.2","FC traslación H-S1 (hilo 285)",68,"pwa"],
 ["E-A8","3.2","6.1","6.2","FC extensión ET-S1 (hilo 270)",68,"pwa"],
 ["E-A8","4.1","7.1","7.2","FC rotonda CO-S1 (hilo 225)",68,"pwa"],
 ["E-A8","4.2","8.1","8.2","FC inclinación IT-S2 / IT-S3 (hilo 267)",68,"pwa"],
 ["E-A9","3.1","5.1","5.2","Antiatrapamiento túnel interior izquierdo",69,"pwa"],
 ["E-A9","3.2","6.1","6.2","Antiatrapamiento túnel interior derecho",69,"pwa"],
 ["E-A9","1.2","2.1","2.2","Antiatrapamiento túnel medio izquierdo (PBB de 3 túneles)",69,"pwa"],
 ["E-A9","4.2","8.1","8.2","Antiatrapamiento túnel medio derecho (PBB de 3 túneles)",69,"pwa"],
 ["E-A10","1.1","1.1","1.2","Bumper brazo autonivelador C-B27 / C-B28 (hilo 669)",70,"pwa"],
 ["E-A10","1.2","2.1","2.2","Bumper lateral izquierdo cabina C-B29 / C-B30 (hilo 671)",70,"pwa"],
 ["E-A10","2.2","4.1","4.2","Inductivo puerta de servicio SS-B15 (puerta cerrada, nadie en la escalera)",70,"pwa"],
 ["E-A10","2.1","3.1","3.2","Barrera seguridad rotonda (solo con la zona comprobada despejada)",70,"rev"]];
const NUN=[
 ["Setas de emergencia",4,"E-A3 1.1 seta AO · E-A3 1.3 setas traslación · E-A8 2.2 setas H-S3 / H-S4 / CP-S5 · P-A3 1.1 seta pupitre","Es la parada de emergencia"],
 ["Bypass y selector",5,"E-A8 2.1 bypass CP-S33 · E-A10 3.1 / 3.2 / 4.1 selector CP-S16 · P-A6 2.4 bypass AKS","Son los propios mandos de maniobra"],
 ["Protecciones y potencia",20,"E-A0 1.1 bus · E-A0 3.1 a 4.2 (E-K0, E-Q1, E-Q3, E-Q4, E-Q8, sobretensiones) · E-A2 1.2 / 1.3 fallo variador · E-A2 4.2 y E-A3 1.4 freno perdido · E-A3 2.4 protecciones 24 V · P-A4 3.2 / 4.1 inversores cabina · P-A4 3.3 / 3.4 / 4.2 disyuntores P-Q5 / P-Q6 / P-Q7 · P-A4 4.3 P-Q30 · P-A6 1.4 / 2.1 freno cabina","Ocultaría un disparo o un freno abierto"],
 ["Seguridad sin anular",4,"E-A10 4.2 zapata (se usa el reset) · E-A9 2.2 sirena seguridad cabina · E-A9 1.1 «OK retirada PBB» · E-A9 2.1 autorización rotonda R-S2","Tienen su propio rearme o los da el operador"],
 ["Láser detector de ala",2,"P-A6 4.1 velocidad lenta · P-A6 4.2 paro","Riesgo de golpear el ala"],
 ["Mandos y pulsadores",31,"P-A3 1.2 a 4.4 · P-A4 1.2 a 3.1 y 4.4 · P-A6 3.1 a 3.4 · E-A2 4.3 / 4.4 · E-A3 1.2 desbloqueo AO","Si queda pegado, soltar su hilo para la orden pero no saca la PBB: se cambia el mando"],
 ["Estados e información",25,"E-A0 2.1 a 2.4 y 4.3 / 4.4 · E-A2 1.1, 2.2, 2.3, 3.4, 4.1 · E-A3 2.1 a 2.3, 3.1, 3.3, 4.3, 4.4 · P-A5 2.2, 2.3, 3.4, 4.1 a 4.3 · P-A6 1.3","No bloquean o tienen su actuación propia (reset del autonivelador)"],
 ["Reservas",5,"E-A9 4.1 · P-A4 1.1 · P-A5 4.4 · P-A6 4.3 / 4.4","Sin señal"]];
const SAL=[["E-A1","Salidas digitales armario",32,"54–57"],["E-A6","Salidas de seguridad (hacia E-K0)",8,"64–65"],["E-A7","Salidas de seguridad",8,"66–67"],["P-A1","Salidas digitales pupitre",16,"73–76"],["P-A2","Salidas digitales pupitre",16,"77–80"]];
const ICO=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v3a6 6 0 0 1-12 0V8zM12 17v5"/></svg>`;
let F="todas";
const croqO=(r,tipo)=>tipo=="sol"?{mod:r[0],b1:r[2],b2:r[2],k1:"IN "+r[2],k2:"",d:r[4],suelta:true}:{mod:r[0],b1:r[2],b2:r[3],k1:"IN "+r[2],k2:tipo=="ut"?"UT "+r[3]:"+24 V "+r[3],d:r[4]};
function filas(L,tipo){return L.filter(r=>F=="todas"||(F=="rev"?r[6]=="rev":r[6]=="pwa")).map((r,i)=>`<details class="pzr${r[6]=="rev"?" pzrev":""}" data-t="${tipo}" data-i="${L.indexOf(r)}"><summary>
 <span class="pzm">${E(r[0])}<small>LED ${E(r[1])}</small></span>
 <span class="pzb">${tipo=="sol"?"✂️ IN "+E(r[2]):"🔌 "+E(r[2])+" ↔ "+E(r[3])}</span>
 <span class="pzs">${E(r[4])}<small>folio ${r[5]}${r[6]=="rev"?' · <b class="pzrv">⚠️ REVISAR EN CAMPO</b>':" · en la PWA"}</small></span></summary><div class="pzc"></div></details>`).join("")||`<div class="mu" style="padding:8px">Nada con este filtro.</div>`}
function pagina(){const n=(L)=>L.filter(r=>r[6]=="rev").length,nr=n(SOL)+n(V24)+n(UT);
 return `<div class="card pzcard"><h3 style="margin:0 0 4px">Puentes y soltar cable · entradas del PLC</h3>
 <div class="pzlead">De las <b>133 entradas digitales</b> de los dos PLC, <b>37</b> admiten actuación provisional para sacar la PBB ya: <b>12 ✂️ soltar hilo</b>, <b>11 🔌 IN ↔ +24 V</b> y <b>14 🔌 IN ↔ UT</b>. <b>${37-nr}</b> ya están en la PWA y <b class="pzrv">${nr} hay que revisarlas en campo</b>. Toca una fila para ver su croquis.</div>
 <div class="pzreg"><div>⚪ Apagada en reposo, se enciende en falso → <b>✂️ soltar y aislar el hilo</b> (nunca a +24 V)</div><div>🟢 Encendida en reposo (módulo verde), se apaga → <b>🔌 IN ↔ +24 V</b></div><div>🟡 Seguridad (módulo amarillo), se abre → <b>🔌 IN ↔ UT</b> + bypass CP-S33 antes de LOCAL</div><div>Siempre: elemento comprobado, MANUAL, compañero vigilando, autorización del Responsable de Turno, hora en la OT y retirar al reparar.</div></div>
 <div class="pzf">${[["todas","Todas"],["pwa","En la PWA"],["rev","⚠️ Revisar en campo"]].map(([k,t])=>`<button type="button" class="${F==k?"on":""}" onclick="pzFiltro('${k}')">${t}</button>`).join("")}</div></div>
 <div class="card pzcard"><h3 class="pzh">✂️ Soltar hilo · 12</h3><div class="mu pzx">Entradas apagadas en reposo que se encienden en falso y bloquean: comprobar que el elemento está de verdad en reposo y soltar el hilo de la borna IN.</div>${filas(SOL,"sol")}</div>
 <div class="card pzcard"><h3 class="pzh">🔌 Puente IN ↔ +24 V · 11 <small>módulos verdes</small></h3><div class="mu pzx">Límites de trabajo y sensores de contacto cerrado: puente IN ↔ +24 V del canal y sacar la PBB en sentido contrario.</div>${filas(V24,"v24")}</div>
 <div class="card pzcard"><h3 class="pzh">🔌 Puente IN ↔ UT · 14 <small>módulos amarillos</small></h3><div class="mu pzx">Entradas de seguridad: puente IN ↔ UT, bypass CP-S33 antes de encender en LOCAL y mover en sentido contrario (procedimiento PBB 546).</div>${filas(UT,"ut")}</div>
 <details class="card pzcard pznun"><summary><h3 class="pzh" style="display:inline">⛔ Nunca se puentean ni se sueltan · 96 entradas</h3></summary>
  ${NUN.map(g=>`<div class="pzng"><b>${E(g[0])} · ${g[1]}</b><div>${E(g[2])}</div><small>${E(g[3])}</small></div>`).join("")}
  <div class="pzng"><b>Salidas · nunca</b><div>${SAL.map(s=>`${s[0]} ${E(s[1])} (${s[2]} canales, folios ${s[3]})`).join(" · ")}</div><small>Forzar una salida mueve un actuador sin el control del PLC</small></div></details>
 <div class="mu pzfu">Fuente: tablas PLC, PUENTE y CABLEADO de la PWA · ESQUEMA GENERAL rev. J, folios 52–88. No vale para la 507 ni para la 504 / 508 sin cotejar sus planos.</div>`}
window.pzFiltro=k=>{F=k;const a=document.getElementById("app");if(a&&view=="pte"){a.innerHTML=pagina()}};
document.addEventListener("toggle",e=>{const d=e.target;if(!d||!d.classList||!d.classList.contains("pzr")||!d.open)return;const c=d.querySelector(".pzc");if(!c||c.dataset.ok)return;
 const L={sol:SOL,v24:V24,ut:UT}[d.dataset.t],r=L&&L[+d.dataset.i];if(!r)return;let s="";try{if(typeof croquisPuente=="function")s=croquisPuente(croqO(r,d.dataset.t),5)}catch(x){}
 c.innerHTML=(r[6]=="rev"?`<div class="pzav">⚠️ Sin actuación validada: confirmar en campo que su fallo bloquea el movimiento y que esta actuación recupera la PBB antes de aplicarla.</div>`:"")+(s||`<div class="mu">Croquis no disponible para este módulo.</div>`);c.dataset.ok=1},true);
const st=document.createElement("style");st.textContent=`
.pzcard h3.pzh{margin:0 0 4px;font-size:17px}.pzcard h3 small{font-weight:600;opacity:.7;font-size:12px}
.pzlead{font-size:14px;line-height:1.4;margin:4px 0 10px}.pzrv{color:#f5a400}
.pzreg{font-size:12.5px;line-height:1.45;border:1px solid var(--bd,#ffffff22);border-radius:10px;padding:8px 10px;margin-bottom:10px}
.pzf{display:flex;gap:6px;flex-wrap:wrap}.pzf button{flex:1;min-height:40px;border-radius:10px;border:1px solid var(--bd,#ffffff33);background:transparent;color:inherit;font:inherit;font-size:13px;font-weight:700}
.pzf button.on{background:var(--ac,#ff7a1a);color:#000;border-color:transparent}
.pzx{font-size:12.5px;margin-bottom:6px}
.pzr{border:1px solid var(--bd,#ffffff22);border-radius:10px;margin:6px 0;overflow:hidden}
.pzr>summary{display:grid;grid-template-columns:62px 92px 1fr;gap:8px;align-items:center;padding:8px;cursor:pointer;list-style:none}
.pzr>summary::-webkit-details-marker{display:none}
.pzm{font-weight:800;font-family:var(--tkmo,ui-monospace,monospace);font-size:13px}.pzm small{display:block;font-weight:600;opacity:.7;font-size:11px}
.pzb{font-family:var(--tkmo,ui-monospace,monospace);font-weight:800;font-size:13px}
.pzs{font-size:13px;line-height:1.3}.pzs small{display:block;opacity:.75;font-size:11.5px;margin-top:2px}
.pzr.pzrev{border:2px solid #f5a400;background:#f5a4000f}
.pzc{padding:0 8px 8px}.pzc svg{width:100%;height:auto;display:block}
.pzav{font-size:12.5px;font-weight:700;color:#f5a400;margin:4px 0 8px}
.pznun>summary{cursor:pointer;list-style:none}.pznun>summary::-webkit-details-marker{display:none}
.pzng{border-top:1px solid var(--bd,#ffffff1a);padding:8px 0;font-size:13px;line-height:1.4}.pzng small{opacity:.75}
.pzfu{font-size:11.5px;margin:6px 4px 90px}`;
document.head.appendChild(st);
/* vista «pte»: el render original pinta como «dash» y luego se sustituye el contenido */
const oR=window.render;window.render=function(){if(typeof view=="undefined"||view!="pte")return oR.apply(this,arguments);
 view="dash";let r;try{r=oR.apply(this,arguments)}finally{view="pte"}
 const a=document.getElementById("app");if(a)a.innerHTML=pagina();try{boton()}catch(e){}return r};
function boton(){const n=document.getElementById("nav");if(!n)return;let ok=false;try{ok=!!(tecnico||admin)}catch(e){}
 let b=n.querySelector("#navpte");if(!ok){if(b)b.remove();return}
 const g=[...n.querySelectorAll("button")].find(x=>/go\('tec'\)/.test(x.getAttribute("onclick")||""));
 if(!b){n.insertAdjacentHTML("beforeend",`<button id="navpte" type="button" onclick="go('pte')"><span>${ICO}</span>Puentes</button>`);b=n.querySelector("#navpte")}
 if(g&&g.nextElementSibling!==b)g.after(b);
 const on=typeof view!="undefined"&&view=="pte";b.classList.toggle("on",on);if(on)n.querySelectorAll("button.on").forEach(x=>{if(x!==b)x.classList.remove("on")})}
setInterval(()=>{try{boton()}catch(e){}},1200);setTimeout(()=>{try{boton()}catch(e){}},300);
})();
