/* ===== v130: Instalación hidráulica de la PBB (descripción técnica TKAS «Instalacio_n_hidra_ulica», 24 páginas) =====
 Relación hidráulica ↔ eléctrica ↔ PLC (ESQUEMA GENERAL rev. J):
   17 motor H-M1 (E-Q3 → E-K3, bobina E-A6 mód. 4 LED 2, estado E-A3) · 15 bomba de engranajes 22 l/min
   4   válvula 2/2 de subida      = H-Y1 24 V  ← relé E-K61 ← E-A1 mód. 2 LED 1 (folio 44)
   5.2 válvula 4/2 bajada normal  = H-Y2 24 V  ← relé E-K62 ← E-A1 mód. 2 LED 2
   5.1 válvula bajada rápida      = H-Y3 24 V  ← E-A7 1.1 (mód. 1 LED 1)
   21.1 / 21.2 retención eléctrica de cada cilindro = H-Y4 / H-Y5 12 V ← E-A7 (mód. 1 LED 2)
   20.1 / 20.2 retención pilotada · 3 limitadora 145 bar · 10 regulador bajada normal · 7/8 bajada rápida · 11 grifo de pilotaje
 Qué añade a la PWA:
   1. Guía de campo (PAS): cajas por avería (no sube, no baja, bajada rápida, baja sola / fugas, bomba / E-Q3, bajada con
      bomba manual, purgado-ajustes-filtro) con botones a la página del PDF (H<n>) y al folio eléctrico.
   2. Esquema hidráulico interactivo (croquis con simulación): cada posición pulsable y selector de maniobra.
   3. Lectura de la OT: palabras de hidráulica → la caja correcta como «Actuación más eficaz».
   4. Primera actuación en campo (caja roja y SOS): en hidráulica no se puentea nada.
   5. Comprobaciones por sistema: ajustes, mantenimiento, datos y erratas del documento.
   (El mantenimiento preventivo se añade en mantenimiento.js.) ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const PAS=GUIA.tipos.PAS;
const n_=t=>typeof segNorm=="function"?segNorm(t):String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const txt=i=>n_([i&&i.desc,i&&i.def,i&&i.com,i&&i.obs].filter(Boolean).join(" "));
const es=s=>typeof esc=="function"?esc(s):String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

/* páginas del PDF (índice del visor; la etiqueta impresa «Pág. n» es la página n+1) */
const PG={conf:3,bloque:5,cil:6,datos:8,func:9,bajada:10,aparatos:11,previos:13,purga:14,ajuste:15,mant:16,filtro:17,fallos:18,fallos2:19,esquema:21,grupo:22,seccion:23,planta:24};

/* ---------- abrir el documento ---------- */
async function docHidr(){const l=await gLista();return l.find(x=>/hidr/i.test(x.name)&&/instal/i.test(x.name))||l.find(x=>/hidr/i.test(x.name))||null}
window.gHidrPdf=async function(pag){const d=await docHidr();if(!d){msg("Sube a Planos la «Descripción técnica de la instalación hidráulica»");return}gPagIni=pag||1;await ver(d.id)};

/* ---------- procedimientos de la guía ----------
 p: pasos (los que empiezan por QUÉ HAY / CÓMO FUNCIONA / POSICIONES van a «Elementos y referencias»)
 g: folio eléctrico de cada paso (0 = sin botón) · h: página del PDF hidráulico de cada paso (0 = sin botón) */
