/* ===== v436: caja propia «Bordes de seguridad de ruedas (T-B5 / T-B6) activados» en la guía de campo (PAS)
   Antes, con «borde de ruedas», la lupa y el bloque 2 del SOS daban «Límite de traslación / final de giro de ruedas» solo por la
   palabra «ruedas». Ahora hay una caja con los elementos reales del aviso: bordes T-B5 (delantero) y T-B6 (trasero) en serie por
   T-CON10, relé GELBAU E-U5 y entrada safety E-A8 2.1 (folios 41 y 68). ===== */
(function(){
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const S=GUIA.tipos.PAS.s;if(S.some(x=>/^Bordes de seguridad de ruedas/.test(x.t)))return;
S.push({t:"Bordes de seguridad de ruedas (T-B5 / T-B6) activados",ef:1,g:[41,68],p:[
 "QUÉ HAY: bordes sensibles del carro de ruedas T-B5 (delantero) y T-B6 (trasero) en serie por el conector T-CON10 (mangueras T1-W1 / T1-W2) → manguera H-W18 → borna H-X51:21-22 (elevación) → manguera EH-W1 → borna E-X55:21-22 (armario E) → relé GELBAU E-U5 (Z1 / Z2) → entrada safety E-A8 2.1 (IN02S, salida de test 2.2 UT2).",
 "PRIORIDAD 1 · Mirar el carro de ruedas: algo apoyado o enganchado en un borde (calzo, manguera, objeto, borde aplastado o despegado). Retirarlo y rearmar.",
 "PRIORIDAD 2 · Relé GELBAU E-U5 452.46 (armario E), LED: STRIP ACTIVATED = borde pisado o aplastado · CIRCUIT FAULT = cable o borde cortado · OUTPUT ACTIVATED = circuito correcto.",
 "PRUEBA SIN HERRAMIENTAS · con OUTPUT ACTIVATED encendido en E-U5, pisar el borde DELANTERO T-B5 en varios puntos: debe encenderse STRIP ACTIVATED y apagarse al soltar. Repetir con el TRASERO T-B6. El que no responde, o deja STRIP ACTIVATED / CIRCUIT FAULT encendido sin pisarlo, es el averiado.",
 "MEDIDA BORDE A BORDE · PBB parada, selector en MANUAL. Abrir el conector T-CON10 del carro de ruedas y separar las dos mangueras (identificarlas siguiéndolas: T1-W1 = DELANTERO T-B5 · T1-W2 = TRASERO T-B6; unidos entre sí por el hilo 239).",
 "Polímetro en Ω entre los dos hilos de cada borde: anotar el valor en REPOSO y PISANDO. BUENO: valor estable en reposo que cambia al pisar y vuelve al soltar. AVERIADO: abierto (OL), en corto fijo o muy distinto del otro. Mover el cable mientras se mide: si el valor salta, cable roto por el giro de ruedas.",
 "Si los dos bordes miden bien → la avería está aguas arriba: conector T-CON10 (agua, pines), manguera H-W18, bornas H-X51:21-22 o E-X55:21-22.",
 "MEDIDA POR TRAMOS (sin ir al carro): PBB parada, MANUAL y Z1 / Z2 sueltos del E-U5. En Ω: 1) E-X55:21-22 (armario E) = bucle entero (EH-W1 + H-W18 + los dos bordes). 2) H-X51:21-22 (caja de elevación) = sin EH-W1. Bien en H-X51 y mal en E-X55 → manguera EH-W1. 3) T-CON10, borde a borde. Bordes bien y mal en H-X51 → manguera H-W18 o el conector.",
 "Borneros intermedios entre el PLC y los bordes (rev. J, folio 41): E-A8 2.1 / 2.2 ← hilos 260 / 622 ← E-U5 13-14 · E-U5 Z1 / Z2 → E-X55:21-22 (armario E) → EH-W1 (24×1,5) → H-X51:21-22 (caja de elevación) → H-W18 (3×1,5, BN / BK) → T-CON10 (pines 1 · 3 · 2; 239 une los bordes; pinout por confirmar) → T1-W1 / T1-W2.",
 "ANULAR SOLO EL QUE FALLA (provisional) · En el T-CON10, en lugar del borde averiado poner lo mismo que mide el BUENO en reposo: ≈0 Ω → PUENTE de hilo entre los dos hilos del averiado · resistencia (típico 8,2 kΩ, ver etiqueta del borde o del relé) → RESISTENCIA del mismo valor. Rearmar E-U5 y la PBB: OUTPUT ACTIVATED encendido y alarma 010 borrada.",
 "Sin polímetro: puente en lugar del DELANTERO → si la alarma se va, es el delantero; si no, quitarlo y probar en lugar del TRASERO.",
 "Comprobar que el borde que queda sigue parando la PBB al pisarlo. Compañero vigilando el lado anulado en cada traslación, aviso a CGA, anotarlo en la OT, etiqueta en el T-CON10 y quitarlo al cambiar el borde. Nunca anular los dos: si fallan ambos, solo el puente E-A8 2.1-2.2 para sacar la PBB.",
 "PBB 507 (folio 62): T-B61 delantero y T-B51 trasero con relé Gelbau E1-U8 (LED rojo = pisado · amarillo = fallo de circuito, conectores T-GER1/2/3 · verde = salida activa). Mismo método.",
 "Conector T-CON10 y mangueras T1-W1 / T1-W2 / H-W18: agua, pines sueltos o cable pellizcado por el giro de las ruedas.",
 "LED E-A8 2.1 en reposo: ENCENDIDO. Apagado con E-U5 correcto → hilos 260 / 622 entre E-U5 (13-14) y E-A8 2.1-2.2 (folio 68).",
 "Para sacar en servicio: puente provisional en E-A8 2.1-2.2 (croquis en el bloque 1), con el borde comprobado a la vista y el compañero vigilando. Anotarlo en la OT y quitarlo al reparar."],
 r:"Folios 41 (bordes y E-U5) y 68 (E-A8 DIS02)",cro:1});
})();

