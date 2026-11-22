/* v621: actuación propia de cada medida analógica según el plano rev. J folio 62 (E-A4). Antes las cuatro alarmas sacaban el mismo texto
   con los cuatro sensores y la primera actuación ponía las fotos del primero con ficha (ET-B9) también en «056 Altura». */
window.RCS_AA={
 "056":"Altura: medir los mA del ultrasonido de altura C-B14 (cabina) → P-X62 → E-X62 (hilo 341) → E-A4 AI01 (folio 62). Debe dar 4-20 mA proporcional a la altura; fuera de rango → sensor C-B14, su alimentación o el cable P-X62 → E-X62.",
 "057":"Longitud / extensión: medir los mA del láser de extensión ET-B9 → E-X62 (hilo 312) → E-A4 AI02 (folio 62). Debe dar 4-20 mA proporcional a la extensión; fuera de rango → láser ET-B9 (ópticas, reflector, alineación), su alimentación o el cable.",
 "058":"Cabina: medir los mA del convertidor E-R10 (hilo 315) → E-A4 AI03 y el potenciómetro de giro de cabina C-R10 (cables 1-2-3, 10 kΩ) y su acoplamiento (folios 61-62).",
 "059":"Rotonda: medir los mA del potenciómetro de giro de rotonda R-R1 → IT-X62 → E-X62 (hilo 316) → E-A4 AI04 (folio 62).",
 /* v704: FC de seguridad según planos rev. J (folios 40-42 y 68). Primero sacar en servicio con el puente en el módulo amarillo;
    la causa principal es el límite de TRABAJO de ese movimiento que no cortó a tiempo. */
 "001":"Módulo safety amarillo E-A8 entrada 8.1 (IN08S, FC inclinación): puente provisional en MANUAL y con compañero vigilando. FC IT-S2 / IT-S3 (contacto NC 11-12, túnel) → IT-X51 → E-X51. Causa principal: límite de trabajo inferior IT-B10 (E-A2 2.4) desajustado o averiado.",
 "002":"Módulo safety amarillo E-A8 entrada 8.1 (IN08S, FC inclinación): puente provisional en MANUAL y con compañero vigilando. FC IT-S2 / IT-S3 (contacto NC 11-12, túnel) → IT-X51 → E-X51. Causa principal: límite de trabajo superior IT-B11 (E-A2 3.1) desajustado o averiado.",
 "003":"Módulo safety amarillo E-A8 entrada 7.1 (IN07S, FC rotonda): puente provisional en MANUAL y con compañero vigilando. FC CO-S1 (contacto NC 11-12, rotonda) → CO3-X51 → IT-X51 → E-X51. Causa principal: detectores de giro de rotonda CO-B1 / CO-B2 (E-A0 3.4 / 4.4) desajustados o averiados.",
 "004":"Módulo safety amarillo E-A8 entrada 6.1 (IN06S, FC extensión; UT2 6.2): puente provisional en MANUAL y con compañero vigilando. FC ET-S1 (contacto NC 11-12, túnel exterior) → ET-X51:7-8 → manguera EET-W1 → E-X54:7-8 (hilos 270 / 626, folios 42 y 68). Causa principal: detectores del límite de trabajo de extensión-retracción ET-B6 / ET-B7 (E-A2 4.1 / 3.4) desajustados o averiados.",
 "005":"Módulo safety amarillo E-A8 entrada 5.1 (IN05S, FC traslación; UT1 5.2): puente provisional en MANUAL y con compañero vigilando. FC H-S1 (contacto NC 11-12, elevación) → H-X51 → E-X55 (hilos 285 / 625, folio 42). Causa principal: inductivos de límite de giro H-B3 / H-B4 de la almena (E-A3 7.1 / 8.1) desajustados o averiados."};
/* v580: añadido el evento 294 (barrera de rotonda) fuera de la lista del manual (salta de 288 a 337); texto provisional,
   pendiente de revisar los eventos 289-336 de la Magelis. */
/* ===== v501-v504: ALARMAS Y ADVERTENCIAS DEL MANUAL RCS (MAX Automate, F8-690.0312-51 rev. Ø, págs. 104-110) · 16/11/2026 =====
   Catálogo completo de códigos de la pantalla del puesto remoto / Magelis, con familia, grupo, qué significa en campo y cierre.
   · 🔴 ALARMA (001-143, roja, LED rojo del panel): avería o seguridad → intervención en campo. Rearme: OFF → riesgo cesado → ON.
   · 🟡 ADVERTENCIA (241-363, amarilla): la corrige el operador; NO es avería salvo que no se borre al resolver la causa.
   · 🔵 PUESTO REMOTO (R001-R016): fallo del puesto RCC / comunicaciones, no de la pasarela.
   Dónde se usa:
   1) Guía de la OT: recuadro «Código del manual RCS» encima del Análisis de OT, con familia, qué es, actuación y rearme.
      Si la OT trae el código por número («AL 057», «alarma 115»), el análisis se hace con el texto oficial de esa alarma.
   2) SOS: buscador por número o texto de los ~250 códigos; al elegir uno se pone en «Escribir la alarma a mano».
   3) Cierre CGA: «Código de alarma» (desplegable con la lista completa en orden ascendente, v503) y «Tipo de cierre» (avería reparada · rearme OFF→ON · operativa, no avería ·
      especialista / RCC). Se guardan en la OT y encabezan la Actuación.
   4) Sinónimos del manual en el análisis: longitud = extensión, TI / TM = túnel interior / medio, outriggers = estabilizadores,
      wrong docking = atraque incorrecto, RCC = puesto remoto, PWC = manguera de agua potable.
   Nota: el manual repite «020 Antiatrapamiento dcho TI» (igual que la 018); se toma como túnel MEDIO derecho (TM). ===== */