const P507="POSICIONES 507: mismo grupo hidráulico; cambian las salidas (plano 507 folio 70): H-Y1 desde la salida safety E-A7 1.1 y H-Y4 / H-Y5 desde E-A7 2.1. Bomba por E-K3 (E-A6 8.1) y, en retorno autónomo, por E-K33 con el variador E1-U6.";
const PROCS=[
{id:"man",t:"Hidráulica · bajada sin corriente con bomba manual (grifo 11)",cro:"hidr_man",
 k:t=>/bomba manual|bajada (de |en )?emergencia|bajada manual|bajar(la)? a mano|grifo (de )?(pilotaje|11)/.test(t)||(/sin corriente|sin tension|fallo de corriente|apagon|corte de (luz|corriente)/.test(t)&&/\bbaj/.test(t)),
 a:"Solo con la zona bajo la pasarela despejada y un compañero vigilando. La PBB baja a la velocidad normal mientras se bombea.",
 p:[
"QUÉ HACE FALTA: bomba manual TKAS F9-835.000-00 0 y minimanguera de medición Ermeto SMA3 con rosca M16 (accesorios). Se usan cuando no hay corriente o no arranca la bomba y hay que bajar la PBB.",
"CÓMO FUNCIONA (descripción técnica pág. 9): sin presión de pilotaje las retenciones 20.1 / 20.2 de los cilindros no abren. La bomba manual da esa presión por la toma 12 con el grifo 11 cerrado, y el aceite de los cilindros vuelve a depósito por el regulador 10, la válvula 4 y el filtro 2.",
"PRIORIDAD 1 · Conectar la minimanguera de la bomba manual en la toma 12 (G, conexión rápida de 1/4\") del bloque de mando, junto a la central hidráulica.",
"PRIORIDAD 1 · Paso 2 · Cerrar el grifo de pilotaje 11: palanca a la IZQUIERDA, mirando el bloque de frente.",
"Paso 3 · Bombear: la presión abre 20.1 / 20.2 y la PBB baja a la velocidad normal (regulador 10). Si se para, volver a bombear.",
"Paso 4 · Al terminar, ABRIR el grifo 11: palanca a la DERECHA. Si se deja cerrado, la PBB no bajará en servicio normal.",
"Paso 5 · Desconectar la bomba manual, tapar la toma 12 y anotarlo en la OT.",
P507],
 g:[0,0,0,0,0,0,0,0],h:[PG.func,PG.bajada,PG.bloque,PG.planta,PG.bajada,PG.bajada,0,0]},
{id:"sola",t:"Hidráulica · baja sola / no mantiene la posición / inclinación anómala / fugas",cro:"hidr_rep",
 k:t=>/baja sola|se baja (sola)?|bajando sola|desciende sola|se cae|cae la|no mantiene|pierde (altura|posicion)|inclinacion anomala|inclinad[ao]|torcid|desnivel|fuga|pierde aceite|perdida de aceite|mancha de aceite|charco/.test(t),
 a:"Una PBB que baja sola puede apoyarse sobre el avión o atrapar a alguien bajo la pasarela. Nadie debajo sin calzarla.",
 p:[
"CÓMO FUNCIONA (pág. 8 y 18): en reposo la PBB la sujetan las retenciones de cada cilindro: 20.1 / 20.2 (pilotadas, ERVE R1/2\" HYDAC, apriete 25-30 Nm) y 21.1 / 21.2 (eléctricas WSE Z 10120 HYDAC 12 V, apriete 40-45 Nm), cerradas sin corriente.",
"PRIORIDAD 1 · Seguridad: si hay avión, retirar la cabina con cuidado o apoyar la PBB abajo. Balizar la zona bajo la pasarela y no trabajar debajo sin calzarla.",
"PRIORIDAD 1 · Paso 2 · Ninguna bobina de bajada debe estar activa en reposo: E-A1 mód. 2 LED 2 (H-Y2), E-A7 mód. 1 LED 1 (H-Y3) y LED 2 (H-Y4 / H-Y5) APAGADOS. Una bajada rápida que se queda activa baja la PBB sin bomba.",
"Paso 3 · Si baja de un solo lado (inclinación anómala): ese cilindro. Estanqueidad de su retención pilotada (20) y eléctrica (21), y fugas por el vástago o la junta.",
"Paso 4 · Si bajan los dos: retenciones 20 y 21 de ambos cilindros y válvula 21 con tensión permanente (medir 0 V en H-Y4 / H-Y5 en reposo).",
"Paso 5 · Fugas: central, bloque de mando, tuberías de intercomunicación, latiguillos y cilindros. Nivel en el visor 14 (con la PBB arriba el nivel en depósito es mínimo).",
"Si hay que sustituir una retención: mismos modelos y pares de apriete; purgar después (caja «purgado, ajustes y filtro»).",P507],
 g:[0,0,66,0,44,0,0,0],h:[PG.cil,0,0,PG.fallos2,PG.cil,PG.ajuste,PG.purga,0]},
{id:"rap",t:"Hidráulica · no hace bajada rápida",cro:"hidr_rap",
 k:t=>/(bajada|baja|bajar|desciende|descenso)[^.]{0,15}rapid|rapid[^.]{0,12}(bajada|descenso)/.test(t),
 p:[
"CÓMO FUNCIONA (pág. 9): la bajada rápida NO necesita motor. Deben entrar A LA VEZ H-Y3 (válvula 5.1 del bloque, 24 V) y H-Y4 / H-Y5 (retenciones 21.1 / 21.2 de los cilindros, 12 V). El elemento lógico 8 abre y el aceite va directo a depósito; velocidad con el regulador 7 (≈ 6,4 m/min, 9,4 s por metro).",
"PRIORIDAD 1 · E-A7 módulo 1: LED 1 = H-Y3 (borna 1.1) y LED 2 = H-Y4 / H-Y5. Si no se encienden con la orden, el PLC no la manda: revisar la orden y las seguridades.",
"PRIORIDAD 1 · Paso 2 · Medir con la orden: H-Y3 24 V (E-X55:6 → H-X51:6, manguera H-W8) · H-Y4 12 V (E-X56:11 → H-X52:11, H-W6) · H-Y5 12 V (E-X55:15 → H-X51:15, H-W7). Llega tensión y no actúa → bobina o válvula bloqueada (5.1, 21.1 o 21.2).",
"Paso 3 · Baja en rápido pero se inclina hacia un lado: una retención 21 no abre. Comprobar H-Y4 (izq.) y H-Y5 (dcha.) por separado.",
"Paso 4 · Baja en rápido a otra velocidad: regulador 7 (≈ 6,4 m/min = 9,4 s por metro de bajada).",
"La bajada normal sigue funcionando: la PBB puede seguir en servicio con la bajada rápida anotada en la OT.",P507],
 g:[0,66,44,44,0,0,0],h:[PG.bajada,PG.esquema,PG.fallos2,PG.cil,PG.ajuste,0,0]},
{id:"bom",t:"Hidráulica · la bomba no arranca / salta E-Q3",cro:"hidr_sub",
 k:t=>/\bbomba\b(?! manual)|e-?q3\b|h-?m1\b|e-?k3\b|motor (de la |del )?(bomba|hidraul|grupo)|grupo hidraulico|central hidraulica/.test(t),
 p:[
"QUÉ HAY: motor H-M1 5,5 kW (7,5 CV) IP55 con bomba de engranajes de 22 l/min. Placa (descripción técnica pág. 7): 12,8 A en estrella 380/415 V, cos φ 0,78. Potencia por E-Q3 (GV2P 9-14 A, ajuste 11,4 A en el plano) → E-K3 → manguera H-W13 5x2,5.",
"PRIORIDAD 1 · E-A0 módulo 3 LED 3 «Disyuntor bomba elevación E-Q3» APAGADO = E-Q3 disparado. No rearmar más de una vez sin revisar.",
"PRIORIDAD 1 · Paso 2 · Antes de rearmar: aislamiento del motor H-M1 y de la manguera H-W13, apriete en E-X56:5-10 y H-X52:5-10.",
"Paso 3 · E-K3 no entra al pedir subir o bajar: E-A6 módulo 4 LED 2 (bobina E-K3) y E-A3 «estado E-K3». Con el LED encendido y sin E-K3 → bobina o cableado del contactor.",
"Paso 4 · E-Q3 salta sin avería: el plano ajusta E-Q3 a 11,4 A y la placa del motor da 12,8 A. Medir el consumo subiendo con pinza: si ronda 12-13 A, salta por ajuste bajo, no por el motor. Consultar con el Responsable antes de cambiar el ajuste.",
"Paso 5 · Consumo alto: subir contra el final de carrera (la limitadora 3 descarga a 145 bar), bomba agarrotada, aceite frío o tensión baja.",
"Tras desconectar o cambiar el motor: comprobar el SENTIDO DE GIRO (horario mirando el ventilador, lleva flecha).",P507],
 g:[34,52,34,64,34,0,0,0],h:[PG.datos,0,0,0,PG.datos,PG.func,PG.previos,0]},
{id:"baj",t:"Hidráulica · no baja (bajada normal)",cro:"hidr_baj",
 k:t=>/no baja\b|no bajan\b|no desciende|bajada (normal )?(fallada|no funciona|no va)|no hace (la )?bajada|no deja bajar|sin bajada/.test(t),
 p:[
"CÓMO FUNCIONA (pág. 9): con la bomba en marcha entra H-Y2 (válvula 5.2). La presión pasa por la línea de pilotaje (B / D), con el grifo 11 ABIERTO, y abre 20.1 / 20.2. El aceite de los cilindros vuelve por el regulador 10, la válvula 4 (sin tensión) y el filtro 2. Velocidad 1,23 m/min (48,8 s por metro).",
"PRIORIDAD 1 · Grifo de pilotaje 11 ABIERTO: palanca a la DERECHA mirando el bloque. Si se quedó cerrado tras una bajada con bomba manual, la presión no abre las retenciones y la PBB no baja.",
"PRIORIDAD 1 · Paso 2 · Bomba en marcha (E-K3, E-A6 mód. 4 LED 2) y válvula de bajada H-Y2 (24 V 0,8 A): E-A1 módulo 2 LED 2 → relé E-K62 → E-X55:5 → H-X51:5 → H-W10. Medir 24 V en H-Y2 con la orden: llega y no baja → bobina o válvula 5.2 bloqueada.",
"Paso 3 · Presión de pilotaje: manómetro en 9.1 o en la toma 12. Al pedir bajar debe subir hasta la limitadora (145 bar). Sin presión → limitadora 3 o bomba (caja «la bomba no arranca»).",
"Paso 4 · Baja muy lenta o muy rápida: regulador 10 (1,23 m/min = 48,8 s por metro). Ajuste en la caja «purgado, ajustes y filtro».",
"Paso 5 · Límite inferior de inclinación IT-B10 (E-A2) y finales de inclinación IT-S2 / IT-S3 (E-A8).",
"Si hay que bajarla sin corriente o sin bomba: caja «bajada sin corriente con bomba manual».",P507],
 g:[0,0,44,0,0,58,0,0],h:[PG.bajada,PG.planta,PG.fallos,PG.fallos,PG.ajuste,0,PG.bajada,0]},
{id:"sub",t:"Hidráulica · no sube (elevación)",cro:"hidr_sub",
 k:t=>/no sube\b|no suben\b|no eleva|no levanta|subida (fallada|no funciona|no va)|no hace (la )?subida|no deja subir|sin subida|no sube ni baja/.test(t),
 a:"No subir la presión para forzar la subida: la limitadora 3 viene tarada de fábrica a 145 ± 5 bar. Si da esa presión y no sube, el fallo está en otro sitio.",
 p:[
"CÓMO FUNCIONA (pág. 8): al arrancar la bomba el aceite circula libre a depósito 4-5 s. Después entra H-Y1 (válvula 4): cierra el retorno y el aceite pasa por 5.2 (sin tensión) y la retención 6 a los cilindros por 20.1 / 20.2. Sube a 1,15 m/min. Al final de carrera descarga la limitadora 3 (145 bar).",
"POSICIONES (pág. 4 y 20): 4 subida = H-Y1 24 V · 5.2 bajada normal = H-Y2 24 V · 5.1 bajada rápida = H-Y3 24 V · 21.1 / 21.2 retención eléctrica de los cilindros = H-Y4 / H-Y5 12 V · 3 limitadora 145 bar (lado izquierdo del bloque, junto a la toma 9.1 y encima del regulador 10, cartucho sin bobina) · 9.1 (M1) y 9.2 (M2) tomas de manómetro · 11 grifo de pilotaje · 14 visor de nivel.",
"PRIORIDAD 1 · ACTUACIÓN MÁS EFICAZ ante PBB que no sube: conectar el manómetro en la toma 9.1 (M1), junto a la limitadora 3. Arrancar la bomba, esperar 4-5 s de circuito libre y pedir SUBIR. La lectura con la orden mantenida dice dónde está el fallo.",
"PRIORIDAD 1 · Paso 1 · ¿Gira la bomba al pedir subir? E-A6 módulo 4 LED 2 (bobina E-K3) y E-A3 «estado E-K3» ENCENDIDOS. Si no gira: E-A0 módulo 3 LED 3 (E-Q3) y caja «la bomba no arranca».",
"PRIORIDAD 1 · Paso 2 · Manómetro CASI A 0 bar: la válvula 4 (H-Y1) no cierra y todo el aceite vuelve a depósito. Medir 24 V en H-Y1 con la orden: E-A1 módulo 2 LED 1 → relé E-K61 → E-X55:4 → H-X51:4 → H-W9. Llega tensión y no actúa → bobina o corredera agarrotada: sustituir la válvula 4.",
"PRIORIDAD 1 · Paso 3 · Sube pero NO LLEGA a 145 bar: nivel en el visor 14 · aire en la bomba (acoplamiento 16 lado de entrada, estanqueidad del eje) · sentido de giro del motor (horario mirando por el ventilador; con giro invertido no da presión) · bomba desgastada.",
"PRIORIDAD 1 · Paso 4 · LLEGA a 145 bar y NO SUBE: la presión está bien, NO subirla. Comprobar que no están excitadas H-Y2 / 5.2 (E-A1 módulo 2 LED 2) ni H-Y4 / H-Y5 / 21.1-21.2 (E-A7 módulo 1 LED 2) mientras se pide subir; si están bien → retención 6 bloqueada o freno mecánico en la PBB.",
"PRIORIDAD 1 · Paso 5 · Ajuste de la limitadora 3, SOLO si no da 145 ± 5 bar y lo anterior está bien: manómetro en 9.2 o en 12, aflojar la contratuerca, ¼ de vuelta cada vez en sentido horario (más presión) hasta 145 bar, SIN PASARSE; apretar la contratuerca y marcar la posición. Si no se consigue → sustituir el cartucho (ref. 6619012). Anotar en la OT la presión antes y después.",
"PRIORIDAD 1 · Paso 6 · Grifo de pilotaje 11 ABIERTO (palanca a la DERECHA). No tocar el grifo 11 ni las válvulas 20 / 21 de los cilindros para hacerla subir: son las que sujetan la pasarela.",
"PRIORIDAD 2 · Sube muy despacio o a tirones: aire en los cilindros → purgado (caja «purgado, ajustes y filtro»).",
"PRIORIDAD 2 · Límites: límite superior de inclinación IT-B11 (E-A2 módulo 2 LED 1 apagado en reposo), finales de inclinación IT-S2 / IT-S3 (E-A8) y medidor de altura C-B14 (E-A4). Si ya está en su altura máxima, no subir es lo normal.",P507],
 g:[0,0,0,64,44,0,44,0,0,0,58,0],h:[PG.func,PG.esquema,PG.bloque,PG.fallos,PG.fallos,PG.fallos,PG.esquema,PG.purga,PG.bajada,PG.purga,0,0]},
{id:"aju",t:"Hidráulica · purgado, ajuste de velocidades, filtro y aceite",cro:"hidr_sub",
 k:t=>/purg|aire en (los )?cilindro|filtro hidraul|cambio de filtro|velocidad de (bajada|subida)|ajuste (de )?(la )?velocidad|nivel de aceite|cambio de aceite|muestra de aceite|ruido (de la )?bomba/.test(t),
 p:[
"QUÉ HAY (datos, pág. 6-7 y 14): limitadora 145 ± 5 bar · subida 1,15 m/min · bajada normal 1,23 m/min (48,8 s por metro) · bajada rápida 6,4 m/min (9,4 s por metro) · depósito 200 l · aceite ISO VG 46 (DIN 51524 P2 HLP) · filtro de retorno 25 µm con by-pass · el aceite no debe pasar de 80 °C.",
"Comprobar la limitadora 3: cilindros recogidos, manómetro en la toma 12 o en 9.2, activar 5.2 (bajar) y leer 145 ± 5 bar. No se toca salvo que no dé esa presión.",
"Purgado de cilindros: manómetro en 9.1 con el grifo 10 abierto; aflojar los purgadores de los cilindros; con la bomba en marcha en SUBIDA, ir cerrando el grifo 10 hasta 15-20 bar; mantener hasta que salga aceite sin espuma ni burbujas y cerrar los purgadores.",
"Velocidad de bajada normal: con la bomba en marcha cerrar el grifo 10 (sube a 1,15 m/min); parar la bomba; activar 5.2 y abrir poco a poco el grifo 10 hasta 1,23 m/min (48,8 s por metro).",
"Velocidad de bajada rápida: activar a la vez 21.1 / 21.2 y 5.1 y abrir poco a poco el regulador 7 hasta ≈ 6,4 m/min (9,4 s por metro).",
"Cambio de filtro (cartucho atornillable, 25 µm): subir la PBB al máximo (nivel mínimo en depósito); comprobar que el nivel queda por debajo del filtro (si no, vaciar por el grifo 19); cambiar el cartucho con la superficie de sellado limpia.",
"Muestra de aceite: subir y bajar la PBB una o dos veces para mezclar y tomar unos 500 cm³ en una toma de manómetro (el documento dice «Pos. 20», que es la retención del cilindro: usar 9.1 / 9.2). Enviarla identificada al fabricante del aceite.",
"Comprobaciones finales: nivel en el visor 14, estanqueidad de central, bloque, tuberías y cilindros, ruidos de bomba y descarga, y temperatura del aceite por debajo de 80 °C."],
 g:[0,0,0,0,0,0,0,0],h:[PG.datos,PG.purga,PG.purga,PG.ajuste,PG.ajuste,PG.filtro,PG.filtro,PG.ajuste]}];
