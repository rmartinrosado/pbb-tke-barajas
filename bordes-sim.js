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
const ST={b5:"ok",b6:"ok",eh:"ok",hw:"ok",ce:"ok",tc:"ok",oculto:false,med:null};
const NOM={b5:"T-B5 DELANTERO",b6:"T-B6 TRASERO",eh:"manguera EH-W1",hw:"manguera H-W18",ce:"conector CON-ELEV",tc:"conector T-CON10",x55:"E-X55:21-22 (armario E)",x51:"H-X51:21-22 (caja elevación)",xce:"CON-ELEV abierto, lado bordes",xb5:"delantero solo (puente en T-CON10)",xb6:"trasero solo (T-CON10, lado trasero)"};
/* v874: anillo abierto en el carro: H-W18 → CON-ELEV ♂/♀ → T-B5 DELANTERO → T-CON10 ♂/♀ → T-B6 TRASERO (el retorno del trasero vuelve por el delantero).
   4 conectores. Medida por tramos: E-X55 → H-X51 → CON-ELEV → trasero solo (T-CON10) / delantero solo (puente en T-CON10). */
const est=()=>{const v=[ST.b5,ST.b6,ST.eh,ST.hw,ST.ce,ST.tc];if(v.includes("cortado"))return"fault";if(v.includes("pisado"))return"strip";return"ok"};
const tramo=L=>{const v=L.map(k=>ST[k]);if(v.includes("cortado"))return"OL · abierto ✗ (avería en este tramo)";if(v.includes("pisado"))return"valor de borde pisado ✗";return"R del bucle · estable ✓ (tramo bueno)"};
const lectura=k=>{if(k=="x55")return tramo(["eh","hw","ce","b5","tc","b6"]);if(k=="x51")return tramo(["hw","ce","b5","tc","b6"]);if(k=="xce")return tramo(["b5","tc","b6"]);
 const e=k=="xb5"?"b5":k=="xb6"?"b6":k;const s=ST[e];return s=="ok"?"R reposo · estable ✓":s=="pisado"?"cambia al pisar (fijo) ✗":s=="cortado"?"OL · abierto ✗":"= valor del bueno (anulado)"};
