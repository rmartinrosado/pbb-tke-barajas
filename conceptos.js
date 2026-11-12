/* ===== v438: CONCEPTOS DE CAMPO fijados con el técnico, aplicados al SOS, a la lupa y al Análisis de OT (12/11/2026) =====
   La descripción en campo (aviso de la OT) manda. Cada regla dice qué caja de la guía es la actuación más eficaz y qué cajas
   NO corresponden a ese aviso. Reglas (texto en minúsculas y sin tildes):
    · LÍMITE DE TRABAJO ≠ FINAL DE CARRERA. Un límite (extensión, retracción, inclinación, rotonda, cabina, traslación) es el tope
      programado en el módulo verde: no pisa ningún FC ni hace caer los contactores. Un FC de seguridad PISADO (o «línea de seguridad
      activada») va al módulo safety amarillo E-A8 con su puente en la entrada.
    · Límite de inclinación → IT-B10 / IT-B11 en E-A2 (no la caja de traslación). Límite de rotonda → detectores CO-B1 / CO-B2.
      Límite de giro de cabina → C-B1 / C-B2 en P-A6 (no el FC de freno). «Freno de cabina» = FC de freno de giro de cabina.
    · Bloqueo por equipo (carro A/A, máquina A/A, 400 Hz, 90 % conector): 1º en el equipo, 2º desbloqueo en el PLC. Si el aviso NO
      habla de bloqueo, carro, puerta o tapa (p. ej. «PCA no enfría») no salen las cajas de bloqueo del carro.
    · Seta de emergencia → «Pupitre encendido pero no rearma» (setas), no el joystick.
    · Puerta de servicio abierta → inductivo SS-B15 (E-A10 4.1), no la iluminación de la escalera.
    · Antiatrapamiento, portón, zapata, bumpers, bordes: su caja solo si el aviso los nombra (EL_FAM, v437).
   Para añadir un concepto: una entrada más en REG (q: palabras del aviso, no: palabras que lo anulan, box: caja que manda,
   fuera: cajas que no corresponden). ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const PAS=GUIA.tipos.PAS;
const nrm=x=>String(x||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const nueva=c=>{if(!PAS.s.some(x=>x.t==c.t))PAS.s.push(c)};

/* ---------- cajas nuevas de la guía PAS ---------- */
nueva({t:"Final de carrera de seguridad pisado · línea de seguridad activada · módulo safety E-A8",ef:1,g:[68,68,68,68],
 a:"Un FC de seguridad PISADO abre la cadena de seguridad: caen los contactores E-K0 / E-K0.1 y la Magelis indica «LÍNEA DE SEGURIDAD ACTIVADA». Solo en MANUAL, despacio y con un compañero vigilando.",
 p:[
 "QUÉ SIGNIFICA · El movimiento pasó de su límite de trabajo (o hubo una medida extrema) y pisó el final de carrera de seguridad. Módulo safety amarillo E-A8 (folio 68): FC traslación H-S1 → borna 5.1 · FC extensión túneles ET-S1 → 6.1 · FC rotonda CO-S1 → 7.1 · FC inclinación IT-S2 / IT-S3 → 8.1. En el estado de alarmas de la Magelis aparece el elemento activado.",
 "1º · Mirar en E-A8 qué LED está APAGADO (en reposo los FC están encendidos): ese es el FC pisado.",
 "2º · PRIMERA ACTUACIÓN · PUENTE PROVISIONAL en la entrada safety del FC pisado: borna n.1 con n.2 del mismo canal de E-A8 (entrada IN y su salida de test UT; croquis arriba). Traslación H-S1 5.1–5.2 · extensión ET-S1 6.1–6.2 · rotonda CO-S1 7.1–7.2 · inclinación IT-S2 / IT-S3 8.1–8.2. El LED se enciende; rearmar y, en MANUAL, mover en sentido CONTRARIO para salir del FC.",
 "3º · CAUSA · ¿Por qué no paró antes en el límite de trabajo? Revisar el límite de ese movimiento (módulo verde): traslación H-B3 / H-B4 (E-A3) · extensión ET-B6 / ET-B7 (E-A2) · rotonda CO-B1 / CO-B2 (E-A0) · inclinación IT-B10 / IT-B11 (E-A2): LED, distancia inductivo–leva (1-4 mm) y soporte.",
 "4º · FC: palanca, roldana, muelle y contactos del FC pisado; cable hasta el bornero del armario E.",
 "5º · PRUEBAS FINALES · QUITAR EL PUENTE, LED del FC encendido. Mover hasta el límite de trabajo y comprobar que la PBB para en él ANTES de pisar el FC."],
 r:"Esquema general rev. J folio 68 (E-A8) · 52, 58, 59 (límites de trabajo)"});
