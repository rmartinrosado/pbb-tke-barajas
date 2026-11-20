/* ===== v633: RESCATE CON BYPASS CP-S33 (20/11/2026) =====
   En algunas PBB, con la pasarela encendida (remoto o local/manual) el bypass CP-S33 no deja trasladar; solo traslada si se
   APAGA la PBB y se arranca con el bypass ya girado + selector en LOCAL/MANUAL, manteniendo el bypass durante la maniobra.
   Explicación (esquema rev. J folio 68): CP-S33 13-14 entra al módulo de SEGURIDAD E-A8 IN 3.1 (DIS03 «BYPASS
   SEGURIDADES»), alimentado por la salida de test UT1. Es una petición al programa de seguridad, no un puente físico:
   · el disparo de seguridades queda ENCLAVADO y no se rearma con la causa presente;
   · la anulación solo se acepta si está seleccionada al ARRANCAR (no en caliente, criterio de seguridad);
   · en REMOTO manda el RCS: pasar a local en caliente no cambia el modo hasta «Off remoto» o apagar.
   Al apagar se borra el enclavamiento y al arrancar con bypass + local el PLC entra en maniobra de rescate; es un mando de
   hombre muerto (hold-to-run): al soltar la llave se para.
   Se añade, plegado, AL FINAL de la caja del puente provisional (el puente siempre primero) y del bloque 1 del SOS. ===== */
(function(){
"use strict";
const st=document.createElement("style");st.textContent=`
details.rbyp{margin:10px 0 2px;border:2px solid #f59e0b;border-radius:10px;background:color-mix(in srgb,#f59e0b 10%,var(--card,#fff));overflow:hidden}
details.rbyp>summary{list-style:none;cursor:pointer;padding:9px 12px;font-weight:800;font-size:14.5px;line-height:1.3;display:flex;gap:8px;align-items:flex-start}
details.rbyp>summary::-webkit-details-marker{display:none}
details.rbyp>summary::after{content:"▾";margin-left:auto;opacity:.7}details.rbyp[open]>summary::after{content:"▴"}
.rbyp .rbb{padding:0 12px 10px;font-size:13.5px;line-height:1.4}
.rbyp ol{margin:6px 0 8px;padding-left:22px}.rbyp ol li{margin:3px 0}
.rbyp .rbn{margin-top:6px;padding:6px 8px;border-radius:7px;background:color-mix(in srgb,#ef4444 14%,transparent);font-weight:700}
.rbyp .rbq{margin-top:6px;opacity:.9}.rbyp h4{margin:8px 0 2px;font-size:13.5px}`;document.head.appendChild(st);
const HTML=`<details class="rbyp"><summary>🔑 Si con la PBB encendida el bypass CP-S33 no deja trasladar · rescate arrancando con bypass</summary><div class="rbb">
<ol>
<li>Selector de la PBB en <b>OFF</b>: pasarela <b>apagada</b> (se borra el disparo de seguridades enclavado).</li>
<li>Girar y <b>mantener</b> la llave <b>CP-S33 «BYPASS SEGURIDADES»</b> del pupitre.</li>
<li>Selector en <b>LOCAL</b> y mando en <b>MANUAL</b>.</li>
<li><b>Encender</b> la PBB sin soltar el bypass: el PLC arranca en <b>maniobra de rescate</b>.</li>
<li>Trasladar <b>despacio</b>, en sentido contrario al elemento activado, con un compañero vigilando y <b>sin soltar</b> la llave (al soltarla se para).</li>
<li>Pasarela en zona segura: soltar el bypass, apagar, localizar y reparar la causa antes de volver a <b>REMOTO</b>.</li>
</ol>
<div class="rbn">⚠️ Solo maniobra controlada. Seta de emergencia: no se anula, localizar y rearmar.</div>
<h4>Por qué pasa</h4>
<div>La llave CP-S33 (13-14) entra al módulo de <b>seguridad E-A8 IN 3.1</b> (DIS03, folio 68), alimentada por la salida de test <b>UT1</b>: es una petición al programa de seguridad, no un puente en la línea. Con la PBB encendida:</div>
<ul style="margin:4px 0;padding-left:20px">
<li>el disparo de seguridades queda <b>enclavado</b> y no se rearma mientras la causa siga activa;</li>
<li>la anulación solo se acepta si está puesta <b>al arrancar</b>, no en marcha;</li>
<li>en <b>REMOTO</b> manda el RCS: pasar a local en caliente no cambia el modo hasta «Off remoto» o apagar.</li></ul>
<div>Por eso funciona <b>Off → bypass → local/manual → encender</b>, y hay que mantener la llave: es mando de hombre muerto.</div>
<div class="rbq"><b>Comprobación:</b> PBB encendida, girar CP-S33 y mirar el LED de <b>E-A8 IN 3.1</b>. Enciende y no traslada → lo bloquea el programa (normal en estas PBB). No enciende → llave CP-S33 13-14, hilo 212 (609 en otras) y bornas P-X53 / P-X51 / E-X59. En la Magelis, tras pasar a local, «Off remoto activado».</div>
</div></details>`;
window.rescateBypassHTML=()=>HTML;
const RX=/puente provisional|bypass|recuperar la pasarela|sacar en servicio|seguridades|antiatrap|final de carrera|bumper|borde/i;
function pone(caja){if(!caja||caja.querySelector(":scope>details.rbyp"))return;if(!RX.test(caja.textContent||""))return;
 caja.insertAdjacentHTML("beforeend",HTML)}
function pinta(){try{
 ["gsegl","gpte"].forEach(id=>pone(document.getElementById(id)));
 const u=document.querySelector("#sr_res .ubb1");if(u&&/puente|bypass|recuperar/i.test(u.textContent||""))pone(u);
 /* que siga siendo lo último de la caja (el puente siempre por delante) */
 document.querySelectorAll("details.rbyp").forEach(d=>{const p=d.parentElement;if(p&&p.lastElementChild!==d&&!p.lastElementChild.classList.contains("pbbcu"))p.appendChild(d)});
}catch(e){}}
let t=0;new MutationObserver(()=>{if(t)return;t=setTimeout(()=>{t=0;pinta()},250)}).observe(document.body,{childList:true,subtree:true});
setTimeout(pinta,800);
})();