function svg(){const e=est(),fl=e=="ok";const cls=fl?"bsflow":"bsstop";
 const cut=k=>ST[k]=="cortado"&&!ST.oculto;const w=k=>`bsw ${cut(k)?"bsstop bscut":cls}`;
 const ec=k=>{const s=ST.oculto&&ST[k]!="anulado"?"ok":ST[k];return s=="pisado"?"#e53935":s=="cortado"?"#8d6e00":s=="anulado"?"#1565c0":"#f2b705"};
 const dash=k=>(!ST.oculto&&ST[k]=="cortado")?' stroke-dasharray="10 8"':"";
 const cn=(k,x,y,lab,sub,ax)=>`<g><rect x="${x}" y="${y}" width="16" height="13" rx="2" fill="${cut(k)?"#f2b705":"#607d8b"}" stroke="#111"/><rect x="${x+17}" y="${y}" width="16" height="13" rx="2" fill="${cut(k)?"#f2b705":"#90a4ae"}" stroke="#111"/>
  <text x="${ax}" y="${y+10}" font-weight="800">${lab}</text><text x="${ax}" y="${y+22}" class="bsm">${sub}</text></g>`;
 const pr=(x,y,k)=>ST.med==k?`<path d="M${x-8} ${y}l-8 16M${x+8} ${y}l8 16" stroke="#f2b705" stroke-width="2.5"/>`:"";
 const pis=(k,x,y)=>(!ST.oculto&&ST[k]=="pisado")||(ST.oculto&&ST[k]=="pisado"&&ST.__flash==k)?`<path d="M${x} ${y-16}v12m-6-6l6 6l6-6" stroke="#e53935" stroke-width="3" fill="none"/>`:"";
 return `<svg viewBox="0 0 360 440" class="bssvg" role="img" aria-label="Simulación de los bordes de ruedas en anillo abierto">
 <rect x="6" y="6" width="150" height="74" rx="8" class="bsbx"/><text x="14" y="22" font-weight="800">E-U5 Gelbau</text>
 <circle cx="20" cy="38" r="5" fill="${e=="strip"?"#e53935":"#444"}" class="${e=="strip"?"bsblink":""}"/><text x="30" y="42" class="bsm">STRIP ACTIVATED</text>
 <circle cx="20" cy="54" r="5" fill="${e=="fault"?"#f2b705":"#444"}" class="${e=="fault"?"bsblink":""}"/><text x="30" y="58" class="bsm">CIRCUIT FAULT</text>
 <circle cx="20" cy="70" r="5" fill="${e=="ok"?"#2e7d32":"#444"}"/><text x="30" y="74" class="bsm">OUTPUT ACTIVATED</text>
 <rect x="200" y="6" width="152" height="74" rx="8" class="bsbx"/><text x="208" y="22" font-weight="800">E-A8 2.1 · Magelis</text>
 <circle cx="214" cy="40" r="6" fill="${e=="ok"?"#2e7d32":"#444"}"/><text x="226" y="44" class="bsm">LED E-A8 2.1 ${e=="ok"?"ON":"OFF"}</text>
 <text x="208" y="66" font-weight="800" fill="${e=="ok"?"#2e7d32":"#e53935"}">${e=="ok"?"Sin alarma":"⚠ 010 Bumper traslación"}</text>
 <path d="M156 44H200" class="bsw ${e=="ok"?cls:"bsstop"}"/><text x="160" y="38" class="bsm">260/622</text>
 <path d="M50 80V100M74 80V100" class="bsw ${cls}"/><text x="80" y="94" class="bsm">Z1/Z2</text>
 <rect x="6" y="100" width="104" height="36" rx="7" class="bsbx"/><text x="14" y="115" font-weight="800">E-X55:21-22</text><text x="14" y="129" class="bsm">armario E</text>${pr(58,138,"x55")}
 <path d="M110 112H136M110 124H136" class="${w("eh")}"/><text x="112" y="148" class="bsm">EH-W1</text>
 <rect x="136" y="100" width="118" height="36" rx="7" class="bsbx"/><text x="144" y="115" font-weight="800">H-X51:21-22</text><text x="144" y="129" class="bsm">caja elevación</text>${pr(195,138,"x51")}
 <path d="M254 112H300V150M254 124H290V150" class="${w("hw")}"/><text x="262" y="148" class="bsm">H-W18</text>
 <path d="M300 150V160H108V184M290 150V156H100V184" class="${w("hw")}"/>
 ${cn("ce",88,184,"CON-ELEV","♂/♀ · 1 y 2",6)}${pr(104,198,"xce")}
 <rect x="150" y="268" width="60" height="42" rx="6" fill="#455a64"/><circle cx="160" cy="314" r="7" fill="#111"/><circle cx="200" cy="314" r="7" fill="#111"/><text x="180" y="294" text-anchor="middle">carro</text>
 <path d="M118 212A74 74 0 0 1 250 252" fill="none" stroke="${ec("b5")}" stroke-width="10" stroke-linecap="round"${dash("b5")}/>
 <path d="M118 212A74 74 0 0 1 250 252" class="${w("b5")}" style="stroke-width:2"/>
 <text x="138" y="232" font-weight="800" fill="#f2b705">T-B5 DELANTERO${ST.b5=="anulado"?" · ANULADO":""}</text>${pis("b5",182,214)}
 <path d="M246 256A66 66 0 0 0 126 220" fill="none" stroke="#64b5f6" stroke-width="1.5" stroke-dasharray="4 3"/><text x="146" y="250" class="bsm" fill="#64b5f6">↶ retorno trasero</text>
 ${cn("tc",252,252,"T-CON10","♂/♀ · 3 y 4",290)}${pr(268,266,"xb6")}${ST.med=="xb5"?`<text x="290" y="300" fill="#64b5f6" font-weight="800">PUENTE</text>`:""}
 <path d="M258 272A74 74 0 1 1 109 227" fill="none" stroke="${ec("b6")}" stroke-width="10" stroke-linecap="round"${dash("b6")}/>
 <path d="M258 272A74 74 0 1 1 109 227" class="${w("b6")}" style="stroke-width:2"/>
 <text x="134" y="396" font-weight="800" fill="#f2b705">T-B6 TRASERO${ST.b6=="anulado"?" · ANULADO":""}</text>${pis("b6",180,374)}
 <text x="40" y="232" class="bsm">sin unir</text><path d="M84 229H100" stroke="#b6bcc8" stroke-width="1"/>
 ${ST.med=="xb5"?`<text x="6" y="230" fill="#f2b705" font-weight="800">Ω en CON-ELEV</text>`:""}
 ${ST.med?`<g><rect x="6" y="400" width="348" height="36" rx="8" fill="#111" stroke="#f2b705"/><text x="14" y="415" fill="#f2b705" font-weight="800">🔍 Ω ${NOM[ST.med]}:</text><text x="14" y="429" fill="#f2b705">${lectura(ST.med)}</text></g>`:""}
 </svg>${ST.med?pol():""}`}
