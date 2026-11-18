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
const FN={A:["🔴","ALARMA","Avería / seguridad: intervención en campo"],W:["🟡","ADVERTENCIA","La resuelve el operador: no es avería si se borra al corregir la causa"],R:["🔵","PUESTO REMOTO","Fallo del RCC o comunicaciones, no de la pasarela"]};
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
 t.replace(/\b(?:alarmas?|al|aviso|evento|adv(?:ertencia)?|cod(?:igo)?|magelis)\.?\s*(?:n[ºo°]\.?\s*)?[:#-]?\s*(r?\d{3}|r\d{1,2})\b/g,(m,c)=>{const x=porCod(c);if(x)out.set(x.c,{x,por:"num"});return m});
 /* número suelto al principio de la línea con el texto detrás («057 Fallo medida…») */
 t.replace(/(?:^|[\n·;])\s*(\d{3})\s*[|:.-]?\s+([a-z][^\n·;]{4,})/g,(m,c,r)=>{const x=porCod(c);if(x&&pal(r).some(w=>x.n.includes(w)))out.set(x.c,{x,por:"num"});return m});
 /* por texto: todas las palabras del texto oficial (o de su alias) están en el aviso */
 const W=new Set(pal(t+" "+sinon(t)));const tiene=w=>W.has(w)||[...W].some(v=>v.length>=5&&w.length>=5&&v.slice(0,5)==w.slice(0,5));
 let mejor=[];CAT.forEach(x=>{if(out.has(x.c)||(NO[x.c]&&NO[x.c].test(t)))return;
  const vari=[pal(nrm(x.t)).filter(w=>!/^\d+$/.test(w)||w.length>1)].concat(ALIAS[x.c]?ALIAS[x.c].split("|").map(pal):[]);
  vari.forEach(ws=>{if(ws.length<2)return;if(ws.every(tiene))mejor.push({x,s:ws.length})})});
 mejor.sort((a,b)=>b.s-a.s);const top=mejor.length?mejor[0].s:0;
 mejor.filter(m=>m.s==top).forEach(m=>{if(!out.has(m.x.c))out.set(m.x.c,{x:m.x,por:"txt"})});
 /* familia del mismo texto repetido (001/002, 008/028): quedarse con uno */
 const vistos=new Set();return[...out.values()].filter(o=>{const k=o.x.t;if(vistos.has(k))return false;vistos.add(k);return true}).slice(0,3)}
window.rcsDetecta=detecta;
const textoOT=i=>[i.desc,i.def,i.com,i.alarmas&&(typeof i.alarmas=="string"?i.alarmas:JSON.stringify(i.alarmas).replace(/[{}\[\]"]/g," "))].filter(Boolean).join(" · ");
/* ---------- recuadro de un código ---------- */
const caja=(o,compacta)=>{const x=o.x,g=G[x.g],[ic,fam,fs]=FN[x.f];
 return`<div class="rcsb rcs${x.f}"><div class="rcsh"><span class="rcsf">${ic} ${fam}</span><b>${E(x.c)}</b> ${E(x.t)}</div>
 <div class="rcsg">${E(g.n)} · <span class="mu">${E(fs)}</span></div>
 ${compacta?"":`<div class="rcsq">${E(g.q)}</div>`}<div class="rcsa">➜ ${E(g.a)}</div>${x.f=="A"&&!compacta?`<div class="rcsr">${E(REARME)}</div>`:""}${enlaces(x)}</div>`};
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
const itAl=x=>`<button type="button" class="rcsit rcs${x.f}" data-c="${x.c}">${FN[x.f][0]} <b>${x.c}</b> ${E(x.t)}</button>`;
const todasAl=()=>[["A","🔴 Alarmas"],["W","🟡 Advertencias"],["R","🔵 Puesto remoto"]].map(([f,t])=>`<div class="rcslg">${t}</div>`+CAT.filter(x=>x.f==f).map(itAl).join("")).join("");
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
 const elige=x=>{const t=sc.querySelector("#sr_t");if(t){const v=`${x.c} ${x.t}`;if(!nrm(t.value).includes(nrm(v)))t.value=[t.value.trim(),v].filter(Boolean).join(" · ");const dt=t.closest("details");if(dt)dt.open=true}
  q.value="";q.blur();l.innerHTML="";l.classList.remove("on");
  const C=compDeAlarma(x);
  s.innerHTML=caja({x},true)+(C.length?`<div class="rcscf"><div class="rcscft">🔩 Componente de campo que falla</div>${C.map(c=>`<button type="button" class="rcscb" data-k="${E(ckClave(c))}"><span class="cmpid">${E(c.id)}</span> ${E(c.t)}</button>`).join("")}</div>`
   :`<div class="rcscf rcsnada">🔩 Sin componente de campo asociado a la alarma ${E(x.c)} en el catálogo.</div>`);
  s.querySelectorAll(".rcscb").forEach(b=>b.onclick=()=>{if(typeof abreCompClaves=="function")abreCompClaves([b.dataset.k],x.c+" "+x.t)});
  if(C.length&&typeof abreCompClaves=="function")abreCompClaves(C.map(ckClave),x.c+" "+x.t)};
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
/* ---------- 3) Cierre CGA: código y tipo de cierre ---------- */
const TC=[["rep","🔧 Avería reparada"],["rea","🔁 Rearme OFF → ON"],["ope","🟡 Operativa (no avería)"],["esp","🔵 Especialista / RCC"]];
/* v504: el código se elige en dos pasos (familia → alarmas de la familia, por grupos y en orden ascendente, con buscador),
   papelera para borrar lo elegido, y autorrelleno al escribir en Actuación u Observaciones si el texto nombra una alarma */
const FAMS=[["A","🔴","Alarmas","001-143 · avería o seguridad"],["W","🟡","Advertencias","241-363 · las resuelve el operador"],["R","🔵","Puesto remoto","R001-R016 · RCC y comunicaciones"]];
function selPon(sc,x,auto){const cc=sc.querySelector("#rcs_c"),bt=sc.querySelector("#rcs_cb"),tt=sc.querySelector("#rcs_t"),ci=sc.querySelector("#rcs_ci"),bo=sc.querySelector("#rcs_cx");if(!cc)return;
 cc.value=x?x.c:"";cc.dataset.auto=x&&auto?"1":"";
 bt.innerHTML=x?`<span class="rcsbf rcs${x.f}">${FN[x.f][0]}</span> <b>${x.c}</b> · ${E(x.t)}`:`<span class="mu">Código alarma…</span>`;
 bt.classList.toggle("on",!!x);bo.style.visibility=x?"visible":"hidden";
 ci.textContent=x?`${FN[x.f][0]} ${FN[x.f][1]} · ${G[x.g].n}${auto?" · propuesto por el texto":""}`:"";
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
let tm=0;new MutationObserver(()=>{if(tm)return;tm=setTimeout(()=>{tm=0;try{sosPon()}catch(e){}try{ciePon()}catch(e){}},60)}).observe(document.body,{childList:true,subtree:true});
const st=document.createElement("style");st.textContent=`
.rcsw{border:2px solid #1565c0}.rcst,.rcsct{font:800 12px/1.3 var(--tkmo,monospace);letter-spacing:.8px;color:#42a5f5;margin-bottom:6px}
.rcsb{border-left:5px solid #888;border-radius:6px;padding:6px 8px;margin:6px 0;background:color-mix(in srgb,var(--card,#171a20) 92%,#888)}
.rcsb.rcsA{border-left-color:#d32f2f}.rcsb.rcsW{border-left-color:#f9a825}.rcsb.rcsR{border-left-color:#1e88e5}
.rcsh{font-size:14.5px;line-height:1.3}.rcsf{display:inline-block;font:800 10.5px/1.6 var(--tkmo,monospace);letter-spacing:.6px;padding:0 6px;border-radius:4px;margin-right:4px;background:#0003}
.rcsA .rcsf{color:#ff5252}.rcsW .rcsf{color:#fbc02d}.rcsR .rcsf{color:#42a5f5}
.rcsg{font-size:12px;font-weight:700;margin-top:2px}.rcsq{font-size:13px;margin-top:4px}.rcsa{font-size:13px;margin-top:4px;font-weight:600}.rcsr{font-size:12px;margin-top:4px;color:var(--mu,#8a93a3)}
.rcsbus{margin-top:8px}.rcsbi input{width:100%;box-sizing:border-box;margin:0}
.rcsfil{display:flex;gap:6px}.rcsfil .rcscmp{flex:0 0 33%;min-width:0}.rcsfil .rcsbi:not(.rcscmp){flex:1;min-width:0}.rcsfil input{height:44px;font-size:15px;padding:6px 8px}.rcsfil .rcscmp input::placeholder{font-size:13px}
#rcs_l.on{max-height:46vh;overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;border:1px solid var(--bd,#bbb);border-radius:8px;padding:4px}
.rcslg{font:800 11px/1.4 var(--tkmo,monospace);letter-spacing:.7px;text-transform:uppercase;color:#1565c0;margin:6px 2px 2px}
#cmp_l{display:flex;flex-direction:column;gap:4px;margin-top:4px}
.rcscb{display:block;width:100%!important;margin:0 0 4px!important;padding:8px 9px!important;text-align:left;font-size:13.5px!important;line-height:1.3;border-left:5px solid #455a64!important;border-radius:6px!important}
.rcscb small{display:block;font-size:11.5px;opacity:.75;font-weight:500}.rcscb .cmpid{display:inline-block;background:#455a64;color:#fff;border-radius:6px;padding:1px 7px;margin-right:4px;font-family:ui-monospace,monospace}
.rcscf{margin-top:6px}.rcscft{font:800 12px/1.4 var(--tkmo,monospace);letter-spacing:.5px;color:#455a64;margin-bottom:4px}
.cmpav{padding:7px 9px;border:1.5px solid #f9a825;background:#f9a8251a;border-radius:8px;font-size:13px;margin-bottom:4px}
.rcsnada{font-size:12.5px;color:var(--mu,#7a8394);padding:4px 2px}
#rcs_l{display:flex;flex-direction:column;gap:4px;margin-top:4px}.rcsit{width:100%!important;margin:0!important;text-align:left;padding:7px 9px!important;font-size:13px!important;border-left:5px solid #888!important;border-radius:6px!important}
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
.rcspfi{font-size:22px}.rcspf>span:nth-child(2){flex:1;display:flex;flex-direction:column}.rcspf b{font-size:16px}.rcspf small{font-size:12px;color:var(--mu,#8a93a3);font-weight:500}.rcspfa{font-size:24px;color:var(--mu,#8a93a3)}
#rcspq{margin:0 0 6px;font-size:16px}.rcspl{overflow-y:auto;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;flex:1;min-height:0}
.rcspgt{font:800 11px/1.4 var(--tkmo,monospace);letter-spacing:.7px;text-transform:uppercase;color:#42a5f5;margin:10px 2px 4px}
.rcspi{display:block;width:100%!important;margin:0 0 4px!important;padding:9px 10px!important;text-align:left;font-size:14px!important;line-height:1.25;border-radius:8px!important}.rcspi b{margin-right:4px}
.rcsp{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}.rcsp button{width:auto!important;margin:0!important;padding:5px 10px!important;font-size:12.5px!important}`;
document.head.appendChild(st);
})();