const IX={};PROCS.forEach(o=>{const {k,id,h,...s}=o;IX[id]=PAS.s.push(s)-1});
window.HIDR_IX=IX;
const esH=si=>Object.values(IX).includes(si);
const OTRO=/porton|persiana|capota|fuelle|toldo|cortina|suelo|brazo|escalera|luneta|cabina gira|giro (de )?cabina/;
const ELEV=/elevac|hidraul|cilindro|altura|aceite|bomba/;
function casos(i){if(!i)return [];const t=txt(i);if(OTRO.test(t)&&!ELEV.test(t))return [];
 return PROCS.filter(p=>p.k(t)).map(p=>p.id)}
window.hidrCasos=casos;

/* ---------- v132: componente que acota la avería (parpadea en el esquema y en la actuación) ----------
 Primero lo que nombra la descripción de la OT; si no nombra ninguno, el de la avería detectada. */
const FOCO_TXT=[[/limitador|presion|\bbar\b|tarad|manometr/,"3"],[/grifo|pilotaje/,"11"],[/filtro/,"2"],[/bomba manual|toma 12/,"12"],
 [/h-?y1\b|valvula (de )?subida/,"4"],[/h-?y2\b/,"5.2"],[/h-?y3\b/,"5.1"],[/h-?y4\b/,"21.1"],[/h-?y5\b/,"21.2"],
 [/(bajada|baja|bajar|desciende|descenso)[^.]{0,15}rapid|rapid[^.]{0,12}(bajada|descenso)/,"5.1"],
 [/nivel de aceite|falta (de )?aceite/,"13"],[/baja sola|no mantiene|pierde (altura|posicion)|inclinacion anomala|fuga/,"20.1"],
 [/\bbomba\b|e-?q3\b|h-?m1\b|motor/,"17"]];
