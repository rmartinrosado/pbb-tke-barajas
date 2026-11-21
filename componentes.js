/* ===== v460-v461: COMPONENTE DE CAMPO · guía de especificaciones técnicas (15/11/2026) =====
   Ficha técnica de los elementos de campo (electromecánicos, eléctricos o electrónicos) que pueden intervenir en la avería,
   con fotos recortadas del componente (cada vista en su caja blanca con su rótulo) y el código / título del elemento.
   · SOS: va entre «1 · SACAR EN SERVICIO YA» y «2 · REPARAR».  · Guía de campo de la OT: debajo de «Seguridad antes de intervenir».
   Para añadir un componente: una entrada más en COMP (re = palabras del aviso que lo traen). ===== */
(function(){
"use strict";
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const E=s=>typeof esc=="function"?esc(s):String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const COMP=[
 {id:"ET-B9",t:"Láser de medida de extensión / retracción",fab:"SICK DL50-P1123 · ref. 1 047 361",
  /* límites de extensión / retracción o fallo de la medida analógica de extensión */
  re:t=>/et-?b9|dl50|laser de (medida de )?extension/.test(t)||/(limite|medida|analog|laser|longitud)/.test(t)&&/extensi|retracc|longitud/.test(t),
  fotos:[["componentes/dl50-frontal.jpg","Vista frontal · placa y conexionado"],["componentes/dl50-superior.jpg","Vista superior · display y teclas"],["componentes/dl50-trasera.jpg","Vista trasera · modelo y conector M12"]],
  esp:[["Función","Medida de distancia por láser del túnel (extensión / retracción) → salida analógica 4-20 mA al PLC"],
   ["Alimentación","10 … 30 VDC (Class 2) · consumo máx. 1,8 W"],
   ["Salida analógica QA","4 … 20 mA"],["Salida conmutada Q","≤ 100 mA · carga < 30 VDC"],
   ["Láser","Clase 1 (EN/IEC 60825-1)"],["Temperatura","−30 … +65 °C · envolvente tipo 1"],
   ["Conector","M12 macho, 5 pines"],["En el PLC","E-A4 · AIN02 (borna 1.2 / 2.2) · regleta E-X62:4 · manguera E-W13 (3×0,75 apantallada) · folio 62"]],
  pin:[["1","Marrón (BN)","L+","+24 VDC"],["3","Azul (BU)","M","0 V"],["4","Negro (BK)","Q","Salida conmutada"],["2","Blanco (WH)","QA","Salida 4-20 mA"],["5","Gris (GY)","MF","Entrada / salida multifunción"]],
  med:["24 VDC entre pin 1 (BN) y pin 3 (BU) en el conector.","4-20 mA en serie en la salida analógica, variando al extender y retraer el túnel.","Con 24 V y sin señal → óptica sucia, haz tapado o desalineado, blanco / reflector movido o sensor averiado."],
  av:"OJO AL SUSTITUIR: en el esquema rev. J la señal llega por el hilo NEGRO (BK) de E-W13 a E-X62:4. En este DL50 el negro (pin 4) es la salida CONMUTADA Q; la 4-20 mA es el BLANCO (pin 2, QA). Comprobar en el montaje qué hilo lleva la medida antes de conectar."}
,
 {id:"C-R10",t:"Potenciómetro de giro de cabina",fab:"VISHAY Spectrol · MOD 132-2-0-103",
  /* fallo de la medida analógica de giro de cabina (medidor de cabina, AIN03) */
  re:t=>/c-?r10|e-?r10|potenciometro (de )?(giro )?(de )?(la )?cabina/.test(t)||/(medida|medidor|analog|potenciom)/.test(t)&&/cabina/.test(t)&&!/extensi|retracc|altura|ultrason|rotonda/.test(t),
  fotos:[["componentes/cr10-frontal.jpg","Vista frontal · placa (modelo y resistencia) y cables 1-2-3"],["componentes/cr10-lateral.jpg","Vista lateral · eje, rosca de fijación y terminales"]],
  esp:[["Función","Mide el giro de la cabina: el eje va acoplado al giro y el cursor da una tensión proporcional al ángulo"],
   ["Resistencia","10 kΩ ± 3 % (entre extremos 1 y 3)"],["Linealidad","± 0,5 %"],
   ["Montaje","Casquillo roscado con tuerca, tetón antigiro y eje con ranura"],["Placa","MOD 132-2-0-103 · código 0331 · México"],
   ["En el PLC","C-R10 (1-2-3) → manguera E-W9 (3×0,75 apantallada) → E-X65:1/2/3 (pantalla :4) → convertidor E-R10 (WAS5 PRO RTD) → 4-20 mA → E-A4 AIN03 (borna 1.3 / 2.3) · folio 62"]],
  pint:"Conexionado (terminales soldados)",
  pin:[["1","Rojo · marca 1","Extremo","Alimentación del convertidor"],["2","Rojo · marca 2","Cursor","Señal (varía al girar)"],["3","Rojo · marca 3","Extremo","Retorno del convertidor"]],
  med:["SIN TENSIÓN (desconectado de E-X65): entre 1 y 3 ≈ 10 kΩ (9,7 … 10,3 kΩ), fijo al girar.","Entre 1-2 y entre 2-3 el valor sube y baja SUAVE al girar la cabina, sin saltos ni abiertos; 1-2 + 2-3 = 1-3.","Abierto, saltos o valor fijo al girar → potenciómetro gastado o acoplamiento al eje suelto / patinando.","Potenciómetro bien y sin medida → manguera E-W9, bornas E-X65 o convertidor E-R10 (4-20 mA en su salida)."],
  av:"AL SUSTITUIR: mismo modelo (10 kΩ, lineal). Antes de desmontar, marcar la posición del eje y del acoplamiento; montar el nuevo en la misma posición para no descalibrar la medida de giro de cabina."},
 /* v463: acoplamiento entre el giro de cabina y el eje del potenciómetro C-R10 (sale con el C-R10) */
 {id:"ACOPL. C-R10",t:"Acoplamiento elástico del potenciómetro de giro de cabina",fab:"Acoplamiento de fuelle metálico con bujes de apriete (tornillo allen)",
  re:t=>/acoplamiento/.test(t)&&/cabina|potenciom|c-?r10/.test(t)||COMP[1].re(t),
  fotos:[["componentes/acop-cr10-lateral.jpg","Vista lateral · fuelle y bujes con tornillo de apriete"],["componentes/acop-cr10-axial.jpg","Vista axial · alojamiento del eje y ranura de apriete"]],
  esp:[["Función","Une el eje del giro de cabina con el eje del potenciómetro C-R10: transmite el giro sin holgura y absorbe desalineaciones"],
   ["Tipo","Fuelle metálico (acero inoxidable) entre dos bujes de aluminio"],
   ["Fijación","Cada buje abraza su eje con una ranura y un tornillo allen de apriete"],
   ["Si el tornillo está flojo","El buje PATINA y la medida no sigue al giro: salta, se queda fija o se descalibra"],["Si el fuelle está roto","Giro con holgura o sin transmisión al potenciómetro"]],
  pint:"",pin:[],
  med:["Con la PBB parada: sujetar el eje del giro y mover el acoplamiento con la mano. No debe haber holgura ni patinar ningún buje.","Comprobar el apriete de los dos tornillos allen y que el fuelle no tiene grietas ni ondas aplastadas.","Girar la cabina despacio mirando el eje del potenciómetro: debe girar a la vez, sin saltos. Si el eje no sigue, el fallo está en el acoplamiento.","Al apretar o cambiar el acoplamiento, dejar el potenciómetro en la MISMA posición que tenía (marcar antes) y comprobar en la Magelis que la medida de giro de cabina es correcta."],
  av:"Si la medida de giro de cabina falla con el potenciómetro bien medido (1-3 ≈ 10 kΩ y 1-2 / 2-3 variando suave), revisar SIEMPRE el acoplamiento antes de cambiar el convertidor E-R10."},
 /* v464: barrera de seguridad de rotonda · emisor SICK L29S (R-B1 / R-B3); receptores R-B2 / R-B4 */
 {id:"R-B1",/* v642: antes «R-B1 / R-B3»; R-B3 tiene ficha propia */t:"Emisor de la barrera de seguridad de rotonda",fab:"SICK L29S-3D3430 · P/N 2075831 · lote AB 2420",
  re:t=>/barrera (de )?(seguridad )?(de )?(la )?rotonda|r-?b[1-4]\b|\b294\b|\bl29s?\b|fotocelula.{0,20}rotonda/.test(t),
  fotos:[["componentes/rb-l29s-frontal.jpg","Vista frontal · placa (modelo, 24 V, pines) y cable con conector"],["componentes/rb-l29s-trasera.jpg","Vista trasera · normas de seguridad (Type 2, Cat. 2)"],["componentes/rb-l29s-conector.jpg","Vista conector · M12 macho, 4 pines"]],
  esp:[["Función","Emisor de la barrera fotoeléctrica de seguridad que vigila la rotonda; su receptor (R-B2 / R-B4) avisa al PLC de seguridad si se corta el haz (evento 294)"],
   ["Seguridad","Type 2 (IEC 61496) · Cat. 2, PL c (EN ISO 13849) · SILCL 1 (EN 62061) · IEC 61508"],
   ["Alimentación","24 VDC · I < 30 mA"],["Tiempo de respuesta","≤ 540 µs"],["Protección","IP69K"],
   ["Conector","Cable corto con M12 macho de 4 pines (manguera ITR-W1, SAC-4P-20,0-PUR/M12FS apantallada)"],
   ["Test (PLC → emisor)","E-A1 OUT16, borna 4.4, hilo 645 → E-X70:3 → IT-X50:3 (EIT-W10) → ITR-W1 → R-B1 pin 4 (T1) · folio 55 y 89"],["Señal (receptor → PLC)","R-B4 pin 4 → ITR-W4 → IT-X50:6 → E-X70:6, hilo 646 → E-A10 IN03S, borna 3.1 · folio 70 y 89"]],
  pint:"Conexionado (M12, según placa)",
  pin:[["1","Marrón (BN)","+ (L+)","+24 VDC"],["2","Blanco (WH)","T2","Entrada de test 2"],["3","Azul (BU)","− (M)","0 V"],["4","Negro (BK)","T1","Entrada de test 1 (test del PLC, hilo 645)"]],
  med:["24 VDC entre pin 1 (BN) y pin 3 (BU) en el conector del emisor.","Con la rotonda libre, la entrada E-A10 IN03S (barrera) debe estar ENCENDIDA FIJA. Al cortar el haz con la mano se apaga y salta el evento 294.","Si el evento 294 se activa y desactiva varias veces en pocos segundos: ópticas sucias o desalineadas, soporte flojo, cable dañado o algo que corta el haz.","Limpiar las ópticas de emisor y receptor, realinear y comprobar que el LED queda fijo."],
  av:"No se puentea la barrera de rotonda: es una entrada de seguridad. AL SUSTITUIR: emisor con la misma referencia L29S-3D3430; el receptor es su pieza pareja (comprobar la referencia en su placa). Alinear y probar el corte del haz antes de dejar la PBB en servicio."},
 /* v494: 10 protecciones del carril DIN del armario eléctrico AE (foto 15/11/2026), segregadas una a una */
 {id:"E-Q10",t:"Magnetot\u00e9rmico iluminaci\u00f3n t\u00fanel interior y escalera",fab:"Merlin Gerin (Schneider) multi 9 C60N \u00b7 C10 \u00b7 2P",claves:"armario electrico AE carril din magnetotermico iluminacion tunel interior escalera C10 2P",
  re:t=>/e-?q10(?![.\d])|ilumin\w* (del? )?(tunel interior|escalera)|luz (del? )?(tunel interior|escalera)/.test(t),
  fotos:[["componentes/ae-eq10.jpg", "Vista frontal · recortado del carril DIN (posición 1 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq10.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.0129,y0:0.0538,x1:0.1357,y1:0.9731}}]],
  esp:[["Función", "Protección de la iluminación del túnel interior y de la escalera (con E-K10 / E-K18)"], ["Calibre / curva", "10 A · curva C"], ["Polos", "2P · 400 VAC~"], ["Poder de corte", "6000 A (Icn) · clase de limitación 3"], ["Alimentación", "Secundario 220 V del trafo P-T1 → E-X60:7-8 → E-Q150 (2P 16 A, folio 18) → E-Q10"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 1 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre las dos bornas de ENTRADA (arriba) y entre las dos de SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado (contactos).", "Disparado: NO rearmar a ciegas. Con la maneta en OFF medir aislamiento de la salida a tierra y entre polos (circuito iluminación túnel interior / escalera). Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar sin carga (salida suelta) → magnetotérmico averiado: sustituir por otro de la MISMA curva y calibre."],
  av:"AL SUSTITUIR: C60N 2P C10 (curva C, 10 A). No subir el calibre: protege el cableado de la iluminación."},
 {id:"E-Q10.1",t:"Magnetot\u00e9rmico iluminaci\u00f3n cabina y t\u00faneles exterior / medio",fab:"Merlin Gerin (Schneider) multi 9 C60N \u00b7 C10 \u00b7 2P",claves:"armario electrico AE carril din magnetotermico iluminacion cabina tunel exterior medio C10 2P",
  re:t=>/e-?q10\.1|ilumin\w* (de (la )?)?cabina|ilumin\w* (del? )?tunel (exterior|medio)|luz (de (la )?)?cabina/.test(t),
  fotos:[["componentes/ae-eq10-1.jpg", "Vista frontal · recortado del carril DIN (posición 2 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq10-1.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.1357,y0:0.0538,x1:0.2586,y1:0.9731}}]],
  esp:[["Función", "Protección de la iluminación de la cabina y de los túneles exterior y medio"], ["Calibre / curva", "10 A · curva C"], ["Polos", "2P · 400 VAC~"], ["Poder de corte", "6000 A (Icn) · clase 3"], ["Alimentación", "Trafo P-T1 → E-Q150 (folio 18) → E-Q10.1"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 2 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre las dos bornas de ENTRADA (arriba) y entre las dos de SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado (contactos).", "Disparado: NO rearmar a ciegas. Con la maneta en OFF medir aislamiento de la salida a tierra y entre polos (circuito iluminación cabina / túneles). Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar sin carga (salida suelta) → magnetotérmico averiado: sustituir por otro de la MISMA curva y calibre."],
  av:"AL SUSTITUIR: C60N 2P C10. Mismo calibre y curva."},
 {id:"E-Q12",t:"Magnetot\u00e9rmico g\u00e1libos, caldeos y alumbrado de armarios",fab:"Merlin Gerin (Schneider) multi 9 C60N \u00b7 C10 \u00b7 2P",claves:"armario electrico AE carril din magnetotermico galibos caldeo calefaccion alumbrado armarios C10 2P",
  re:t=>/e-?q12(?![.\d])|galibo|caldeo|calefac|alumbrado (de )?armario/.test(t),
  fotos:[["componentes/ae-eq12.jpg", "Vista frontal · recortado del carril DIN (posición 3 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq12.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.2586,y0:0.0538,x1:0.3843,y1:0.9731}}]],
  esp:[["Función", "Protección de las luces de gálibo, los caldeos (E-K60, termostato E-B4) y el alumbrado de armarios"], ["Calibre / curva", "10 A · curva C"], ["Polos", "2P · 400 VAC~"], ["Poder de corte", "6000 A (Icn) · clase 3"], ["Alimentación", "Trafo P-T1 → E-Q150 (folio 18) → E-Q12"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 3 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre las dos bornas de ENTRADA (arriba) y entre las dos de SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado (contactos).", "Disparado: NO rearmar a ciegas. Con la maneta en OFF medir aislamiento de la salida a tierra y entre polos (circuito gálibos / caldeos / alumbrado de armarios). Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar sin carga (salida suelta) → magnetotérmico averiado: sustituir por otro de la MISMA curva y calibre."],
  av:"Caldeo sin funcionar con E-Q12 en ON → contactor E-K60 y termostato E-B4. AL SUSTITUIR: C60N 2P C10."},
 {id:"E-Q13",t:"Interruptor magnetot\u00e9rmico-diferencial de enchufes (30 mA)",fab:"Merlin Gerin (Schneider) multi 9 DPN Vigi \u00b7 C16 \u00b7 30 mA \u00b7 1P+N (ref. lateral 21616)",claves:"armario electrico AE carril din diferencial magnetotermico enchufes 30mA DPN vigi C16",
  re:t=>/e-?q13(?![.\d])|enchufe|toma de corriente|diferencial (de )?enchufe/.test(t),
  fotos:[["componentes/ae-eq13.jpg", "Vista frontal · recortado del carril DIN (posición 4 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq13.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.3843,y0:0.0538,x1:0.5036,y1:0.9731}}]],
  esp:[["Función", "Protección magnetotérmica y diferencial (30 mA) de los enchufes de la pasarela"], ["Calibre / curva", "16 A · curva C · 230 VAC~"], ["Diferencial", "30 mA · tipo AC (símbolo ~) · botón de test T"], ["Polos", "1P+N (bloque magnetotérmico DPN + bloque Vigi)"], ["Poder de corte", "4500 A · clase 3"], ["Alimentación", "Trafo P-T1 → E-Q150 (folio 18) → E-Q13"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 4 de 10 (de izquierda a derecha)"]],
  med:["Pulsar el botón de TEST: debe disparar. Si no dispara → bloque Vigi averiado: sustituir.", "Disparado por DIFERENCIAL (palanca del bloque Vigi abajo): hay derivación a tierra. Desenchufar todo lo conectado a los enchufes y rearmar; si vuelve a disparar sin carga → medir aislamiento fase-tierra y neutro-tierra de la línea de enchufes.", "Disparado por magnetotérmico: sobrecarga o cortocircuito en la línea de enchufes.", "Con tensión: 230 VAC entre fase y N en la salida con la maneta en ON."],
  av:"No puentear ni anular el diferencial: protege a las personas (30 mA). AL SUSTITUIR: DPN Vigi C16 30 mA 1P+N."},
 {id:"E-Q15.1",t:"Magnetot\u00e9rmico focos (proyectores)",fab:"Merlin Gerin (Schneider) multi 9 C60N \u00b7 C10 \u00b7 2P",claves:"armario electrico AE carril din magnetotermico focos proyectores C10 2P",
  re:t=>/e-?q15\.1|\bfoco|proyector/.test(t),
  fotos:[["componentes/ae-eq15-1.jpg", "Vista frontal · recortado del carril DIN (posición 5 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq15-1.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.5036,y0:0.0538,x1:0.6257,y1:0.9731}}]],
  esp:[["Función", "Protección de los focos / proyectores exteriores (mando por E-K15)"], ["Calibre / curva", "10 A · curva C"], ["Polos", "2P · 400 VAC~"], ["Poder de corte", "6000 A (Icn) · clase 3"], ["Alimentación", "Trafo P-T1 → E-Q150 (folio 18) → E-Q15.1"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 5 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre las dos bornas de ENTRADA (arriba) y entre las dos de SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado (contactos).", "Disparado: NO rearmar a ciegas. Con la maneta en OFF medir aislamiento de la salida a tierra y entre polos (circuito focos). Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar sin carga (salida suelta) → magnetotérmico averiado: sustituir por otro de la MISMA curva y calibre."],
  av:"Focos apagados con E-Q15.1 en ON → contactor E-K15 y su orden. AL SUSTITUIR: C60N 2P C10."},
 {id:"E-Q14",t:"Magnetot\u00e9rmico de la c\u00e1mara (sistema de v\u00eddeo)",fab:"Merlin Gerin (Schneider) multi 9 DPN N \u00b7 C6 \u00b7 1P+N (ref. lateral 21555)",claves:"armario electrico AE carril din magnetotermico camara video DPN N C6",
  re:t=>/e-?q14(?![.\d])|camara|video|\bcctv\b/.test(t),
  fotos:[["componentes/ae-eq14.jpg", "Vista frontal · recortado del carril DIN (posición 6 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq14.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.6257,y0:0.0538,x1:0.6843,y1:0.9731}}]],
  esp:[["Función", "Protección de la alimentación de la cámara / sistema de vídeo (mando por E-K14, salida E-A0 «Sistema de vídeo»)"], ["Calibre / curva", "6 A · curva C · 230 VAC~"], ["Polos", "1P+N"], ["Poder de corte", "6000 A · clase 3"], ["Plano", "Folio 25"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 6 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre la borna de fase y la N, en la ENTRADA (arriba) y en la SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado.", "Disparado: con la maneta en OFF, medir aislamiento de la salida (fase y neutro) a tierra · circuito cámara / vídeo. Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar con la salida suelta → averiado: sustituir por otro de la MISMA curva y calibre (1P+N)."],
  av:"Cámara sin imagen con E-Q14 en ON → contactor E-K14, switch E-V1 (E-Q18) y fuente 48 V E-X4.1. AL SUSTITUIR: DPN N C6."},
 {id:"E-Q22",t:"Magnetot\u00e9rmico de la fuente de 24 VDC (mando)",fab:"Merlin Gerin (Schneider) multi 9 DPN N \u00b7 C3 \u00b7 1P+N (ref. lateral 21554)",claves:"armario electrico AE carril din magnetotermico fuente 24V E-V3 mando SAI DPN N C3",
  re:t=>/e-?q22(?![.\d])|fuente (de )?24|e-?v3\b|sin 24 ?v|falta (de )?24 ?v/.test(t),
  fotos:[["componentes/ae-eq22.jpg", "Vista frontal · recortado del carril DIN (posición 7 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq22.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.6843,y0:0.0538,x1:0.7429,y1:0.9731}}]],
  esp:[["Función", "Protección de la entrada de la fuente de mando E-V3 (24 VDC 10 A): todo el mando 24 V de la PBB depende de ella"], ["Calibre / curva", "3 A · curva C · 230 VAC~"], ["Polos", "1P+N"], ["Poder de corte", "6000 A · clase 3"], ["Alimentación", "SAI → E-S0.1 → E-X66:1 (L, hilo 1) / E-X66:2 (N, hilo 10) → E-Q22 → fuente E-V3 → E-Q30 (10 A) · folio 29"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 7 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre la borna de fase y la N, en la ENTRADA (arriba) y en la SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado.", "Disparado: con la maneta en OFF, medir aislamiento de la salida (fase y neutro) a tierra · circuito fuente E-V3. Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar con la salida suelta → averiado: sustituir por otro de la MISMA curva y calibre (1P+N).", "Con E-Q22 en ON: 24 VDC a la salida de E-V3. 230 V en la entrada y 0 V a la salida → fuente E-V3 averiada."],
  av:"Sin 24 VDC no hay mando en toda la PBB. Cuelga del SAI junto con E-Q24 y E-Q25: si los tres están sin tensión, subir a E-S0.1 y a la alimentación SAI del CBTH. AL SUSTITUIR: DPN N C3 (la etiqueta del frontal está medio despegada)."},
 {id:"E-Q24",t:"Magnetot\u00e9rmico de los frenos de traslaci\u00f3n",fab:"Merlin Gerin (Schneider) multi 9 DPN N \u00b7 C6 \u00b7 1P+N (ref. lateral 21555)",claves:"armario electrico AE carril din magnetotermico frenos traslacion E-K24 T-Y1 T-Y2 DPN N C6",
  re:t=>/e-?q24(?![.\d])|freno(s)? (de )?(la )?traslacion|freno(s)? (del? )?(motor|ruedas)|no (suelta|libera|abre) (el |los )?freno|t-?y[12]\b/.test(t),
  fotos:[["componentes/ae-eq24.jpg", "Vista frontal · recortado del carril DIN (posición 8 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq24.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.7429,y0:0.0538,x1:0.8029,y1:0.9731}}]],
  esp:[["Función", "Protección de la alimentación 230 V de los frenos de los motores de traslación T-Y1 / T-Y2 (mando por E-K24, salida de seguridad E-A6 DOS02)"], ["Calibre / curva", "6 A · curva C · 230 VAC~"], ["Polos", "1P+N"], ["Poder de corte", "6000 A · clase 3"], ["Alimentación", "SAI → E-S0.1 → E-X66:1-2 → E-Q24 → E-K0.1 → E-K24 → frenos T-Y1 / T-Y2 · folios 29-30"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 8 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre la borna de fase y la N, en la ENTRADA (arriba) y en la SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado.", "Disparado: con la maneta en OFF, medir aislamiento de la salida (fase y neutro) a tierra · circuito frenos de traslación T-Y1 / T-Y2. Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar con la salida suelta → averiado: sustituir por otro de la MISMA curva y calibre (1P+N).", "Con orden de traslación: 230 VAC en el freno (E-K24 entrado). Llega tensión y el freno no suelta → bobina del freno."],
  av:"Con E-Q24 disparado los frenos no sueltan y la PBB no traslada. AL SUSTITUIR: DPN N C6."},
 {id:"E-Q25",t:"Magnetot\u00e9rmico de la megafon\u00eda",fab:"Merlin Gerin (Schneider) multi 9 DPN N \u00b7 C6 \u00b7 1P+N (ref. lateral 21555)",claves:"armario electrico AE carril din magnetotermico megafonia amplificador E-V5 DPN N C6",
  re:t=>/e-?q25(?![.\d])|megafonia|amplificador|e-?v5\b|fonestar|aviso (de )?audio/.test(t),
  fotos:[["componentes/ae-eq25.jpg", "Vista frontal · recortado del carril DIN (posición 9 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq25.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.8029,y0:0.0538,x1:0.8629,y1:0.9731}}]],
  esp:[["Función", "Protección de la central de megafonía E-V5 (amplificador FONESTAR, armario E)"], ["Calibre / curva", "6 A · curva C · 230 VAC~"], ["Polos", "1P+N"], ["Poder de corte", "6000 A · clase 3"], ["Alimentación", "SAI → E-S0.1 → E-Q25 → E-X53:1-2 (hilos 160 / 161) → E-V5 · tierra E-X91:5"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 9 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre la borna de fase y la N, en la ENTRADA (arriba) y en la SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado.", "Disparado: con la maneta en OFF, medir aislamiento de la salida (fase y neutro) a tierra · circuito megafonía E-V5. Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar con la salida suelta → averiado: sustituir por otro de la MISMA curva y calibre (1P+N).", "E-V5 apagado con E-Q25 en ON: 230 VAC entre E-X53:1 (hilo 160) y E-X53:2 (hilo 161)."],
  av:"Cuelga de la misma línea SAI que E-Q22 y E-Q24. AL SUSTITUIR: DPN N C6."},
 {id:"E-Q26",t:"Magnetot\u00e9rmico alimentaci\u00f3n auxiliar de variadores (E-K26) \u00b7 retorno aut\u00f3nomo",fab:"Merlin Gerin (Schneider) multi 9 C60N \u00b7 D16 \u00b7 2P",claves:"armario electrico AE carril din magnetotermico retorno autonomo variadores E-K26 D16 2P",
  re:t=>/e-?q26(?![.\d])|e-?k26\b|retorno autonomo|alimentacion auxiliar (de )?(los )?variador/.test(t),
  fotos:[["componentes/ae-eq26.jpg", "Vista frontal · recortado del carril DIN (posición 10 de 10, de izquierda a derecha)"], ["componentes/ae-ubi-eq26.jpg", "Ubicación · carril DIN del armario eléctrico AE (10 elementos juntos)", {o:"componentes/ae-carril-magnetos.jpg",caja:{x0:0.8629,y0:0.0538,x1:0.9900,y1:0.9731}}]],
  esp:[["Función", "Protección de la alimentación auxiliar de los variadores (contactor E-K26) para el retorno autónomo"], ["Calibre / curva", "16 A · curva D (admite picos de arranque altos)"], ["Polos", "2P · 400 VAC~"], ["Poder de corte", "6000 A (Icn) · clase 3"], ["Alimentación", "Línea SAI (hilos 1 / 10) → E-Q26 → E-K26"], ["Ubicación", "Armario eléctrico AE (armario E) · carril DIN de magnetotérmicos, junto al resto · posición 10 de 10 (de izquierda a derecha)"]],
  med:["Con tensión y la maneta en ON: 230 VAC entre las dos bornas de ENTRADA (arriba) y entre las dos de SALIDA (abajo). Entrada sí y salida no → magnetotérmico averiado (contactos).", "Disparado: NO rearmar a ciegas. Con la maneta en OFF medir aislamiento de la salida a tierra y entre polos (circuito alimentación auxiliar de variadores / retorno autónomo). Corto o derivación → localizarla antes de rearmar.", "Si dispara al rearmar sin carga (salida suelta) → magnetotérmico averiado: sustituir por otro de la MISMA curva y calibre.", "El retorno autónomo debe funcionar en todas las PBB: comprobar E-Q26 en ON y el estado de E-K26 (P-A5 mód. 2 LED 3)."],
  av:"Es el único de la fila con curva D: AL SUSTITUIR poner C60N 2P D16 (curva D, 16 A). Una curva C dispararía en el arranque."}
];
/* v582: ficha con VARIOS CÓDIGOS (p. ej. «R-B1 / R-B3»): cada foto es de un elemento distinto, así que el rótulo
   de las fotos (salvo las de ubicación) es solo «Vista componente», sin código ni vista concreta */
const codsDe=id=>String(id||"").split(/\s*(?:\/|,|\+|\by\b)\s*/).map(x=>x.trim()).filter(x=>/[a-z]-?[a-z]?\d/i.test(x));
window.compVariosCod=id=>codsDe(id).length>1;
/* v583: pie de foto = CÓDIGO QUE SE VE EN LA FOTO · Vista componente. El código se toma del rótulo de la foto si lo
   lleva (p. ej. «R-B3 · Vista componente»); si no, por orden: 1.ª foto (no de ubicación) → 1.er código, 2.ª → 2.º… */
window.compCodFoto=function(c,i){const cs=codsDe(c&&c.id);if(cs.length<2)return"";const F=c.fotos||[],v=String((F[i]||[])[1]||"");
 if(/^ubicaci/i.test(v))return"";const n=t=>String(t).toUpperCase().replace(/\s+/g,"");
 const en=cs.find(x=>n(v).includes(n(x)));if(en)return en;
 const k=F.slice(0,i).filter(f=>!/^ubicaci/i.test(String(f[1]||""))).length;return cs[Math.min(k,cs.length-1)]};
window.COMP_CAMPO=COMP; /* v470: «Incorporar» añade aquí los componentes guardados en Supabase */
const casa=t=>{t=nrm(t);return COMP.filter(c=>{try{return c.re(t)}catch(e){return false}})};
window.compCampo=casa;
const ficha=c=>`<div class="cmpf"><div class="cmpt"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}</div><div class="cmpm">${E(c.fab)}</div>
 ${c._fp?`<div class="mu" style="padding:10px;text-align:center;font-size:13px">⏳ Cargando las fotos…</div>`:""}<div class="cmpfs" style="grid-template-columns:repeat(${c.fotos.length},minmax(0,1fr))">${c.fotos.map(([src,v],i)=>`<figure class="cmpfo" onclick="compVer('${src}',${E(JSON.stringify(c.fotos.map(f=>f[0])))})"><img src="${src}" alt="${E(c.id+" · "+v)}" loading="lazy"><figcaption>${(()=>{const cf=window.compCodFoto&&compCodFoto(c,i);return cf?`<b>${E(cf)}</b> · Vista componente`:`<b>${E(c.id)}</b> · ${E(v)}`})()}</figcaption></figure>`).join("")}</div>
 ${(()=>{/* v557: alarmas / eventos del PLC del componente (guardadas en la ficha o, si no, cotejo automático) */
   if(typeof compAlarmasDe!="function")return"";const fila=(c.esp||[]).find(r=>/^alarmas?\s*\/?\s*eventos/i.test(r[0]||""));
   const L=fila?String(fila[1]).split(/\s*·\s*/).map(x=>{const m=/^([0-9R]\d{0,3})\s+(.*)$/.exec(x.trim());return m?{c:m[1],t:m[2]}:null}).filter(Boolean):compAlarmasDe({codigo:c.id,titulo:c.t,fab:c.fab,claves:c.claves,esp:c.esp});
   return compAlarmasHTML(L,fila?"Alarmas / eventos del PLC":"Alarmas / eventos del PLC relacionados (cotejo automático)")})()}
 <table class="cmpe">${c.esp.filter(([k])=>!/^alarmas?\s*\/?\s*eventos/i.test(k||"")).map(([k,v])=>`<tr><th>${E(k)}</th><td>${E(v)}</td></tr>`).join("")}</table>
 ${c.pin&&c.pin.length?`<div class="cmpst">${E(c.pint||"Conexionado (conector M12)")}</div><table class="cmpp"><tr><th>Pin</th><th>Color</th><th>Señal</th><th>Función</th></tr>${c.pin.map(r=>`<tr>${r.map(x=>`<td>${E(x)}</td>`).join("")}</tr>`).join("")}</table>`:""}
 <div class="cmpst">Medir en campo</div><ol class="cmpo">${c.med.map(x=>`<li>${E(x)}</li>`).join("")}</ol>${c.av?`<div class="gav">⚠️ ${E(c.av)}</div>`:""}</div>`;
window.compFicha=ficha;
window.compCampoHTML=function(t){const L=casa(t);if(!L.length)return"";return L.map(c=>window.compFicha(c)).join("")};/* v534: window.compFicha (con barra de edición) */
/* foto a pantalla completa (✕ para volver) */
window.compVer=function(src){let o=document.getElementById("cmpv");if(o)o.remove();o=document.createElement("div");o.id="cmpv";
 o.style.cssText="position:fixed;inset:0;z-index:100000;background:#fff;display:flex;align-items:center;justify-content:center";
 o.innerHTML=`<img src="${src}" alt="" style="max-width:96%;max-height:90%;object-fit:contain"><button type="button" aria-label="Cerrar" style="position:fixed;top:max(12px,env(safe-area-inset-top));right:12px;width:48px;height:48px;border-radius:50%;border:2px solid #333;background:#fff;color:#111;font-size:24px;font-weight:800">✕</button>`;
 o.querySelector("button").onclick=e=>{e.stopPropagation();o.remove()};["click","dblclick","touchend"].forEach(t=>o.addEventListener(t,e=>e.stopPropagation()));document.body.appendChild(o)};
/* ---- SOS: entre el bloque 1 y el 2 ---- */
const pon=()=>{const r=document.getElementById("sr_res");if(!r)return;const h2=r.querySelector(".ub2");if(!h2||r.querySelector(".ubcmp"))return;
 const t=[(document.getElementById("sr_ob")||{}).value,(document.getElementById("sr_a")||{}).value,(document.getElementById("sr_t")||{}).value].filter(Boolean).join(" ")||window.__sosFotoAl||"";
 const h=compCampoHTML(t);if(!h)return;const d=document.createElement("div");d.innerHTML=`<div class="ubh ubcmp">🔩 COMPONENTE DE CAMPO<small>Especificaciones técnicas</small></div><div class="ubb ubbcmp">${h}</div>`;
 r.insertBefore(d.firstChild,h2);r.insertBefore(d.firstChild,h2)};
/* v474: el Componente de campo ya NO sale en el SOS: solo en la guía de campo de la OT */
/* ---- Guía de campo de la OT: debajo de «Seguridad antes de intervenir» ---- */
if(typeof vTec=="function"){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{
 if(document.querySelector('details.gd[data-k="CMP"]'))return r;const ab=typeof gOTs=="function"?gOTs():[];const i=ab.find(x=>x.id==gOT)||ab[0];if(typeof gTipo!="undefined"&&gTipo!="PAS")return r;
 /* v474: entre «Mapa de alimentaciones» y «Cierre de la actuación» */
 const h=i?compCampoHTML([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" ")):"";
 const cie=document.querySelector('details.gd[data-k="CIE"]');if(!cie)return r;const d=document.createElement("details");d.className="card gd";d.dataset.k="CMP";
 d.innerHTML=`<summary data-zic="1"><b class="gzi">${typeof zonaIcono=="function"?zonaIcono("final-carrera"):""}Componentes de Campo / Repuestos</b></summary>${h||""}<button class="sec" type="button" style="width:100%;margin-top:6px" onclick="compCatalogo()">CATÁLOGO + INCORPORAR</button>`;cie.before(d)}catch(e){console.warn("componentes",e)}return r}}
const st=document.createElement("style");st.textContent=`
.ubcmp{background:#455a64}.ubcmp small{display:block;font-size:.78em;font-weight:700;opacity:.9;margin-top:2px;padding-left:1.6em}
.cmpf{margin:8px 0;padding:8px;border:1px solid var(--bd,#cfd8dc);border-radius:10px}
.cmpt{font-weight:800;font-size:15px}.cmpid{display:inline-block;background:#455a64;color:#fff;border-radius:6px;padding:1px 7px;margin-right:4px;font-family:ui-monospace,monospace}
.cmpm{font-size:12.5px;opacity:.8;margin:2px 0 8px}
.cmpfs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}
.cmpfo{min-width:0;margin:0;background:#fff;border:1px solid #cfd8dc;border-radius:10px;padding:6px 4px;display:flex;flex-direction:column;align-items:center;cursor:zoom-in}
.cmpfo img{width:100%;height:110px;object-fit:contain;background:#fff}
.cmpfo figcaption{font-size:10.5px;line-height:1.2;color:#263238;text-align:center;margin-top:5px;overflow-wrap:anywhere}
.cmpe,.cmpp{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
.cmpe th,.cmpe td,.cmpp th,.cmpp td{border-bottom:1px solid var(--bd,#e0e0e0);padding:4px 5px;text-align:left;vertical-align:top}
.cmpe th{width:34%;font-weight:700;opacity:.85}.cmpp th{font-size:12px;opacity:.8}
.cmpst{font-weight:800;font-size:13px;margin-top:10px;text-transform:uppercase;letter-spacing:.03em}
.cmpo{margin:4px 0 6px;padding-left:20px;font-size:13.5px}`;
document.head.appendChild(st);
})();