function pol(){const k=ST.med,rd=lectura(k),ol=/OL/.test(rd),txt=ol?"OL":/pisado|cambia/.test(rd)?"≠":/anulado/.test(rd)?"= R":"R";
 return `<svg viewBox="0 0 360 200" class="bssvg bspol" role="img" aria-label="Configuración del polímetro">
 <text x="10" y="18" font-weight="800">🔧 Polímetro · cómo ponerlo para esta medida</text>
 <rect x="14" y="28" width="120" height="164" rx="14" fill="#f2b705" stroke="#5a4300" stroke-width="2"/>
 <rect x="26" y="38" width="96" height="34" rx="4" fill="#cfe3c8" stroke="#333"/><text x="74" y="62" text-anchor="middle" style="fill:#111" font-size="17" font-weight="900">${txt}${txt=="R"||txt=="= R"?" Ω":""}</text>
 <circle cx="74" cy="114" r="28" fill="#222" stroke="#111"/>
 <text x="36" y="92" style="fill:#111" font-size="9" font-weight="800">V⎓</text><text x="98" y="92" style="fill:#111" font-size="9" font-weight="800">A</text><text x="104" y="122" style="fill:#c62828" font-size="11" font-weight="900">Ω</text><text x="30" y="122" style="fill:#111" font-size="9">)))</text><text x="34" y="146" style="fill:#111" font-size="9">→|</text>
 <path d="M74 114L98 116" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
 <circle cx="40" cy="170" r="7" fill="#111"/><text x="40" y="186" text-anchor="middle" style="fill:#111" font-size="8" font-weight="800">COM</text>
 <circle cx="74" cy="170" r="7" fill="#c62828"/><text x="74" y="186" text-anchor="middle" style="fill:#111" font-size="8" font-weight="800">VΩ</text>
 <circle cx="108" cy="170" r="7" fill="#666"/><text x="108" y="186" text-anchor="middle" style="fill:#111" font-size="8" font-weight="800">A ✗</text>
 <path d="M40 170C40 198 140 198 146 160" stroke="#111" stroke-width="3" fill="none"/><path d="M74 170C74 194 150 190 160 156" stroke="#c62828" stroke-width="3" fill="none"/>
 <text x="150" y="44" font-weight="800">1. Sin tensión</text><text x="150" y="58" class="bsm">V⎓ primero: ≈0 V · Z1/Z2 sueltos</text>
 <text x="150" y="78" font-weight="800">2. Selector en Ω</text><text x="150" y="92" class="bsm">auto · o 20 kΩ (borde con R)</text><text x="150" y="104" class="bsm">o 200 Ω (borde ≈0 Ω)</text>
 <text x="150" y="124" font-weight="800">3. Negra COM · roja VΩ</text><text x="150" y="138" class="bsm">juntas 0,1-0,5 Ω · sueltas OL</text>
 <text x="176" y="158" font-weight="800">4. En ${k=="x55"?"E-X55:21-22":k=="x51"?"H-X51:21-22":k=="xce"?"CON-ELEV (lado bordes)":k=="xb5"?"CON-ELEV + puente T-CON10":"T-CON10 (lado trasero)"}</text>
 <text x="176" y="172" class="bsm">${k=="xb5"||k=="xb6"?"reposo y pisando · MIN/MAX":"bucle desde ese punto"}</text>
 <text x="176" y="188" class="bsm" style="fill:#ef9a9a">sin zumbador ni diodo</text>
 </svg>`}
/* v871: caja de pruebas RB-1 dibujada en la simulación: intercalada en CON-ELEV y T-CON10, selector por borde BORDE / PUENTE / RESIST.
   (sigue al simulador: al anular un borde su selector pasa a PUENTE / RESIST.; al medir, las puntas van a sus bornas de 4 mm) */
