/* ===== v878: Guía de campo · cargar una ACTUACIÓN en el desplegable «OT asociada» =====
   Además de las OT abiertas y de «📖 Guía completa», el desplegable lista las actuaciones guardadas (Historial de
   actuaciones: lo aceptado en el «+»). Al elegir una:
   · se pone el tipo de su actuación más eficaz (PAS, AAA, HZ…);
   · se ACTIVAN (abren y marcan) todos los apartados de la guía que corresponden a esa actuación: su actuación más
     eficaz y las cajas relacionadas con la avería y las alarmas que se apuntaron; el resto queda oculto;
   · arriba sale la ficha de la actuación (PBB, alarma, avería) y el botón «Ver guía completa».
   Elegir una OT o «Guía completa» vuelve a lo de siempre. ===== */
(function(){"use strict";
if(typeof vTec!="function")return;
const P="act:",K="pbb_sos_hist";
let ACT=null;
const e_=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const lee=()=>{try{return JSON.parse(localStorage.getItem(K)||"[]")}catch(e){return[]}};
const fh=ts=>{try{const d=new Date(ts);return d.toLocaleDateString("es-ES",{day:"2-digit",month:"2-digit"})+" "+d.toLocaleTimeString("es-ES",{hour:"2-digit",minute:"2-digit"})}catch(e){return""}};
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const al=h=>[h.alL,h.alM].filter(Boolean).join(" · ");
const rot=h=>`🛠 ${fh(h.ts)} · PBB ${h.pos||"?"} · ${(h.b2||al(h)||h.ob||"actuación").slice(0,60)}`;
/* cajas de la guía que corresponden a la actuación */
function cajas(h){const G=(typeof GUIA!="undefined"&&GUIA.tipos)||{};const txt=[h.b2,h.ob,al(h)].filter(Boolean).join(" ");const b2=nrm(h.b2);
 const R=[];Object.keys(G).forEach(T=>{const S=(G[T]&&G[T].s)||[];
  let A=null;try{A=anaTerminos({id:"act",pos:h.pos||"",tipo:T,equipos:[T],estado:"abierta",desc:txt,def:"",com:"",obs:"",orden:"ACT",fecha:""})}catch(e){}
  S.forEach((s,si)=>{const t=nrm(s.t);let r=0;
   if(b2&&(t==b2||t.includes(b2)||b2.includes(t)))r=1e3;
   else if(A){try{r=anaPunt(s.t,A)*2+Math.min(anaPunt((s.p||[]).join(" "),A),6)*.5}catch(e){r=0}}
   if(r>0)R.push({T,si,k:T+si,r})})});
 R.sort((a,b)=>b.r-a.r);if(!R.length)return {T:"PAS",K:new Set()};
 const top=R[0],mx=R.find(x=>x.r<1e3);const lim=mx?mx.r*.55:Infinity;
 const sel=R.filter(x=>x.r>=1e3||(x.T==top.T&&x.r>=lim)).slice(0,6);
 return {T:top.T,K:new Set(sel.map(x=>x.k)),top:top.k}}
window.guiaActuacion=function(id){const h=lee().find(x=>x.id==id);if(!h)return;ACT={h,...cajas(h)};
 try{gTipo=ACT.T}catch(e){}
 if(typeof guiaCompleta=="function")guiaCompleta(1);else vTec()};
function aplica(app){if(!ACT)return;
 const D=[...app.querySelectorAll("details.gd[data-k]")];if(!D.length)return;
 D.forEach(d=>{const on=ACT.K.has(d.dataset.k);d.classList.toggle("gact",on);d.style.display=on?"":"none";if(on&&!d.__actOpen){d.open=true;d.__actOpen=1}});
 app.querySelectorAll("details.ggrp").forEach(g=>{const any=[...g.querySelectorAll("details.gd[data-k]")].some(d=>ACT.K.has(d.dataset.k));
  if(g.querySelector("details.gd[data-k]")){g.style.display=any?"":"none";if(any&&!g.__actOpen){g.open=true;g.__actOpen=1}}});
 if(!app.querySelector(".gactc")){const h=ACT.h;const n=ACT.K.size;
  const box=app.querySelector(".gcomp1");const html=`<div class="gactc"><div class="gacth">🛠 ACTUACIÓN · ${e_(fh(h.ts))} · PBB ${e_(h.pos||"?")}</div>
   ${h.b2?`<div><b>Actuación más eficaz:</b> ${e_(h.b2)}</div>`:""}${al(h)?`<div><b>Alarma:</b> ${e_(al(h))}</div>`:""}${h.ob?`<div><b>Avería:</b> ${e_(h.ob)}</div>`:""}
   <div class="gactn">${n?`${n} apartado${n==1?"":"s"} de la guía activado${n==1?"":"s"} para esta actuación`:"Ningún apartado de la guía coincide con esta actuación"}</div>
   <button type="button" class="sec" onclick="guiaActuacionOff()">📖 Ver guía completa</button></div>`;
  if(box){box.style.display="none";box.insertAdjacentHTML("afterend",html)}}
 if(ACT.top&&!ACT.__scr){ACT.__scr=1;setTimeout(()=>{const d=app.querySelector(`details.gd[data-k="${CSS.escape(ACT.top)}"]`);if(d)d.scrollIntoView({block:"start",behavior:"smooth"})},300)}}
window.guiaActuacionOff=function(){ACT=null;if(typeof guiaCompleta=="function")guiaCompleta(1);else vTec()};
const oV=vTec;vTec=function(){const r=oV.apply(this,arguments);
 try{const app=document.getElementById("app");const sl=app&&[...app.querySelectorAll("select")].find(s=>/gOT\s*=|guiaCompleta/.test(s.getAttribute("onchange")||""));
  if(sl){const L=lee().slice(0,40);
   if(L.length&&!sl.querySelector("optgroup.gactg")){const og=document.createElement("optgroup");og.className="gactg";og.label="Actuaciones (historial)";
    og.innerHTML=L.map(h=>`<option value="${P}${e_(h.id)}">${e_(rot(h))}</option>`).join("");sl.appendChild(og)}
   const oc=sl.getAttribute("onchange")||"";
   if(!/guiaActuacion/.test(oc))sl.setAttribute("onchange",`if(this.value.indexOf('${P}')===0){guiaActuacion(this.value.slice(${P.length}))}else{window.__actOff&&__actOff();${oc}}`);
   if(ACT)sl.value=P+ACT.h.id}
  if(ACT&&app)aplica(app)}catch(e){console.warn("guia-act",e)}
 return r};
/* elegir una OT o «Guía completa» quita la actuación */
window.__actOff=()=>{ACT=null};
/* otra parte de la app elige una OT (llave, SOS…): fuera la actuación */
const oG=window.guiaCompleta;if(typeof oG=="function")window.guiaCompleta=function(on){if(!on)ACT=null;return oG.apply(this,arguments)};
/* las cajas que se repintan después (IA, cotejo) también se filtran */
new MutationObserver(()=>{if(!ACT)return;try{if(typeof view!="undefined"&&view!="tec")return;const app=document.getElementById("app");if(app)aplica(app)}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
.gactc{margin-top:8px;padding:10px 12px;border-radius:10px;border-left:4px solid #ef6c00;background:color-mix(in srgb,#ef6c00 10%,transparent);font-size:13.5px;line-height:1.4}
.gactc>div{margin:2px 0}.gacth{font-weight:900;letter-spacing:.5px;margin-bottom:4px!important}.gactn{font-weight:700;color:#ef6c00;margin-top:6px!important}
.gactc button{margin-top:8px!important;width:100%}
#app details.gd.gact{box-shadow:0 0 0 2px #ef6c00 inset!important}`;document.head.appendChild(st);
})();
