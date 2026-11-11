/* ===== v407: «Antiatrapamiento izquierdo/derecho de túnel interior activado» (memorizado, PBB 546 · OT 600520 · 11/11/2026)
   Significa que ha entrado el FC del antiatrapamiento del túnel interior (rev. J: IT-S3'' izquierdo → hilo 743 → E-A9 5.1 ·
   IT-S3' derecho → hilo 744 → E-A9 6.1). Tres causas, por orden:
   1) Inductivos de límite de TRABAJO de extensión-retracción (ET-B6 / ET-B7 → E-A2 4.1 / 3.4) desajustados o averiados:
      al final del recorrido no marcan el límite de trabajo y entra el FC de seguridad (la más habitual).
   2) Barra de antiatrapamiento pulsada por seguridad o intencionadamente.
   3) Relacionada con las dos: el antiatrapamiento golpea la caja del aire acondicionado AAC al llegar y activa el FC porque
      los inductivos no han leído bien.
   Solución dada: adelantar el soporte guía de inductivos del lateral IZQUIERDO del túnel A exterior para que el antiatrapamiento
   interior quede distanciado al llegar al límite de trabajo y no golpee el cajón del AAC.
   Pruebas finales: mover la PBB en EXT y en RET todo el recorrido de trabajo y comprobar que la Magelis / display marca el límite.
   · Caja nueva en la guía PAS (⭐ actuación más eficaz) que el análisis pone la primera en estas OT.
   · La caja general «Antiatrapamiento túnel activado» enlaza con estas causas (golpe con la caja del AAC en el túnel interior). ===== */
