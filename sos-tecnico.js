/* ===== v718: SOS A PANTALLA COMPLETA · aspecto técnico de panel de mando (22/11/2026) =====
   · La hoja del SOS ocupa toda la pantalla, de arriba hasta la barra lateral de abajo (sin hueco gris ni esquinas de hoja).
   · Botones y casillas grandes para manejar con GUANTES: mínimo 60 px de alto, letra 17-18 px, bordes gruesos.
   · Estética de HMI industrial con el tema actual (variables --card, --tx, --mu, --bd, --ac del modo claro / oscuro / exterior):
     fondo de rejilla técnica, cabecera con franjas de peligro, pasos 1 → 2 → 3 como cadena de proceso, rótulos en monoespaciada
     con piloto, casillas con bisel y ACEPTAR tipo pulsador grande.
   · Se aplica también al Historial del SOS. Solo cambia el aspecto: no toca la lógica ni los ids. ===== */
(function(){
"use strict";
const S="#sheet.sost";
const st=document.createElement("style");st.id="sostcss";st.textContent=`
/* ---------- hoja a pantalla completa ---------- */
${S}{align-items:stretch!important;background:var(--card)!important}
${S}>#sheetc{max-height:none!important;height:100%!important;height:100dvh!important;width:100%!important;border-radius:0!important;border-top:0!important;
 padding:calc(10px + env(safe-area-inset-top,0px)) 14px calc(96px + env(safe-area-inset-bottom,0px)) 14px!important;
 --sk-l:color-mix(in srgb,var(--tx) 6%,transparent);--sk-l2:color-mix(in srgb,var(--tx) 3%,transparent);
 --sk-in:color-mix(in srgb,var(--card) 88%,var(--tx));--sk-ed:color-mix(in srgb,var(--bd) 70%,var(--tx));
 background-color:var(--card)!important;
 background-image:linear-gradient(var(--sk-l) 1px,transparent 1px),linear-gradient(90deg,var(--sk-l) 1px,transparent 1px),
  linear-gradient(var(--sk-l2) 1px,transparent 1px),linear-gradient(90deg,var(--sk-l2) 1px,transparent 1px)!important;
 background-size:48px 48px,48px 48px,12px 12px,12px 12px!important;background-attachment:local!important}

/* ---------- cabecera ---------- */
${S} .sosct{gap:8px!important;margin:0 0 8px!important;align-items:stretch!important}
${S} .sosct .sosr2t{position:relative;display:flex;align-items:center;justify-content:center;min-height:56px;padding:6px 26px!important;border-radius:12px!important;
 font-size:clamp(16px,5vw,21px)!important;letter-spacing:.06em!important;border:2px solid #ff4d4f!important;
 background:linear-gradient(180deg,#e8262a,#b3121a)!important;box-shadow:inset 0 1px 0 #ffffff40,inset 0 -3px 0 #0000003a,0 3px 10px #c6282855;overflow:hidden}
${S} .sosct .sosr2t::before,${S} .sosct .sosr2t::after{content:"";position:absolute;top:0;bottom:0;width:16px;
 background:repeating-linear-gradient(135deg,#ffd200 0 6px,#111 6px 12px);opacity:.95}
${S} .sosct .sosr2t::before{left:0}${S} .sosct .sosr2t::after{right:0}
${S} .soscx,${S} .shx{width:56px!important;height:56px!important;border-radius:12px!important;font-size:24px!important;border:2px solid var(--sk-ed)!important;
 background:var(--sk-in)!important;box-shadow:inset 0 -3px 0 #0002}
${S} .soshb{height:56px!important;padding:0 12px!important;border-radius:12px!important;border-width:2px!important;font-size:20px!important;gap:5px!important;
 background:color-mix(in srgb,#1fa64a 10%,var(--card))!important;box-shadow:inset 0 -3px 0 #0002}
${S} .soshb small{font-size:13px!important;letter-spacing:.02em}
${S} .soscp{font-size:13.5px!important;line-height:1.35!important;margin:0 0 10px!important;padding:8px 10px;border-left:4px solid var(--ac);
 background:color-mix(in srgb,var(--ac) 7%,transparent);border-radius:0 8px 8px 0;text-align:left!important;color:var(--tx)!important}

/* ---------- pasos 1 → 2 → 3 como cadena de proceso ---------- */
${S} .soscl{gap:14px!important;margin:0 0 12px!important}
${S} .soscl li{position:relative;flex-direction:column;align-items:flex-start!important;gap:6px!important;padding:8px 8px 9px!important;font-size:11.5px!important;
 line-height:1.2!important;letter-spacing:.02em;border:2px solid var(--sk-ed)!important;border-style:solid!important;border-radius:10px!important;
 background:var(--sk-in);box-shadow:inset 0 -3px 0 #0001}
${S} .soscl li::before{width:28px!important;height:28px!important;font-size:15px!important;border-radius:8px!important;background:var(--ac);color:#fff!important;border:0!important;
 box-shadow:inset 0 -2px 0 #0003}
${S} .soscl li:not(:last-child)::after{content:"";position:absolute;right:-12px;top:50%;width:0;height:0;margin-top:-7px;border:7px solid transparent;border-left:9px solid var(--ac)}

/* ---------- rótulos: monoespaciada con piloto ---------- */
${S} label:not(.srfoto),${S} details.srtx>summary{font-family:var(--tkmo,ui-monospace,Menlo,monospace)!important;text-transform:uppercase;letter-spacing:.06em!important;
 font-size:13px!important;font-weight:800!important;margin:12px 0 5px!important;display:flex;align-items:center;gap:6px}
${S} label:not(.srfoto)::before{content:"";flex:none;width:8px;height:8px;border-radius:50%;background:var(--ac);box-shadow:0 0 0 3px color-mix(in srgb,var(--ac) 25%,transparent)}
${S} .soscr2 label{display:flex!important}

/* ---------- casillas grandes con bisel ---------- */
${S} input:not([type=file]):not([type=checkbox]):not([type=radio]),${S} select,${S} textarea{min-height:60px!important;font-size:18px!important;
 border:2px solid var(--sk-ed)!important;border-radius:12px!important;background:var(--sk-in)!important;color:var(--tx)!important;
 box-shadow:inset 0 2px 4px #0000001f!important;padding:10px 12px!important;box-sizing:border-box}
${S} .soscr2 input,${S} .soscr2 select,${S} .rcsfil input{height:60px!important}
${S} select{padding-right:34px!important}
${S} input:focus,${S} select:focus,${S} textarea:focus{outline:0!important;border-color:var(--ac)!important;
 box-shadow:0 0 0 4px color-mix(in srgb,var(--ac) 28%,transparent),inset 0 2px 4px #0000001f!important}
${S} .rcsfil{gap:8px!important}${S} .rcsbus{margin-top:4px!important}
${S} .rcsfil .rcscmp input::placeholder{font-size:16px!important}
${S} .soscr2{gap:8px!important}

/* ---------- avería en campo ---------- */
${S} .srobsw textarea{min-height:132px!important;padding-right:66px!important;line-height:1.4}
${S} .srobsw button{width:52px!important;height:52px!important;border-radius:12px!important;border-width:2px!important;right:8px!important}
${S} .srobsw button svg{width:26px!important;height:26px!important}

/* ---------- alarma a mano | foto: pulsadores grandes ---------- */
${S} .soscr3{gap:10px!important;margin-top:12px!important}
${S} .soscr3 details.srtx,${S} .soscr3 .srfoto{min-height:68px!important;border:2px solid var(--sk-ed)!important;border-radius:14px!important;
 background:var(--sk-in)!important;box-shadow:inset 0 -4px 0 #00000022!important}
${S} .soscr3 details.srtx>summary{margin:0!important;font-size:15px!important;line-height:1.2;min-height:60px;justify-content:center;flex-wrap:wrap;text-align:center}
${S} .soscr3 .srfoto{font-size:16px!important}${S} .soscr3 .srfoto small,${S} .soscr3 summary small{font-size:11.5px!important;text-transform:none;letter-spacing:0}
${S} .soscr3 .srfoto.srfok{border-color:#2e7d32!important}

/* ---------- ACEPTAR tipo pulsador y papelera ---------- */
${S} .srobrow{gap:10px!important;margin-top:16px!important}
${S} .srobrow button.pri{min-height:72px!important;border-radius:14px!important;font-size:22px!important;font-weight:900!important;
 letter-spacing:.14em!important;text-transform:uppercase;border:2px solid color-mix(in srgb,var(--ac) 70%,#000)!important;color:#fff!important;
 background:linear-gradient(180deg,color-mix(in srgb,var(--ac) 82%,#fff),var(--ac) 55%,color-mix(in srgb,var(--ac) 80%,#000))!important;
 box-shadow:inset 0 1px 0 #ffffff59,inset 0 -5px 0 #00000033,0 4px 12px color-mix(in srgb,var(--ac) 40%,transparent)!important;text-shadow:0 1px 1px #0005}
${S} .srobrow button.pri:active,${S} .soscr3 .srfoto:active,${S} .soscx:active,${S} .soshb:active{transform:translateY(2px);box-shadow:inset 0 2px 4px #0003!important}
${S} .srobrst{width:72px!important;min-height:72px!important;border-radius:14px!important;border-width:2.5px!important;box-shadow:inset 0 -4px 0 #00000022}
${S} .srobrst svg{width:30px!important;height:30px!important}

/* ---------- listas de alarmas y componentes: filas para el dedo con guante ---------- */
${S} .rcsit{min-height:54px!important;padding:12px 12px!important;font-size:15px!important;display:flex!important;align-items:center;gap:6px;border-radius:10px!important;margin:0 0 4px!important}
${S} #rcs_l.on{max-height:52vh!important;border-width:2px!important;border-radius:12px!important;padding:6px!important;background:var(--card)}
${S} .rcslg{font-size:12.5px!important;margin:10px 4px 4px!important;display:flex;align-items:center;gap:6px}
${S} .rcscb{min-height:56px!important;font-size:15px!important;padding:10px 12px!important;border-radius:10px!important}
${S} .rcsqx{width:40px!important;height:40px!important;font-size:18px!important}
${S} .rcsb{border-radius:10px!important;padding:10px 12px!important}

/* ---------- resultados e historial ---------- */
${S} #sr_res button,${S} #sr_res summary,${S} .shnew,${S} .shi button{min-height:52px}
${S} #sr_res button{border-radius:12px!important;font-size:16px!important}
${S} .shh{gap:8px!important}${S} .sht{font-size:21px!important}
${S} .shi{border-radius:12px!important;padding:12px!important;font-size:14.5px!important}
${S} .shnew{min-height:60px!important;font-size:17px!important;border-radius:12px!important}

/* ---------- exterior / alto contraste ---------- */
html.ext ${S} input:not([type=file]),html.ext ${S} select,html.ext ${S} textarea,html.ext ${S} .soscr3 .srfoto,html.ext ${S} .soscr3 details.srtx{border-width:3px!important}`;
document.head.appendChild(st);
/* la hoja es del SOS si dentro está la avería en campo o el historial del SOS */
const sh=()=>document.getElementById("sheet"),sc=()=>document.getElementById("sheetc");
const mira=()=>{const s=sh(),c=sc();if(!s||!c)return;const es=!!(c.querySelector("#sr_ob")||c.querySelector(".shh .sht"));if(s.classList.contains("sost")!==es)s.classList.toggle("sost",es)};
const ini=()=>{const c=sc();if(!c)return setTimeout(ini,300);new MutationObserver(mira).observe(c,{childList:true});mira()};ini();
if(typeof window.closeSheet=="function"){const oc=window.closeSheet;window.closeSheet=closeSheet=function(){const r=oc.apply(this,arguments);const s=sh();if(s)s.classList.remove("sost");return r}}
})();
