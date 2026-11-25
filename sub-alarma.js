/* ===== v893: en el SOS, cambiar el elemento en el desplegable de la ACTUACIÓN MÁS EFICAZ («¿Qué límite de inclinación?»,
   «¿Qué final de carrera?») rehace TODA la actuación para la alarma de ese elemento: se cambia la alarma del SOS por la de su
   canal y se vuelve a analizar (alarma validada, elementos que intervienen, 1 · sacar en servicio con su croquis, componente,
   2 · reparar y 3 · análisis). Antes solo se repintaban los pasos de la caja y el croquis seguía siendo el de la alarma anterior.
   La alarma equivalente sale del mismo puesto en la lista del canal (CANAL_AL): 113 ↔ 112 (fallo auto), 252 ↔ 253 (advertencia),
   001 ↔ 002 (FC). ===== */
(function(){
"use strict";
/* caja de la guía → opción → canal del PLC */
const MAP=[
 {box:/^limite de inclinacion superior/,ch:{sup:"E-A2|3.1",inf:"E-A2|2.4"}},
 {box:/^final de carrera de seguridad pisado/,ch:{tra:"E-A8|5.1",ext:"E-A8|6.1",rot:"E-A8|7.1",inc:"E-A8|8.1"}}];
const nrm=s=>String(s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/^[^a-z0-9]+/,"");
const enSOS=()=>{const c=document.getElementById("sheetc");return !!(c&&c.querySelector("#sr_res")&&document.getElementById("sr_t"))};
const cods=t=>(String(t||"").match(/\b\d{3}\b/g)||[]);
function nueva(m,k){const CA=window.CANAL_AL||{},chN=m.ch[k];if(!chN||!CA[chN])return null;
 const sa=document.getElementById("sr_a"),st=document.getElementById("sr_t");
 const txt=[sa&&sa.value?sa.options[sa.selectedIndex].text:"",st?st.value:""].join(" ");
 /* alarma actual de alguno de los canales de esa caja y su puesto en la lista del canal */
 for(const c of cods(txt))for(const ch of Object.values(m.ch)){const L=CA[ch]||[];const i=L.indexOf(c);if(i>=0){const N=CA[chN];return {viejo:c,nuevo:N[Math.min(i,N.length-1)]}}}
 return {viejo:null,nuevo:CA[chN].find(c=>{try{const r=rcsSacar(c);return r&&/aut|seg|fc/.test(r.x.g)}catch(e){return false}})||CA[chN][0]}}
const o=window.lupaSubElige;
window.lupaSubElige=function(t,v){
 try{if(v&&enSOS()){const m=MAP.find(z=>z.box.test(nrm(t)));const n=m&&nueva(m,v);
  if(n&&n.nuevo&&n.nuevo!==n.viejo){const x=typeof rcsSacar=="function"&&rcsSacar(n.nuevo);const lin=n.nuevo+" "+(x&&x.x?x.x.t:"");
   const sa=document.getElementById("sr_a"),st=document.getElementById("sr_t");
   if(sa&&sa.value&&n.viejo&&cods(sa.options[sa.selectedIndex].text).includes(n.viejo)){sa.value="";sa.dispatchEvent(new Event("change",{bubbles:true}))}
   const L=String(st.value||"").split("\n").filter(l=>l.trim()&&!(n.viejo&&cods(l).includes(n.viejo)));L.unshift(lin);
   st.value=L.join("\n");st.dispatchEvent(new Event("input",{bubbles:true}));
   if(typeof msg=="function")msg("Actuación rehecha para la alarma "+lin);
   const c=document.getElementById("sheetc");if(c)c.scrollTo({top:0,behavior:"smooth"});
   if(typeof window.sosAnaliza=="function"){window.sosAnaliza();return}}}}catch(e){console.warn("sub-alarma",e)}
 return o.apply(this,arguments)};
/* v893: en el límite de inclinación, «subir» / «bajar» no identifican el elemento (salen en los pasos de los dos y partían mal el
   paso «límite superior → BAJAR · límite inferior → SUBIR»): solo superior / inferior, el código y la borna */
try{(window.lupaSubDefs||[]).forEach(d=>{if(!/inclinacion superior/.test(String(d.box)))return;d.op.forEach(op=>{
 if(op.k=="sup")op.s=/superior|it-b11|\b3\.1\b/;if(op.k=="inf")op.s=/inferior|it-b10|\b2\.4\b|\b2\.5\b/})})}catch(e){}
})();
/* ===== v895: «LÍNEA DE SEGURIDAD ACTIVADA» dentro del SOS (y de la lupa): elegir el elemento del estado de alarmas no hacía nada,
   porque segElige solo guarda el elemento en una OT abierta. Ahora en el SOS se pone la alarma de ese elemento (CANAL_AL de su
   entrada safety, p. ej. bordes E-A8 2.1 → 010) junto a la de la línea y se rehace TODA la actuación: puente, elementos, componente
   y reparar de ese elemento. Si el elemento no tiene código de alarma, se añade su nombre al texto de la alarma. ===== */