nueva({t:"Límite de inclinación superior / inferior · límite de trabajo IT-B11 / IT-B10 (E-A2)",ef:1,g:[58,58],
 a:"Es un LÍMITE DE TRABAJO (módulo verde E-A2), no el FC de seguridad IT-S2 / IT-S3: los contactores de seguridad siguen entrados. Solo en MANUAL y con un compañero vigilando.",
 p:[
 "QUÉ SIGNIFICA · La elevación llegó al tope de inclinación: límite SUPERIOR IT-B11 → E-A2 borna 3.1 · límite INFERIOR IT-B10 → E-A2 borna 2.4 (folio 58). El PLC corta solo ese sentido.",
 "1º · LIBERAR: en MANUAL mover en sentido CONTRARIO. Límite superior → BAJAR · límite inferior → SUBIR. El límite desaparece de la Magelis / display.",
 "2º · Si no se libera o sale fuera del tope (croquis arriba): límite SUPERIOR IT-B11 → soltar el hilo de la borna IN 3.1 de E-A2 y aislarlo (esa entrada se activa al pisar el límite; un puente la activaría). Límite INFERIOR IT-B10 → puente IN 2.4 con 2.5 (+24 V). Solo con la elevación a la vista y un compañero vigilando; anotarlo en la OT.",
 "3º · CAUSA: subir y bajar despacio mirando los LED de E-A2 2.4 y 3.1: cada uno debe cambiar en su tope. Si no cambia o cambia fuera de sitio: distancia del inductivo a su leva (1-4 mm), leva o soporte movido, inductivo sucio o averiado, cable.",
 "4º · PRUEBAS FINALES: REPONER EL HILO / QUITAR EL PUENTE y subir y bajar todo el recorrido comprobando que la Magelis o el display marcan el límite superior e inferior y que la PBB para en ellos sin pisar el FC IT-S2 / IT-S3."],
 r:"Esquema general rev. J folio 58 (E-A2 2.4 / 3.1)"});
nueva({t:"Puerta de servicio abierta · inductivo SS-B15 (E-A10 4.1)",ef:1,g:[70],
 a:"La puerta de servicio (escalera de servicio) abierta para la PBB por seguridad. Es un elemento de seguridad del módulo safety E-A10.",
 p:[
 "1º · CERRAR bien la puerta de servicio de la escalera y rearmar. Con la puerta cerrada el inductivo SS-B15 detecta su pestaña y el LED 4 de E-A10 se enciende.",
 "2º · Puerta cerrada y LED 4 de E-A10 apagado: inductivo SS-B15 — distancia a su pestaña o chapa (1-4 mm), soporte doblado, LED propio del inductivo, suciedad, cable.",
 "3º · Para recuperar la pasarela: PUENTE PROVISIONAL en E-A10 borna IN 4.1 con 4.2 (salida de test UT del canal; croquis arriba), con la puerta comprobada cerrada a la vista y un compañero vigilando. Anotarlo en la OT.",
 "4º · PRUEBAS FINALES: QUITAR EL PUENTE; abrir la puerta → la PBB no debe moverse y el LED se apaga; cerrar → LED encendido y rearma."],
 r:"Esquema general rev. J folio 70 (E-A10)"});
const T=t=>PAS.s.findIndex(x=>x.t==t);

/* ---------- opciones (lupaSub) para segregar el elemento de cada caja nueva ---------- */
try{const O=(k,n,q,s)=>({k,n,q,s:s||q});const SUB=window.lupaSubDefs;if(SUB){
 SUB.push({box:/^final de carrera de seguridad pisado/,et:"¿Qué final de carrera?",op:[
  O("tra","FC traslación H-S1 · E-A8 5.1",/traslac|h-?s1\b|rueda/,/traslac|h-s1\b|h-b[34]|e-a3\b|5\.1|5\.2/),
  O("ext","FC extensión túneles ET-S1 · E-A8 6.1",/extensi|retracc|tunel|et-?s1\b/,/extensi|et-s1\b|et-b[67]|6\.1|6\.2/),
  O("rot","FC rotonda CO-S1 · E-A8 7.1",/rotonda|co-?s1\b/,/rotonda|co-s1\b|co-b[12]|7\.1|7\.2/),
  O("inc","FC inclinación IT-S2 / IT-S3 · E-A8 8.1",/inclinac|elevac|altura|it-?s[23]\b/,/inclinac|it-s[23]\b|it-b1[01]|8\.1|8\.2/)]});
 SUB.push({box:/^limite de inclinacion superior/,et:"¿Qué límite de inclinación?",op:[
  O("sup","Límite SUPERIOR IT-B11 · E-A2 3.1",/superior|arriba|no sube|subir|it-?b11/,/superior|subir|it-b11|3\.1/),
  O("inf","Límite INFERIOR IT-B10 · E-A2 2.4",/inferior|abajo|no baja|bajar|it-?b10/,/inferior|bajar|it-b10|2\.4|2\.5/)]});
}}catch(e){}

