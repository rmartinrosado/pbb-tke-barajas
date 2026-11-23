/* ===== v790: guía de campo · «Suelo basculante · nivelación automática» · PENDIENTE de revisar en campo (23/11/2026) =====
   Consulta técnica: con la cabina girada y el suelo levantado de un lado, al girar la cabina ¿se nivela el suelo solo?
   Por planos (rev. J) el PLC manda el motor y tiene un sensor de inclinación → probable nivelación automática, sin confirmar.
   Se añade AL FINAL de las cajas (otras partes guardan las cajas por su número de orden, v738). ===== */
(function(){"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const L=GUIA.tipos.PAS.s;if(L.some(s=>/^Suelo basculante · nivelación/.test(s.t)))return;
const SEC={t:"Suelo basculante · nivelación automática al girar la cabina · ⚠️ PENDIENTE",
 a:"PENDIENTE DE REVISAR EN CAMPO: no está confirmado si el suelo se nivela solo al girar la cabina. Mientras tanto, nivelar el suelo con los pulsadores del pupitre y comprobarlo antes de atracar.",
 g:[27,75,82,85,87],
 p:["QUÉ HAY (ESQUEMA GENERAL rev. J folio 27): un solo motor C-M5 (monofásico 0,3 kW) mueve el suelo; disyuntor P-Q7 e inversor P-K71/2 (subir / bajar).",
  "QUIÉN LO MANDA (folio 75): solo el PLC del pupitre, salidas P-A1 OUT09 «Suelo subir» (borna 5.1, LED 3.1) y OUT10 «Suelo bajar» (borna 6.1, LED 3.2). No hay pulsador cableado directo al motor.",
  "ÓRDENES MANUALES (folio 82): pulsadores del pupitre P-A3 «Subir suelo» (LED 3.3) y «Bajar suelo» (LED 3.4).",
  "DETECCIÓN DE INCLINACIÓN (folio 85): P-A5 IN03 «Suelo sube derecha» (borna 1.4, LED 1.3, C4-X64:3) e IN04 «Suelo sube izquierda» (borna 2.4, LED 1.4, C4-X64:4). Junto a ellas, el sensor C-B22 con dos salidas (R+ / R−) a 24 V: por cómo está dibujado parece un INCLINÓMETRO (deducción, el plano no lo llama así).",
  "TOPES (folio 87): P-A6 «FC límite suelo derecha» C-S1 (borna 4.1, LED 2.2) e «izquierda» C-S2 (borna 3.4, LED 2.3), contacto cerrado: paran el motor en los extremos.",
  "PRUEBA EN CAMPO (dos personas: una en el pupitre y otra en el PLC del pupitre): 1) con el suelo levantado de la izquierda, comprobar que el LED de P-A5 «Suelo sube izquierda» (LED 1.4) está encendido; 2) girar la cabina hacia la izquierda en MANUAL SIN tocar los pulsadores del suelo; 3) mirar los LED de P-A1 3.1 «Suelo subir» y 3.2 «Suelo bajar».",
  "RESULTADO: si uno se enciende sin pulsar nada y el suelo se mueve hasta que se apaga el LED de P-A5 → hay nivelación AUTOMÁTICA. Si no se enciende ninguno → en ese modo el suelo solo se mueve con los pulsadores. Repetir en AUTO / autonivelación.",
  "Anotar el resultado (PBB, modo, qué LED se encendió) y avisar para actualizar esta caja y las entradas P-A5 IN03 / IN04 de «Puentes» (marcadas «revisar en campo»)."],
 obs:["No hay ninguna entrada que relacione el giro de cabina con el suelo: si se nivela al girar, será porque el sensor de inclinación detecta el desnivel, no por una orden del giro.",
  "Lo que decide si nivela solo es el programa del PLC, que no está en los planos ni en la PWA.",
  "Un atraque con movimiento del suelo basculante da 115 «Atraque incorrecto» (manual RCS pág. 82-85): nivelar el suelo ANTES de tocar el avión."],
 r:"ESQUEMA GENERAL rev. J folios 27 (C-M5, P-Q7, P-K71/2), 75 (P-A1 OUT09 / OUT10), 82 (P-A3), 85 (P-A5 IN03 / IN04, C-B22, C4-X64) y 87 (P-A6, C-S1 / C-S2) · consulta 23/11/2026"};
Object.defineProperty(SEC,"obsCro",{get(){return `<div class="sbpend"><b>📝 NOTA · PENDIENTE</b><span>Comprobar en campo si el suelo basculante se nivela solo al girar la cabina (prueba de los LED de P-A5 y P-A1). Hasta confirmarlo, esta caja es orientativa.</span></div>`},enumerable:true});
L.push(SEC);
const st=document.createElement("style");st.textContent=`.sbpend{display:flex;flex-direction:column;gap:4px;margin:8px 0;padding:10px 12px;border:2px dashed #f5a400;border-radius:12px;background:#f5a40014;font-size:14px;line-height:1.35}.sbpend b{color:#f5a400;letter-spacing:.5px}`;
document.head.appendChild(st);
})();
