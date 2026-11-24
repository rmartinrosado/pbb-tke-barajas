/* ===== v436: caja propia «Bordes de seguridad de ruedas (T-B5 / T-B6) activados» en la guía de campo (PAS)
   Antes, con «borde de ruedas», la lupa y el bloque 2 del SOS daban «Límite de traslación / final de giro de ruedas» solo por la
   palabra «ruedas». Ahora hay una caja con los elementos reales del aviso: bordes T-B5 (delantero) y T-B6 (trasero) en serie por
   T-CON10, relé GELBAU E-U5 y entrada safety E-A8 2.1 (folios 41 y 68). ===== */
(function(){
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const S=GUIA.tipos.PAS.s;if(S.some(x=>/^Bordes de seguridad de ruedas/.test(x.t)))return;
S.push({t:"Bordes de seguridad de ruedas (T-B5 / T-B6) activados",ef:1,g:[41,68],p:[
 "QUÉ HAY (v874): en el carro de ruedas los dos bordes forman un ANILLO ABIERTO alrededor del carro: T-B5 DELANTERO y T-B6 TRASERO en serie. Hay 4 conectores (2 parejas macho / hembra): CON-ELEV entre la manguera H-W18 de la caja de elevación y el DELANTERO, y T-CON10 entre el DELANTERO y el TRASERO. El trasero solo conecta con el delantero; el delantero lleva también el retorno del trasero hasta la caja de elevación.",
 "RUTA ORIGEN → DESTINO (esquema en árbol debajo: cada nivel depende del de arriba; si falla uno, todo lo que cuelga de él queda sin señal).",
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
/* v887: croquis como la foto del tren de ruedas (igual que la simulación v885): vista TRASERA con la jaula de franjas amarillas y negras,
   ruedas, ruedecillas y el tubo del borde a ras de suelo, y PLANTA con los dos bordes alrededor del carro (anillo sin unir) y los 4 conectores. */
const SVG=`<svg viewBox="0 0 360 540" class="brsvg" role="img" aria-label="Croquis de los bordes de ruedas: vista trasera y planta del tren de ruedas con sus conectores">
<style>.brsvg text{font:600 10px Menlo,Consolas,monospace;fill:var(--tx,#111)}.brsvg .m{fill:var(--mu,#666);font-weight:400}.brsvg .w{fill:none;stroke:#d11a10;stroke-width:2.2}.brsvg .rt{fill:none;stroke:#1565c0;stroke-width:1.4;stroke-dasharray:4 3}.brsvg .bx{fill:var(--card,#fff);stroke:var(--tx,#111);stroke-width:1.3}.brsvg .cn{fill:#37474f;stroke:#111}.brsvg .ti{font-weight:800;fill:#b8860b}.brsvg .dk{fill:#eceff1}</style>
<rect class="bx" x="6" y="8" width="150" height="50" rx="6"/><text x="14" y="25">E-U5 Gelbau 452.46</text><text x="14" y="40" class="m">armario E · Z1/Z2</text><text x="14" y="52" class="m">13-14 → E-A8 2.1/2.2</text>
<rect class="bx" x="200" y="8" width="154" height="34" rx="6"/><text x="208" y="23">E-X55:21-22</text><text x="208" y="36" class="m">armario E (bornero)</text>
<path class="w" d="M156 24H200M156 34H200"/>
<path class="w" d="M270 42V70M282 42V70"/><text x="290" y="60" class="m">EH-W1</text>
<rect class="bx" x="200" y="70" width="154" height="34" rx="6"/><text x="208" y="85">H-X51:21-22</text><text x="208" y="98" class="m">caja bornero elevación</text>
<path class="w" d="M346 104V330M338 104V330"/><text x="270" y="122" class="m">H-W18 3×1,5</text><text x="282" y="134" class="m">BN/BK</text>

<text x="10" y="150" class="ti">VISTA TRASERA (como la foto)</text>
<rect x="10" y="156" width="318" height="124" rx="8" fill="#20252d"/>
<rect x="22" y="164" width="40" height="96" rx="12" fill="#0d0f12" stroke="#333"/><rect x="276" y="170" width="40" height="88" rx="12" fill="#0d0f12" stroke="#333"/>
<rect x="62" y="170" width="214" height="78" fill="#4a5058"/>
<path d="M62 184H276" fill="none" stroke="#111" stroke-width="6"/><path d="M62 184H276" fill="none" stroke="#f2c200" stroke-width="6" stroke-dasharray="9 9"/><path d="M100 240L276 220" fill="none" stroke="#111" stroke-width="6"/><path d="M100 240L276 220" fill="none" stroke="#f2c200" stroke-width="6" stroke-dasharray="9 9"/>
<path d="M62 180V268M100 184V260M236 184V252M262 180V260" stroke="#15181d" stroke-width="5"/>
<rect x="150" y="192" width="52" height="30" rx="2" fill="#c9a227"/><text x="176" y="205" text-anchor="middle" style="fill:#111;font-size:8px;font-weight:800">Peligro</text><text x="176" y="216" text-anchor="middle" style="fill:#111;font-size:7px">no entrar</text>
<circle cx="96" cy="266" r="6" fill="#111" stroke="#555"/><circle cx="250" cy="260" r="6" fill="#111" stroke="#555"/>
<path d="M18 274Q20 270 40 270H296Q318 270 320 260" fill="none" stroke="#1b1f25" stroke-width="11" stroke-linecap="round"/><path d="M18 274Q20 270 40 270H296Q318 270 320 260" fill="none" stroke="#cfd8dc" stroke-width="6" stroke-linecap="round"/>
<text x="70" y="296" class="ti">T-B6 TRASERO · tubo a ras de suelo</text>

<text x="10" y="318" class="ti">PLANTA del tren de ruedas</text><text x="330" y="318" text-anchor="end" class="m">▲ cabina (delante)</text>
<rect x="104" y="360" width="152" height="108" rx="6" fill="none" stroke="#111" stroke-width="6"/><rect x="104" y="360" width="152" height="108" rx="6" fill="none" stroke="#f2c200" stroke-width="6" stroke-dasharray="9 9"/>
<rect x="74" y="384" width="30" height="60" rx="6" fill="#0d0f12" stroke="#333"/><rect x="256" y="384" width="30" height="60" rx="6" fill="#0d0f12" stroke="#333"/>
<circle cx="180" cy="414" r="18" fill="#5c6570" stroke="#2a2f38"/><text x="180" y="417" text-anchor="middle" class="dk" style="font-size:8px">columna</text>
<circle cx="112" cy="368" r="5" fill="#111"/><circle cx="248" cy="368" r="5" fill="#111"/><circle cx="112" cy="460" r="5" fill="#111"/><circle cx="248" cy="460" r="5" fill="#111"/>
<path d="M54 402V370Q54 344 84 344H276Q306 344 306 370V404" fill="none" stroke="#1b1f25" stroke-width="11" stroke-linecap="round"/><path d="M54 402V370Q54 344 84 344H276Q306 344 306 370V404" fill="none" stroke="#ff9800" stroke-width="6" stroke-linecap="round"/>
<text x="180" y="336" text-anchor="middle" style="font-weight:800;fill:#ff9800">T-B5 DELANTERO · T1-W1</text>
<path d="M306 424V458Q306 484 276 484H84Q54 484 54 458V420" fill="none" stroke="#1b1f25" stroke-width="11" stroke-linecap="round"/><path d="M306 424V458Q306 484 276 484H84Q54 484 54 458V420" fill="none" stroke="#cfd8dc" stroke-width="6" stroke-linecap="round"/>
<text x="180" y="502" text-anchor="middle" style="font-weight:800">T-B6 TRASERO · T1-W2 (foto)</text>
<path class="w" d="M346 330V398M338 330V392"/>
<rect class="cn" x="312" y="392" width="14" height="12" rx="2"/><rect class="cn" x="327" y="392" width="14" height="12" rx="2" style="fill:#78909c"/><text x="352" y="386" text-anchor="end" style="font-size:9px;font-weight:800">CON-ELEV ♂/♀</text>
<rect class="cn" x="26" y="405" width="14" height="12" rx="2"/><rect class="cn" x="41" y="405" width="14" height="12" rx="2" style="fill:#78909c"/><text x="6" y="400" style="font-size:9px;font-weight:800">T-CON10 ♂/♀</text>
<path class="rt" d="M62 402V376Q62 352 88 352H272Q298 352 298 376V400"/><text x="180" y="380" text-anchor="middle" style="font-size:8px;fill:#64b5f6">↶ retorno del trasero</text>
<text x="314" y="442" class="m" style="font-size:9px">sin</text><text x="314" y="452" class="m" style="font-size:9px">unir</text>
<text x="6" y="518">Anular TRASERO: T-CON10, puente/R lado del.</text><text x="6" y="532">Anular DELANTERO: latiguillo CON-ELEV↔T-CON10</text>
</svg>`;
const T="Bordes de seguridad de ruedas (T-B5 / T-B6)";
const pon=()=>{document.querySelectorAll("details").forEach(d=>{const s=d.querySelector("summary");if(!s||!s.textContent.includes(T)||d.querySelector(".brcro"))return;
 d.insertAdjacentHTML("beforeend",`<div class="brcro"><div class="brcrh">🔌 Croquis · tren de ruedas (como la foto) · bordes en anillo abierto · 4 conectores (folio 41)</div>${SVG}</div>`)})};
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`.brcro{margin:10px 0 4px;padding:8px;border:1.5px solid #f2b705;border-radius:10px;background:color-mix(in srgb,#f2b705 7%,transparent)}.brcrh{font-weight:800;font-size:13px;margin-bottom:6px}.brcro svg{width:100%;height:auto;display:block}`;document.head.appendChild(st);
})();

/* ===== v875: RUTA ORIGEN → DESTINO en árbol con sangrado y flechas (qué depende de qué) ===== */
(function(){
const N=[
 ["plc","ORIGEN · PLC","E-A8 2.1 / 2.2 (IN02S / UT2) · armario E"],
 ["hi","hilos 260 / 622"],
 ["rel","Relé Gelbau E-U5 · contacto 13-14","armario E · LED STRIP / FAULT / OUTPUT"],
 ["hi","Z1 / Z2 (bucle de bordes)"],
 ["bor","Bornero E-X55:21-22","armario E"],
 ["man","manguera EH-W1 · 24×1,5"],
 ["bor","Bornero H-X51:21-22","caja bornero de elevación"],
 ["man","manguera H-W18 · 3×1,5 BN / BK"],
 ["con","CON-ELEV ♂ / ♀ · conectores 1 y 2","carro de ruedas"],
 ["man","cable T1-W1"],
 ["ed","T-B5 DELANTERO","borde · mitad del anillo"],
 ["man","sigue por el anillo"],
 ["con","T-CON10 ♂ / ♀ · conectores 3 y 4","entre delantero y trasero"],
 ["man","cable T1-W2"],
 ["ed","DESTINO · T-B6 TRASERO","fin del anillo (abierto)"]];
function arbol(){let h='<div class="brruta"><div class="brrh">🧭 Ruta ORIGEN → DESTINO · cada nivel cuelga del anterior</div>';let lv=0;
 N.forEach(n=>{if(n[0]=="hi"||n[0]=="man"){h+=`<div class="brrl" style="margin-left:${lv*9+6}px"><span>⬇</span> ${n[1]}</div>`;return}
  h+=`<div class="brrn brr-${n[0]}" style="margin-left:${lv*9}px"><b>${lv?"└▶ ":""}${n[1]}</b>${n[2]?`<small>${n[2]}</small>`:""}</div>`;lv++});
 h+=`<div class="brrl brrret" style="margin-left:${(lv-1)*9}px">↶ retorno del trasero por dentro del delantero → CON-ELEV → H-W18 → H-X51:22 → E-X55:22 → E-U5 Z2</div>`;
 h+=`<div class="brrn2">Si falla un nivel, todo lo que cuelga por debajo deja de llegar al PLC: mide de arriba abajo (E-X55 → H-X51 → CON-ELEV → T-CON10).</div></div>`;return h}
/* v879: el árbol va DEBAJO del paso, a todo el ancho y centrado (antes quedaba al lado del texto, muy estrecho) */
const pon=()=>document.querySelectorAll("label.gpaso,.lpap").forEach(el=>{if(!el.textContent.includes("RUTA ORIGEN → DESTINO"))return;
 const ref=el.closest("li")||el;const nx=ref.nextElementSibling;if(ref.querySelector(".brruta")||(nx&&nx.classList.contains("brruta")))return;
 ref.querySelectorAll(".brruta").forEach(x=>x.remove());ref.insertAdjacentHTML("afterend",arbol())});
new MutationObserver(()=>{try{pon()}catch(e){}}).observe(document.documentElement,{childList:true,subtree:true});try{pon()}catch(e){}
const st=document.createElement("style");st.textContent=`
.brruta{display:block;box-sizing:border-box;width:100%;max-width:440px;margin:6px auto 12px;padding:8px 8px;border:1.5px solid #64b5f6;border-radius:10px;background:color-mix(in srgb,#64b5f6 7%,transparent);font-size:11.5px;line-height:1.25}
.brrh{font-weight:800;margin-bottom:5px;font-size:12px}
.brrn{position:relative;padding:3px 7px;margin-top:1px;border-left:4px solid #888;border-radius:6px;background:color-mix(in srgb,var(--tx,#888) 6%,transparent)}
.brrn b{display:block;font-size:11.5px}.brrn small{opacity:.75;font-size:10.5px}
.brr-plc{border-left-color:#2e7d32}.brr-rel{border-left-color:#8e24aa}.brr-bor{border-left-color:#78909c}.brr-con{border-left-color:#ef6c00}.brr-ed{border-left-color:#f2b705}
.brrl{padding:1px 0 1px 6px;border-left:2px dashed #64b5f6;color:#1e88e5;font-size:10.5px;font-weight:700}
.brrret{border-left-color:#1565c0;margin-top:4px}
.brrn2{margin-top:6px;font-size:11px;font-weight:700}`;document.head.appendChild(st);
})();