/* ---------- reglas ---------- */
const FC=/final(es)? de carrera|fin de carrera|\bf\.?c\.?\b|\bfc\b|pisad|linea de seguridad|cadena de seguridad/;
const LIM=/\blimite|\btope\b/;
const ELEM=/antiatrap|atrapamiento|borde|banda|bumper|zapata|porton|persiana|barrera|freno|puerta de servicio|seta/;
const REG=[
 {q:t=>FC.test(t)&&!ELEM.test(t),box:/^final de carrera de seguridad pisado/,fuera:/^limite de extension \/ retraccion|^limite de inclinacion superior/},
 {q:t=>LIM.test(t)&&/inclinac/.test(t)&&!FC.test(t),box:/^limite de inclinacion superior/,fuera:/^limite de traslacion|^rotonda · detectores|^final de carrera de seguridad/},
 {q:t=>LIM.test(t)&&/rotonda/.test(t)&&!FC.test(t)&&!/barrera/.test(t),box:/^rotonda · detectores de giro/,fuera:/^limite de traslacion|^final de carrera de seguridad/},
 {q:t=>LIM.test(t)&&/cabina/.test(t)&&!/freno/.test(t)&&!FC.test(t),box:/^cabina \/ brazo autonivelador/,fuera:/^cabina \/ freno de giro|^limite de traslacion/},
 {q:t=>LIM.test(t)&&/traslac|giro de ruedas|ruedas/.test(t)&&!FC.test(t),box:/^limite de traslacion/,fuera:/^final de carrera de seguridad/},
 {q:t=>/\bsetas?\b|emergencia/.test(t),box:/^pupitre encendido pero no rearma/,fuera:/^pupitre · joystick/},
 {q:t=>/puerta de servicio|ss-?b15/.test(t),box:/^puerta de servicio abierta/,fuera:t=>/luz|luces|ilumin|luce|alumbr/.test(t)?null:/^iluminacion/},
 /* bumpers: 2 grupos × 2 (brazo C-B27/C-B28 · cabina C-B29/C-B30), puente en el bornero del pupitre */
 {q:t=>/bumper|parachoq/.test(t)&&!/\bala\b|a380/.test(t),box:/^bumpers brazo y cabina/,fuera:/^zapata \/ bordes \/ bumpers/},
 /* PCA que no enfría / poco caudal → ventilador interior, variador o filtro del equipo */
 {q:t=>/no enfria|enfria poco|poco aire|no sale aire|caudal|no climatiza/.test(t),box:/^fallo ventilador interior|^filtro sucio/},
 /* aire acondicionado de la pasarela (PCA / AAA): no son las lunetas ni el suelo térmico de la cabina */
 {q:t=>/\bpca\b|aire acondicionado|\badx\b|\baaa\b|\ba\/a\b|climatizador/.test(t),fuera:/^climatizacion ·/},
 /* sin bloqueo, carro, puerta o tapa no hay caja de bloqueo del carro (p. ej. «PCA no enfría») */
 {q:t=>!/bloque|carr(o|ito)|puerta|tapa|interbloq/.test(t),fuera:/carro de aire|^bloqueo carro|^bloqueada por equipos|^interbloqueo con la pasarela/}];
const activas=t=>REG.filter(R=>{try{return R.q(t)}catch(e){return false}});
const fueraDe=(R,t)=>typeof R.fuera=="function"?R.fuera(t):R.fuera;
/* ajuste de la puntuación de una caja de la guía para el texto t (lupa / SOS) */
window.conceptoAjusta=function(s,t,r){const nt=nrm(s&&s.t).replace(/^[^a-z0-9]+/,"");t=nrm(t);
 for(const R of activas(t)){const f=fueraDe(R,t);if(f&&f.test(nt))return 0;if(R.box&&R.box.test(nt))r=Math.max(r,0)+60}return r};
window.conceptosActivos=t=>activas(nrm(t)).map(R=>String(R.box||R.fuera));

/* ---------- Análisis de OT / guía de la OT: misma prioridad ---------- */
if(typeof anaOT=="function"){const o=anaOT;window.anaOT=anaOT=function(i){const r=o.apply(this,arguments);try{
  if(!r||r.tipo!="PAS"||!i||!r.guia)return r;const t=nrm([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "));const A=activas(t);if(!A.length)return r;
  const tit=g=>nrm((PAS.s[g.si]&&PAS.s[g.si].t)||g.t||"");
  A.forEach(R=>{const f=fueraDe(R,t);if(f)r.guia=r.guia.filter(g=>!f.test(tit(g)));
   if(R.box){const si=PAS.s.findIndex(x=>R.box.test(nrm(x.t)));if(si>=0)r.guia=[{si,t:PAS.s[si].t,sc:99}].concat(r.guia.filter(g=>g.si!=si))}});
  r.guia=r.guia.slice(0,4)}catch(e){}return r}}
})();