const FOCO_CASO={sub:"3",baj:"11",rap:"5.1",man:"12",bom:"17",sola:"20.1",aju:"9"};
const FOCO_PASO={"3":/limitadora/,"4":/h-y1|valvula 4\b/,"5.2":/h-y2|\b5\.2\b/,"5.1":/h-y3|\b5\.1\b/,"21.1":/h-y4|\b21\.1\b|retenciones? (electrica|21)/,"21.2":/h-y5|\b21\.2\b|retenciones? (electrica|21)/,
 "20.1":/\b20\.1\b|retencion(es)? (pilotada|20)/,"11":/grifo/,"12":/toma 12|bomba manual/,"2":/filtro/,"13":/visor 14|nivel/,"17":/e-q3|h-m1|bomba|motor/,"9":/\b9\.[12]\b|manometro/};
window.hidrFoco=function(i){if(!i)return null;const c=casos(i);if(!c.length)return null;const t=txt(i);
 const r=FOCO_TXT.find(([re])=>re.test(t));return r?r[1]:(FOCO_CASO[c[0]]||null)};
function focoOT(){try{if(typeof view!="undefined"&&view!="tec")return null;const i=inc.find(x=>x.id==gOT);return i&&i.estado=="abierta"?hidrFoco(i):null}catch(e){return null}}

/* ---------- análisis de la OT ---------- */
(function(){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||r._hid)return r;r._hid=1;if(r.tipo&&r.tipo!="PAS")return r;
 const c=casos(i);r.guia=(r.guia||[]).filter(g=>!esH(g.si));
 if(c.length){c.slice().reverse().forEach((id,j)=>r.guia.unshift({si:IX[id],t:PAS.s[IX[id]].t,sc:56-j}));r.guia=r.guia.slice(0,5)}
 return r}})();

