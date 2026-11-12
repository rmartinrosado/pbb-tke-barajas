/* ===== v440: SOS · pantalla compacta que cabe entera sin scroll (12/11/2026) =====
   · Cabecera: título más bajo con ✕ de cerrar, una línea de explicación y los pasos 1-2-3 en una sola fila.
   · Posición PBB y Alarma de la Magelis en la misma línea; «alarma a mano» y «foto» en la misma línea.
   · Avería en campo con 3 líneas; botones más bajos. El «Cerrar» de abajo pasa a la ✕ de la cabecera.
   Los resultados (al pulsar ACEPTAR) siguen saliendo debajo y ahí sí se desplaza. ===== */
(function(){
"use strict";
const o=window.sosRap;if(typeof o!="function")return;
window.sosRap=function(){const r=o.apply(this,arguments);try{
 const c=document.getElementById("sheetc");if(!c||!document.getElementById("sr_ob"))return r;
 c.classList.add("sosc");
 /* cabecera */
 const h=c.querySelector(".sosrh");
 if(h){h.innerHTML=`<div class="sosct"><div class="sosr2t">SOS - ACTUACIÓN RÁPIDA</div><button type="button" class="soscx" aria-label="Cerrar" onclick="closeSheet()">✕</button></div>
  <p class="soscp">Manda la <b>avería en campo</b>; la alarma (lista o a mano) y la foto la complementan y acotan. Pasarela, 400 Hz y aire acondicionado.</p>
  <ol class="soscl"><li>SACAR EN SERVICIO YA</li><li>REPARAR · MÁS EFICAZ</li><li>ANÁLISIS CON CLAUDE</li></ol>`}
 const lab=el=>{const p=el&&el.previousElementSibling;return p&&p.tagName=="LABEL"?p:null};
 /* Posición | Alarma en una línea */
 const pi=document.getElementById("sr_p"),dl=document.getElementById("sr_pl"),sa=document.getElementById("sr_a");
 if(pi&&sa){const lp=lab(pi),la=lab(sa);const row=document.createElement("div");row.className="soscr2";
  const a=document.createElement("div");a.className="soscpos";const b=document.createElement("div");b.className="soscal";
  pi.parentNode.insertBefore(row,lp||pi);if(lp)a.appendChild(lp);a.appendChild(pi);if(dl)a.appendChild(dl);if(la)b.appendChild(la);b.appendChild(sa);row.append(a,b);
  if(lp)lp.textContent="Posición PBB";if(la)la.innerHTML='Alarma <small>(complementaria)</small>'}
 /* alarma a mano | foto en una línea */
 const dt=c.querySelector("details.srtx"),fb=c.querySelector("label.srfoto");
 if(dt&&fb){const lf=lab(fb);const row=document.createElement("div");row.className="soscr3";dt.parentNode.insertBefore(row,dt);row.append(dt,fb);if(lf)lf.remove();
  const s=dt.querySelector("summary");if(s)s.innerHTML='✍️ Alarma a mano <small>(complementaria)</small>';fb.innerHTML='<span>📷 Foto Magelis</span><small>(complementaria)</small>'}
 const t=document.getElementById("sr_ob");if(t)t.rows=3;
 /* el «Cerrar» de abajo ya está en la ✕ */
 [...c.querySelectorAll(":scope>button.sec")].forEach(x=>{if(/^\s*cerrar\s*$/i.test(x.textContent))x.remove()});
}catch(e){}return r};
const st=document.createElement("style");st.textContent=`
#sheetc.sosc .sosrh{margin:0 0 4px!important}
#sheetc.sosc .sosct{display:flex;align-items:center;gap:6px;margin:0 0 4px}
#sheetc.sosc .sosct .sosr2t{flex:1;margin:0;padding:5px 6px;font-size:clamp(14px,4.6vw,18px)}
#sheetc.sosc .soscx{flex:none;width:36px!important;height:36px;margin:0!important;padding:0!important;border-radius:9px;font-size:18px;font-weight:800;background:transparent;border:1.5px solid var(--bd,#999);color:var(--tx,#111)}
#sheetc.sosc .soscp{margin:0 0 4px;font-size:12px;line-height:1.3;color:var(--mu,#7a8394)}
#sheetc.sosc .soscl{display:flex;gap:4px;margin:0 0 2px;padding:0;list-style:none;counter-reset:s}
#sheetc.sosc .soscl li{counter-increment:s;flex:1;display:flex;align-items:center;gap:4px;font-weight:800;font-size:10.5px;line-height:1.15;padding:4px 5px;border:1px dashed var(--bd,rgba(127,127,127,.45));border-radius:7px}
#sheetc.sosc .soscl li::before{content:counter(s);flex:none;width:18px;height:18px;border:2px solid var(--ac,#ff6a13);color:var(--ac,#ff6a13);border-radius:5px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900}
#sheetc.sosc label:not(.srfoto),#sheetc.sosc details.srtx>summary{font-size:13.5px!important;margin-top:6px!important;margin-bottom:2px!important}
#sheetc.sosc label small,#sheetc.sosc summary small{font-size:11px;font-weight:700}
#sheetc.sosc .soscr2{display:flex;gap:6px;align-items:flex-end}
#sheetc.sosc .soscpos{flex:0 0 33%;min-width:0}#sheetc.sosc .soscr2 label{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;letter-spacing:.02em!important;font-size:12.5px!important}#sheetc.sosc .soscal{flex:1;min-width:0}
#sheetc.sosc .soscr2 input,#sheetc.sosc .soscr2 select{height:44px;padding:6px 8px;font-size:15px;margin:0;width:100%}
#sheetc.sosc .srobsw textarea{min-height:92px!important;font-size:15px;padding-top:6px;padding-bottom:6px}
#sheetc.sosc .srobsw button{width:32px!important;height:32px!important}
#sheetc.sosc .soscr3{display:flex;flex-wrap:wrap;gap:6px;align-items:stretch;margin-top:6px}
#sheetc.sosc .soscr3 details.srtx{flex:1 1 45%;margin:0!important;display:flex;flex-direction:column;justify-content:center;border:1px solid var(--bd,#bbb);border-radius:9px;padding:4px 8px}
#sheetc.sosc .soscr3 details.srtx>summary{margin:0!important;font-size:12.5px!important;line-height:1.2}
#sheetc.sosc .soscr3 details[open]{flex-basis:100%;order:2}
#sheetc.sosc .soscr3 details[open] textarea{margin-top:4px}
#sheetc.sosc .soscr3 .srfoto{flex:1 1 45%;margin:0!important;padding:6px 8px!important;font-size:12.5px!important;letter-spacing:0!important;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.2;min-height:40px}
#sheetc.sosc .soscr3 .srfoto{flex-direction:column;gap:1px;font-family:inherit!important;text-transform:none!important;font-weight:800}#sheetc.sosc .soscr3 .srfoto small{display:block;font-size:11px;font-weight:700;opacity:.8}
#sheetc.sosc #sr_pv img{max-height:90px!important}
#sheetc.sosc button.pri{margin-top:10px!important;padding:12px!important}
#sheetc.sosc .srobrow{margin-top:6px!important}
#sheetc.sosc .srobrow .srobok{padding:8px!important}#sheetc.sosc .srobok img.srobwm{height:26px}
/* el menú lateral y la flecha atrás flotan abajo: hueco para que no tapen el botón verde */
#sheet>#sheetc.sosc{padding-bottom:max(84px,calc(70px + env(safe-area-inset-bottom)))!important}`;
document.head.appendChild(st);
})();