(function(){
"use strict";
const og=window.segElige;if(typeof og!="function")return;
const cods=t=>(String(t||"").match(/\b\d{3}\b/g)||[]);
window.segElige=function(v){
 try{const st=document.getElementById("sr_t"),c=document.getElementById("sheetc");
  if(v&&st&&c&&c.querySelector("#sr_res")){const CA=window.CANAL_AL||{};const x=(typeof SEG_ALL!="undefined"?SEG_ALL:[]).find(y=>y[0]+"|"+y[1]==v);
   const L=(CA[v]||[]);const pick=L.find(k=>{try{const r=rcsSacar(k);return r&&r.x&&r.x.f=="A"&&+k<200}catch(e){return false}})||L.find(k=>+k<200)||L[0];
   /* quitar las alarmas de otros elementos elegidos antes (las de la línea 011 / 013 se quedan) */
   const todos=new Set();(typeof SEG_ALL!="undefined"?SEG_ALL:[]).forEach(y=>(CA[y[0]+"|"+y[1]]||[]).forEach(k=>todos.add(k)));
   const lin=pick?(pick+" "+((rcsSacar(pick)||{}).x||{}).t):("LÍNEA DE SEGURIDAD ACTIVADA · "+(x?x[4]+" "+x[3]:v));
   const ls=String(st.value||"").split("\n").filter(l=>l.trim()&&!cods(l).some(k=>todos.has(k))&&!/^LÍNEA DE SEGURIDAD ACTIVADA · /.test(l));
   ls.unshift(lin);st.value=ls.join("\n");st.dispatchEvent(new Event("input",{bubbles:true}));
   if(typeof msg=="function")msg("Actuación rehecha para "+(x?x[4]:v)+(pick?" · alarma "+pick:""));
   c.scrollTo({top:0,behavior:"smooth"});if(typeof window.sosAnaliza=="function"){window.sosAnaliza();return}}}catch(e){console.warn("segElige SOS",e)}
 return og.apply(this,arguments)};
})();
/* ===== v896: en el SOS el elemento elegido en «Elemento en estado de alarmas» se QUEDA en la caja tras rehacer la actuación:
   se deduce de las alarmas del SOS (la de un elemento de la lista, p. ej. 010 → bordes E-A8 2.1) y el desplegable lo muestra
   elegido y resaltado. Vale también si se escribe o elige esa alarma a mano. ===== */
(function(){
"use strict";
const cods=t=>(String(t||"").match(/\b\d{3}\b/g)||[]);
function marca(){try{const c=document.getElementById("sheetc");if(!c||!c.querySelector("#sr_res"))return;
 const sa=document.getElementById("sr_a"),st=document.getElementById("sr_t");
 const al=cods([sa&&sa.value?sa.options[sa.selectedIndex].text:"",st?st.value:""].join(" "));const CA=window.CANAL_AL||{};
 const x=(typeof SEG_ALL!="undefined"?SEG_ALL:[]).find(y=>(CA[y[0]+"|"+y[1]]||[]).some(k=>al.includes(k)));
 c.querySelectorAll("select.anasel").forEach(s=>{if(!/Elemento en estado de alarmas/.test(s.options[0]&&s.options[0].text))return;
  if(!x){s.classList.remove("segok");return}const k=x[0]+"|"+x[1];if(![...s.options].some(o=>o.value==k))return;
  s.value=k;s.classList.add("segok");s.onchange=function(){if(this.value&&this.value!==k)segElige(this.value);else this.value=k}})}catch(e){}}
const oa=window.sosAnaliza;if(typeof oa=="function")window.sosAnaliza=async function(){const r=await oa.apply(this,arguments);marca();setTimeout(marca,300);return r};
const st=document.createElement("style");st.textContent=`select.anasel.segok{border:2px solid #22c55e!important;background:color-mix(in srgb,#22c55e 14%,var(--card,#111))!important;font-weight:700}`;
document.head.appendChild(st);
})();
