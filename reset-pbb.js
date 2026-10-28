/* ===== v140: RESET DE PASARELA como 1ª opción rápida =====
 Avisos de ZAPATA ACTIVADA, FALLO DE AUTONIVELACIÓN y SENSORES NEUTRALES: antes que nada, reset de la pasarela:
   selector en ON · mantener 5 s en ON · pasar el selector a REMOTO · Magelis «PBB remoto activado» (v142).
 Se muestra:
   · Guía de campo: caja roja «1ª OPCIÓN RÁPIDA · RESET DE PASARELA» en la primera línea (también en modo SOS).
     En las OT de zapata, el reset va dentro de la caja roja de primera actuación (antes del puente), sin duplicar.
   · Análisis de la OT: primer botón de «actuación más eficaz».
   · Guía de las averías «Fallo de autonivelación · sensores neutrales» y «Zapata / bordes / bumpers»: primer paso.
   · SOS de Inicio con la alarma de zapata: dentro de la caja de primera actuación. ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const nrm=t=>typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const es=s=>typeof esc=="function"?esc(s):String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const RE=/zapata|autonivel|auto[- ]?nivel|nivelacion|neutral/;
const txt=i=>nrm([i&&i.desc,i&&i.def,i&&i.com,i&&i.obs].filter(Boolean).join(" "));
const aplica=i=>!!i&&i.estado=="abierta"&&(!i.tipo||i.tipo=="PAS"||(i.equipos||[]).includes("PAS"))&&RE.test(txt(i));
const que=i=>{const t=txt(i),a=[];if(/zapata/.test(t))a.push("zapata activada");if(/autonivel|auto[- ]?nivel|nivelacion/.test(t)){const sb=/\bsub(ir|e|ida)\b/.test(t),bj=/\bbaj(ar|a|ada)\b/.test(t);a.push("fallo de autonivelación"+(sb&&bj?" subir / bajar":sb?" subir":bj?" bajar":""))}if(/neutral/.test(t))a.push("sensores neutrales");return a.join(" / ")};
window.resetAplica=aplica;
const PASO="1ª OPCIÓN RÁPIDA · RESET DE PASARELA (también en fallo de autonivelación al subir o al bajar, que depende del fuselaje del avión y de la posición neutral en ese atraque): selector de la pasarela en ON, mantener 5 segundos en ON y pasar el selector a REMOTO; comprobar en la Magelis «PBB remoto activado». Si la alarma desaparece y la PBB responde, comprobar maniobra y cerrar; si vuelve, seguir con los pasos siguientes.";
const NOTA="Fallo de autonivelación (al subir o al bajar): la alarma depende del fuselaje del avión y de la posición neutral del brazo en ese atraque. Por eso, lo primero es el reset de la pasarela.";
function cuerpo(i){return `${i&&/autonivel|auto[- ]?nivel|nivelacion|neutral/.test(txt(i))?`<div class="mu" style="font-size:12.5px;margin-bottom:4px">${es(NOTA)}</div>`:""}<div class="puit rstp"><div class="puac">1. Selector de la pasarela en <b>ON</b>.</div><div class="puac">2. Mantener <b>5 segundos</b> en ON.</div><div class="puac">3. Pasar el selector a <b>REMOTO</b>.</div><div class="puac">4. Comprobar en la Magelis «<b>PBB remoto activado</b>».</div></div>
 <div class="mu" style="font-size:12.5px">Si la alarma desaparece y la PBB responde, comprobar la maniobra y cerrar la OT. Si vuelve a salir, seguir con la primera actuación y la actuación más eficaz.</div>`}
window.resetHTML=function(i){return `<div class="pucab">⚡ 1ª OPCIÓN RÁPIDA · RESET DE PASARELA${que(i)?" · "+es(que(i)):""}</div>${cuerpo(i)}`};

/* guía de campo: el reset como primer paso de las averías */
try{GUIA.tipos.PAS.s.forEach(s=>{if(!/^(Fallo de autonivelación|Zapata)/.test(s.t)||s._rst)return;s._rst=1;
 s.p.unshift("PRIORIDAD 1 · "+PASO);if(s.g)s.g.unshift(0)})}catch(e){console.warn("reset guia",e)}

/* caja roja de primera actuación con zapata (y SOS de Inicio): el reset delante del puente */
(function(){if(typeof segHTML!="function")return;const o=segHTML;segHTML=function(i,S){const h=o(i,S);if(!aplica(i)||h.includes("rstp"))return h;
 return h.replace(/(<div class="pucab">[\s\S]*?<\/div>)/,`$1<div class="anal" style="color:#c62828">⚡ 1ª opción rápida · reset de pasarela</div>${cuerpo(i)}<div class="anal">Si no se recupera · puente provisional</div>`)}})();

/* guía de campo (y modo SOS): caja roja propia en la primera línea si no la lleva ya la de primera actuación */
function pinta(){if(typeof view!="undefined"&&view!="tec")return;let i=null;try{i=inc.find(x=>x.id==gOT)}catch(e){}
 const old=document.getElementById("greset");
 if(!aplica(i)){if(old)old.remove();return}
 const seg=document.getElementById("gsegl");if(seg&&seg.querySelector(".rstp")){if(old)old.remove();return}
 const d=old||Object.assign(document.createElement("div"),{id:"greset",className:"card pucard"});if(!old)d.innerHTML=resetHTML(i);
 const bar=document.getElementById("sosbar");
 if(bar){bar.after(d);return}
 const ref=document.getElementById("gsegl")||document.getElementById("gpte")||document.getElementById("ghidr")||document.querySelector("#app details.gd.gef");
 if(ref){ref.insertAdjacentElement("beforebegin",d);return}
 const anc=document.getElementById("anag")||[...document.querySelectorAll("#app .card")].find(x=>/Guía de campo/.test((x.querySelector("h3")||{}).textContent||""));
 if(anc)anc.insertAdjacentElement("afterend",d)}
(function(){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{pinta()}catch(e){console.warn("reset",e)}return r}})();
window.resetVa=function(id){gOT=id;if(typeof gSyncOT!="undefined")gSyncOT=id;if(view!="tec")go("tec");else vTec();
 setTimeout(()=>{const d=document.getElementById("greset")||document.querySelector("#gsegl .rstp");if(d)d.scrollIntoView({block:"center",behavior:"smooth"})},120)};

/* análisis de la OT: primer botón */
(function(){if(typeof anaHTML!="function")return;const o=anaHTML;anaHTML=function(i,R,dentro){let h=o(i,R,dentro);if(!aplica(i)||h.includes("resetVa("))return h;
 const btn=`<button class="anag" style="border:2px solid #c62828;font-weight:700" onclick="resetVa('${i.id}')">⚡ 1º · Reset de pasarela: selector ON 5 s → REMOTO</button>`;
 if(h.includes('<div class="anass">'))return h.replace('<div class="anass">','<div class="anass">'+btn);
 return h.replace(/(<div class="mu" style="font-size:11px;margin-top:6px">Orden propuesto)/,`<div class="anal">Guía de campo · actuación más eficaz</div><div class="anass">${btn}</div>$1`)}})();

/* la varita lleva primero al reset */
(function(){if(typeof varita!="function")return;const o=varita;varita=function(id){const i=inc.find(x=>x.id==id);if(aplica(i)){resetVa(id);return}return o(id)}})();
try{ANA_C={k:"",r:null}}catch(e){}
})();
