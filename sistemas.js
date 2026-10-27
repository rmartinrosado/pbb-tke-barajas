/* ===== v66: «Comprobaciones por sistema» en la guía de campo =====
 Va justo después de «Inspección cable a cable» (o en su lugar en los tipos que no la tienen).
 Recoge, ordenadas por tipo de aviso (PAS, AAA, HZ, AAP) y por sistema, las actuaciones y comprobaciones
 de todos los sistemas electromecánicos que aparecen en los planos del proyecto:
  - PAS: ESQUEMA GENERAL rev. J (T87911031210, T4/T4S; antes ESQUEMA GENERAL rev. J) · PBB 504 (T87911031260, stands 504 y 508) · PLC RCS (LED en reposo)
  - AAA: AAA 504 / rdx_1520-4ug_barajas (PCA RDX 1520-4UG, «PCA PRO CONTROL» hojas 1-30)
  - HZ:  PDS 400 + OPERATIVA CONECTOR HZ PDS400 + interfaz con la PBB (ESQUEMA GENERAL rev. J folios 11, 59, 85)
 «f» = folio/hoja del plano del tipo (botón de plano). Líneas con «solo» se muestran únicamente en esas posiciones;
 con «no», en todas menos esas. ● LED encendido · ○ apagado (estado de reposo, PLC RCS). */
