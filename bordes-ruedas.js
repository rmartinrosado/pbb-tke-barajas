/* ===== v436: caja propia «Bordes de seguridad de ruedas (T-B5 / T-B6) activados» en la guía de campo (PAS)
   Antes, con «borde de ruedas», la lupa y el bloque 2 del SOS daban «Límite de traslación / final de giro de ruedas» solo por la
   palabra «ruedas». Ahora hay una caja con los elementos reales del aviso: bordes T-B5 (delantero) y T-B6 (trasero) en serie por
   T-CON10, relé GELBAU E-U5 y entrada safety E-A8 2.1 (folios 41 y 68). ===== */
(function(){
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const S=GUIA.tipos.PAS.s;if(S.some(x=>/^Bordes de seguridad de ruedas/.test(x.t)))return;
S.push({t:"Bordes de seguridad de ruedas (T-B5 / T-B6) activados",ef:1,g:[41,68],p:[
 "QUÉ HAY (v874): en el carro de ruedas los dos bordes forman un ANILLO ABIERTO alrededor del carro: T-B5 DELANTERO y T-B6 TRASERO en serie. Hay 4 conectores (2 parejas macho / hembra): CON-ELEV entre la manguera H-W18 de la caja de elevación y el DELANTERO, y T-CON10 entre el DELANTERO y el TRASERO. El trasero solo conecta con el delantero; el delantero lleva también el retorno del trasero hasta la caja de elevación.",
 "RUTA ORIGEN → DESTINO: E-A8 2.1 / 2.2 (hilos 260 / 622) ← E-U5 13-14 · E-U5 Z1 / Z2 → E-X55:21-22 (armario E) → manguera EH-W1 (24×1,5) → H-X51:21-22 (caja bornero de elevación) → manguera H-W18 (3×1,5, BN / BK) → CON-ELEV ♂/♀ → T-B5 DELANTERO (T1-W1) → T-CON10 ♂/♀ → T-B6 TRASERO (T1-W2) → vuelve por el delantero y H-W18 a H-X51:22. Pinout de los conectores por confirmar en campo.",
 "PRIORIDAD 1 · Mirar el carro de ruedas: algo apoyado o enganchado en un borde (calzo, manguera, objeto, borde aplastado o despegado). Retirarlo y rearmar.",
 "PRIORIDAD 2 · Relé GELBAU E-U5 452.46 (armario E), LED: STRIP ACTIVATED = borde pisado o aplastado · CIRCUIT FAULT = cable, conector o borde cortado · OUTPUT ACTIVATED = circuito correcto.",
 "PRUEBA SIN HERRAMIENTAS · con OUTPUT ACTIVATED encendido en E-U5, pisar el DELANTERO T-B5 en varios puntos: debe encenderse STRIP ACTIVATED y apagarse al soltar. Repetir con el TRASERO T-B6. El que no responde, o deja STRIP ACTIVATED / CIRCUIT FAULT encendido sin pisarlo, es el averiado.",
 "POLÍMETRO · SIN TENSIÓN: PBB parada y MANUAL; en V DC comprobar que no hay tensión entre los dos hilos; soltar Z1 / Z2 del E-U5 (o abrir CON-ELEV) y volver a comprobar ≈0 V. Medir Ω con tensión falsea la lectura y puede dañar el polímetro.",
 "POLÍMETRO · CONFIGURACIÓN: puntas en COM (negra) y VΩ (roja), nunca en A / mA. Selector en Ω: autorango, o rango manual 20 kΩ si el borde lleva resistencia (8,2 kΩ típ.) y 200 Ω si el bueno da ≈0 Ω. Juntar puntas: 0,1-0,5 Ω (restarlo); separadas: OL. No usar el zumbador para comparar bordes ni la posición de diodo. MIN/MAX activado y mover el cable: si salta a OL un instante, hilo roto. Aislamiento orientativo: rango de Ω más alto, cada hilo contra PE = OL.",
 "MEDIDA POR TRAMOS (Z1 / Z2 sueltos, en Ω): 1) E-X55:21-22 (armario E) = todo. 2) H-X51:21-22 (caja de elevación) = sin EH-W1. 3) CON-ELEV abierto, lado bordes = DELANTERO + T-CON10 + TRASERO. Bien en 3 y mal en 2 → manguera H-W18 o CON-ELEV. Bien en 2 y mal en 1 → manguera EH-W1.",
 "TRASERO SOLO: abrir T-CON10 y medir en la mitad del TRASERO (T1-W2), en reposo y pisando.",
 "DELANTERO SOLO: con T-CON10 abierto, poner un PUENTE en la mitad del DELANTERO del T-CON10 (los pines que van al trasero) y medir en CON-ELEV abierto, lado bordes, en reposo y pisando. Sin el puente el lado del delantero da siempre OL (el anillo queda abierto).",
 "Valor BUENO: estable en reposo, cambia al pisar y vuelve al soltar. AVERIADO: OL, en corto fijo o muy distinto del otro. Mover el cable con MIN/MAX: si salta, cable roto por el giro de ruedas.",
 "ANULAR EL TRASERO (provisional): en el T-CON10, desconectar el trasero y en la mitad del DELANTERO poner lo mismo que mide el bueno en reposo: ≈0 Ω → PUENTE · resistencia (8,2 kΩ típ.) → RESISTENCIA del mismo valor. Rearmar E-U5 y PBB.",
 "ANULAR EL DELANTERO (provisional): el retorno del trasero pasa por el delantero, así que no vale un puente en CON-ELEV (anularía los dos). Hace falta un LATIGUILLO de salto: macho de CON-ELEV ↔ hembra de T-CON10, con el valor del delantero bueno (puente o resistencia) en serie, que deja el trasero conectado. Es la función «delantero» de la caja RB-1.",
 "Sin polímetro: con T-CON10 abierto y puente / resistencia en la mitad del delantero: si la alarma se va → era el TRASERO. Si sigue → delantero, H-W18 o CON-ELEV: medir por tramos.",
 "Comprobar que el borde que queda sigue parando la PBB al pisarlo. Compañero vigilando el lado anulado en cada traslación, aviso a CGA, anotarlo en la OT, etiqueta en el conector y quitarlo al cambiar el borde. Nunca anular los dos: si fallan ambos, solo el puente E-A8 2.1-2.2 para sacar la PBB.",
 "AL TERMINAR: conectar Z1 / Z2, CON-ELEV y T-CON10. En V DC, E-A8 2.1 contra 0 V ≈ 24 V con el bucle sano y LED de E-A8 2.1 encendido. Rearmar el E-U5 y la PBB.",
 "Conectores CON-ELEV y T-CON10 y mangueras H-W18 / T1-W1 / T1-W2: agua, pines sueltos o cable pellizcado por el giro de las ruedas.",
 "LED E-A8 2.1 en reposo: ENCENDIDO. Apagado con E-U5 correcto → hilos 260 / 622 entre E-U5 (13-14) y E-A8 2.1-2.2 (folio 68).",
 "PBB 507 (folio 62): T-B61 delantero y T-B51 trasero con relé Gelbau E1-U8 (LED rojo = pisado · amarillo = fallo de circuito, conectores T-GER1/2/3 · verde = salida activa). Mismo método.",
 "Para sacar en servicio con los dos: puente provisional en E-A8 2.1-2.2 (croquis en el bloque 1), con los bordes a la vista y el compañero vigilando. Anotarlo en la OT y quitarlo al reparar."],
 r:"Folios 41 (bordes y E-U5) y 68 (E-A8 DIS02)",cro:1});
})();

