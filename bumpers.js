/* v324: BUMPERS segregados · 2 grupos × 2 bumpers (brazo autonivelador C-B27 / C-B28 · lateral izquierdo de cabina C-B29 / C-B30).
 Según ESQUEMA GENERAL rev. J folio 92 (igual en 504/508 folio 92) y plano 507 folio 116:
   Brazo  : E-A10 UT1 1.2 → E-X68.1:13 → EP-W4 c13 → P-X92.1:13 → CP-W61 → C-B28 → CP-W61 → P-X92.1:28 → CP-W60 → C-B27 → CP-W60 → P-X92.1:12 → EP-W4 c12 → E-X68.1:12 → IN01S 1.1
   Cabina : E-A10 UT2 2.2 → E-X68.1:15 → EP-W4 c15 → P-X92.1:15 → CP-W63 → C-B29 → CP-W63 → P-X92.1:29 → CP-W62 → C-B30 → CP-W62 → P-X92.1:14 → EP-W4 c14 → E-X68.1:14 → IN02S 2.1
   (507: armario E1-X68.1, manguera EP-W6, borna intermedia P-X51:25 / P-X51:26 e hilos 619-624.)
 Qué hace:
  1. Primera actuación en campo: en vez del puente en el PLC (que anula toda la cadena), puente en el BORNERO DEL PUPITRE para saber
     cuál de los cuatro bumpers falla, con croquis de los dos grupos, códigos de cable y bornas.
  2. Guía de campo: caso «Bumpers brazo y cabina · 4 bumpers» con el croquis y los pasos.
  3. Análisis de OT: «bumper» sin precisar = los dos grupos; «brazo» / «cabina» = su grupo. */