/* ---------- esquema hidráulico interactivo ---------- */
const EL={
 "C1":{n:"Cilindro izquierdo",f:"Cilindro de inmersión (vástago 110 mm, rótulas GE50UK-2RS). Purgador en la parte alta; en el fondo, las retenciones 20.1 y 21.1 y la seta de parada.",m:"Fugas por vástago o juntas. Si baja solo este lado: sus retenciones.",pg:PG.cil},
 "C2":{n:"Cilindro derecho",f:"Igual que el izquierdo, con las retenciones 20.2 y 21.2.",m:"Fugas por vástago o juntas. Si baja solo este lado: sus retenciones.",pg:PG.cil},
 "20.1":{n:"20.1 · retención pilotada izq.",f:"Antirretorno con mando hidráulico (ERVE R1/2\" HYDAC, 25-30 Nm). Deja subir; para bajar la abre la presión de pilotaje (línea D). Seguro contra rotura de tubería.",m:"Baja sola de este lado → estanqueidad de esta válvula.",pg:PG.cil},
 "20.2":{n:"20.2 · retención pilotada dcha.",f:"Antirretorno con mando hidráulico (ERVE R1/2\" HYDAC, 25-30 Nm). Deja subir; para bajar la abre la presión de pilotaje (línea D).",m:"Baja sola de este lado → estanqueidad de esta válvula.",pg:PG.cil},
 "21.1":{n:"21.1 · retención eléctrica izq. · H-Y4",f:"WSE Z 10120 HYDAC 12 V DC (40-45 Nm). Cerrada sin corriente; abre solo en bajada rápida.",e:"H-Y4 12 V 1,5 A ← E-A7 1.3 (mód. 1 LED 2) → E-X56:11 → H-X52:11 → manguera H-W6",m:"12 V con la orden de bajada rápida; 0 V en reposo.",f2:44,pg:PG.cil},
 "21.2":{n:"21.2 · retención eléctrica dcha. · H-Y5",f:"WSE Z 10120 HYDAC 12 V DC (40-45 Nm). Cerrada sin corriente; abre solo en bajada rápida.",e:"H-Y5 12 V 1,5 A ← E-A7 2.1 (mód. 1 LED 2) → E-X55:15 → H-X51:15 → manguera H-W7",m:"12 V con la orden de bajada rápida; 0 V en reposo.",f2:44,pg:PG.cil},
 "5.1":{n:"5.1 · bajada rápida · H-Y3",f:"Electroválvula TN-6 (24 V). Con 21.1 / 21.2 descomprime el elemento lógico 8 y el aceite va directo a depósito.",e:"H-Y3 24 V ← E-A7 1.1 (mód. 1 LED 1) → E-X55:6 → H-X51:6 → manguera H-W8",m:"24 V con la orden de bajada rápida.",f2:44,pg:PG.bloque},
 "7":{n:"7 · regulador de bajada rápida",f:"Tapa con estrangulador. Ajusta la bajada rápida a ≈ 6,4 m/min (9,4 s por metro).",m:"Abrir poco a poco con 5.1 + 21.1 / 21.2 activas.",pg:PG.ajuste},
 "8":{n:"8 · elemento lógico",f:"Elemento base: abre con 5.1 activa y deja pasar el aceite de los cilindros a depósito por la válvula 22.",m:"Bloqueado → no hay bajada rápida aunque las bobinas tengan tensión.",pg:PG.bajada},
 "6":{n:"6 · retención general",f:"Deja pasar el aceite hacia los cilindros en la subida y evita el caudal paralelo hacia el filtro en la bajada.",m:"Muelle de 1-2 kg.",pg:PG.func},
 "5.2":{n:"5.2 · bajada normal · H-Y2",f:"Electroválvula 4/2 TN-6 (24 V 0,8 A). Sin tensión: paso P → A para subir. Con tensión: presión a la línea de pilotaje (B / D) que abre 20.1 / 20.2.",e:"H-Y2 24 V ← relé E-K62 ← E-A1 mód. 2 LED 2 → E-X55:5 → H-X51:5 → manguera H-W10",m:"24 V con la orden de bajar.",f2:44,pg:PG.bloque},
 "3":{n:"3 · limitadora 145 bar",f:"Viene tarada de fábrica (145 ± 5 bar). Descarga al final de la subida y fija la presión de pilotaje al bajar.",m:"Manómetro en 12 o 9.2, cilindros recogidos y 5.2 activa: 145 ± 5 bar.",pg:PG.ajuste},
 "10":{n:"10 · regulador de bajada normal",f:"Estrangulador (grifo) que fija la velocidad de bajada: 1,23 m/min = 48,8 s por metro.",m:"Cerrado del todo: no baja. Se usa también para el purgado (15-20 bar).",pg:PG.ajuste},
 "4":{n:"4 · válvula de subida · H-Y1",f:"Válvula 2/2 (retención eléctrica 9524C00, 24 V 0,8 A). Con tensión cierra el retorno a depósito y el aceite va a los cilindros. Sin tensión: retorno libre (circuito libre y bajada).",e:"H-Y1 24 V ← relé E-K61 ← E-A1 mód. 2 LED 1 → E-X55:4 → H-X51:4 → manguera H-W9",m:"24 V con la orden de subir, 4-5 s después de arrancar la bomba.",f2:44,pg:PG.bloque},
 "2":{n:"2 · filtro de retorno",f:"Cartucho atornillable CSM10BNR, 25 µm, con by-pass.",m:"Cambio a las 4 semanas y a los 12 meses de la puesta en marcha; después anual.",pg:PG.filtro},
 "11":{n:"11 · grifo de pilotaje",f:"ABIERTO = palanca a la DERECHA (servicio). CERRADO = palanca a la IZQUIERDA (solo para bajar con bomba manual).",m:"Si se queda cerrado, la PBB no baja en servicio normal.",pg:PG.planta},
 "12":{n:"12 · toma G (1/4\")",f:"Conexión rápida para manómetro o para la bomba manual de emergencia (minimanguera Ermeto SMA3, rosca M16).",m:"Comprobación de la limitadora y bajada sin corriente.",pg:PG.bloque},
 "9":{n:"9.1 / 9.2 · tomas de manómetro",f:"M1 (9.1) presión de trabajo y M2 (9.2).",m:"Purgado en 9.1 (15-20 bar); limitadora en 9.2 o 12 (145 bar).",pg:PG.bloque},
 "15":{n:"15 · bomba de engranajes",f:"1L22DE10R, 14,6 cm³/rev: 22 l/min a 1500 rpm. Unida al motor por el acoplamiento 16.",m:"Gira y no da presión: nivel de aceite (aire), acoplamiento y estanqueidad del eje.",pg:PG.datos},
 "17":{n:"17 · motor H-M1",f:"5,5 kW (7,5 CV) IP55: 12,8 A en estrella 380/415 V. Giro horario mirando el ventilador.",e:"H-M1 ← E-Q3 (ajuste 11,4 A en el plano) → E-K3 (bobina E-A6 mód. 4 LED 2, estado E-A3) → E-X56:5-10 → H-X52 → manguera H-W13 5x2,5",m:"E-Q3 disparado: E-A0 mód. 3 LED 3 apagado.",f2:34,pg:PG.datos},
 "13":{n:"13 · depósito 200 l",f:"Aceite ISO VG 46 (DIN 51524 P2 HLP). Tapón de llenado 18, grifo de vaciado 19, visor de nivel 14 con termómetro.",m:"Nivel en el visor 14; aceite por debajo de 80 °C.",pg:PG.conf}};
/* posiciones del dibujo: [x,y,w,h,etiqueta 1, etiqueta 2] */
const BX={"20.1":[12,94,40,26,"20.1",""],"21.1":[56,94,40,26,"21.1","H-Y4"],"20.2":[264,94,40,26,"20.2",""],"21.2":[308,94,40,26,"21.2","H-Y5"],
 "5.1":[22,176,66,34,"5.1","H-Y3"],"7":[22,226,66,34,"7","reg. rápida"],"8":[22,276,66,34,"8","elem. lógico"],
 "6":[132,176,66,34,"6","retención"],"5.2":[132,226,66,34,"5.2","H-Y2 bajar"],"3":[132,276,66,34,"3","145 bar"],
 "10":[232,176,66,34,"10","reg. bajada"],"4":[232,226,66,34,"4","H-Y1 subir"],"2":[232,276,66,34,"2","filtro"],
 "11":[304,176,46,34,"11","grifo"],"12":[304,226,46,34,"12","G"],"9":[304,276,46,34,"9.1·9.2","M"],
 "15":[22,368,66,30,"15","bomba"],"17":[22,404,66,30,"17","H-M1"],"13":[132,372,218,62,"13","depósito 200 l · visor 14"]};
const LN={
 A:"M32,120 V140 H284 V120 M165,140 V176 M265,140 V176",
 Cr:"M76,120 V128 H328 V120 M55,128 V176",
 D:"M18,120 V154 H270 V120",
 Dp:"M198,243 H216 V164 H327 V176",
 D11:"M270,154 H327 V176",
 P:"M88,383 H114 V300 H132",
 c2:"M165,210 V276",
 c1:"M55,210 V276 M55,310 V352 H150 V372",
 c3:"M265,210 V276 M265,310 V372",
 r3:"M180,310 V372",
 m12:"M327,226 V210"};