(function(){
"use strict";
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const E=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
/* ---------- catálogo (código | texto del manual) ---------- */
const TXT=`001|Límite FC de inclinación
002|Límite FC de inclinación
003|Límite FC de rotonda
004|Límite FC de extensión-retracción
005|Límite FC de giro en traslación
006|Parada de emergencia del hidráulico izquierda
007|Parada de emergencia del hidráulico derecha
008|Parada de emergencia del pupitre
009|Freno de seguridad cabina activado
010|Bumpers de la traslación
011|Línea de seguridades activada
012|Parada de emergencia del hidráulico
013|Alarma de seguridad principal
014|Parada de emergencia en armario de operaciones
015|Bumper del ala activado
016|Freno de seguridad túnel B activado
017|Antiatrapamiento izdo TI activado
018|Antiatrapamiento dcho TI activado
019|Antiatrapamiento izdo TM activado
020|Antiatrapamiento dcho TM activado
021|Bumper brazo autonivelador
022|Test error fotocélulas
023|Fallo de comunicación con PLC de seguridad
024|Desgaste de rodillos detectado TB Derecho
025|Desgaste de rodillos detectado TA Izquierdo
026|Desgaste de rodillos detectado TA Derecho
027|Láser descompensación elevación
028|Parada de emergencia del pupitre
049|Fallo en el motor del portón
050|Fallo en el motor del suelo
051|Fallo en el motor de cabina
052|Fallo en el motor del brazo
053|Fallo en los motores de la capota
054|Fallo en el motor de la bomba
055|Fallo en los variadores
056|Fallo medida analógica: Altura
057|Fallo medida analógica: Longitud
058|Fallo medida analógica: Cabina
059|Fallo medida analógica: Rotonda
060|Parada de emergencia PCAir
061|Relé de asimetría disparado
062|Relé de mínima tensión disparado
063|Timeout de autonivelación: Subida
064|Timeout de autonivelación: Bajada
065|Fallo Auto: Línea de seguridades
066|Fallo Auto: Sobrecarga en bomba
067|Fallo Auto: Sobrecarga del brazo
068|Fallo Auto: Brazo no contacta
069|Fallo Auto: Sensores de subir
070|Fallo Auto: Sensores de bajar
071|Fallo Auto: Sensores neutrales
072|Fallo Auto: Zapata activada
073|Zapata activada más de 2 seg.
074|Fallo en bajada rápida
075|Zapata activada más de 3 veces
076|Protectores de sobretensión disparados
077|Fallo brazo autonivelador
078|Fallo Auto: Detección vertical de ala
079|Fallo retorno señal frenos variadores
080|Fallo en el motor del extractor
081|Fallo inductivos outriggers
082|FC suelo retráctil activado
083|Fallo en variador izquierdo
084|Fallo en variador derecho
085|Fallo en freno manual izquierdo
086|Fallo en freno manual derecho
087|Fallo en freno motor izquierdo
088|Fallo en freno motor derecho
089|Fallo PLC
090|Detector de humos activado
091|Pasarela extendida y a la izda.
092|Pasarela extendida y a la dcha.
093|Pasarela retraída y a la izda.
094|Pasarela retraída y a la dcha.
096|Zapata descolgada en manual
097|Zapata en cortocircuito
098|Zapata en circuito abierto
099|Zapata no descolgada en Auto
100|Fallo en polaridad del Joystick
101|Fallo en el Joystick
102|Fallo en sensores de presencia
103|Fallo en activación contactor de bomba
104|Fallo en desactivación contactor de bomba
105|Fallo en activación relé de frenos
106|Fallo en desactivación relé de frenos
107|Alarma en equipo de 400Hz
108|Retén del portón activado
109|Alarma en equipo de PCAir
111|Fallo auto: Límite superior de altura
112|Fallo auto: Límite superior de inclinación
113|Fallo auto: Límite inferior de inclinación
114|Fallo auto: Límite de extensión
115|Atraque incorrecto
116|Fallo en sensores de contaje
117|Fallo en tarjetas STB E
118|Fallo en tarjetas STB P
119|Fallo en tarjetas STB SI
120|Fallo alimentación 24V
121|Relé de fallo de tensión activado
122|Fallo en relé de bajada rápida
123|Fallo en sistema anticolisión
124|Fallo comunicación con sistema anticolisión
126|Protector sobrecorriente P activado
127|Protector sobrecorriente E activado
128|Protector sobrecorriente CIB activado
129|Fallo en activación de E-K1
130|Fallo en desactivación de E-K1
131|Fallo en activación de E-K14
132|Fallo en desactivación de E-K14
133|Fallo en activación de E-K63
134|Fallo en desactivación de E-K63
135|Fallo en P-K6
136|Parada de emergencia VDGS activada
137|Fallo sirena
138|Fallo sensor sirena
139|Acceso por rotonda no autorizado
140|Acceso por puerta de servicio no autorizado
141|Esperando autorización remota
142|Fallo de sirena de movimiento cabina
143|Fallo de luz de flash de cabina
241|Pasarela en autonivelación
242|Portón abierto
243|Pasarela en contacto con avión
244|Límite superior del suelo
245|Límite inferior del suelo
246|Límite izquierdo de giro cabina
247|Límite derecho de giro cabina
248|Límite superior de altura
249|Límite inferior de altura
250|Límite de extensión
251|Límite de retracción
252|Límite inferior de inclinación
253|Límite superior de inclinación
254|Límite izquierdo de la traslación
255|Límite derecho de la traslación
256|Hombre muerto no pulsado
257|Límite izquierdo de giro rotonda
258|Límite derecho de giro rotonda
259|Preposición abortada
260|Capota no recogida
261|Anticolisión con pasarela izquierda
262|Parada por detección lateral
263|400Hz1 conectado
264|Anticolisión con pasarela derecha
265|PCAir activado
266|400Hz1 activado
267|400Hz2 activado
268|Detección vertical del ala
269|Preposicionado vertical abortado
270|Cadena de seguridad descolgada
271|Botonera de mantenimiento conectada
272|400Hz1 desenrollado
273|Outriggers bajados
274|PCAir manguera 1 desenrollada
275|Preposicionado no permitido
276|Acceso a calibración de traslación
277|Acceso a calibración de cabina
278|Acceso a calibración de extensión
279|Acceso a calibración de rotonda
280|Acceso a calibración de datos pasarela
281|400Hz2 desenrollado
282|PCAir manguera 2 desenrollada
283|400Hz2 conectado
284|Acceso a calibración de parámetros anticolisión
285|Manguera PWC desenrollada
286|PBB control remoto activo
287|PBB controlada por RCC 1
288|PBB controlada por RCC 2
294|Barrera de seguridad de rotonda activada (haz cortado) · texto por confirmar
337|Bypass activado
338|Avión detectado
339|Próximo a límite de extensión
340|Próximo a límite de retracción
341|Próximo a límite izquierdo
342|Próximo a límite derecho
343|Prioridad de retorno activada
344|Pasarela no calibrada
345|Preposición alcanzada
346|Buzzer desactivado
347|Anticolisión: velocidad lenta
348|Pasarela cerca de ala
349|Retorno autónomo activado
350|Moviendo con anticolisión
351|Prioridad de retorno activado
352|Posicionando outrigger
353|Activar el lector de tarjetas
354|Bypass de wrong docking activado
355|Bypass de anticolisión activado
356|Guía de atraque activada
357|Guía de atraque activada
358|I_Antipinzamiento_Izda_TI
359|I_Antipinzamiento_Izda_TM
360|I_Antipinzamiento_Dcha_TI
361|I_Antipinzamiento_Dcha_TM
362|Posición de parking alcanzada
363|Coordenadas cargadas. Presionar de nuevo para desatracar
R001|Error de lectura de ficheros con IP de pasarela
R002|Error de lectura de ficheros de puesto remoto
R003|Cross check no OK
R004|Parada de emergencia del puesto remoto
R005|Diferencia lógica detectada
R006|Error bloque operate
R007|Power up requested (operate)
R008|Error en los dispositivos de seguridad
R009|ACK operador requerido
R010|Reset request
R011|Safety demand
R012|Error en el SFB
R013|Error de comunicación segura
R014|Error de comunicación no segura
R015|Error de comunicaciones
R016|PBB solicitud reset`;
/* ---------- grupos: qué significa en campo, actuación y tipo de cierre propuesto ---------- */
const REARME="Rearme (manual pág. 104): modo OFF → comprobar que el riesgo ha cesado → modo ON. Si la alarma sigue: avería.";
const G={
 fc:{n:"FC de seguridad pisado",q:"El movimiento pasó su límite de trabajo y pisó el final de carrera de SEGURIDAD: la pasarela queda bloqueada hasta asistencia técnica.",a:"Módulo safety amarillo E-A8 (puente provisional en su entrada, en MANUAL y con compañero vigilando). Causa principal: inductivo del límite de trabajo de ese movimiento desajustado o averiado.",c:"rep"},
 eme:{n:"Parada de emergencia",q:"Seta pulsada o circuito de emergencia abierto: corta traslación, elevación, cabina, portón, suelo y capota.",a:"Localizar la seta del aviso, comprobar que el riesgo ha cesado, girar la seta para soltarla y llave OFF → ON. Si no rearma: circuito de setas.",c:"rea"},
 seg:{n:"Seguridad activada",q:"Elemento de seguridad activado (bumper, borde, antiatrapamiento, freno de seguridad, línea de seguridades).",a:"Identificar el elemento en el estado de alarmas de la Magelis; revisar el elemento y su entrada en el módulo safety. Puente provisional solo para trasladar con compañero vigilando.",c:"rep"},
 ant:{n:"Antiatrapamiento de túnel",q:"Ha entrado el antiatrapamiento del túnel (TI = interior, TM = medio).",a:"1º inductivos de límite de trabajo de extensión-retracción (si no marcan límite entra el FC); 2º barra pulsada; 3º golpe contra el cajón del AAC. Prueba: EXT y RET el recorrido de trabajo con el límite en la Magelis.",c:"rep"},
 mec:{n:"Desgaste / mecánica",q:"Desgaste de rodillos detectado en el túnel indicado.",a:"Revisar rodillos y guías del túnel; dejar la PBB en servicio si la seguridad lo permite y programar correctivo.",c:"esp"},
 mot:{n:"Motor / accionamiento",q:"Fallo en el motor o accionamiento del sistema indicado.",a:"Térmico / guardamotor y contactor del motor, alimentación y freno; consumo en las tres fases.",c:"rep"},
 ana:{n:"Medida analógica",q:"Señal 4-20 mA fuera de rango en el módulo de medidas E-A4.",a:"Medir los mA del sensor (altura: ultrasonido C-B14 · longitud/extensión: láser ET-B9 · cabina: potenciómetro C-R10 + convertidor E-R10 · rotonda: R-R1) y su cableado.",c:"rep"},
 aut:{n:"Autonivelación",q:"Fallo durante el servicio en autonivelación (brazo, sensores de subir/bajar/neutrales, bomba, zapata).",a:"Brazo autonivelador y sus sensores, zapata C-B4, bomba hidráulica. La zapata no es autonivelación: comprobar si puede seguir en servicio.",c:"rep"},
 zap:{n:"Zapata de seguridad",q:"Zapata de seguridad de la cabina activada, descolgada, en corto o en circuito abierto.",a:"Zapata C-B4 y su cable / conector; en corto o circuito abierto: medir el circuito de la zapata.",c:"rep"},
 ten:{n:"Alimentación / protecciones",q:"Disparo de protección o falta de tensión (asimetría, mínima tensión, 24 V, sobretensión, sobrecorriente).",a:"Tensión de red en las tres fases y SAI; rearmar la protección del aviso (P = pupitre, E = armario eléctrico, CIB) solo con la causa localizada.",c:"rep"},
 con:{n:"Contactor / relé",q:"El PLC no recibe el retorno del contactor o relé indicado (no activa o no desactiva).",a:"Bobina, contactos auxiliares de retorno y cableado del contactor del aviso (E-K1, E-K14, E-K63, P-K6, bomba, frenos).",c:"rep"},
 plc:{n:"PLC / comunicaciones",q:"Fallo del PLC, de sus tarjetas STB o de la comunicación con el PLC de seguridad.",a:"LED de los módulos, alimentación 24 V y bus. Si es el PLC de seguridad: comunicación safety.",c:"rep"},
 var:{n:"Variadores / frenos de traslación",q:"Fallo de variador o de freno del motor de traslación.",a:"Display del variador (código de fallo), freno manual liberado, retorno de la señal de frenos al PLC.",c:"rep"},
 bro:{n:"Barrera de seguridad de rotonda",q:"Se ha cortado el haz de la barrera fotoeléctrica de rotonda (emisor R-B1 / R-B3, receptor R-B2 / R-B4 → E-A10 IN03S). No es avería si hay alguien o algo en la rotonda.",a:"Rotonda libre y entrada E-A10 IN03S encendida fija. Si el evento entra y sale solo: limpiar ópticas, realinear, revisar soporte y cable. No se puentea: es entrada de seguridad.",c:"ope"},
 acc:{n:"Acceso / autorización remota",q:"Detector de acceso o autorización del puesto remoto. No es avería si hay alguien dentro o falta autorización.",a:"Pasarela vacía y puerta de servicio cerrada (SS-B15); botones azules «Pasarela vacía» (rotonda) y «OK Apron» (10 s para aceptar en el RCC). Selector de REMOTO a LOCAL y a REMOTO.",c:"ope"},
 sir:{n:"Sirena / flash de cabina",q:"Fallo de la sirena o de su sensor, o de la luz flash de cabina.",a:"138 / 137: sirena de seguridad de CABINA C-H41 (no la de movimiento ET-H1). 142: sirena de movimiento de cabina. 143: flash de cabina.",c:"rep"},
 equ:{n:"Equipo de servicio",q:"Alarma del equipo de servicio (400 Hz, PCAir) o de su parada de emergencia.",a:"1º en el equipo (estado, manguera, conector); 2º señal de bloqueo en el PLC.",c:"rep"},
 col:{n:"Anticolisión / ala",q:"Sistema anticolisión o detección de ala (radar de ala en la cabina, zona derecha).",a:"Salir con traslación a zona segura. Si salta sin ala ni pasarela cerca: radar / láser de ala y su comunicación.",c:"rep"},
 ope:{n:"Error de operación",q:"Aviso de operación: la pasarela se bloquea por la maniobra, no por avería.",a:"Atraque incorrecto: contacto con el avión sin traslación adelante/atrás. Desbloqueo: mantener el bypass naranja y joystick hacia ATRÁS (lento). Solo operadores con experiencia.",c:"ope"},
 zon:{n:"Zona de trabajo",q:"La pasarela está en una zona prohibida (extendida/retraída a izquierda o derecha).",a:"Sacar la pasarela de la zona con el movimiento contrario; si el aviso no corresponde a la posición real: medidas de extensión y rotonda.",c:"ope"},
 joy:{n:"Mando / joystick",q:"Fallo del joystick o de los sensores de presencia del mando.",a:"Joystick del pupitre (polaridad, alimentación, hombre muerto) y su cableado.",c:"rep"},
 /* advertencias */
 est:{n:"Estado de la pasarela",q:"Información del estado: no es avería.",a:"Si bloquea el movimiento: pasar a modo ON / cerrar el portón según el aviso.",c:"ope"},
 lim:{n:"Límite eléctrico (de trabajo)",q:"Límite de TRABAJO alcanzado (módulo verde): NO es FC de seguridad. Solo deja alejarse del límite.",a:"Mover en sentido contrario. Si el límite sale lejos del tope real: inductivo o medida de ese movimiento (croquis del puente que libera el límite). Nada de antiatrapamiento ni E-A8.",c:""},
 pro:{n:"Movimiento prohibido",q:"Condición que impide mover hasta resolverla: no es avería.",a:"Hombre muerto: pulsar el joystick hacia abajo al mover. Autonivelación: pasar a ON. Portón / cadena / botonera / outriggers / lector: resolver la condición del aviso.",c:"ope"},
 aux:{n:"Equipo auxiliar conectado",q:"Equipo de servicio conectado o manguera desenrollada: la PBB se bloquea (no traslada).",a:"1º recoger o desconectar el equipo (400 Hz: terminar de enrollar desde el AO); 2º si persiste, señal de bloqueo en el PLC (P-A5 para 400 Hz).",c:"ope"},
 byp:{n:"Bypass / límites anulados",q:"Bypass activo: se ignoran límites o alarmas. Solo personal de mantenimiento o cualificado.",a:"Comprobar que el bypass se retira al terminar la maniobra.",c:"ope"},
 len:{n:"Velocidad lenta",q:"Próximo a un límite eléctrico: el movimiento pasa a velocidad lenta.",a:"Informativo. «Pasarela no calibrada» (344) = todo a velocidad lenta → calibración por especialista.",c:"ope"},
 avi:{n:"Detección de avión",q:"Presencia o contacto con el avión: velocidad lenta o parada.",a:"Informativo del atraque. Si sale sin avión: sensores de presencia / bumper de cabina.",c:"ope"},
 pre:{n:"Preposicionado",q:"Evento de preposicionado (abortado, alcanzado, no permitido).",a:"Informativo: se aborta al detectar avión, anticolisión o límite eléctrico.",c:"ope"},
 cal:{n:"Calibración",q:"Acceso a calibración activo.",a:"Calibración en curso o pendiente: especialista.",c:"esp"},
 inf:{n:"Informativa",q:"Aviso informativo: no necesita resolverse.",a:"Retorno autónomo / prioridad de retorno: la PBB funciona con SAI. Control remoto activo / RCC: pasarela en manos del puesto remoto.",c:"ope"},
 rem:{n:"Puesto remoto (RCC)",q:"Fallo del puesto de control remoto o de sus comunicaciones: NO es avería de la pasarela.",a:"Avisar a CGA / RCC. La operación desde la pasarela tiene prioridad: selector de REMOTO a LOCAL para operar en local.",c:"esp"}};
const GR=c=>{if(/^R/.test(c))return"rem";const n=+c;
 if(n<=5)return"fc";if([6,7,8,12,14,28,136].includes(n))return"eme";if([17,18,19,20].includes(n))return"ant";if(n>=24&&n<=26)return"mec";
 if(n==27||(n>=56&&n<=59))return"ana";if(n>=49&&n<=54||n==80)return"mot";if(n==55||n==79||(n>=83&&n<=88))return"var";
 if([60,107,109].includes(n))return"equ";if([61,62,76,120,121,126,127,128].includes(n))return"ten";
 if((n>=63&&n<=71)||n==74||n==77||n==122||(n>=111&&n<=114))return"aut";if([72,73,75,96,97,98,99].includes(n))return"zap";
 if(n==78||n==15||n==123||n==124)return"col";if([89,23,116,117,118,119].includes(n))return"plc";if(n>=129&&n<=135||n==103||n==104||n==105||n==106)return"con";
 if(n>=91&&n<=94)return"zon";if(n==100||n==101||n==102)return"joy";if(n==115)return"ope";if(n>=139&&n<=141)return"acc";if(n>=137&&n<=143)return"sir";
 if(n<=143)return"seg";
 if(n==241||n==243)return"est";if(n==242||n==256||n==270||n==271||n==273||n==352||n==353||n==260)return"pro";
 if((n>=244&&n<=255)||n==257||n==258)return"lim";if([263,265,266,267,272,274,281,282,283,285].includes(n))return"aux";
 if([337,343,350,351,354,355].includes(n))return"byp";if(n>=339&&n<=342||n==344)return"len";if(n==338)return"avi";
 if([261,262,264,268,347,348].includes(n))return"col";if([259,269,275,345,362,363].includes(n))return"pre";if((n>=276&&n<=280)||n==284)return"cal";
 if(n==294)return"bro";if(n>=358&&n<=361)return"ant";return"inf"};
const FAM=c=>/^R/.test(c)?"R":+c<=143?"A":"W";
/* v717: iconos propios de ALARMA (hexágono rojo con llave y destornillador) y ADVERTENCIA / aviso (triángulo amarillo con «!») */
const ICO=f=>f=="A"?`<img class="rcsico" src="iconos/alarma.png" alt="Alarma">`:f=="W"?`<img class="rcsico" src="iconos/advertencia.png" alt="Advertencia">`:"🔵";
window.rcsIco=ICO;
const FN={A:[ICO("A"),"ALARMA","Avería / seguridad: intervención en campo"],W:[ICO("W"),"ADVERTENCIA","La resuelve el operador: no es avería si se borra al corregir la causa"],R:["🔵","PUESTO REMOTO","Fallo del RCC o comunicaciones, no de la pasarela"]};
const ALIAS={"057":"medida analogica extension|laser extension","056":"medida analogica altura|ultrasonido altura","058":"medida analogica giro cabina|potenciometro cabina","059":"medida analogica giro rotonda|potenciometro rotonda",
 "115":"wrong docking|atraque incorrecto","354":"bypass atraque incorrecto","273":"estabilizadores bajados","352":"posicionando estabilizador","081":"inductivos estabilizadores",
 "017":"antiatrapamiento izquierdo tunel interior","018":"antiatrapamiento derecho tunel interior","019":"antiatrapamiento izquierdo tunel medio","020":"antiatrapamiento derecho tunel medio",
 "010":"bumper traslacion|bordes ruedas","285":"manguera agua potable","263":"400 hz conectado","272":"manguera 400 hz desenrollada|manguera 400 hz extendida","256":"hombre muerto","294":"barrera rotonda|haz cortado|fotocelula rotonda|r-b1|r-b2|r-b3|r-b4"};
const NO={"242":/sensor|c-?s9|enrollable/,"241":/fallo/};
const CAT=TXT.split("\n").map(l=>{const [c,t]=l.split("|");const g=GR(c);return{c,t,f:FAM(c),g,n:nrm(t+" "+(ALIAS[c]||"").replace(/\|/g," "))}});
window.RCS_AL=CAT;window.RCS_G=G;/* v586: grupos (qué es · qué hacer) para la primera actuación integral */
const porCod=c=>{c=String(c).toUpperCase();if(/^\d{1,3}$/.test(c))c=c.padStart(3,"0");return CAT.find(x=>x.c==c)};
/* ---------- sinónimos del manual (solo para el análisis; no cambian lo escrito) ---------- */
const SIN=[[/\blongitud\b/,"extension"],[/\bti\b/,"tunel interior"],[/\btm\b/,"tunel medio"],[/\boutriggers?\b/,"estabilizadores"],[/wrong docking/,"atraque incorrecto"],[/\brcc\b/,"puesto remoto"],[/\bpwc\b/,"manguera agua potable"]];
const sinon=t=>{const n=nrm(t);return SIN.filter(([r])=>r.test(n)).map(([,s])=>s).join(" ")};
/* ---------- detección de códigos en un texto ---------- */
const STOP=new Set("de del la el en los las por con y a fallo activado activada".split(" "));
const pal=t=>t.split(/[^a-z0-9]+/).filter(w=>w.length>=2&&!STOP.has(w));
function detecta(txt){const t=nrm(txt);if(!t.trim())return[];const out=new Map();
 /* por número con prefijo: «alarma 115», «AL 057», «aviso nº 250», «adv. 256», «cód. 141» */
 /* v704: lo reconocido por número se quita del texto antes de buscar por palabras: «004 Límite FC de extensión-retracción»
    ya no arrastra 250 «Límite de extensión» ni 251 «Límite de retracción» */
 let tr=t;
 tr=tr.replace(/\b(?:alarmas?|al|aviso|evento|adv(?:ertencia)?|cod(?:igo)?|magelis)\.?\s*(?:n[ºo°]\.?\s*)?[:#-]?\s*(r?\d{3}|r\d{1,2})\b/g,(m,c)=>{const x=porCod(c);if(x){out.set(x.c,{x,por:"num"});return" · "}return m});
 /* número suelto al principio de la línea con el texto detrás («057 Fallo medida…») */
 tr=tr.replace(/(^|[\n·;])\s*(\d{3})\s*[|:.-]?\s+([a-z][^\n·;]{4,})/g,(m,p0,c,r)=>{const x=porCod(c);if(x&&pal(r).some(w=>x.n.includes(w))){out.set(x.c,{x,por:"num"});return p0+" "}return m});
 /* por texto: todas las palabras del texto oficial (o de su alias) están en el aviso */
 const W=new Set(pal(tr+" "+sinon(tr)));const tiene=w=>W.has(w)||[...W].some(v=>v.length>=5&&w.length>=5&&v.slice(0,5)==w.slice(0,5));
 let mejor=[];CAT.forEach(x=>{if(out.has(x.c)||(NO[x.c]&&NO[x.c].test(tr)))return;
  const vari=[pal(nrm(x.t)).filter(w=>!/^\d+$/.test(w)||w.length>1)].concat(ALIAS[x.c]?ALIAS[x.c].split("|").map(pal):[]);
  vari.forEach(ws=>{if(ws.length<2)return;if(ws.every(tiene))mejor.push({x,s:ws.length})})});
 mejor.sort((a,b)=>b.s-a.s);const top=mejor.length?mejor[0].s:0;
 mejor.filter(m=>m.s==top).forEach(m=>{if(!out.has(m.x.c))out.set(m.x.c,{x:m.x,por:"txt"})});
 /* familia del mismo texto repetido (001/002, 008/028): quedarse con uno */
 /* v705: las alarmas escritas con número (varias sumadas) cuentan TODAS; las deducidas por texto, como mucho 3 */
 const vistos=new Set();const num=[...out.values()].filter(o=>o.por=="num");num.forEach(o=>vistos.add(o.x.t));
 return num.concat([...out.values()].filter(o=>o.por!="num").filter(o=>{const k=o.x.t;if(vistos.has(k))return false;vistos.add(k);return true}).slice(0,3))}
window.rcsDetecta=detecta;
const textoOT=i=>[i.desc,i.def,i.com,i.alMag,i.alarmas&&(typeof i.alarmas=="string"?i.alarmas:JSON.stringify(i.alarmas).replace(/[{}\[\]"]/g," "))].filter(Boolean).join(" · ");
/* ---------- recuadro de un código ---------- */
const caja=(o,compacta)=>{const x=o.x,g=G[x.g],[ic,fam,fs]=FN[x.f];
 return`<div class="rcsb rcs${x.f}"><div class="rcsh"><span class="rcsf">${ic} ${fam}</span><b>${E(x.c)}</b> ${E(x.t)}</div>
 <div class="rcsg">${E(g.n)} · <span class="mu">${E(fs)}</span></div>
 ${compacta?"":`<div class="rcsq">${E(g.q)}</div>`}<div class="rcsa">➜ ${E((window.RCS_AA||{})[x.c]||g.a)}</div>${x.f=="A"&&!compacta?`<div class="rcsr">${E(REARME)}</div>`:""}${enlaces(x)}</div>`};
window.rcsCaja=caja;
/* ---------- v502: enlace a la página del manual RCS subido a Planos ---------- */
const PEXP={fc:34,lim:34,len:107,ope:84,eme:44,acc:24,pro:106,aux:106,byp:106,avi:107,col:107,pre:86,inf:106,est:106,rem:108};
const pagLista=c=>/^R/.test(c)?110:+c<=76?108:+c<=261?109:110;
window.rcsPag=async function(n){let l=[];try{l=await allPdf()}catch(e){}
 const d=(l||[]).find(x=>/manual.?rcs|max.?automate|f8.?690/i.test(x.name))||(l||[]).find(x=>/manual/i.test(x.name)&&/rcs/i.test(x.name));
 if(!d){msg("Sube el «Manual RCS» en la pestaña Planos");return}
 try{if(typeof gDocs!="undefined")gDocs=null}catch(e){}
 gPagIni=+n||1;await ver(d.id)};
const enlaces=x=>{const ex=PEXP[x.g]||(x.f=="A"?104:105),li=pagLista(x.c);
 return`<div class="rcsp"><button type="button" class="sec" onclick="event.stopPropagation();rcsPag(${li})">📖 Manual pág. ${li}</button>${ex!=li?`<button type="button" class="sec" onclick="event.stopPropagation();rcsPag(${ex})">📖 Explicación pág. ${ex}</button>`:""}</div>`};
/* ---------- 1) guía de la OT ---------- */
if(typeof vTec=="function"){const o=vTec;vTec=function(){
 const i=(typeof gOT!="undefined"&&gOT&&Array.isArray(inc))?inc.find(x=>x.id==gOT):null;let L=[],ori=null;
 if(i){try{L=detecta(textoOT(i));const ext=L.filter(z=>z.por=="num").map(z=>z.x.t).join(" · ");const sn=sinon(textoOT(i));
  /* el análisis de la guía lee el texto oficial del código y los sinónimos del manual (sin guardarlo en la OT) */
  if(ext||sn){ori=i.desc;i.desc=[i.desc,ext,sn].filter(Boolean).join(" · ")}}catch(e){}}
 let r;try{r=o.apply(this,arguments)}finally{if(ori!==null&&i)i.desc=ori}
 try{const app=document.getElementById("app");if(i&&L.length&&app&&!app.querySelector(".rcsw")){
  const w=document.createElement("div");w.className="card rcsw";
  w.innerHTML=`<div class="rcst">📘 Código del manual RCS</div>${L.map(z=>caja(z)).join("")}`;
  const ref=document.getElementById("anag");if(ref)ref.before(w);else{const c=app.querySelector("select[onchange^='gOT=']");const cd=c&&c.closest(".card");cd?cd.after(w):app.prepend(w)}}}catch(e){}
 return r}}
/* ---------- 2) SOS: buscador de códigos ---------- */
const busca=q=>{q=nrm(q).trim();if(!q)return[];const n=q.replace(/^r?0*/,"");
 if(/^r?\d{1,3}$/.test(q)){return CAT.filter(x=>x.c.replace(/^R?0*/,"").startsWith(n)&&(/^r/.test(q)?/^R/.test(x.c):true)).slice(0,8)}
 const ws=pal(q+" "+sinon(q));return CAT.filter(x=>ws.every(w=>x.n.includes(w)||x.n.split(/\W+/).some(v=>v.startsWith(w)))).slice(0,8)};
/* v563: SOS · fila con dos buscadores: a la izquierda el COMPONENTE de campo (código o nombre) y a la derecha la ALARMA RCS.
   · Alarma: al tocar la caja sale el desplegable con todos los avisos y alarmas del manual RCS (por familias); al escribir se
     filtra. Al elegir una: se pone en «alarma a mano», sale su recuadro y se abre el componente de campo que falla (si hay
     varios, el catálogo acotado a ellos).
   · Componente: admite mayúsculas o minúsculas, sin guiones ni puntos y la letra O por el cero (eq24, EQ 24, es0.1, esO1).
     Si falta un 0 delante (es1 → E-S0.1) avisa de cuál puede ser. */
const ckey=t=>String(t||"").toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/O/g,"0").replace(/[^A-Z0-9]/g,"");
const ckey0=t=>String(t||"").toUpperCase().replace(/O/g,"0").split(/[^A-Z0-9]+/).map(p=>p.replace(/(^|[A-Z])0+(?=\d|$)/g,"$1")).join("");
const COMPS=()=>window.COMP_CAMPO||[];
const ckClave=c=>String(c.baseId||c.db||c.id);
const ckIds=c=>String(c.id||"").split(/\s*\/\s*/).map(x=>x.replace(/^(ACOPL\.?\s*)/i,"").trim()).filter(Boolean);
function compBusca(q){const raw=String(q||"").trim();if(!raw)return{L:[],avisa:[]};const k=ckey(raw),k0=ckey0(raw),n=nrm(raw);
 const ex=[],cero=[],pre=[],txt=[];
 COMPS().forEach(c=>{const ids=ckIds(c).concat([c.id]);
  if(ids.some(i=>ckey(i)==k))ex.push(c);
  else if(k0&&ids.some(i=>ckey0(i)==k0))cero.push(c);
  else if(k.length>=2&&/\d/.test(k)&&ids.some(i=>ckey(i).startsWith(k)))pre.push(c);
  else if(n.length>=3){const T=nrm([c.id,c.t,c.fab,c.claves].join(" "));if(n.split(/\s+/).every(w=>T.includes(w)))txt.push(c)}
  else if(k.length>=2&&ids.some(i=>ckey(i).startsWith(k)))pre.push(c)});
 /* sin la O→0 en el texto: «sirena», «potenciometro» */
 return{L:ex.concat(cero,pre,txt).slice(0,12),avisa:ex.length?[]:cero}}
window.compBuscaSOS=compBusca;
/* componentes en que interviene una alarma: ficha con esa alarma, cotejo automático o texto de la alarma */
function compDeAlarma(x){const out=new Map();const add=c=>{if(c)out.set(ckClave(c),c)};const cod=x.c;
 COMPS().forEach(c=>{const fila=(c.esp||[]).find(r=>/^alarmas?\s*\/?\s*eventos/i.test(r[0]||""));
  if(fila){if(new RegExp("(^|[^0-9R])"+cod+"([^0-9]|$)").test(String(fila[1]).toUpperCase()))add(c);return}
  try{if(typeof compAlarmasDe=="function"&&compAlarmasDe({codigo:c.id,titulo:c.t,fab:c.fab,claves:c.claves,esp:c.esp}).some(a=>a.c==cod))add(c)}catch(e){}});
 try{if(typeof compCampo=="function")compCampo(x.t+" "+(ALIAS[x.c]||"").replace(/\|/g," ")).forEach(add)}catch(e){}
 return[...out.values()]}
window.compDeAlarma=compDeAlarma;
/* v704: COMPONENTES DE CAMPO QUE INTERVIENEN en una alarma, sacados de los PLANOS (rev. J) y no por parecido de texto:
   1) canales del PLC que llevan esa alarma (CANAL_AL): manda el canal más específico (p. ej. 004 → solo E-A8 6.1);
      se añaden los canales cuya señal nombra el mismo movimiento (004 → detectores de extensión/retracción de E-A2,
      que son la CAUSA PRINCIPAL de que se pise el FC: límite de trabajo que no corta).
   2) de cada canal (CABLEADO) se toma la cadena real: elemento de campo → borneros de paso (sin el común +24 V) → módulo.
   3) si el canal no tiene elemento dibujado (analógicas de E-A4), el elemento sale de la actuación propia (RCS_AA).
   Cada uno se enlaza a su ficha si está incorporado en Componentes de campo; si no, se muestra con los datos de planos. */
const nr5=t=>nrm(t).split(/[^a-z0-9]+/).filter(w=>w.length>=5).map(w=>w.slice(0,5));
const limpiaId=t=>String(t||"").replace(/^\+/,"").replace(/'+/g,"").replace(/\(([^)]*)\)/," ($1)").trim();
function intervienen(x){const CA=window.CANAL_AL||{},CB=window.CABLEADO||{},PL=window.COMP_PLANOS||[],AA=window.RCS_AA||{};if(!x)return[];
 const cod=x.c;const ks=Object.keys(CA).filter(k=>CA[k].includes(cod));if(!ks.length)return[];
 const min=Math.min(...ks.map(k=>CA[k].length));const pw=nr5(x.t+" "+(ALIAS[cod]||"").replace(/\|/g," ")).filter(w=>!/^(limit|fallo|activ|segur|medid|analo)$/.test(w));
 const ent=[];ks.forEach(k=>{const [m,b,c]=k.split("|");Object.keys(CB).forEach(ck=>{const e=CB[ck];if(!e||e.m!=m||e.b!=b||(c&&e.c!=c))return;
  const pri=CA[k].length==min;const casa=pw.some(w=>nr5(e.d).includes(w));if(pri||casa)ent.push({k,e,pri})})});
 const out=new Map();
 const add=(id,rol,det,pri,f)=>{id=limpiaId(id);if(!id||/^-|CLEMA/i.test(id))return;const o=out.get(id)||{id,rol,det:[],pri,f};
  if(det&&!o.det.includes(det))o.det.push(det);o.pri=o.pri||pri;out.set(id,o)};
 const tipoE=(t,ps)=>!ps||!ps.length?"":/-S\d/.test(t)?"contacto "+ps.slice().sort().join("-"):"pines "+ps.slice().sort().join("-");
 [true,false].forEach(P=>ent.filter(z=>z.pri==P).forEach(({k,e})=>{let hay=false;
  (e.n||[]).forEach(n=>{if(n.k=="E"){hay=true;add(n.t,"campo",tipoE(n.t,n.ps),P,n.f);const o=out.get(limpiaId(n.t));if(o&&!o.dc)o.dc=e.d}});
  /* canal sin elemento dibujado: el sensor de la actuación propia de las alarmas del canal */
  /* v710: canal sin elemento dibujado (analógicas de E-A4): los elementos salen de la actuación propia de ESTA alarma (o de la
     primera del canal que la tenga) y de la nota del plano; se añaden TODOS (058: potenciómetro C-R10 y convertidor E-R10) */
  if(!hay){const a=AA[x.c]&&(CA[k]||[]).includes(x.c)?x.c:(CA[k]||[]).find(q=>AA[q]);const tx=[a?AA[a]:"",...(e.n||[]).map(n=>n.x||"")].join(" ");
   const m=tx.match(/\b[A-Z]{1,3}-[A-Z]{1,2}\d+(?:\.\d+)?\b/g)||[];
   [...new Set(m)].filter(id=>!/-X\d|^[EP]-A\d/.test(id)).forEach(id=>add(id,"campo",/^E-R\d/.test(id)?"convertidor → 4-20 mA":/-R\d/.test(id)&&tx.includes("E-R10")&&/^C-/.test(id)?"potenciómetro 10 kΩ, cables 1-2-3 (E-W9 → E-X65)":/-R\d/.test(id)?"potenciómetro / transmisor 4-20 mA":"sensor 4-20 mA",P))}}));
 ent.forEach(({e,pri})=>(e.n||[]).forEach(n=>{if(n.k!="B")return;if((n.v||[]).some(v=>v.h=="189"||/^189\b/.test(v.d||"")))return;
  /* un aparato con bornas (E-R10…) no es un bornero: va como elemento con su borna */
  if(!/-X\d/.test(String(n.t||""))){add(n.t,"campo","borna "+n.p,pri,n.f);return}add(n.t,"borna","borna "+n.p,pri,n.f)}));
 /* bornero por el que entra el elemento al armario según la nota del plano (058: E-X65) */
 ent.forEach(({e,pri})=>(e.n||[]).forEach(n=>{if(!n.x)return;(n.x.match(/\b[A-Z]{1,3}-X\d+(?:\.\d+)?\b/g)||[]).forEach(b=>{if(b!="E-X68")add(b,"borna","",pri,n.f)})}));
 ent.forEach(({e,pri})=>add(e.m,"modulo","entrada "+e.b+(e.k?" ("+e.k+")":"")+(e.d?" · "+String(e.d).toLowerCase():""),pri,e.f));
 const fc=x.g=="fc";
 /* v710: fichas que acompañan a un elemento (acoplamiento elástico de C-R10…): se suman como elemento de campo */
 [...out.values()].filter(o=>o.rol=="campo").forEach(o=>{const base=ckey(o.id.split(" ")[0]);
  COMPS().filter(c=>ckIds(c).some(i=>ckey(i)==base)&&ckey(c.id)!=base).forEach(c=>{const id=String(c.id).trim();if(!out.has(id))out.set(id,{id,rol:"campo",det:["acoplamiento / accesorio de "+o.id],pri:o.pri,f:o.f,acc:c})})});
 return[...out.values()].map(o=>{if(o.acc)return Object.assign(o,{r:null,c:o.acc,papel:"Accesorio del elemento de campo",nom:o.acc.t,ubi:"",folio:o.f});const r=PL.find(z=>String(z[0]).toUpperCase()==o.id.split(" ")[0].toUpperCase())||null;
  const c=COMPS().find(z=>ckIds(z).concat([z.id]).some(i=>ckey(i)==ckey(o.id.split(" ")[0])))||null;
  const papel=o.rol=="campo"?(fc?(o.pri?"Final de carrera de seguridad (el que se pisa)":"Límite de trabajo · causa principal"):(o.pri?"Elemento de campo":"Elemento de campo relacionado")):o.rol=="borna"?"Bornero de paso de la señal":(/^E-A[89]$|^E-A10$/.test(o.id)?"Módulo de seguridad (amarillo)":"Módulo del PLC");
  /* símbolo genérico del plano con calificador («IT-S3''(INF)» en antiatrapamientos y frenos de cabina): no es el IT-S3 del
     catálogo de planos; se nombra por la señal del canal */
  if(/\(/.test(o.id)){const q=(o.id.match(/\(([^)]*)\)/)||[])[1]||"";const d=String(o.dc||"").toLowerCase();
   return Object.assign(o,{r:null,c:null,papel,nom:"FC "+(d||"de seguridad")+(q?" · "+q.toLowerCase():""),ubi:"",folio:o.f})}
  const ubi=r?r[2]:"";return Object.assign(o,{r,c,papel:o.rol=="campo"&&!fc&&/armario/i.test(ubi)?"Aparato en el armario eléctrico":papel,nom:c?c.t:r?r[1]:"",ubi,folio:r?r[3]:o.f})})
  .sort((a,b)=>{const ord=z=>(z.rol=="campo"?(z.acc?0.3:/armario/i.test(z.ubi||"")?0.6:0):z.rol=="borna"?2:3)+(z.rol=="campo"&&!z.pri?1:0);return ord(a)-ord(b)})}
window.rcsIntervienen=x=>{try{return intervienen(typeof x=="string"?porCod(x):x)}catch(e){console.warn("rcsIntervienen",e);return[]}};
/* v705: «1 · SACAR EN SERVICIO YA» de UNA alarma según planos (canal más específico de CANAL_AL + CABLEADO rev. J):
   · entrada de seguridad (módulos amarillos E-A8 / E-A9 / E-A10): puente provisional IN n.1 ↔ UT n.2 del canal, en MANUAL
     y con compañero vigilando (no en la barrera de rotonda, que no se puentea);
   · setas: no se puentean (soltar la seta y OFF → ON); medidas 4-20 mA (E-A4): no se puentean;
   · advertencias / límites de trabajo: los resuelve el operador (mover en sentido contrario);
   · resto: actuación del grupo del manual. */
window.rcsSacar=function(x){if(typeof x=="string")x=porCod(x);if(!x)return null;const g=G[x.g]||{};const aa=(window.RCS_AA||{})[x.c]||g.a||"";
 const CA=window.CANAL_AL||{},CB=window.CABLEADO||{};const ks=Object.keys(CA).filter(k=>CA[k].includes(x.c));
 const min=ks.length?Math.min(...ks.map(k=>CA[k].length)):0;const pri=ks.filter(k=>CA[k].length==min);
 const SDI=/^E-A(8|9|10)$/;const out={x,tipo:"txt",txt:aa,cro:[]};
 if(x.g=="eme"){out.tipo="seta";out.txt="Las setas NO se puentean. "+g.a;return out}
 /* v709: medidas analógicas · ACTUACIÓN RÁPIDA DE CAMPO con puente provisional de resistencia (croquis de CROQ_AN, guía de campo
    «Medidas analógicas» · Observaciones). La altura (056, ultrasonido C-B14) no se puentea. */
 const AN={"057":{k:["ext"],p:["Extensión (AI02): en E-X62 soltar y aislar el BK de E-W13 (láser ET-B9) de la borna 4 y poner una resistencia de 2,2 kΩ 1 W entre E-X62:1 (+24 V) y E-X62:4 → ≈11 mA fijos en AI02."]},
  "059":{k:["rot"],p:["Rotonda (AI04, no en 504/507/508): en E-X62 soltar y aislar la señal de EIT-W4 (potenciómetro R-R1) de la borna 5 y poner 2,2 kΩ 1 W entre E-X62:1 y E-X62:5 → ≈11 mA fijos en AI04. En 504/508 la rotonda va por el encoder R-R10 en red: no hay puente analógico."]},
  "058":{k:["cab","pot"],p:["Cabina · convertidor E-R10 averiado o sin saber cuál falla: sacar el hilo 315 de E-R10:7, empalmarlo aislado a una 2,2 kΩ 1 W y la otra patilla a E-R10:10 (+24 V) → ≈11 mA fijos en AI03 (la 7 queda libre).",
   "Cabina · potenciómetro C-R10 averiado con E-R10 bien (24 V en 10-11): en E-X65 soltar y aislar E-W9 (1-2-3) y poner dos resistencias de 4,7 kΩ entre 1-2 y 2-3 → el convertidor lee el cursor a mitad de giro. La cabina queda con ángulo FIJO para el PLC: girarla solo en MANUAL y a la vista."]}};
 if(x.g=="ana"&&AN[x.c]){out.tipo="anap";out.cro=[];out.an=AN[x.c];out.txt=aa;return out}
 if(x.g=="ana"){out.tipo="ana";out.txt="Medida 4-20 mA: la altura NO se puentea. "+aa;return out}
 if(x.g=="bro"){out.tipo="nopte";out.txt=g.a;return out}
 if(x.f=="W"){out.tipo="op";out.txt=g.a;return out}
 if(x.f=="R"){out.tipo="rem";out.txt=g.a;return out}
 pri.forEach(k=>{const [m,b]=k.split("|");if(!SDI.test(m))return;Object.keys(CB).forEach(ck=>{const e=CB[ck];if(!e||e.m!=m||e.b!=b)return;
  const M=(e.n||[]).find(n=>n.k=="M"&&n.p);const b2=M?M.p:b.replace(/\.1$/,".2");const ut=(M&&M.l)||(Object.values(CB).find(z=>z.m==m&&z.b==b2)||{}).k||"UT";
  const el=(e.n||[]).filter(n=>n.k=="E").map(n=>limpiaId(n.t)).filter((v,i,A)=>A.indexOf(v)==i);
  if(!out.cro.some(o=>o.mod==m&&o.b1==b))out.cro.push({mod:m,b1:b,b2,k1:e.k||"IN",k2:ut,d:`${x.c} · ${String(e.d||x.t).replace(/^F\.C\./i,"FC")}${el.length?" · "+el.join(" / "):""}`,el,sd:String(e.d||"")})})});
 if(out.cro.length)out.tipo="puente";return out};
/* bloque «Componentes de campo que intervienen» (SOS y validación) */
function bloqueInterv(x,L,varias){if(!L.length)return`<div class="rcscf rcsnada">🔩 Sin componentes de campo asociados a la alarma ${E(x.c)} en los planos.</div>`;
 return`<div class="rcscf"><div class="rcscft">🔩 Componentes de campo que intervienen</div>${L.map(o=>{
  const sub=[varias&&o.als?"alarma "+o.als.join(" / "):"",o.papel,o.det.join(" · "),o.ubi,o.folio?"folio "+o.folio:""].filter(Boolean).join(" · ");
  return o.c?`<button type="button" class="rcscb rcsi rcsi-${o.rol}" data-k="${E(ckClave(o.c))}"><span class="cmpid">${E(o.id)}</span> ${E(o.nom)}<small>${E(sub)} · ver ficha ›</small></button>`
   :`<div class="rcscb rcsi rcsi-${o.rol} rcsnf"><span class="cmpid">${E(o.id)}</span> ${E(o.nom||"Según planos")}<small>${E(sub)} · 📐 de planos (sin ficha)</small></div>`}).join("")}</div>`}
window.rcsBloqueInterv=(x,L,varias)=>bloqueInterv(typeof x=="string"?porCod(x):x,L||window.rcsIntervienen(x),varias);
const itAl=x=>`<button type="button" class="rcsit rcs${x.f}" data-c="${x.c}">${FN[x.f][0]} <b>${x.c}</b> ${E(x.t)}</button>`;
const todasAl=()=>[["A",ICO("A")+" Alarmas"],["W",ICO("W")+" Advertencias"],["R","🔵 Puesto remoto"]].map(([f,t])=>`<div class="rcslg">${t}</div>`+CAT.filter(x=>x.f==f).map(itAl).join("")).join("");
/* v705: lista de alarmas de la caja «Alarma a mano», una por línea (por número o por texto del manual), sin repetir */
function listaAl(txt){const out=[];String(txt||"").split(/\n+/).forEach(li=>{if(!li.trim())return;
 let D=[];const m=li.trim().match(/^(R?\d{1,3})\b/i);const x0=m&&porCod(m[1]);if(x0)D=[{x:x0}];else D=detecta(li);
 D.forEach(z=>{if(!out.some(y=>y.c==z.x.c))out.push(z.x)})});return out}
window.rcsListaAl=listaAl;
/* componentes que intervienen en VARIAS alarmas: se suman sin repetir y se anota en qué alarmas interviene cada uno */
window.rcsIntervUnion=function(X){/* v710 */const M=new Map();(X||[]).forEach(x=>{if(typeof x=="string")x=porCod(x);if(!x)return;
 window.rcsIntervienen(x).forEach(o=>{const k=o.id;const p=M.get(k);if(p){if(!p.als.includes(x.c))p.als.push(x.c);o.det.forEach(d=>{if(!p.det.includes(d))p.det.push(d)});if(o.pri&&!p.pri){p.pri=true;p.papel=o.papel}}
  else M.set(k,Object.assign({},o,{det:o.det.slice(),als:[x.c]}))})});
 const ord=z=>(z.rol=="campo"?(z.acc?0.3:/armario/i.test(z.ubi||"")?0.6:0):z.rol=="borna"?2:3)+(z.rol=="campo"&&!z.pri?1:0);return[...M.values()].sort((a,b)=>ord(a)-ord(b))};
function sosPon(){const sc=document.getElementById("sheetc");if(!sc)return;const sel=sc.querySelector("#sr_a");if(!sel||sc.querySelector("#rcs_q"))return;
 const lab=sel.previousElementSibling;const fila=sel.closest(".soscr2");
 const d=document.createElement("div");d.className="rcsbus";
 d.innerHTML=`<div class="rcsfil"><div class="rcsbi rcscmp"><input id="cmp_q" type="search" autocomplete="off" autocapitalize="characters" enterkeyhint="search" placeholder="🔩 Componente"></div>
 <div class="rcsbi"><input id="rcs_q" type="search" autocomplete="off" enterkeyhint="search" placeholder="🔎 Nº o texto de la alarma (manual RCS)"></div></div>
 <div id="cmp_l"></div><div id="rcs_l"></div><div id="rcs_s"></div>`;
 if(fila)fila.before(d);else(lab&&lab.tagName=="LABEL"?lab:sel).before(d);
 const q=d.querySelector("#rcs_q"),l=d.querySelector("#rcs_l"),s=d.querySelector("#rcs_s"),cq=d.querySelector("#cmp_q"),cl=d.querySelector("#cmp_l");
 /* --- alarma: desplegable completo al tocar, filtrado al escribir --- */
 const pinta=()=>{cl.innerHTML="";const v=q.value.trim();l.innerHTML=v?(busca(v).map(itAl).join("")||`<div class="rcsnada">Sin alarmas para «${E(v)}»</div>`):todasAl();l.classList.add("on");l.scrollTop=0};
 q.addEventListener("focus",pinta);q.addEventListener("click",()=>{if(!l.classList.contains("on"))pinta()});q.addEventListener("input",pinta);
 q.addEventListener("keyup",e=>{if(e.key=="Enter"){const R=busca(q.value);if(R.length==1)elige(R[0])}});
 /* v705: las alarmas se SUMAN: cada una elegida (buscador o desplegable de la Magelis) se añade en una línea nueva de «Alarma a
    mano»; aquí salen todas, una debajo de otra (con ✕ para quitarla), y los componentes de campo que intervienen se van sumando
    (sin repetir). Al ACEPTAR se validan todas. */
 const ta=()=>sc.querySelector("#sr_t");
 const elige=x=>{const t=ta();if(t){const ya=listaAl(t.value).some(z=>z.c==x.c);
   if(!ya)t.value=[t.value.replace(/\s+$/,""),`${x.c} ${x.t}`].filter(Boolean).join("\n");
   t.rows=Math.min(8,Math.max(2,t.value.split("\n").length+1));const dt=t.closest("details");if(dt)dt.open=true;if(ya&&typeof msg=="function")msg(`La alarma ${x.c} ya está incluida`)}
  q.value="";q.blur();l.innerHTML="";l.classList.remove("on");pintaTodo()};
 const quita=c=>{const t=ta();if(!t)return;t.value=t.value.split(/\n/).filter(li=>!listaAl(li).some(z=>z.c==c)).join("\n").trim();pintaTodo()};
 const pintaTodo=()=>{const t=ta();const X=listaAl(t?t.value:"");
  if(!X.length){s.innerHTML="";delete s.dataset.cod;return}
  const L=window.rcsIntervUnion(X);
  s.innerHTML=(X.length>1?`<div class="rcscft rcsnal">📋 ${X.length} alarmas para el análisis</div>`:"")+
   X.map(x=>`<div class="rcsacu">${caja({x},true)}<button type="button" class="rcsqx" data-c="${E(x.c)}" aria-label="Quitar la alarma ${E(x.c)}">✕</button></div>`).join("")+bloqueInterv(X[0],L,X.length>1);
  s.dataset.cod=X.map(x=>x.c).join(",");
  s.querySelectorAll(".rcsqx").forEach(b=>b.onclick=e=>{e.stopPropagation();quita(b.dataset.c)});
  s.querySelectorAll("button.rcscb").forEach(b=>b.onclick=()=>{if(typeof abreCompClaves=="function")abreCompClaves([b.dataset.k],"Alarmas "+s.dataset.cod)})};
 window.__rcsPintaTodo=pintaTodo;
 /* papelera de reiniciar, historial…: si la caja cambió por código, se vuelve a pintar */
 sc.addEventListener("click",()=>setTimeout(()=>{const t=ta();const k=listaAl(t?t.value:"").map(x=>x.c).join(",");if(k!=(s.dataset.cod||""))pintaTodo()},120));
 /* lo escrito a mano en la caja también se refleja (por número o texto del manual) */
 {const t=ta();if(t){let tt=0;t.addEventListener("input",()=>{clearTimeout(tt);tt=setTimeout(pintaTodo,500)});if(t.value.trim())pintaTodo()}}
 /* la alarma elegida en el desplegable «Elige la alarma de la Magelis» se suma igual y el desplegable queda libre para otra */
 sel.addEventListener("change",()=>{const v=sel.value?sel.options[sel.selectedIndex].text:"";/* el texto de la opción trae el canal del módulo («ET-S1 · E-A8 6.1»): manda la alarma de ese canal */
  const mc=v.match(/\b([EP]-A\d+)\s+(\d\.\d)\b/);const Lc=mc&&(window.CANAL_AL||{})[mc[1]+"|"+mc[2]]||[];
  const xc=Lc.length?porCod(/superior/i.test(v)&&Lc[1]?Lc[1]:Lc[0]):null;
  const D=xc?[{x:xc}]:v?detecta(v+" "+sel.value):[];
  if(D.length){elige(D[0].x);sel.value=""}});
 l.addEventListener("click",e=>{const b=e.target.closest(".rcsit");if(!b)return;const x=porCod(b.dataset.c);if(x)elige(x)});
 /* --- componente --- */
 const abreC=c=>{cq.blur();cl.innerHTML="";if(typeof abreCompClaves=="function")abreCompClaves([ckClave(c)],"Componente "+c.id);else if(typeof abreCompTag=="function")abreCompTag(c.id)};
 const pintaC=enter=>{if(document.activeElement===cq){l.innerHTML="";l.classList.remove("on")}const v=cq.value.trim();if(!v){cl.innerHTML="";return}
  const {L,avisa}=compBusca(v);
  if(enter&&L.length==1&&!avisa.length){abreC(L[0]);return}
  cl.innerHTML=(avisa.length?`<div class="cmpav">⚠️ No hay «${E(v.toUpperCase())}». Falta un 0 delante: ¿es ${avisa.map(c=>`<b>${E(c.id)}</b>`).join(" o ")}?</div>`:"")+
   (L.length?L.map(c=>`<button type="button" class="rcscb" data-k="${E(ckClave(c))}"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}${c.fab?`<small>${E(c.fab)}</small>`:""}</button>`).join("")
   :`<div class="rcsnada">Sin componente «${E(v)}» en el catálogo${typeof nombreElemento=="function"&&nombreElemento(v.toUpperCase())?" ("+E(nombreElemento(v.toUpperCase()))+")":""}.</div>`);
  cl.querySelectorAll(".rcscb").forEach(b=>b.onclick=()=>{const c=COMPS().find(z=>ckClave(z)==b.dataset.k);if(c)abreC(c)})};
 let tc=0;cq.addEventListener("input",()=>{clearTimeout(tc);tc=setTimeout(()=>pintaC(false),200)});
 cq.addEventListener("keyup",e=>{if(e.key=="Enter")pintaC(true)});cq.addEventListener("focus",()=>{l.innerHTML="";l.classList.remove("on")});
 /* tocar fuera cierra el desplegable de alarmas */
 sc.addEventListener("click",e=>{if(!e.target.closest(".rcsbus")){l.innerHTML="";l.classList.remove("on")}})}
/* ---------- 2b) v712-v714: ALARMAS DE LA MAGELIS EN LA OT (manual RCS), como en el SOS ----------
   · Registrar OT (bajo la descripción) y Editar registro (bajo la descripción): buscador con el desplegable de todas las
     alarmas, advertencias y eventos por familias, filtrado al escribir; se suman varias (✕ para quitar) y salen sus cajas y
     los componentes de campo que intervienen.
   · Se guardan en la OT aparte de la descripción (que es el aviso de CGA): i.alMag (una por línea) e i.alCod (la primera).
     (i.alarmas ya lo usa el AAP; v714 pasa lo de v712 a alMag.)
   · En la ficha de la OT salen como chips con su familia, debajo de la descripción. Las usan la guía de campo, la primera
     actuación según planos y el cierre CGA. */
const alMagDe=i=>{if(!i)return[];const t=i.alMag||(typeof i.alarmas=="string"?i.alarmas:"");return t?listaAl(t):[]};
window.rcsAlMagDe=alMagDe;
/* v716: nombre propio (antes «picker», que la función del cierre CGA de más abajo pisaba: en Registrar OT se abría sin
   parar la ventana «Código de alarma · familia» y no se podía registrar) */
function otPicker(anchor,pre,X0,tit){const d=document.createElement("div");d.className="rcsbus otrcs";d.id=pre;
 d.innerHTML=`<label>${tit} <small>(manual RCS · opcional, se pueden sumar varias)</small></label>
 <div class="rcsbi"><input id="${pre}_q" type="search" autocomplete="off" enterkeyhint="search" placeholder="🔎 Nº o texto de la alarma o evento"></div>
 <div id="${pre}_l" class="otrcsl"></div><div id="${pre}_s"></div>`;
 anchor.insertAdjacentElement("afterend",d);d.sel=(X0||[]).slice();
 const q=d.querySelector(`#${pre}_q`),l=d.querySelector(`#${pre}_l`),s=d.querySelector(`#${pre}_s`);
 const pinta=()=>{const v=q.value.trim();l.innerHTML=v?(busca(v).map(itAl).join("")||`<div class="rcsnada">Sin alarmas para «${E(v)}»</div>`):todasAl();l.classList.add("on");l.scrollTop=0};
 const cierra=()=>{l.innerHTML="";l.classList.remove("on")};
 const pintaSel=()=>{const X=d.sel;if(!X.length){s.innerHTML="";return}
  s.innerHTML=(X.length>1?`<div class="rcscft rcsnal">📋 ${X.length} alarmas en la OT</div>`:"")+X.map(x=>`<div class="rcsacu">${caja({x},true)}<button type="button" class="rcsqx" data-c="${E(x.c)}" aria-label="Quitar la alarma ${E(x.c)}">✕</button></div>`).join("")+bloqueInterv(X[0],window.rcsIntervUnion(X),X.length>1);
  s.querySelectorAll(".rcsqx").forEach(b=>b.onclick=e=>{e.stopPropagation();d.sel=d.sel.filter(z=>z.c!=b.dataset.c);pintaSel()});
  s.querySelectorAll("button.rcscb").forEach(b=>b.onclick=()=>{if(typeof abreCompClaves=="function")abreCompClaves([b.dataset.k],"Alarmas de la OT")})};
 const elige=x=>{if(!d.sel.some(z=>z.c==x.c))d.sel.push(x);else if(typeof msg=="function")msg(`La alarma ${x.c} ya está incluida`);q.value="";q.blur();cierra();pintaSel()};
 q.addEventListener("focus",pinta);q.addEventListener("click",()=>{if(!l.classList.contains("on"))pinta()});q.addEventListener("input",pinta);
 q.addEventListener("keyup",e=>{if(e.key=="Enter"){const R=busca(q.value);if(R.length==1)elige(R[0])}});
 l.addEventListener("click",e=>{const b=e.target.closest(".rcsit");if(!b)return;const x=porCod(b.dataset.c);if(x)elige(x)});
 (anchor.closest("#sheetc,#app")||document.body).addEventListener("click",e=>{if(!e.target.closest("#"+pre))cierra()});
 pintaSel();return d}
const ponAl=(i,X)=>{if(!i)return;const vieja=alMagDe(i).map(x=>x.c);
 if(X.length){i.alMag=X.map(x=>`${x.c} ${x.t}`).join("\n");i.alCod=X[0].c}
 else{delete i.alMag;if(i.alCod&&vieja.includes(i.alCod))delete i.alCod}
 if(typeof i.alarmas=="string")delete i.alarmas};
function otPon(){
 /* registrar */
 const t=document.getElementById("f_desc");if(t&&!document.getElementById("otrcs"))otPicker(t,"otrcs",[],"Alarma de la Magelis");
 /* editar */
 const e=document.getElementById("e_d");if(e&&!document.getElementById("edrcs")){const sc=document.getElementById("sheetc");const bt=sc&&sc.querySelector('[onclick^="guardaEdit("]');
  const id=bt&&((bt.getAttribute("onclick")||"").match(/\(\s*'([^']+)'/)||[])[1];const i=id&&Array.isArray(inc)&&inc.find(x=>x.id==id);
  const w=otPicker(e,"edrcs",alMagDe(i),"Alarmas de la Magelis");w.dataset.oid=id||""}}
if(typeof guardar=="function"){const og=guardar;guardar=function(){const w=document.getElementById("otrcs");const X=w&&w.sel?w.sel.slice():[];const n0=Array.isArray(inc)?inc.length:0;
 const r=og.apply(this,arguments);
 try{if(X.length&&Array.isArray(inc)&&inc.length>n0&&inc[0]){ponAl(inc[0],X);sv("pbb_inc",inc);try{render()}catch(e){}}}catch(e){console.warn("otrcs",e)}
 return r}}
if(typeof guardaEdit=="function"){const oe=guardaEdit;guardaEdit=function(id){const w=document.getElementById("edrcs");const X=w&&w.sel?w.sel.slice():null;
 const i=Array.isArray(inc)&&inc.find(x=>x.id==id);if(X&&i)ponAl(i,X);
 return oe.apply(this,arguments)}}
/* ficha de la OT: chips con las alarmas, debajo de la descripción */
if(typeof card=="function"){const oc=card;card=function(i){let h=oc.apply(this,arguments);try{const X=alMagDe(i);if(!X.length)return h;
 const chips=`<div class="otalm"><span class="otalt">🔔 Magelis</span>${X.map(x=>`<span class="otalc rcs${x.f}">${x.f!="R"?ICO(x.f)+" ":""}<b>${E(x.c)}</b> ${E(x.t)}</span>`).join("")}</div>`;
 const k=h.indexOf('<div class="mu">Inicio ');if(k>=0)h=h.slice(0,k)+chips+h.slice(k);else{const k2=h.indexOf('<div class="cacts">');h=k2>=0?h.slice(0,k2)+chips+h.slice(k2):h+chips}}catch(e){}return h}}
/* ---------- 3) Cierre CGA: código y tipo de cierre ---------- */
const TC=[["rep","🔧 Avería reparada"],["rea","🔁 Rearme OFF → ON"],["ope","⚠️ Operativa (no avería)"],["esp","🔵 Especialista / RCC"]];
/* v504: el código se elige en dos pasos (familia → alarmas de la familia, por grupos y en orden ascendente, con buscador),
   papelera para borrar lo elegido, y autorrelleno al escribir en Actuación u Observaciones si el texto nombra una alarma */
const FAMS=[["A",ICO("A"),"Alarmas","001-143 · avería o seguridad"],["W",ICO("W"),"Advertencias","241-363 · las resuelve el operador"],["R","🔵","Puesto remoto","R001-R016 · RCC y comunicaciones"]];
function selPon(sc,x,auto){const cc=sc.querySelector("#rcs_c"),bt=sc.querySelector("#rcs_cb"),tt=sc.querySelector("#rcs_t"),ci=sc.querySelector("#rcs_ci"),bo=sc.querySelector("#rcs_cx");if(!cc)return;
 cc.value=x?x.c:"";cc.dataset.auto=x&&auto?"1":"";
 bt.innerHTML=x?`<span class="rcsbf rcs${x.f}">${FN[x.f][0]}</span> <b>${x.c}</b> · ${E(x.t)}`:`<span class="mu">Código alarma…</span>`;
 bt.classList.toggle("on",!!x);bo.style.visibility=x?"visible":"hidden";
 ci.innerHTML=x?`${FN[x.f][0]} ${FN[x.f][1]} · ${G[x.g].n}${auto?" · propuesto por el texto":""}`:"";
 if(x){if(G[x.g].c)tt.value=G[x.g].c}else tt.value=""}
function picker(sc){let pk=document.getElementById("rcspk");if(pk)pk.remove();pk=document.createElement("div");pk.id="rcspk";document.body.appendChild(pk);
 const cierra=()=>pk.remove();
 const fams=()=>{pk.innerHTML=`<div class="rcspkc"><div class="rcspkh"><b>Código de alarma · familia</b><button type="button" class="sec" aria-label="Cerrar">✕</button></div>
  ${FAMS.map(([f,ic,n,d])=>`<button type="button" class="rcspf rcs${f}" data-f="${f}"><span class="rcspfi">${ic}</span><span><b>${n}</b><small>${d} · ${CAT.filter(x=>x.f==f).length} códigos</small></span><span class="rcspfa">›</span></button>`).join("")}</div>`;
  pk.querySelector(".rcspkh button").onclick=cierra;pk.querySelectorAll(".rcspf").forEach(b=>b.onclick=()=>lista(b.dataset.f))};
 const lista=f=>{const fam=FAMS.find(z=>z[0]==f);const L=CAT.filter(x=>x.f==f);const gs=[...new Set(L.map(x=>x.g))];
  pk.innerHTML=`<div class="rcspkc"><div class="rcspkh"><button type="button" class="sec rcspkb" aria-label="Volver">‹ Familias</button><b>${fam[1]} ${fam[2]}</b><button type="button" class="sec rcspkx" aria-label="Cerrar">✕</button></div>
  <input id="rcspq" type="search" autocomplete="off" enterkeyhint="search" placeholder="Filtrar por nº o texto"><div class="rcspl">${gs.map(g=>`<div class="rcspg" data-g="${g}"><div class="rcspgt">${E(G[g].n)}</div>${L.filter(x=>x.g==g).map(x=>`<button type="button" class="rcspi" data-c="${x.c}" data-n="${E(x.c+" "+x.n)}"><b>${x.c}</b> ${E(x.t)}</button>`).join("")}</div>`).join("")}</div></div>`;
  pk.querySelector(".rcspkb").onclick=fams;pk.querySelector(".rcspkx").onclick=cierra;
  const q=pk.querySelector("#rcspq");q.oninput=()=>{const v=nrm(q.value).trim();pk.querySelectorAll(".rcspi").forEach(b=>b.style.display=!v||b.dataset.n.includes(v)?"":"none");pk.querySelectorAll(".rcspg").forEach(g=>g.style.display=[...g.querySelectorAll(".rcspi")].some(b=>b.style.display!="none")?"":"none")};
  pk.querySelector(".rcspl").onclick=e=>{const b=e.target.closest(".rcspi");if(!b)return;selPon(sc,porCod(b.dataset.c),false);cierra()}};
 pk.onclick=e=>{if(e.target===pk)cierra()};fams()}
function ciePon(){const sc=document.getElementById("sheetc");if(!sc)return;const bc=sc.querySelector('button[onclick^="cerrar("]');if(!bc||sc.querySelector(".rcscie"))return;
 const id=((bc.getAttribute("onclick")||"").match(/\(\s*'([^']+)'/)||[])[1];const i=Array.isArray(inc)&&inc.find(x=>x.id==id);if(!i)return;
 const L=detecta(textoOT(i));const c0=i.alCod||(L[0]&&L[0].x.c)||"";const x0=c0&&porCod(c0);
 const d=document.createElement("div");d.className="rcscie";
 d.innerHTML=`<div class="rcsct">📘 CIERRE SEGÚN MANUAL RCS</div><div class="rcscg"><div class="rcscw"><input type="hidden" id="rcs_c"><button type="button" id="rcs_cb" class="sec"></button><button type="button" id="rcs_cx" class="sec" aria-label="Borrar código">🗑️</button></div>
 <select id="rcs_t"><option value="">Tipo de cierre…</option>${TC.map(([k,t])=>`<option value="${k}">${t}</option>`).join("")}</select></div><div id="rcs_ci" class="mu"></div>`;
 const ra=sc.querySelector("#r_a");const lab=ra&&ra.previousElementSibling&&ra.previousElementSibling.tagName=="LABEL"?ra.previousElementSibling:ra;if(lab)lab.before(d);else bc.before(d);
 selPon(sc,x0||null,!i.alCod&&!!x0);if(i.tipoCie)d.querySelector("#rcs_t").value=i.tipoCie;
 d.querySelector("#rcs_cb").onclick=()=>picker(sc);
 d.querySelector("#rcs_cx").onclick=()=>{selPon(sc,null,false);d.querySelector("#rcs_c").dataset.borrado="1"};
 /* autorrelleno desde Actuación / Observaciones: solo si no hay código o el que hay lo propuso el texto */
 let tm=0;const mira=()=>{clearTimeout(tm);tm=setTimeout(()=>{const cc=sc.querySelector("#rcs_c");if(!cc)return;if(cc.value&&!cc.dataset.auto)return;
  const t=[sc.querySelector("#r_a")&&sc.querySelector("#r_a").value,sc.querySelector("#r_o")&&sc.querySelector("#r_o").value].filter(Boolean).join(" · ");
  const Lx=detecta(t);if(Lx.length&&Lx[0].x.c!=cc.value)selPon(sc,Lx[0].x,true)},600)};
 ["#r_a","#r_o"].forEach(s=>{const el=sc.querySelector(s);if(el)el.addEventListener("input",mira)})}
const lee=()=>{const cc=document.getElementById("rcs_c"),tt=document.getElementById("rcs_t");if(!cc||!tt)return null;
 const x=porCod(cc.value||"");return{x,t:tt.value}};
if(typeof cerrar=="function"){const oc=cerrar;cerrar=function(id){try{const v=lee();const i=inc.find(z=>z.id==id);const ra=document.getElementById("r_a");
 if(v&&i&&(v.x||v.t)){if(v.x)i.alCod=v.x.c;if(v.t)i.tipoCie=v.t;
  const et="["+[v.x?v.x.c+" "+v.x.t:"",v.t?TC.find(z=>z[0]==v.t)[1].replace(/^\S+\s/,""):""].filter(Boolean).join(" · ")+"]";
  if(ra&&!ra.value.includes(et))ra.value=(et+" "+ra.value.replace(/^\[[^\]]*\]\s*/,"")).trim()}}catch(e){}
 return oc.apply(this,arguments)}}
let tm=0;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=0;try{sosPon()}catch(e){}try{ciePon()}catch(e){}try{otPon()}catch(e){}},60)}).observe(document.body,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
.rcsw{border:2px solid #1565c0}.rcst,.rcsct{font:800 12px/1.3 var(--tkmo,monospace);letter-spacing:.8px;color:#42a5f5;margin-bottom:6px}
.rcsb{border-left:5px solid #888;border-radius:6px;padding:6px 8px;margin:6px 0;background:color-mix(in srgb,var(--card,#171a20) 92%,#888)}
.rcsb.rcsA{border-left-color:#d32f2f}.rcsb.rcsW{border-left-color:#f9a825}.rcsb.rcsR{border-left-color:#1e88e5}
.rcsh{font-size:14.5px;line-height:1.3}.rcsf{display:inline-block;font:800 10.5px/1.6 var(--tkmo,monospace);letter-spacing:.6px;padding:0 6px;border-radius:4px;margin-right:4px;background:#0003}
.rcsA .rcsf{color:#ff5252}.rcsW .rcsf{color:#fbc02d}.rcsR .rcsf{color:#42a5f5}
.rcsg{font-size:12px;font-weight:700;margin-top:2px}.rcsq{font-size:13px;margin-top:4px}.rcsa{font-size:13px;margin-top:4px;font-weight:600}.rcsr{font-size:12px;margin-top:4px;color:var(--mu,#8a93a3)}
.rcsbus{margin-top:8px}.rcsbi input{width:100%;box-sizing:border-box;margin:0}
.rcsfil{display:flex;gap:6px}.rcsfil .rcscmp{flex:0 0 33%;min-width:0}.rcsfil .rcsbi:not(.rcscmp){flex:1;min-width:0}.rcsfil input{height:44px;font-size:15px;padding:6px 8px}.rcsfil .rcscmp input::placeholder{font-size:13px}
#rcs_l.on,.otrcsl.on{max-height:46vh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;border:1px solid var(--bd,#bbb);border-radius:8px;padding:4px}
.rcslg{font:800 11px/1.4 var(--tkmo,monospace);letter-spacing:.7px;text-transform:uppercase;color:#1565c0;margin:6px 2px 2px}
#cmp_l{display:flex;flex-direction:column;gap:4px;margin-top:4px}
.rcscb{display:block;width:100%!important;margin:0 0 4px!important;padding:8px 9px!important;text-align:left;font-size:13.5px!important;line-height:1.3;border-left:5px solid #455a64!important;border-radius:6px!important}
.rcscb small{display:block;font-size:11.5px;opacity:.75;font-weight:500}.rcscb .cmpid{display:inline-block;background:#455a64;color:#fff;border-radius:6px;padding:1px 7px;margin-right:4px;font-family:ui-monospace,monospace}
.rcscf{margin-top:6px}.rcsi-campo{border-left-color:#1fa64a!important}.rcsi-borna{border-left-color:#78909c!important}.rcsi-modulo{border-left-color:#f9a825!important}
.rcsacu{position:relative}.rcsacu .rcsb{padding-right:34px}.rcsqx{position:absolute;top:6px;right:4px;width:28px!important;height:28px!important;padding:0!important;margin:0!important;border-radius:50%!important;font-size:14px!important;line-height:1;background:#0002!important;border:0!important}
.rcsnal{margin:8px 0 2px;color:#1fa64a}
.otrcs{margin-top:4px}.otalm{display:flex;flex-wrap:wrap;gap:4px;align-items:center;margin:6px 0}.otalt{font-size:11.5px;font-weight:800;color:var(--mu,#78909c)}
.otalc{font-size:12px;line-height:1.3;padding:2px 8px;border-radius:999px;border:1.5px solid #888;background:color-mix(in srgb,var(--tx) 6%,transparent)}.otalc.rcsA{border-color:#d32f2f}.otalc.rcsW{border-color:#f9a825}.otalc.rcsR{border-color:#1e88e5}.otrcs>label small{font-weight:600;letter-spacing:0;text-transform:none;opacity:.8}.otrcs .rcsbi input{width:100%}
.rcsnf{cursor:default;border:1px dashed #8889;background:transparent}.rcsi small{opacity:.85}.rcscft{font:800 12px/1.4 var(--tkmo,monospace);letter-spacing:.5px;color:#455a64;margin-bottom:4px}
.cmpav{padding:7px 9px;border:1.5px solid #f9a825;background:#f9a8251a;border-radius:8px;font-size:13px;margin-bottom:4px}
.rcsnada{font-size:12.5px;color:var(--mu,#7a8394);padding:4px 2px}
#rcs_l,.otrcsl{display:flex;flex-direction:column;gap:4px;margin-top:4px}.rcsit{width:100%!important;margin:0!important;text-align:left;padding:7px 9px!important;font-size:13px!important;border-left:5px solid #888!important;border-radius:6px!important}
.rcsit.rcsA{border-left-color:#d32f2f!important}.rcsit.rcsW{border-left-color:#f9a825!important}.rcsit.rcsR{border-left-color:#1e88e5!important}
.rcscie{margin-top:8px;border:1.5px solid #1565c0;border-radius:10px;padding:6px 8px}.rcscg{display:grid;grid-template-columns:1.3fr 1fr;gap:6px}
.rcscg select{text-overflow:ellipsis;margin:0!important;min-width:0;font-size:14px}#rcs_ci{font-size:12px;margin-top:4px}
.rcscw{display:flex;gap:4px;min-width:0}#rcs_cb{flex:1;min-width:0;margin:0!important;padding:8px!important;text-align:left;font-size:13.5px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:auto!important}
#rcs_cb.on{border-color:#1565c0!important}#rcs_cx{width:40px!important;flex:none;margin:0!important;padding:0!important}.rcsbf{font-size:12px}
#rcspk{position:fixed;inset:0;z-index:100003;background:#0008;display:flex;align-items:flex-start;justify-content:center;padding:max(12px,env(safe-area-inset-top)) 8px 8px}
.rcspkc{background:var(--card,#171a20);color:var(--tx,#e9ecf1);border-radius:14px;width:100%;max-width:560px;max-height:calc(100dvh - 24px);display:flex;flex-direction:column;padding:10px;box-shadow:0 10px 40px #000a}
.rcspkh{display:flex;align-items:center;gap:8px;margin-bottom:8px}.rcspkh b{flex:1;font-size:15px}.rcspkh button{width:auto!important;margin:0!important;padding:6px 10px!important;flex:none}
.rcspf{display:flex!important;align-items:center;gap:10px;width:100%!important;margin:0 0 8px!important;padding:14px 12px!important;text-align:left;border-left:6px solid #888!important;border-radius:10px!important}
.rcspf.rcsA{border-left-color:#d32f2f!important}.rcspf.rcsW{border-left-color:#f9a825!important}.rcspf.rcsR{border-left-color:#1e88e5!important}
.rcspfi{font-size:22px}.rcspfi .rcsico{width:34px;height:34px}.rcsico{width:1.25em;height:1.25em;vertical-align:-.25em;display:inline-block;object-fit:contain}.rcspf>span:nth-child(2){flex:1;display:flex;flex-direction:column}.rcspf b{font-size:16px}.rcspf small{font-size:12px;color:var(--mu,#8a93a3);font-weight:500}.rcspfa{font-size:24px;color:var(--mu,#8a93a3)}
#rcspq{margin:0 0 6px;font-size:16px}.rcspl{overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;flex:1;min-height:0}
.rcspgt{font:800 11px/1.4 var(--tkmo,monospace);letter-spacing:.7px;text-transform:uppercase;color:#42a5f5;margin:10px 2px 4px}
.rcspi{display:block;width:100%!important;margin:0 0 4px!important;padding:9px 10px!important;text-align:left;font-size:14px!important;line-height:1.25;border-radius:8px!important}.rcspi b{margin-right:4px}
.rcsp{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.rcsp button{width:auto!important;margin:0!important;padding:5px 10px!important;font-size:12.5px!important}`;
document.head.appendChild(st);
})();
