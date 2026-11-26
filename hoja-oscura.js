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
html #sheet.cabfija #sheetc>.sosrh,html #sheet.cabfija #sheetc>.row:first-child,html #sheet.cabfija #sheetc>.shh{position:-webkit-sticky;position:sticky;top:calc(-1 * var(--shpt,14px));z-index:6;
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
html #sheet.tkseg #sheetc>.row:first-child,html #sheet.tkseg #sheetc>.shh{position:relative;justify-content:center!important;display:flex;align-items:center}
/* v953: Histórico de actuaciones con el mismo diseño (título centrado con degradado y ✕ a la derecha) */
html #sheet.tkseg #sheetc>.shh .sht{flex:1;text-align:center;font:900 16px/1.25 ${MO}!important;letter-spacing:3px!important;text-transform:uppercase;padding:0 46px;
 background:linear-gradient(90deg,${OR},#ffb020 40%,${PU});-webkit-background-clip:text;background-clip:text;color:transparent!important}
html #sheet.tkseg #sheetc>.shh .sht .icoL{display:none}
html #sheet.tkseg #sheetc>.shh>.shx{position:absolute;right:var(--shpr,14px);top:50%;transform:translateY(-35%);border-radius:10px!important}
/* v954: HISTÓRICO con la MISMA CABECERA que «Actuación»: barra roja-naranja + título en consola, línea «ACTIVO · fecha hora», láser de
   escaneo y la ✕ del mismo tamaño (50×50) y en el mismo sitio (mismo margen de la hoja), para que al pasar de una a otra no cambie */
html #sheet.tkhis>div{background:var(--bg)!important;background-image:none!important;border:0!important;border-radius:0!important;box-shadow:none!important;
 padding:calc(10px + env(safe-area-inset-top,0px)) 12px calc(96px + env(safe-area-inset-bottom,0px)) 12px!important}
html #sheet.tkhis #sheetc>.shh.hok{display:block!important;margin-bottom:10px!important}
html #sheet.tkhis .hct{display:flex;align-items:center;gap:8px;flex-wrap:nowrap}
html #sheet.tkhis .hct1{flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:10px;white-space:nowrap;overflow:hidden;font:900 clamp(17px,5.4vw,21px)/1.15 ${MO};letter-spacing:2.5px;text-transform:uppercase;text-align:left}
html #sheet.tkhis .hct1::before{content:"";flex:none;width:5px;align-self:stretch;min-height:28px;border-radius:3px;background:linear-gradient(180deg,#ff3b30,${OR})}
html #sheet.tkhis .hct1>span{background:linear-gradient(90deg,var(--tx) 25%,#ff3b30);-webkit-background-clip:text;background-clip:text;color:transparent;overflow:hidden;text-overflow:ellipsis}
html #sheet.tkhis .hct>.shx{flex:none!important;width:50px!important;height:50px!important;margin:0!important;padding:0!important;border-radius:12px!important;
 border:1.5px solid color-mix(in srgb,var(--tx) 16%,transparent)!important;background:color-mix(in srgb,var(--bg) 70%,var(--card))!important;box-shadow:none!important;color:var(--tx)!important;font-size:20px!important;font-weight:800!important;position:static!important;transform:none!important}
html #sheet.tkhis .hsub{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:8px 0 6px 15px;font:600 12px/1.2 ${MO};color:var(--mu);letter-spacing:.6px}
html #sheet.tkhis .hsub b{color:var(--tx)}html #sheet.tkhis .hdot{width:8px;height:8px;border-radius:50%;background:#ff3b30;animation:hPul 1.4s infinite}
@keyframes hPul{0%{box-shadow:0 0 0 0 #ff3b3088}70%{box-shadow:0 0 0 7px #ff3b3000}100%{box-shadow:0 0 0 0 #ff3b3000}}
html #sheet.tkhis .hscan{position:relative;height:2px;margin:0 0 2px;border-radius:2px;background:color-mix(in srgb,var(--tx) 10%,transparent);overflow:hidden}
html #sheet.tkhis .hscan::after{content:"";position:absolute;top:0;bottom:0;width:35%;left:-35%;background:linear-gradient(90deg,transparent,${OR},${PU},transparent);animation:oiScan 2.6s cubic-bezier(.6,0,.4,1) infinite}
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
const DI=["dom","lun","mar","mié","jue","vie","sáb"],z2=n=>String(n).padStart(2,"0");let rl=0;
function reloj(){const p=()=>{const f=document.querySelector("#sheetc .hsub .hf");if(!f){clearInterval(rl);rl=0;return}const d=new Date();
 f.textContent=`${DI[d.getDay()]} ${z2(d.getDate())}/${z2(d.getMonth()+1)}`;document.querySelector("#sheetc .hsub .hh").textContent=`${z2(d.getHours())}:${z2(d.getMinutes())}:${z2(d.getSeconds())}`};p();if(!rl)rl=setInterval(p,1000)}
function mira(){const sh=document.getElementById("sheet"),c=document.getElementById("sheetc");if(!sh||!c)return;
 const h=c.querySelector("h3");const on=!!(h&&ES.test(h.textContent||""));if(sh.classList.contains("tkosc")!==on)sh.classList.toggle("tkosc",on);
 const hs=c.querySelector(":scope>.shh .sht");const hi=!!(hs&&/hist[oó]rico de actuaciones/i.test(hs.textContent||""));
 const im=!!(h&&EI.test(h.textContent||""));
 if(sh.classList.contains("tkhis")!==hi)sh.classList.toggle("tkhis",hi);
 if(hi){const sx=c.querySelector(":scope>.shh");if(sx&&!sx.classList.contains("hok")){const x=sx.querySelector(".shx");sx.classList.add("hok");
   sx.innerHTML=`<div class="hct"><div class="hct1"><span>HISTÓRICO</span></div></div><div class="hsub"><span class="hdot"></span><span>ACTIVO</span><span>·</span><b class="hf"></b><b class="hh"></b></div><div class="hscan"></div>`;
   if(x)sx.querySelector(".hct").appendChild(x);reloj()}}if(sh.classList.contains("tkseg")!==im)sh.classList.toggle("tkseg",im);
 if(im){const r=c.querySelector(":scope>.shh")||c.querySelector(":scope>.row:first-child");if(r&&!c.querySelector(":scope>.oiscan"))r.insertAdjacentHTML("afterend",'<div class="oiscan"></div>')}
 const fj=!!(c.querySelector(":scope>.sosrh")||hi||(im&&c.querySelector(":scope>.row:first-child h3")));
 if(sh.classList.contains("cabfija")!==fj)sh.classList.toggle("cabfija",fj);
 if(fj){const cs=getComputedStyle(c);[["--shpt",cs.paddingTop],["--shpl",cs.paddingLeft],["--shpr",cs.paddingRight]].forEach(([k,v])=>{if(sh.style.getPropertyValue(k)!==v)sh.style.setProperty(k,v)})}}
const ini=()=>{const c=document.getElementById("sheetc");if(!c)return setTimeout(ini,300);new MutationObserver(mira).observe(c,{childList:true,subtree:false});setInterval(mira,800);mira()};ini();
})();