(function(){
const P3=["504","507","508"];
const SIS={
PAS:[
 {s:"Acometida y distribución 400 V",f:[9,13,14],c:[
  "CBTH: CBTH-Z0 (40 A) cerrado. Medir 400 V entre fases en CBTH-X11 (1-2-3). Sin tensión → problema aguas arriba, avisar a CGA.",
  "Armario E: seccionador E-S0 cerrado; 400 V en E-X11 (cable ECBTH-W1 4×16).",
  "Contactor de seguridad 1 E-K0: entra con la PBB activada (bobina E-A6 mód. 2 LED 1 ●; estado E-A0 mód. 3 LED 1 ●).",
  "Distriblock E-X72 (L1-L2-L3-N): apriete de bornas, sin decoloración ni olor a quemado.",
  "Salidas de E-X72: E-Q1 variadores, E-Q3 bomba, E-Q40 motores cabina. Medir 400 V a la salida de cada una."]},
 {s:"Tierras y sobretensiones",f:[15,16,17],c:[
  "Barra E-X90: continuidad PE de puerta y rack del armario, rosetas de cabina, suelo basculante, escalera, rotonda, pupitre, túnel exterior y elevación.",
  "Barra E-X91: PE de elementos de cabina, frenos de traslación, megafonía, fuente 24 VDC, PLC, hidráulico, Magelis y entradas safety.",
  "Protectores de sobretensión E-F19 / E-F20 / E-F21: ventana de estado correcta y contacto 11-12 cerrado (E-A0 mód. 4 LED 2 ●). Cartucho disparado → sustituir.",
  "E-Q15 (13-18 A) → trafo P-T1 380 V / 220-24 V 5600 VA: medir 220 V y 24 V en el secundario."]},
 {s:"Alimentación monofásica 230 V",f:[18,19,20,21,23,24,28],c:[
  "E-Q150 (2P 16 A) → contactor de seguridad 2 E-K0.1 (bobina E-A6 mód. 2 LED 2 ●). Si cae todo el monofásico → revisar estos dos primero.",
  "Automáticos aguas abajo: E-Q10 ilum. túnel interior y escalera · E-Q10.1 ilum. cabina y túneles · E-Q12 gálibos, caldeos y alumbrado de armarios · E-Q13 enchufes (16 A 30 mA) · E-Q15.1 focos · E-Q14 cámara · E-Q17.1 lunetas.",
  "Diferencial E-Q13 disparado: buscar la derivación (enchufes E-X1/E-X2, IT-X1, P-X1/P-X2, H-X1/H-X2) antes de rearmar."]},
 {s:"Mando 24 VDC y protecciones electrónicas",f:[29,36,37,38,39,40],c:[
  "SAI 220 V en CBTH-X12 (1-2) → E-S0.1 cerrado → E-Q22 (2P 3 A) → fuente E-V3 (230 V / 24 V 10 A) → E-Q30 (2P 10 A). Medir 24 VDC (± 5 %) a la salida de E-V3.",
  "El 24 VDC sigue vivo con E-S0 abierto: para cortar mando abrir E-S0.1.",
  "Armario E (Weidmüller): cabecera E-Q30.0 con alarma → E-A3 mód. 2 LED 4 ●. Salidas E-Q30.1 (4 A) PLC · E-Q30.2 (10 A) E/S · E-Q30.3 (10 A) salidas safety · E-Q30.4 (8 A) entradas safety.",
  "Pupitre: cabecera P-Q30.0 con alarma → P-A4 mód. 4 LED 3 ●. Salidas P-Q30.1 (2 A) · P-Q30.2 (10 A) · P-Q30.3 (8 A, display y zapata).",
  "LED de alarma en una cabecera → identificar la salida disparada y buscar el cortocircuito de ese circuito antes de rearmar.",
  "Reparto: E-X68:1 = +24 V (hilo 189) · E-X68:2 = 0 V (205) · E-X68:6 = +24 V safety (613) · P-X92.1:1 = +24 V pupitre (332).",
  "E-Q24 (6 A) frenos de traslación · E-Q25 (6 A) megafonía · E-Q26 (2P 16 A) alimentación auxiliar de variadores (E-K26)."]},
 {s:"PLC y comunicaciones",f:[51,71,72,94],c:[
  "E-A0 (cabecera del armario E): módulo 1 LED 1 ● (alimentación y bus), alimentado por E-Q30.1 y E-Q30.2.",
  "Interbus armario ↔ pupitre: E-A11 ↔ P-A0 por el cable EP-W3 (6 hilos). P-A0 módulo 1 LED 1 ● = comunicación correcta.",
  "P-A0 módulos 3 y 4 ● (alimentación desde P-Q30.1 y 24 VDC del pupitre P-X92:1).",
  "Switch E-V1: puerto X10 → PLC E-A0 · X9 → display Magelis CP-A1 · enlace al switch del CBTH.",
  "Sin comunicación: revisar conectores del bus, apantallado y 24 V de los dos extremos antes de cambiar módulos."]},
 {s:"Módulos de seguridad (safety)",f:[63,64,65,66,68,69,70],c:[
  "E-A5 (alimentación safety): 24 V en 1.1/2.1 (hilo 613) y 0 V en 1.3.",
  "E-A6 salidas: E-K1 variadores ● · E-K24 frenos ○ · E-K0 seguridad 1 ● · E-K0.1 seguridad 2 ● · sirena cabina ○ · E-K3 bomba ○ (en reposo).",
  "E-A7 salidas: bajada rápida H-Y3 y H-Y4/H-Y5 · E-K90 seta guía de atraque (VDGS) · E-K26 retorno autónomo (todos ○ en reposo).",
  "E-A8 / E-A9 / E-A10: un LED apagado que debería estar encendido indica qué elemento abre la cadena.",
  "Puentes provisionales solo con la entrada y su propia salida de test (IN–UT) del mismo módulo: un puente a +24 V directo lo detecta el módulo como fallo.",
  "Entradas y salidas correctas pero sin salida a E-K0/E-K0.1 → revisar alimentación E-Q30.3 / E-Q30.4 y bus E-A11."]},
 {s:"Setas de emergencia",f:[42,43,60,81],c:[
  "Seta pupitre CP-S5: contacto 21-22 en la cadena (E-A8 mód. 2, setas ●) y 13-14 a P-A3 mód. 1 LED 1 (○ en reposo).",
  "Setas de elevación H-S3 (izquierda) y H-S4 (derecha): 21-22 en la cadena; 13-14 a E-A3 mód. 1 LED 3 (setas traslación, ○).",
  "Seta AO (CBTH): llega por E-X61 → E-A3 mód. 1 LED 1 (bloqueo seta AO, ○). Desbloqueo AO en LED 2.",
  "Desenclavar, medir continuidad 21-22 con la seta liberada y revisar el cable (EP-W1, H-W3, H-W4). No se puentean."]},
 {s:"Finales de carrera de seguridad",f:[42,68],c:[
  "FC traslación H-S1 → E-A8 mód. 3 LED 1 ●.",
  "FC túneles / extensión ET-S1 → E-A8 mód. 3 LED 2 ●.",
  "FC rotonda CO-S1 → E-A8 mód. 4 LED 1 ●.",
  "FC inclinación superior IT-S2 e inferior IT-S3 (en serie) → E-A8 mód. 4 LED 2 ●.",
  "En cada FC: leva o rodillo libre, fijación, continuidad 11-12 en reposo y estado del cable. No se puentean."]},
 {s:"Traslación: variadores y motores",f:[31,32,33,54],c:[
  "E-Q1 (20-25 A, ajuste 22 A) cerrado → E-A0 mód. 3 LED 2 ●. Disparado → medir aislamiento de T-M1/T-M2 y cables ETR-W1/ETR-W2 antes de rearmar.",
  "E-K1 entra con la orden de marcha (bobina E-A6 mód. 1 LED 1).",
  "Variadores E-U1 (izq.) y E-U2 (dcha.) ATV28 5,5 kW: relé R1 de fallo → E-A2 mód. 1 LED 2 / LED 3 (● = variador OK). Apagado → leer el código en el variador y resetear quitando mando.",
  "Órdenes del PLC: E-A1 mód. 1 (OUT01-08: adelante, atrás, velocidad 1 y 2 de U1 y U2) → bornas LI1-LI4. Medir 24 V en LI con la orden.",
  "Motores T-M1 / T-M2: 5,5 kW, 11,5 A, 1500 rpm. Medir consumo por fase en marcha y aislamiento a tierra (variador desconectado).",
  "Resistencias de frenado E-R1 / E-R2 (82 Ω 150 W): medir resistencia si el variador da fallo de sobretensión de bus.",
  "Apantallado de ETR-W1 / ETR-W2 conectado a PE en los dos extremos."]},
 {s:"Frenos de traslación",f:[30,61],c:[
  "E-Q24 (6 A) → E-K24 (bobina E-A6 mód. 1 LED 2) → frenos T-Y1 (izq.) y T-Y2 (dcha.). Con orden de marcha medir tensión en el freno: hay tensión y no abre → freno; no hay tensión → E-K24 / E-Q24.",
  "Freno eléctrico abierto: sensores T-S5 (izq.) y T-S7 (dcha.) → E-A3 mód. 3 LED 1 y LED 3 (○ en reposo).",
  "Freno manual: palancas de desfrenado T-S6 / T-S8 → E-A3 mód. 3 LED 2 y LED 4 (● en servicio). Palanca accionada = PBB bloqueada.",
  "Freno perdido (relé R2 de los variadores): E-A2 mód. 4 LED 2 (U1) y E-A3 mód. 1 LED 4 (U2) deben estar ○ con la PBB parada."]},
 {s:"Sensores de traslación (giro y contaje)",f:[61],c:[
  "Límite giro traslación izquierda H-B3 y derecha H-B4 (inductivos PNP M12) → E-A3 mód. 4 LED 1 y LED 2 ●.",
  "Contaje traslación H-B1 / H-B2 → E-A3 mód. 4 LED 3 y LED 4 (cambian al mover).",
  "En cada inductivo: LED propio, distancia al target, fijación y conector (cables H-W14 a H-W17)."]},
 {s:"Rotonda, extensión, inclinación y medidas analógicas",f:[52,58,62],c:[
  "Giro rotonda: inductivos CO-B1 / CO-B2 → E-A0 mód. 4 LED 3 y LED 4 (cambian al girar).",
  "Límite inferior y superior de inclinación → E-A2 mód. 1 LED 4 ● y mód. 2 LED 1 ○ (inductivos IT-B10 / IT-B11, confirmar en folio 58).",
  "Detector 1 y 2 de extensión/retracción → E-A2 mód. 2 LED 2 y LED 3 (inductivos ET-B6 / ET-B7, confirmar en folio 58).",
  "E-A4 (analógicas 4-20 mA): AIN01 medidor de altura C-B14 · AIN02 medida de extensión ET-B9 · AIN03 giro de cabina (C-R10 → convertidor E-R10 WAS5) · AIN04 potenciómetro giro rotonda R-R1.",
  "Medida analógica incoherente: medir 4-20 mA en serie, revisar apantallado (EP-W8, E-W13, E-W9, EIT-W4) y la mecánica del sensor.",
  {t:"504/508: giro de rotonda por encoder Posital R-R10 (OCD-EM01B, por red al switch E-V1). Revisar alimentación 24 V y comunicación del encoder.",solo:["504","508"],f:97}]},
 {s:"Elevación hidráulica",f:[34,44,55,66],c:[
  "E-Q3 (9-14 A, ajuste 11,4 A) cerrado → E-A0 mód. 3 LED 3 ●. Disparado → revisar motor H-M1 (5,5 kW, 11,4 A) y cable H-W13.",
  "E-K3 entra al pedir subir (bobina E-A6 mód. 4 LED 2).",
  "Válvulas H-Y1 subir y H-Y2 bajar (24 VDC 0,8 A) mandadas por E-K61 / E-K62 (E-A1 mód. 2 LED 1 y 2). Medir 24 V en la válvula con la orden: llega tensión y no actúa → bobina.",
  "Bajada rápida: H-Y3 (24 V) y H-Y4 / H-Y5 (12 V 1,5 A, izq./dcha.) desde E-A7 mód. 1.",
  "Nivel de aceite, fugas en latiguillos y cilindros, ruido de bomba (comprobación mecánica)."]},
 {s:"Cabina: giro, brazo autonivelador y suelo basculante",f:[35,27,73,74,75,84,85,86,87],c:[
  "Giro cabina: P-Q6 (1,3 A) → inversor P-K61/2 → motor C-M1 (0,55 kW, 1,05 A). P-A4 mód. 3 LED 4 (disyuntor cabina) y LED 2 / mód. 4 LED 1 (inversor) ●.",
  "Límites de cabina C-B1 / C-B2 → P-A6 mód. 1 LED 1 y 2 ●. Frenos de cabina (FC izq./dcha.) → P-A6 mód. 1 LED 4 y mód. 2 LED 1 ●.",
  "Brazo autonivelador: P-Q5 (0,2 A) → P-K51/2 → motor C-M2. P-A4 mód. 3 LED 3 ●.",
  "Sensores del brazo C-B7 a C-B13 (SICK IME12, P-A5 mód. 3 y 4): en reposo arriba 1 y arriba 2 ●; contacto, abajo y neutral ○.",
  "Suelo basculante: P-Q7 (1,6 A) → P-K71/2 → motor C-M5 (0,3 kW) con condensador P-C1. P-A4 mód. 4 LED 2 ●.",
  "FC límite de suelo C-S1 / C-S2 → P-A6 mód. 2 LED 2 y 3 ●. Suelo sube derecha/izquierda C-B3 / C-B6 → P-A5 mód. 1 LED 3 y 4.",
  "Contacto avión: inductivos C-B51 / C-B52 (P-A5) y sensor de proximidad C-B22. Limpiar y comprobar distancia."]},
 {s:"Capota",f:[26,47,55,59],c:[
  "E-Q4 (izq.) y E-Q4.1 (dcha.) 2,15 A cerrados → E-A0 mód. 3 LED 4 ●.",
  "Inversores E-K41/42 (izq.) y E-K43/44 (dcha.) mandados por E-A1 mód. 2 LED 4 a 7.",
  "Motores C-M4 / C-M4.1 (0,5 kW, 2,15 A): medir consumo y revisar condensador y cables C-W10 / C-W10.1.",
  "FC capota C-S15 / C-S16 → E-A2 mód. 3 LED 4 y mód. 4 LED 1 (● = capota echada)."]},
 {s:"Portón enrollable",f:[27,57,68],c:[
  "E-Q8 (1,1 A) cerrado → E-A0 mód. 4 LED 1 ●.",
  "E-K81/2 (subir / bajar) desde E-A1 mód. 4 LED 7 y 8 → motor C-M6 (0,24 kW).",
  "Sensor portón abajo C-S9 (M12, cable P-W21) → E-A8 mód. 1 LED 1 ●. Si falla, la PBB no rearma.",
  "Antes de trasladar la PBB hay que bajar el portón para quitar el bloqueo (la llave de bypass no lo quita)."]},
 {s:"Bordes, zapata, bumpers y barrera de rotonda",f:[41,45,89,92,70],c:[
  "Bordes de ruedas T-B5 (delantero) / T-B6 (trasero) → relé Gelbau E-U5 → E-A8 mód. 1 LED 2 ●. LED de E-U5: «strip activated» = borde pisado; «circuit fault» = cable o borde cortado (T1-W1 / T1-W2, conector T-CON10).",
  "Zapata C-B4 → Gelbau P-U5 → E-A10 mód. 4 LED 2 ●. Revisar cable CP-W14 y los LED de P-U5.",
  "Bumpers del brazo C-B27 / C-B28 y lateral izquierdo de cabina C-B29 / C-B30 → E-A10 mód. 1 LED 1 y 2 ●.",
  "Barrera de rotonda (emisores R-B1 / R-B3, receptores R-B2 / R-B4) → E-A10 mód. 2 LED 1 ●. Test desde E-A1 mód. 2 LED 8 ●. Limpiar ópticas y alinear.",
  "Inductivo puerta de servicio SS-B15 → E-A10 mód. 2 LED 2 ●.",
  "No se puentean bordes, zapata, bumpers ni la barrera de rotonda."]},
 {s:"Antiatrapamiento entre túneles",f:[41,69],c:[
  {t:"Rev. J: dos finales mecánicos por lado (superior e inferior) en serie, sin relés, alimentados con 613. Túnel interior izquierdo IT-S3''(SUP/INF) → hilo 743 → E-A9 mód. 3 LED 1 ● · derecho IT-S3'(SUP/INF) → hilo 744 → E-A9 mód. 3 LED 2 ●.",no:P3},
  {t:"Túnel medio (PBB de 3 túneles): izquierdo MT-S3''(SUP/INF) → hilo 745 → E-A9 mód. 1 LED 2 ● · derecho MT-S3'(SUP/INF) → hilo 746 → E-A9 mód. 4 LED 2 ●.",no:P3},
  {t:"Puente provisional solo del lado activado: 613 con el retorno de ese lado (743 / 744 / 745 / 746) o E-X68:6 con la borna IN en E-A9. El otro lado sigue protegido.",no:P3},
  {t:"Barreras ópticas SICK L41 (emisor L41S / receptor L41E): túnel interior IT-B1 / IT-B2 → E-A9 mód. 3 LED 1 (izq.) y LED 2 (dcha.).",solo:P3,f:98},
  {t:"Túnel medio MT-B1 / MT-B2 → E-A9 mód. 1 LED 2 (izq.) y mód. 4 LED 2 (dcha.). Limpiar ópticas y realinear.",solo:P3,f:99},
  "Liberar primero el elemento activado; puente provisional solo según la guía «Antiatrapamiento» y con autorización."]},
 {s:"Interfaz con equipos de servicio (A/A, 400 Hz, CBTH)",f:[11,12,56,58,59],c:[
  "Manguera CBTH-X61 ↔ E-X61 (25 hilos, ECBTH-W): revisar conector, humedad y apriete.",
  "Señales a CBTH por relés E-K85 a E-K88: PBB activada, en servicio, mantenimiento y avería (E-A1 mód. 3).",
  "Bloqueo máquina A/A → E-A2 mód. 2 LED 4 ○ · carro A/A (FC carrito PCAir E-S100, cable E-WCARRO) → E-A2 mód. 3 LED 1 ○.",
  "Convertidor 400 Hz en servicio → E-A2 mód. 3 LED 2 ○ · 90 % conector → E-A2 mód. 3 LED 3 ○.",
  "Bloqueo con el equipo parado y recogido → contacto en el equipo o manguera E-X61. Medida provisional: soltar el hilo de la borna IN (no puentear)."]},
 {s:"Mandos del pupitre",f:[50,81,82,83,84],c:[
  "Joystick CP-S0 con hombre muerto: P-A3 mód. 1 LED 2 al pulsar; adelante, atrás, izquierda, derecha, X1, X2, Y1 e Y2 en P-A3 mód. 1-3.",
  "Pulsadores: subir/bajar suelo, PBB subir/bajar, cabina izq./dcha. (P-A3 mód. 3-4) · iluminación, lunetas, capota, portón, retorno autónomo (P-A4).",
  "Selector CP-S16: modo AUTO / MANUAL / LOCAL-REMOTO → E-A10 mód. 3 y 4.",
  "Bypass de seguridades CP-S33 → E-A8 mód. 2 LED 1 (○). Solo para maniobra controlada de mantenimiento."]},
 {s:"Iluminación, enchufes, caldeos y lunetas",f:[19,20,21,22,23,24,28],c:[
  "Iluminación interior: E-Q10 + relés E-K10 / E-K18 · cabina y túneles: E-Q10.1 · focos 300 W: E-Q15.1 + E-K15.",
  "Gálibos C-H2 / C-H3 y alumbrado de armario por E-Q12.",
  "Caldeo armario E (400 W) y pupitre (150 W): E-Q12 + E-K60 (E-A1 mód. 4 LED 1), termostato E-B4 (> 25 °C) → E-A2 mód. 1 LED 1.",
  "Suelo térmico C-R2 / C-R3 por P-Q11 con regulador P-B20 y sonda C-PT100.",
  "Lunetas térmicas C-E1 (100 W) y C-E2 (200 W): E-Q17.1 + E-K17 (E-A1 mód. 4 LED 3)."]},
 {s:"Señalización: flash, sirenas, focos y semáforo",f:[46,73,76,78,90,91,96],c:[
  "Luces flash C-H1 (cabina), H-H1 / H-H2 (elevación) por E-K60.1 (E-A1 mód. 3 LED 7 ●).",
  "Sirena de seguridad de cabina C-H41 → E-A6 mód. 4 LED 1 y realimentación E-A9 mód. 2 LED 2.",
  "Foco Cotelo C-COT1 (24 VDC) por driver DALI P-U3 y relés P-K20 a P-K23 (P-A1 mód. 4).",
  "Semáforo de rotonda R-H1 (rojo/verde, P-A2 mód. 3) y luz azul bajo cabina C-H5 (P-K68 fija / P-K69 intermitente).",
  "Pilotos del pupitre CP-H1 (verde) / CP-H2 (rojo) y buzzer (P-A1 mód. 1)."]},
 {s:"Megafonía, reloj y señales de handling",f:[10,22,30,77,88],c:[
  "Central de megafonía E-V5 por E-Q25 (6 A); altavoces IT-B20 / IT-B21 (túnel interior), ET-B20 (ronda), MT-B20 (túnel medio).",
  "Reloj P-A2 con señal del reloj central por CBTH-X60.",
  "Señales de handling (P-A2 / P-A6): abandono operador, presencia conexión/desconexión, OK handling y OK retirada PBB por CBTH-X60 ↔ P-X60 (cable PCBTH-W1)."]},
 {s:"Cámaras y red",f:[25,93,94,95],c:[
  "Switch E-V1 MikroTik CRS112 (PoE): E-Q18 (6 A 30 mA) → fuente 48 V E-X4.1; E-Q14 + E-K14 (sistema de vídeo).",
  "Cámaras ET-P2, ET-P3, IT-P2, C-P1, C-P3, C-P4, C-P5 y SS-P1 (solo pasarelas con motores a menos de 3 m). Ver la sección «Cámaras RCS» para IP y verificación.",
  "Cámara sin imagen: LED PoE del puerto en E-V1, conector RJ45 y cable Cat.5e."]},
 {s:"PLC anticolisión",f:[100],solo:["504"],c:[
  "PLC E-U4 (Schneider TM251) con módulo E-A30, alimentado por E-Q23 (C 2 A) y fuente / UPS Phoenix TRIO.",
  "Comprobar 24 VDC, estado de la UPS y comunicación RJ45 con el switch E-V1.",
  "Elementos de evaluación conectados por E-X74 / E-X74.1."]}
],
AAA:[
 {s:"Alimentación general y protecciones",f:[1,5],c:[
  "Interruptor general IG cerrado y relé de control de fases RCP correcto (falta o secuencia de fase → clema 27).",
  "Diferenciales ID1-ID4 (100 A 30 mA, módulos 1-4) e ID5 (80 A 300 mA, ventilador interior): alarma por clemas 11-14 y 26.",
  "Control: FGT (6 A 2P), diferencial ID6 (25 A 30 mA), transformador 400/230 V 1000 VA y automáticos F1-F6 (6 A).",
  "Fuente 230 Vac / 24 Vdc 50 W: medir 24 V en clema 6."]},
 {s:"Compresores (módulos 1 a 4)",f:[1,17,18,20,21,23,24,26,27],c:[
  "Magnetotérmicos FGG1-FGG4 (80 A) y contactores KG1-KG4. Alarma de protecciones por clemas 30 a 33.",
  "Presostato de alta PA1-PA4 (42 bar) y klixon de motor KLG: rearme y causa (condensador sucio, ventilador exterior, carga de gas).",
  "Resistencia de cárter RC1-RC4 con tensión con el compresor parado.",
  "Transductores de alta TPA y baja TPB y sondas PT-100 de aspiración, descarga y líquido (T ASP / T DES / T LIQ): lectura coherente en el display.",
  "Microrruptor de módulo mi1-mi4 activo y comunicación DeviceNET del módulo (X14, X24, X34, X44)."]},
 {s:"Ventiladores exteriores",f:[1,19,22,25,28],c:[
  "FGVE1-FGVE4 (10 A) cerrados. Alarma de protecciones por clemas 35 a 38.",
  "Ventiladores MVE1-MVE4: orden ON/OFF, consigna 0-10 V y comunicación RS485. Comprobar giro, ruido y limpieza de la batería."]},
 {s:"Ventilador interior y variador",f:[2,29,30],c:[
  "Magnetotérmico FGVI (80 A) y diferencial ID5 cerrados.",
  "Variador Omron CIMR-E7Z (45 kW) con filtro RFI y reactancia: leer el código de fallo en el variador. Fallo → clemas 28 / 29.",
  "Marcha/paro por clemas 67 / 68, reset por 69, estado por 64. Temperatura del cuadro VDF (sonda T_VFD).",
  "Fallo de ventilador interior que no resetea: revisar magnetotérmico, variador, motor y ventilación del cuadro VDF."]},
 {s:"Filtro y presostato diferencial",f:[6],c:[
  "Piloto amarillo FILTRO: presostato diferencial PDA (tarado 6,5 mbar) → clema 45. Limpiar o cambiar filtros y comprobar las tomas del presostato."]},
 {s:"Resistencias de calefacción (opción)",f:[2,3],c:[
  "Etapas KRA1-KRA6 con magnetotérmicos FGRA (alarmas por clemas 40-42).",
  "Termostatos de seguridad: automático Tsm 120 °C (clema 43) y manual Ts 85 °C (clema 46, rearme manual)."]},
 {s:"Control (PLC Omron CJ1M) y display",f:[8,9,10,11,12],c:[
  "CPU CJ1M-CPU12 con fuente PA202: LED RUN y sin error.",
  "Entradas ID232 / ID211, salidas OC211, analógicas MAD42 y temperaturas TS562 (T_AMB, T_DIS, T_CONTROL, T_VDF).",
  "Red DeviceNET DRW21 a los módulos (resistencias de fin de línea de 120 Ω) y Ethernet ETN21.",
  "Display NQ5: comunicación RS-232/485 con la CPU."]},
 {s:"Mandos, pilotos y seta",f:[6,7,16],c:[
  "Pilotos: ON verde · OFF rojo · ALARMA rojo · FILTRO amarillo. Botón de test de luces.",
  "Seta de emergencia (clemas 112 / 113, relé Kseta) desenclavada.",
  "Selectores MANTENIMIENTO / NORMAL, MANUAL / AUTO, ACTIVADO / DESACTIVADO y modo CAL / VENT / REF.",
  "Botones de marcha NB / WB / JB y reset (110 / 111)."]},
 {s:"Detector de humos",f:[5],c:[
  "Sonda CAP-100 y central DH (LED verde = correcto). Rearme en la central (relé KRDH).",
  "Detector externo por clemas 126 / 127."]},
 {s:"Condensados",f:[3],c:[
  "Bomba de condensados MBC y sonda de nivel de la bandeja. Alarma FBC por clema 57: limpiar bandeja y desagüe."]},
 {s:"Válvulas de mariposa (opción)",f:[13],c:[
  "VDM1 / VDM2: apertura 80 / 90 y cierre 81 / 91 por relés KVDM1-KVDM4; estado abierto 84 / 94 y cerrado 85 / 95."]},
 {s:"Interbloqueo con la PBB y cesta de manguera",f:[7,16],c:[
  "Contacto de bloqueo de pasarela: clemas 136 / 137 → en la PBB, E-A2 mód. 2 LED 4 (bloqueo máquina A/A).",
  "Manguera en cesta: clemas 128 / 129 (cesta 1) y 142 / 143 (cesta 2).",
  "Señales al CBTH: alarma 131, activado 132, en servicio 133, mantenimiento 134.",
  "Carro de A/A: final de carrera E-S100 en la PBB (ESQUEMA GENERAL rev. J folio 12) → E-A2 mód. 3 LED 1. Cerrar la puerta del carro y ajustar el FC."]}
],
HZ:[
 {s:"Conector PDS 400",f:[1],c:[
  "Inspección: sin humedad, quemaduras ni pines doblados en el conector y en el receptáculo del avión.",
  "Pines de potencia A, B, C y N; pines de control E y F (más cortos).",
  "Sondas PTC 100 en A, B, C y N: un disparo por sobretemperatura bloquea todo, incluida la motorización (hilos 1-14). Revisar pines flojos o quemados."]},
 {s:"Lazo de seguridad 28 Vdc e interruptor 90 %",f:[1],c:[
  "El convertidor envía 28 Vdc por F; el avión puentea F-E y vuelve por E. Sin retorno no cierra el contactor.",
  "LED amarillo 90 % / verde «Available 28 Vdc» = lazo cerrado. No enciende → tope mecánico, limpieza de E/F y continuidad del interruptor 90 % (hilos 9-13).",
  "LED rojo «Power ON» = contactor cerrado y tensión en A, B y C."]},
 {s:"Pulsadores y enrollador",f:[1],c:[
  "ON / OFF actúan sobre el contactor; IN / OUT mueven el motor del enrollador (IN hilo 2, OUT hilo 3, común 9).",
  "No recoge (IN): OFF pulsado y LED rojo apagado, sensor 90 % no «pegado», hombre muerto y desbloqueo de pasarela activos."]},
 {s:"Interfaz con la PBB",f:[],c:[
  "Convertidor en servicio → E-A2 mód. 3 LED 2 · 90 % conector → E-A2 mód. 3 LED 3 (○ con el convertidor parado y el cable recogido).",
  "Cable 400 Hz extendido → P-A5 mód. 1 LED 2 (○ con el cable recogido).",
  "Bloqueo con el 400 Hz parado y recogido → contacto en el equipo o manguera CBTH-X61 ↔ E-X61."]}
],
AAP:[]
};
window.SIS=SIS;
function sisPos(){const i=typeof inc!="undefined"&&inc.find(x=>x.id==gOT);return i?String(i.pos):""}
function sisVale(o,pos){if(!o||typeof o=="string")return true;if(o.solo&&!o.solo.includes(pos))return false;if(o.no&&o.no.includes(pos))return false;return true}
function sisLista(t){const pos=sisPos();return (SIS[t]||[]).map((x,i)=>({x,i})).filter(o=>sisVale(o.x,pos))}
function sisItems(x){const pos=sisPos();return x.c.map((c,ci)=>({c,ci})).filter(o=>sisVale(o.c,pos))}
const sisTxt=c=>typeof c=="string"?c:c.t;
const sisAb=new Set();
function sisHTML(){const t=gTipo,L=sisLista(t);
 if(!L.length)return `<div class="mu" style="margin-top:8px">${t=="AAP"?"No hay planos AAP cargados en el proyecto. Súbelos en Planos para completar esta sección.":"Sin comprobaciones para este tipo."}</div>`;
 const pl=f=>f?`<button class="gpl" aria-label="Ver plano página ${f}" onclick="event.preventDefault();event.stopPropagation();gPlano('${t}',${f})">${IC('plans')}<small>${f}</small></button>`:"";
 return `<div class="mu" style="font-size:12px;margin:6px 0">Marca lo comprobado y pásalo a la «Actuación guiada» de la OT.</div>`+L.map(({x,i})=>{const k="SIS"+t+i,c=gChk[k]||[];const it=sisItems(x);const n=it.filter(o=>c[o.ci]).length;
  return `<details class="gelem sisd" data-s="${k}" ${sisAb.has(k)?"open":""} ontoggle="sisTog('${k}',this.open)"><summary><b>${esc(x.s)}</b> <span class="mu sisn" style="font-weight:400">(${n}/${it.length})</span>${x.f&&x.f.length?`<span class="mu" style="font-size:11px;font-weight:400"> · ${t=="AAA"?"hoja":"folio"} ${x.f.join(", ")}</span>`:""}</summary>
  <div class="gst">${it.map((o,j)=>`<label class="gpaso"><input type="checkbox" ${c[o.ci]?"checked":""} onchange="sisMarca('${k}',${o.ci},this.checked)"><span><b>${j+1}.</b> ${esc(sisTxt(o.c))}</span>${pl(typeof o.c=="object"&&o.c.f?o.c.f:(x.f&&x.f[0]))}</label>`).join("")}</div></details>`}).join("")+
 `<button class="sec" style="width:100%;margin-top:10px" onclick="sisCopia()">Pasar marcadas a «Actuación guiada» de la OT</button>`}
window.sisTog=(k,o)=>{o?sisAb.add(k):sisAb.delete(k)};
window.sisMarca=(k,i,v)=>{(gChk[k]=gChk[k]||[])[i]=v;const d=document.querySelector(`details.sisd[data-s="${k}"] .sisn`);if(d){const p=d.textContent.match(/\/(\d+)/);d.textContent=`(${(gChk[k]||[]).filter(Boolean).length}/${p?p[1]:"?"})`}};
window.sisCopia=()=>{const i=inc.find(x=>x.id==gOT);if(!i){msg("No hay OT abierta seleccionada");return}const t=gTipo;let txt=[],n=0;
 sisLista(t).forEach(({x,i:si})=>{const c=gChk["SIS"+t+si]||[];const sel=sisItems(x).filter(o=>c[o.ci]);if(!sel.length)return;n+=sel.length;
  txt.push(`[Comprobaciones por sistema · ${x.s}]\n`+sel.map(o=>`✔ ${sisTxt(o.c)}`).join("\n")+(x.f&&x.f.length?`\nPlanos: ${t=="AAA"?"hoja":"folio"} ${x.f.join(", ")}`:""))});
 if(!n){msg("Marca con el check las comprobaciones que quieres pasar a la Actuación guiada");return}
 i.guiada=(i.guiada?i.guiada+"\n\n":"")+txt.join("\n\n");sv("pbb_inc",inc);msg(`${n} comprobación${n>1?"es":""} añadida${n>1?"s":""} a la OT ${i.orden||""}`)};
/* inserta la caja tras «Inspección cable a cable» (o tras el cotejo / la seguridad si no existen) */
const oV=vTec;vTec=function(){const r=oV.apply(this,arguments);try{
 const t=gTipo;if(!SIS[t])return r;const old=document.querySelector('#app details.gd[data-k="SIS"]');if(old)old.remove();
 const ref=document.querySelector('#app details.gd[data-k="INS"]')||document.querySelector('#app details.gd[data-k="COT"]')||document.querySelector('#app details.gd[data-k="SEG"]');if(!ref)return r;
 const n=sisLista(t).length;const d=document.createElement("details");d.className="card gd";d.dataset.k="SIS";if(gAbierto.has("SIS"))d.open=true;
 d.innerHTML=`<summary><b>🧰 Comprobaciones por sistema</b> <span class="mu" style="font-weight:400">(${t} · ${n} sistema${n==1?"":"s"})</span></summary>${sisHTML()}`;
 d.addEventListener("toggle",()=>{d.open?gAbierto.add("SIS"):gAbierto.delete("SIS")});ref.after(d)}catch(e){console.warn("sistemas",e)}return r};
const st=document.createElement("style");st.textContent=`details.sisd{margin-top:8px;border:1px solid var(--bd);border-radius:10px;padding:6px 10px}details.sisd>summary{cursor:pointer;padding:4px 0}details.sisd[open]>summary{border-bottom:1px solid var(--bd);margin-bottom:4px}`;document.head.appendChild(st);
})();
