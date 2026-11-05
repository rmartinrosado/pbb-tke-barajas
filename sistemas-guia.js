/* ===== v334: Guía de campo PAS · sistemas electromecánicos que faltaban, sacados del ESQUEMA GENERAL rev. J
   (T87911031210ES, folios indicados en cada paso; mismo circuito en PBB_504 salvo indicación).
   Cada caja lleva su enrutado de análisis: si la descripción de la OT nombra el sistema, esa caja va la primera
   («Actuación más eficaz») y la señal PLC relacionada en el Análisis. En sistemas auxiliares (luces, caldeos, enchufes…)
   las palabras de ubicación («tren de ruedas», «cabina», «túnel») NO activan las cajas de traslación salvo que el texto
   describa un fallo de movimiento. ===== */
(function(){
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const S=GUIA.tipos.PAS.s;
const C=[
 {k:"galibo",re:/galib/,aux:1,sig:null,el:["C-H2","C-H3","E-Q12","C-X51"],
  t:"Iluminación · gálibos C-H2 / C-H3 no lucen",g:[21,21,17,21,21],
  a:"Los gálibos marcan el contorno de la cabina de noche. No tienen orden del PLC: lucen siempre que haya monofásico.",
  p:["Ver cuál no luce: C-H2 gálibo izquierdo o C-H3 gálibo derecho (cabina, 230 Vac, 0,08 A). Si no lucen los dos y tampoco el alumbrado del armario → alimentación común (pasos 2-3). Si falla uno solo → su cable y su gálibo (pasos 4-5).",
   "Armario E: E-Q12 (2P 10 A) cerrado. De él cuelgan gálibos, caldeos y alumbrado del armario. Disparado → buscar la derivación antes de rearmar.",
   "Sin tensión a la entrada de E-Q12 → aguas arriba: E-Q10.1 → E-Q10 → contactor de seguridad 2 E-K0.1 → E-Q150 (2P 16 A) → secundario 220 V del transformador P-T1 (E-X60:7-8). Si tampoco luce la iluminación de túneles y cabina, el corte está ahí.",
   "Salida de E-Q12 por E-X53 → manguera EC-W1 (24×1,5) → caja de cabina C-X51 → cable C-W3 / C-W4 (H07RN-F 3×1,5) → gálibo.",
   "Medir 230 Vac (fase-neutro) en las bornas del gálibo que no luce: hay tensión → gálibo averiado, sustituir. No hay → C-X51 → EC-W1 → E-X53."],
  r:"folio 21 (gálibos, caldeos, alumbrado armarios) · folios 17-20 (alimentación monofásica)"},
 {k:"tunint",re:/((luz|luces|ilumin|alumbr|luce|lucen|tubo|pantalla|fluoresc|led).{0,40}(escalera|descansillo|tunel interior|tunel a\b|hacia rotonda))|((escalera|descansillo|tunel interior).{0,40}(luz|luces|ilumin|alumbr|luce|lucen|apagad|oscur))/,aux:1,
  sig:/iluminaci[oó]n interior|iluminaci[oó]n escalera|pulsador iluminaci/i,el:["E-K10","E-K18","E-Q10","IT-X51","SS-E1"],
  t:"Iluminación · túnel interior, escalera de servicio y descansillo",g:[19,53,19,57,19],
  p:["Qué no luce: túnel interior (IT-E1, IT-E1X.2), iluminación hacia rotonda (IT-E2, IT-E2.1) o escalera de servicio (SS-E1). Si no luce nada en túneles ni cabina → E-Q10 / E-K10 (pasos 2-3).",
   "Orden: pulsador de iluminación interior del pupitre → P-A4 mód. 1 LED 4 → el PLC enciende E-A0 mód. 2 LED 3 «Iluminación interior» → bobina E-K10 (24 V). LED de P-A4 apagado al pulsar → pulsador o entrada. LED de E-A0 encendido y E-K10 no entra → bobina o hilo.",
   "Potencia: E-Q10 (2P 10 A) → contactos R1/R2 de E-K10 → E-X51 → manguera EIT-W1 (24×1,5) → IT-X51 → IT-W20 / IT-W4 / IT-W4.1 → luminarias. E-Q10 disparado → buscar la derivación antes de rearmar.",
   "Escalera de servicio SS-E1: por el relé E-K18 (bobina desde E-A1 mód. 4 LED 6 «Iluminación escalera»). Pulsadores: escalera SS-S1 → E-A2 mód. 4 LED 3 · descansillo IT-S1 → E-A2 mód. 4 LED 4 (se encienden al pulsar).",
   "Medir 230 Vac en la luminaria que no luce: hay tensión → tubo, driver o luminaria. No hay → IT-X51 → EIT-W1 → E-X51."],
  r:"folio 19 (iluminación túnel interior y escalera) · 53 (E-A0 salidas) · 57 (E-A1) · 59 (E-A2) · 83 (P-A4)"},
 {k:"cabext",re:/((luz|luces|ilumin|alumbr|luce|lucen|tubo|pantalla|fluoresc|apagad).{0,40}(cabina|tunel exterior|tunel medio|tunel b\b|tunel c\b|ronda))|((cabina|tunel exterior|tunel medio).{0,40}(luz|luces|ilumin|alumbr|luce|lucen|oscur))/,aux:1,
  sig:/iluminaci[oó]n interior/i,el:["E-K10","E-Q10.1","C-X51","MT-X51"],
  t:"Iluminación · cabina, túnel exterior y túnel medio",g:[20,53,20,20],
  p:["Qué no luce: cabina (C-E4), túnel exterior (ET-E1.1, ET-E1.2, ET-E2.1) o túnel medio (MT-E1.1, MT-E1.2, MT-E2.1; solo PBB de 3 túneles).",
   "Mando: el mismo relé E-K10 del túnel interior (contactos R3/R4), con la orden E-A0 mód. 2 LED 3 «Iluminación interior» (pulsador del pupitre → P-A4 mód. 1 LED 4). Si el túnel interior luce y esto no → E-Q10.1 o los contactos R3/R4.",
   "Potencia: E-Q10.1 (2P 10 A) → E-K10 R3/R4 → E-X53 → EC-W1 → C-X51 → C-W8 (cabina) · E-X57 / EMT-W1 → MT-X51 → MT-W2 / MT-W2.1 (túnel medio) · E-W3 / ET-W3.1 (túnel exterior).",
   "Medir 230 Vac en la luminaria que no luce: hay tensión → luminaria. No hay → su caja (C-X51 / MT-X51) y su manguera."],
  r:"folio 20 (iluminación cabina / túnel exterior / túnel medio) · 53 (E-A0) · 83 (P-A4)"},
 {k:"cotelo",re:/cotelo|azafata/,aux:1,sig:/foco azafata/i,el:["C-COT1","P-U3","P-K20","P-K21","P-K22","P-K23"],
  t:"Señalización · foco Cotelo de azafata C-COT1 (driver DALI P-U3)",g:[90,76,90,90],
  p:["Foco Cotelo de azafata C-COT1 (24 VDC, RGB), gobernado por el driver DALI P-U3 (DLD1248-4CV) en el pupitre.",
   "Órdenes del PLC: P-A1 mód. 4 LED 1 (ON) → P-K20 · LED 2 (rojo) → P-K21 · LED 3 (verde) → P-K22 · LED 4 (azul) → P-K23. Cada relé cierra una entrada IN1-IN4 del driver.",
   "Alimentación del driver: 24 VDC por P-X92:1 / P-X92:2. Sin alimentación no luce ningún color.",
   "Falla un solo color → relé de ese color o su salida L1-L4 del driver. No luce nada con ON dado → P-K20, el driver o el cable CP-W70 al foco."],
  r:"folio 90 (foco Cotelo) · 76 (P-A1 salidas)"},
 {k:"focos",re:/\bfoco|\bfocos|proyector/,aux:1,sig:/iluminaci[oó]n exterior/i,el:["E-K15","E-Q15.1","ET-E3","ET-E4","C-E7","C-E8","C-E9"],
  t:"Iluminación · focos de 300 W bajo túnel y bajo cabina",g:[24,53,24,24],
  p:["Focos de 300 W: ET-E3 y ET-E4 (bajo túnel), C-E7 y C-E8 (bajo cabina, izquierdo y derecho) y C-E9 (exterior de cabina).",
   "Orden: pulsador de iluminación exterior del pupitre → P-A4 mód. 2 LED 1 → E-A0 mód. 2 LED 4 «Iluminación exterior» → bobina E-K15 (24 V, 4 contactos).",
   "Potencia: E-Q15.1 (2P 10 A) → E-K15 → E-X54 / EET-W1 → ET-X51 → ET-W3 / ET-W4 (bajo túnel) · E-X59 / EP-W1 → P-X51 → P-W4 / P-W5 (bajo cabina) · E-X57 / EC-W1 → C-X51 → C-W11 (exterior cabina).",
   "No luce ninguno → E-Q15.1, E-K15 o la orden. Falla uno → medir 230 Vac en sus bornas: con tensión → lámpara o foco; sin tensión → su caja y su manguera."],
  r:"folio 24 (focos en túnel y cabina) · 53 (E-A0) · 83 (P-A4)"},
 {k:"semaforo",re:/semafor|luz azul|senal luminosa|(luz|luces) (roja|verde).{0,30}rotonda|rotonda.{0,30}(luz|luces) (roja|verde)/,aux:1,
  sig:/señal luminosa|luz azul/i,sigt:t=>/luz azul/.test(t)?/luz azul/i:/señal luminosa/i,el:["R-H1","C-H5","P-K68","P-K69","IT-X50"],
  t:"Señalización · semáforo de rotonda R-H1 y luz azul bajo cabina C-H5",g:[96,79,78,96],
  p:["Semáforo de rotonda R-H1 (rojo/verde, 24 VDC 210 mA) y luz azul bajo cabina C-H5 (24 VDC 150 mA).",
   "Semáforo: P-A2 mód. 3 LED 1 (rojo) y LED 2 (verde) → EP-W4 → E-X68.1 → manguera EIT-W10 → IT-X50 → ITR-W200 → conector R-CON.M12 → R-H1. +24 V común desde P-X92:1 (hilo 332).",
   "Luz azul: fija por el relé P-K68 (P-A2 mód. 2 LED 3) e intermitente por P-K69 (P-A2 mód. 2 LED 4) → cable CP-W200 → C-H5.",
   "LED del PLC encendido y no luce → medir 24 VDC en el conector de la luz: con tensión → luz averiada; sin tensión → relé P-K68 / P-K69 o la manguera."],
  r:"folio 96 (señal luminosa en rotonda y luz azul bajo cabina) · 78-79 (P-A2 salidas)"},
 {k:"sirmov",re:/sirena (de )?movimiento|(sirena|pitido|bocina|avisador|aviso acustico).{0,40}(movimiento|mover|trasla|marcha)|no pita/,aux:1,
  sig:/sirena movimiento/i,el:["ET-H1","ET-X51","E-A0"],
  t:"Señalización · sirena de movimiento ET-H1",g:[53,53,53,53],
  a:"Avisa de que la PBB se está moviendo. Mientras no suena, maniobrar solo con un compañero vigilando.",
  p:["Con la PBB en ON y en movimiento, E-A0 mód. 2 LED 1 «Sirena movimiento» debe encenderse. Apagado → el PLC no da la orden.",
   "LED encendido → medir 24 VDC en la sirena ET-H1 (túnel exterior): sale de E-A0 por E-X54 → manguera EET-W1 (12×1,5) → caja ET-X51 → cable ET-W2. Retorno 0 V común 205 (ET-X51:2).",
   "24 V en ET-H1 y no suena → sirena averiada, sustituir. Sin 24 V → ET-X51 → EET-W1 → E-X54 → salida de E-A0.",
   "LED encendido con la PBB en OFF → salida forzada o cruce en EET-W1."],
  r:"folio 53 (E-A0 salidas: sirena movimiento) · 48 (alimentaciones ET-X51)"},
 {k:"pilotos",re:/buzzer|zumbador|piloto|sirena (de )?(autonivel|alarma)|c-h4/,aux:1,
  sig:/luz alarma|luz estado|buzzer|sirena alarma|señal alarma|señal estado/i,el:["CP-H1","CP-H2","P-H9","C-H4"],
  t:"Señalización · pilotos, buzzer y sirena de alarma del pupitre y la cabina (C-H4)",g:[73,74,73,73],
  p:["Pilotos del pupitre: CP-H1 verde (estado, P-A1 mód. 1 LED 2) y CP-H2 rojo (alarma, P-A1 mód. 1 LED 1). Buzzer P-H9 (P-A1 mód. 1 LED 3).",
   "Sirena de alarma / autonivelación C-H4 en cabina: P-A1 mód. 2 LED 4 «Sirena alarma» → cable P-W3 (3×1,5) → C-H4.",
   "LED del PLC encendido y no luce o no suena → medir 24 V en el elemento: con tensión → piloto, buzzer o sirena averiado; sin tensión → hilo o regleta P-X53 / P-X52.",
   "Retorno 0 V: común 389 → P-X92:2 (205)."],
  r:"folio 73-74 (P-A1 salidas)"},
 {k:"lunetas",re:/luneta|desempan|empan/,aux:1,sig:/luneta/i,el:["E-K17","E-Q17.1","C-E1","C-E2"],
  t:"Climatización · lunetas térmicas C-E1 / C-E2",g:[28,83,28,28],
  p:["Lunetas térmicas de cabina: C-E1 (100 W) y C-E2 (200 W).",
   "Orden: pulsador de lunetas del pupitre → P-A4 mód. 2 LED 2 → E-A1 mód. 4 LED 3 «Lunetas térmicas» → bobina E-K17.",
   "Potencia: secundario 220 V del transformador P-T1 (E-X60:9-10) → E-Q17.1 (2P 16 A) → E-K17 → E-X57 → EC-W1 → C-X51 → C-W5 / C-W6 → lunetas.",
   "Medir 230 Vac en la luneta con la orden dada: hay tensión y no calienta → resistencia de la luneta cortada (medir continuidad). No hay → E-K17, E-Q17.1 o EC-W1."],
  r:"folio 28 (lunetas térmicas) · 17 (transformador) · 57 (E-A1) · 83 (P-A4)"},
 {k:"suelot",re:/suelo (termico|radiante|calefact|caliente|frio)|calefaccion (del )?suelo|reloj/,aux:1,sig:null,el:["P-Q11","P-B20","C-PT100","C-R2","C-R3"],
  t:"Climatización · suelo térmico de cabina C-R2 / C-R3",g:[22,22,22,10],
  p:["Suelo térmico de cabina: resistencias C-R2 y C-R3, regulador P-B20 (SECAL LEDI 1/S) con sonda C-PT100. Protección P-Q11 (2P 6 A, pupitre).",
   "P-Q11 cerrado → medir 230 Vac a la entrada del regulador P-B20. El regulador da salida según la sonda: sonda C-PT100 abierta o en corto → no da salida.",
   "Salida del regulador por P-X55 → P-W25 / P-W26 → C-R2 / C-R3. Con tensión en la resistencia y el suelo frío → resistencia abierta (medir ohmios).",
   "Reloj del pupitre (P-A2, DR-4020): recibe la señal del reloj central por P-X60:3/4 (hilos 177/178) desde CBTH-X60. Parado o desfasado → revisar esos hilos y el cable PCBTH-W1."],
  r:"folio 22 (suelo térmico / reloj) · 10 (cable CBTH)"},
 {k:"caldeo",re:/caldeo|calefac|resistencia (del )?(armario|pupitre)|ventilador (del )?armario|termostato|condensacion|humedad (en|del) (el )?armario|luz (del )?armario|alumbrado (del )?armario/,aux:1,
  sig:/caldeo|termostato/i,el:["E-K60","E-B4","E-E2","P-E1","E-M10","E-Q12"],
  t:"Climatización · caldeo de armario E y pupitre · ventilador y alumbrado de armario",g:[21,58,57,21,21],
  p:["Caldeo del armario E (E-E2, 400 W) y del pupitre (P-E1, 150 W) por el relé E-K60. El ventilador del armario E-M10 (19 W) y el alumbrado de armario E-E1 (18 W, con su interruptor E-S1) cuelgan también de E-Q12.",
   "Termostato E-B4 (actúa a más de 25 °C) → E-A2 mód. 1 LED 1 «Termostato caldeo armario».",
   "Orden de caldeo: E-A1 mód. 4 LED 1 «Caldeo armario y pupitre» → bobina E-K60. LED encendido y no calienta → medir 24 V en la bobina; con 24 V y sin salida → contacto 13/NO de E-K60.",
   "Potencia: E-Q12 (2P 10 A) → E-K60 → E-E2 (armario) y por E-X59 / EP-W1 → P-X51 → P-E1 (pupitre). Medir 230 Vac en la resistencia: con tensión y fría → resistencia abierta.",
   "Armario con humedad o con calor: comprobar que gira el ventilador E-M10 y el termostato E-B4."],
  r:"folio 21 (caldeos, alumbrado armarios) · 57 (E-A1) · 58 (E-A2)"},
 {k:"enchufe",re:/enchuf|toma de corriente|sin corriente (en )?(la )?toma/,aux:1,sig:null,el:["E-Q13","IT-X1","E-X1","E-X2","P-X1","P-X2","H-X1","H-X2"],
  t:"Alimentación auxiliar · enchufes 16 A (diferencial E-Q13)",g:[23,23,23,21,25],
  p:["Enchufes de 16 A: IT-X1 (túnel interior), E-X1 / E-X2 (armario principal), P-X1 / P-X2 (pupitre) y H-X1 / H-X2 (elevación).",
   "Todos por el diferencial E-Q13 (1P+N 16 A 30 mA). Disparado → desenchufar todo lo conectado, rearmar y volver a conectar uno a uno para encontrar el aparato o la derivación.",
   "No rearma sin nada conectado → derivación en el cableado: elevación EH-W2 → H-X52 → H-W5 / H-W5.1 · túnel interior EIT-W1 → IT-X51 · pupitre EP-W1 → P-X51.",
   "E-Q13 cuelga de E-Q12 → E-Q10.1 → E-Q10 → E-K0.1: si falta tensión en todo, ver el paso 3 de «Gálibos».",
   "El enchufe exterior del pupitre P-X3 va aparte: E-Q14 + relé E-K14 (sistema de vídeo, E-A0 mód. 2 LED 2)."],
  r:"folio 23 (enchufes) · 25 (cámara de vídeo / P-X3)"},
 {k:"sobret",re:/sobretension|protector|transformador|\btrafo\b|p-t1|e-f19|e-f20|e-f21|cartucho|tormenta|\brayo/,aux:1,
  sig:/protector sobretensiones/i,el:["E-F19","E-F20","E-F21","P-T1","E-Q15"],
  t:"Alimentación auxiliar · protector de sobretensiones E-F19/20/21 y transformador P-T1",g:[52,17,17,18],
  p:["E-A0 mód. 4 LED 2 «Protector sobretensiones» debe estar ●. Apagado → algún cartucho E-F19 / E-F20 / E-F21 ha actuado (ventana roja) o su contacto de aviso está abierto.",
   "Sustituir el cartucho actuado por uno igual. Después de una tormenta o sobretensión, revisar también la fuente E-V3 y el transformador P-T1.",
   "Transformador P-T1 (380 V / 220-24 V, 5600 VA, en pupitre) protegido por E-Q15 (3P 13-18 A) → manguera EP-W2 (12×2,5) → P-X52. Sin salida de 220 V → E-Q15 o P-T1.",
   "Del secundario de 220 V cuelgan las lunetas (E-Q17.1) y el monofásico de E-Q150: si P-T1 no da tensión fallan a la vez lunetas, iluminación, caldeos y enchufes."],
  r:"folio 17 (protección sobretensiones y trafo) · 18 (alimentación monofásica) · 52 (E-A0 entradas)"},
 {k:"autrot",re:/autorizacion (de )?rotonda|pulsador (luminoso )?(de )?(la )?rotonda|r-s2/,aux:0,sig:/autorizaci[oó]n rotonda/i,el:["R-S2","IT-X50","E-A9"],
  t:"Rotonda · pulsador luminoso de autorización R-S2",g:[69,57,57,57],
  p:["Pulsador luminoso R-S2 en la rotonda. Al pulsar → E-A9 mód. 2 LED 1 «Autorización rotonda» (entrada de seguridad).",
   "Luz del pulsador: E-A1 mód. 4 LED 5 «Autorización rotonda» → manguera EIT-W10 → IT-X50 → ITR-W5 → R-S2 (X1/X2, 24 V).",
   "Pulsado y E-A9 no lo ve → contacto de R-S2, ITR-W5 o EIT-W10. No se puentea: es una entrada de seguridad.",
   "Luz apagada con E-A1 mód. 4 LED 5 encendido → lámpara del pulsador o hilo de ITR-W5."],
  r:"folio 57 (E-A1: autorización rotonda) · 69 (E-A9)"},
 {k:"detect",re:/detector(es)? (de )?(giro|extension|retraccion)|(giro (de )?rotonda|rotonda).{0,40}(detector|inductivo)|co-b1|co-b2|it-b10|it-b11|et-b6|et-b7|ext\/ret/,aux:0,
  sig:/giro rotonda|ext\/?ret|extensi[oó]n\/retracci[oó]n|exten\/retracc/i,el:["CO-B1","CO-B2","IT-B10","IT-B11","ET-B6","ET-B7"],
  t:"Rotonda · detectores de giro CO-B1 / CO-B2 y de extensión/retracción de túneles",g:[52,58,58],
  p:["Giro de rotonda: detectores CO-B1 y CO-B2 → E-A0 mód. 4 LED 3 y LED 4 (cambian al girar la rotonda). Cables CO3-W2 / CO3-W3 → CO3-X51 → ITCO3-W1 → IT-X51 → EIT-W1.",
   "Extensión/retracción de túneles: detectores IT-B10, IT-B11 (túnel interior) y ET-B6, ET-B7 (túnel exterior) → E-A2 mód. 2 LED 2 y LED 3 (cambian al extender o retraer). Cables IT-W15 / IT-W15.1 / ET1-W5 / ET1-W6.",
   "Un LED que no cambia nunca al mover → detector sin leva, desajustado (distancia) o cable cortado. Comprobar el LED propio del detector y su alimentación +24 V (189) / 0 V (205)."],
  r:"folio 52 (E-A0 entradas: detectores giro rotonda) · 58 (E-A2: detectores extensión/retracción)"},
 {k:"handling",re:/handling|abandono (de )?operador|presencia (conexion|desconexion)|ok retirada|retirada pbb|telefono|timbre/,aux:1,
  sig:/abandono|presencia|handling|retirada/i,el:["P-K80","P-K81","P-K82","P-K83","P-K84","P-K85","H-S11","CBTH-X60"],
  t:"Pupitre · señales de handling, «OK retirada PBB» y teléfono con el CBTH",g:[77,88,10,23],
  p:["Señales al CBTH por relés del pupitre: «Abandono operador» P-K80 (P-A2 mód. 1 LED 1), «Presencia desconexión» P-K81 (LED 2), «Presencia conexión» P-K82 (LED 3), «OK handling» P-K83 (LED 4), «OK retirada PBB» P-K84 (P-A2 mód. 2 LED 1) y «Zapata activada» P-K85 (mód. 2 LED 2).",
   "Pulsadores de handling: P-A6 mód. 3 LED 1-4 (abandono operador, presencia desconexión, presencia conexión, OK handling). Pulsador luminoso «OK retirada PBB» H-S11 → E-A9 mód. 1 LED 1.",
   "Los contactos de P-K80…P-K85 salen por P-X60 → cable PCBTH-W1 (12×0,5) → CBTH-X60. El CBTH no recibe la señal con el LED del PLC encendido → relé o cable PCBTH-W1.",
   "Timbre de teléfono H-H3 (elevación, en paralelo con la línea telefónica) y señal de reloj por el mismo cable (P-X60:1-4)."],
  r:"folio 10 (comunicaciones cable teléfono) · 77-78 (P-A2) · 88 (P-A6) · 69 (E-A9) · 23 (H-H3)"},
 {k:"joystick",re:/joystick|hombre muerto|mandos? (del )?pupitre|pulsador(es)? (del )?pupitre|no responde (el )?(mando|joystick|pupitre)/,aux:0,
  sig:/joystick|hombre muerto|seta pupitre|pbb (adelante|atr|izq|der|subir|bajar)/i,el:["CP-S0","P-A3","P-X54"],
  t:"Pupitre · joystick, hombre muerto y pulsadores no responden",g:[81,50,50,82,81],
  p:["Joystick CP-S0: con el hombre muerto pulsado se enciende P-A3 mód. 1 LED 2. Adelante / atrás → mód. 1 LED 3 / LED 4 · izquierda / derecha → mód. 2 LED 1 / LED 2 · X1, X2 → mód. 2 LED 3 / LED 4 · Y1, Y2 → mód. 3 LED 1 / LED 2.",
   "Alimentación del joystick: P-X92:1 (332) → hilo 336 → P-X54. Sin 24 V en el 336 de P-X54 → no responde ninguna dirección.",
   "Al mover el joystick debe encenderse el LED de esa dirección. No se enciende → contacto del joystick o su hilo en P-X54 (342-350). Se enciende y la PBB no mueve → seguir en la caja de esa función (traslación, elevación, cabina).",
   "Pulsadores: subir / bajar suelo → P-A3 mód. 3 LED 3 / LED 4 · PBB subir / bajar → mód. 4 LED 1 / LED 2 · cabina izq. / dcha. → mód. 4 LED 3 / LED 4. Iluminación interior / exterior, lunetas y capota → P-A4 mód. 1-2 · portón → P-A4 mód. 3 LED 1 / mód. 4 LED 4.",
   "Seta del pupitre CP-S5 → P-A3 mód. 1 LED 1 (apagado en reposo)."],
  r:"folio 50 (joystick) · 81-82 (P-A3) · 83-84 (P-A4)"}
];
C.forEach(c=>{if(S.findIndex(x=>x.t==c.t)<0){const o={t:c.t,g:c.g,p:c.p,r:c.r};if(c.a)o.a=c.a;S.push(o)}});
const six=c=>S.findIndex(x=>x.t==c.t); /* otros módulos añaden cajas después: el índice se busca siempre por título */
window.SIS_GUIA=C;
/* ---- análisis de la OT: la caja del sistema nombrado va la primera ---- */
const nrm=t=>(typeof gNorm=="function"?gNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,""));
const MOV=/trasla|avanz|retroce|no gira|gira mal|se mueve|no mueve|movimiento de la pbb|limite|almena|variador|freno|banda|borde|inductiv|contaje|no anda|no va|bloque|para sola|se para/;
const MOVSEC=/traslaci|ruedas|almena|bordes de ruedas|portón|sin tensión/i;
const FLASH=/flash|destell|baliza|rotativ/;
const ruta=t=>C.filter(c=>c.re.test(t));
const o=anaOT;anaOT=function(i){const r=o(i);if(!r||!i||r._sis)return r;r._sis=1;if(r.tipo&&r.tipo!="PAS")return r;
 const t=nrm([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));
 let hit=ruta(t);if(FLASH.test(t))hit=hit.filter(c=>!/^(tunint|cabext|focos)$/.test(c.k)); /* el flash ya tiene su caja (v333) */
 /* un elemento concreto nombrado (gálibo, foco, Cotelo, semáforo) manda sobre las cajas genéricas por zona */
 if(hit.some(c=>/^(galibo|focos|cotelo|semaforo)$/.test(c.k)))hit=hit.filter(c=>!/^(tunint|cabext)$/.test(c.k));
 if(hit.some(c=>c.k=="cotelo"))hit=hit.filter(c=>c.k!="focos");
 if(!hit.length)return r;
 const mov=MOV.test(t),aux=hit.every(c=>c.aux);
 hit.forEach(c=>c.si=six(c));const ya=new Set(hit.map(c=>c.si));
 let rest=(r.guia||[]).filter(g=>!ya.has(g.si)&&(!aux||mov||!MOVSEC.test((S[g.si]||{}).t||g.t||"")));
 if(aux&&!mov){const fl=(r.guia||[]).filter(g=>/luces flash/.test((S[g.si]||{}).t||""));rest=fl.concat(rest.filter(g=>!fl.includes(g)))}
 r.guia=hit.map((c,k)=>({si:c.si,t:c.t,sc:200-k})).concat(rest);
 if(FLASH.test(t)){const f=r.guia.findIndex(g=>/luces flash/.test((S[g.si]||{}).t||""));if(f>0){const x=r.guia.splice(f,1)[0];r.guia.unshift(x)}}
 /* señales PLC del sistema nombrado */
 const sigs=[];hit.forEach(c=>{if(!c.sig)return;const sr=c.sigt?c.sigt(t):c.sig;try{Object.keys(RUTAS).forEach(m=>(RUTAS[m].s||[]).forEach(s=>{if(sr.test(s.t)&&!sigs.some(x=>x.S===s))sigs.push({mod:m,S:s,sc:9,tg:new Set(c.el)})}))}catch(e){}});
 if(aux&&!mov)r.rel=sigs.concat((r.rel||[]).filter(x=>/flash/i.test(x.S.t)&&FLASH.test(t)&&!sigs.some(y=>y.S===x.S)));
 else r.rel=sigs.concat((r.rel||[]).filter(x=>!sigs.some(y=>y.S===x.S)));
 r.mods=[...new Set((r.rel||[]).map(x=>x.mod))];
 const el=[];hit.forEach(c=>c.el.forEach(e=>{if(!el.includes(e))el.push(e)}));
 r.elem=el.concat(aux&&!mov?[]:(r.elem||[]).filter(e=>!el.includes(e)));
 return r};
try{ANA_C={k:"",r:null}}catch(e){}
})();