(function(){
if(typeof GUIA=="undefined"||!GUIA.tipos||!GUIA.tipos.PAS)return;
const PAS=GUIA.tipos.PAS;
const T="Antiatrapamiento túnel interior activado · límite de trabajo EXT/RET o caja del AAC";
const SI=PAS.s.push({t:T,ef:1,g:[41,58,69],
 a:"El FC del antiatrapamiento es una protección de personas. Antes de mover, comprobar que no hay nadie ni nada atrapado entre túneles. Moverse solo en MANUAL, despacio y con compañero vigilando.",
 p:[
 "QUÉ SIGNIFICA · «Antiatrapamiento izquierdo / derecho de túnel interior activado» = ha entrado el FC del antiatrapamiento del túnel interior. Izquierdo: IT-S3''(SUP/INF) → hilo 743 → E-A9 5.1 (módulo 3, LED 1). Derecho: IT-S3'(SUP/INF) → hilo 744 → E-A9 6.1 (módulo 3, LED 2). El LED apagado indica el lado.",
 "CAUSA 1 (la más habitual) · Inductivos de LÍMITE DE TRABAJO de extensión-retracción ET-B6 / ET-B7 (E-A2 4.1 y 3.4, folio 58) desajustados o averiados: al llegar al final del recorrido no marcan el límite de trabajo, el túnel sigue y entra el FC de seguridad del antiatrapamiento.",
 "CAUSA 2 · Barra de antiatrapamiento pulsada por seguridad (algo o alguien entre túneles) o intencionadamente. Inspeccionar la barra y el rodillo/palanca del FC: debe volver libre.",
 "CAUSA 3 (relacionada con las anteriores) · El antiatrapamiento golpea la CAJA DEL AIRE ACONDICIONADO AAC al llegar al final y activa el FC porque los inductivos no han hecho buena lectura. Buscar marcas de golpe en la barra y en el cajón del AAC.",
 "1º · Liberar el FC: retirar lo que lo pulse y comprobar que se enciende otra vez el LED del lado en E-A9. Resetear desde el pupitre y CP-S16 REMOTO → LOCAL → REMOTO.",
 "2º · Mover en MANUAL hacia el final de EXT y de RET mirando la Magelis / display y los LED de E-A2 4.1 (ET-B6) y 3.4 (ET-B7): cada inductivo debe cambiar al pasar por su leva ANTES de que la barra llegue al FC o al cajón del AAC. Si no cambia: distancia inductivo–leva, soporte movido o inductivo averiado.",
 "3º · SOLUCIÓN APLICADA (PBB 546, OT 600520): ADELANTAR EL SOPORTE GUÍA DE INDUCTIVOS situado en el lateral IZQUIERDO del túnel A exterior, para que el límite de trabajo se marque antes y el antiatrapamiento interior quede distanciado del cajón del AAC sin golpearlo.",
 "4º · PRUEBAS FINALES: mover la PBB en EXT y en RET todo el recorrido de trabajo y comprobar que la Magelis o el display marcan el límite correspondiente (extensión y retracción), sin que entre el FC del antiatrapamiento (LED de E-A9 5.1 / 6.1 encendido).",
 "Si hay que trasladar la PBB antes de ajustar: puente provisional SOLO del lado activado según la caja «Antiatrapamiento túnel activado» (613 con 743 / 744), señalizado y anotado en la OT, y retirarlo al terminar el ajuste."],
 r:"Esquema general rev. J folios 41, 58, 69 · OT 600520 PBB 546 (11/11/2026)"})-1;
const RE_AT=/antiatrap|atrapamiento/;
function txt(i){const f=typeof segNorm=="function"?segNorm:(typeof gNorm=="function"?gNorm:(x=>String(x).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")));
 return f([i.desc,i.def,i.com,i.obs].filter(Boolean).join(" "))}
function esAT(i){if(!i||String(i.tipo||"PAS")!="PAS")return false;const t=txt(i);if(!RE_AT.test(t))return false;return /interior|tunel a\b|a-b\b/.test(t)||!/\bmedio\b|tunel b\b|b-c\b/.test(t)}
window.esAntiatrapInterior=esAT;
if(typeof anaOT=="function"){const o=anaOT;anaOT=function(i){const r=o(i);if(!r||r._ati||!esAT(i)||r.tipo!="PAS")return r;r._ati=1;
 /* solo cajas del antiatrapamiento (sin añadir sistemas no relacionados, p. ej. iluminación del túnel) */
 r.guia=[{si:SI,t:T,sc:99}].concat((r.guia||[]).filter(g=>g.si!=SI&&/antiatrap|seguridad|rearme|l[ií]mite|extensi/i.test(PAS.s[g.si]&&PAS.s[g.si].t||g.t||""))).slice(0,4);
 const add=["IT-S3","ET-B6","ET-B7"];r.elem=(r.elem||[]).concat(add.filter(t=>!(r.elem||[]).includes(t)));
 if(r.mods&&!r.mods.includes("E-A2"))r.mods.push("E-A2");return r}}
/* La caja general: el golpe con la caja del AAC es en el túnel interior, con la causa y la solución memorizadas */
const G=PAS.s.find(x=>/^Antiatrapamiento túnel activado/.test(x.t));
if(G&&G.p){G.p=G.p.map(x=>x.replace("Si sigue activado el antiatrapamiento del túnel B por golpeo en la caja del aire acondicionado de cabina",
  "Si sigue activado el antiatrapamiento del túnel interior por golpeo en la caja del aire acondicionado AAC (inductivos de límite de trabajo EXT/RET que no leen bien; ver caja «"+T+"»)"));
 const k=G.p.findIndex(x=>/^PRIORIDAD 1 · Resetear/.test(x));
 if(k>=0&&!G.p.some(x=>/inductivos de l[ií]mite de trabajo/i.test(x)&&/^PRIORIDAD 1/.test(x)))G.p.splice(k,0,"PRIORIDAD 1 · Túnel interior: la causa más habitual es que los inductivos de límite de trabajo de extensión-retracción (ET-B6 / ET-B7) no marcan el límite al final del recorrido y entra el FC; o que la barra golpea la caja del AAC. Ver la caja «"+T+"» (ajuste del soporte guía de inductivos y pruebas EXT/RET).")}
})();