const MAN={
 rep:{n:"Reposo",t:"Sin órdenes. La PBB queda sujeta por las retenciones 20.1 / 20.2 (pilotadas) y 21.1 / 21.2 (eléctricas, cerradas sin corriente). Todas las bobinas a 0 V.",on:[],co:[],ln:[]},
 sub:{n:"Subir",t:"E-K3 arranca la bomba (circuito libre 4-5 s). Entra H-Y1 (4): cierra el retorno y el aceite va por 5.2 (sin tensión) y 6 a los cilindros, abriendo 20.1 / 20.2 hacia arriba. 1,15 m/min. Al final de carrera descarga la limitadora 3.",on:["17","15","3","5.2","6","20.1","20.2","C1","C2","9"],co:["4","17"],ln:["P","c2","A"]},
 baj:{n:"Bajar",t:"Bomba en marcha y H-Y2 (5.2) con tensión: la presión va por la línea de pilotaje D (grifo 11 abierto) y abre 20.1 / 20.2. El aceite vuelve por el regulador 10, la válvula 4 (sin tensión) y el filtro 2. 1,23 m/min (48,8 s por metro).",on:["17","15","3","11","20.1","20.2","C1","C2","10","4","2","13"],co:["5.2","17"],ln:["P","Dp","D11","D","A","c3","r3"]},
 rap:{n:"Bajada rápida",t:"Sin motor. Entran a la vez H-Y3 (5.1) y H-Y4 / H-Y5 (21.1 / 21.2): el elemento lógico 8 abre y el aceite de los cilindros va directo a depósito. Velocidad con el regulador 7: ≈ 6,4 m/min (9,4 s por metro).",on:["21.1","21.2","C1","C2","7","8","13"],co:["5.1","21.1","21.2"],ln:["Cr","c1"]},
 man:{n:"Sin corriente",t:"Bomba manual en la toma 12 y grifo 11 CERRADO (palanca a la izquierda). Al bombear, la presión abre 20.1 / 20.2 y la PBB baja por 10, 4 y 2 a velocidad normal. Al terminar, ABRIR el grifo 11 (palanca a la derecha).",on:["12","20.1","20.2","C1","C2","10","4","2","13"],co:[],ce:["11"],ln:["m12","D11","D","A","c3"]}};
function svgHidr(){const b=(k)=>{const[x,y,w,h,a,c]=BX[k];return `<g class="hk" data-k="${k}" tabindex="0" role="button" aria-label="${es(EL[k].n)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/><text x="${x+w/2}" y="${y+(c?h/2-2:h/2+4)}" class="hk1">${es(a)}</text>${c?`<text x="${x+w/2}" y="${y+h/2+10}" class="hk2">${es(c)}</text>`:""}</g>`};
 const cil=(k,x)=>`<g class="hk" data-k="${k}" tabindex="0" role="button" aria-label="${es(EL[k].n)}"><rect x="${x+16}" y="2" width="12" height="22" rx="2" class="hrod"/><rect x="${x}" y="22" width="44" height="64" rx="6"/><text x="${x+22}" y="58" class="hk2">${k=="C1"?"izq.":"dcha."}</text></g>`;
 return `<svg viewBox="0 0 360 442" role="img" aria-label="Esquema hidráulico de la PBB">
 <rect x="8" y="164" width="346" height="156" rx="8" class="hblq"/><text x="14" y="334" class="hk3">Bloque de mando (1)</text>
 <text x="180" y="13" class="hk3" text-anchor="middle">A trabajo · D pilotaje (- - -)</text>
 ${Object.entries(LN).map(([k,d])=>`<path d="${d}" class="hl${k=="D"||k=="Dp"||k=="D11"||k=="m12"?" hpil":""}" data-l="${k}"/>`).join("")}
 ${cil("C1",54)}${cil("C2",262)}
 ${Object.keys(BX).map(b).join("")}
 </svg>`}
function htmlHidr(m){return `<div class="hsim" data-m="${m}"><div class="hbt">${Object.entries(MAN).map(([k,v])=>`<button data-man="${k}" class="${k==m?"on":""}">${es(v.n)}</button>`).join("")}</div>
 ${svgHidr()}<div class="hman"></div><div class="hinf mu">Toca una válvula del dibujo para ver qué hace, su bobina y qué medir.</div>
 <div class="hley"><span><i class="lo"></i>aceite en movimiento</span><span><i class="lc"></i>bobina con tensión</span><span><i class="lx"></i>grifo cerrado</span></div></div>`}
function pintaMan(el,m){const M=MAN[m]||MAN.rep;el.dataset.m=m;
 el.querySelectorAll(".hbt button").forEach(b=>b.classList.toggle("on",b.dataset.man==m));
 el.querySelectorAll(".hk").forEach(g=>{const k=g.dataset.k;g.classList.toggle("on",M.on.includes(k));g.classList.toggle("co",M.co.includes(k));g.classList.toggle("ce",(M.ce||[]).includes(k))});
 el.querySelectorAll(".hl").forEach(p=>p.classList.toggle("on",M.ln.includes(p.dataset.l)));
 el.querySelector(".hman").innerHTML=`<b>${es(M.n)}:</b> ${es(M.t)}`}
function pintaEl(el,k){const E=EL[k];if(!E)return;el.querySelectorAll(".hk").forEach(g=>g.classList.toggle("sel",g.dataset.k==k));
 const inf=el.querySelector(".hinf");inf.classList.remove("mu");
 inf.innerHTML=`<b>${es(E.n)}</b><div>${es(E.f)}</div>${E.e?`<div class="he">⚡ ${es(E.e)}</div>`:""}<div class="hm">🔎 ${es(E.m)}</div>
 <div class="hbb">${E.pg?`<button class="sec" onclick="event.preventDefault();event.stopPropagation();gHidrPdf(${E.pg})">📄 Descripción técnica · pág. ${E.pg-1}</button>`:""}${E.f2?`<button class="sec" onclick="event.preventDefault();event.stopPropagation();gPlano('PAS',${E.f2})">📐 Plano eléctrico · folio ${E.f2}</button>`:""}</div>`}
function init(el){if(el.dataset.ok)return;el.dataset.ok=1;const m=(el.dataset.sim.split("_")[1])||"rep";el.innerHTML=htmlHidr(m);const s=el.querySelector(".hsim");pintaMan(s,m);
 const fk=focoOT();if(fk&&EL[fk]){const g=s.querySelector(`.hk[data-k="${fk}"]`);if(g){g.classList.add("foc");pintaEl(s,fk);
  s.querySelector(".hinf").insertAdjacentHTML("afterbegin",`<div class="hfocb">🎯 Avería acotada en: <b>${es(EL[fk].n)}</b></div>`)}}
 s.addEventListener("click",e=>{e.stopPropagation();const b=e.target.closest("button[data-man]");if(b){e.preventDefault();pintaMan(s,b.dataset.man);return}
  const g=e.target.closest(".hk");if(g){e.preventDefault();pintaEl(s,g.dataset.k)}});
 s.addEventListener("keydown",e=>{const g=e.target.closest&&e.target.closest(".hk");if(g&&(e.key=="Enter"||e.key==" ")){e.preventDefault();pintaEl(s,g.dataset.k)}})}