(function(){
"use strict";
const e_=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const V={
 J:{arm:"+E-X68.1",man:"EP-W4 (H07RN-F 27x1,5)",f:92,
  g:{brazo:{nom:"Bumpers del BRAZO AUTONIVELADOR",led:"E-A10 mód. 1 · LED 1 (IN01S 1.1 / UT1 1.2)",in:"1.1",ut:"1.2",
     t:["+P-X92.1:12","+P-X92.1:28","+P-X92.1:13"],x:["12","13"],hIn:"668",hUt:"669",hMid:"672",
     b:[{id:"C-B27",n:"Borde seguridad 1 · brazo",cab:"CP-W60",ha:"668",hb:"672"},{id:"C-B28",n:"Borde seguridad 2 · brazo",cab:"CP-W61",ha:"672",hb:"669"}]},
   cabina:{nom:"Bumpers LATERAL IZQUIERDO de CABINA",led:"E-A10 mód. 1 · LED 2 (IN02S 2.1 / UT2 2.2)",in:"2.1",ut:"2.2",
     t:["+P-X92.1:14","+P-X92.1:29","+P-X92.1:15"],x:["14","15"],hIn:"670",hUt:"671",hMid:"673",
     b:[{id:"C-B30",n:"Borde seguridad 2 · cabina izq.",cab:"CP-W62",ha:"670",hb:"673"},{id:"C-B29",n:"Borde seguridad 1 · cabina izq.",cab:"CP-W63",ha:"673",hb:"671"}]}}},
 S507:{arm:"+E1-X68.1",man:"EP-W6 (H07RN-F 27x1,5)",f:116,
  g:{brazo:{nom:"Bumpers del BRAZO AUTONIVELADOR",led:"E-A10 mód. 1 · LED 1 (IN01S 1.1 / UT1 1.2)",in:"1.1",ut:"1.2",
     t:["+P-X92.1:12","+P-X51:25","+P-X92.1:13"],x:["12","13"],hIn:"619",hUt:"620",hMid:"623",
     b:[{id:"C-B27",n:"Borde seguridad 1 · brazo",cab:"CP-W60",ha:"619",hb:"623"},{id:"C-B28",n:"Borde seguridad 2 · brazo",cab:"CP-W61",ha:"623",hb:"620"}]},
   cabina:{nom:"Bumpers LATERAL IZQUIERDO de CABINA",led:"E-A10 mód. 1 · LED 2 (IN02S 2.1 / UT2 2.2)",in:"2.1",ut:"2.2",
     t:["+P-X92.1:14","+P-X51:26","+P-X92.1:15"],x:["14","15"],hIn:"621",hUt:"622",hMid:"624",
     b:[{id:"C-B30",n:"Borde seguridad 2 · cabina izq.",cab:"CP-W62",ha:"621",hb:"624"},{id:"C-B29",n:"Borde seguridad 1 · cabina izq.",cab:"CP-W63",ha:"624",hb:"622"}]}}}};
const ot=()=>{try{return inc.find(x=>x.id==gOT)||null}catch(e){return null}};
const varPos=p=>String(p||"")==="507"?V.S507:V.J;
/* pasos de la prueba con puentes en el bornero del pupitre */
function pasos(G,D){const [a,m,c]=G.t;return [
 `Seta del pupitre pulsada / maniobra parada. Compañero vigilando el brazo y la cabina. En el PLC del armario E mira <b>${e_(G.led)}</b>: con los dos bumpers libres está ENCENDIDO; apagado = la cadena está abierta.`,
 `Abre el bornero del pupitre <b>P-X92.1</b>. Puente corto con pinzas o cable de prueba, <b>una prueba cada vez</b> y quitándolo antes de la siguiente.`,
 `<b>Prueba A · puente ${e_(a)} ↔ ${e_(m)}</b> (anula <b>${G.b[0].id}</b>, ${e_(G.b[0].n)}). Si el LED se enciende → <b>falla ${G.b[0].id}</b> o su cable ${G.b[0].cab} (hilos ${G.b[0].ha} / ${G.b[0].hb}).`,
 `<b>Prueba B · puente ${e_(m)} ↔ ${e_(c)}</b> (anula <b>${G.b[1].id}</b>, ${e_(G.b[1].n)}). Si el LED se enciende → <b>falla ${G.b[1].id}</b> o su cable ${G.b[1].cab} (hilos ${G.b[1].ha} / ${G.b[1].hb}).`,
 `<b>Prueba C · puente ${e_(a)} ↔ ${e_(c)}</b> (anula los dos del grupo). Si solo se enciende con C → están abiertos los dos o el cableado entre ellos. Si tampoco se enciende con C → el fallo está entre el bornero y el PLC: manguera ${e_(D.man)} conductores ${G.x[0]} / ${G.x[1]}, regletero ${e_(D.arm)}:${G.x[0]} / :${G.x[1]} o el módulo E-A10.`,
 `Sin puentes, medida de confirmación: polímetro V⎓, negra en <b>+P-X92:2</b> (0 V). El pulso de test sale del UT por <b>${e_(c)}</b> (≈24 V pulsado) → ${G.b[1].id} → <b>${e_(m)}</b> → ${G.b[0].id} → <b>${e_(a)}</b> → entrada del PLC. Donde desaparece la tensión está el bumper abierto.`,
 `Reparar o sustituir el bumper que falla (golpe, conector, cable ${G.b[0].cab}/${G.b[1].cab}). <b>Quitar el puente</b>, comprobar el LED encendido y probar que al pisar cada bumper la PAS se para.`]}
/* croquis SVG de los dos grupos con bornas, cables y puente de la prueba elegida */
let prueba={brazo:"A",cabina:"A"};
function croquis(D,grupos){
 const W=360,H=grupos.length*210+40;let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Croquis de bumpers y bornero del pupitre" style="max-width:520px;display:block;margin:4px auto">`;
 s+=`<text x="8" y="16" class="bk-t">ARMARIO E · ${e_(D.arm)} · E-A10</text><text x="146" y="16" class="bk-t">PUPITRE · bornero P-X92.1</text><text x="268" y="16" class="bk-t">CAMPO</text>`;
 grupos.forEach((k,gi)=>{const G=D.g[k],y0=34+gi*210,P=prueba[k];
  const yT=[y0+30,y0+95,y0+160],xB=178,xF=290,xA=40;
  s+=`<text x="8" y="${y0+6}" class="bk-g">${e_(G.nom)}</text>`;
  /* PLC */
  s+=`<rect x="${xA-28}" y="${yT[0]-12}" width="56" height="${yT[2]-yT[0]+24}" rx="5" class="bk-plc"/><text x="${xA}" y="${(yT[0]+yT[2])/2+3}" text-anchor="middle" class="bk-b">E-A10</text>`;
  s+=`<text x="${xA}" y="${yT[0]+4}" text-anchor="middle" class="bk-b">IN ${G.in}</text><text x="${xA}" y="${yT[2]+4}" text-anchor="middle" class="bk-b">UT ${G.ut}</text>`;
  /* manguera EP-W4 */
  s+=`<line x1="${xA+28}" y1="${yT[0]}" x2="${xB-14}" y2="${yT[0]}" class="bk-w"/><line x1="${xA+28}" y1="${yT[2]}" x2="${xB-14}" y2="${yT[2]}" class="bk-w"/>`;
  s+=`<text x="${(xA+xB)/2}" y="${yT[0]-4}" text-anchor="middle" class="bk-s">hilo ${G.hIn} · ${e_(D.man.split(" ")[0])} c${G.x[0]}</text><text x="${(xA+xB)/2}" y="${yT[2]-4}" text-anchor="middle" class="bk-s">hilo ${G.hUt} · ${e_(D.man.split(" ")[0])} c${G.x[1]}</text>`;
  /* bornero */
  s+=`<rect x="${xB-14}" y="${yT[0]-14}" width="28" height="${yT[2]-yT[0]+28}" rx="3" class="bk-reg"/>`;
  G.t.forEach((t,i)=>{s+=`<circle cx="${xB}" cy="${yT[i]}" r="7" class="bk-bn"/><text x="${xB}" y="${yT[i]+3.5}" text-anchor="middle" class="bk-bt">${e_(t.split(":")[1])}</text>`;
   if(i===1&&/X51/.test(t))s+=`<text x="${xB}" y="${yT[i]+20}" text-anchor="middle" class="bk-s">P-X51</text>`});
  /* bumpers */
  G.b.forEach((b,i)=>{const ya=yT[i],yb=yT[i+1],ym=(ya+yb)/2;
   s+=`<path d="M${xB+7} ${ya} H${xF-16} V${ym-12}" class="bk-w"/><path d="M${xB+7} ${yb} H${xF-16} V${ym+12}" class="bk-w"/>`;
   s+=`<rect x="${xF-30}" y="${ym-12}" width="28" height="24" rx="4" class="bk-bum"/><text x="${xF-16}" y="${ym+4}" text-anchor="middle" class="bk-bb">${i+1}</text>`;
   s+=`<text x="${xF+2}" y="${ym-3}" class="bk-g2">${b.id}</text><text x="${xF+2}" y="${ym+9}" class="bk-s">${e_(b.n.split(" · ")[0])}</text>`;
   s+=`<text x="${xB+12}" y="${ya-4}" class="bk-s">${b.cab} · ${b.ha}</text><text x="${xB+12}" y="${yb+12}" class="bk-s">${b.cab} · ${b.hb}</text>`});
  /* puente de la prueba */
  const [i1,i2]=P==="A"?[0,1]:P==="B"?[1,2]:[0,2];const ya=yT[i1],yb=yT[i2];
  s+=`<path d="M${xB-8} ${ya} C ${xB-58} ${ya+8}, ${xB-58} ${yb-8}, ${xB-8} ${yb}" class="bk-pte"/><circle cx="${xB-8}" cy="${ya}" r="3.5" class="bk-pc"/><circle cx="${xB-8}" cy="${yb}" r="3.5" class="bk-pc"/>`;
  s+=`<text x="${xB-62}" y="${(ya+yb)/2+4}" text-anchor="end" class="bk-pt">PUENTE ${P}</text>`;
 });
 return s+`</svg>`}
function botones(D,grupos){return grupos.map(k=>{const G=D.g[k];return `<div class="bk-btn"><b>${k==="brazo"?"Brazo":"Cabina"}:</b> ${["A","B","C"].map(p=>`<button type="button" class="${prueba[k]===p?"on":""}" data-bkg="${k}" data-bkp="${p}">${p} · ${p==="A"?G.b[0].id:p==="B"?G.b[1].id:"los dos"}</button>`).join("")}</div>`}).join("")}
function caja(pos,grupos,titulo){const D=varPos(pos);const id="bk"+Math.random().toString(36).slice(2,8);
 return `<div class="bk-box" id="${id}" data-bkpos="${e_(pos||"")}" data-bkgr="${grupos.join(",")}">
  <div class="bk-h">${titulo||"Bumpers · puente en el bornero del pupitre (no en el PLC)"}</div>
  <div class="bk-n">El puente en el PLC (IN–UT de E-A10) anula toda la cadena y no dice qué bumper falla. Puenteando en el bornero <b>P-X92.1</b> del pupitre se prueba bumper a bumper. Plano ${D.f===116?"507 folio 116":"folio 92"}.</div>
  <div class="bk-svg">${croquis(D,grupos)}</div>${botones(D,grupos)}
  ${grupos.map(k=>{const G=D.g[k];return `<div class="bk-gr"><div class="bk-gt">${e_(G.nom)} · ${e_(G.led)}</div><ol>${pasos(G,D).map(x=>`<li>${x}</li>`).join("")}</ol></div>`}).join("")}
  <div class="bk-n">⚠️ El puente es solo para localizar el fallo con la PAS parada o en maniobra controlada y vigilada. Nunca dejar un bumper puenteado.</div></div>`}
window.bumperCaja=caja;
document.addEventListener("click",ev=>{const b=ev.target.closest("[data-bkp]");if(!b)return;const box=b.closest(".bk-box");if(!box)return;
 prueba[b.dataset.bkg]=b.dataset.bkp;const D=varPos(box.dataset.bkpos),gr=box.dataset.bkgr.split(",");
 box.querySelector(".bk-svg").innerHTML=croquis(D,gr);box.querySelectorAll(".bk-btn").forEach((x,i)=>{x.outerHTML=botones(D,[gr[i]])})});

/* ---------- 1. Análisis de OT: «bumper» sin precisar = los dos grupos ---------- */
try{const d=SEN_DEF.find(x=>String(x.re).includes("bumper"));if(d){d.sub[0][0]=/brazo|autonivel/;d.sub[0][2]=1;d.sub[1][0]=/cabina|lateral|izq/;d.sub[1][2]=1}}catch(e){}
const grupoDe=it=>it&&it[0]==="E-A10"?(it[1]==="1.1"?"brazo":it[1]==="2.1"?"cabina":null):null;
/* ---------- 2. Primera actuación: puente en el bornero del pupitre con croquis ---------- */
if(typeof segPuente=="function"){const o=segPuente;window.segPuente=segPuente=function(it){const g=grupoDe(it);if(!g)return o.apply(this,arguments);
  const i=ot();return caja(i&&i.pos,[g],`${g==="brazo"?"Bumper del brazo":"Bumper de cabina"} · puente en el bornero del pupitre P-X92.1`)}}
if(typeof segHTML=="function"){const o=segHTML;window.segHTML=segHTML=function(i,S){let h=o.apply(this,arguments);try{if(S&&S.sen&&S.sen.some(grupoDe)){
  h=h.replace(/Elemento de seguridad · puente provisional en el PLC/,"Bumpers · puente en el bornero del pupitre P-X92.1 (no en el PLC)")
   .replace(/2\. Si con el bypass no deja maniobrar: <b>puentes provisionales con hilo<\/b> en el módulo del PLC del elemento afectado \(abajo\)\./,"2. Si con el bypass no deja maniobrar: <b>puente con hilo en el bornero del pupitre P-X92.1</b>, bumper a bumper (abajo), para saber cuál de los cuatro falla.")}}catch(e){}return h}}
if(typeof anaHTML=="function"){const o=anaHTML;window.anaHTML=anaHTML=function(i,R,d){let h=o.apply(this,arguments);try{const S=segOT(i);
  if(S&&S.sen&&S.sen.some(grupoDe))h=h.replace(/puente provisional en el PLC/,"puente en el bornero del pupitre P-X92.1, bumper a bumper")}catch(e){}return h}}
/* ---------- 3. Guía de campo: caso propio con el croquis ---------- */
/* v334: se AÑADE al final (antes se insertaba en medio y desplazaba los índices que otros módulos ya habían guardado:
   hidráulica, PBB 507, SAI, radar de ala, carro de aire). En pantalla sigue agrupada con «Zapata / bordes / bumpers». */
try{const L=GUIA.tipos.PAS.s;if(!L.some(x=>x.t=="Bumpers brazo y cabina · 4 bumpers"))
 L.push({t:"Bumpers brazo y cabina · 4 bumpers",g:[92,92,92,92,92,92,70],p:[
  "Son 2 grupos de 2 bumpers en serie: BRAZO AUTONIVELADOR C-B27 + C-B28 → E-A10 LED 1 (1.1 / 1.2) · LATERAL IZQUIERDO DE CABINA C-B29 + C-B30 → E-A10 LED 2 (2.1 / 2.2). LED encendido = bumpers libres.",
  "Brazo en el bornero del pupitre P-X92.1: 13 (UT, hilo 669) → CP-W61 → C-B28 → CP-W61 → 28 (hilo 672) → CP-W60 → C-B27 → CP-W60 → 12 (IN, hilo 668). 507: borna intermedia P-X51:25, hilos 620 / 623 / 619.",
  "Cabina en el bornero del pupitre P-X92.1: 15 (UT, hilo 671) → CP-W63 → C-B29 → CP-W63 → 29 (hilo 673) → CP-W62 → C-B30 → CP-W62 → 14 (IN, hilo 670). 507: borna intermedia P-X51:26, hilos 622 / 624 / 621.",
  "Prueba A: puente 12–28 (brazo) o 14–29 (cabina) → si el LED se enciende falla C-B27 (brazo) / C-B30 (cabina).",
  "Prueba B: puente 28–13 (brazo) o 29–15 (cabina) → si el LED se enciende falla C-B28 (brazo) / C-B29 (cabina).",
  "Prueba C: puente 12–13 o 14–15 → anula el grupo. Si no se enciende ni así: manguera EP-W4 (conductores 12-13 / 14-15), regletero E-X68.1 o módulo E-A10.",
  "Quitar siempre el puente, reparar el bumper y comprobar que al pisarlo la PAS se para (E-A10 LED se apaga)."],r:"pág. 70, 92 (507: 93, 116)"});
}catch(e){}
function inyecta(){document.querySelectorAll("details").forEach(d=>{const s=d.querySelector(":scope>summary");if(!s||d.dataset.bkok||!/Bumpers brazo y cabina/.test(s.textContent))return;
 d.dataset.bkok="1";const i=ot();const w=document.createElement("div");w.innerHTML=caja(i&&i.pos,["brazo","cabina"],"Croquis · bumpers de brazo y cabina en el bornero del pupitre");s.insertAdjacentElement("afterend",w.firstElementChild)})}
new MutationObserver(()=>inyecta()).observe(document.documentElement,{childList:true,subtree:true});
/* ---------- estilos ---------- */
const st=document.createElement("style");st.textContent=`
.bk-box{border:2px solid #f0a020;border-radius:10px;padding:8px;margin:8px 0;background:color-mix(in srgb,#f0a020 7%,var(--card,transparent))}
.bk-h{font-weight:800;color:#f0a020;font-size:13.5px;margin-bottom:4px}.bk-n{font-size:12.5px;margin:4px 0;line-height:1.35}
.bk-svg{background:var(--bg,#fff);border:1px solid var(--bd,#ccc);border-radius:8px;padding:2px;margin:6px 0}
.bk-btn{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin:4px 0;font-size:12.5px}
.bk-btn button{width:auto;margin:0;padding:5px 9px;font-size:12px;border-radius:7px;border:1px solid var(--bd,#999);background:var(--card,#fff);color:var(--tx,#111)}
.bk-btn button.on{background:#f0a020;border-color:#f0a020;color:#111;font-weight:800}
.bk-gr{margin-top:6px}.bk-gt{font-weight:800;font-size:12.5px}.bk-gr ol{margin:3px 0 0;padding-left:18px;font-size:12.5px;line-height:1.35;display:flex;flex-direction:column;gap:3px}
.bk-gr li::marker{color:#f0a020;font-weight:800}
.bk-t{font:700 8.5px sans-serif;fill:var(--mu,#666);letter-spacing:.04em}.bk-g{font:800 10px sans-serif;fill:var(--tx,#111)}.bk-g2{font:800 9.5px sans-serif;fill:var(--tx,#111)}
.bk-s{font:600 7.5px sans-serif;fill:var(--mu,#555)}.bk-b{font:800 8.5px sans-serif;fill:#fff}.bk-bt{font:800 8px sans-serif;fill:var(--tx,#111)}.bk-bb{font:800 11px sans-serif;fill:#111}
.bk-plc{fill:#2e7d32;stroke:#1b5e20}.bk-reg{fill:color-mix(in srgb,#1565c0 15%,transparent);stroke:#1565c0}.bk-bn{fill:var(--card,#fff);stroke:#1565c0;stroke-width:1.5}
.bk-w{fill:none;stroke:var(--tx,#222);stroke-width:1.3}.bk-bum{fill:#f0c040;stroke:#a07000}
.bk-pte{fill:none;stroke:#e53935;stroke-width:3;stroke-dasharray:5 3;animation:bkp 1s linear infinite}.bk-pc{fill:#e53935}.bk-pt{font:900 9px sans-serif;fill:#e53935}
@keyframes bkp{to{stroke-dashoffset:-16}}@media (prefers-reduced-motion:reduce){.bk-pte{animation:none}}`;document.head.appendChild(st);
})();