function rb1(){/* v881: RB-1 más pequeña y con todos los rótulos dentro del marco */
 const sel=(k,x)=>{const an=ST[k]=="anulado";const ang=an?40:-40;
  return `<g transform="translate(${x},92)"><circle r="15" fill="#2a2f38" stroke="#8b93a7" stroke-width="1.5"/>
  <path d="M0 0L${(11*Math.sin(ang*Math.PI/180)).toFixed(1)} ${(-11*Math.cos(ang*Math.PI/180)).toFixed(1)}" stroke="${an?"#1565c0":"#2e7d32"}" stroke-width="4" stroke-linecap="round"/>
  <text x="-19" y="3" text-anchor="end" class="bsm" font-size="9">BORDE</text><text x="0" y="-19" text-anchor="middle" class="bsm" font-size="9">PUENTE</text><text x="19" y="3" class="bsm" font-size="9">R</text>
  <text x="0" y="29" text-anchor="middle" font-weight="800">${k=="b5"?"DELANTERO":"TRASERO"}</text>
  <text x="0" y="40" text-anchor="middle" class="bsm" font-size="9" fill="${an?"#64b5f6":"#81c784"}">${an?"ANULADO":"BORDE"}</text>
  <circle cx="-11" cy="52" r="4.5" fill="#d11a10"/><circle cx="11" cy="52" r="4.5" fill="#111" stroke="#888"/><text x="0" y="66" text-anchor="middle" class="bsm" font-size="9">${k=="b5"?"T1-W1":"T1-W2"}</text>
  ${ST.med==k?`<path d="M-11 56l-6 8M11 56l6 8" stroke="#f2b705" stroke-width="2"/><text x="24" y="56" fill="#f2b705" font-weight="800">Ω</text>`:""}</g>`};
 return `<svg viewBox="0 0 300 196" class="bssvg bsrb" role="img" aria-label="Caja de pruebas RB-1">
 <text x="150" y="14" text-anchor="middle" font-weight="800">🧰 RB-1 · en CON-ELEV y T-CON10</text>
 <path d="M0 32H12M288 32H300" stroke="#d11a10" stroke-width="4"/>
 <rect x="12" y="22" width="276" height="150" rx="10" fill="#1f232b" stroke="#f2b705" stroke-width="2"/>
 <text x="20" y="36" class="bsm" font-size="9">CON-ELEV ♂/♀</text><text x="280" y="36" text-anchor="end" class="bsm" font-size="9">T-CON10 ♂/♀</text>
 <rect x="114" y="42" width="72" height="15" rx="3" fill="#111" stroke="#8b93a7"/><text x="150" y="53" text-anchor="middle" class="bsm" font-size="9">R 4k7 + 10k</text>
 ${sel("b5",85)}${sel("b6",215)}
 <text x="150" y="188" text-anchor="middle" class="bsm" font-size="9" fill="#ef9a9a">Trimmer: ajustar DESCONECTADO al valor del bueno</text>
 </svg>`}
function pinta(w){const e=est();
 w.querySelector(".bsvis").innerHTML=svg();{const r=w.querySelector(".bsrbw");if(r)r.innerHTML=rb1()}/* v880: RB-1 al principio del «Accesorio de campo» */
 const msg={ok:"Bucle cerrado: los dos bordes en reposo. El relé E-U5 da salida y E-A8 2.1 está encendida.",
  strip:"Un borde pisado abre la serie: STRIP ACTIVATED, E-A8 2.1 apagada y alarma 010. Con un borde basta para parar la PBB.",
  fault:"Cable o borde cortado: CIRCUIT FAULT. El bucle no cierra aunque el otro borde esté bien."}[e];
 w.querySelector(".bsmsg").textContent=(ST.oculto&&e!="ok"?"Avería oculta: mide cada borde en el T-CON10 para encontrarla. ":"")+msg;
 w.querySelectorAll("[data-a]").forEach(b=>{const [a,k]=b.dataset.a.split(":");if(a=="anula")b.disabled=ST[k]=="anulado"||(k=="b5"?ST.b6:ST.b5)=="anulado";
  /* v881: el botón queda MARCADO mientras su estado está activo y se libera solo cuando cambia */
  const on=a=="pisa"?ST[k]=="pisado"&&(!ST.oculto||ST.__flash==k):a=="corta"?ST[k]=="cortado"&&!ST.oculto:a=="med"?ST.med==k:a=="anula"?ST[k]=="anulado":a=="azar"?ST.oculto:false;
  b.classList.toggle("bson",!!on);b.setAttribute("aria-pressed",on?"true":"false")})}
