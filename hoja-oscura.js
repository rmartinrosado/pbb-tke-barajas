/* ===== v945: hojas «Resolución IA» (lista de OT para Claude/Gemini) e «Importar hoja de registro de OT» con el MISMO TEMA que la
   barra derecha y el Panel de control: consola oscura con cuadrícula, marco degradado naranja · morado · azul, campos grafito,
   botones principales con el degradado naranja, texto claro. Igual en modo claro y oscuro. Solo aspecto. ===== */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)",MO="var(--tkmo,ui-monospace,SFMono-Regular,Menlo,monospace)";
const ES=/resoluci[oó]n ia/i,EI=/importar hoja de registro de ot/i;/* v948: Importar pasa al diseño de Seguimiento OT (tkseg) */
const S="html #sheet.tkosc";
const st=document.createElement("style");st.textContent=`
${S}>div,${S} #sheetc{--tx:#e9ecf1;--mu:#8b93a7;--card:#1b1e27;--bd:#ffffff1f;--bg:#12141b;color:#e9ecf1}
${S}>div{position:relative;background:linear-gradient(225deg,#12141b,#0b0c11) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box!important;
 border:1.5px solid transparent!important;border-bottom:0!important;border-radius:18px 18px 0 0!important;box-shadow:0 -10px 34px -12px #000c,0 0 24px -10px ${PU}!important}
${S}>div::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:.07;
 background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:18px 18px}
${S} #sheetc{position:relative}
${S} h3{font:900 15px/1.2 ${MO}!important;letter-spacing:2.5px!important;text-transform:uppercase;background:linear-gradient(90deg,#fff 30%,${OR});-webkit-background-clip:text;background-clip:text;color:transparent!important}
${S} .mu,${S} small,${S} label{color:#8b93a7!important}
${S} b,${S} strong{color:#fff}
${S} input,${S} select,${S} textarea{background:#1b1e27!important;color:#e9ecf1!important;border:1.5px solid #ffffff2a!important;border-radius:12px!important;color-scheme:dark}
${S} input:focus,${S} select:focus,${S} textarea:focus{outline:0!important;border-color:${OR}!important;box-shadow:0 0 0 4px color-mix(in srgb,${OR} 22%,transparent)!important}
${S} button.pri,${S} .pri{background:linear-gradient(135deg,#ffb020,${OR} 45%,#ff4d2e)!important;color:#111!important;border:0!important;border-radius:12px!important;
 font-family:${MO}!important;letter-spacing:1.5px;box-shadow:0 10px 24px -12px ${OR}!important}
${S} button.sec,${S} .sec{background:linear-gradient(180deg,#2a2e3a,#1b1e27)!important;color:#e9ecf1!important;border:1px solid #ffffff2a!important;border-radius:12px!important;box-shadow:0 4px 12px -6px #000!important}
${S} details,${S} .card{background:#1b1e27!important;border:1px solid #ffffff1f!important;border-radius:12px!important;color:#e9ecf1}
${S} summary{color:#fff}
${S} a{color:#ffb36b}
/* v946: CABECERA FIJA de la hoja (no se va con el scroll) en «Actuación» (SOS) e «Importar hoja de registro de OT» */
html #sheet.cabfija #sheetc>.sosrh,html #sheet.cabfija #sheetc>.row:first-child{position:-webkit-sticky;position:sticky;top:calc(-1 * var(--shpt,14px));z-index:6;
 margin-top:calc(-1 * var(--shpt,14px))!important;margin-left:calc(-1 * var(--shpl,14px))!important;margin-right:calc(-1 * var(--shpr,14px))!important;
 padding-top:var(--shpt,14px)!important;padding-left:var(--shpl,14px)!important;padding-right:var(--shpr,14px)!important;padding-bottom:8px!important;
 background:var(--card,#fff);box-shadow:0 10px 12px -12px #0009}
${S}.cabfija #sheetc>.row:first-child{background:linear-gradient(225deg,#12141b,#0b0c11)}
/* v948: «Importar hoja de registro de OT» con el MISMO DISEÑO que Seguimiento OT: tarjeta del color del tema (claro u oscuro) con marco
   degradado naranja · morado · azul y cuadrícula tenue, título centrado en letra de consola con degradado, franja de escaneo,
   rótulos de sección en mayúsculas con línea, campos redondeados, botones principales con el degradado naranja */
html #sheet.tkseg>div{position:relative;background:linear-gradient(var(--card),var(--card)) padding-box,linear-gradient(135deg,${OR},${PU} 55%,#1e88e5) border-box!important;
 border:1.5px solid transparent!important;box-shadow:0 10px 40px -14px color-mix(in srgb,${PU} 45%,transparent)!important}
html #sheet.tkseg>div::before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.05;background-image:linear-gradient(var(--tx) 1px,transparent 1px),linear-gradient(90deg,var(--tx) 1px,transparent 1px);background-size:22px 22px}
html #sheet.tkseg #sheetc>.row:first-child{position:relative;justify-content:center!important}
html #sheet.tkseg #sheetc>.row:first-child h3{flex:1;text-align:center;font:900 16px/1.25 ${MO}!important;letter-spacing:3.5px!important;text-transform:uppercase;padding:0 40px;
 background:linear-gradient(90deg,${OR},#ffb020 40%,${PU});-webkit-background-clip:text;background-clip:text;color:transparent!important}
html #sheet.tkseg #sheetc>.row:first-child>button{position:absolute;right:var(--shpr,14px);top:50%;transform:translateY(-35%);border-radius:10px!important}
html #sheet.tkseg .oiscan{position:relative;height:2px;margin:8px 6px 2px;border-radius:2px;background:color-mix(in srgb,var(--tx) 10%,transparent);overflow:hidden}
html #sheet.tkseg .oiscan::after{content:"";position:absolute;top:0;bottom:0;width:35%;left:-35%;background:linear-gradient(90deg,transparent,${OR},${PU},transparent);animation:oiScan 2.6s cubic-bezier(.6,0,.4,1) infinite}
@keyframes oiScan{to{left:100%}}
html #sheet.tkseg #sheetc>.mu{text-align:center;margin-top:8px}
html #sheet.tkseg label:not(.pri){display:flex!important;align-items:center;gap:8px;font:800 10.5px/1 ${MO}!important;letter-spacing:1.4px!important;text-transform:uppercase;color:var(--mu)!important}
html #sheet.tkseg .oifd label:not(.pri)::before{content:"";flex:none;width:7px;height:7px;border-radius:50%;background:linear-gradient(135deg,${OR},${PU})}
html #sheet.tkseg input,html #sheet.tkseg select,html #sheet.tkseg textarea{border-radius:12px!important;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;color:var(--tx)!important}
html #sheet.tkseg input:focus,html #sheet.tkseg select:focus,html #sheet.tkseg textarea:focus{outline:0!important;border-color:${OR}!important;box-shadow:0 0 0 4px color-mix(in srgb,${OR} 22%,transparent)!important}
html #sheet.tkseg .pri{background:linear-gradient(135deg,#ffb020,${OR} 45%,#ff4d2e)!important;color:#111!important;border:0!important;border-radius:12px!important;font-family:${MO}!important;letter-spacing:1.5px;box-shadow:0 10px 24px -12px ${OR}!important}
html #sheet.tkseg .sec{border-radius:12px!important;border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;color:var(--tx)!important}
html #sheet.tkseg details{border-radius:12px!important;border:1px solid color-mix(in srgb,var(--tx) 14%,transparent)!important;background:color-mix(in srgb,var(--bg) 60%,var(--card))!important}
html #sheet.tkseg h4,html #sheet.tkseg .oih{font-family:${MO}!important;letter-spacing:1.2px;text-transform:uppercase}
/* v947: como el resto de pantallas, la CABECERA DE LA APP (TKE Maintenance, versión, ☀ y apagado) queda fija y visible arriba:
   la hoja empieza debajo de ella y ocupa el resto de la pantalla */
html #sheet.cabfija{top:var(--hkh,0px)!important;bottom:0!important;height:auto!important;align-items:stretch!important}
html #sheet.cabfija>div{max-height:none!important;height:100%!important;box-sizing:border-box;border-radius:0!important}`;document.head.appendChild(st);
function mira(){const sh=document.getElementById("sheet"),c=document.getElementById("sheetc");if(!sh||!c)return;
 const h=c.querySelector("h3");const on=!!(h&&ES.test(h.textContent||""));if(sh.classList.contains("tkosc")!==on)sh.classList.toggle("tkosc",on);
 const im=!!(h&&EI.test(h.textContent||""));if(sh.classList.contains("tkseg")!==im)sh.classList.toggle("tkseg",im);
 if(im){const r=c.querySelector(":scope>.row:first-child");if(r&&!c.querySelector(":scope>.oiscan"))r.insertAdjacentHTML("afterend",'<div class="oiscan"></div>')}
 const fj=!!(c.querySelector(":scope>.sosrh")||(im&&c.querySelector(":scope>.row:first-child h3")));
 if(sh.classList.contains("cabfija")!==fj)sh.classList.toggle("cabfija",fj);
 if(fj){const cs=getComputedStyle(c);[["--shpt",cs.paddingTop],["--shpl",cs.paddingLeft],["--shpr",cs.paddingRight]].forEach(([k,v])=>{if(sh.style.getPropertyValue(k)!==v)sh.style.setProperty(k,v)})}}
const ini=()=>{const c=document.getElementById("sheetc");if(!c)return setTimeout(ini,300);new MutationObserver(mira).observe(c,{childList:true,subtree:false});setInterval(mira,800);mira()};ini();
})();
