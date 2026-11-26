/* ===== v945: hojas «Resolución IA» (lista de OT para Claude/Gemini) e «Importar hoja de registro de OT» con el MISMO TEMA que la
   barra derecha y el Panel de control: consola oscura con cuadrícula, marco degradado naranja · morado · azul, campos grafito,
   botones principales con el degradado naranja, texto claro. Igual en modo claro y oscuro. Solo aspecto. ===== */
(function(){"use strict";
const OR="var(--tkor,#ff7a1a)",PU="var(--tkpu,#9b3dff)",MO="var(--tkmo,ui-monospace,SFMono-Regular,Menlo,monospace)";
const ES=/importar hoja de registro de ot|resoluci[oó]n ia/i;
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
${S} a{color:#ffb36b}`;document.head.appendChild(st);
function mira(){const sh=document.getElementById("sheet"),c=document.getElementById("sheetc");if(!sh||!c)return;
 const h=c.querySelector("h3");const on=!!(h&&ES.test(h.textContent||""));if(sh.classList.contains("tkosc")!==on)sh.classList.toggle("tkosc",on)}
const ini=()=>{const c=document.getElementById("sheetc");if(!c)return setTimeout(ini,300);new MutationObserver(mira).observe(c,{childList:true});mira()};ini();
})();
