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
 "PRIORIDAD 2 · Relé GELBAU E-U5 (armario E): LED de estado. Si indica borde activado sin nada que lo pise → borde, conector T-CON10 o manguera hasta E-X55:21-22.",
 "Medir el bucle en serie con el conector T-CON10 abierto, borde a borde: T-B5 (T1-W1, pines 1-2) y T-B6 (T1-W2, pines 1-2). El que esté abierto o fuera de valor respecto al otro es el borde dañado.",
 "Conector T-CON10 y mangueras T1-W1 / T1-W2 / H-W18: agua, pines sueltos o cable pellizcado por el giro de las ruedas.",
 "LED E-A8 2.1 en reposo: ENCENDIDO. Apagado con E-U5 correcto → hilos 260 / 622 entre E-U5 (13-14) y E-A8 2.1-2.2 (folio 68).",
 "Para sacar en servicio: puente provisional en E-A8 2.1-2.2 (croquis en el bloque 1), con el borde comprobado a la vista y el compañero vigilando. Anotarlo en la OT y quitarlo al reparar."],
 r:"Folios 41 (bordes y E-U5) y 68 (E-A8 DIS02)"});
})();