/* ===== v869: croquis del T-CON10 en la caja de bordes de ruedas: cómo están en serie y cómo anular SOLO el que falla ===== */
(function(){
const SVG=`<svg viewBox="0 0 360 400" class="brsvg" role="img" aria-label="Croquis de los bordes de ruedas en anillo abierto con sus conectores">
<style>.brsvg text{font:600 10px Menlo,Consolas,monospace;fill:var(--tx,#111)}.brsvg .m{fill:var(--mu,#666);font-weight:400}.brsvg .w{fill:none;stroke:#d11a10;stroke-width:2.2}.brsvg .rt{fill:none;stroke:#1565c0;stroke-width:1.6;stroke-dasharray:4 3}.brsvg .bx{fill:var(--card,#fff);stroke:var(--tx,#111);stroke-width:1.3}.brsvg .ed{fill:none;stroke:#f2b705;stroke-width:9;stroke-linecap:round}.brsvg .cn{fill:#37474f;stroke:#111}.brsvg .ok{fill:#2e7d32}</style>
<rect class="bx" x="6" y="8" width="150" height="50" rx="6"/><text x="14" y="25">E-U5 Gelbau 452.46</text><text x="14" y="40" class="m">armario E · Z1/Z2</text><text x="14" y="52" class="m">13-14 → E-A8 2.1/2.2</text>
<rect class="bx" x="200" y="8" width="154" height="34" rx="6"/><text x="208" y="23">E-X55:21-22</text><text x="208" y="36" class="m">armario E (bornero)</text>
<path class="w" d="M156 24H200M156 34H200"/>
<path class="w" d="M270 42V70M282 42V70"/><text x="290" y="60" class="m">EH-W1</text>
<rect class="bx" x="200" y="70" width="154" height="34" rx="6"/><text x="208" y="85">H-X51:21-22</text><text x="208" y="98" class="m">caja bornero elevación</text>
<path class="w" d="M220 104V128H104V168M232 104V136H116V168"/><text x="122" y="124" class="m">H-W18 3×1,5 BN/BK</text>
<rect class="cn" x="92" y="168" width="18" height="14" rx="2"/><rect class="cn" x="112" y="168" width="18" height="14" rx="2" style="fill:#78909c"/>
<text x="6" y="178">CON-ELEV</text><text x="6" y="190" class="m">♂ / ♀ (1 y 2)</text>
<rect x="150" y="235" width="60" height="44" rx="6" style="fill:#455a64;stroke:#111"/><circle cx="160" cy="283" r="7" style="fill:#111"/><circle cx="200" cy="283" r="7" style="fill:#111"/><text x="180" y="262" text-anchor="middle" style="fill:#fff">carro</text>
<path class="ed" d="M121 196A70 70 0 0 1 247 222"/><text x="132" y="160" style="fill:#b8860b">T-B5 DELANTERO · T1-W1</text>
<path class="rt" d="M244 226A62 62 0 0 0 124 200"/><text x="150" y="212" class="m" style="fill:#1565c0">retorno del trasero</text>
<rect class="cn" x="244" y="222" width="18" height="14" rx="2"/><rect class="cn" x="244" y="238" width="18" height="14" rx="2" style="fill:#78909c"/>
<text x="268" y="234">T-CON10</text><text x="268" y="246" class="m">♂ / ♀ (3 y 4)</text>
<path class="ed" d="M250 258A70 70 0 1 1 114 282"/><text x="140" y="356" style="fill:#b8860b">T-B6 TRASERO · T1-W2</text>
<text x="60" y="292" class="m">anillo</text><text x="60" y="304" class="m">abierto</text>
<text x="6" y="374">Anular TRASERO: T-CON10, puente/R lado del.</text>
<text x="6" y="390">Anular DELANTERO: latiguillo CON-ELEV↔T-CON10</text>
</svg>`;
const T="Bordes de seguridad de ruedas (T-B5 / T-B6)";
const pon=()=>{document.querySelectorAll("details").forEach(d=>{const s=d.querySelector("summary");if(!s||!s.textContent.includes(T)||d.querySelector(".brcro"))return;
 d.insertAdjacentHTML("beforeend",`<div class="brcro"><div class="brcrh">🔌 Croquis · bordes en anillo abierto · 4 conectores · ruta (folio 41)</div>${SVG}</div>`)})};
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`.brcro{margin:10px 0 4px;padding:8px;border:1.5px solid #f2b705;border-radius:10px;background:color-mix(in srgb,#f2b705 7%,transparent)}.brcrh{font-weight:800;font-size:13px;margin-bottom:6px}.brcro svg{width:100%;height:auto;display:block}`;document.head.appendChild(st);
})();