const scan=()=>document.querySelectorAll('.gsim[data-sim^="hidr"]:not([data-ok])').forEach(init);
new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
window.hidrSimHTML=m=>`<div class="gsim" data-sim="hidr_${m||"rep"}"></div>`;
(function(){const st=document.createElement("style");st.textContent=`
.hsim svg{display:block;width:100%;height:auto;margin:6px 0;font-family:inherit}
.hsim .hk rect{fill:var(--card);stroke:var(--mu);stroke-width:1.2;transition:fill .2s,stroke .2s}
.hsim .hk{cursor:pointer;outline:none}.hsim .hk1{font-size:11px;font-weight:700;fill:var(--tx);text-anchor:middle}.hsim .hk2{font-size:8.5px;fill:var(--mu);text-anchor:middle}
.hsim .hk3{font-size:9px;fill:var(--mu)}.hsim .hblq{fill:none;stroke:var(--bd);stroke-dasharray:4 3}.hsim .hrod{fill:var(--bd)!important}
.hsim .hl{fill:none;stroke:var(--bd);stroke-width:2.2}.hsim .hl.hpil{stroke-dasharray:5 4}
.hsim .hl.on{stroke:#e53935;stroke-width:3;animation:hflu 1s linear infinite;stroke-dasharray:8 5}.hsim .hl.hpil.on{stroke:#fb8c00}
@keyframes hflu{to{stroke-dashoffset:-13}}
.hsim .hk.on rect{fill:color-mix(in srgb,#e53935 16%,var(--card));stroke:#e53935}
.hsim .hk.co rect{stroke:var(--ac);stroke-width:3}.hsim .hk.co .hk1{fill:var(--ac)}
.hsim .hk.ce rect{fill:color-mix(in srgb,#1e88e5 22%,var(--card));stroke:#1e88e5;stroke-width:3}
.hsim .hk.foc rect{animation:hfoc 2s ease-in-out infinite}
@keyframes hfoc{0%,100%{stroke:#ef6c00;stroke-width:4;fill:color-mix(in srgb,#ef6c00 30%,var(--card))}50%{stroke:#ef6c00;stroke-width:1.2;fill:var(--card)}}
.hsim .hfocb{font-size:12.5px;color:#ef6c00;margin-bottom:4px}
#app .gpaso.hfoco,#app .gelit.hfoco{border-radius:8px;animation:hfocp 2s ease-in-out infinite}
@keyframes hfocp{0%,100%{box-shadow:0 0 0 2px #ef6c00;background:color-mix(in srgb,#ef6c00 14%,transparent)}50%{box-shadow:0 0 0 0 #ef6c0000;background:transparent}}
.hsim .hk.sel rect{stroke:var(--pr);stroke-width:3.2}.hsim .hk:focus-visible rect{stroke:var(--pr);stroke-width:3.2}
.hsim .hbt{display:flex;flex-wrap:wrap;gap:5px}.hsim .hbt button{font:inherit;font-size:12px;padding:5px 9px;border-radius:8px;border:1px solid var(--bd);background:var(--card);color:var(--tx);width:auto;margin:0}
.hsim .hbt button.on{background:var(--pr);border-color:var(--pr);color:#fff}
.hsim .hman{font-size:12.5px;line-height:1.4;margin:2px 0 6px}.hsim .hinf{font-size:12.5px;line-height:1.4;border-top:1px solid var(--bd);padding-top:6px}
.hsim .hinf>div{margin-top:3px}.hsim .he{color:var(--ac)}.hsim .hbb{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.hsim .hbb button{width:auto;margin:0;font-size:12px;padding:6px 9px}
.hsim .hley{display:flex;flex-wrap:wrap;gap:10px;font-size:11px;color:var(--mu);margin-top:6px}.hsim .hley i{display:inline-block;width:14px;height:0;border-top:3px solid #e53935;vertical-align:middle;margin-right:4px}
.hsim .hley i.lc{border:2px solid var(--ac);height:8px;width:10px;border-radius:2px}.hsim .hley i.lx{border:2px solid #1e88e5;height:8px;width:10px;border-radius:2px;background:color-mix(in srgb,#1e88e5 22%,transparent)}
#app .ghz{margin-left:4px}#app .ghz small{font-size:10px}`;document.head.appendChild(st)})();

/* croquis de cada procedimiento: el mismo esquema con la maniobra que toca */
try{const nota=["Toca una válvula para ver qué hace, su bobina, la salida del PLC y qué medir.","Arriba, los botones cambian la maniobra: se ilumina por dónde va el aceite y qué bobinas tienen tensión.","Posiciones según el esquema hidráulico de la descripción técnica (pág. 20)."];
 [["rep","Reposo"],["sub","Subir"],["baj","Bajar"],["rap","Bajada rápida"],["man","Sin corriente · bomba manual"]].forEach(([m,t])=>{CROQ["hidr_"+m]={i:"🛢️",f:44,t:"Esquema hidráulico interactivo · "+t,sim:"hidr_"+m,n:nota}})}catch(e){console.warn("hidraulica croquis",e)}

/* ---------- primera actuación en campo (sin puentes) ---------- */
const PRIM={
 sola:["PBB que baja sola o pierde altura","Si hay avión, retirar la cabina con cuidado o apoyar la PBB abajo. Balizar la zona bajo la pasarela; nadie debajo sin calzarla.","Comprobar que ninguna bobina de bajada queda activa en reposo (E-A1 mód. 2 LED 2, E-A7 mód. 1 LED 1 y 2 apagados)."],
 man:["Bajar la PBB sin corriente","Bomba manual en la toma 12 y grifo 11 CERRADO (palanca a la izquierda); bombear y la PBB baja a velocidad normal.","Al terminar, ABRIR el grifo 11 (palanca a la derecha) y anotarlo en la OT."],
 baj:["PBB que no baja","Grifo de pilotaje 11 ABIERTO (palanca a la derecha). Bomba en marcha y H-Y2 con 24 V al pedir bajar.","Si no hay corriente o no arranca la bomba: bajada con bomba manual (toma 12, grifo 11 cerrado, bombear, abrir el grifo al terminar)."],
 sub:["PBB que no sube","Manómetro en la toma 9.1 (junto a la limitadora 3). Arrancar la bomba, esperar 4-5 s y pedir SUBIR: ¿gira la bomba? (E-Q3 y E-K3).","Casi 0 bar → H-Y1 (válvula 4) no cierra: 24 V con la orden. No llega a 145 bar → nivel, aire, giro, bomba. 145 bar y no sube → no subir la presión: revisar 5.2 / 21 y mecánica."],
 bom:["Bomba hidráulica / E-Q3","E-Q3 disparado (E-A0 mód. 3 LED 3 apagado): no rearmar más de una vez sin medir el aislamiento de H-M1 y de H-W13.","Si salta sin avería, medir el consumo subiendo: el plano ajusta E-Q3 a 11,4 A y el motor consume 12,8 A."],
 rap:["Bajada rápida","La bajada normal sigue funcionando: la PBB puede seguir en servicio y se anota la bajada rápida en la OT.","Medir con la orden H-Y3 24 V y H-Y4 / H-Y5 12 V (E-A7 mód. 1 LED 1 y 2)."]};