function accion(w,a,k){
 if(a=="reset"){ST.b5=ST.b6="ok";ST.eh=ST.hw=ST.ce=ST.tc="ok";ST.oculto=false;ST.med=null}
 else if(a=="azar"){ST.b5=ST.b6="ok";ST.eh=ST.hw=ST.ce=ST.tc="ok";ST.med=null;const q=["b5","b6","b5","b6","eh","hw","ce","tc"][Math.floor(Math.random()*8)];ST[q]=/^(b5|b6)$/.test(q)&&Math.random()<.5?"pisado":"cortado";ST.oculto=true}
 else if(a=="pisa"){if(ST.oculto){/* prueba a ciegas: pisar el bueno 1,5 s y soltar; el averiado no cambia nada */
   if(ST[k]=="ok"){ST[k]="pisado";ST.__flash=k;pinta(w);setTimeout(()=>{ST.__flash=null;if(ST[k]=="pisado"){ST[k]="ok";pinta(w)}},1500)}
   else{const m=w.querySelector(".bsmsg");pinta(w);if(m)m.textContent=`Pisas el ${NOM[k]}: los LED del E-U5 no cambian → sospechoso.`}return}
  ST[k]=ST[k]=="pisado"?"ok":"pisado"}
 else if(a=="corta"){ST.oculto=false;ST[k]=ST[k]=="cortado"?"ok":"cortado"}
 else if(a=="med"){ST.med=k}
 else if(a=="anula"){ST[k]="anulado";ST.med=null;
  const ok=est()=="ok";setTimeout(()=>{const m=w.querySelector(".bsmsg");if(m)m.textContent=ok?`✔ ${NOM[k]} anulado (${k=="b6"?"puente / R en la mitad del delantero del T-CON10":"latiguillo CON-ELEV ↔ T-CON10 con puente / R"}): alarma 010 borrada. Comprueba que el otro borde sigue parando la PBB al pisarlo.`:`✘ Has anulado el ${NOM[k]} pero la avería sigue: no está en ese borde (el otro borde, una manguera o un conector). Reinicia y mide por tramos: E-X55 → H-X51 → CON-ELEV → trasero solo / delantero solo.`},20)}
 pinta(w)}
