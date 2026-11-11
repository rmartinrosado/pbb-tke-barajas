/* ===== v425: SOS · la DESCRIPCIÓN EN CAMPO va la primera (es el aviso de la OT) y la alarma de la Magelis queda como
   complementaria. «Ver primera actuación» analiza primero la descripción (ver sosAnaliza en sos.js). ===== */
(function(){
const o=window.sosRap;if(typeof o!="function")return;
window.sosRap=function(){const r=o.apply(this,arguments);try{
 const c=document.getElementById("sheetc"),t=document.getElementById("sr_ob");if(!c||!t)return r;
 const wrap=t.closest(".srobsw"),lab=c.querySelector('label[for="sr_ob"]'),pi=document.getElementById("sr_p"),dl=document.getElementById("sr_pl");
 const sa=document.getElementById("sr_a");const la=sa&&sa.previousElementSibling&&sa.previousElementSibling.tagName=="LABEL"?sa.previousElementSibling:null;
 if(wrap&&lab&&la){la.parentNode.insertBefore(lab,la);la.parentNode.insertBefore(wrap,la)}
 if(lab)lab.textContent="Descripción en campo · aviso de la OT (lo que detectas)";
 t.placeholder="Ej. Freno de cabina derecho activado · la PBB no baja · la Magelis indica protección seguridades 2…";
 if(la)la.innerHTML='Alarma activada <small class="mu" style="text-transform:none;letter-spacing:0">(complementaria)</small>';
 const sub=c.querySelector(".sosrh .mu");if(sub)sub.textContent="Posición y descripción en campo (el aviso de la OT); la alarma de la Magelis o su foto la complementan. Se muestra la primera actuación más eficaz.";
 }catch(e){}return r};
const st=document.createElement("style");st.textContent=`.srcomp{margin-top:10px;border:1px dashed var(--bd,#888);border-radius:10px;padding:8px}.srcomp>summary{cursor:pointer;font-size:13px}`;document.head.appendChild(st);
})();
