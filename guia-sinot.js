/* ===== v486: Guía de campo · al entrar desde el menú (pestaña «Guía») no se despliega nada hasta elegir la OT.
   Antes se cogía sola la primera OT abierta y salía toda la guía. Ahora el desplegable «OT asociada» sale con
   «— Selecciona la OT —» y debajo no hay nada (ni tipo, ni plano, ni cajas). Al elegir la OT se pinta la guía entera.
   Las entradas directas (SOS, varita, primera actuación, puente, lupa…) siguen abriendo la guía de su OT como antes. ===== */
(function(){
"use strict";
let sinOT=false;
/* toque en un botón de navegación que lleva a la guía (barra inferior, menú lateral…) */
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("[onclick]");if(!b)return;
 if(/^\s*go\(\s*['"]tec['"]\s*\)\s*;?\s*$/.test(b.getAttribute("onclick")||"")&&typeof view!="undefined"&&view!="tec"){sinOT=true;try{gOT="";gSyncOT=""}catch(x){}}},true);
const st=document.createElement("style");st.textContent=`#app.gsinot>*:not(.gkeep){display:none!important}
#app.gsinot .gkeep.gcab>*{display:none!important}#app.gsinot .gkeep.gcab>:is(h3,.gsel){display:block!important}#app.gsinot .gkeep.gcab>select.gsel{display:block!important;width:100%}
.gotdesc{margin-top:6px;padding:8px 10px;border-radius:8px;border-left:4px solid #ef6c00;background:color-mix(in srgb,#ef6c00 10%,transparent);font-size:14px;line-height:1.35}.gotdesc b{color:#ef6c00}
#app.gsinot .gaviso{margin-top:10px;font-size:13px;color:var(--mu);text-align:center}`;document.head.appendChild(st);
const o=vTec;vTec=function(){
 let vacio=false;try{if(sinOT&&!gOT&&gOTs().length)vacio=true;else sinOT=false}catch(e){}
 const r=o.apply(this,arguments);const app=document.getElementById("app");if(!app)return r;
 /* v488: la descripción de la avería en el desplegable «OT asociada» y debajo de él */
 try{const sl=[...app.querySelectorAll("select")].find(s=>/^\s*gOT\s*=/.test(s.getAttribute("onchange")||""));
  if(sl){[...sl.options].forEach(op=>{const i=op.value&&inc.find(x=>x.id==op.value);if(i&&i.desc&&!op.dataset.d){op.dataset.d=1;op.textContent+=" · "+i.desc}});
   const i=!vacio&&gOT&&inc.find(x=>x.id==gOT);let d=sl.nextElementSibling;if(!(d&&d.classList.contains("gotdesc"))){d=document.createElement("div");d.className="gotdesc";sl.after(d)}
   d.innerHTML=i&&i.desc?`<b>AVERÍA:</b> ${esc(i.desc)}${i.def&&i.def!=i.desc?`<br><span class="mu">${esc(i.def)}</span>`:""}`:"";d.style.display=i&&i.desc?"":"none"}}catch(e){}
 if(!vacio){app.classList.remove("gsinot");return r}
 try{gOT="";gSyncOT=""}catch(e){}
 const sel=[...app.querySelectorAll("select")].find(s=>/^\s*gOT\s*=/.test(s.getAttribute("onchange")||""));
 if(!sel){app.classList.remove("gsinot");return r}
 const card=sel.closest(".card");
 if(!sel.querySelector('option[value=""]'))sel.insertAdjacentHTML("afterbegin",`<option value="">— Selecciona la OT —</option>`);
 sel.value="";sel.classList.add("gsel");
 const lb=sel.previousElementSibling;if(lb&&lb.tagName=="LABEL")lb.classList.add("gsel");
 if(card){card.classList.add("gkeep","gcab");const fu=card.querySelector(":scope>h3+.mu");if(fu)fu.classList.add("gsel");if(!card.querySelector(".gaviso"))sel.insertAdjacentHTML("afterend",`<div class="gaviso gsel">Elige la OT para ver la guía de campo.</div>`);
  let p=card.previousElementSibling;while(p){p.classList.add("gkeep");p=p.previousElementSibling}}
 app.classList.add("gsinot");return r};
/* al salir de la guía, se quita el modo vacío */
const og=go;go=function(v){if(v!="tec"){const a=document.getElementById("app");if(a)a.classList.remove("gsinot")}return og.apply(this,arguments)};
})();
