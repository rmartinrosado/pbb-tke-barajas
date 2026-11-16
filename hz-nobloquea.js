/* ===== v513: OT HZ «No bloquea la pasarela» (PBB 532 · OT 610300, 16/11/2026) =====
   La PBB tiene que quedar BLOQUEADA (sin traslación) mientras el 400 Hz está en uso. Cotejo con el ESQUEMA GENERAL rev. J:
    · Manguera fuera del recogedor → contacto «-400HZ» 13-14 → P-X92:18 (hilo 3383) → P-A5 DIN02 IN 2.1 (folio 85).
    · Conector al 90 % → contacto libre de potencial en el CBTH (CBTH-X61:10-15) → ECBTH-W cond. 15 → E-X61:15 (hilo 18) → E-A2 DIN11 IN 5.4 (folio 59).
    · Convertidor en servicio → CBTH-X61:10-14 → ECBTH-W cond. 14 → E-X61:14 (hilo 20) → E-A2 DIN10 IN 6.1 (folio 59).
    · Desbloqueo de PAS en el AO (BYPASS) → CBTH-X61:10-13 → ECBTH-W cond. 13 → E-X61:13 (hilo 21) → E-A3 DIN02 IN 2.1 (folio 60):
      con el bypass activo la PBB NO se bloquea → es la causa más probable si el selector del AO quedó en desbloqueo o su contacto está pegado.
    · Común +24 V de todos: hilo 189 · E-X55:1 → E-X61:10 → CBTH-X61:10.
   Sin programa del PLC: la lógica (qué LED bloquea) se deduce de los nombres de las entradas del esquema.
   Se añade a la guía de campo HZ (tras «PBB bloqueada por manguera 400 Hz extendida»), sube la primera en el análisis de las OT
   que dicen «no bloquea» y sus líneas se pueden pasar a la «Actuación guiada» de la OT con el botón de la guía. ===== */
