/* ===== v794: desde el menú lateral entra en «Guía completa» con todo plegado.
   v793: Guía de campo · opción «📖 Guía completa · todas las cajas» en el desplegable «OT asociada» =====
   Sirve para consultar la guía sin OT (p. ej. «Suelo basculante · PENDIENTE», «Atraque incorrecto»…).
   Mientras está elegida, la guía se pinta como si no hubiera OT abiertas: todas las cajas, sin filtro de OT ni de IA.
   Al elegir una OT, o al entrar en la guía desde una OT (SOS, llave, lupa…), vuelve a la guía de esa OT. ===== */
(function(){"use strict";
if(typeof vTec!="function")return;
let todas=false;const V="__todas";
window.guiaCompleta=on=>{todas=!!on;try{if(todas){gOT="";gSyncOT=""}}catch(e){}try{vTec();scrollTo(0,0)}catch(e){}};
/* v794: al entrar en la guía desde el menú lateral sale la «Guía completa» con TODOS los apartados plegados,
   para abrir el que se quiera (antes: «Selecciona la OT» y la pantalla vacía). */
let plegar=0;
const plegaTodo=()=>{const app=document.getElementById("app");if(!app)return;
 const ds=[...app.querySelectorAll("details")].reverse(); /* de dentro afuera: primero cajas, luego grupos */
 ds.forEach(d=>{if(d.open)d.open=false});try{gAbierto.clear()}catch(e){}};
document.addEventListener("click",e=>{const b=e.target.closest&&e.target.closest("#nav [onclick]");if(!b)return;
 if(/^\s*go\(\s*['"]tec['"]\s*\)\s*;?\s*$/.test(b.getAttribute("onclick")||"")){
  todas=true;plegar=Date.now();try{gOT="";gSyncOT="";gAbierto.clear()}catch(x){}}},true);
const oV=vTec;vTec=function(){
 try{if(todas&&gOT)todas=false}catch(e){} /* otra parte de la app ha elegido una OT */
 let r;
 if(todas){const oG=window.gOTs;window.gOTs=()=>[];try{r=oV.apply(this,arguments)}finally{window.gOTs=oG}}
 else r=oV.apply(this,arguments);
 try{const app=document.getElementById("app");const sl=app&&[...app.querySelectorAll("select")].find(s=>/^\s*gOT\s*=/.test(s.getAttribute("onchange")||""));
  if(sl){
   if(todas){/* el desplegable sale como «Sin OT abiertas»: se rehace con las OT y la opción marcada */
    const ab=(typeof gOTs=="function"?gOTs():[]);sl.innerHTML=ab.map(x=>`<option value="${x.id}">PBB ${x.pos} · ${x.tipo} · ${esc(x.orden)}${x.desc?" · "+esc(x.desc):""}</option>`).join("")}
   if(!sl.querySelector(`option[value="${V}"]`)){const op=document.createElement("option");op.value=V;op.textContent="📖 Guía completa · todas las cajas";
    const f=sl.querySelector('option[value=""]');f&&f.textContent.includes("Selecciona")?f.after(op):sl.prepend(op)}
   if(todas)sl.value=V;
   sl.setAttribute("onchange","if(this.value=='"+V+"'){guiaCompleta(1)}else{guiaCompleta(0);gOT=this.value;vTec()}");
   const d=sl.nextElementSibling&&sl.nextElementSibling.classList.contains("gotdesc")?sl.nextElementSibling:null;
   if(todas){if(d)d.style.display="none";
    if(!app.querySelector(".gcomp1")){sl.insertAdjacentHTML("afterend",`<div class="gcomp1">📖 Guía completa: todas las cajas, sin filtro de OT. Para la guía de una avería, elige su OT.</div>`)}}
  }}catch(e){console.warn("guia-completa",e)}
 /* v794: recién entrado desde el menú, todo plegado (también lo que otras partes abren justo después de pintar) */
 if(plegar&&Date.now()-plegar<1500){plegaTodo();setTimeout(plegaTodo,0);setTimeout(()=>{plegaTodo();plegar=0;scrollTo(0,0)},250)}
 return r};
const st=document.createElement("style");st.textContent=`.gcomp1{margin-top:6px;padding:8px 10px;border-radius:8px;border-left:4px solid #1e88e5;background:color-mix(in srgb,#1e88e5 10%,transparent);font-size:13.5px;line-height:1.35}`;
document.head.appendChild(st);
})();
