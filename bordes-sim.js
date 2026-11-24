/* ===== v870: SIMULADOR de los bordes de ruedas en serie (T-B5 delantero / T-B6 trasero → T-CON10 → E-U5 → E-A8 2.1)
   Dentro de la caja «Bordes de seguridad de ruedas» de la guía de campo:
   · bucle animado: corriente circulando (verde) · borde pisado (rojo) · cable cortado (bucle parado, amarillo).
   · LED del relé Gelbau E-U5 (STRIP ACTIVATED / CIRCUIT FAULT / OUTPUT ACTIVATED), LED E-A8 2.1 y alarma 010 en la Magelis.
   · polímetro en el T-CON10 borde a borde (como se mide en campo) y anulación SOLO del averiado (puente o resistencia = bueno).
   · «Avería al azar»: el técnico no sabe cuál falla y tiene que encontrarlo midiendo (prueba de campo / formación).
   · accesorio de campo: caja de pruebas y anulación de bordes (cómo se hace). ===== */
(function(){
"use strict";
const T="Bordes de seguridad de ruedas (T-B5 / T-B6)";
const ST={b5:"ok",b6:"ok",oculto:false,med:null};
const NOM={b5:"T-B5 DELANTERO",b6:"T-B6 TRASERO"};
const est=()=>{const v=[ST.b5,ST.b6];if(v.includes("cortado"))return"fault";if(v.includes("pisado"))return"strip";return"ok"};
const lectura=k=>{const s=ST[k];return s=="ok"?"R reposo · estable ✓":s=="pisado"?"cambia al pisar (fijo) ✗":s=="cortado"?"OL · abierto ✗":"= valor del bueno (anulado)"};
function svg(){const e=est(),fl=e=="ok";
 const col=k=>ST[k]=="pisado"?"#e53935":ST[k]=="cortado"?"#f2b705":ST[k]=="anulado"?"#1565c0":"#f2b705";
 const ed=(k,y)=>{const s=ST[k],vis=ST.oculto&&s!="anulado"?"ok":s;
  return `<g class="bsed" data-k="${k}"><rect x="40" y="${y}" width="160" height="26" rx="6" fill="${ST.oculto&&s!="anulado"?"#f2b705":col(k)}" stroke="#5a4300" stroke-width="1.3"/>
  <text x="50" y="${y+17}" fill="#111" font-weight="800">${NOM[k]}${s=="anulado"?" · ANULADO":""}</text>
  ${vis=="pisado"?`<path d="M120 ${y-14}l0 12m-6-6l6 6l6-6" stroke="#e53935" stroke-width="3" fill="none"/>`:""}
  ${vis=="cortado"?`<text x="206" y="${y+18}" fill="#f2b705" font-size="16">✂</text>`:""}</g>`};
 const brk5=ST.b5=="cortado"&&!ST.oculto,brk6=ST.b6=="cortado"&&!ST.oculto;
 const cls=fl?"bsflow":"bsstop";
 return `<svg viewBox="0 0 360 300" class="bssvg" role="img" aria-label="Simulación de los bordes de ruedas en serie">
 <rect x="6" y="6" width="150" height="74" rx="8" class="bsbx"/><text x="14" y="22" font-weight="800">E-U5 Gelbau</text>
 <circle cx="20" cy="38" r="5" fill="${e=="strip"?"#e53935":"#444"}" class="${e=="strip"?"bsblink":""}"/><text x="30" y="42" class="bsm">STRIP ACTIVATED</text>
 <circle cx="20" cy="54" r="5" fill="${e=="fault"?"#f2b705":"#444"}" class="${e=="fault"?"bsblink":""}"/><text x="30" y="58" class="bsm">CIRCUIT FAULT</text>
 <circle cx="20" cy="70" r="5" fill="${e=="ok"?"#2e7d32":"#444"}"/><text x="30" y="74" class="bsm">OUTPUT ACTIVATED</text>
 <rect x="200" y="6" width="152" height="74" rx="8" class="bsbx"/><text x="208" y="22" font-weight="800">E-A8 2.1 · Magelis</text>
 <circle cx="214" cy="40" r="6" fill="${e=="ok"?"#2e7d32":"#444"}"/><text x="226" y="44" class="bsm">LED E-A8 2.1 ${e=="ok"?"ON":"OFF"}</text>
 <text x="208" y="66" font-weight="800" fill="${e=="ok"?"#2e7d32":"#e53935"}">${e=="ok"?"Sin alarma":"⚠ 010 Bumper traslación"}</text>
 <path d="M156 44H200" class="bsw ${e=="ok"?cls:"bsstop"}"/>
 <path d="M60 80V104H300V122" class="bsw ${cls}"/><path d="M90 80V96H280V122" class="bsw ${cls}"/>
 <text x="150" y="92" class="bsm">H-W18 · E-X55:21-22</text>
 <rect x="230" y="122" width="124" height="38" rx="7" class="bsbx"/><text x="240" y="139" font-weight="800">T-CON10</text><text x="240" y="153" class="bsm">carro de ruedas</text>
 <path d="M244 160V183H200" class="bsw ${cls}"/>
 <path d="M272 160V172H214V196H200" class="bsw ${brk5?"bsstop bscut":cls}"/>
 <path d="M272 160H314" stroke="#1565c0" stroke-width="2.6"/><text x="236" y="176" class="bsm" fill="#1565c0">239</text>
 <path d="M314 160V229H200" class="bsw ${brk6?"bsstop bscut":cls}"/>
 <path d="M340 160V250H214V242H200" class="bsw ${cls}"/>
 ${ed("b5",170)}${ed("b6",216)}
 ${ST.med?`<g><rect x="6" y="262" width="348" height="32" rx="8" fill="#111" stroke="#f2b705"/><text x="16" y="282" fill="#f2b705" font-weight="800">🔍 Polímetro ${NOM[ST.med]}: ${lectura(ST.med)}</text></g>`:""}
 </svg>`}
/* v871: caja de pruebas RB-1 dibujada en la simulación: intercalada en el T-CON10, selector por borde BORDE / PUENTE / RESIST.
   (sigue al simulador: al anular un borde su selector pasa a PUENTE / RESIST.; al medir, las puntas van a sus bornas de 4 mm) */
function rb1(){const sel=(k,x)=>{const an=ST[k]=="anulado";const ang=an?40:-40;
  return `<g transform="translate(${x},100)"><circle r="17" fill="#2a2f38" stroke="#8b93a7" stroke-width="1.5"/>
  <path d="M0 0L${(13*Math.sin(ang*Math.PI/180)).toFixed(1)} ${(-13*Math.cos(ang*Math.PI/180)).toFixed(1)}" stroke="${an?"#1565c0":"#2e7d32"}" stroke-width="4" stroke-linecap="round"/>
  <text x="-22" y="4" text-anchor="end" class="bsm">BORDE</text><text x="0" y="-22" text-anchor="middle" class="bsm">PUENTE</text><text x="22" y="4" class="bsm">R</text>
  <text x="0" y="34" text-anchor="middle" font-weight="800">${k=="b5"?"DELANTERO":"TRASERO"}</text>
  <text x="0" y="46" text-anchor="middle" class="bsm" fill="${an?"#64b5f6":"#81c784"}">${an?"ANULADO":"BORDE"}</text>
  <circle cx="-14" cy="62" r="5" fill="#d11a10"/><circle cx="14" cy="62" r="5" fill="#111" stroke="#888"/><text x="0" y="82" text-anchor="middle" class="bsm">${k=="b5"?"T1-W1":"T1-W2"}</text>
  ${ST.med==k?`<path d="M-14 67l-14 26M14 67l14 26" stroke="#f2b705" stroke-width="2.5"/><text x="0" y="106" text-anchor="middle" fill="#f2b705" font-weight="800">Ω</text>`:""}</g>`};
 return `<svg viewBox="0 0 360 250" class="bssvg bsrb" role="img" aria-label="Caja de pruebas RB-1">
 <text x="10" y="18" font-weight="800">🧰 CAJA DE PRUEBAS RB-1 · intercalada en el T-CON10</text>
 <rect x="56" y="30" width="248" height="196" rx="12" fill="#1f232b" stroke="#f2b705" stroke-width="2"/>
 <path d="M8 50H56" stroke="#d11a10" stroke-width="4"/><text x="8" y="44" class="bsm">a H-W18</text><text x="8" y="66" class="bsm">(macho)</text>
 <path d="M304 50H352" stroke="#d11a10" stroke-width="4"/><text x="304" y="44" class="bsm">a bordes</text><text x="304" y="66" class="bsm">(hembra)</text>
 ${sel("b5",120)}${sel("b6",240)}
 <rect x="150" y="38" width="60" height="20" rx="4" fill="#111" stroke="#8b93a7"/><text x="180" y="52" text-anchor="middle" class="bsm">R: 4k7+10k</text>
 <text x="180" y="242" text-anchor="middle" class="bsm" fill="#ef9a9a">Trimmer: ajustar DESCONECTADO al valor del bueno</text>
 </svg>`}
function pinta(w){const e=est();
 w.querySelector(".bsvis").innerHTML=svg()+rb1();
 const msg={ok:"Bucle cerrado: los dos bordes en reposo. El relé E-U5 da salida y E-A8 2.1 está encendida.",
  strip:"Un borde pisado abre la serie: STRIP ACTIVATED, E-A8 2.1 apagada y alarma 010. Con un borde basta para parar la PBB.",
  fault:"Cable o borde cortado: CIRCUIT FAULT. El bucle no cierra aunque el otro borde esté bien."}[e];
 w.querySelector(".bsmsg").textContent=(ST.oculto&&e!="ok"?"Avería oculta: mide cada borde en el T-CON10 para encontrarla. ":"")+msg;
 w.querySelectorAll("[data-a]").forEach(b=>{const [a,k]=b.dataset.a.split(":");if(a=="anula")b.disabled=ST[k]=="anulado"||(k=="b5"?ST.b6:ST.b5)=="anulado"})}
function accion(w,a,k){
 if(a=="reset"){ST.b5=ST.b6="ok";ST.oculto=false;ST.med=null}
 else if(a=="azar"){ST.b5=ST.b6="ok";ST.med=null;const q=Math.random()<.5?"b5":"b6";ST[q]=Math.random()<.5?"pisado":"cortado";ST.oculto=true}
 else if(a=="pisa"){if(ST.oculto){/* prueba a ciegas: pisar el bueno 1,5 s y soltar; el averiado no cambia nada */
   if(ST[k]=="ok"){ST[k]="pisado";pinta(w);setTimeout(()=>{if(ST[k]=="pisado"){ST[k]="ok";pinta(w)}},1500)}
   else{const m=w.querySelector(".bsmsg");pinta(w);if(m)m.textContent=`Pisas el ${NOM[k]}: los LED del E-U5 no cambian → sospechoso.`}return}
  ST[k]=ST[k]=="pisado"?"ok":"pisado"}
 else if(a=="corta"){ST.oculto=false;ST[k]=ST[k]=="cortado"?"ok":"cortado"}
 else if(a=="med"){ST.med=k}
 else if(a=="anula"){ST[k]="anulado";ST.med=null;
  const ok=est()=="ok";setTimeout(()=>{const m=w.querySelector(".bsmsg");if(m)m.textContent=ok?`✔ ${NOM[k]} anulado (puente o resistencia = bueno): alarma 010 borrada. Comprueba que el otro borde sigue parando la PBB al pisarlo.`:`✘ Has anulado el ${NOM[k]} pero la avería sigue: era el OTRO borde. Quita la anulación (Reiniciar) y mide de nuevo.`},20)}
 pinta(w)}
const ACC=`<details class="bsacc"><summary>🧰 Accesorio de campo · caja de pruebas y anulación de bordes</summary>
<div class="bsacct">
<b>Opción rápida (con lo que hay en la furgoneta)</b>
<ol><li><b>Latiguillo PUENTE</b>: 30 cm de hilo 1,5 mm² con dos punteras o dos bornas WAGO 221 en los extremos.</li>
<li><b>Latiguillo RESISTENCIA</b>: resistencia del valor del borde bueno (≥ 0,5 W, metálica 1 %) dentro de termorretráctil, con dos punteras. Rotulada con su valor.</li>
<li>Etiqueta roja «BORDE ANULADO · PROVISIONAL · OT nº…» con brida para el T-CON10.</li></ol>
<b>Caja de pruebas RB-1 (para tener en el taller)</b>
<ol><li>Caja estanca IP65 pequeña con dos mangueras: una con el conector igual al T-CON10 hacia el armario (H-W18) y otra con la pareja hacia los bordes. Se intercala en el T-CON10 sin cortar nada.</li>
<li>Por cada borde, un selector de 3 posiciones: <b>BORDE · PUENTE · RESISTENCIA</b>. En «BORDE» pasa directo, así la caja puede quedarse puesta mientras se prueba.</li>
<li>Dos parejas de bornas de 4 mm (una por borde) para medir con el polímetro desde fuera, sin abrir nada.</li>
<li>En «RESISTENCIA»: resistencia fija en serie con un trimmer multivuelta de cermet. Por ejemplo, para 8,2 kΩ: 4,7 kΩ fija + trimmer de 10 kΩ (ajuste de 4,7 a 14,7 kΩ). La fija evita poner 0 Ω por error.</li>
<li>Tapa con la leyenda: «Ajustar el trimmer DESCONECTADO, al valor que marca el borde bueno en reposo».</li></ol>
<b>¿Potenciómetro en vez de resistencia?</b>
<ul><li>Sí, como herramienta de ajuste: se mide el borde bueno en reposo, se ajusta el potenciómetro a ese valor con la caja desconectada y se conecta.</li>
<li>Mejor un trimmer multivuelta de cermet que un potenciómetro de mando: el carro de ruedas vibra y un mando giratorio puede moverse o tocarse.</li>
<li>Una vez ajustado, fijarlo con laca o pintura, o sustituirlo por una resistencia fija del valor más cercano para dejarlo varios días.</li>
<li>La corriente es de pocos mA: no se calienta.</li>
<li>Si el borde bueno mide ≈0 Ω (borde de contacto), no hace falta resistencia: basta el PUENTE.</li></ul>
<b>Para fabricarla hace falta</b>: la referencia del conector T-CON10 (fabricante y número de pines) para comprar el macho y la hembra iguales. Con una foto del conector y su etiqueta se puede preparar la lista de material.
</div></details>`;
function monta(d){if(d.querySelector(".bsim"))return;
 const w=document.createElement("div");w.className="bsim";
 w.innerHTML=`<div class="bsh">🎬 Simulación · bordes en serie y comprobación en campo</div>
 <div class="bsvis"></div><div class="bsmsg"></div>
 <div class="bsrow"><b>Pisar</b><button type="button" data-a="pisa:b5">Delantero</button><button type="button" data-a="pisa:b6">Trasero</button></div>
 <div class="bsrow"><b>Cortar</b><button type="button" data-a="corta:b5">Delantero</button><button type="button" data-a="corta:b6">Trasero</button></div>
 <div class="bsrow"><b>Medir</b><button type="button" data-a="med:b5">T1-W1 delantero</button><button type="button" data-a="med:b6">T1-W2 trasero</button></div>
 <div class="bsrow"><b>Anular</b><button type="button" data-a="anula:b5">Delantero</button><button type="button" data-a="anula:b6">Trasero</button></div>
 <div class="bsrow bsrow2"><button type="button" class="bsaz" data-a="azar">🎲 Avería al azar</button><button type="button" data-a="reset">↺ Reiniciar</button></div>
 <div class="bspasos"><b>Prueba en campo para saber cuál es</b><ol>
 <li>LED de E-U5: STRIP ACTIVATED = pisado · CIRCUIT FAULT = cortado.</li>
 <li>Mirar y pisar cada borde a lo largo: el bueno enciende y apaga STRIP ACTIVATED; el averiado no responde o lo deja fijo.</li>
 <li>PBB parada y en MANUAL: abrir el T-CON10 y medir en Ω cada borde por separado (T1-W1 y T1-W2), en reposo y pisando.</li>
 <li>El que da OL, un valor fijo al pisar o muy distinto del otro es el averiado.</li>
 <li>Anular SOLO ese: puente si el bueno mide ≈0 Ω, o resistencia igual al bueno. Rearmar y comprobar que el otro sigue parando la PBB.</li></ol></div>${ACC}`;
 const cro=d.querySelector(".brcro");(cro||d).insertAdjacentElement(cro?"afterend":"beforeend",w);
 w.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;e.preventDefault();e.stopPropagation();const [a,k]=b.dataset.a.split(":");accion(w,a,k)});
 pinta(w)}