(function(){
"use strict";
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.HZ||!Array.isArray(GUIA.tipos.HZ.s))return;
const S=GUIA.tipos.HZ.s;const T="La PBB no se bloquea · no bloquea la pasarela con el 400 Hz en uso (interlock E-A2 / E-A3 / P-A5)";
if(S.some(s=>s.t==T))return;
const E={t:T,ef:1,op:1,g:[0,0,0,0,0,0,0,0,0,0,0,0,0],
 a:"Con la manguera de 400 Hz fuera del recogedor, el conector insertado al 90 % o el convertidor en servicio, la PBB tiene que quedar BLOQUEADA (no traslada). Si se mueve, puede arrastrar la manguera o arrancar el conector del avión: NO dar servicio de 400 Hz en esa posición hasta resolverlo y avisar a CGA.",
 p:[
"1º · SEGURIDAD · Avisar a CGA. Hacer las pruebas SIN avión en el puesto (o con el conector fuera del avión) y con una persona vigilando la manguera. Nunca probar el bloqueo trasladando con el conector insertado en un avión.",
"2º · ¿QUÉ CONDICIÓN NO BLOQUEA? Probar una a una e intentar trasladar desde el pupitre en cada una (debe NO trasladar): a) manguera fuera del recogedor (OUT unos metros, sin conector); b) conector al 90 % (LED amarillo 90 % encendido); c) convertidor en servicio (ON, LED rojo encendido). Anotar en la OT cuál falla.",
"3º · MÁS PROBABLE · DESBLOQUEO DE PAS EN EL AO ACTIVADO: selector del armario AO olvidado en desbloqueo o su contacto pegado → E-A3 mód. 1 LED 2 (DIN02 «BYPASS AO», borna IN 2.1, folio 60) ENCENDIDO todo el rato. Selector del AO en normal → el LED tiene que APAGARSE. Si sigue encendido → contacto del AO pegado o hilo 21 (E-X61:13) con +24 V.",
"4º · HILOS SOLTADOS O PUENTES OLVIDADOS DE OTRAS OT: comprobar que el hilo 3383 está conectado en P-A5 IN 2.1 y en P-X92:18 (en la OT de manguera extendida se suelta como último recurso) y que no quedan puentes provisionales en P-X92, E-X61 ni CBTH-X61. Mirar las incidencias anteriores de la posición.",
"5º · FALLA CON LA MANGUERA FUERA → P-A5 mód. 1 LED 2 (DIN02 «400Hz CABLE EXTENSION», borna IN 2.1, folio 85) tiene que ENCENDERSE con la manguera fuera. Apagado → contacto «-400HZ» 13-14 del recogedor no cierra (leva o tope desajustados, contacto roto) o cable abierto.",
"MEDIR (armario del pupitre) · Polímetro en V, negra en 0 V del pupitre (P-X92:2). Manguera fuera: P-X92:8 (hilo 336) = 24 V y P-X92:18 (hilo 3383) = 24 V. Con 24 V en P-X92:8 y 0 V en P-X92:18 → contacto -400HZ abierto o cable P-X92 ↔ recogedor cortado. Sin 24 V en P-X92:8 → alimentación +24 V del pupitre.",
"6º · FALLA CON EL CONECTOR AL 90 % → E-A2 mód. 3 LED 3 (DIN11 «BLOQUEO PBB 90% CONECTOR», borna IN 5.4, folio 59) tiene que ENCENDERSE. Apagado → la señal del sistema 400 Hz no llega: contacto libre de potencial en el CBTH (CBTH-X61:10-15), manguera ECBTH-W conductor 15 o hilo 18 a E-X61:15.",
"7º · FALLA CON EL CONVERTIDOR EN SERVICIO → E-A2 mód. 3 LED 2 (DIN10 «BLOQUEO PBB CONVER. SERVICIO», borna IN 6.1, folio 59) tiene que ENCENDERSE con el convertidor en ON. Apagado → contacto CBTH-X61:10-14, manguera ECBTH-W conductor 14 o hilo 20 a E-X61:14.",
"MEDIR (armario eléctrico y CBTH) · Polímetro en V, negra en 0 V del armario E (E-X68:2). Común: E-X55:1 / E-X61:10 (hilo 189) = 24 V siempre. Con la condición activa: E-X61:15 (90 %) y E-X61:14 (convertidor) = 24 V; sin ella, 0 V. Hay 24 V en CBTH-X61:15 / 14 y 0 V en E-X61 → manguera ECBTH-W cortada o borna floja. 0 V en CBTH-X61:15 / 14 con la condición activa → el contacto del sistema 400 Hz no cierra: avisar al especialista del convertidor (OT en espera de condiciones).",
"8º · Todos los LED de bloqueo se encienden bien y la PBB sigue trasladando → fallo en el programa del PLC o en las salidas (E-A6: E-K1 variadores, E-K24 frenos de traslación). NO puentear nunca las salidas de seguridad. Dejar la OT en espera de condiciones y avisar al especialista del PLC.",
"PRUEBAS FINALES · Con cada condición (manguera fuera, conector al 90 %, convertidor en ON) su LED se enciende y la PBB NO traslada. Al quitarla, el LED se apaga y la PBB traslada. Selector del AO en normal (LED E-A3 2.1 apagado). Reponer hilos, quitar puentes y anotar en la OT la condición que fallaba y lo reparado.",
"PBB 507 (A380): su interfaz CBTH-XB2 ↔ E-X61 solo trae la seta AO (folio 21). No tiene señales de convertidor en servicio ni de 90 %: comprobar en el plano de la 507."],
 r:"ESQUEMA GENERAL rev. J folios 11, 59, 60 y 85 (E-A2 DIN10 / DIN11 · E-A3 DIN02 · P-A5 DIN02) · OPERATIVA conector HZ PDS400"};
const k=S.findIndex(s=>/bloqueada por manguera 400/i.test(s.t||""));S.splice(k>=0?k+1:S.length,0,E);
/* referencia cruzada en la caja de la manguera extendida */
if(k>=0&&Array.isArray(S[k].p)&&!S[k].p.some(x=>/no se bloquea/i.test(x)))S[k].p.push("Si con la manguera fuera, el conector al 90 % o el convertidor en servicio la PBB SÍ traslada → ver «La PBB no se bloquea · no bloquea la pasarela con el 400 Hz en uso».");
/* análisis: «no bloquea» → esta caja la primera */
const nrm=t=>String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"");
const NB=/\bno (se )?bloque|sin bloque|no queda bloque|se mueve con (el )?(conector|400|manguera|convertidor)|traslada con (el )?(conector|400|manguera)/;
if(typeof anaOT=="function"){const o=anaOT;anaOT=function(i){const r=o(i);try{if(!r||!i)return r;const t=nrm([i.desc,i.def,i.obs,i.com].filter(Boolean).join(" "));
 const hz=[i.tipo,...(i.equipos||[])].includes("HZ");if(!hz||!NB.test(t))return r;const si=S.indexOf(E);if(si<0)return r;
 const g=(r.guia||[]).filter(x=>x.si!==si&&!/bloqueada por manguera/i.test(x.t||""));r.guia=[{si,t:E.t,sc:99}].concat(g).slice(0,4)}catch(e){}return r}}
try{ANA_C={k:"",r:null}}catch(e){}
})();