const ACC=`<details class="bsacc"><summary>🧰 Accesorio de campo · caja de pruebas y anulación de bordes</summary>
<div class="bsacct"><div class="bsrbw"></div>
<b>Opción rápida (con lo que hay en la furgoneta)</b>
<ol><li><b>Latiguillo PUENTE</b>: 30 cm de hilo 1,5 mm² con dos punteras o dos bornas WAGO 221 en los extremos.</li>
<li><b>Latiguillo RESISTENCIA</b>: resistencia del valor del borde bueno (≥ 0,5 W, metálica 1 %) dentro de termorretráctil, con dos punteras. Rotulada con su valor.</li>
<li>Etiqueta roja «BORDE ANULADO · PROVISIONAL · OT nº…» con brida para el conector.</li><li><b>Latiguillo de SALTO del delantero</b>: macho de CON-ELEV ↔ hembra de T-CON10, con el puente o la resistencia del delantero en serie. Deja el trasero conectado (un puente en CON-ELEV anularía los dos).</li></ol>
<b>Caja de pruebas RB-1 (para tener en el taller)</b>
<ol><li>Caja estanca IP65 pequeña con 4 mangueras con los conectores iguales a los del carro: ♂ CON-ELEV (a H-W18) · ♀ CON-ELEV (entrada del delantero) · ♂ T-CON10 (salida del delantero) · ♀ T-CON10 (trasero). Se intercala en los dos conectores del anillo sin cortar nada.</li>
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
 w.innerHTML=`<div class="bsh">🎬 Simulación · bordes en anillo abierto y comprobación en campo</div>
 <div class="bsvis"></div><div class="bsmsg"></div>
 <div class="bsrow"><b>Pisar</b><button type="button" data-a="pisa:b5">Delantero</button><button type="button" data-a="pisa:b6">Trasero</button></div>
 <div class="bsrow"><b>Cortar</b><button type="button" data-a="corta:b5">Delantero</button><button type="button" data-a="corta:b6">Trasero</button></div>
 <div class="bsrow"><b>Cortar</b><button type="button" data-a="corta:eh">EH-W1</button><button type="button" data-a="corta:hw">H-W18</button></div>
 <div class="bsrow"><b>Fallo</b><button type="button" data-a="corta:ce">CON-ELEV</button><button type="button" data-a="corta:tc">T-CON10</button></div>
 <div class="bsrow"><b>Tramo</b><button type="button" data-a="med:x55">E-X55</button><button type="button" data-a="med:x51">H-X51</button><button type="button" data-a="med:xce">CON-ELEV</button></div>
 <div class="bsrow"><b>Medir</b><button type="button" data-a="med:xb5">Delantero solo</button><button type="button" data-a="med:xb6">Trasero solo</button></div>
 <div class="bsrow"><b>Anular</b><button type="button" data-a="anula:b5">Delantero</button><button type="button" data-a="anula:b6">Trasero</button></div>
 <div class="bsrow bsrow2"><button type="button" class="bsaz" data-a="azar">🎲 Avería al azar</button><button type="button" data-a="reset">↺ Reiniciar</button></div>
 <div class="bspasos"><b>Prueba en campo para saber cuál es</b><ol>
 <li>LED de E-U5: STRIP ACTIVATED = pisado · CIRCUIT FAULT = cortado.</li>
 <li>Mirar y pisar cada borde a lo largo: el bueno enciende y apaga STRIP ACTIVATED; el averiado no responde o lo deja fijo.</li>
 <li>Medida por tramos (PBB parada, MANUAL, Z1/Z2 sueltos del E-U5), en Ω: <b>E-X55:21-22</b> (todo) → <b>H-X51:21-22</b> (sin EH-W1) → <b>CON-ELEV</b> abierto, lado bordes (los dos bordes y T-CON10).</li>
 <li><b>Trasero solo</b>: abrir T-CON10 y medir en la mitad del trasero. <b>Delantero solo</b>: puente en la mitad del delantero del T-CON10 y medir en CON-ELEV. Sin ese puente el delantero da OL (anillo abierto).</li>
 <li>El que da OL, un valor fijo al pisar o muy distinto del otro es el averiado.</li>
 <li>Anular SOLO ese (puente si el bueno mide ≈0 Ω, o resistencia igual al bueno): TRASERO en el T-CON10 (mitad del delantero) · DELANTERO con latiguillo CON-ELEV ↔ T-CON10. Rearmar y comprobar que el otro sigue parando la PBB.</li></ol></div>${ACC}`;
 const cro=d.querySelector(".brcro");(cro||d).insertAdjacentElement(cro?"afterend":"beforeend",w);
 w.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;e.preventDefault();e.stopPropagation();const [a,k]=b.dataset.a.split(":");accion(w,a,k)});
 pinta(w)}
const pon=()=>document.querySelectorAll("details").forEach(d=>{const s=d.querySelector("summary");if(s&&s.textContent.includes(T)&&d.querySelector(".brcro"))monta(d)});
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`
.bsim{margin:10px 0 4px;padding:10px;border:1.5px solid #2e7d32;border-radius:12px;background:color-mix(in srgb,#2e7d32 6%,transparent)}
.bsh{font-weight:800;font-size:13px;margin-bottom:6px}
.bssvg{width:100%;height:auto;display:block;background:#15181e;border-radius:10px}.bsrb{max-width:320px;margin:0 auto 10px}.bspol{margin-top:8px}
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
.bsrow button.bson{background:#ef6c00!important;color:#fff!important;border-color:#ef6c00!important;font-weight:800!important;box-shadow:inset 0 2px 4px rgba(0,0,0,.35)!important}
.bspasos{margin-top:8px;font-size:12.5px;line-height:1.4}.bspasos ol{margin:4px 0 0 18px;padding:0}
.bsacc{margin-top:8px;border-top:1px solid var(--bd,#333);padding-top:6px}.bsacc>summary{cursor:pointer;font-weight:800;font-size:13px}
.bsacct{font-size:12.5px;line-height:1.4;margin-top:6px}.bsacct ol,.bsacct ul{margin:4px 0 8px 18px;padding:0}
@media (prefers-reduced-motion:reduce){.bssvg .bsflow,.bssvg .bsblink{animation:none}}`;document.head.appendChild(st);
})();