const pon=()=>document.querySelectorAll("details").forEach(d=>{const s=d.querySelector("summary");if(s&&s.textContent.includes(T)&&d.querySelector(".brcro"))monta(d)});
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`
.bsim{margin:10px 0 4px;padding:10px;border:1.5px solid #2e7d32;border-radius:12px;background:color-mix(in srgb,#2e7d32 6%,transparent)}
.bsh{font-weight:800;font-size:13px;margin-bottom:6px}
.bssvg{width:100%;height:auto;display:block;background:#15181e;border-radius:10px}.bsrb{margin-top:8px}
.bssvg text{font:600 10px Menlo,Consolas,monospace;fill:#e9ecf1}.bssvg .bsm{font-weight:400;fill:#b6bcc8}
.bssvg .bsbx{fill:#1f232b;stroke:#3a404c;stroke-width:1.2}
.bssvg .bsw{fill:none;stroke:#2e7d32;stroke-width:3;stroke-dasharray:7 6}
.bssvg .bsflow{animation:bsflow .9s linear infinite}
.bssvg .bsstop{stroke:#6b6b6b}.bssvg .bscut{stroke:#f2b705;stroke-dasharray:3 9}
@keyframes bsflow{to{stroke-dashoffset:-26}}
.bssvg .bsblink{animation:bsbl 1s steps(2) infinite}@keyframes bsbl{50%{opacity:.15}}
.bsmsg{margin:8px 2px;font-size:13px;line-height:1.35;min-height:2.6em}
.bsrow{display:flex;gap:6px;align-items:center;margin:5px 0}.bsrow>b{width:56px;flex:none;font-size:12px}
.bsrow button{flex:1;margin:0!important;padding:9px 4px!important;font-size:12px!important;border-radius:9px!important}
.bsrow2 button{flex:1}.bsrow .bsaz{border:1.5px solid #f2b705!important}
.bspasos{margin-top:8px;font-size:12.5px;line-height:1.4}.bspasos ol{margin:4px 0 0 18px;padding:0}
.bsacc{margin-top:8px;border-top:1px solid var(--bd,#333);padding-top:6px}.bsacc>summary{cursor:pointer;font-weight:800;font-size:13px}
.bsacct{font-size:12.5px;line-height:1.4;margin-top:6px}.bsacct ol,.bsacct ul{margin:4px 0 8px 18px;padding:0}
@media (prefers-reduced-motion:reduce){.bssvg .bsflow,.bssvg .bsblink{animation:none}}`;document.head.appendChild(st);
})();
