/* ===== v425: SOS · la DESCRIPCIÓN EN CAMPO va la primera (es el aviso de la OT) y la alarma de la Magelis queda como
   complementaria. «Ver primera actuación» analiza primero la descripción (ver sosAnaliza en sos.js). ===== */
(function(){
const o=window.sosRap;if(typeof o!="function")return;
window.sosRap=function(){const r=o.apply(this,arguments);try{
 const c=document.getElementById("sheetc"),t=document.getElementById("sr_ob");if(!c||!t)return r;
 const wrap=t.closest(".srobsw"),lab=c.querySelector('label[for="sr_ob"]'),pi=document.getElementById("sr_p"),dl=document.getElementById("sr_pl");
 const sa=document.getElementById("sr_a");const la=sa&&sa.previousElementSibling&&sa.previousElementSibling.tagName=="LABEL"?sa.previousElementSibling:null;
 if(wrap&&lab&&la){la.parentNode.insertBefore(lab,la);la.parentNode.insertBefore(wrap,la)}
 if(lab)lab.textContent="Avería en campo - lo que se detecta";
 /* v438: la alarma a mano y la foto también son complementarias (acotan el problema; manda la avería en campo) */
 const sm=c.querySelector("details.srtx>summary");if(sm&&/alarma a mano/i.test(sm.textContent))sm.innerHTML='Escribir la alarma a mano <small style="text-transform:none;letter-spacing:0">(complementaria)</small>';
 const lf=[...c.querySelectorAll("label")].find(x=>/^Foto de la Magelis/i.test(x.textContent));if(lf)lf.innerHTML='Foto de la Magelis / alarmas <small class="mu" style="text-transform:none;letter-spacing:0">(complementaria · acota el problema)</small>';
 t.placeholder="Ej. Freno de cabina derecho activado · la PBB no baja · la Magelis indica protección seguridades 2…";
 if(la)la.innerHTML='Alarma activada <small class="mu" style="text-transform:none;letter-spacing:0">(complementaria)</small>';
 const bv=[...c.querySelectorAll("button.pri")].find(x=>/primera actuaci/i.test(x.textContent));if(bv)bv.textContent="Ver actuación · sacar en servicio y reparar";
 const h3=c.querySelector(".sosrh h3");if(h3)h3.textContent="SOS · ACTUACIÓN Y BÚSQUEDA";
 const sub=c.querySelector(".sosrh .mu");if(sub)sub.textContent="Posición y avería en campo (lo que se detecta, el aviso de la OT); la alarma de la Magelis (lista o a mano) y su foto son complementarias y acotan el problema. Sale: 1 sacar en servicio ya · 2 reparar (actuación más eficaz) · 3 análisis con Claude. Cualquier sistema: pasarela, 400 Hz, aire acondicionado.";
 }catch(e){}return r};
const st=document.createElement("style");st.textContent=`/* v438: títulos de las cajas del SOS en verde y algo más grandes */
#sheetc:has(#sr_ob) label:not(.srfoto),#sheetc:has(#sr_ob) details.srtx>summary{color:#1fa64a!important;font-size:15.5px!important;font-weight:800!important}
#sheetc:has(#sr_ob) label small,#sheetc:has(#sr_ob) details.srtx>summary small{color:inherit;font-weight:700;opacity:.85}
.srcomp{margin-top:10px;border:1px dashed var(--bd,#888);border-radius:10px;padding:8px}.srcomp>summary{cursor:pointer;font-size:13px}`;document.head.appendChild(st);
})();