window.hidrOT=function(i){if(!i||i.estado!="abierta")return null;if(typeof otEsPAS=="function"&&!otEsPAS(i))return null;const c=casos(i).filter(k=>PRIM[k]);return c.length?c[0]:null};
window.hidrHTML=function(i,k){const P=PRIM[k];if(!P)return "";const pr=IX[k]!=null?IX[k]:IX.sub;
 const fk=hidrFoco(i),fe=fk&&EL[fk];
 return `<div class="pucab">🛢️ PRIMERA ACTUACIÓN EN CAMPO · hidráulica · ${es(P[0])}</div>${fe?`<div class="hfocb" style="font-size:13px;color:#ef6c00;margin:4px 0">🎯 Avería acotada en: <b>${es(fe.n)}</b></div>`:""}
 <div class="puit"><div class="puac">1. ${es(P[1])}</div><div class="puac">2. ${es(P[2])}</div></div>
 <div class="gnp" style="margin-top:6px">⛔ En la hidráulica no se puentea nada: las retenciones de los cilindros son las que sujetan la pasarela.</div>
 <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button class="sec" style="flex:1;width:auto" onclick="hidrVa(${pr})">Ver la actuación completa</button><button class="sec" style="flex:1;width:auto" onclick="gHidrPdf(${PG.esquema})">📄 Esquema hidráulico</button></div>`};
window.hidrVa=function(si){try{if(typeof sosSal=="function"&&document.getElementById("app").classList.contains("sosmode"))sosSal()}catch(e){}if(typeof anaGuia=="function")anaGuia(si)};
function primPinta(){if(view!="tec")return;const i=inc.find(x=>x.id==gOT);const old=document.getElementById("ghidr");const k=hidrOT(i);
 if(!k){if(old)old.remove();return}if(old&&old.dataset.k==k)return;if(old)old.remove();
 const d=document.createElement("div");d.id="ghidr";d.dataset.k=k;d.className="card pucard";d.innerHTML=hidrHTML(i,k);
 const ref=document.getElementById("gsegl")||document.getElementById("gpte")||document.querySelector("#app details.gd.gef"),anc=document.getElementById("anag");
 if(ref)ref.insertAdjacentElement("beforebegin",d);else if(anc)anc.insertAdjacentElement("afterend",d)}

/* ---------- botones al PDF hidráulico en cada paso ---------- */
function pinta(){if(gTipo!="PAS")return;const info=typeof gEsInfo=="function"?gEsInfo:(()=>false);
 PROCS.forEach(o=>{const d=document.querySelector(`#app details.gd[data-k="PAS${IX[o.id]}"]`);if(!d)return;
  const acc=[],inf=[];o.p.forEach((p,pi)=>(info(p)?inf:acc).push(pi));
  const pon=(el,pi)=>{const pg=o.h[pi];if(!el||!pg||el.querySelector(".ghz"))return;
   el.insertAdjacentHTML("beforeend",`<button class="gpl ghz" aria-label="Ver la descripción técnica hidráulica, página ${pg-1}" onclick="event.preventDefault();event.stopPropagation();gHidrPdf(${pg})">📄<small>H${pg-1}</small></button>`)};
  const ga=d.querySelectorAll(".gst>.gpaso"),gi=d.querySelectorAll(".gelit");acc.forEach((pi,k)=>pon(ga[k],pi));inf.forEach((pi,k)=>pon(gi[k],pi));
  const fk=focoOT(),fr=fk&&FOCO_PASO[fk];d.querySelectorAll(".hfoco").forEach(x=>x.classList.remove("hfoco"));
  if(fr&&hidrCasos(inc.find(x=>x.id==gOT)).includes(o.id)){acc.forEach((pi,k)=>{if(ga[k]&&fr.test(n_(o.p[pi])))ga[k].classList.add("hfoco")});inf.forEach((pi,k)=>{if(gi[k]&&fr.test(n_(o.p[pi])))gi[k].classList.add("hfoco")})}
  if(!d.querySelector(".ghzb")){const mu=[...d.querySelectorAll(".mu")].find(x=>/^Planos:/.test(x.textContent.trim()));
   const h=`<div class="ghzb" style="display:flex;gap:6px;margin:6px 0"><button class="sec" style="flex:1" onclick="gHidrPdf(${PG.esquema})">📄 Esquema hidráulico (pág. 20)</button><button class="sec" style="flex:1" onclick="gHidrPdf(${PG.fallos})">📄 Fallos y solución (pág. 17)</button></div>`;
   if(mu)mu.insertAdjacentHTML("afterend",h);else d.insertAdjacentHTML("beforeend",h)}})}
(function(){const o=vTec;vTec=function(){const r=o.apply(this,arguments);try{pinta();primPinta()}catch(e){console.warn("hidraulica",e)}return r}})();
PROCS.forEach(o=>{PAS.s[IX[o.id]].r="Descripción técnica de la instalación hidráulica (TKAS) · ESQUEMA GENERAL rev. J folios 34, 44, 52-57, 64-67"});

/* ---------- comprobaciones por sistema ---------- */
try{const SIS=window.SIS;if(SIS&&SIS.PAS){
 const E=SIS.PAS.find(x=>/^Elevación hidráulica/.test(x.s));
 if(E)E.c.push("Relación con el esquema hidráulico: H-Y1 = válvula 4 (subida) · H-Y2 = 5.2 (bajada normal) · H-Y3 = 5.1 (bajada rápida) · H-Y4 / H-Y5 = retenciones eléctricas 21.1 / 21.2 de los cilindros · H-M1 = motor 17 con la bomba 15. Ver el esquema interactivo en las cajas «Hidráulica ·» de la guía.");
 SIS.PAS.push({s:"Hidráulica · ajustes, mantenimiento y datos (descripción técnica TKAS)",f:[44,34],c:[
  "Valores de ajuste: limitadora 3 = 145 ± 5 bar · subida 1,15 m/min · bajada normal 1,23 m/min (48,8 s por metro, regulador 10) · bajada rápida ≈ 6,4 m/min (9,4 s por metro, regulador 7) · purgado a 15-20 bar en 9.1.",
  "Tensiones: H-Y1, H-Y2, H-Y3 a 24 V DC · H-Y4, H-Y5 a 12 V DC. Motor con giro horario mirando el ventilador.",
  "Aceite: ISO VG 46, DIN 51524 P2 HLP · depósito 200 l · no mezclar aceites · máximo 80 °C tras trabajar.",
  "Mantenimiento: nivel y estanqueidad cada trimestre · filtro de 25 µm a las 4 semanas y a los 12 meses de la puesta en marcha, después anual · estado del aceite cada año (muestra al fabricante) · limpiar el venteo del depósito y las superficies de refrigeración.",
  "Erratas del documento: la tabla de fallos dice «electroimán Pos. 14» (la 14 es el visor; es la válvula 4, H-Y1) · la muestra de aceite «en la Pos. 20» (es la retención del cilindro; usar 9.1 / 9.2) · bajada normal 1,15 o 1,23 m/min según la página · temperatura de servicio hasta +50 °C o +60 °C · índice de viscosidad mínimo 100 o 160 · filtro CSM10BNR (lista de aparatos) o CS10BN (mantenimiento).",
  "E-Q3: en el plano eléctrico está ajustado a 11,4 A y el motor consume 12,8 A en estrella. Si salta sin avería, medir el consumo subiendo antes de cambiar el motor."]});}}catch(e){console.warn("hidraulica SIS",e)}

/* vocabulario de la lectura de OT */
try{ANA_SIN.push(["aceite","fuga","fugas","perdida","purgar","purgado","retencion","valvula","valvulas","electrovalvula","limitadora","presion","manometro","filtro"]);ANA_VOC=null;ANA_C={k:"",r:null}}catch(e){}
})();