/* ===== v869: croquis del T-CON10 en la caja de bordes de ruedas: cómo están en serie y cómo anular SOLO el que falla ===== */
(function(){
const SVG=`<svg viewBox="0 0 360 330" class="brsvg" role="img" aria-label="Croquis de los bordes de ruedas en serie por el T-CON10 y anulación del averiado">
<style>.brsvg text{font:600 10px Menlo,Consolas,monospace;fill:var(--tx,#111)}.brsvg .m{fill:var(--mu,#666);font-weight:400}.brsvg .w{fill:none;stroke:#d11a10;stroke-width:2.2}.brsvg .j{fill:none;stroke:#1565c0;stroke-width:2.4}.brsvg .bx{fill:var(--card,#fff);stroke:var(--tx,#111);stroke-width:1.3}.brsvg .ed{fill:#f2b705;stroke:#7a5a00;stroke-width:1.3}.brsvg .ok{fill:#2e7d32}</style>
<rect class="bx" x="6" y="8" width="150" height="58" rx="6"/><text x="14" y="25">E-U5 Gelbau 452.46</text><text x="14" y="40" class="m">armario E</text><text x="14" y="56" class="m">13-14 → E-A8 2.1/2.2</text>
<rect class="bx" x="190" y="8" width="104" height="44" rx="6"/><text x="198" y="26">E-X55:21-22</text><text x="198" y="42" class="m">armario E</text><text x="238" y="62" class="m">EH-W1</text><rect class="bx" x="236" y="66" width="118" height="30" rx="6"/><text x="244" y="85">H-X51:21-22</text>
<path class="w" d="M156 24H190M156 38H190"/><path class="w" d="M294 22H316V66M294 38H304V66"/><path class="w" d="M316 96V112M304 96V112"/><text x="252" y="108" class="m">H-W18</text>
<rect class="bx" x="230" y="112" width="124" height="44" rx="6"/><text x="240" y="129">T-CON10</text><text x="240" y="143" class="m">pines 1 · 3 · 2</text>
<path class="j" d="M272 150H314"/><text x="40" y="180" class="m" style="fill:#1565c0">hilo 239: T-B5 ↔ T-B6 (en serie)</text>
<path class="w" d="M244 156V196H190M272 156V184H196V196"/>
<rect class="ed" x="40" y="190" width="150" height="24" rx="5"/><text x="50" y="206">T-B5 DELANTERO</text><text x="200" y="210" class="m">T1-W1</text>
<path class="w" d="M314 156V244H190M340 156V256H196V244"/>
<rect class="ed" x="40" y="236" width="150" height="24" rx="5"/><text x="50" y="252">T-B6 TRASERO</text><text x="200" y="272" class="m">T1-W2</text>
<text x="6" y="292">Anular SOLO el averiado, en el T-CON10:</text>
<rect class="ok" x="6" y="300" width="10" height="10" rx="2"/><text x="20" y="309" class="m">bueno ≈0 Ω → PUENTE en su lugar</text>
<rect class="ok" x="6" y="316" width="10" height="10" rx="2"/><text x="20" y="325" class="m">bueno = R (8,2 kΩ típ.) → RESISTENCIA igual</text>
</svg>`;
const T="Bordes de seguridad de ruedas (T-B5 / T-B6)";
const pon=()=>{document.querySelectorAll("details").forEach(d=>{const s=d.querySelector("summary");if(!s||!s.textContent.includes(T)||d.querySelector(".brcro"))return;
 d.insertAdjacentHTML("beforeend",`<div class="brcro"><div class="brcrh">🔌 Croquis · bordes en serie por el T-CON10 (folio 41)</div>${SVG}</div>`)})};
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`.brcro{margin:10px 0 4px;padding:8px;border:1.5px solid #f2b705;border-radius:10px;background:color-mix(in srgb,#f2b705 7%,transparent)}.brcrh{font-weight:800;font-size:13px;margin-bottom:6px}.brcro svg{width:100%;height:auto;display:block}`;document.head.appendChild(st);
})();
